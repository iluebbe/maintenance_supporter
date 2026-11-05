/*! maintenance_supporter frontend 2.119.0 */
var s7=Object.defineProperty;var n8=Object.getOwnPropertyDescriptor;var v=(C,H,e)=>()=>{if(e)throw e[0];try{return C&&(H=C(C=0)),H}catch(t){throw e=[t],t}};var s8=(C,H)=>{for(var e in H)s7(C,e,{get:H[e],enumerable:!0})};var n=(C,H,e,t)=>{for(var r=t>1?void 0:t?n8(H,e):H,i=C.length-1,o;i>=0;i--)(o=C[i])&&(r=(t?o(H,e,r):o(r))||r);return t&&r&&s7(H,e,r),r};var b5,Z5,T3,M7,W2,l7,g,d7,E3,P3=v(()=>{b5=globalThis,Z5=b5.ShadowRoot&&(b5.ShadyCSS===void 0||b5.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,T3=Symbol(),M7=new WeakMap,W2=class{constructor(H,e,t){if(this._$cssResult$=!0,t!==T3)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=H,this.t=e}get styleSheet(){let H=this.o,e=this.t;if(Z5&&H===void 0){let t=e!==void 0&&e.length===1;t&&(H=M7.get(e)),H===void 0&&((this.o=H=new CSSStyleSheet).replaceSync(this.cssText),t&&M7.set(e,H))}return H}toString(){return this.cssText}},l7=C=>new W2(typeof C=="string"?C:C+"",void 0,T3),g=(C,...H)=>{let e=C.length===1?C[0]:H.reduce((t,r,i)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+C[i+1],C[0]);return new W2(e,C,T3)},d7=(C,H)=>{if(Z5)C.adoptedStyleSheets=H.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of H){let t=document.createElement("style"),r=b5.litNonce;r!==void 0&&t.setAttribute("nonce",r),t.textContent=e.cssText,C.appendChild(t)}},E3=Z5?C=>C:C=>C instanceof CSSStyleSheet?(H=>{let e="";for(let t of H.cssRules)e+=t.cssText;return l7(e)})(C):C});var M8,l8,d8,p8,c8,m8,y5,p7,A8,u8,U2,G2,S5,c7,x1,Q2=v(()=>{P3();P3();({is:M8,defineProperty:l8,getOwnPropertyDescriptor:d8,getOwnPropertyNames:p8,getOwnPropertySymbols:c8,getPrototypeOf:m8}=Object),y5=globalThis,p7=y5.trustedTypes,A8=p7?p7.emptyScript:"",u8=y5.reactiveElementPolyfillSupport,U2=(C,H)=>C,G2={toAttribute(C,H){switch(H){case Boolean:C=C?A8:null;break;case Object:case Array:C=C==null?C:JSON.stringify(C)}return C},fromAttribute(C,H){let e=C;switch(H){case Boolean:e=C!==null;break;case Number:e=C===null?null:Number(C);break;case Object:case Array:try{e=JSON.parse(C)}catch{e=null}}return e}},S5=(C,H)=>!M8(C,H),c7={attribute:!0,type:String,converter:G2,reflect:!1,useDefault:!1,hasChanged:S5};Symbol.metadata??=Symbol("metadata"),y5.litPropertyMetadata??=new WeakMap;x1=class extends HTMLElement{static addInitializer(H){this._$Ei(),(this.l??=[]).push(H)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(H,e=c7){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(H)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(H,e),!e.noAccessor){let t=Symbol(),r=this.getPropertyDescriptor(H,t,e);r!==void 0&&l8(this.prototype,H,r)}}static getPropertyDescriptor(H,e,t){let{get:r,set:i}=d8(this.prototype,H)??{get(){return this[e]},set(o){this[e]=o}};return{get:r,set(o){let L=r?.call(this);i?.call(this,o),this.requestUpdate(H,L,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(H){return this.elementProperties.get(H)??c7}static _$Ei(){if(this.hasOwnProperty(U2("elementProperties")))return;let H=m8(this);H.finalize(),H.l!==void 0&&(this.l=[...H.l]),this.elementProperties=new Map(H.elementProperties)}static finalize(){if(this.hasOwnProperty(U2("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(U2("properties"))){let e=this.properties,t=[...p8(e),...c8(e)];for(let r of t)this.createProperty(r,e[r])}let H=this[Symbol.metadata];if(H!==null){let e=litPropertyMetadata.get(H);if(e!==void 0)for(let[t,r]of e)this.elementProperties.set(t,r)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let r=this._$Eu(e,t);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(H){let e=[];if(Array.isArray(H)){let t=new Set(H.flat(1/0).reverse());for(let r of t)e.unshift(E3(r))}else H!==void 0&&e.push(E3(H));return e}static _$Eu(H,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof H=="string"?H.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(H=>this.enableUpdating=H),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(H=>H(this))}addController(H){(this._$EO??=new Set).add(H),this.renderRoot!==void 0&&this.isConnected&&H.hostConnected?.()}removeController(H){this._$EO?.delete(H)}_$E_(){let H=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(H.set(t,this[t]),delete this[t]);H.size>0&&(this._$Ep=H)}createRenderRoot(){let H=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return d7(H,this.constructor.elementStyles),H}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(H=>H.hostConnected?.())}enableUpdating(H){}disconnectedCallback(){this._$EO?.forEach(H=>H.hostDisconnected?.())}attributeChangedCallback(H,e,t){this._$AK(H,t)}_$ET(H,e){let t=this.constructor.elementProperties.get(H),r=this.constructor._$Eu(H,t);if(r!==void 0&&t.reflect===!0){let i=(t.converter?.toAttribute!==void 0?t.converter:G2).toAttribute(e,t.type);this._$Em=H,i==null?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null}}_$AK(H,e){let t=this.constructor,r=t._$Eh.get(H);if(r!==void 0&&this._$Em!==r){let i=t.getPropertyOptions(r),o=typeof i.converter=="function"?{fromAttribute:i.converter}:i.converter?.fromAttribute!==void 0?i.converter:G2;this._$Em=r;let L=o.fromAttribute(e,i.type);this[r]=L??this._$Ej?.get(r)??L,this._$Em=null}}requestUpdate(H,e,t,r=!1,i){if(H!==void 0){let o=this.constructor;if(r===!1&&(i=this[H]),t??=o.getPropertyOptions(H),!((t.hasChanged??S5)(i,e)||t.useDefault&&t.reflect&&i===this._$Ej?.get(H)&&!this.hasAttribute(o._$Eu(H,t))))return;this.C(H,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(H,e,{useDefault:t,reflect:r,wrapped:i},o){t&&!(this._$Ej??=new Map).has(H)&&(this._$Ej.set(H,o??e??this[H]),i!==!0||o!==void 0)||(this._$AL.has(H)||(this.hasUpdated||t||(e=void 0),this._$AL.set(H,e)),r===!0&&this._$Em!==H&&(this._$Eq??=new Set).add(H))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let H=this.scheduleUpdate();return H!=null&&await H,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[r,i]of this._$Ep)this[r]=i;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[r,i]of t){let{wrapped:o}=i,L=this[r];o!==!0||this._$AL.has(r)||L===void 0||this.C(r,void 0,i,L)}}let H=!1,e=this._$AL;try{H=this.shouldUpdate(e),H?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw H=!1,this._$EM(),t}H&&this._$AE(e)}willUpdate(H){}_$AE(H){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(H)),this.updated(H)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(H){return!0}update(H){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(H){}firstUpdated(H){}};x1.elementStyles=[],x1.shadowRootOptions={mode:"open"},x1[U2("elementProperties")]=new Map,x1[U2("finalized")]=new Map,u8?.({ReactiveElement:x1}),(y5.reactiveElementVersions??=[]).push("2.1.2")});function b7(C,H){if(!D3(C)||!C.hasOwnProperty("raw"))throw Error("invalid template strings array");return A7!==void 0?A7.createHTML(H):H}function e2(C,H,e=C,t){if(H===r1)return H;let r=t!==void 0?e._$Co?.[t]:e._$Cl,i=X2(H)?void 0:H._$litDirective$;return r?.constructor!==i&&(r?._$AO?.(!1),i===void 0?r=void 0:(r=new i(C),r._$AT(C,e,t)),t!==void 0?(e._$Co??=[])[t]=r:e._$Cl=r),r!==void 0&&(H=e2(C,r._$AS(C,H.values),r,t)),H}var B3,m7,k5,A7,I3,_1,F3,v8,J1,Y2,X2,D3,g7,R3,K2,u7,v7,Y1,h7,x7,f7,N3,a,d2,HC,r1,s,_7,X1,Z7,J2,w5,l2,t2,O5,$5,T5,E5,y7,h8,S7,C2=v(()=>{B3=globalThis,m7=C=>C,k5=B3.trustedTypes,A7=k5?k5.createPolicy("lit-html",{createHTML:C=>C}):void 0,I3="$lit$",_1=`lit$${Math.random().toFixed(9).slice(2)}$`,F3="?"+_1,v8=`<${F3}>`,J1=document,Y2=()=>J1.createComment(""),X2=C=>C===null||typeof C!="object"&&typeof C!="function",D3=Array.isArray,g7=C=>D3(C)||typeof C?.[Symbol.iterator]=="function",R3=`[ 	
\f\r]`,K2=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,u7=/-->/g,v7=/>/g,Y1=RegExp(`>|${R3}(?:([^\\s"'>=/]+)(${R3}*=${R3}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),h7=/'/g,x7=/"/g,f7=/^(?:script|style|textarea|title)$/i,N3=C=>(H,...e)=>({_$litType$:C,strings:H,values:e}),a=N3(1),d2=N3(2),HC=N3(3),r1=Symbol.for("lit-noChange"),s=Symbol.for("lit-nothing"),_7=new WeakMap,X1=J1.createTreeWalker(J1,129);Z7=(C,H)=>{let e=C.length-1,t=[],r,i=H===2?"<svg>":H===3?"<math>":"",o=K2;for(let L=0;L<e;L++){let M=C[L],d,p,m=-1,A=0;for(;A<M.length&&(o.lastIndex=A,p=o.exec(M),p!==null);)A=o.lastIndex,o===K2?p[1]==="!--"?o=u7:p[1]!==void 0?o=v7:p[2]!==void 0?(f7.test(p[2])&&(r=RegExp("</"+p[2],"g")),o=Y1):p[3]!==void 0&&(o=Y1):o===Y1?p[0]===">"?(o=r??K2,m=-1):p[1]===void 0?m=-2:(m=o.lastIndex-p[2].length,d=p[1],o=p[3]===void 0?Y1:p[3]==='"'?x7:h7):o===x7||o===h7?o=Y1:o===u7||o===v7?o=K2:(o=Y1,r=void 0);let x=o===Y1&&C[L+1].startsWith("/>")?" ":"";i+=o===K2?M+v8:m>=0?(t.push(d),M.slice(0,m)+I3+M.slice(m)+_1+x):M+_1+(m===-2?L:x)}return[b7(C,i+(C[e]||"<?>")+(H===2?"</svg>":H===3?"</math>":"")),t]},J2=class C{constructor({strings:H,_$litType$:e},t){let r;this.parts=[];let i=0,o=0,L=H.length-1,M=this.parts,[d,p]=Z7(H,e);if(this.el=C.createElement(d,t),X1.currentNode=this.el.content,e===2||e===3){let m=this.el.content.firstChild;m.replaceWith(...m.childNodes)}for(;(r=X1.nextNode())!==null&&M.length<L;){if(r.nodeType===1){if(r.hasAttributes())for(let m of r.getAttributeNames())if(m.endsWith(I3)){let A=p[o++],x=r.getAttribute(m).split(_1),y=/([.?@])?(.*)/.exec(A);M.push({type:1,index:i,name:y[2],strings:x,ctor:y[1]==="."?O5:y[1]==="?"?$5:y[1]==="@"?T5:t2}),r.removeAttribute(m)}else m.startsWith(_1)&&(M.push({type:6,index:i}),r.removeAttribute(m));if(f7.test(r.tagName)){let m=r.textContent.split(_1),A=m.length-1;if(A>0){r.textContent=k5?k5.emptyScript:"";for(let x=0;x<A;x++)r.append(m[x],Y2()),X1.nextNode(),M.push({type:2,index:++i});r.append(m[A],Y2())}}}else if(r.nodeType===8)if(r.data===F3)M.push({type:2,index:i});else{let m=-1;for(;(m=r.data.indexOf(_1,m+1))!==-1;)M.push({type:7,index:i}),m+=_1.length-1}i++}}static createElement(H,e){let t=J1.createElement("template");return t.innerHTML=H,t}};w5=class{constructor(H,e){this._$AV=[],this._$AN=void 0,this._$AD=H,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(H){let{el:{content:e},parts:t}=this._$AD,r=(H?.creationScope??J1).importNode(e,!0);X1.currentNode=r;let i=X1.nextNode(),o=0,L=0,M=t[0];for(;M!==void 0;){if(o===M.index){let d;M.type===2?d=new l2(i,i.nextSibling,this,H):M.type===1?d=new M.ctor(i,M.name,M.strings,this,H):M.type===6&&(d=new E5(i,this,H)),this._$AV.push(d),M=t[++L]}o!==M?.index&&(i=X1.nextNode(),o++)}return X1.currentNode=J1,r}p(H){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(H,t,e),e+=t.strings.length-2):t._$AI(H[e])),e++}},l2=class C{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(H,e,t,r){this.type=2,this._$AH=s,this._$AN=void 0,this._$AA=H,this._$AB=e,this._$AM=t,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let H=this._$AA.parentNode,e=this._$AM;return e!==void 0&&H?.nodeType===11&&(H=e.parentNode),H}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(H,e=this){H=e2(this,H,e),X2(H)?H===s||H==null||H===""?(this._$AH!==s&&this._$AR(),this._$AH=s):H!==this._$AH&&H!==r1&&this._(H):H._$litType$!==void 0?this.$(H):H.nodeType!==void 0?this.T(H):g7(H)?this.k(H):this._(H)}O(H){return this._$AA.parentNode.insertBefore(H,this._$AB)}T(H){this._$AH!==H&&(this._$AR(),this._$AH=this.O(H))}_(H){this._$AH!==s&&X2(this._$AH)?this._$AA.nextSibling.data=H:this.T(J1.createTextNode(H)),this._$AH=H}$(H){let{values:e,_$litType$:t}=H,r=typeof t=="number"?this._$AC(H):(t.el===void 0&&(t.el=J2.createElement(b7(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===r)this._$AH.p(e);else{let i=new w5(r,this),o=i.u(this.options);i.p(e),this.T(o),this._$AH=i}}_$AC(H){let e=_7.get(H.strings);return e===void 0&&_7.set(H.strings,e=new J2(H)),e}k(H){D3(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,r=0;for(let i of H)r===e.length?e.push(t=new C(this.O(Y2()),this.O(Y2()),this,this.options)):t=e[r],t._$AI(i),r++;r<e.length&&(this._$AR(t&&t._$AB.nextSibling,r),e.length=r)}_$AR(H=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);H!==this._$AB;){let t=m7(H).nextSibling;m7(H).remove(),H=t}}setConnected(H){this._$AM===void 0&&(this._$Cv=H,this._$AP?.(H))}},t2=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(H,e,t,r,i){this.type=1,this._$AH=s,this._$AN=void 0,this.element=H,this.name=e,this._$AM=r,this.options=i,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=s}_$AI(H,e=this,t,r){let i=this.strings,o=!1;if(i===void 0)H=e2(this,H,e,0),o=!X2(H)||H!==this._$AH&&H!==r1,o&&(this._$AH=H);else{let L=H,M,d;for(H=i[0],M=0;M<i.length-1;M++)d=e2(this,L[t+M],e,M),d===r1&&(d=this._$AH[M]),o||=!X2(d)||d!==this._$AH[M],d===s?H=s:H!==s&&(H+=(d??"")+i[M+1]),this._$AH[M]=d}o&&!r&&this.j(H)}j(H){H===s?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,H??"")}},O5=class extends t2{constructor(){super(...arguments),this.type=3}j(H){this.element[this.name]=H===s?void 0:H}},$5=class extends t2{constructor(){super(...arguments),this.type=4}j(H){this.element.toggleAttribute(this.name,!!H&&H!==s)}},T5=class extends t2{constructor(H,e,t,r,i){super(H,e,t,r,i),this.type=5}_$AI(H,e=this){if((H=e2(this,H,e,0)??s)===r1)return;let t=this._$AH,r=H===s&&t!==s||H.capture!==t.capture||H.once!==t.once||H.passive!==t.passive,i=H!==s&&(t===s||r);r&&this.element.removeEventListener(this.name,this,t),i&&this.element.addEventListener(this.name,this,H),this._$AH=H}handleEvent(H){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,H):this._$AH.handleEvent(H)}},E5=class{constructor(H,e,t){this.element=H,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(H){e2(this,H)}},y7={M:I3,P:_1,A:F3,C:1,L:Z7,R:w5,D:g7,V:e2,I:l2,H:t2,N:$5,U:T5,B:O5,F:E5},h8=B3.litHtmlPolyfillSupport;h8?.(J2,l2),(B3.litHtmlVersions??=[]).push("3.3.3");S7=(C,H,e)=>{let t=e?.renderBefore??H,r=t._$litPart$;if(r===void 0){let i=e?.renderBefore??null;t._$litPart$=r=new l2(H.insertBefore(Y2(),i),i,void 0,e??{})}return r._$AI(C),r}});var j3,Z,x8,k7=v(()=>{Q2();Q2();C2();C2();j3=globalThis,Z=class extends x1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let H=super.createRenderRoot();return this.renderOptions.renderBefore??=H.firstChild,H}update(H){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(H),this._$Do=S7(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return r1}};Z._$litElement$=!0,Z.finalized=!0,j3.litElementHydrateSupport?.({LitElement:Z});x8=j3.litElementPolyfillSupport;x8?.({LitElement:Z});(j3.litElementVersions??=[]).push("4.2.2")});var w7=v(()=>{});var k=v(()=>{Q2();C2();k7();w7()});var E7,T7=v(()=>{E7={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",updated:"Updated",trigger_removed:"Trigger removed",ok:"OK",all:"All",new_object:"+ New Object",templates_from:"From template",templates_title:"Start from a template",templates_task_count:"{n} tasks",templates_task_count_one:"1 task",template_updates_banner:"The template \u201C{template}\u201D has {n} changes for this object",template_updates_banner_one:"The template \u201C{template}\u201D has a change for this object",template_updates_review:"Review",template_updates_title:"Changes from the template",template_updates_hint:"The template has changed since this object was made from it. Ticked changes are taken over; the others stay as they are and are not offered again. History, completions and photos are never touched.",template_updates_conflict:"You changed this too",template_updates_new_tasks:"New tasks in the template",template_updates_later:"Later",template_updates_done:"Taken over from the template",template_updates_no_notes:"No notes",template_created:"Created from template",onboard_hint:"Add your first object to start tracking maintenance.",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",task_moved:"Task moved",move_task_target:"Target object",move_task_message:"Choose the object this task should belong to. Its history, readings and trigger state move with it; it gets a new reference number and its entities are recreated under the new object. Linked documents stay with the current object.",bulk_move_message:"Choose the object the selected tasks should belong to. Tasks that already live there are skipped; history, readings and trigger state move along.",bulk_moved:"{n} tasks moved",more_actions:"More actions",back:"Back",quantity:"Quantity",spare_part:"Spare part",move_task_title:"Move task",move_task:"Move to another object\u2026",object_duplicated:"Object duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",missed:"Missed",reset:"Reset",snooze:"Snooze",snoozed:"Snoozed",snoozed_for:"Reminders muted for {hours} hours \u2014 until {until}",snoozed_for_one:"Reminders muted for one hour \u2014 until {until}",cancel:"Cancel",bulk_select:"Select",bulk_select_all:"Select all",bulk_n_selected:"{n} selected",bulk_completed:"{n} tasks completed",bulk_archived:"{n} tasks archived",bulk_delete_objects_confirm:"Delete {n} objects and all their tasks? Archiving keeps their history instead.",bulk_objects_deleted:"{n} objects deleted",bulk_objects_archived:"{n} objects archived",bulk_assign:"Assign",bulk_assign_one:"One person",bulk_assign_share:"Several people, each of them",bulk_assign_rotate:"Several people, in turns",bulk_assign_hint:"Replaces who is assigned to the selected tasks \u2014 a rotation included.",bulk_rotation_min_two:"Pick at least two people.",bulk_labels_add:"Add labels",bulk_labels_remove:"Remove labels",bulk_edit_hint:"Only the ticked settings change; everything else stays as it is.",bulk_no_notifications:"No notifications for these tasks",bulk_updated:"{n} tasks updated",bulk_paused:"{n} tasks paused",bulk_resumed:"{n} tasks resumed",bulk_objects_area:"Area set for {n} objects",bulk_failed:"{n} failed: {reason}",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",last_done_days_ago:"done {n} d ago",last_done_today:"done today",no_due_date:"No due date",next_due:"Next due",kpi_reported_by_sensor:"Reported by the sensor",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",trigger_type_due_date:"Date from a sensor",runtime_hours:"Target runtime (hours)",days_before:"Days before the date",days_before_help:`For a sensor that reports when the maintenance is due (a date or timestamp). 0 = on the date itself. The device's own "done" button moves the date forward, which clears the trigger \u2014 make it the completion action.`,target_value:"Target value",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",calendar:"Calendar entity",calendar_entity_label:"Calendar",calendar_entity_hint:"Due once per event of this calendar, on the event's start date \u2014 the next event after the last completion.",calendar_entity_required:"Choose a calendar entity.",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",recurrence_last_day:"Last day of the month",recurrence_business_day:"Business days only (roll back from weekend)",recurrence_offset:"Offset (days, \xB1)",recurrence_offset_help:"Shift the date by \xB1N days, e.g. -2 = two days before.",recurrence_months_label:"Only in these months",recurrence_months_hint:"The date repeats in the selected months only; pick one month for a yearly task. None = every month.",last_day_month:"Last day of month",last_business_day_month:"Last business day",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",reading:"Reading",custom:"Custom",history:"History",cost:"Cost",cost_kind_credit:"Credit",cost_credit_hint:"Money back \u2014 a sale, a refund. It lowers the totals; the average per completion leaves it out.",report_button:"Report",report_title:"Maintenance report",report_generated:"Generated",report_times_done:"Done",report_total_cost:"Total cost",report_notes:"Notes",report_col_type:"Type",report_col_status:"Status",report_col_schedule:"Schedule",duration:"Duration",minutes_short:"min",both:"Both",trigger_val:"Trigger value",trigger_update_available:"{latest} available, {installed} installed",complete_title:"Complete: ",checklist:"Checklist",require_on_completion:"Require on completion",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",ws_err_not_found:"Not found \u2014 it may have been deleted meanwhile",ws_err_invalid_input:"Invalid input",ws_err_invalid_date:"Invalid date",ws_err_invalid_format:"Invalid format",ws_err_invalid_url:"Invalid link",ws_err_invalid_mirror_todo:"Invalid to-do list",ws_err_not_configured:"Not set up yet",ws_err_not_loaded:"Not loaded yet \u2014 try again in a moment",ws_err_limit_reached:"Limit reached",ws_err_too_many:"Too many entries",ws_err_too_large:"Too large",ws_err_not_archived:"Not archived",ws_err_invalid_target:"Invalid target",ws_err_create_failed:"Could not be created",ws_err_archived:"Archived \u2014 restore it first",ws_err_already_archived:"Already archived",ws_err_unavailable:"Currently unavailable",ws_err_unauthorized:"Not permitted for your user",ws_err_too_many_views:"Too many saved views",ws_err_replace_failed:"Replacement failed",ws_err_not_paused:"Not paused",ws_err_not_available:"Nothing available",ws_err_no_url:"No link given",ws_err_no_phases:"This task has no phases",ws_err_invalid_view:"Invalid view",ws_err_invalid_user:"Unknown user",ws_err_invalid_range:"Invalid range",ws_err_invalid_parent:"Invalid parent object",ws_err_invalid_device:"Unknown device",ws_err_empty_csv:"The CSV file is empty",ws_err_empty:"Nothing to import",ws_err_duplicate_failed:"Could not duplicate",ws_err_already_paused:"Already paused",ws_err_invalid_cursor:"Invalid phase position",ws_err_invalid_entity_slug:"Invalid entity name",ws_err_invalid_trigger_config:"Invalid trigger configuration",ws_err_no_defaults:"No quick-complete defaults set",ws_err_self_link_device:"An object cannot be linked to itself",ws_err_too_early:"Too early \u2014 this task can only be completed closer to its due date",ws_err_invalid_search_template:"The search link must be an http(s) URL containing {q}",ws_err_invalid_notify_service:"Invalid notification service format. Use 'notify.service_name' (e.g., notify.mobile_app_phone).",ws_err_notify_service_not_found:"This notification service was not found in Home Assistant. Please verify the service name.",ws_err_invalid_shopping_list_entity:"The shopping list must be a to-do entity (todo.\u2026).",ws_err_invalid_icon:"The notification icon must be an mdi: name, e.g. mdi:air-filter",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_toggle:"Due at a specific time",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",notes_markdown_hint:"Markdown is supported \u2014 **bold**, lists, [links](\u2026)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",completed_at_optional:"Completed at (optional, empty = now)",completed_at_pick:"Set date & time",completed_at_future_error:"The completion date cannot be in the future.",ha_time_zone_hint:"Time in Home Assistant's time zone ({zone})",days:"days",days_few:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",task_series_position:"{n} of {total}",task_series_skip:"Skip",task_series_save_next:"Save & next",task_section_schedule:"Schedule",task_section_trigger:"Sensor trigger",task_section_completion:"Completing it",task_section_people:"People",task_section_notifications:"Notifications",task_section_details:"Details",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",priority:"Priority",labels:"Labels",labels_placeholder:"e.g. safety, seasonal, tenant-visible",labels_help:"Comma-separated tags for filtering and reporting.",task_mirror_todo:"Mirror into to-do lists",task_mirror_todo_hint:"The task appears in these lists while it is due; checking it off there completes it here.",task_mirror_todo_default:"Default lists: {lists}",task_mirror_todo_own:"Other lists",task_mirror_todo_none:"Not on any to-do list",task_mirror_todo_max:"At most {max} lists; Maintenance Supporter's own lists are not offered.",priority_low:"Low",priority_normal:"Normal",priority_high:"High",all_priorities:"All priorities",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",earliest_completion_days:"Earliest completion (days before due)",earliest_completion_days_help:"Leave empty to allow completing any time. 0 = only on/after the due date.",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",interval_anchor_hint:"From completion date: the next due date counts from the day the task is marked done, so doing it early or late moves the schedule. From planned date: the schedule keeps its dates, for example when a bill is paid weeks before it is due.",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",object_replaces:"Replaces",object_replaced_by:"Replaced by",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",all_parts:"All parts",all_areas:"All areas",areas_filter:"Filter areas\u2026",areas_filter_none:"No area matches the filter.",area_cost_year:"Cost {year}",area_object_count:"{n} objects",area_object_count_one:"1 object",area_range_12m:"Last 12 months",area_range_all:"All time",area_task_filter:"Filter by task\u2026",area_kpi_completions:"Completions",area_kpi_total_time:"Total time",area_cost_per_month:"Cost per month",area_cost_per_year:"Cost per year",area_cost_per_object:"Cost per object",area_cost_share:"Share",area_history_section:"History (all objects)",area_report_print:"Area report (PDF)",area_report_title:"Area report",area_report_period:"Period",area_no_costs:"No costs recorded in this period.",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",trigger_equals:"Trigger when equal to (=)",trigger_not_equals:"Trigger when different from (\u2260)",for_at_least_minutes:"For at least (minutes)",safety_interval:"Safety interval (optional)",trigger_combinator:"Combine trigger and interval",trigger_combinator_any:"Trigger or interval (whichever first)",trigger_combinator_all:"Trigger and interval (both required)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",adaptive_prediction_enabled:"Enable sensor-driven predictions",adaptive_seasonal_enabled:"Enable seasonal awareness",adaptive_max_interval:"Maximum interval (days)",adaptive_min_interval:"Minimum interval (days)",adaptive_ewa_alpha:"Learning rate (alpha)",adaptive_enabled:"Enable adaptive scheduling",adaptive_section_title:"Adaptive Scheduling",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",task_shared_with:"Shared with",task_shared_with_help:"Without a responsible person, the task is meant for each of them: everyone gets its reminders and finds it under My Tasks. With a rotation, they take turns.",task_shared_responsible_wins:"Someone is responsible, so the task is meant for them alone. Clear Responsible User to share it.",rotation_strategy:"Rotation",rotation_none:"No rotation",rotation_round_robin:"Round-robin",rotation_least_completed:"Least completed",rotation_random:"Random",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_every_n_days:"every {n} days",cal_every_day:"every day",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",hide_outliers:"Hide outliers (sensor glitches)",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",clear:"Clear",date_type_toggle:"Type the date",date_type_invalid:"Not a valid date \u2014 try 1978-03-15, a year like 1978, or your own date format",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",sensor_prediction_urgency_one:"Sensor predicts threshold in ~{days} day",sensor_prediction_urgency_few:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",subsave_warning:"Saved, but one setting was rejected: {detail}",qr_print:"Print",qr_download:"Download SVG",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_action_quick_complete:"Quick-complete \u2014 no dialog",qr_quick_complete_off:"Quick complete is off for this task. Turn it on in the task: Completing it \u2192 Quick complete.",qr_quick_records:"Records: {values}",qr_quick_records_nothing:"Records the completion only",qr_print_quick_off:"Quick-complete codes need tasks with quick complete on (task \u2192 Completing it \u2192 Quick complete). None of the chosen objects' tasks has it.",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",strat_this_month:"This Month",strat_later:"Later",strat_week:"Week",strat_fortnight:"Fortnight",strat_month:"Month",strat_year:"Year",strat_other:"Other",strat_status:"Status",strat_empty_title:"No maintenance objects yet",strat_empty_content:"Open the Maintenance panel to add your first object \u2014 pool pump, HVAC filter, vehicle, anything that needs scheduled care.",strat_open_panel:"Open Maintenance panel",strat_add_object:"Add object",strat_not_loaded:"**Maintenance Supporter** is not loaded. Install/enable the integration first.",strat_group_by:"Group views by",strat_group_area:"By area (default)",strat_group_status:"By status (Overdue / Triggered / Due Soon / OK)",strat_group_floor:"By floor (uses HA floors)",strat_group_due_date:"By due date (Overdue / Today / Week / Month / Later)",strat_group_calendar:"Rolling calendar (Week / Fortnight / Month / Year)",strat_editor_help:'The "Overview" view is always first. Empty groups are skipped.',picker_name_calendar:"Maintenance Supporter \u2014 Calendar",picker_name_panel:"Maintenance Supporter \u2014 Panel",picker_name_budget:"Maintenance Supporter \u2014 Budget",picker_name_groups:"Maintenance Supporter \u2014 Groups",picker_name_vacation:"Maintenance Supporter \u2014 Vacation",picker_name_battery_fleet:"Battery Fleet",picker_name_section:"Maintenance Supporter \u2014 Section",picker_name_vacation_status:"Maintenance Supporter \u2014 Vacation Status",picker_name_budget_status:"Maintenance Supporter \u2014 Budget Status",picker_desc_card:"Overview of your maintenance tasks with quick actions.",picker_desc_calendar:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",picker_desc_panel:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",picker_desc_budget:"Edit the monthly and yearly budget right on the dashboard.",picker_desc_groups:"Create, rename and delete task groups right on the dashboard.",picker_desc_vacation:"Switch vacation mode on or off and set its dates right on the dashboard.",picker_desc_battery_fleet:"All tracked batteries: what is low now, what runs out soon, and what to buy.",picker_desc_dashboard:"Auto-generated dashboard. Group views by area, status, floor, or due date \u2014 picked from the strategy editor or YAML.",picker_desc_section:"Embed maintenance tasks (filterable by area, status, due date) as a section in any dashboard view.",picker_desc_vacation_status:"Compact vacation-mode status banner. Tap to open settings in the panel.",picker_desc_budget_status:"Monthly + yearly maintenance budget overview. Tap for details.",picker_desc_groups_status:"List of configured task groups with member counts.",hist_note_button:"Completed from dashboard button",hist_note_todo:"Completed from the To-do list",hist_note_voice:"Completed by voice",hist_note_notification:"Completed from the notification",hist_note_nfc:"Completed via NFC tag",hist_note_shopping_list:"Completed from the shopping list",hist_note_todo_mirror:"Completed from a mirrored to-do list",hist_note_skipped_notification:"Skipped from notification",hist_note_skipped_button:"Skipped from dashboard button",hist_note_sensor_triggered:"Sensor trigger activated",hist_note_initial:"Initial value set during task creation",hist_note_auto_recovered:"Auto-completed: sensor recovered ({value})",hist_note_auto_entity:"Auto-completed: {entity} changed to {state}",hist_note_auto_recovered_plain:"Auto-completed: sensor recovered",hist_note_reset:"Reset to {date}",hist_note_trigger_replaced:"Trigger entity replaced: {old} \u2192 {new}",hist_note_template_updated:"From the template: {fields}",hist_note_trigger_removed:"Sensor trigger removed (entity was: {entity}). Schedule converted to {schedule}.",hist_note_compound_removed:"Entity {entity} removed from compound trigger; {count} conditions remain.",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_simple_preset:"Set up as a simple list",card_simple_preset_help:"Compact rows, an open circle to tick off, no create buttons or document chips, the person before the task. Each option stays changeable.",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_show_create:"Show create buttons",card_action_style:"Complete button style",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_areas:"Filter by areas",card_filter_areas_help:"Empty = show all areas.",card_filter_priority_help:"Empty = show all priorities. Tasks without an explicit priority count as Normal.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",place_optional:"Place (zone, optional)",remind_on_site:"Remind only while somebody is there",remind_on_site_hint:"Reminders wait until somebody is in this zone. Whoever arrives there gets a message with what is due.",place_missing:"Zone not found: reminders as at home",place_home:"Home",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_delete_entry:"Delete entry",history_delete_confirm_entry:"Delete this history entry? The task's last-performed date falls back to the previous completion; photos stay with the object.",history_delete_returns_parts:"The parts it used go back to stock: {parts}.",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",notify_icon:"Notification icon",notify_icon_hint:"Shown by the Companion app on Android. Empty = the icon of this task's maintenance type ({default}).",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",tab_today:"Today",palette_placeholder:"Search objects, tasks, spare parts, documents, notes\u2026",palette_no_results:"No matches",palette_hint:"\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close \xB7 / opens the search anywhere",search_open:"Search",search_group_parts:"Spare parts",search_group_content:"In documents",search_group_history:"History notes",search_page:"Page {page}",search_empty_hint:"Type to search objects, tasks, spare parts, documents and notes",search_searching:"Searching documents and notes\u2026",search_index_status:"Full-text search: {indexed} of {total} files indexed \xB7 {no_text} without text layer \xB7 {pending} pending",today_all_caught_up:"All caught up! Nothing due this week.",today_overdue:"Overdue",today_due_today:"Due today",today_this_week:"This week",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_consumable_threshold:"Consumable low threshold (%)",settings_battery_low_percent:"Battery low threshold (%)",settings_battery_recovered_percent:"Battery counts as replaced above (%)",settings_battery_recovered_percent_hint:"A low battery stays counted as low until its level rises above this value or a replacement is recorded \u2014 so a level hovering around the low threshold cannot complete the fleet task again and again.",settings_battery_low_delay:"Battery counts as low after (minutes)",settings_battery_low_delay_hint:"A battery must read low this long before it counts as low, so a sensor that reports a very low level for a moment and recovers by itself does not put it on the list. 0 = at once.",settings_battery_auto_record:"Record a replacement automatically when a low battery recovers",settings_battery_auto_record_hint:"When a battery that was low rises above the recovery threshold, the replacement date is recorded in Battery Notes and the spare cells are taken from stock \u2014 no tap needed.",settings_battery_lifetimes:"Typical battery lifetimes",settings_battery_lifetimes_hint:'Only used for batteries without a percentage: a Battery Notes note that has just a type and a last-replaced date, or a sensor that only reports "low". Their due date is last replaced + this lifetime. Batteries that report a level get their forecast from the measured discharge instead. Once the fleet has seen three replacements of a type, the median interval takes over from the built-in value \u2014 your own value always wins.',settings_battery_lifetime_months:"months",settings_battery_lifetime_reset:"Use default",settings_battery_lifetime_in_fleet:"in your fleet",settings_battery_lifetime_learned_models:"Learned per model: {list}",settings_thresholds_hint:"Defaults for new Suggested setups (percent-remaining consumables) and for fleet batteries without their own Battery Notes threshold. Existing tasks keep their value.",settings_part_search_url:"Shopping search link",settings_part_search_url_hint:"URL with {q} in place of the search terms, used for parts without a product link. Leave empty for the automatic store (by country, then by language).",settings_value_out_of_range:"Value must be between {min} and {max}",bn_summary:"{name}: {pct} % for {n} batteries",bn_floor_decides:"Your {floor} % floor decides for all of them; the higher of the two thresholds counts per battery.",bn_above_floor:"That is above your {floor} % floor, so {name} decides for all noted batteries.",bn_overrides:"{n} devices with their own threshold:",bn_more:"+ {n} more",settings_row_actions:"Task row actions",settings_ref_numbers_in_lists:"Reference numbers in lists",settings_ref_numbers_in_lists_hint:"Show the #8 / #8.3 chips in front of object and task names in the Today list, the task table, the object cards and the objects table.",settings_compact_refs:"Compact reference numbers",settings_compact_refs_hint:"Renumbers all objects, tasks and completions in order (1, 2, 3 \u2026) and closes the gaps left by deletions. Numbers already printed on service booklets, photos or notes will no longer match.",settings_compact_refs_confirm:"Renumber every object, task and completion sequentially in creation order? Numbers already written on printed service booklets, photos or notes will no longer match. This cannot be undone.",settings_compact_refs_done:"Renumbered {objects} objects, {tasks} tasks and {completions} completions.",row_actions_buttons_compact:"Buttons (icons only on phones)",row_actions_buttons:"Buttons with text",row_actions_icons:"Icons (classic)",row_actions_follow:"Follow the household setting",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",settings_shopping_list:"Shopping list (buy tasks)",settings_shopping_list_help:"Low-part buy reminders appear in this to-do list; checking one off restocks the part.",shopping_list_none:"Off \u2014 no shopping list",settings_mirror_todo_default:"Default to-do lists for tasks",settings_mirror_todo_default_help:"While a task is due, it appears on the lists ticked here, unless the task picks its own lists or none. Checking it off there completes the task. A list that takes a due date gets the task's.",settings_mirror_todo_default_none:"No to-do lists in Home Assistant yet.",settings_install_assist_sentences:"Install Assist sentences",settings_install_assist_sentences_hint:"Copies the voice sentences into your configuration so the classic Assist agent recognises them. A file you edited yourself is never overwritten.",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",notify_per_person:"Per-person delivery",member_avatars:"Member avatars",member_avatars_hint:"Shown next to assigned tasks \u2014 initials in the member's colour. Defaults come from the name; set your own initials or pick a colour to tell members apart.",member_initials:"Initials",member_color:"Colour",member_avatar_reset:"Reset",notify_no_own_device:"No own device \u2014 uses the household service",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_reminder_leads:"Extra reminders (days before due)",settings_reminder_leads_hint:"Comma-separated lead times, e.g. 14, 3, 0 \u2014 one extra reminder fires on each matching day. Empty = off.",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_weekly_digest:"Weekly digest",settings_weekly_digest_hint:"A single summary notification on Monday morning when tasks are due.",settings_warranty_reminder:"Warranty expiry reminder",settings_warranty_reminder_days:"Days before expiry",settings_warranty_reminder_hint:"Notify once when an object's warranty is this many days from expiring.",settings_snooze_hours:"Snooze duration (hours)",settings_snooze_hours_hint:"How long Snooze mutes a task's reminders \u2014 from the task menu, a card, voice or the phone's Snooze button. The due date stays as it is.",settings_budget:"Budget",settings_currency:"Currency",settings_currency_decimals:"Decimal places for amounts",settings_currency_decimals_hint:"How many decimals every amount shows: KPIs, budgets, costs in lists and reports, budget alerts. 0 = whole numbers.",settings_parts_cost_mode:"Spare parts count as spending",settings_parts_cost_purchase:"When bought",settings_parts_cost_use:"When used",settings_parts_cost_mode_hint:"When bought: a buy reminder's cost counts, and the parts a job uses are shown as information. When used: every completion books the value of the parts it used, and a purchase sets the part's price instead of counting. Applies to completions from now on \u2014 history keeps how it was booked.",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_export_settings:"Export settings (JSON)",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_import_unmatched_users:"Not found on this instance: {names}. Their task assignments were removed \u2014 add people with the same names in Home Assistant and import again to keep them.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",settings_export_selection:"Limit to selected objects (optional)",settings_docs_archive:"Documents archive (with files)",settings_docs_archive_hint:"The JSON and YAML exports list your documents but not their files; CSV leaves documents out. This ZIP holds the uploaded files \u2014 restore it after importing the JSON and nothing is missing.",settings_docs_export_btn:"Download documents ZIP",settings_docs_import_btn:"Restore documents ZIP",settings_docs_import_success:"Restored: {blobs} files, {docs} documents",settings_docs_import_missing:"{n} skipped \u2014 their files were not in the ZIP",settings_docs_import_unmatched:"No object here matches {names}: their files were kept but not attached",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",groupby_object:"By object",filter_label:"Filter",user_label:"User",photo_label:"Photo",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",state_latch_help:"With 1 transition the trigger is a latch: it recovers when the entity leaves the To-state \u2014 or, with only a From-state set, when it returns to that state.",for_minutes_state_help:"0 counts every change immediately. Set minutes and the new state must hold that long first \u2014 brief flickers then neither trigger nor count.",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_ended:"Ended",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else only gets Complete, Skip, Reset, Postpone and Snooze.",settings_shared_devices:"Shared devices",settings_shared_devices_desc:"Accounts several people use, like a kitchen tablet. A completion made there is credited to whoever is on duty (the responsible person, on a rotation whose turn it is); the history notes the device.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc_v2:"Per-task HA action on complete.",feat_places:"Places",feat_places_desc:"Objects maintained at another place (a Home Assistant zone): reminders only while somebody is there, and a message on arrival.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_target_more:"This action targets more than this field shows: {targets}. That is kept as it is \u2014 choosing another entity here replaces the whole target.",on_complete_action_skip_auto:"Not when the task completes itself (its sensor recovered)",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",action_test_bad_format:"Invalid service format (expected 'domain.service')",action_test_unknown_service:'Service "{service}" is not registered in Home Assistant. Check the spelling and that the integration providing it is loaded.',action_test_domain_mismatch:`Service "{service}" only works on {domain}.* entities; entity "{entity}" is in {entity_domain}.* \u2014 pick a service that matches the entity's domain (e.g. {suggestion})`,action_test_entity_missing:'Target entity "{entity}" was not found in Home Assistant \u2014 it may have been renamed or its integration removed.',quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",completion_already_recorded:"Already recorded {seconds} s ago, not counted twice",quick_complete_label:"Quick complete",quick_complete_help:"One tap completes it, without a dialog: in the panel and on dashboard cards, with the quick-complete QR code, from a notification, a button, a to-do list or by voice.",quick_complete_values:"Prefill (optional)",quick_complete_values_help:"Entered by every completion without a dialog. The completion dialog starts with them too.",quick_complete_needs_dialog:"Asks on completion for: {fields}. A quick completion opens the dialog for it.",quick_complete_tag_hint:"Needs a tag scan: only the tag or the quick-complete QR code on the thing completes it in one go.",quick_complete_not_asked:"A quick completion does not ask for the checklist or the readings.",complete_with_details:"Complete with details\u2026",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_buy_task_confirm:"This task reminds you to buy a spare part that is running low. Deleted on its own, it comes back as long as the part stays low.",delete_buy_task_off:"Also turn off the buy reminder for this part",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",undo:"Undo",task_completed_named:"Completed: {task}",undo_done:"Completion undone",undo_done_action_ran:"Completion undone. Its completion action had already run and cannot be taken back.",undo_nothing:"Nothing to undo. Only your own last completion can be taken back, within 10 minutes.",undo_changed:"Can't undo. The task has changed since.",task_archived:"Task archived",object_archived:"Object archived",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",section_collapse:"Collapse section",section_expand:"Expand section",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 100 MB).",doc_upload_failed:"Upload failed.",docs_archive_too_large:"The archive is too large (max {max}).",docs_archive_no_manifest:"This ZIP has no manifest.json, so the restore cannot tell which document a file belongs to. Keep manifest.json next to the folders when zipping again.",completion_photos_optional:"Completion photos (optional)",completion_photos:"Completion photos",choose_photos:"Choose photos",choose_photo:"Choose photo",photos_android_hint:"The Android app hands over one photo per pick \u2014 each pick is added.",photos_limit:"Up to {max} photos per completion",history_edit_photos_hint:"Removing a photo here keeps the file in the object's documents.",uploading:"Uploading\u2026",remove:"Remove",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_not_allowed:"This link is not allowed: links that run scripts or open local files (javascript:, data:, file: \u2026) are refused.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",camera_capture_shoot:"Capture",camera_switch_lens:"Switch camera",camera_switching:"Switching camera\u2026",camera_not_answered:"This camera did not answer. Tap the switch again to try the next one, or use the file picker.",camera_diagnostics:"Details for a bug report",camera_copy:"Copy",camera_copied:"Copied",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",trigger_end:"When the state ends",trigger_end_ok:"The task goes back to OK",trigger_end_done:"Record the task as done",trigger_end_hold:"Keep the task triggered until it is done",trigger_end_hold_help:"For a state that lasts only a moment, such as a finished wash: the task stays until it is completed, by hand or by its Done when entity.",trigger_detail_attribute:"Show with the task (optional)",trigger_detail_none:"Nothing",trigger_detail_attribute_help:"While the trigger is active, the value of this attribute shows after the task's name and in its reminder: which medicine is running low, which window is open.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents",doc_description:"Description (optional)",doc_sort:"Sort documents",doc_sort_newest:"Newest first",doc_sort_oldest:"Oldest first",doc_sort_title:"By title (1, 2, 3 \u2026)",doc_sort_category:"By category",link_device_optional:"Link to existing device (optional)",parent_object_optional:"Parent object (optional)",parent_none:"(No parent)",parent_object_hint:"Shown inside the parent in the lists of objects.",sub_objects:"Sub-objects",sub_objects_count:"{n} sub-objects",sub_objects_count_one:"1 sub-object",add_sub_object:"Add sub-object",sub_object_move_here:"Move an existing object here",sub_object_move_message:"The object moves inside {name}, with everything inside it. Its tasks and history stay as they are.",sub_object_move_confirm:"Move here",sub_object_moved:"Moved inside {name}",templates_inside:"The new object goes inside {name}.",sub_objects_show:"Show sub-objects",sub_objects_hide:"Hide sub-objects",paused:"Paused",pause_object:"Pause",resume_object:"Resume",pause_task:"Pause",resume_task:"Resume",pause_task_prompt:"Freeze this task's schedule \u2014 it does not become due and does not notify until you resume it, and resuming starts a fresh cycle from that day. The object's other tasks keep running. Optionally set a date to resume by itself.",task_paused:"Task paused",task_resumed:"Task resumed \u2014 its schedule restarted",pause_until_prompt:"Freeze this object's schedules \u2014 nothing becomes due and nothing notifies until it is resumed. Optionally set an auto-resume date.",pause_until_label:"Resume on (optional)",object_paused:"Object paused",object_resumed:"Object resumed \u2014 schedules restarted",object_paused_badge:"Paused",paused_until_label:"until",replace_object:"Replace\u2026",replace_object_prompt:"Retire this object and create a successor. History and costs stay archived on the old one; tasks and documents carry over to the new one, counters start fresh.",replace_name_label:"Successor name",replace_device_heading:"Device in Home Assistant",replace_device_keep:"Same device as before ({device})",replace_device_keep_hint:"Also the choice when the new unit is not in Home Assistant yet: once it is, pick it as the object's device in its settings \u2014 the sensor triggers move along then.",replace_device_other:"The new unit is another device",replace_device_pick:"Device of the new unit",replace_device_other_hint:"Sensor triggers, completion actions and the counter reset move to the matching entities of that device.",replace_device_none:"No device",object_replaced:"Object replaced \u2014 successor created",device_swap_moved:"{count} sensor links moved to the new device.",device_swap_moved_one:"One sensor link moved to the new device.",device_swap_unmatched:"{count} could not be matched \u2014 check those tasks' sensor triggers.",device_swap_unmatched_one:"One could not be matched \u2014 check that task's sensor trigger.",reading_unit_label:"Reading unit (e.g. kWh, m\xB3)",reading_unit_help:"Shown next to the recorded value when completing this task.",reading_value_label:"Reading value",reading_label:"Reading",readings_section:"Readings",readings_hint:"Several named values per completion \u2014 one row per meter. Leave empty to record a single value.",reading_name_label:"Reading name",reading_unit_short:"Unit",reading_add:"Add reading",reading_duplicate_name:"Name already used",reading_last:"last: {value}",reading_below_last:"Lower than the last reading ({value})",settings_templates_label:"Template gallery",settings_templates_hint:`Untick templates you'll never need \u2014 they disappear from the "From template" pickers (panel and config flow). Nothing else changes; you can re-enable them any time.`,home_profile_title:"Home profile",home_profile_hint:"Recommends templates and sets seasonal windows for your climate and hemisphere. Everything is worked out locally from your floors, areas and home location.",home_type_label:"Home type",home_type_auto:"Automatic ({detected})",home_region_label:"State, province or region",home_region_none:"not found",home_region_hint:"Some rules differ within a country \u2014 a yearly vehicle inspection in one state, none in the next. Found from your home location.",home_dwelling_house:"House",home_dwelling_apartment:"Apartment",home_dwelling_unknown:"not recognised",home_detected_from:"Detected from: {reasons}",home_reason_floors:"several floors",home_reason_basement:"a basement",home_reason_garden:"a garden",home_reason_shed:"a shed",home_reason_driveway:"a driveway",home_reason_garage:"a garage",home_reason_attic:"an attic",home_reason_lawn_mower:"a lawn mower",home_reason_gate:"a gate",home_reason_balcony:"a balcony",home_reason_small_home:"few rooms on one floor",home_reason_ups:"a UPS",home_climate_label:"Climate",home_climate_value:"K\xF6ppen {koppen} \xB7 coldest month {cold} \xB0C \xB7 warmest month {warm} \xB0C",home_climate_unknown:"No home location set in Home Assistant",home_hemisphere_south:"Southern hemisphere \u2014 seasonal windows are mirrored",home_trait_freeze:"Frost in winter",home_trait_snow:"Snowy winters",home_trait_severe_winter:"Severe winters",home_trait_damp:"Damp climate",home_trait_mediterranean:"Mediterranean climate",home_trait_earthquake:"Earthquake region",home_trait_hot_summer:"Hot summers",home_trait_hot_humid:"Hot and humid",home_trait_hot_dry:"Hot and dry",home_trait_termites:"Termite region",home_trait_wildfire:"Wildfire risk",home_trait_cyclone:"Hurricane / typhoon region",home_trait_tropical:"Tropical climate",home_trait_radon:"Radon test recommended",home_reason_starter:"Basics for your home",home_reason_country:"Common in {country}",home_reason_feature:"Found in your home: {feature}",templates_recommended_title:"Recommended for your home",templates_recommended_hint:"Based on your home profile \u2014 adjust it in Settings.",templates_legal_hint:"Notes on legal duties and intervals are guidance, not legal advice. Rules vary by region and change over time \u2014 local regulations and the manufacturer's instructions take precedence.",templates_not_typical:"Not typical for your home type",templates_set_up:"Already set up",worksheet:"Work sheet",worksheet_scan_view:"Scan to open the task",worksheet_scan_complete:"Scan to complete",worksheet_manual_excerpt:"Manual excerpt",worksheet_pages:"pages",worksheet_printed:"Printed",worksheet_never:"Never",card_all_caught_up:"All caught up \u2014 nothing needs attention",postpone:"Postpone",postpone_date_prompt:"Postpone this occurrence to which date?",postpone_date_label:"New due date",postponed:"Postponed",postponed_to:"Postponed to",season_window_label:"Seasonal window (months)",season_window_hint:"Only due in the selected months; off-season dates roll to the next active month. None = all year.",series_end_label:"Ends",series_end_never:"Never (repeats indefinitely)",series_end_after_count:"After a number of times",series_end_until:"On a date",series_end_count_label:"Number of times",series_end_until_label:"End date",parts_section:"Parts & consumables",parts_inventory_value:"Inventory value",part_add:"Add part",part_name:"Name",part_vendor:"Manufacturer",part_storage_location:"Storage location",part_product_url:"Product URL",part_unit:"Unit",part_cost:"Unit price",part_cost_mode:"Counts as spending",part_cost_mode_house:"As in Settings ({mode})",part_cost_mode_hint:"When bought: the purchase counts, in the year it is made. When used: every completion that uses the part books its price on the object, and so the area, where it is used.",part_stock:"Stock",part_reorder_threshold:"Reorder at",part_restock_quantity:"Restock quantity",part_package_size:"Package size (units)",part_restock_packages:"Restock amount (packages)",part_package_hint:"Bought in packages, used in the unit: stock, the amount a task uses and the reorder threshold count units; the restock amount and the price are per package.",part_auto_buy:"Auto-create buy task when low",part_reuse:"After use",part_reuse_none:"Used up",part_reuse_charge:"Charged",part_reuse_sharpen:"Sharpened",part_reuse_clean:"Cleaned",part_reuse_dry:"Dried",part_reuse_refill:"Refilled",part_reuse_restore:"Restored",part_waiting_charge:"{count} to charge",part_waiting_sharpen:"{count} to sharpen",part_waiting_clean:"{count} to clean",part_waiting_dry:"{count} to dry",part_waiting_refill:"{count} to refill",part_waiting_restore:"{count} to restore",part_restoring:"Used, not ready yet",part_ready_again_hint:"All used ones are ready again",part_dispose:"Dispose",part_dispose_hint:"Gone for good, such as a dead cell: off the waiting pile, not back to the stock",part_dispose_how_many:"How many are gone for good",part_use:"Use",part_use_hint:"Used outside a task: off the stock like the parts of a completion",part_use_how_many:"How much was used",part_use_not_booked:"Not booked as spending: this part counts when used, which only a task's completion books.",part_bought:"Bought\u2026",part_bought_hint:"Record a purchase: into the stock, with what was paid and when",part_bought_quantity:"How many",part_bought_packages:"Packages of {size}",part_bought_price_each:"Price each",part_bought_price_package:"Price per package",part_bought_total:"Total",part_bought_date:"Bought on",part_bought_note:"Shop, receipt, \u2026",part_bought_confirm:"Record purchase",part_bought_adds:"Adds {qty} to the stock",part_bought_on_use:"Stock, not spending: this part counts when used, and its price becomes the average of what is on the shelf.",part_reuse_hint:"A used one is not gone: it waits until it is ready again and still counts as owned, so it is not bought again.",part_restock:"Adjust stock",parts_used_by:"Used by",restock_quantity_label:"Quantity bought",consumes_parts_label:"Consumes parts",task_parts_fleet_hint:"Battery quantities come from Battery Notes per device \u2014 nothing to link here.",shared_parts_other_objects:"Parts from other objects",shared_parts_help:"Several objects can share one stock. Completing this task takes from the owning object.",shared_part_unknown:"Unknown part",parts_load_failed:"Couldn't load this object's parts \u2014 the consumes-parts options are unavailable right now.",adopt_problem_button:"Adopt problem sensors",adopt_problem_title:"Adopt problem sensors",adopt_problem_hint:"Turn HA problem sensors (printer errors, filter warnings, low battery) into maintenance tasks that trigger while the problem is active and clear themselves when it resolves.",adopt_problem_none:"No problem sensors found that aren't already tracked.",adopt_problem_active:"active",adopt_problem_ok:"ok",adopt_problem_new_object:"(new)",adopt_object_hint:"Give several sensors the same object name and they become one object; type an existing object's name to add them there.",adopt_summary_title:"What adopting changes",adopt_summary_existing:'"{name}": tasks {before} \u2192 {after}',adopt_summary_totals:"Tasks: {tasks} \xB7 objects: {objects}",adopt_summary_totals_new:"Tasks: {tasks} \xB7 objects: {objects} ({new} new)",adopt_problem_adopt:"Adopt selected",adopt_problem_done:"Adopted {tasks} problem sensor(s)",adopt_problem_done_one:"Adopted 1 problem sensor",views_label:"Views",views_none:"\u2014 No view \u2014",views_manage:"Save / manage views",views_dialog_title:"Saved views",views_dialog_hint:"Save the current filters as a named view everyone can reuse.",views_name_placeholder:"View name",views_save_current:"Save current filters",views_none_yet:"No saved views yet.",close:"Close",trigger_hint_now:"The sensor reads {value} right now.",trigger_hint_above:"The task triggers once it rises above {target}.",trigger_hint_below:"It triggers once it falls below {target}.",trigger_hint_equals:"It triggers when it reads exactly {target}.",trigger_hint_not_equals:"It triggers when it reads anything but {target}.",trigger_hint_overlap:"These limits overlap: every reading triggers the task and it can never recover. Leave one of them empty.",trigger_hint_counter_delta:"Counts from the current reading ({value}): due at {due} (+{target}), and the count restarts after each completion.",trigger_hint_counter_delta_edit:"Counts usage since the last completion: due after +{target}; the count restarts after each completion.",trigger_hint_counter_abs:"The task becomes due once the sensor reaches {target}.",trigger_hint_runtime:"The task becomes due after {hours} h of accumulated on-time; the counter restarts after each completion.",trigger_hint_due_date:"The task becomes due {days} days before the date the sensor reports.",trigger_hint_due_date_one:"The task becomes due one day before the date the sensor reports.",trigger_hint_due_date_same_day:"The task becomes due on the date the sensor reports.",trigger_hint_due_date_now:"Reported date: {date}.",trigger_hint_state_change:"The task becomes due after {count} state change(s).",trigger_hint_state_change_to:"The task becomes due after {count} change(s) to \u201C{state}\u201D.",trigger_hint_state_now:"Current state: {value}.",adopt_problem_part:"Uses part: {name}",label_filter:"Label",all_labels:"All labels",filter_place:"Place",filter_place_all:"All places",settings_notify_scope:"Notify only for view",settings_notify_scope_all:"All tasks",settings_notify_scope_hint:"Only tasks matching the selected saved view's label/user filters send reminders. Status, sorting and grouping of the view are ignored here.",settings_notify_completed:"Completion notifications",settings_notify_completed_hint:`Household news when a task is completed, with the reason and who did it. "Automatic only" announces just the completions nobody made on the spot: sensor recovery, shopping-list check-off, an automation's service call. Sent to the household service only; quiet hours and the daily cap apply.`,settings_title_style:"Notification title style",settings_title_style_hint:"What appears as the notification's TITLE. Default keeps the per-status text (e.g. 'Maintenance overdue!'). Object name / Task name help when phone notifications stack.",settings_title_prefix:"Title prefix",settings_title_prefix_hint:"Put in front of every notification's title, with every title style, e.g. the home's name when your phone gets reminders from more than one Home Assistant. Empty = no prefix.",title_style_default:"Default (per-status title)",title_style_object_name:"Object name as title",title_style_task_name:"Task name as title",notify_completed_off:"Off",notify_completed_automatic:"Automatic completions only",notify_completed_all:"All completions",settings_notify_rule:"Your own notification rule",settings_notify_rule_hint:"Every notification also fires the event maintenance_supporter_notification (kind, status, object, task, reference numbers, priority, deep link, the payload). Route it with an automation \u2014 e.g. into Ticker, Telegram or Pushover.",settings_notify_event_only:"Only fire the event, send nothing myself",settings_notify_event_only_hint:"Your automation is the whole delivery. Rate limits, quiet hours and the daily cap still apply to when the event fires.",settings_notify_extra_data:"Extra notification data (template)",settings_notify_extra_data_hint:"JSON or YAML, Jinja allowed; merged into the notify call's data (your keys win). Variables: kind, status, priority, labels, notes, area_name, object_name, task_name, object_ref, task_ref, days_until_due, next_due, last_performed, responsible_user_id, sensor_entity_id, url, target, title, message. Test it with the Send test button.",card_saved_view:"Saved view",card_saved_view_none:"None",card_saved_view_help:"Applies the view's status, user, label and priority filters on top of the filters above. The view's sorting and grouping are panel display settings and are not applied on the card.",panel_card_tab:"Open on tab",panel_card_tab_default:"Remembered tab (as in the panel)",panel_card_view:"Open with saved view",panel_card_height:"Height",panel_card_height_help:"Empty = fill the screen below the card (panel view). Otherwise a CSS length such as 600px or 80vh for views with other cards.",panel_card_not_registered:"The Maintenance Supporter panel is not available \u2014 is the integration set up?",panel_card_load_failed:"The Maintenance Supporter panel could not be loaded \u2014 reload the page (after an update: clear the browser cache).",doc_part_none:"No documents linked to this part.",settings_templates_toggle_group:"Enable or disable all templates in this group",setups_button:"Suggested setups",setups_title:"Suggested setups (Beta)",setups_hint:"Devices of supported integrations whose consumable sensors can drive maintenance tasks. Adopting creates the object and wires each task to its sensor \u2014 it triggers when the consumable runs low and resolves itself after replacement.",setups_none:"No supported devices with unwired consumable sensors found.",setups_adopt:"Set up selected",setups_done:"{tasks} sensor-wired tasks created.",setups_done_one:"1 sensor-wired task created.",complete_parts_used:"Parts used this time",part_delete_confirm:"Delete part '{name}'? Its stock tracking, task links and any open buy reminder will be removed.",baseline_start_value:"Start reading (optional)",baseline_start_help:"Counting starts from this reading. Leave empty to count from the current value; enter the reading at the last service so usage since then already counts.",setups_baseline_hint:"reading at last service (optional)",baseline_start_help_edit:"Leave empty to keep the existing counting. Entering a value re-anchors the counting (e.g. the reading at the last service).",baseline_current_effective:"Currently effective start value: {value}",runtime_on_states:"Active states",runtime_on_states_help:"States that count as running \u2014 default: on. E.g. mowing, cleaning, printing. With an attribute selected, its values are matched instead.",runtime_max_session:"Max session runtime (seconds)",runtime_max_session_help:"A single run counts at most this many seconds \u2014 protects against a sensor stuck ON (lost connection, restart). Empty = no cap.",trend_approaching:"Heading toward the threshold",trend_easing:"Easing away from the threshold",split_select_hint:"Select a task to see its details here",setups_target_new:"Create new: {name}",setups_target_match:"{name} \u2014 matches: {reasons}",setups_reason_model:"model number",setups_reason_name:"name",setups_reason_area:"area",setups_reason_sibling:"same model on another device",setups_maybe_covered:'Probably there already as "{name}"',setups_already:"Already there: {names}",setups_reset_line:"Completing it also resets the counter in the integration (\u201C{button}\u201D)",setups_reset_enable:"\u2014 the button gets switched on for this",reset_offers_title:"Reset counters on completion",reset_offers_hint:"These tasks watch a counter the integration keeps itself. Connected, completing the task here also presses the integration's reset button \u2014 otherwise the counter keeps running and the task falls due again right away.",reset_offers_before:"Now: completing it leaves the counter in {integration} running",reset_offers_after:"Then: it also presses \u201C{button}\u201D",reset_offers_renamed:"Renamed since it was set up \u2014 check that this task is for this part",reset_offers_apply:"Connect resets",reset_offers_done:"{count} tasks now reset their counter on completion",reset_offers_done_one:"1 task now resets its counter on completion",setups_before_after:"Tasks on the object: {before} \u2192 {after}",setups_new_object_count:'New object "{name}" \xB7 tasks: {count}',schedule_preview_title:"Next dates",schedule_preview_ontime:"Assuming on-time completion.",schedule_preview_ends:"(series ends)",adopt_problem_responsible:"Responsible user for all adopted tasks (optional)",adopt_for_minutes_hint:"Only trigger once the problem has persisted this long \u2014 0 reacts to the first flicker.",adopt_problem_configure:"Configure",history_auto:"Automatic",battery_fleet_title:"Battery fleet",battery_fleet_none_low:"All batteries OK \u2014 nothing to replace.",battery_fleet_progress:"{n} to replace",battery_fleet_buy_now:"Buy now",battery_fleet_soon:"Needed soon",battery_fleet_soon_hint:"Predicted from the last replacement date \u2014 order ahead.",battery_fleet_mark_all:"Mark all replaced",battery_fleet_mark_one:"Mark this battery replaced",battery_fleet_offline:"offline",battery_fleet_no_sensor:"No sensor",battery_fleet_trigger_lost:"This task's sensor trigger was lost \u2014 it will not fire or auto-complete.",battery_fleet_repair:"Repair",battery_fleet_exclude:"Exclude from the fleet",battery_fleet_excluded:"Excluded",battery_fleet_include:"Track again",battery_fleet_all:"All tracked batteries",battery_fleet_all_hint:"Exclude a device here to drop it from the fleet before it ever reports low \u2014 a vacuum that recharges itself, or a phone that warns you on its own.",battery_fleet_add:"Add a battery",battery_fleet_add_hint:"Pick a battery sensor the automatic discovery missed \u2014 it joins the roster immediately.",battery_fleet_track_self:"Track self-charging batteries",battery_fleet_track_self_hint:"Phones, vacuums and other devices that recharge themselves appear as rechargeables \u2014 a low one asks for a charge, never for new cells.",battery_fleet_due_without_sensor:"Treat a passed forecast as due when a battery has no sensor",battery_fleet_due_without_sensor_hint:"Some devices report no battery level at all \u2014 Battery Notes only knows the type and the last replacement. Once the typical lifetime has passed, such a battery counts as low and the fleet task reminds you; marking it replaced resets the forecast.",battery_fleet_ask_cells:"Ask which cells went in when a battery is replaced",battery_fleet_ask_cells_hint:"A device takes whatever is in the drawer. Replaced then asks whether disposable or rechargeable cells of its size went in, books those and remembers them for the device. Battery Notes keeps its type; the shopping list and the forecast follow it.",battery_fleet_cells_question:"Which cells went in?",battery_fleet_cells_rechargeable:"rechargeable",battery_fleet_status_low:"Low",battery_fleet_status_soon:"Soon",battery_fleet_status_ok:"Healthy",battery_fleet_status_due:"Due",battery_fleet_predicted_on:"Expected around {date}",battery_fleet_predicted_typical:"Expected around {date} \u2014 {months} months typical for {type} ({source})",lifetime_source_default:"built-in default",lifetime_source_table:"built-in table",lifetime_source_learned:"learned from {n} replacements",lifetime_source_override:"your setting",lifetime_source_learned_device:"learned from this device's {n} replacements",lifetime_source_learned_model:"learned from {n} replacements on devices of this model",battery_fleet_predicted_trend:"Predicted from this battery's discharge trend: around {date} ({confidence})",battery_fleet_rechargeable:"Rechargeable: charge instead of replacing \u2014 never on the shopping list",battery_fleet_sort_name:"Sort by name",battery_fleet_sort_urgency:"Sort by urgency",battery_fleet_mark_recharged:"Mark as recharged",battery_fleet_charging:"Rechargeable spares",battery_fleet_ready:"{count} ready",battery_fleet_sparkline_hint:"Battery level over the last 30 days \u2014 dotted: projected until the low threshold",battery_fleet_filter_type:"Show only this battery type",battery_fleet_record_replacement:"The level jumped around {date} \u2014 record this replacement in Battery Notes",battery_fleet_total:"{n} batteries tracked",battery_fleet_setup_button:"Battery fleet",battery_fleet_setup_done:"Battery fleet set up \u2014 one task tracks all your batteries.",update_banner:"A newer version of Maintenance Supporter is on the server \u2014 reload to update the panel.",update_reload:"Reload",restart_pending_banner:"Maintenance Supporter was updated to {version}. Restart Home Assistant to finish the update.",restart_pending_error:"That did not work: Maintenance Supporter was updated to {version}, but Home Assistant has not been restarted since. Restart Home Assistant, then try again.",row_actions_banner:"Complete and Skip in task rows are now buttons. Prefer the old icons?",row_actions_keep:"Keep buttons",row_actions_back:"Back to icons",battery_fleet_forecast_overdue:"Predicted date passed \u2014 the battery still reports healthy. If you swapped it, record the replacement; otherwise the forecast was off.",cost_from_parts:"Use \u2248 {amount} from parts",cost_parts_booked:"Parts used \u2248 {amount} are booked automatically \u2014 enter only additional costs.",cost_parts_info:"Parts used \u2248 {amount} \u2014 counted when they were bought, not here.",cost_purchase_use_hint:"The price paid becomes the part's price \u2014 spare parts count when they are used.",history_parts_counted:"Parts: {amount}",history_parts_counted_hint:"Value of the parts used \u2014 counted as spending",history_parts_info:"Parts \u2248 {amount}",history_parts_info_hint:"Value of the parts used \u2014 information only; the money counted when they were bought",history_purchase_stock:"Bought for {amount} (counted when used)",dismiss:"Dismiss",gs_label:"Getting started \u2014 these hints retire as your setup grows",gs_setups_chip:"Suggested setups found {n} devices with pre-wired triggers",gs_setups_chip_one:"Suggested setups found 1 device with pre-wired triggers",gs_adopt_chip:"{n} problem sensors can become maintenance tasks",gs_adopt_chip_one:"1 problem sensor can become a maintenance task",gs_fleet_chip:"One click sets up the battery fleet",gs_reset_chip:"{n} tasks can reset their counter in the integration",gs_reset_chip_one:"1 task can reset its counter in the integration",cal_editor_window:"Default window",cal_editor_window_week:"Week (7 days)",cal_editor_window_fortnight:"Fortnight (14 days)",cal_editor_window_month:"Month (30 days, default)",cal_editor_window_year:"Year (365 days, empty days collapsed)",cal_editor_window_past_30:"Past 30 days (history)",cal_editor_window_past_90:"Past 90 days (history)",cal_editor_show_chips:"Show window chips inside the card",cal_editor_chips_hint:"Hide the chips when the card is embedded in a strategy view that already serves as the window selector.",cal_editor_show_user_filter:"Show user filter dropdown",cal_editor_default_user:"Default user filter",cal_editor_my_tasks:"My tasks (current user)",cal_editor_show_object_filter:"Show object filter dropdown",cal_editor_object_hint:'Pre-select one object via YAML: object_filter: "<object name>" \u2014 or a list of names to restrict the card to several objects.',object_history_section:"History (all tasks)",object_history_all_tasks:"All tasks",object_history_empty:"No entries in this range.",object_history_cap_note:"History keeps up to 500 entries per task \u2014 very old entries may be missing.",service_record_title:"Service record",service_record_print:"Service record (PDF)",date:"Date",service_record_entries:"entries",ref_number:"Reference number",print_options_title:"Print service record",print_layout:"Layout",print_layout_chronological:"Chronological",print_layout_by_task:"By task",print_include:"Include",print_inc_readings:"Readings",print_inc_parts:"Parts used",print_inc_photos:"Photos",print_inc_documents:"Linked documents",print_inc_doc_desc:"Document descriptions",print_inc_checklist:"Checklist",print_inc_notes:"Notes",print_inc_costs:"Cost and duration",print_inc_person:"Completed by",print_inc_refs:"Reference numbers",print_inc_bare:"Completions without details",print_inc_qr:"QR code per task",print_button:"Print",report_scan_hint:"Scan to open the task",completed_by:"Completed by",completed_via:"{person} (via {device})",date_from:"From",date_to:"To",phases_section:"Cycle phases (optional)",phases_hint:"Different work on one shared schedule \u2014 each completion moves to the next step (e.g. small service, small service, big service).",phase_add:"Add phase",phase_name:"Phase name",phase_sequence_label:"Cycle order",phase_sequence_add_step:"Add step",phase_current:"Current phase",phase_set:"Set as current",chart_history_fallback:"No long-term statistics for this entity \u2014 showing recorder state history (typically the last ~10 days)",chart_history_alarm:"Trigger view from recorder state history: 1 = alert state held for the hold time, 0 = fine (typically the last ~10 days)",chart_history_count:"Change count rebuilt from recorder state history since the last service (typically the last ~10 days)",prediction_cycles:"Learned from cycles",phase_require_override:"Override \u201CRequire on completion\u201D for this phase",history_add_past:"Add past completion",require_tag_scan:"Only complete by scanning the tag",require_tag_scan_help:"Proof of presence: Done is blocked on every surface until the NFC tag or QR code on the thing itself is scanned. Automations can pass 'via_tag_scan' to the complete service.",disallow_skip:"Don't allow skipping",disallow_skip_help:"The Skip action disappears from every surface, and the server refuses a skip from automations and voice too.",complete_when:"Done when (optional)",complete_when_state:"changes to",complete_when_help:"While the task is due, it completes itself when this entity changes to this state, for example when the washer's door opens.",complete_when_badge:"Done when {entity} changes to {state}",complete_when_any_time:"Also when it is not due: each time completes it and starts the next cycle",complete_when_badge_for:"for {minutes} min",complete_when_badge_any_time:"also when not due",no_notifications:"No notifications for this task",no_notifications_help:"No reminders for this task \u2014 no status notifications, repeats, lead-time reminders or bundles. It still shows on the dashboard and in its entities; the weekly digest still counts it.",require_tag_scan_hint:"This task completes only by scanning its NFC tag or QR code on the thing itself \u2014 saving here will be refused.",feat_beta_editor:"New look and task editor",feat_beta_editor_desc:"Home Assistant's own controls across the panel, tasks as rules like the automation editor, and a trace of each task. On by default; switch it off for the classic look.",beta_new_scratch:"Create new task",beta_new_scratch_desc:"Start with an empty task",beta_new_from_sensor:"Start from a sensor",beta_new_from_sensor_desc:"One of the object's sensors makes the task due",beta_new_from_template_desc:"A task from the template library",beta_new_copy:"Copy an existing task",beta_new_copy_desc:"Its settings, for this object",beta_new_search:"Search",beta_rules_add_rule:"Add rule",beta_rules_select_hint:"Select a row to change it.",beta_rules_every:"Every {interval}",beta_rules_once_on:"Once, on {date}",beta_rules_no_date:"Once, the date is still missing",beta_rules_manual:"No schedule: whenever it is needed",beta_rules_sensor_only:"Only when the sensor rule says so",beta_rules_safety_any:"Or every {interval}, whichever comes first",beta_rules_safety_all:"At the earliest after {interval}",beta_rules_due_soon:"Due soon {interval} before",beta_rules_above:"above {value}",beta_rules_below:"below {value}",beta_rules_for:"for {duration}",beta_rules_counter_delta:"goes up by {value} since the last completion",beta_rules_counter_reaches:"reaches {value}",beta_rules_changes_from:"changes from {state}",beta_rules_changes_to:"changes to {state}",beta_rules_changes:"changes state",beta_rules_times:"{n} times",beta_rules_runs_for:"has run for {duration}",beta_rules_date_before:"{interval} before the date it reports",beta_rules_date_on:"on the date it reports",beta_rules_all_of:"All conditions apply ({n})",beta_rules_any_of:"Any condition applies ({n})",beta_rules_pick_entity:"Pick a sensor",beta_rules_by_hand:"By hand: Complete, a tag or voice",beta_rules_nobody:"Nobody in particular",beta_rules_reminders_on:"Reminders as set in the settings",beta_rules_name_missing:"Give the task a name",beta_rules_by_type:"By type",beta_rules_by_device:"By device",beta_rules_replaces:"Replaces the current schedule",beta_rules_combines:"Joins the current sensor rule",beta_rules_adds_safety:"Adds a safety interval",beta_rules_no_device:"This object is not linked to a device or an area. Link it in the object's settings, or choose a rule under By type.",beta_rules_no_device_entities:"Its device has no entities to suggest.",beta_rules_done_when_suggest:"Done when it changes",beta_template_pick:"Tasks to create",beta_template_none:"Tick at least one task.",beta_template_create:"Create {n} tasks",beta_template_create_one:"Create 1 task",beta_trace:"Trace",beta_sensor_rule:"Sensor rule",beta_show_history:"Show more",beta_trace_off:"Traces are recorded while the new look is on. Completions and the rest of the history show either way.",beta_trace_current:"Current cycle",beta_trace_older:"Older cycle",beta_trace_newer:"Newer cycle",beta_trace_empty:"Nothing happened in this cycle yet.",beta_trace_load_failed:"Could not load the trace.",beta_trace_reminder:"Reminder sent: {status}",beta_trace_reminder_lead:"Heads-up sent: due in {interval}",beta_trace_cleared_done:"Reminder taken off the phones: done",beta_trace_cleared_status:"Reminder taken off the phones: no longer needed",beta_trace_triggered_for:"Triggered for {span}",beta_trace_cycle_self_ended:"Ended by itself",beta_trace_trigger_cleared_update:"Trigger ended: {installed} installed",beta_trace_trigger_cleared_value:"Trigger ended at {value}",beta_trace_trigger_cleared_state:"Trigger ended: now {state}",beta_trace_trigger_cleared:"Trigger ended",beta_trace_cleared_inert:"Reminder taken off the phones: paused or archived",beta_trace_snoozed:"Snoozed until {time}",beta_trace_dw_counted:"{entity} changed to {state}: counts as done",beta_trace_dw_waiting:"{entity} changed to {state}: waiting {duration}",beta_trace_dw_left_early:"{entity} left {state} too early: not counted",beta_trace_dw_not_due:"{entity} changed to {state}: not counted, the task was not due",beta_trace_dw_inert:"{entity} changed to {state}: not counted, the task is paused or archived",beta_trace_dw_recent:"{entity} changed to {state}: not counted, it was done moments ago",beta_trace_edited:"Task changed: {fields}",beta_trace_edited_other:"other settings",beta_trace_later:"{span} later",beta_trace_running:"Still running",beta_trace_after_due:"Done {span} after it was due",beta_trace_before_due:"Done before it was due",beta_trace_due_for:"Due for {span}",beta_trace_cycle_length:"Cycle: {span}",beta_trace_reminders:"{n} reminders",beta_trace_reminders_one:"1 reminder",beta_trace_snoozes:"Snoozed {n} times",beta_trace_snoozes_one:"Snoozed once",beta_trace_message:"Message",beta_trace_bundle:"Sent together with the other due tasks",beta_trace_download:"Download trace",beta_trace_activity:"Activity around this step",beta_trace_activity_none:"Nothing recorded around this time. Home Assistant keeps its history for 10 days unless set otherwise.",beta_rules_group_device:"This device",beta_rules_group_area_more:"More in the {area} area",beta_rules_group_area:"In the {area} area",beta_rules_no_area_entities:"Nothing in its area suggests a rule.",beta_filters_clear:"Clear filters",beta_search_tasks:"Search {count} tasks",beta_sort_by:"Sort by {sort}",beta_filters:"Filters",beta_filter_status:"Status"}});function z3(C){return P7[C]??"var(--secondary-text-color)"}function U3(C){return k8[C??""]??P5.length}function B7(C){return W3.includes(C??"")}function R5(C){return!!C.archived||C.enabled===!1||C.status==="paused"||C.paused===!0}var T1,P7,R7,P5,W3,k8,C5,E1=v(()=>{"use strict";T1={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"var(--deep-orange-color, #ff5722)",archived:"var(--disabled-color, #9e9e9e)",paused:"var(--info-color, #2196f3)"},P7={completed:T1.ok,missed:T1.overdue,reset:T1.paused,skipped:"var(--secondary-text-color)",triggered:T1.triggered,trigger_replaced:T1.triggered,trigger_removed:"var(--secondary-text-color)",updated:"var(--secondary-text-color)"},R7=["completed","reset","skipped"];P5=["overdue","triggered","due_soon","ok"],W3=["overdue","triggered","due_soon"],k8=Object.fromEntries(P5.map((C,H)=>[C,H]));C5={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",archived:"mdi:archive-outline",paused:"mdi:pause-circle-outline",completed:"mdi:check-circle",skipped:"mdi:skip-next",missed:"mdi:calendar-remove",reset:"mdi:refresh"}});function F7(C){return C?.restart_pending&&C.installed_version?C.installed_version:null}var I7,G3=v(()=>{"use strict";I7="2.119.0"});function X3(C){r2.en=Object.assign({},C,r2.en??{})}function P1(C){let H=(C||K3).toLowerCase();return H.startsWith("pt")&&H.endsWith("br")?"pt-br":H.substring(0,2)}function T(C){return C?.language||"en"}function V(C,H,e){let t=P1(H);return r2[t]?.[C]??r2.en?.[C]??e??C}function p2(C){let H=P1(C);return H===K3||H in r2||!D7.has(H)}function g1(C){let H=P1(C);if(H===K3||H in r2||!D7.has(H))return Promise.resolve();let e=Q3[H];return e!==void 0&&Date.now()-e<w8?Promise.resolve():(H in r5||(r5[H]=fetch(`${O8}/${H}.json?v=${I7}`).then(t=>t.ok?t.json():null).then(t=>{t?r2[H]=t:(delete r5[H],Q3[H]=Date.now())}).catch(()=>{delete r5[H],Q3[H]=Date.now()})),r5[H])}var K3,Y3,r2,r5,Q3,w8,D7,O8,H5=v(()=>{"use strict";G3();K3="en",Y3=(()=>{let C=window;return C.__msLocales||(C.__msLocales={store:{},inflight:{}}),C.__msLocales.failedAt||(C.__msLocales.failedAt={}),C.__msLocales})(),r2=Y3.store,r5=Y3.inflight,Q3=Y3.failedAt,w8=6e4;D7=new Set(["de","nl","fr","it","es","pt","pt-br","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi","hu","ko","tr"]),O8="/maintenance_supporter_locales"});function N7(C){let H=C?.language;!H||typeof C?.loadBackendTranslation!="function"||L1.lang===H&&(L1.localize||L1.inflight)||(L1.lang=H,L1.localize=null,L1.inflight=C.loadBackendTranslation("exceptions",J3).then(e=>{L1.lang===H&&(L1.localize=e)}).catch(()=>{}).finally(()=>{L1.inflight=null}))}function j7(C,H,e){if(!H||!L1.localize||C&&C!==J3)return null;let t=`component.${J3}.exceptions.${H}.message`,r=L1.localize(t,e??void 0);return r&&r!==t?r:null}var J3,L1,e0=v(()=>{"use strict";J3="maintenance_supporter",L1=(()=>{let C=window;return C.__msBackendErrors??={lang:"",localize:null,inflight:null}})()});function V5(C){let H=q7.get(C);if(H===void 0){try{H=new Intl.DateTimeFormat("en-US",{timeZone:C,hourCycle:"h23",year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit"})}catch{H=null}q7.set(C,H)}return H}function U7(){if(t0===void 0){let C;try{C=new Intl.DateTimeFormat().resolvedOptions().timeZone}catch{}t0=C&&V5(C)?C:null}return t0}function G7(){return U7()??"UTC"}function R1(){let C=W7.serverTimeZone;return C&&V5(C)?C:G7()}function B1(){let C=U7();return W7.timeZone!=="server"&&C?C:R1()}function B5(C,H){let e=V5(H)??V5(G7())??V5("UTC"),t={};for(let r of e.formatToParts(C))r.type!=="literal"&&(t[r.type]=Number(r.value));return{y:t.year,mo:t.month,d:t.day,h:t.hour%24,mi:t.minute,s:t.second}}function I1(C,H){return H0(B5(+C,H))}function I5(C,H){let e=B5(+C,H);return`${H0(e)}T${n1(e.h)}:${n1(e.mi)}`}function f1(){return I1(Date.now(),R1())}function Q7(){return I5(Date.now(),R1())}function C0(C,H){let e=B5(C,H);return Date.UTC(e.y,e.mo-1,e.d,e.h,e.mi,e.s)-Math.floor(C/1e3)*1e3}function $8(C,H,e,t,r,i,o){let L=Date.UTC(C,H-1,e,t,r,i),M=C0(L-r0,o),d=C0(L+r0,o);for(let p of M===d?[M]:[M,d])if(C0(L-p,o)===p)return L-p;return L-M}function K7(C,H,e){if(C.has(H))return C.get(H);C.size>=P8&&C.clear();let t=e();return C.set(H,t),t}function Q(C){if(typeof C!="string"||!C)return NaN;let H=V0.exec(C);if(!H)return Date.parse(C);let e=R1();return K7(E8,`${e}|${C}`,()=>{let[t,r,i,o,L,M]=[H[1],H[2],H[3],H[4]??"0",H[5]??"0",H[6]??"0"].map(Number);if(r<1||r>12||new Date(Date.UTC(t,r-1,i)).getUTCDate()!==i||o>23||L>59||M>59)return NaN;let d=H[7]?Math.floor(+`0.${H[7]}`*1e3):0;return $8(t,r,i,o,L,M,e)+d})}function F5(C){if(typeof C!="string"||!C)return null;let H=V0.exec(C);if(H)return`${H[1]}-${H[2]}-${H[3]}`;let e=R1();return K7(T8,`${e}|${C}`,()=>{let t=Date.parse(C);return Number.isFinite(t)?I1(t,e):/^\d{4}-\d{2}-\d{2}/.test(C)?C.slice(0,10):null})}function Y7(C){if(typeof C!="string"||!C)return"";let H=V0.exec(C);if(H)return`${H[1]}-${H[2]}-${H[3]}T${H[4]??"00"}:${H[5]??"00"}:${H[6]??"00"}`;let e=Date.parse(C);if(!Number.isFinite(e))return"";let t=B5(e,R1());return`${H0(t)}T${n1(t.h)}:${n1(t.mi)}:${n1(t.s)}`}function z7(C){let H=X7.exec(C);if(!H)return NaN;let[e,t,r]=[Number(H[1]),Number(H[2]),Number(H[3])],i=Date.UTC(e,t-1,r);return t>=1&&t<=12&&new Date(i).getUTCDate()===r?i/r0:NaN}function J7(C,H){let e=X7.exec(C);if(!e)return C;let t=new Date(Date.UTC(Number(e[1]),Number(e[2])-1,Number(e[3])+Math.round(H)));return`${n1(t.getUTCFullYear(),4)}-${n1(t.getUTCMonth()+1)}-${n1(t.getUTCDate())}`}function e4(C,H){return z7(H)-z7(C)}var W7,r0,n1,q7,t0,H0,V0,T8,E8,P8,X7,Y=v(()=>{"use strict";W7=window.__msDateTimePrefs??={},r0=864e5,n1=(C,H=2)=>String(C).padStart(H,"0"),q7=new Map;H0=C=>`${n1(C.y,4)}-${n1(C.mo)}-${n1(C.d)}`;V0=/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d+))?)?)?$/,T8=new Map,E8=new Map,P8=2e4;X7=/^(\d{4})-(\d{2})-(\d{2})$/});function H2(C){return C?.currency_symbol||R8}function D5(C,H){H.has("hass")&&a0(C.hass?.locale,C.hass?.config?.country,C.hass?.config?.time_zone);let e=C.hass?.language;e&&!p2(e)&&g1(e).then(()=>{p2(e)&&C.requestUpdate()}),N7(C.hass)}function V4(C){let H=P1(C);return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN",pl:"pl-PL",cs:"cs-CZ",sv:"sv-SE","pt-br":"pt-BR",hu:"hu-HU",ko:"ko-KR",tr:"tr-TR"}[H]??"en-US"}function B8(C){o4.decimals=typeof C=="number"&&Number.isInteger(C)&&C>=0&&C<=3?C:0}function I8(){return o4.decimals??0}function N5(C){C&&C.currency_decimals!==void 0&&C.currency_decimals!==null&&B8(Number(C.currency_decimals))}function a0(C,H,e){e!==void 0&&(s1.serverTimeZone=e||void 0),C&&(s1.date=C.date_format,s1.time=C.time_format,s1.number=C.number_format,s1.timeZone=C.time_zone,H!==void 0&&(s1.country=H||void 0))}function a4(C){switch(s1.number){case"comma_decimal":return["en-US","en"];case"decimal_comma":return["de","es","it"];case"space_comma":return["fr","sv","cs"];case"system":return;default:return V4(C)}}function j5(C,H,e,t,r="n"){return e===1?V(H,t):V(C,t).replace(`{${r}}`,f(e,t))}function i0(C,H){let e=`${String(C??"")}|${JSON.stringify(H)}`,t=t4.get(e);return t||(t=new Intl.NumberFormat(C,H),t4.set(e,t)),t}function F1(C,H){let e=`${C??""}|${JSON.stringify(H)}`,t=C4.get(e);return t||(t=new Intl.DateTimeFormat(C,H),C4.set(e,t)),t}function m2(C,H,e){let t={style:"unit",unit:H,unitDisplay:"long",maximumFractionDigits:2};try{return i0(a4(e),t).format(C)}catch{return`${f(C,e)} ${H}`}}function f(C,H,e){if(!Number.isFinite(C))return String(C);let t=typeof e=="number"?{minimumFractionDigits:e,maximumFractionDigits:e}:{maximumFractionDigits:2,...e};if(s1.number==="none"){let r=Math.pow(10,t.maximumFractionDigits??2);return String(Math.round(C*r)/r)}try{return i0(a4(H),t).format(C)}catch{return i0(void 0,t).format(C)}}function L4(C,H,e){return C<0?`${V("cost_kind_credit",e??"en")}: ${J(-C,H,e)}`:J(C,H,e)}function J(C,H,e,t){let r=t??I8(),i=Math.abs(C)<.5/Math.pow(10,r)?0:C,o=f(i,e,r);return H?`${o} ${H}`:o}function A2(C,H,e){let t=f(C,e);return H?`${t} ${H}`:t}function c2(C){let H=s1.country,e=`${C??""}|${H??""}`,t=r4.get(e);if(t!==void 0)return t;let r=V4(C);if(H&&/^[A-Za-z]{2}$/.test(H)){let i=`${P1(C).split("-")[0]}-${H.toUpperCase()}`;try{F1(i,{}),r=i}catch{}}return r4.set(e,r),r}function o0(C,H,e){let t=s1.date;if(t==="DMY"||t==="MDY"||t==="YMD"){let[i,o,L]=I1(C,e).split("-");return t==="DMY"?`${L}/${o}/${i}`:t==="MDY"?`${o}/${L}/${i}`:`${i}-${o}-${L}`}let r=t==="system"?void 0:c2(H);return F1(r,{day:"2-digit",month:"2-digit",year:"numeric",timeZone:e}).format(C)}function q5(C,H,e=!1){let t=B1(),r={hour:"2-digit",minute:"2-digit",...e?{second:"2-digit"}:{}};switch(s1.time){case"12":return F1(c2(H),{...r,hour12:!0,timeZone:t}).format(C);case"24":return F1(c2(H),{...r,hour12:!1,timeZone:t}).format(C);case"system":return F1(void 0,{...r,timeZone:t}).format(C);default:return F1(c2(H),{...r,timeZone:t}).format(C)}}function P(C,H){if(!C)return"\u2014";try{let e=n4.exec(C);return e?o0(new Date(Date.UTC(+e[1],+e[2]-1,+e[3])),H,"UTC"):o0(new Date(Q(C)),H,B1())}catch{return C}}function z5(C,H,e=!1){if(!C)return"\u2014";if(n4.test(C))return P(C,H);try{let t=new Date(Q(C));return o0(t,H,B1())+" "+q5(t,H,e)}catch{return C}}function W5(C,H=Date.now()){let e=R1();return I5(H,e)===I5(H,B1())?"":V("ha_time_zone_hint",C).replace("{zone}",e)}function u2(C,H){if(C==null)return"\u2014";let e=H||"en";return C<0?`${Math.abs(C)} ${V("d_overdue",e)}`:C===0?V("today",e):V2(C,e)}function V2(C,H){let e=H||"en";return`${C} ${V(L0(C,e,{one:"day",few:"days_few",other:"days"}),e)}`}function L0(C,H,e){let t=C===1?"one":"other";try{let r=H4.get(H);r||(r=new Intl.PluralRules(H),H4.set(H,r)),t=r.select(C)}catch{}return t==="one"?e.one:t==="few"?e.few:e.other}function s4(C,H){let e=F5(C);if(!e)return null;let t=e4(e,f1());return Number.isFinite(t)?t<=0?V("last_done_today",H||"en"):V("last_done_days_ago",H||"en").replace("{n}",String(t)):null}function i5(C,H,e){return C==null?"\u2014":`${C} ${V("unit_"+(H||"days"),e)}`}function v2(C,H){return C==null?"\u2014":`${f(C,H,{maximumFractionDigits:1})} ${V("minutes_short",H)}`}function D1(C,H,e="long"){return F1(c2(H),{weekday:e,timeZone:"UTC"}).format(new Date(Date.UTC(2024,0,1+C)))}function n0(C,H,e="long"){return F1(c2(H),{month:e,timeZone:"UTC"}).format(new Date(Date.UTC(2024,C,1)))}function M4(C,H){let e=C.schedule;if(C.schedule_type==="sensor_based"){let i=V("sensor_based",H),o=e&&e.kind==="interval"&&e.every?e.every:C.interval_days;return o?`${i} \xB7 ${i5(o,(e&&e.kind==="interval"?e.unit:C.interval_unit)||"days",H)}`:i}let t=e?.offset?` ${e.offset>0?"+":"\u2212"}${Math.abs(e.offset)}d`:"",r=e?.months?.length?` \xB7 ${[...e.months].sort((i,o)=>i-o).map(i=>n0(i-1,H,"short")).join(", ")}`:"";switch(e?.kind){case"weekdays":return((e.weekdays||[]).map(i=>D1(i,H,"short")).join(" & ")||"\u2014")+t;case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?V("ord_last",H):V("ord_"+e.nth,H)} ${D1(e.weekday,H,"long")}${t}${r}`;case"day_of_month":return e.day==null?"\u2014":(e.day===-1?V(e.business?"last_business_day_month":"last_day_month",H):`${V("day_word",H)} ${e.day}`)+t+r;case"calendar":return`${V("calendar_entity_label",H)}: ${C.schedule_entity_name||e.entity_id||"\u2014"}${t}`;case"one_time":return C.due_date?P(C.due_date,H):V("one_time",H);case"manual":return V("manual",H);case"interval":return i5(e.every,e.unit,H)}return C.schedule_type==="one_time"?C.due_date?P(C.due_date,H):V("one_time",H):C.schedule_type==="manual"?V("manual",H):C.schedule_type==="sensor_based"?V("sensor_based",H):C.interval_days!=null?i5(C.interval_days,C.interval_unit,H):"\u2014"}function l4(C,H){C.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:H},bubbles:!0,composed:!0}))}var R8,i4,s1,o4,t4,C4,r4,n4,H4,N1,d4,F8,D8,U5,w=v(()=>{"use strict";k();T7();E1();H5();e0();Y();H5();R8="\u20AC";X3(E7);i4=window,s1=i4.__msDateTimePrefs??={},o4=i4.__msMoneyPrefs??={};t4=new Map,C4=new Map;r4=new Map;n4=/^(\d{4})-(\d{2})-(\d{2})$/;H4=new Map;N1=g`
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
`,d4=g`
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
`,F8=g`
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
`,D8=g`
  .ref-chip {
    display: inline-block; font-size: 11.5px; font-weight: 500; line-height: 1; padding: 3px 6px;
    border-radius: var(--ms-radius-6, 6px); border: 1px solid var(--divider-color); color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums; letter-spacing: .02em; vertical-align: middle; white-space: nowrap;
    user-select: all;
  }
  /* #189: "· Residual waste, Paper" after a calendar-driven task's name. */
  .event-titles { color: var(--secondary-text-color); font-weight: 400; }
`,U5=g`
  ${F8}
  ${D8}
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
`});function q8(C){let H=C.replace(/_ids?$/,"").split("_").filter(Boolean);if(H.length===0)return C;let e=H.join(" ");return e.charAt(0).toUpperCase()+e.slice(1)}function z8(C,H){let e=j8[C];if(e){let t=V(e,H);if(t&&t!==e)return t}return q8(C)}function W8(C){let H=[...C.matchAll(/\['([^']+)'\]/g)].map(r=>r[1]),e=H.length?H[H.length-1]:void 0,t;return(t=C.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=C.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=C.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=C.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(C)?{field:e,rule:"required"}:(t=C.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(C)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(C)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function U8(C,H){let e=new Set(p4(H));return p4(C).every(t=>e.has(t))}function c4(C,H,e){if(e=e??V("action_error",H),typeof C=="string")return C;if(typeof C!="object"||C===null)return e;let t=C,r=t.message||t.error?.message||"",i=t.code||t.error?.code||"",o=i?N8[i]:void 0,L=j7(t.translation_domain??t.error?.translation_domain,t.translation_key??t.error?.translation_key,t.translation_placeholders??t.error?.translation_placeholders);if(L)return L;if(!r&&!o)return e;let M=W8(r),d=M.field?z8(M.field,H):"",p=m=>V(m,H).replace("{field}",d).replace("{n}",M.param??"");switch(M.rule){case"too_long":return p("err_too_long");case"too_short":return p("err_too_short");case"value_too_high":return p("err_value_too_high");case"value_too_low":return p("err_value_too_low");case"required":return p("err_required");case"wrong_type":return p("err_wrong_type").replace("{type}",M.param??"");case"invalid_choice":return p("err_invalid_choice");case"invalid_value":return p("err_invalid_value");default:if(o){let m=V(o,H);return P1(H)==="en"&&r&&!U8(r,i)?`${m} (${r})`:m}return r||e}}var N8,j8,p4,m4=v(()=>{"use strict";w();e0();H5();N8={already_archived:"ws_err_already_archived",already_paused:"ws_err_already_paused",archived:"ws_err_archived",changed_since:"undo_changed",create_failed:"ws_err_create_failed",duplicate_failed:"ws_err_duplicate_failed",empty:"ws_err_empty",empty_csv:"ws_err_empty_csv",invalid_cursor:"ws_err_invalid_cursor",invalid_date:"ws_err_invalid_date",invalid_device:"ws_err_invalid_device",invalid_entity_slug:"ws_err_invalid_entity_slug",invalid_format:"ws_err_invalid_format",invalid_input:"ws_err_invalid_input",invalid_mirror_todo:"ws_err_invalid_mirror_todo",invalid_notify_service:"ws_err_invalid_notify_service",invalid_parent:"ws_err_invalid_parent",invalid_icon:"ws_err_invalid_icon",invalid_range:"ws_err_invalid_range",invalid_search_template:"ws_err_invalid_search_template",invalid_shopping_list_entity:"ws_err_invalid_shopping_list_entity",invalid_target:"ws_err_invalid_target",invalid_trigger_config:"ws_err_invalid_trigger_config",invalid_url:"ws_err_invalid_url",invalid_user:"ws_err_invalid_user",invalid_view:"ws_err_invalid_view",limit_reached:"ws_err_limit_reached",no_defaults:"ws_err_no_defaults",no_phases:"ws_err_no_phases",no_url:"ws_err_no_url",not_archived:"ws_err_not_archived",not_available:"ws_err_not_available",not_configured:"ws_err_not_configured",not_found:"ws_err_not_found",notify_service_not_found:"ws_err_notify_service_not_found",not_loaded:"ws_err_not_loaded",not_paused:"ws_err_not_paused",nothing_to_undo:"undo_nothing",replace_failed:"ws_err_replace_failed",self_link_device:"ws_err_self_link_device",too_early:"ws_err_too_early",too_large:"ws_err_too_large",too_many:"ws_err_too_many",too_many_views:"ws_err_too_many_views",unauthorized:"ws_err_unauthorized",unavailable:"ws_err_unavailable"},j8={entry_id:"object",name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_equals:"trigger_equals",trigger_not_equals:"trigger_not_equals",trigger_for_minutes:"trigger_for_minutes"};p4=C=>C.toLowerCase().split(/[^a-z0-9]+/).filter(H=>H.length>1)});async function F(C,H,e={}){e.busy?.(!0);try{let t=typeof H=="function"?await H():await C.hass.connection.sendMessagePromise(H);return e.reload&&await e.reload(),e.successToast&&e.onSuccess?.(e.successToast),t===void 0?null:t}catch(t){let r=e.lang||T(C.hass),i=await Q8(C,t,r)??c4(t,r,e.fallbackKey?V(e.fallbackKey,r):void 0);e.onError?.(i,t);return}finally{e.busy?.(!1)}}async function Q8(C,H,e){let t=typeof H=="object"&&H!==null?H:{};if(!G8.has(t.code||t.error?.code||""))return null;try{let r=F7(await C.hass.connection.sendMessagePromise({type:"maintenance_supporter/version"}));return r?V("restart_pending_error",e).replace("{version}",r):null}catch{return null}}var G8,p1=v(()=>{"use strict";m4();w();G3();G8=new Set(["unknown_error","invalid_format","unknown_command"])});async function Y8(C,H,e,t){let r="",i=await F({hass:C},{type:"maintenance_supporter/task/undo",entry_id:H,task_id:e},{lang:t,onError:(o,L)=>{let M=K8[L?.code??""];r=M?V(M,t):o}});return i===void 0?{ok:!1,message:r}:{ok:!0,message:V(i?.action_ran?"undo_done_action_ran":"undo_done",t)}}function G5(C,H){let e=C?.already_recorded_seconds;return typeof e=="number"?V("completion_already_recorded",H).replace("{seconds}",String(e)):null}function i2(C,H,e,t,r){let i=(o,L)=>C.dispatchEvent(new CustomEvent("hass-notification",{detail:L?{message:o,action:L,duration:1e4}:{message:o},bubbles:!0,composed:!0}));i(V("task_completed_named",t).replace("{task}",e.taskName),{text:V("undo",t),action:()=>{Y8(H,e.entryId,e.taskId,t).then(o=>{i(o.message),o.ok&&r()})}})}var K8,h2=v(()=>{"use strict";w();p1();K8={changed_since:"undo_changed",nothing_to_undo:"undo_nothing"}});function e1(C){let H=C?.quick_complete_defaults;return!!H&&typeof H=="object"&&!Array.isArray(H)}function Q5(C){return e1(C)?{...C.quick_complete_defaults}:null}async function K5(C,H,e,t){let r={message:"",code:""},i=await F({hass:C},{type:"maintenance_supporter/task/quick_complete",entry_id:H,task_id:e,source:"panel"},{lang:t,fallbackKey:"action_error",onError:(L,M)=>{r={message:L,code:M?.code??""}}});if(i===void 0)return X8.has(r.code)?{result:"dialog"}:{result:"failed",message:r.message};let o=G5(i,t);return o?{result:"already",message:o}:{result:"done",undo:i?.undo===!0}}var X8,x2=v(()=>{"use strict";p1();h2();X8=new Set(["no_defaults","completion_details_required","tag_scan_required"])});var A4=v(()=>{});function u(C){return(H,e)=>typeof e=="object"?ee(C,H,e):((t,r,i)=>{let o=r.hasOwnProperty(i);return r.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(r,i):void 0})(C,H,e)}var J8,ee,s0=v(()=>{Q2();J8={attribute:!0,type:String,converter:G2,reflect:!1,hasChanged:S5},ee=(C=J8,H,e)=>{let{kind:t,metadata:r}=e,i=globalThis.litPropertyMetadata.get(r);if(i===void 0&&globalThis.litPropertyMetadata.set(r,i=new Map),t==="setter"&&((C=Object.create(C)).wrapped=!0),i.set(e.name,C),t==="accessor"){let{name:o}=e;return{set(L){let M=H.get.call(this);H.set.call(this,L),this.requestUpdate(o,M,C,!0,L)},init(L){return L!==void 0&&this.C(o,void 0,C,L),L}}}if(t==="setter"){let{name:o}=e;return function(L){let M=this[o];H.call(this,L),this.requestUpdate(o,M,C,!0,L)}}throw Error("Unsupported decorator location: "+t)}});function l(C){return u({...C,state:!0,attribute:!1})}var u4=v(()=>{s0();});var v4=v(()=>{});var _2=v(()=>{});var h4=v(()=>{_2();});var x4=v(()=>{_2();});var _4=v(()=>{_2();});var g4=v(()=>{_2();});var f4=v(()=>{_2();});var D=v(()=>{A4();s0();u4();v4();h4();x4();_4();g4();f4()});function b4(C,H,e){let t=new Blob([C],{type:e}),r=URL.createObjectURL(t),i=document.createElement("a");i.href=r,i.download=H,i.target="_blank",i.rel="noopener",i.style.display="none",document.body.appendChild(i),i.dispatchEvent(new MouseEvent("click")),document.body.removeChild(i),setTimeout(()=>URL.revokeObjectURL(r),6e4)}var M0=v(()=>{"use strict"});async function te(C,H,e=300){return(await C.connection.sendMessagePromise({type:"auth/sign_path",path:H,expires:e})).path}async function l0(C,H,e=300){return te(C,`/api/maintenance_supporter/document/${H}`,e)}async function Z4(C,H,e=""){let t=window.open("about:blank","_blank");try{let r=await l0(C,H);t&&(t.location.href=new URL(r+e,window.location.origin).href)}catch(r){throw t&&t.close(),r}}var d0=v(()=>{"use strict";M0()});function p0(C){return C.replace(/[\t\n\r]/g,"").replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g,"")}function c0(C){let H=/^([a-z][a-z0-9+.-]+):/i.exec(p0(C||""));return H?H[1].toLowerCase():null}function g2(C){let H=c0(C);return H!==null&&!Ce.has(H)}function S4(C){return!!C&&/^https?:\/\//i.test(C)}var Ce,X5=v(()=>{"use strict";Ce=new Set(["about","blob","data","file","filesystem","javascript","livescript","ms-appinstaller","ms-cxh","ms-cxh-full","ms-msdt","ms-officecmd","search","search-ms","view-source","vbscript"])});function Ve(C){let H=(C||"").split(/\s+/).filter(Boolean);return H.length===0?"?":H.length===1?H[0][0].toUpperCase():(H[0][0]+H[H.length-1][0]).toUpperCase()}function ie(C){let H=0;for(let e of C)H=H*31+e.charCodeAt(0)>>>0;return O4[H%O4.length]}function e3(C){return C?{id:C.id,name:C.name,initials:C.initials||Ve(C.name),color:C.color||ie(C.id)}:null}function $4(C){return C?a`<span class="person-avatar" style="--person-color: ${C.color}" title=${C.name}>${C.initials}</span>`:s}function T4(C){let H=C.filter(e=>!!e);return H.length<=1?$4(H[0]):a`<span class="people-avatars">${H.map(e=>$4(e))}</span>`}var O4,A0=v(()=>{"use strict";k();O4=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"]});var b2,u0=v(()=>{"use strict";A0();b2=class{constructor(H){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=H}updateHass(H){this.hass=H}async getUsers(H=!1){let e=Date.now();if(!H&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(H,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:H,task_id:e,user_id:t})}async getTasksByUser(H){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:H})).tasks}getUserName(H){return!H||!this.usersCache?null:this.usersCache.find(t=>t.id===H)?.name||null}getPerson(H){return e3(this.getUser(H))}getUser(H){return!H||!this.usersCache?null:this.usersCache.find(e=>e.id===H)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(H){return H?H===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}}});function oe(C,H){if(H<=0)return 0;let e=typeof C=="number"&&Number.isFinite(C)?Math.trunc(C):0;return e<0?0:e%H}function ae(C){return!!(C?.phases&&C.phase_sequence&&C.phase_sequence.length>0)}function v0(C){if(!C||!ae(C))return null;let H=C.phase_sequence,e=oe(C.phase_cursor,H.length),t=H[e],r=C.phases?.[t];return r?{id:t,name:r.name,index:e,count:H.length,notes:r.notes,checklist:r.checklist!==void 0?r.checklist:C.checklist??[],consumesParts:r.consumes_parts!==void 0?r.consumes_parts:C.consumes_parts??[],requiredFields:r.required_completion_fields!==void 0?r.required_completion_fields:C.required_completion_fields??[]}:null}function j1(C){let H=v0(C);return H?`${H.index+1}/${H.count} \xB7 ${H.name}`:""}var t3=v(()=>{"use strict"});function R4(){let C=new Uint8Array(4);return(globalThis.crypto??{getRandomValues:H=>H.map(()=>Math.floor(Math.random()*256))}).getRandomValues(C),Array.from(C,H=>H.toString(16).padStart(2,"0")).join("")}function q1(C){let H=C?.reading_values;if(!Array.isArray(H))return[];let e=[],t=new Set;for(let r of H){if(!r||typeof r!="object")continue;let i=r;typeof i.id!="string"||!i.id||t.has(i.id)||typeof i.value!="number"||!Number.isFinite(i.value)||(t.add(i.id),e.push({id:i.id,name:typeof i.name=="string"?i.name:i.id,unit:typeof i.unit=="string"?i.unit:null,value:i.value}))}return e}function B4(C){return C.filter(H=>H.type==="completed"&&(H.reading_value!=null||q1(H).length>0)).sort((H,e)=>H.timestamp.localeCompare(e.timestamp))}function I4(C){return B4(C??[]).map(H=>({timestamp:H.timestamp,values:q1(H)})).filter(H=>H.values.length>0)}function F4(C,H,e){let t;for(let r of C){if(e!==void 0){let o=Q(r.timestamp);if(!isNaN(o)&&o>=e)break}let i=r.values.find(o=>o.id===H);i&&(t=i)}return t}function D4(C,H,e){let t=q1(H).find(i=>i.id===e);if(!t)return null;let r=null;for(let i of B4(C)){if(i.timestamp>=H.timestamp)break;let o=q1(i).find(L=>L.id===e);o&&(r=o.value)}return r==null?null:t.value-r}function N4(C){let H=new Set,e=new Set;for(let t of C){let r=(t.name||"").trim().toLowerCase();r&&(H.has(r)?e.add(t.id):H.add(r))}return e}function j4(C){let H=[],e=new Set,t=new Set;for(let r of C){let i=(r.name||"").trim();if(!(!i||e.has(r.id)||t.has(i.toLowerCase()))&&(e.add(r.id),t.add(i.toLowerCase()),H.push({id:r.id,name:i,unit:(r.unit||"").trim()||null}),H.length>=h0))break}return H}var h0,o2=v(()=>{"use strict";Y();h0=20});function c1(C){return`${C.entry_id??""}\0${C.part_id}`}function q4(C,H,e,t){let r=!!C.entry_id&&C.entry_id!==H,i=r?C.entry_id:H,o=e.find(p=>p.entry_id===i),L=(o?.parts||[]).find(p=>p.id===C.part_id)||null,M=r&&o?.object?.name||"",d=L?.name||V("shared_part_unknown",t);return{part:L,foreign:r,ownerName:M,label:M?`${d} (${M})`:d}}function z4(C,H,e,t){let{part:r,label:i}=q4(C,H,e,t),o=r&&r.stock!==null&&r.stock!==void 0?` (${A2(r.stock,r.unit,t)})`:"",L=r?.storage_location?` \u2014 ${r.storage_location}`:"";return`${f(C.quantity,t)}\xD7 ${i}${o}${L}`}function W4(C,H,e,t){let r=e.find(M=>M.entry_id===H),i=M=>M?.object.battery_fleet?{cost_mode:"purchase"}:{},o=(r?.parts||[]).map(M=>({...M,...i(r)})),L=new Set(o.map(M=>c1({part_id:M.id})));for(let M of C?.consumes_parts||[]){if(!M.entry_id||M.entry_id===H)continue;let d=c1(M);if(L.has(d))continue;L.add(d);let{part:p,ownerName:m}=q4(M,H,e,t);o.push({id:M.part_id,name:p?.name||V("shared_part_unknown",t),unit:p?.unit,stock:p?.stock??null,storage_location:p?.storage_location,cost:p?.cost??null,package_size:p?.package_size??null,cost_mode:p?.cost_mode??null,...i(e.find(A=>A.entry_id===M.entry_id)),entry_id:M.entry_id,owner_name:m})}return o}var C3=v(()=>{"use strict";w()});function G4(C){return C==="use"?"use":"purchase"}function r3(C,H,e=!1){if(e)return"purchase";let t=C?.cost_mode;return t==="use"||t==="purchase"?t:H}function Q4(C){let H=U4(C?.cost);if(H===null)return null;let e=U4(C?.package_size);return e&&e>0?H/e:H}var U4,H3,o5=v(()=>{"use strict";U4=C=>typeof C=="number"&&Number.isFinite(C)?C:null,H3=C=>Math.round(C*100)/100});function Le(C,H){return typeof C=="number"&&Number.isFinite(C)&&C>=.01?C:H}function V3(C){let H=C.task??null,e=H?v0(H):null,t=e?e.consumesParts:H?.consumes_parts||[],r=!!H?.part_ref,i=C.objects.find(m=>m.entry_id===C.entryId),o=i?.parts||[],L=r?o.find(m=>m.id===H.part_ref.part_id):void 0,M=C.features?C.features.checklists:C.checklistsEnabled??!0,d=C.features?C.features.checklists?C.checklist??H?.checklist??[]:[]:C.checklist??[],p=C.features?C.features.adaptive&&(C.adaptiveEnabled??!!H?.adaptive_config?.enabled):!!C.adaptiveEnabled;return{entry_id:C.entryId,task_id:C.taskId,task_name:C.taskName,checklist:e?M?e.checklist:[]:d,adaptive_enabled:p,required_completion_fields:e?e.requiredFields:H?.required_completion_fields||[],task_type:H?.type||"",reading_unit:H?.reading_unit||"",readings:H?.readings||[],reading_history:I4(H?.history),parts:r?[]:W4({consumes_parts:t},C.entryId,C.objects,C.lang),consumes_parts:r?[]:t,phase_label:e?j1(H):"",require_tag_scan:!!H?.require_tag_scan,restock_default:r?Le(L?.restock_quantity,1):null,restock_unit_cost:r?L?.cost??null:null,restock_package:r&&L?.package_size?A2(L.package_size,L.unit,C.lang):"",currency_symbol:H2({currency_symbol:C.currencySymbol}),consumes_info:t.map(m=>z4(m,C.entryId,C.objects,C.lang)),checklist_prefill:H?.checklist_progress||{},via_tag_scan:!!C.viaTagScan,parts_cost_mode:r?r3(L,C.partsCostMode??"purchase",!!i?.object.battery_fleet):C.partsCostMode??"purchase",prefill:Q5(H)}}function i3(C,H,e){C.entryId=H.entry_id,C.taskId=H.task_id,C.taskName=H.task_name,C.lang=e,C.checklist=H.checklist??[],C.adaptiveEnabled=!!H.adaptive_enabled,C.requiredFields=H.required_completion_fields??[],C.taskType=H.task_type??"",C.readingUnit=H.reading_unit??"",C.readings=H.readings??[],C.readingHistory=H.reading_history??[],C.parts=H.parts??[],C.consumesParts=H.consumes_parts??[],C.phaseLabel=H.phase_label??"",C.requireTagScan=!!H.require_tag_scan,C.restockDefault=H.restock_default??null,C.restockUnitCost=H.restock_unit_cost??null,C.restockPackage=H.restock_package??"",C.currencySymbol=H2(H),C.consumesInfo=H.consumes_info??[],C.checklistPrefill=H.checklist_prefill??{},C.viaTagScan=!!H.via_tag_scan,C.partsCostMode=H.parts_cost_mode??"purchase",C.prefill=H.prefill??null,C.open({viaTagScan:!!H.via_tag_scan})}var o3=v(()=>{"use strict";o2();C3();t3();w();o5();x2()});function _0(){return window[x0]===!0}function K4(C){let H=window;if(H[x0]===C)return;H[x0]=C;let e=document.documentElement.style;for(let[t,r]of Object.entries(se))C?e.setProperty(t,r):e.removeProperty(t);window.dispatchEvent(new CustomEvent(ne))}function Me(C){return!!customElements.get(C)}function H1(C){return _0()&&Me(C)}function b1(C){return _0()?C:void 0}function Z1(C){return _0()?s:a`<div class="dialog-title">${C}</div>`}var x0,ne,se,V1=v(()=>{"use strict";k();x0="__msBetaUi",ne="ms-beta-ui-changed",se={"--ms-radius-6":"var(--ha-border-radius-md, 8px)","--ms-radius-10":"var(--ha-border-radius-lg, 12px)"}});function m1(C,H=y1){return C?C.is_admin?!0:H.operatorWriteEnabled&&H.operatorIds.includes(C.id):!1}var y1,Z2=v(()=>{"use strict";y1={operatorWriteEnabled:!1,operatorIds:[]}});var Y4,y2,X4,a5,L5,n5,g0,z1,S2,s5=v(()=>{"use strict";Y4={default_warning_days:[0,365],default_consumable_threshold:[1,90],battery_low_percent:[1,90],battery_recovered_percent:[20,100],battery_low_delay_minutes:[0,1440],archive_oneoff_days:[0,3650],delete_archived_oneoff_days:[0,3650],notify_due_soon_interval_hours:[0,720],notify_overdue_interval_hours:[0,720],notify_triggered_interval_hours:[0,720],max_notifications_per_day:[0,1e3],notification_bundle_threshold:[2,20],snooze_duration_hours:[1,168],warranty_reminder_days:[1,365],budget_alert_threshold:[10,100],currency_decimals:[0,3]},y2=[0,1440],X4=[1,1e4],a5=[0,365],L5=15,n5=[.1,.9],g0=[0,365],z1=[.01,1e4],S2=[.01,1e5]});function de(C){let[H,e]=Y4.default_warning_days,t=C?.general?.default_warning_days,r={...k2.features,...C?.features??{}};return{features:r,defaultWarningDays:typeof t=="number"&&Number.isFinite(t)&&t>=H&&t<=e?t:k2.defaultWarningDays,rowActionStyle:pe(C?.general?.row_action_style,C?.general?.row_action_style_set,r.beta_editor),access:{operatorWriteEnabled:C?.operator_write_enabled===!0,operatorIds:Array.isArray(C?.admin_panel_user_ids)?C.admin_panel_user_ids.filter(i=>typeof i=="string"):[]},budget:C?.budget??null,rowActionNoticePending:C?.general?.row_action_notice_pending===!0,refsInLists:C?.general?.ref_numbers_in_lists===!0,objectsTableColumns:Array.isArray(C?.objects_table_columns)?C.objects_table_columns:void 0,partsCostMode:G4(C?.budget?.parts_cost_mode),mirrorTodoDefault:Array.isArray(C?.general?.mirror_todo_default_entities)?C.general.mirror_todo_default_entities.filter(i=>typeof i=="string"&&i!==""):[]}}function pe(C,H,e){return H===!1&&e?"icons":le.includes(C??"")?C:k2.rowActionStyle}function J4(){let C=window;return C.__msSettingsCache??={promise:null}}function t1(C){let H=J4();if(H.promise)return H.promise;let e=C.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(t=>{let r=de(t);return K4(r.features.beta_editor),r}).catch(()=>(H.promise===e&&(H.promise=null),k2));return H.promise=e,e}function e9(){J4().promise=null}var le,k2,w2=v(()=>{"use strict";V1();Z2();s5();o5();le=["buttons_compact","buttons","icons"];k2={features:{adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact",access:y1,budget:null,rowActionNoticePending:!1,refsInLists:!1,objectsTableColumns:void 0,partsCostMode:"purchase",mirrorTodoDefault:[]}});var t9,C9,r9,H9,V9,i9,f0,o9,a9=v(()=>{t9="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",C9="M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z",r9="M20 21H4V10H6V19H18V10H20V21M3 3H21V9H3V3M9.5 11H14.5C14.78 11 15 11.22 15 11.5V13H9V11.5C9 11.22 9.22 11 9.5 11M5 5V7H19V5H5Z",H9="M23 7V13H21V7M21 15H23V17H21M12 2A2 2 0 0 0 10 4A2 2 0 0 0 10 4.29C7.12 5.14 5 7.82 5 11V17L3 19V20H21V19L19 17V11C19 7.82 16.88 5.14 14 4.29A2 2 0 0 0 14 4A2 2 0 0 0 12 2M10 21A2 2 0 0 0 12 23A2 2 0 0 0 14 21Z",V9="M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3M19 19H5V9H19V19M19 7H5V5H19V7Z",i9="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z",f0="M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z",o9="M13,16V8H15V16H13M9,16V8H11V16H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"});function M5(C){if(C.archived)return"archived";if(C.is_done)return"done";let H=C.status||"ok";return H==="ok"&&C.schedule_type==="manual"&&C.days_until_due==null?"no_due":H}function b0(C,H){return V(Ae[C]??C,H)}function O2(C){let H=M5(C);return H==="done"?ce:H==="no_due"?me:T1[H]||"var(--disabled-color, #9e9e9e)"}function ue(C){return C==="no_due"?"mdi:calendar-blank-outline":C5[C==="done"?"completed":C]||"mdi:circle-medium"}function he(C){return ve[ue(C)]??f0}function L9(C,H,e="pill"){let t=M5(C),r=b0(t,H);return e==="chip"?a`<span class="status-chip ${t}">${r}</span>`:a`<span class="status-badge ${t}" role="img" title="${r}" aria-label="${r}"><ha-svg-icon .path=${he(t)}></ha-svg-icon><span class="status-label">${r}</span></span>`}var ce,me,Ae,ve,a3=v(()=>{"use strict";k();a9();w();E1();ce="var(--maint-done-color, #78909c)",me="var(--secondary-text-color, #727272)";Ae={done:"completed",no_due:"no_due_date"};ve={"mdi:check-circle":i9,"mdi:alert-circle":t9,"mdi:alert-octagon":C9,"mdi:bell-alert":H9,"mdi:archive-outline":r9,"mdi:pause-circle-outline":o9,"mdi:calendar-blank-outline":V9,"mdi:circle-medium":f0}});function $(C){return C.toFixed(1)}var l5=v(()=>{"use strict";w();Y()});function d5(C,H){let e=C?.states?.[H]?.attributes?.friendly_name;return typeof e=="string"&&e?e:H}function L3(C){return C?Array.isArray(C.entity_ids)&&C.entity_ids.length>0?[...C.entity_ids]:C.entity_id?[C.entity_id]:[]:[]}function n3(C){if(!(!C||C.type==="compound"))return L3(C)[0]}function n9(C,H){let e=n3(H?.trigger_config),t=e?C?.states?.[e]?.attributes?.unit_of_measurement:void 0;return(typeof t=="string"?t:void 0)??H?.trigger_entity_info?.unit_of_measurement??""}function s9(C){return C?.trigger_config?.type==="state_change"}var s3=v(()=>{"use strict"});var Z0,l9,d9,y0=v(()=>{"use strict";Z0=["low","normal","high"],l9=[...Z0].reverse(),d9=["round_robin","least_completed","random"]});var z,p5=v(()=>{"use strict";k();D();V1();z=class extends Z{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}_onHaInput(e){e.stopPropagation(),this.value=e.target.value??"",this.dispatchEvent(new CustomEvent(e.type==="change"?"change":"input",{bubbles:!0,composed:!0,detail:{value:this.value}}))}render(){return!this.multiline&&H1("ha-input")?a`
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
        ></ha-input>`:a`
      <label class="field">
        ${this.label?a`<span class="label">${this.label}${this.required?a`<span class="req">*</span>`:s}</span>`:s}
        ${this.multiline?a`
        <textarea
          .value=${this.value??""}
          rows=${this.rows}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          @input=${this._onInput}
          @change=${this._onInput}
        ></textarea>`:a`
        <input
          .value=${this.value??""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step??s}
          min=${this.min??s}
          max=${this.max??s}
          pattern=${this.pattern??s}
          @input=${this._onInput}
          @change=${this._onInput}
        />`}
        ${this.helper?a`<span class="helper">${this.helper}</span>`:s}
      </label>
    `}};z.styles=g`
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
  `,n([u()],z.prototype,"label",2),n([u()],z.prototype,"value",2),n([u()],z.prototype,"placeholder",2),n([u()],z.prototype,"type",2),n([u({type:Boolean})],z.prototype,"required",2),n([u({type:Boolean})],z.prototype,"disabled",2),n([u()],z.prototype,"step",2),n([u()],z.prototype,"min",2),n([u()],z.prototype,"max",2),n([u()],z.prototype,"pattern",2),n([u()],z.prototype,"helper",2),n([u({type:Boolean})],z.prototype,"multiline",2),n([u({type:Number})],z.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",z)});var S0,$2,k0=v(()=>{"use strict";S0=["notes","cost","duration","photo","user"],$2={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"}});function c5(C){if(!C)return[];let H=[],e=C.photo_doc_id;typeof e=="string"&&H.push(e);let t=C.photo_doc_ids;Array.isArray(t)&&H.push(...t);let r=[];for(let i of H){if(typeof i!="string")continue;let o=i.trim();if(!(!o||r.includes(o))&&(r.push(o),r.length>=10))break}return r}var m5=v(()=>{"use strict"});async function xe(C,H,e){let t=C.auth;if(t?.expired&&t.refreshAccessToken)try{await t.refreshAccessToken()}catch{}return fetch(H,{...e,headers:{...e.headers??{},Authorization:`Bearer ${t?.data?.access_token??""}`}})}async function ge(C,H,e,t="doc_too_large",r=[]){let i=await xe(C,H,{method:"POST",body:e});if(i.status===413)throw new Error(t);if(!i.ok){let o=await i.json().catch(()=>null);throw typeof o?.code=="string"&&r.includes(o.code)?new Error(o.code):new Error("doc_upload_failed")}return await i.json()}async function fe(C,H,e,t,r){if(e.size>_e)throw new Error("doc_too_large");let i=new FormData;i.append("entry_id",H);for(let L of t)i.append("tags",L);r&&i.append("purpose",r),i.append("file",e,e.name);let o=await ge(C,"/api/maintenance_supporter/document/upload",i);if(!o.id)throw new Error("doc_upload_failed");return{id:o.id,deduped:!!o.deduped,duplicate_in_object:o.duplicate_in_object??null}}async function c9(C,H,e){return(await fe(C,H,e,["photo"],"completion")).id}async function w0(C,H,e){await Promise.all(e.map(t=>C.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:H,doc_id:t}).catch(()=>{})))}var _e,GH,m9=v(()=>{"use strict";m5();_e=100*1024*1024,GH=500*1024*1024});var T2,O0=v(()=>{"use strict";w();m9();T2=class{constructor(H,e){this.host=H;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,H.addController(this)}hostConnected(){}get ids(){return this.photos.map(H=>H.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(H){return this.errorKey?V(this.errorKey,H).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(H=[]){this._endSession(),this._revokeAll(),this.photos=H.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(H){if(H.length===0)return;let e=this._session,t=this.opts.hass(),r=this.opts.entryId(),i=H.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let o of i){let L=await c9(t,r,o);if(e!==this._session){w0(t,r,[L]);return}this.uploadedIds=[...this.uploadedIds,L],this._uploadEntry.set(L,r),this.photos=[...this.photos,{id:L,preview:URL.createObjectURL(o)}],this.host.requestUpdate()}H.length>i.length&&(this.errorKey="photos_limit")}catch(o){if(e!==this._session)return;this.errorKey=o instanceof Error&&o.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(H){let e=this.photos.find(t=>t.id===H);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==H),this.uploadedIds.includes(H)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==H),this._discard([H])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let H=this.uploadedIds;this.uploadedIds=[],this._discard(H)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(H){let e=new Map;for(let r of H){let i=this._uploadEntry.get(r)??this.opts.entryId();this._uploadEntry.delete(r),e.set(i,[...e.get(i)??[],r])}let t=this.opts.hass();for(let[r,i]of e)w0(t,r,i)}_revokeAll(){for(let H of this.photos)H.preview&&URL.revokeObjectURL(H.preview)}}});function a2(C){let H=(C??"").trim();if(H==="")return null;let e=Number(H.replace(",","."));return!Number.isFinite(e)||e<0?null:Math.round(e)}var M3=v(()=>{"use strict"});function be(C){let e=P("2001-02-03",C).match(/\d+/g)||[],t=L=>e.findIndex(M=>Number(M)===L),r=t(2001),i=t(2),o=t(3);return r===0?"YMD":i>=0&&o>=0&&i<o?"MDY":"DMY"}function E2(C,H,e){if(C<1e3||C>9999||H<1||H>12||e<1||e>31)return null;let t=new Date(C,H-1,e);return t.getFullYear()!==C||t.getMonth()!==H-1||t.getDate()!==e?null:`${C}-${String(H).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function A9(C,H){let e=C.trim(),t;if(t=e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))return E2(+t[1],+t[2],+t[3]);if(t=e.match(/^(\d{4})$/))return E2(+t[1],1,1);if(t=e.match(/^(\d{1,2})[./](\d{4})$/))return E2(+t[2],+t[1],1);if(t=e.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))return E2(+t[3],+t[2],+t[1]);if(t=e.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)){let r=+t[1],i=+t[2],o=+t[3];return be(H)==="MDY"?E2(o,r,i):E2(o,i,r)}return null}var u9=v(()=>{"use strict";w()});function Ze(C,H){if(H)switch(C){case"date":return H.split("T")[0];case"time":return H.length===5?`${H}:00`:H;case"datetime":{let[e,t="00:00:00"]=H.split("T");return`${e} ${t.length===5?`${t}:00`:t}`}}}function ye(C,H){if(typeof H!="string"||!H)return"";switch(C){case"date":return H.slice(0,10);case"time":return H.slice(0,5);case"datetime":{let[e,t="00:00:00"]=H.split(" ");return`${e}T${t.length===5?`${t}:00`:t}`}}}var W,P2=v(()=>{"use strict";k();D();w();u9();W=class extends Z{constructor(){super(...arguments);this.kind="date";this.label="";this.value="";this.clearable=!1;this.disabled=!1;this.required=!1;this.lang="en";this._typing=!1;this._typed="";this._typedInvalid=!1}_startTyping(){this._typed=this.value,this._typedInvalid=!1,this._typing=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input.typed")?.focus())}_commitTyped(){if(!this._typed.trim()){this._typing=!1;return}let e=A9(this._typed,this.lang);if(!e){this._typedInvalid=!0;return}this._typing=!1,this._typedInvalid=!1,this._emit(e)}_onTypedKey(e){e.key==="Enter"?(e.preventDefault(),this._commitTyped()):e.key==="Escape"&&(e.preventDefault(),this._typing=!1,this._typedInvalid=!1)}_selector(){switch(this.kind){case"date":return{date:{}};case"time":return{time:{no_second:!0}};case"datetime":return{datetime:{}}}}_onSelectorChange(e){e.stopPropagation(),this._emit(ye(this.kind,e.detail?.value))}_clear(){this._emit("")}_emit(e){e!==this.value&&(this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}})))}render(){return a`
      <div class="field">
        ${this.label?a`<span class="label">${this.label}${this.required?a`<span class="req">*</span>`:s}</span>`:s}
        <div class="row">
          ${this._typing?a`<input class="typed" type="text" inputmode="numeric" autocomplete="off"
                .value=${this._typed}
                placeholder=${P("1978-03-15",this.lang)}
                aria-invalid=${this._typedInvalid?"true":"false"}
                @input=${e=>{this._typed=e.target.value,this._typedInvalid=!1}}
                @keydown=${this._onTypedKey}
                @blur=${this._commitTyped} />`:a`<ha-selector
                .hass=${this.hass}
                .selector=${this._selector()}
                .value=${Ze(this.kind,this.value)}
                .required=${this.required}
                .disabled=${this.disabled}
                @value-changed=${this._onSelectorChange}
              ></ha-selector>`}
          ${this.kind==="date"&&!this.disabled&&!this._typing?a`<button type="button" class="type-toggle" title=${V("date_type_toggle",this.lang)} aria-label=${V("date_type_toggle",this.lang)} @click=${this._startTyping}>
                <ha-icon icon="mdi:keyboard-outline"></ha-icon>
              </button>`:s}
          ${this.clearable&&this.value&&!this.disabled&&!this._typing?a`<button type="button" class="clear" title=${V("clear",this.lang)} aria-label=${V("clear",this.lang)} @click=${this._clear}>
                <ha-icon icon="mdi:close"></ha-icon>
              </button>`:s}
        </div>
        ${this._typedInvalid?a`<span class="helper invalid">${V("date_type_invalid",this.lang)}</span>`:this.helper?a`<span class="helper">${this.helper}</span>`:s}
      </div>
    `}};W.styles=g`
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
  `,n([u({attribute:!1})],W.prototype,"hass",2),n([u()],W.prototype,"kind",2),n([u()],W.prototype,"label",2),n([u()],W.prototype,"value",2),n([u()],W.prototype,"helper",2),n([u({type:Boolean})],W.prototype,"clearable",2),n([u({type:Boolean})],W.prototype,"disabled",2),n([u({type:Boolean})],W.prototype,"required",2),n([u()],W.prototype,"lang",2),n([l()],W.prototype,"_typing",2),n([l()],W.prototype,"_typed",2),n([l()],W.prototype,"_typedInvalid",2);customElements.get("ms-date-field")||customElements.define("ms-date-field",W)});var W1,l3=v(()=>{"use strict";k();D();w();W1=class extends Z{constructor(){super(...arguments);this.value="";this.lang="en";this._credit=!1;this._amount=""}willUpdate(e){if(!e.has("value"))return;let t=(this.value??"").trim();if(t===this._signed())return;let r=parseFloat(t);if(t===""||Number.isNaN(r)){this._amount="",this._credit=!1;return}this._credit=r<0,this._amount=String(Math.abs(r))}_signed(){let e=this._amount.trim();return e===""?"":this._credit?`-${e}`:e}_emit(){this.value=this._signed(),this.dispatchEvent(new CustomEvent("value-changed",{detail:{value:this.value},bubbles:!0,composed:!0}))}_setCredit(e){this._credit!==e&&(this._credit=e,this._emit())}_onInput(e){let t=e.target.value;t.startsWith("-")&&(this._credit=!0),this._amount=t.replace(/^-+/,""),this._emit()}render(){let e=this.lang;return a`
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
      ${this._credit?a`<div class="hint">${V("cost_credit_hint",e)}</div>`:s}
    `}};W1.styles=[N1,g`
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
    `],n([u()],W1.prototype,"value",2),n([u()],W1.prototype,"lang",2),n([l()],W1.prototype,"_credit",2),n([l()],W1.prototype,"_amount",2);customElements.get("ms-cost-input")||customElements.define("ms-cost-input",W1)});function d3(){if(window.externalApp!==void 0)return!0;let H=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(H)&&/Android/.test(H)}var $0=v(()=>{"use strict"});var cV,p3,Se,v9,T0=v(()=>{C2();({I:cV}=y7),p3=C=>C.strings===void 0,Se={},v9=(C,H=Se)=>C._$AH=H});var S1,A5,R2,u5=v(()=>{S1={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},A5=C=>(...H)=>({_$litDirective$:C,values:H}),R2=class{constructor(H){}get _$AU(){return this._$AM._$AU}_$AT(H,e,t){this._$Ct=H,this._$AM=e,this._$Ci=t}_$AS(H,e){return this.update(H,e)}update(H,e){return this.render(...e)}}});function ke(C){this._$AN!==void 0?(c3(this),this._$AM=C,h9(this)):this._$AM=C}function we(C,H=!1,e=0){let t=this._$AH,r=this._$AN;if(r!==void 0&&r.size!==0)if(H)if(Array.isArray(t))for(let i=e;i<t.length;i++)v5(t[i],!1),c3(t[i]);else t!=null&&(v5(t,!1),c3(t));else v5(this,C)}var v5,c3,h9,Oe,m3,x9=v(()=>{T0();u5();u5();v5=(C,H)=>{let e=C._$AN;if(e===void 0)return!1;for(let t of e)t._$AO?.(H,!1),v5(t,H);return!0},c3=C=>{let H,e;do{if((H=C._$AM)===void 0)break;e=H._$AN,e.delete(C),C=H}while(e?.size===0)},h9=C=>{for(let H;H=C._$AM;C=H){let e=H._$AN;if(e===void 0)H._$AN=e=new Set;else if(e.has(C))break;e.add(C),Oe(H)}};Oe=C=>{C.type==S1.CHILD&&(C._$AP??=we,C._$AQ??=ke)},m3=class extends R2{constructor(){super(...arguments),this._$AN=void 0}_$AT(H,e,t){super._$AT(H,e,t),h9(this),this.isConnected=H._$AU}_$AO(H,e=!0){H!==this.isConnected&&(this.isConnected=H,H?this.reconnected?.():this.disconnected?.()),e&&(v5(this,H),c3(this))}setValue(H){if(p3(this._$Ct))this._$Ct._$AI(H,this);else{let e=[...this._$Ct._$AH];e[this._$Ci]=H,this._$Ct._$AI(e,this,0)}}disconnected(){}reconnected(){}}});var E0,B2,_9=v(()=>{C2();x9();u5();E0=new WeakMap,B2=A5(class extends m3{render(C){return s}update(C,[H]){let e=H!==this.G;return e&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=H,this.ht=C.options?.host,this.rt(this.ct=C.element)),s}rt(C){if(this.G!==void 0)if(this.isConnected||(C=void 0),typeof this.G=="function"){let H=this.ht??globalThis,e=E0.get(H);e===void 0&&(e=new WeakMap,E0.set(H,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,C),C!==void 0&&this.G.call(this.ht,C)}else this.G.value=C}get lt(){return typeof this.G=="function"?E0.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}})});var A3=v(()=>{_9()});function $e(C){!(C instanceof HTMLElement)||typeof C.showPopover!="function"||queueMicrotask(()=>{if(!(!C.isConnected||C.matches(":popover-open")))try{C.showPopover()}catch{}})}var u3,v3,P0=v(()=>{"use strict";k();A3();u3=B2($e),v3=g`
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
`});function h5(C){try{return localStorage.getItem(C)}catch{return null}}function x5(C,H){try{localStorage.setItem(C,H)}catch{}}var U1,R0=v(()=>{"use strict";U1={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort",areaSort:"msp-area-sort",objectTreeOpen:"msp-object-tree-open",objectTableSort:"msp-object-table-sort",filterPane:"msp-filter-pane"}});function M1(C,H){return H1("ha-expansion-panel")?a`
      <ha-expansion-panel class=${C.cls??""} outlined .expanded=${!!C.open}
        @expanded-changed=${e=>{e.target===e.currentTarget&&C.onToggle?.(e.detail.expanded)}}>
        <div slot="header" class=${C.headerCls??"collapsible-header"}>${C.header}</div>
        ${H}
      </ha-expansion-panel>`:a`<details class=${C.cls??""} ?open=${!!C.open}
    @toggle=${C.onToggle?e=>C.onToggle(e.target.open):s}><summary class=${C.headerCls??s}>${C.header}</summary>${H}</details>`}var h3=v(()=>{"use strict";k();V1()});function S9(){if(!d3())return!1;let C=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!C&&typeof C.getUserMedia=="function"}function b9(C){let H=/camera2?\s*(\d+)/i.exec(C);return H?Number(H[1]):Number.MAX_SAFE_INTEGER}function Z9(C,H){if(H){let t=C.find(r=>r.label===H);if(t)return t}return C.filter(t=>t.label&&k9.test(t.label)).sort((t,r)=>b9(t.label)-b9(r.label))[0]??null}var Te,Ee,Pe,Re,g9,k9,f9,y9,Be,i1,B0=v(()=>{"use strict";k();D();w();$0();P0();R0();h3();Te=1920,Ee=.88,Pe={retryMs:500,windowMs:5e3},Re=new Set(["NotReadableError","AbortError","TrackStartError"]),g9=80,k9=/back|rear|environment|rück|hinten/i,f9=/front|user|selfie|vorne/i;y9=C=>C?.name||"Error",Be=C=>C?.message||"",i1=class extends Z{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...Pe};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let r=h5(U1.cameraLabel),i=await this._enumerate(t);if(!this._live(e))return;let o=Z9(i,r),L="refused";if(o&&(L=await this._openPatiently(t,e,this._byDevice(o))),L==="cancelled")return;if(L!=="ok"){if(L=await this._openPatiently(t,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),L==="cancelled")return;if(L!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(i=await this._enumerate(t),!this._live(e)){this._stopStream();return}}if(this._devices=i,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let M=o?null:Z9(i,r),d=this._deviceIndex>=0?i[this._deviceIndex]:void 0;if(!M||M.deviceId===d?.deviceId)return;let p=await this._replace(t,e,[this._byDevice(M)],this._restoreCandidates(d));if(p!=="cancelled"){if(p==="lost"){this._unavailable("camera_lost");return}this._settle(p)}}async _openPatiently(e,t,r){let i=Date.now();for(;;){let o;try{o=await e.getUserMedia({video:r.video,audio:!1})}catch(L){let M=y9(L),d=Be(L);if(this._lastError=M,this._note(`${r.what} \u2192 ${M}${d&&d!==M?`: ${d}`:""}`),!this._live(t))return"cancelled";if(!Re.has(M))return"refused";if(Date.now()-i+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(p=>setTimeout(p,this.timing.retryMs)),!this._live(t))return"cancelled";continue}if(!this._live(t)){for(let L of o.getTracks())L.stop();return"cancelled"}return this._stream=o,this._note(`${r.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,t,r,i){this._switching=!0,this._stopStream();try{for(let o of r){let L=await this._openPatiently(e,t,o);if(L==="ok")return o;if(L==="cancelled")return L;if(L==="busy"){o.deviceId&&this._refused.add(o.deviceId);break}}for(let o of i){let L=await this._openPatiently(e,t,o);if(L==="ok")return"restored";if(L==="cancelled")return L}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let r=this._indexOfCurrent();return r>=0&&(this._deviceIndex=r),this._attach(),!1}this._switchFailed=!1;let t=e.deviceId?this._devices.findIndex(r=>r.deviceId===e.deviceId):-1;return this._deviceIndex=t>=0?t:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,t){let r=[],i=e?.deviceId||t;return i&&r.push({video:{deviceId:{exact:i}},what:`${e?.label||"previous camera"} (back again)`,deviceId:i}),r.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),r}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let t=(await e.enumerateDevices()).filter(r=>r.kind==="videoinput"&&!!r.deviceId);return this._note(`cameras: ${t.map(r=>r.label||"(no label)").join(" | ")||"none listed"}`),t}catch(t){return this._note(`enumerateDevices \u2192 ${y9(t)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let t=e.getSettings().deviceId,r=t?this._devices.findIndex(i=>i.deviceId===t):-1;return r>=0?r:e.label?this._devices.findIndex(i=>i.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],t=e?.getSettings().facingMode;if(t==="user"||t==="environment")return t;let r=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return f9.test(r)?"user":k9.test(r)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let t=e.getSettings(),r=t.width&&t.height?`${t.width}\xD7${t.height}`:"size ?";return[e.label||"no label",r,t.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>g9&&this._log.splice(1,this._log.length-g9)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let t=this._gen,r=this._deviceIndex,i=r>=0?this._devices[r]:void 0,o=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||i?.deviceId,L=this._facing==="user"?"environment":"user",M=this._nextCameras(r,o);!M.length&&this._refused.size&&(this._refused.clear(),M=this._nextCameras(r,o)),this._note(`switch from ${i?.label||"unknown camera"}`);let d=[...M.map(p=>this._byDevice(this._devices[p])),{video:{facingMode:{exact:L}},what:`facing ${L} (exact)`},{video:{facingMode:{ideal:L}},what:`facing ${L}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let p=await this._replace(e,t,d,this._restoreCandidates(i,o));if(p==="cancelled")return;if(p==="lost"){this._unavailable("camera_lost");return}if(p!=="restored"&&!p.deviceId){if(this._isCamera(o,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=L}if(this._settle(p)&&p!=="restored"&&p.deviceId){let m=this._devices[this._deviceIndex]?.label??"";m&&x5(U1.cameraLabel,f9.test(m)?"":m)}}finally{this._busy=!1}}_nextCameras(e,t){let r=this._devices.length,i=[];for(let o=1;o<=(e<0?r:r-1);o++){let L=(e+o)%r,M=this._devices[L].deviceId;M===t||this._refused.has(M)||i.push(L)}return i}_isCamera(e,t){let r=this._stream?.getVideoTracks()[0]?.getSettings();return e&&r?.deviceId?r.deviceId===e:!!r?.facingMode&&r.facingMode===t}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),t=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),t=!0)}catch{}if(!t){let r=this.shadowRoot?.querySelector(".details textarea");if(r){r.focus(),r.select();try{t=document.execCommand("copy")}catch{t=!1}}}this._copied=t}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let t=e.videoWidth||640,r=e.videoHeight||480,i=Math.min(1,Te/Math.max(t,r)),o=document.createElement("canvas");o.width=Math.round(t*i),o.height=Math.round(r*i);let L=o.getContext("2d");if(!L)throw new Error("no_canvas");L.drawImage(e,0,0,o.width,o.height);let M=await new Promise(m=>o.toBlob(m,"image/jpeg",Ee));if(!M)throw new Error("no_blob");let d=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),p=new File([M],`photo-${d}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:p},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return s;let e=this.lang,t=this._busy||this._switching;return a`
      <div class="overlay top-layer" popover="manual" ${u3} role="dialog" aria-modal="true" aria-label=${V("doc_camera",e)}>
        <video autoplay playsinline muted></video>
        ${this._switching?a`<div class="switching" role="status">${V("camera_switching",e)}</div>`:s}
        ${this._switchFailed?a`<div class="switch-note" role="status">
              <div>${V("camera_not_answered",e)}</div>
              ${M1({cls:"details",header:V("camera_diagnostics",e)},a`
                <textarea readonly rows="6" .value=${this._log.join(`
`)}></textarea>
                <button type="button" class="copy" @click=${this._copyLog}>${V(this._copied?"camera_copied":"camera_copy",e)}</button>
              `)}
            </div>`:s}
        <div class="bar">
          <button type="button" class="cancel" @click=${this.close}>${V("cancel",e)}</button>
          ${this._devices.length>1?a`<button type="button" class="switch" ?disabled=${t} title=${V("camera_switch_lens",e)} aria-label=${V("camera_switch_lens",e)} @click=${this._switchCamera}>
                <ha-icon icon="mdi:camera-flip-outline"></ha-icon>
                <span class="switch-pos">${this._deviceIndex>=0?`${this._deviceIndex+1}/${this._devices.length}`:`?/${this._devices.length}`}</span>
              </button>`:s}
          <button type="button" class="shoot" ?disabled=${t} @click=${this._shoot}>
            <ha-icon icon="mdi:camera"></ha-icon><span>${V("camera_capture_shoot",e)}</span>
          </button>
        </div>
      </div>
    `}};i1.styles=[v3,g`
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
  `],n([u({type:String})],i1.prototype,"lang",2),n([l()],i1.prototype,"_open",2),n([l()],i1.prototype,"_busy",2),n([l()],i1.prototype,"_switching",2),n([l()],i1.prototype,"_devices",2),n([l()],i1.prototype,"_deviceIndex",2),n([l()],i1.prototype,"_switchFailed",2),n([l()],i1.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",i1)});var x3,o1,_5=v(()=>{"use strict";k();D();w();$0();B0();B0();x3=g`
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
`,o1=class extends Z{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=d3();this._inAppCamera=S9()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,r=Array.from(t.files??[]);t.value="",this._emit(r)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return s;let e=this.lang,t=this._locked?"disabled":"",r=this.busy?V("uploading",e):V("doc_camera",e),i=V(this._singlePick?"choose_photo":"choose_photos",e);return a`
      <div class="photo-pickers">
        ${this.showCamera?a`<label class="photo-pick photo-pick-camera ${t}" role="button" tabindex="0"
              aria-label=${r} title=${this.compact?r:s}
              @click=${this._onCameraClick} @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:camera"></ha-icon>
              ${this.compact?s:a`<span>${r}</span>`}
              <input type="file" accept=${this.accept} capture="environment"
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:s}
        ${this.showGallery?a`<label class="photo-pick photo-pick-gallery ${t}" role="button" tabindex="0"
              aria-label=${i} title=${this.compact?i:s}
              @keydown=${this._onKeydown}>
              <ha-icon icon="mdi:image-multiple"></ha-icon>
              ${this.compact?s:a`<span>${i}</span>`}
              <input type="file" accept=${this.accept} ?multiple=${!this._singlePick}
                ?disabled=${this._locked} @change=${this._onInput} />
            </label>`:s}
      </div>
      ${this.showGallery&&this._singlePick?a`<div class="photo-android-hint">${V("photos_android_hint",e)}</div>`:s}
      ${this.showCamera&&this._inAppCamera?a`<ms-camera-capture .lang=${e}
            @photo-captured=${o=>this._emit([o.detail.file])}
            @capture-unavailable=${this._onCameraUnavailable}></ms-camera-capture>`:s}
    `}};n([u({type:String})],o1.prototype,"lang",2),n([u({type:Boolean})],o1.prototype,"disabled",2),n([u({type:Boolean})],o1.prototype,"busy",2),n([u({type:String})],o1.prototype,"accept",2),n([u({type:Boolean})],o1.prototype,"showCamera",2),n([u({type:Boolean})],o1.prototype,"showGallery",2),n([u({type:Boolean})],o1.prototype,"compact",2),n([u({type:Number})],o1.prototype,"remaining",2),n([l()],o1.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",o1)});function j(C,H){return H1("ha-alert")?a`<ha-alert alert-type=${C} class="notice notice-${C}">${H}</ha-alert>`:a`<div class=${C==="warning"?"error warning":"error"}>${H}</div>`}var G1=v(()=>{"use strict";k();V1()});function E(C,H){if(H1("ha-checkbox")){let t=a`<ha-checkbox .checked=${C.checked} .disabled=${!!C.disabled} @change=${C.onChange}>${H}</ha-checkbox>`;return C.cls?a`<span class=${C.cls}>${t}</span>`:t}let e=a`<input type="checkbox" class=${C.inputCls??s} .checked=${C.checked} ?disabled=${!!C.disabled} @change=${C.onChange} />`;return C.boxAfter?a`<label class=${C.cls??s}>${H}${e}</label>`:a`<label class=${C.cls??s}>${e}${H}</label>`}var g5=v(()=>{"use strict";k();V1()});var I2,S,I0=v(()=>{"use strict";k();D();o2();w();p1();h2();Y();s5();C3();o5();k0();O0();M3();P2();l3();_5();_5();V1();G1();g5();I2=z1,S=class extends Z{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new T2(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={};this.prefill=null}open(e={}){if(this._open)return;this._open=!0,this.viaTagScan=!!e.viaTagScan;let t=this.prefill;this._notes=t?.notes??"",this._cost=t?.cost!=null?String(t.cost):"",this._duration=t?.duration!=null?String(t.duration):"",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((r,i)=>[String(i),!!this.checklistPrefill[r]]).filter(([,r])=>r)),this._feedback=t?.feedback??"needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(r=>[c1(r),{...r}])),this._usedQtyText={}}_rangeError(e,t){let r=this.lang;return V("settings_value_out_of_range",r).replace("{min}",f(e,r,{maximumFractionDigits:2})).replace("{max}",f(t,r,{maximumFractionDigits:2}))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId},t=this._notes.trim();if(t&&(e.notes=t),this._cost){let M=parseFloat(this._cost);isNaN(M)||(e.cost=M)}let r=a2(this._duration);if(r!==null&&(e.duration=r),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(Q(this._completedAt)>Date.now()){this._error=V("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let M={};for(let d of this.readings){let p=(this._readingValues[d.id]??"").trim();if(p==="")continue;let m=parseFloat(p.replace(",","."));isNaN(m)||(M[d.id]=m)}Object.keys(M).length>0&&(e.reading_values=M)}else if(this._readingValue!==""){let M=parseFloat(this._readingValue);isNaN(M)||(e.reading_value=M)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let M=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(M)||M<S2[0]||M>S2[1]){this._error=this._rangeError(...S2);return}e.restock_quantity=M}if(this.parts.length>0){let M=[];for(let[d,p]of Object.entries(this._usedParts)){let m=this._usedQtyText[d],A=m===void 0?p.quantity:parseFloat(m.replace(",","."));if(!Number.isFinite(A)||A<I2[0]||A>I2[1]){this._error=this._rangeError(...I2);return}M.push({...p,quantity:A})}e.used_parts=M.map(d=>d.entry_id?{part_id:d.part_id,quantity:d.quantity,entry_id:d.entry_id}:{part_id:d.part_id,quantity:d.quantity})}let i=await F(this,e,{busy:M=>{this._loading=M},lang:this.lang,fallbackKey:"save_error",onError:M=>{this._error=M}});if(i===void 0)return;let o=G5(i,this.lang);if(o){this._close(),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:o},bubbles:!0,composed:!0}));return}this._photos.markAttached(),this._open=!1;let L={entryId:this.entryId,taskId:this.taskId,taskName:this.taskName,undo:i?.undo===!0};this.dispatchEvent(new CustomEvent("task-completed",{detail:L}))}_renderReadingField(e,t){let r=this._completedAt?Q(this._completedAt):NaN,i=F4(this.readingHistory,e.id,isNaN(r)?void 0:r),o=e.unit||this.readingUnit,L=(this._readingValues[e.id]??"").trim(),M=L===""?NaN:parseFloat(L.replace(",",".")),d=i!==void 0&&!isNaN(M)&&M<i.value,p=i!==void 0?f(i.value,t,{maximumFractionDigits:3}):"";return a`
      <label class="field reading-field">
        <span class="field-label">${e.name}${o?` (${o})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${i!==void 0?V("reading_last",t).replace("{value}",p):""}
          .value=${this._readingValues[e.id]??""}
          @input=${m=>{this._readingValues={...this._readingValues,[e.id]:m.target.value}}} />
        ${d?a`<span class="reading-warn">${V("reading_below_last",t).replace("{value}",p)}</span>`:s}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_demands(e){return this.requiredFields.includes(e)}_req(e){return this._demands(e)?a`<span class="req-mark" aria-hidden="true">*</span>`:s}_purchaseSuggestion(){if(this.restockDefault===null)return null;let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:H3(this.restockUnitCost*e)}_partsValues(){let e={booked:null,info:null};if(this.restockDefault!==null||!this.parts.length)return e;for(let t of Object.values(this._usedParts)){let r=this.parts.find(L=>c1({part_id:L.id,entry_id:L.entry_id})===c1(t)),i=Q4(r);if(i===null)continue;let o=r3(r,this.partsCostMode)==="use"?"booked":"info";e[o]=(e[o]??0)+i*(t.quantity||1)}for(let t of["booked","info"])e[t]!==null&&(e[t]=H3(e[t]));return e}_renderCostSuggestion(e){let t=this._purchaseSuggestion();if(this.restockDefault!==null){let L=this.partsCostMode==="use"?a`<div class="cost-note">${V("cost_purchase_use_hint",e)}</div>`:s;if(this._cost.trim()!==""||t==null||t<=0)return L;let M=J(t,this.currencySymbol,e);return a`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(H3(t))}
        >${V("cost_from_parts",e).replace("{amount}",M)}</button>${L}`}let{booked:r,info:i}=this._partsValues(),o=(L,M)=>L!=null&&L>0?a`<div class="cost-note">${V(M,e).replace("{amount}",J(L,this.currencySymbol,e))}</div>`:s;return a`${o(r,"cost_parts_booked")}${o(i,"cost_parts_info")}`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=`${Q7()}:00`}render(){if(!this._open)return a``;let e=this.lang||T(this.hass),t=this._error||this._photos.errorText(e);return a`
      <ha-dialog open .headerTitle=${b1(`${V("complete_title",e)}${this.taskName}`)} @closed=${this._close}>
        ${Z1(`${V("complete_title",e)}${this.taskName}`)}
        ${this.phaseLabel?a`<div class="phase-line">${V("phase_current",e)}: ${this.phaseLabel}</div>`:s}
        ${this.requireTagScan&&!this.viaTagScan?a`<div class="scan-required-note">${V("require_tag_scan_hint",e)}</div>`:s}
        <div class="content">
          ${t?j("error",t):s}
          ${this.checklist.length>0?a`
            <div class="checklist-section">
              <label class="checklist-label">${V("checklist",e)}</label>
              ${this.checklist.map((r,i)=>a`
                ${E({cls:"checklist-item",checked:!!this._checklistState[String(i)],onChange:()=>this._toggleCheck(i)},a`<span>${r}</span>`)}
              `)}
            </div>
          `:s}
          ${this.readings.length>0?a`<div class="readings-block">
                <span class="field-label">${V("readings_section",e)}</span>
                ${this.readings.map(r=>this._renderReadingField(r,e))}
              </div>`:this.taskType==="reading"?a`
              <label class="field">
                <span class="field-label">${V("reading_value_label",e)}${this.readingUnit?` (${this.readingUnit})`:""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${r=>this._readingValue=r.target.value} />
              </label>`:s}
          ${this.parts.length?a`<div class="used-parts">
                <span class="field-label">${V("complete_parts_used",e)}</span>
                ${this.parts.map(r=>{let i=c1({part_id:r.id,entry_id:r.entry_id}),o=this._usedParts[i],L=o!==void 0,M=r.entry_id?{part_id:r.id,quantity:1,entry_id:r.entry_id}:{part_id:r.id,quantity:1};return a`<div class="used-part-row">
                    ${E({cls:"used-part-check",checked:L,onChange:d=>{let p={...this._usedParts};if(d.target.checked)p[i]=p[i]||M;else{delete p[i];let m={...this._usedQtyText};delete m[i],this._usedQtyText=m}this._usedParts=p}},a`<span
                        >${r.name}${r.owner_name?a`<span class="used-part-owner"> (${r.owner_name})</span>`:s}${r.stock!==null&&r.stock!==void 0?` (${A2(r.stock,r.unit,e)})`:""}</span
                      >`)}
                    ${L?a`<input class="used-part-qty" type="number" min=${I2[0]} max=${I2[1]} step="0.01"
                          .value=${this._usedQtyText[i]??String(o.quantity)}
                          @input=${d=>{let p=d.target.value;this._usedQtyText={...this._usedQtyText,[i]:p};let m=parseFloat(p.replace(",","."));Number.isFinite(m)&&m>=I2[0]&&(this._usedParts={...this._usedParts,[i]:{...M,quantity:m}})}} />`:s}
                  </div>`})}
              </div>`:this.consumesInfo.length?a`<div class="consumes-hint">
                  ${this.consumesInfo.map(r=>a`<div>${r}</div>`)}
                </div>`:s}
          ${this.restockDefault!==null?a`
              <label class="field">
                <span class="field-label">${V("restock_quantity_label",e)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${S2[0]} max=${S2[1]} class="field-input"
                  .value=${this._restockQty}
                  @input=${r=>this._restockQty=r.target.value} />
              </label>`:s}
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
              @input=${r=>this._notes=r.target.value}></textarea>
          </label>
          <div class="field">
            <span class="field-label">${this._demands("cost")?V("cost",e):V("cost_optional",e)}${this._req("cost")}</span>
            <ms-cost-input .lang=${e} .value=${this._cost}
              @value-changed=${r=>this._cost=r.detail.value}></ms-cost-input>
            ${this._renderCostSuggestion(e)}
          </div>
          <label class="field">
            <span class="field-label">${this._demands("duration")?V("quick_complete_defaults_duration",e):V("duration_minutes",e)}${this._req("duration")}</span>
            <input type="number" step="1" min="0" inputmode="numeric" class="field-input"
              .value=${this._duration}
              @input=${r=>this._duration=r.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${V("completed_at_optional",e)}</span>
            ${this._completedAt?a`<ms-date-field
                  kind="datetime"
                  clearable
                  .hass=${this.hass}
                  .lang=${e}
                  .value=${this._completedAt}
                  .helper=${W5(e)}
                  @value-changed=${r=>this._completedAt=r.detail.value}
                ></ms-date-field>`:a`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${V("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${this._demands("photo")?V("completion_photos",e):V("completion_photos_optional",e)}${this._req("photo")}</span>
            ${this._photos.photos.length>0?a`<div class="photo-strip">
                  ${this._photos.photos.map(r=>a`
                    <div class="photo-preview">
                      <img src=${r.preview} alt="" />
                      <button type="button" class="photo-remove" @click=${()=>this._photos.remove(r.id)}
                        title="${V("remove",e)}">✕</button>
                    </div>`)}
                </div>`:s}
            ${this._photos.full?a`<div class="photo-limit">${V("photos_limit",e).replace("{max}",String(this._photos.max))}</div>`:a`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                  @files-picked=${r=>this._photos.addFiles(r.detail.files)}
                ></ms-photo-picker>`}
          </div>
          ${this.adaptiveEnabled?a`
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
          `:s}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${V("cancel",e)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading||this._photos.uploading||this._missingRequired.length>0}
            title=${this._photos.uploading?V("uploading",e):this._missingRequired.length?this._missingRequired.map(r=>V("err_required",e).replace("{field}",V($2[r]??r,e))).join(" \xB7 "):""}
          >
            ${this._loading?V("completing",e):V("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};S.styles=[N1,x3,g`
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
  `],n([u({attribute:!1})],S.prototype,"hass",2),n([u()],S.prototype,"entryId",2),n([u()],S.prototype,"taskId",2),n([u()],S.prototype,"taskName",2),n([u()],S.prototype,"lang",2),n([u({type:Array})],S.prototype,"checklist",2),n([u({type:Boolean})],S.prototype,"adaptiveEnabled",2),n([u()],S.prototype,"taskType",2),n([u()],S.prototype,"readingUnit",2),n([u({attribute:!1})],S.prototype,"readings",2),n([u({attribute:!1})],S.prototype,"readingHistory",2),n([u({attribute:!1})],S.prototype,"restockDefault",2),n([u({attribute:!1})],S.prototype,"restockUnitCost",2),n([u({attribute:!1})],S.prototype,"restockPackage",2),n([u()],S.prototype,"currencySymbol",2),n([u({attribute:!1})],S.prototype,"partsCostMode",2),n([u({attribute:!1})],S.prototype,"parts",2),n([u({attribute:!1})],S.prototype,"consumesParts",2),n([u({type:Array})],S.prototype,"consumesInfo",2),n([u({type:Array})],S.prototype,"requiredFields",2),n([u()],S.prototype,"phaseLabel",2),n([u({type:Boolean})],S.prototype,"requireTagScan",2),n([u({type:Boolean})],S.prototype,"viaTagScan",2),n([l()],S.prototype,"_open",2),n([l()],S.prototype,"_notes",2),n([l()],S.prototype,"_cost",2),n([l()],S.prototype,"_duration",2),n([l()],S.prototype,"_loading",2),n([l()],S.prototype,"_error",2),n([l()],S.prototype,"_checklistState",2),n([l()],S.prototype,"_feedback",2),n([l()],S.prototype,"_readingValue",2),n([l()],S.prototype,"_readingValues",2),n([l()],S.prototype,"_restockQty",2),n([l()],S.prototype,"_completedAt",2),n([l()],S.prototype,"_usedParts",2),n([l()],S.prototype,"_usedQtyText",2),n([u({attribute:!1})],S.prototype,"checklistPrefill",2),n([u({attribute:!1})],S.prototype,"prefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",S)});function O9(C){return C.object.parent_entry_id||null}function $9(C){return!C.object.archived&&!C.object.battery_fleet}function Ie(C,H){let e=new Map(C.map(o=>[o.entry_id,o])),t=[],r=new Set([H]),i=e.get(H);for(;i;){let o=O9(i);if(!o||r.has(o))break;let L=e.get(o);if(!L)break;r.add(o),t.unshift(L),i=L}return t}function T9(C,H){return[...Ie(C,H.entry_id),H].map(e=>e.object.name).join(" \u203A ")}function E9(C,H){let e=new Map;for(let i of C){let o=O9(i);o&&(e.has(o)||e.set(o,[]),e.get(o).push(i.entry_id))}let t=new Set,r=[...e.get(H)??[]];for(;r.length;){let i=r.pop();i===H||t.has(i)||(t.add(i),r.push(...e.get(i)??[]))}return t}var P9=v(()=>{"use strict"});var R,R9=v(()=>{"use strict";k();D();w();p1();P9();p5();P2();V1();G1();R=class extends Z{constructor(){super(...arguments);this.objects=[];this.placesEnabled=!1;this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._place="";this._remindOnSite=!1;this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return T(this.hass)}openCreate(e=""){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId=e,this._place="",this._remindOnSite=!1,this._replacing=!1,this._error="",this._open=!0}openReplace(e,t){this._entryId=e,this._replacing=!0,this._name=t.name||"",this._oldDeviceId=t.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._place=t.place||"",this._remindOnSite=!!t.remind_on_site,this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let t=await F(this,e,{busy:r=>{this._loading=r},fallbackKey:"save_error",onError:r=>{this._error=r}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:t?.entry_id,device_swap:t?.device_swap}})))}_deviceName(e){let r=this.hass?.devices?.[e];return r?.name_by_user||r?.name||e}_deviceSelector(e){return a`<ha-form
      .hass=${this.hass}
      .data=${{device:this._haDeviceId||void 0}}
      .schema=${[{name:"device",selector:{device:{}}}]}
      .computeLabel=${()=>e}
      @value-changed=${t=>this._haDeviceId=t.detail.value?.device||""}
    ></ha-form>`}_renderReplace(){let e=this._lang,t=(i,o)=>a`<label class="radio-row">
      <input
        type="radio"
        name="replace-device"
        .checked=${this._replaceDevice===i}
        @change=${()=>{this._replaceDevice=i}}
      />
      <span>${o}</span>
    </label>`,r=this._replaceDevice==="other"&&!this._haDeviceId;return a`
      <ha-dialog open .headerTitle=${b1(V("replace_object",e))} @closed=${this._close}>
        ${Z1(V("replace_object",e))}
        <div class="content">
          ${this._error?j("error",this._error):s}
          <div class="hint">${V("replace_object_prompt",e)}</div>
          <ms-textfield
            label="${V("replace_name_label",e)}"
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          ${this._oldDeviceId?a`<div class="radio-group" role="radiogroup" aria-label=${V("replace_device_heading",e)}>
                <div class="textarea-label">${V("replace_device_heading",e)}</div>
                ${t("keep",V("replace_device_keep",e).replace("{device}",this._deviceName(this._oldDeviceId)))}
                ${this._replaceDevice==="keep"?a`<div class="hint">${V("replace_device_keep_hint",e)}</div>`:s}
                ${t("other",V("replace_device_other",e))}
                ${this._replaceDevice==="other"?a`${this._deviceSelector(V("replace_device_pick",e))}
                      <div class="hint">${V("replace_device_other_hint",e)}</div>`:s}
                ${t("none",V("replace_device_none",e))}
              </div>`:this._deviceSelector(V("link_device_optional",e))}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${V("cancel",e)}
          </ha-button>
          <ha-button @click=${this._replace} .disabled=${this._loading||r}>
            ${this._loading?V("saving",e):V("replace_object",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}_renderPlace(e){let t=!!this._place&&!this.hass?.states?.[this._place];return a`
      <ha-form
        .hass=${this.hass}
        .data=${{place:this._place||void 0}}
        .schema=${[{name:"place",selector:{entity:{domain:"zone"}}}]}
        .computeLabel=${()=>V("place_optional",e)}
        @value-changed=${r=>{this._place=r.detail.value?.place||"",this._place||(this._remindOnSite=!1)}}
      ></ha-form>
      ${t?a`<div class="place-missing">${V("place_missing",e)}</div>`:s}
      <label class="place-on-site ${this._place?"":"disabled"}">
        <input
          type="checkbox"
          .checked=${this._remindOnSite}
          ?disabled=${!this._place}
          @change=${r=>this._remindOnSite=r.target.checked}
        />
        <span>${V("remind_on_site",e)}</span>
      </label>
      ${this._place?a`<div class="place-hint">${V("remind_on_site_hint",e)}</div>`:s}
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null,...this.placesEnabled?{place:this._place||null,remind_on_site:!!this._place&&this._remindOnSite}:{}},t=await F(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:r=>{this._loading=r},fallbackKey:"save_error",onError:r=>{this._error=r}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:t?.device_swap}})))}_parentChoices(){let e=this.objects||[],t=this._entryId?E9(e,this._entryId):new Set;return e.filter(r=>r.entry_id!==this._entryId&&!t.has(r.entry_id)&&($9(r)||r.entry_id===this._parentEntryId)).map(r=>({entryId:r.entry_id,label:T9(e,r)})).sort((r,i)=>r.label.localeCompare(i.label))}_close(){this._open=!1}render(){if(!this._open)return a``;if(this._replacing)return this._renderReplace();let e=this._lang,t=this._entryId?V("edit_object",e):V("new_object",e);return a`
      <ha-dialog open .headerTitle=${b1(t)} @closed=${this._close}>
        ${Z1(t)}
        <div class="content">
          ${this._error?j("error",this._error):s}
          <ms-textfield
            label="${V("name",e)}"
            required
            .value=${this._name}
            @input=${r=>this._name=r.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("manufacturer_optional",e)}"
            .value=${this._manufacturer}
            @input=${r=>this._manufacturer=r.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("model_optional",e)}"
            .value=${this._model}
            @input=${r=>this._model=r.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("serial_number_optional",e)}"
            .value=${this._serialNumber}
            @input=${r=>this._serialNumber=r.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${V("documentation_url_optional",e)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${r=>this._documentationUrl=r.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${V("area_id_optional",e)}"
            .value=${this._areaId}
            @value-changed=${r=>this._areaId=r.detail.value||""}
          ></ha-area-picker>
          ${this.placesEnabled?this._renderPlace(e):s}
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${V("installation_date_optional",e)}"
            .value=${this._installationDate}
            @value-changed=${r=>this._installationDate=r.detail.value}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${V("warranty_expiry_optional",e)}"
            .value=${this._warrantyExpiry}
            @value-changed=${r=>this._warrantyExpiry=r.detail.value}
          ></ms-date-field>
          <ha-form
            .hass=${this.hass}
            .data=${{device:this._haDeviceId||void 0}}
            .schema=${[{name:"device",selector:{device:{}}}]}
            .computeLabel=${()=>V("link_device_optional",e)}
            @value-changed=${r=>this._haDeviceId=r.detail.value?.device||""}
          ></ha-form>
          ${this._parentChoices().length?a`<label class="textarea-field">
                <span class="textarea-label">${V("parent_object_optional",e)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${r=>this._parentEntryId=r.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${V("parent_none",e)}
                  </option>
                  ${this._parentChoices().map(r=>a`<option
                      value=${r.entryId}
                      ?selected=${this._parentEntryId===r.entryId}
                    >${r.label}</option>`)}
                </select>
                <span class="md-hint">${V("parent_object_hint",e)}</span>
              </label>`:s}
          <label class="textarea-field">
            <span class="textarea-label">${V("object_notes_optional",e)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${r=>this._notes=r.target.value}
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
    `}};R.styles=g`
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
  `,n([u({attribute:!1})],R.prototype,"hass",2),n([u({attribute:!1})],R.prototype,"objects",2),n([u({type:Boolean})],R.prototype,"placesEnabled",2),n([l()],R.prototype,"_open",2),n([l()],R.prototype,"_loading",2),n([l()],R.prototype,"_error",2),n([l()],R.prototype,"_name",2),n([l()],R.prototype,"_manufacturer",2),n([l()],R.prototype,"_model",2),n([l()],R.prototype,"_serialNumber",2),n([l()],R.prototype,"_areaId",2),n([l()],R.prototype,"_installationDate",2),n([l()],R.prototype,"_warrantyExpiry",2),n([l()],R.prototype,"_documentationUrl",2),n([l()],R.prototype,"_notes",2),n([l()],R.prototype,"_haDeviceId",2),n([l()],R.prototype,"_parentEntryId",2),n([l()],R.prototype,"_place",2),n([l()],R.prototype,"_remindOnSite",2),n([l()],R.prototype,"_entryId",2),n([l()],R.prototype,"_replacing",2),n([l()],R.prototype,"_oldDeviceId",2),n([l()],R.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",R)});var D0,B9,I9=v(()=>{"use strict";D0=["sensor","binary_sensor","number","input_number","input_boolean","counter","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock","plant","input_select","select","input_datetime","date","datetime","timer","update"],B9=["sensor"]});var Fe,De,N0,F9=v(()=>{"use strict";Fe={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},De="mdi:wrench-clock",N0=C=>C&&Fe[C]||De});function D9(C,H){return C?.entities?.[H]?.platform==="maintenance_supporter"}function N9(C){return Object.keys(C?.entities||{}).filter(H=>H.startsWith("todo.")&&D9(C,H))}function _3(C,H){return[...new Set(H.filter(e=>e&&!D9(C,e)))].slice(0,5)}var j9=v(()=>{"use strict"});function q9(C){return ze[C]??"mdi:calendar"}function Ue(C,H,e){return m2(C,We[H]??"day",e)}function g3(C){let H=parseFloat(C);return Number.isFinite(H)?H:null}function U(C,H){return Object.entries(H).reduce((e,[t,r])=>e.split(`{${t}}`).join(r),C)}function Ge(C,H){let e=H,t=()=>{let r=parseInt(C.intervalDays,10);return Number.isFinite(r)&&r>0?Ue(r,C.intervalUnit,e):null};switch(C.scheduleType){case"time_based":{let r=t();return r?U(V("beta_rules_every",e),{interval:r}):V("beta_rules_manual",e)}case"one_time":return C.dueDate?U(V("beta_rules_once_on",e),{date:P(C.dueDate,e)}):V("beta_rules_no_date",e);case"manual":return V("beta_rules_manual",e);case"weekdays":{let r=[...C.weekdays].sort((i,o)=>i-o).map(i=>D1(i,e,"short"));return`${V("recurrence_on_days",e)}: ${r.length?r.join(", "):"\u2014"}`}case"nth_weekday":{let r=C.nth==="-1"?V("ord_last",e):V(`ord_${C.nth}`,e);return`${V("nth_weekday",e)}: ${r} ${D1(parseInt(C.nthWeekday,10)||0,e,"long")}`}case"day_of_month":return`${V("day_of_month",e)}: ${C.domLastDay?V("recurrence_last_day",e):C.domDay}`;case"calendar":return`${V("calendar_entity_label",e)}: ${C.calendarEntity||"\u2014"}`;case"sensor_based":{let r=t();return r?U(V(C.triggerCombinator==="all"?"beta_rules_safety_all":"beta_rules_safety_any",e),{interval:r}):V("beta_rules_sensor_only",e)}default:return V(C.scheduleType,e)}}function Qe(C,H){let e=[];C.scheduleType==="time_based"&&parseInt(C.intervalDays,10)>0&&e.push(V(C.intervalAnchor==="planned"?"anchor_planned":"anchor_completion",H));let t=parseInt(C.warningDays,10);return C.scheduleType!=="manual"&&Number.isFinite(t)&&t>0&&e.push(U(V("beta_rules_due_soon",H),{interval:m2(t,"day",H)})),e}function Ke(C,H){let e=H;if(C.triggerType==="compound"){let L=C.compoundLogic==="OR"?"beta_rules_any_of":"beta_rules_all_of";return U(V(L,e),{n:f(C.compoundCount,e)})}if(!C.triggerEntityIds.length)return V("beta_rules_pick_entity",e);let t=[],r=parseInt(C.forMinutes,10),i=Number.isFinite(r)&&r>0?U(V("beta_rules_for",e),{duration:m2(r,"minute",e)}):"";switch(C.triggerType){case"threshold":{let L=g3(C.above),M=g3(C.below);L!==null&&t.push(U(V("beta_rules_above",e),{value:f(L,e)})),M!==null&&t.push(U(V("beta_rules_below",e),{value:f(M,e)})),t.length||t.push(V("threshold",e)),i&&t.push(i);break}case"counter":{let L=g3(C.targetValue),M=L===null?"\u2014":f(L,e);t.push(U(V(C.deltaMode?"beta_rules_counter_delta":"beta_rules_counter_reaches",e),{value:M}));break}case"state_change":{let L=C.fromState.trim(),M=C.toState.trim();L&&t.push(U(V("beta_rules_changes_from",e),{state:L})),M&&t.push(U(V("beta_rules_changes_to",e),{state:M})),!L&&!M&&t.push(V("beta_rules_changes",e));let d=parseInt(C.targetChanges,10);Number.isFinite(d)&&d>1&&t.push(U(V("beta_rules_times",e),{n:f(d,e)})),i&&t.push(i);break}case"runtime":{let L=g3(C.runtimeHours);t.push(U(V("beta_rules_runs_for",e),{duration:L===null?"\u2014":m2(L,"hour",e)}));break}case"due_date":{let L=parseInt(C.daysBefore,10);t.push(Number.isFinite(L)&&L>0?U(V("beta_rules_date_before",e),{interval:m2(L,"day",e)}):V("beta_rules_date_on",e));break}}let o=t.join(" \xB7 ");return C.triggerAttribute?`${o} (${C.triggerAttribute})`:o}function Ye(C,H){let e=H.lang,t=[],r;if(C.completeWhenEntity&&C.completeWhenState.trim()){let o=H.entityName(C.completeWhenEntity);t.push(o),r=U(V("complete_when_badge",e),{entity:o,state:C.completeWhenState.trim()});let L=parseInt(C.completeWhenFor,10);Number.isFinite(L)&&L>0&&(r+=` \xB7 ${U(V("complete_when_badge_for",e),{minutes:f(L,e)})}`),C.completeWhenAnyTime&&(r+=` \xB7 ${V("complete_when_badge_any_time",e)}`)}else r=V("beta_rules_by_hand",e);let i=[];return C.quickOn&&i.push(V("quick_complete_label",e)),C.requiredCount>0&&i.push(`${V("require_on_completion",e)}: ${f(C.requiredCount,e)}`),C.checklistCount>0&&i.push(`${V("checklist",e)}: ${f(C.checklistCount,e)}`),C.partsCount>0&&i.push(`${V("consumes_parts_label",e)}: ${f(C.partsCount,e)}`),C.requireTagScan&&i.push(V("require_tag_scan",e)),C.allowSkip||i.push(V("disallow_skip",e)),{text:r,chips:t,badges:i}}function z9(C,H){let e=H.lang,t=[];t.push({id:"task",icon:"mdi:clipboard-text-outline",text:C.name.trim()||V("beta_rules_name_missing",e),chips:[],badges:[C.typeLabel,...C.enabled?[]:[V("disabled",e)]],removable:!1});let r=C.scheduleType==="sensor_based";if(t.push({id:"schedule",icon:q9(C.scheduleType),text:Ge(C,e),chips:[],badges:Qe(C,e),removable:r?parseInt(C.intervalDays,10)>0:C.scheduleType!=="manual"}),r){let M=C.triggerType==="compound"?C.compoundEntityIds:C.triggerEntityIds;t.push({id:"trigger",icon:j0[C.triggerType]??"mdi:gauge",text:Ke(C,e),chips:[...new Set(M)].map(d=>H.entityName(d)),badges:C.triggerType!=="compound"&&C.triggerEntityIds.length>1?[V(C.entityLogic==="all"?"entity_logic_all":"entity_logic_any",e)]:[],removable:!0})}let i=Ye(C,H);t.push({id:"completion",icon:"mdi:check-circle-outline",text:i.text,chips:i.chips,badges:i.badges,removable:!1});let o=C.pool.length>=2&&C.rotation?[V(`rotation_${C.rotation}`,e)]:[],L;return C.responsibleUserId?L=`${V("responsible_user",e)}: ${H.userName(C.responsibleUserId)}`:C.pool.length?L=`${V("task_shared_with",e)}: ${C.pool.map(M=>H.userName(M)).join(", ")}`:L=V("beta_rules_nobody",e),t.push({id:"people",icon:"mdi:account-multiple",text:L,chips:[],badges:o,removable:!1}),t.push({id:"notifications",icon:C.notifyEnabled?"mdi:bell-ring-outline":"mdi:bell-off-outline",text:C.notifyEnabled?V("beta_rules_reminders_on",e):V("no_notifications",e),chips:C.mirrorLists.map(M=>H.entityName(M)),badges:[],removable:!1}),t}function W9(C){let H=C.scheduleType==="sensor_based",e=parseInt(C.intervalDays,10)>0,t=[];for(let r of je){if(r===C.scheduleType)continue;let i;if(H)if(r==="time_based"){if(e)continue;i="safety"}else i="replace";else i=C.scheduleType==="manual"?"set":"replace";t.push({kind:"schedule",value:r,icon:q9(r),effect:i})}for(let r of qe){if(H&&r==="compound")continue;let i;H?i="combine":i=C.scheduleType==="time_based"||C.scheduleType==="manual"?"set":"replace",t.push({kind:"trigger",value:r,icon:j0[r],effect:i})}return t}function q0(C){let H={entityId:C.entityId,name:C.name},e=r=>({...H,target:"trigger",triggerType:r,icon:j0[r]}),t={...H,target:"done_when",icon:"mdi:check-circle-outline"};if(C.domain==="sensor")return C.deviceClass==="timestamp"||C.deviceClass==="date"?[e("due_date")]:C.numeric?Ct.has(C.stateClass??"")?[e("counter"),e("threshold")]:C.deviceClass==="duration"?[e("threshold"),e("counter")]:[e("threshold")]:[e("state_change"),t];if(C.domain==="counter")return[e("counter")];if(C.domain==="update")return[e("state_change")];if(C.domain==="number"||C.domain==="input_number")return[e("threshold")];if(Xe.has(C.domain)){let r=[];return tt.has(C.deviceClass??"")&&r.push(t),r.push(e("state_change")),(Je.has(C.domain)||et.has(C.deviceClass??""))&&r.push(e("runtime")),r.includes(t)||r.push(t),r}return rt.has(C.domain)?[e("state_change"),t]:[]}function U9(C,H){let e=C.devices??{},t=H.areaId||(H.deviceId?e[H.deviceId]?.area_id:null)||null,r=L=>L.area_id||(L.device_id?e[L.device_id]?.area_id:null)||null,i=[];for(let[L,M]of Object.entries(C.entities??{})){if(M.platform===H.ownPlatform||M.hidden)continue;let d;if(H.deviceId&&M.device_id===H.deviceId)d="device";else if(t&&r(M)===t)d="area";else continue;let p=C.states?.[L];if(!p)continue;let m=p.attributes??{};i.push({entityId:L,name:typeof m.friendly_name=="string"?m.friendly_name:L,domain:L.split(".")[0],deviceClass:typeof m.device_class=="string"?m.device_class:void 0,stateClass:typeof m.state_class=="string"?m.state_class:void 0,numeric:p.state!==""&&Number.isFinite(Number(p.state))||typeof m.unit_of_measurement=="string",group:d,secondary:!!M.entity_category})}let o=L=>L.group==="device"?0:1;return i.sort((L,M)=>o(L)-o(M)||Number(L.secondary)-Number(M.secondary)||L.name.localeCompare(M.name)),i.map(({secondary:L,...M})=>M).filter(L=>q0(L).length>0)}var Ne,je,qe,ze,j0,We,Xe,Je,et,tt,Ct,rt,G9=v(()=>{"use strict";w();Ne=["weekdays","nth_weekday","day_of_month","calendar"],je=["time_based",...Ne,"one_time"],qe=["threshold","counter","state_change","runtime","due_date","compound"],ze={time_based:"mdi:calendar-sync",weekdays:"mdi:calendar-week",nth_weekday:"mdi:calendar-today",day_of_month:"mdi:calendar-month",calendar:"mdi:calendar-star",one_time:"mdi:calendar-check",manual:"mdi:gesture-tap",sensor_based:"mdi:calendar-sync"},j0={threshold:"mdi:gauge",counter:"mdi:counter",state_change:"mdi:state-machine",runtime:"mdi:timer-outline",due_date:"mdi:calendar-alert",compound:"mdi:set-center"};We={days:"day",weeks:"week",months:"month",years:"year"};Xe=new Set(["binary_sensor","input_boolean","switch","fan","light","lock","cover","valve","siren"]),Je=new Set(["switch","fan","light","valve","input_boolean"]),et=new Set(["running","power","plug","heat","cold","moving","vibration"]),tt=new Set(["door","opening","window","garage_door","lock","running","moving","vibration","occupancy","presence"]),Ct=new Set(["total","total_increasing"]),rt=new Set(["select","input_select","vacuum","lawn_mower","climate","water_heater","media_player","alarm_control_panel","event"])});var Q9,K9=v(()=>{"use strict";k();Q9=g`
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
`});var Y9,X9=v(()=>{C2();u5();T0();Y9=A5(class extends R2{constructor(C){if(super(C),C.type!==S1.PROPERTY&&C.type!==S1.ATTRIBUTE&&C.type!==S1.BOOLEAN_ATTRIBUTE)throw Error("The `live` directive is not allowed on child or event bindings");if(!p3(C))throw Error("`live` bindings can only contain a single expression")}render(C){return C}update(C,[H]){if(H===r1||H===s)return H;let e=C.element,t=C.name;if(C.type===S1.PROPERTY){if(H===e[t])return r1}else if(C.type===S1.BOOLEAN_ATTRIBUTE){if(!!H===e.hasAttribute(t))return r1}else if(C.type===S1.ATTRIBUTE&&e.getAttribute(t)===H+"")return r1;return v9(C),H}})});var J9=v(()=>{X9()});var t6,e6,u1,C6=v(()=>{"use strict";k();D();t6="__ms_empty__",e6=C=>C===""?t6:C,u1=class extends Z{constructor(){super(...arguments);this.label="";this.value=void 0;this.disabled=!1;this.helper="";this._options=[];this._selected="";this._observer=null}connectedCallback(){super.connectedCallback(),this._read(),this._observer=new MutationObserver(()=>this._read()),this._observer.observe(this,{childList:!0,subtree:!0,characterData:!0,attributes:!0})}disconnectedCallback(){super.disconnectedCallback(),this._observer?.disconnect(),this._observer=null}_read(){let e=[...this.querySelectorAll("option")];this._options=e.map(t=>({value:e6(t.value),label:(t.textContent??"").replace(/\s+/g," ").trim()})),this._selected=e.find(t=>t.hasAttribute("selected")||t.selected)?.value??e[0]?.value??""}_picked(e){e.stopPropagation(),this.value=e.detail.value===t6?"":e.detail.value,this.dispatchEvent(new Event("change",{bubbles:!0,composed:!0}))}render(){return a`
      <ha-select
        .label=${this.label}
        .helper=${this.helper}
        .options=${this._options}
        .value=${e6(this.value??this._selected)}
        .disabled=${this.disabled}
        @selected=${this._picked}
      ></ha-select>`}};u1.styles=g`
    :host { display: block; }
    ha-select { display: block; width: 100%; }
  `,n([u()],u1.prototype,"label",2),n([u()],u1.prototype,"value",2),n([u({type:Boolean})],u1.prototype,"disabled",2),n([u()],u1.prototype,"helper",2),n([l()],u1.prototype,"_options",2),n([l()],u1.prototype,"_selected",2);customElements.get("ms-ha-select")||customElements.define("ms-ha-select",u1)});function N(){return H1("ha-select")}function B(C,H){if(N())return a`<ms-ha-select class=${C.cls??s} .label=${C.label??""} .value=${C.value} .disabled=${!!C.disabled}
      @change=${C.onChange}>${H}</ms-ha-select>`;if(C.value===void 0)return a`<select class=${C.cls??s} id=${C.id??s} aria-label=${C.label??s} ?disabled=${!!C.disabled}
      @change=${C.onChange}>${H}</select>`;let e=C.value;return a`<select class=${C.cls??s} id=${C.id??s} aria-label=${C.label??s} ?disabled=${!!C.disabled}
    .value=${C.live?Y9(e):e} @change=${C.onChange}
    ${B2(t=>{t instanceof HTMLSelectElement&&queueMicrotask(()=>{t.value!==e&&(t.value=e)})})}>${H}</select>`}var z0=v(()=>{"use strict";k();J9();A3();V1();C6()});function b3(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",daysBefore:"0",carry:{}}}function o6(C){return{type:C.type||"threshold",attribute:C.attribute||"",above:C.trigger_above?.toString()??"",below:C.trigger_below?.toString()??"",equals:C.trigger_equals?.toString()??"",notEquals:C.trigger_not_equals?.toString()??"",forMinutes:C.trigger_for_minutes?.toString()??"0",targetValue:C.trigger_target_value?.toString()??"",deltaMode:C.trigger_delta_mode||!1,fromState:C.trigger_from_state||"",toState:C.trigger_to_state||"",targetChanges:C.trigger_target_changes?.toString()??"",runtimeHours:C.trigger_runtime_hours?.toString()??"",onStates:(C.trigger_on_states||[]).join(", "),daysBefore:C.trigger_days_before?.toString()??"0"}}function a6(C,H){H.attribute&&(C.attribute=H.attribute);let e=parseInt(H.forMinutes,10);if(H.type==="threshold"){let t=parseFloat(H.above);isNaN(t)||(C.trigger_above=t);let r=parseFloat(H.below);isNaN(r)||(C.trigger_below=r);let i=parseFloat(H.equals);isNaN(i)||(C.trigger_equals=i);let o=parseFloat(H.notEquals);isNaN(o)||(C.trigger_not_equals=o),isNaN(e)||(C.trigger_for_minutes=e)}else if(H.type==="counter"){let t=parseFloat(H.targetValue);isNaN(t)||(C.trigger_target_value=t),C.trigger_delta_mode=H.deltaMode}else if(H.type==="state_change"){H.fromState&&(C.trigger_from_state=H.fromState),H.toState&&(C.trigger_to_state=H.toState);let t=parseInt(H.targetChanges,10);isNaN(t)||(C.trigger_target_changes=t),isNaN(e)||(C.trigger_for_minutes=e)}else if(H.type==="runtime"){let t=parseFloat(H.runtimeHours);isNaN(t)||(C.trigger_runtime_hours=t);let r=(H.onStates||"").split(",").map(i=>i.trim()).filter(Boolean);r.length>0&&(C.trigger_on_states=r)}else if(H.type==="due_date"){let t=parseInt(H.daysBefore,10);C.trigger_days_before=isNaN(t)?0:t}}function st(C){return{entityIds:L3(C).join(", "),...o6(C),carry:Object.fromEntries(Object.entries(C).filter(([e])=>!nt.has(e)&&!e.startsWith("_")))}}function Mt(C){let H=C.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(H.length===0)return null;let e={...C.carry||{},entity_id:H[0],entity_ids:H,type:C.type};return a6(e,C),e}function lt(C){return Array.from({length:7},(H,e)=>D1(e,C,"short"))}function V6(C){return Array.from({length:12},(H,e)=>n0(e,C,"short"))}function dt(C){let H=Array.isArray(C)?C.filter(e=>e!=null&&e!=="").join(", "):C!==null&&typeof C=="object"||C==null?"":String(C);return H.length>40?`${H.slice(0,39)}\u2026`:H}var Vt,it,ot,r6,at,Z3,H6,i6,f3,Lt,k1,L2,nt,c,W0,L6=v(()=>{"use strict";k();D();w();u0();C3();o2();I9();p1();s5();M3();x2();k0();p5();F9();s3();y0();j9();G9();K9();P2();l3();h3();G1();z0();g5();Vt="M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z",it="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z",ot="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z",r6=["cleaning","inspection","replacement","calibration","service","reading","custom"],at=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],Z3=["weekdays","nth_weekday","day_of_month","calendar"],H6=["time_based","one_time",...Z3],i6=["threshold","counter","state_change","runtime","due_date"],f3=(C,H)=>V(C==="due_date"?"trigger_type_due_date":C,H),Lt=[...i6,"compound"],k1={alpha:"0.3",min:"7",max:"365"},L2=z1;nt=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states","trigger_days_before"]);c=class c extends Z{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.mirrorTodoDefault=[];this.betaEditor=!1;this._ruleSel=null;this._addTab="type";this._betaStep="form";this._chooserFilter="";this._templateChoices=null;this._copyChoices=null;this._objectDevice=null;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._series=[];this._seriesIndex=0;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calMonths=[];this._hadCalMonths=!1;this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._detailsOpen=!1;this._mirrorTodoEntities=[];this._mirrorTodoMode="default";this._completeWhenEntity="";this._completeWhenState="";this._completeWhenAnyTime=!1;this._completeWhenFor="";this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._holdUntilDone=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerDaysBefore="0";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._triggerDetailAttribute="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._quickOn=!1;this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=k1.alpha;this._adaptiveMin=k1.min;this._adaptiveMax=k1.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set;this._attrSeq=0}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return T(this.hass)}async openCreate(e,t){this._series=[],this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="";let r=(t||[]).filter(i=>!i.object.archived&&!i.object.archived_at);!e&&r.length>0?(this._objectChoices=r.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,o)=>i.name.localeCompare(o.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),this._betaStep=this.betaEditor?"choose":"form",this._ruleSel="task",this._addTab="type",this._chooserFilter="",await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._series=[],await this._edit(e,t)}async openEditSeries(e){e.length!==0&&(this._series=e,await this._editSeriesItem(0))}async _editSeriesItem(e){let t=this._series[e];this._seriesIndex=e,await this._edit(t.entryId,t.task),await this.updateComplete,this.shadowRoot?.querySelector(".dialog-title")?.scrollIntoView({block:"start"})}_skipSeriesItem(){this._editSeriesItem(this._seriesIndex+1)}async _edit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._betaStep="form",this._ruleSel=null,this._addTab="type",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let r=t.schedule;this._weekdays=r?.kind==="weekdays"?[...r.weekdays??[]]:[],this._nth=r?.kind==="nth_weekday"?String(r.nth??1):"1",this._nthWeekday=r?.kind==="nth_weekday"?String(r.weekday??5):"5",this._domDay=r?.kind==="day_of_month"&&(r.day??1)>=1?String(r.day??1):"1",this._domLastDay=r?.kind==="day_of_month"&&r.day===-1,this._domBusiness=r?.kind==="day_of_month"&&r.business===!0,this._calMonths=(r?.kind==="day_of_month"||r?.kind==="nth_weekday")&&Array.isArray(r.months)?[...r.months]:[],this._hadCalMonths=this._calMonths.length>0,this._calendarEntity=r?.kind==="calendar"&&r.entity_id||"",this._calOffset=r?.offset?String(r.offset):"0",this._seasonMonths=Array.isArray(r?.season_months)?[...r.season_months]:[];let i=r?.ends;i&&typeof i.count=="number"?(this._endsMode="count",this._endsCount=String(i.count),this._endsUntil=""):i&&typeof i.until=="string"?(this._endsMode="until",this._endsUntil=i.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._mirrorTodoMode=this._mirrorTodoEntities.length?"own":t.mirror_todo_use_default===!1?"none":"default",this._completeWhenEntity=t.complete_when?.entity_id||"",this._completeWhenState=t.complete_when?.to_state||"",this._completeWhenAnyTime=!!t.complete_when?.any_time,this._completeWhenFor=t.complete_when?.for_minutes?String(t.complete_when.for_minutes):"",this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(d=>({...d})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(d=>[c1(d),{...d}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([d,p])=>{let{name:m,checklist:A,consumes_parts:x,required_completion_fields:y,..._}=p,b=p.consumes_parts||[],h=b.findIndex(h1=>!h1.entry_id),O=h>=0?b[h]:void 0;return{id:d,name:p.name||d,checklistText:(p.checklist||[]).join(`
`),partId:O?.part_id||"",partQty:O?.quantity!=null?String(O.quantity):"",reqOverride:p.required_completion_fields!==void 0,reqFields:[...p.required_completion_fields||[]],extraParts:b.filter((h1,M2)=>M2!==h).map(h1=>({...h1})),carry:_}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let o=t.on_complete_action;if(o&&o.service){this._actionService=o.service;let d=o.target?.entity_id;this._actionTargetEntity=Array.isArray(d)?d[0]||"":d||"",this._actionTargetStored=o.target&&typeof o.target=="object"?JSON.parse(JSON.stringify(o.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=o.data&&typeof o.data=="object"?{...o.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=o.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let L=t.quick_complete_defaults;this._quickOn=e1(t),this._qcNotes=L?.notes||"",this._qcCost=L?.cost!=null?String(L.cost):"",this._qcDuration=L?.duration!=null?String(L.duration):"",this._qcFeedback=L?.feedback||"";let M=t.adaptive_config||{};if(this._environmentalEntity=M.environmental_entity||"",this._environmentalAttribute=M.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!M.enabled,this._adaptiveAlpha=M.ewa_alpha?.toString()??k1.alpha,this._adaptiveMin=M.min_interval_days?.toString()??k1.min,this._adaptiveMax=M.max_interval_days?.toString()??k1.max,this._adaptiveSeasonal=M.seasonal_enabled!==!1,this._adaptivePrediction=M.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let d=t.trigger_config;this._triggerEntityId=n3(d)||"",this._triggerEntityIds=L3(d),this._triggerEntityLogic=d.entity_logic||"any",this._setTypeFields(o6(d)),this._triggerCombinator=d.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=d.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=d.auto_complete_on_recovery||!1,this._holdUntilDone=d.trigger_hold_until_done===!0,this._triggerRuntimeMaxSession=d.trigger_runtime_max_session_seconds?.toString()||"",this._triggerDetailAttribute=d.detail_attribute||"",d.type==="compound"?(this._compoundLogic=d.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(d.conditions||[]).map(st)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),this._detailsOpen=this._priority!=="normal"||!!this._labels.trim()||!!this._documentationUrl.trim()||!!this._customIcon,await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._detailsOpen=!1,this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._calMonths=[],this._hadCalMonths=!1,this._calendarEntity="",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._mirrorTodoMode="default",this._completeWhenEntity="",this._completeWhenState="",this._completeWhenAnyTime=!1,this._completeWhenFor="",this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._notifyEnabled=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=k1.alpha,this._adaptiveMin=k1.min,this._adaptiveMax=k1.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._actionTestError="",this._quickOn=!1,this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates,daysBefore:this._triggerDaysBefore}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates,this._triggerDaysBefore=e.daysBefore}_resetTriggerFields(){++this._attrSeq,this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(b3()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._holdUntilDone=!1,this._triggerRuntimeMaxSession="",this._triggerDetailAttribute="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new b2(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=V("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,r]=e.split(".");if(!this.hass?.services?.[t]?.[r]){this._actionTestResult="error",this._actionTestError=V("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let i=this._actionTargetEntity.trim();if(i){let o=i.split(".")[0];if(o!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=V("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",i).replace("{entity_domain}",o).replace("{suggestion}",`${o}.${r}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[i]){this._actionTestResult="error",this._actionTestError=V("action_test_entity_missing",this._lang).replace("{entity}",i),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,r]=e.split("."),i=this.hass?.services?.[t]?.[r]?.fields;return!i||Object.keys(i).length===0?null:Object.entries(i).map(([o,L])=>({name:o,required:!!L.required,selector:L.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,r])=>t==="entity_id"?Array.isArray(r)&&r.length>1:Array.isArray(r)?r.length>0:!!r):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=i=>(Array.isArray(i)?i:[i]).filter(o=>typeof o=="string"&&!!o),r=this.hass;return[...t(e.entity_id).map(i=>d5(this.hass,i)),...t(e.device_id).map(i=>r.devices?.[i]?.name_by_user||r.devices?.[i]?.name||i),...t(e.area_id).map(i=>r.areas?.[i]?.name||i),...t(e.floor_id).map(i=>r.floors?.[i]?.name||i),...t(e.label_id)].join(", ")}_renderQuickComplete(e){let t={notes:!!this._qcNotes.trim(),cost:!isNaN(parseFloat(this._qcCost)),duration:a2(this._qcDuration)!==null,photo:!1,user:!0},r=this._requiredCompletion.filter(o=>!t[o]),i=!!this._checklistText.trim()||this._readings.length>0;return a`
      ${E({cls:"req-option quick-complete-switch",checked:this._quickOn,onChange:o=>this._quickOn=o.target.checked},a`<span>${V("quick_complete_label",e)}</span>`)}
      ${this._quickOn?a`
            <div class="field-help">${V("quick_complete_help",e)}</div>
            ${r.length?a`<div class="field-help quick-complete-note">${V("quick_complete_needs_dialog",e).replace("{fields}",r.map(o=>V($2[o],e)).join(", "))}</div>`:s}
            ${this._requireTagScan?a`<div class="field-help quick-complete-note">${V("quick_complete_tag_hint",e)}</div>`:s}
            ${i?a`<div class="field-help">${V("quick_complete_not_asked",e)}</div>`:s}
            ${M1({cls:"ca-section quick-complete-values",open:Object.values(t).slice(0,3).some(Boolean)||!!this._qcFeedback,header:V("quick_complete_values",e)},a`
              <p class="field-help">${V("quick_complete_values_help",e)}</p>
              <ms-textfield
                label="${V("quick_complete_defaults_notes",e)}"
                .value=${this._qcNotes}
                @input=${o=>{this._qcNotes=o.target.value}}
              ></ms-textfield>
              <div class="qc-cost">
                <span class="qc-cost-label">${V("quick_complete_defaults_cost",e)}</span>
                <ms-cost-input .lang=${e} .value=${this._qcCost}
                  @value-changed=${o=>{this._qcCost=o.detail.value}}></ms-cost-input>
              </div>
              <ms-textfield
                label="${V("quick_complete_defaults_duration",e)}"
                type="number" min="0" step="1"
                .value=${this._qcDuration}
                @input=${o=>{this._qcDuration=o.target.value}}
              ></ms-textfield>
              ${B({label:V("was_maintenance_needed",e),cls:"qc-feedback",value:this._qcFeedback,onChange:o=>{this._qcFeedback=o.target.value}},a`
                <option value="">${V("quick_complete_defaults_feedback_none",e)}</option>
                <option value="needed">${V("quick_complete_defaults_feedback_needed",e)}</option>
                <option value="not_needed">${V("quick_complete_defaults_feedback_not_needed",e)}</option>
                <option value="not_sure">${V("feedback_not_sure",e)}</option>
              `)}
            `)}
          `:s}
    `}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return s;let t=this._serviceSchema();return a`
      ${M1({cls:"ca-section",header:V("on_complete_action_title",e)},a`
        <p class="field-help">${V("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${r=>{this._actionService=r.detail.value||"";let i=this._serviceSchema();if(i){let o=new Set(i.map(L=>L.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([L])=>o.has(L)))}}}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{name:"target_entity",selector:{entity:{}}}]}
          .data=${{target_entity:this._actionTargetEntity}}
          .computeLabel=${()=>V("on_complete_action_target",e)}
          @value-changed=${r=>{let i=r.detail.value;this._actionTargetEntity=i.target_entity||""}}
        ></ha-form>
        ${this._actionTargetExtended()&&this._actionTargetEntity.trim()===this._actionTargetInitial?a`<p class="field-help ca-target-more">${V("on_complete_action_target_more",e).replace("{targets}",this._actionTargetSummary())}</p>`:s}
        <p class="field-help ca-domain-hint">
          ${V("on_complete_action_target_hint",e)}
        </p>
        ${E({cls:"ca-skip-auto",checked:this._actionSkipAuto,onChange:r=>{this._actionSkipAuto=r.target.checked}},a`<span>${V("on_complete_action_skip_auto",e)}</span>`)}
        ${t?a`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${t}
                .data=${this._actionData}
                @value-changed=${r=>{this._actionData={...r.detail.value}}}
              ></ha-form>
            `:a`
              <ms-textfield
                label="${V("on_complete_action_data",e)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${r=>{this._actionDataJsonFallback=r.target.value}}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting||!this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting?"\u2026":V("on_complete_action_test",e)}
          </button>
          ${this._actionTestResult==="ok"?a`<span class="ca-test-ok">${V("on_complete_action_test_success",e)}</span>`:s}
          ${this._actionTestResult==="error"?a`<div class="ca-test-error-block">
                <span class="ca-test-error">${V("on_complete_action_test_failed",e)}</span>
                ${this._actionTestError?a`<div class="ca-test-error-detail">${this._actionTestError}</div>`:s}
              </div>`:s}
        </div>
      `)}

    `}_knownObjects(e){return this.objects?.some(t=>t.entry_id===e)?this.objects:void 0}async _loadParts(){this.parts=[];let e=this._entryId;if(!e)return;let t=this._knownObjects(e)?.find(r=>r.entry_id===e);if(t){this.parts=t.parts||[],this._partsLoadFailed=!1;return}try{let r=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:e});if(e!==this._entryId)return;this.parts=r.parts||[],this._partsLoadFailed=!1}catch{if(e!==this._entryId)return;this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){this._foreignOwners=[];let e=this._entryId;if(e)try{let t=this._knownObjects(e)??(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"})).objects;if(e!==this._entryId)return;this._foreignOwners=(t||[]).filter(r=>r.entry_id!==e&&(r.parts||[]).length>0).map(r=>({entry_id:r.entry_id,name:r.object?.name||r.entry_id,parts:r.parts||[]})).sort((r,i)=>r.name.localeCompare(i.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let r=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:r.suggested_attributes||[],available:r.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){let t=++this._attrSeq;if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let r=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});if(t!==this._attrSeq)return;this._entityDomain=r.domain||"",this._suggestedAttributes=r.suggested_attributes||[],this._availableAttributes=r.available_attributes||[]}catch{if(t!==this._attrSeq)return;this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let r=c1({part_id:e.id,entry_id:t}),i=this._consumesParts[r],o=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return a`
      <div class="consumes-row">
        ${E({cls:"consumes-check",checked:i!==void 0,onChange:L=>{let M={...this._consumesParts};if(L.target.checked)M[r]=M[r]||o;else{delete M[r];let d={...this._consumesQtyText};delete d[r],this._consumesQtyText=d}this._consumesParts=M}},a`<span>${e.name}${e.unit?` (${e.unit})`:""}</span>`)}
        ${i!==void 0?a`<input
              class="consumes-qty"
              aria-label=${`${e.name}: ${V("quantity",this._lang)}`}
              type="number"
              min=${L2[0]}
              max=${L2[1]}
              step="0.01"
              .value=${this._consumesQtyText[r]??String(i.quantity)}
              @input=${L=>{let M=L.target.value;this._consumesQtyText={...this._consumesQtyText,[r]:M};let d=parseFloat(M.replace(",","."));Number.isFinite(d)&&d>=L2[0]&&(this._consumesParts={...this._consumesParts,[r]:{...o,quantity:d}})}}
            />`:s}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let r=this._consumesQtyText[t];if(r===void 0)continue;let i=parseFloat(r.replace(",","."));if(!Number.isFinite(i)||i<L2[0]||i>L2[1]){let o=L=>f(L,this._lang,{maximumFractionDigits:2});return this._error=V("settings_value_out_of_range",this._lang).replace("{min}",o(L2[0])).replace("{max}",o(L2[1])),!1}e[t]={...e[t],quantity:i}}return this._consumesParts=e,!0}_toggleRequired(e,t){let r=new Set(this._requiredCompletion);t?r.add(e):r.delete(e),this._requiredCompletion=[...r]}_patchReading(e,t){this._readings=this._readings.map(r=>r.id===e?{...r,...t}:r)}_renderReadingsEditor(e){let t=N4(this._readings);return a`
      <div class="readings-editor">
        <div class="field-label">${V("readings_section",e)}</div>
        <div class="field-help">${V("readings_hint",e)}</div>
        ${this._readings.map(r=>a`
          ${t.has(r.id)?a`<div class="field-help reading-dup">${V("reading_duplicate_name",e)}</div>`:s}
          <div class="reading-row">
            <ms-textfield
              class="reading-name"
              label="${V("reading_name_label",e)}"
              .value=${r.name}
              @input=${i=>this._patchReading(r.id,{name:i.target.value})}
            ></ms-textfield>
            <ms-textfield
              class="reading-unit"
              label="${V("reading_unit_short",e)}"
              .value=${r.unit||""}
              @input=${i=>this._patchReading(r.id,{unit:i.target.value})}
            ></ms-textfield>
            <ha-icon-button class="phase-remove reading-remove" .label=${V("remove",e)} @click=${()=>this._readings=this._readings.filter(i=>i.id!==r.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<h0?a`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:R4(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${V("reading_add",e)}
          </ha-button>`:s}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",r=t,i=2;for(;this._phaseDefs.some(o=>o.id===r);)r=`${t}-${i++}`;return r}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(r=>r.id===e?{...r,...t}:r)}_renderPhasesEditor(e){let t=r=>this._phaseDefs.find(i=>i.id===r)?.name||r;return a`
      ${M1({cls:"phases-section",open:this._phaseDefs.length>0,header:V("phases_section",e)},a`
      <div class="field-help">${V("phases_hint",e)}</div>
      ${this._phaseDefs.map(r=>a`
        <div class="phase-def">
          <div class="phase-def-head">
            <ms-textfield
              label="${V("phase_name",e)}"
              .value=${r.name}
              @input=${i=>this._patchPhaseDef(r.id,{name:i.target.value})}
            ></ms-textfield>
            ${this.parts.length?a`
              ${B({label:V("spare_part",e),cls:"phase-part",value:r.partId,onChange:i=>{let o=i.target.value;this._patchPhaseDef(r.id,r.partQty?{partId:o}:{partId:o,partQty:"1"})}},a`
                <option value="">—</option>
                ${this.parts.map(i=>a`<option value=${i.id} ?selected=${i.id===r.partId}>${i.name}</option>`)}
              `)}
              ${r.partId?a`
                <!-- The typed text as-is: a "|| '1'" here rewrote a cleared
                     field to 1 and the next digit gave "13" (bug audit
                     2026-09-26 #2); an empty field saves as 1. -->
                <input class="phase-qty" aria-label=${V("quantity",e)} type="number" min=${z1[0]} step="0.01" placeholder="1" .value=${r.partQty}
                  @input=${i=>this._patchPhaseDef(r.id,{partQty:i.target.value})} />
              `:s}
            `:s}
            <ha-icon-button class="phase-remove" .label=${V("remove",e)} @click=${()=>this._removePhaseDef(r.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
          ${this.checklistsEnabled?a`
            <textarea
              class="checklist-textarea phase-checklist"
              rows="2"
              placeholder="${V("checklist_placeholder",e)}"
              .value=${r.checklistText}
              @input=${i=>this._patchPhaseDef(r.id,{checklistText:i.target.value})}
            ></textarea>
          `:s}
          ${E({cls:"req-option phase-req-toggle",checked:r.reqOverride,onChange:i=>this._patchPhaseDef(r.id,{reqOverride:i.target.checked})},a`<span>${V("phase_require_override",e)}</span>`)}
          ${r.reqOverride?a`
            <div class="required-completion phase-req-fields">
              ${S0.map(i=>a`
                ${E({cls:"req-option",checked:r.reqFields.includes(i),onChange:o=>{let L=o.target.checked,M=new Set(r.reqFields);L?M.add(i):M.delete(i),this._patchPhaseDef(r.id,{reqFields:[...M]})}},a`<span>${V($2[i],e)}</span>`)}
              `)}
            </div>
          `:s}
        </div>
      `)}
      <ha-button appearance="plain" @click=${this._addPhaseDef}>
        <ha-icon icon="mdi:plus"></ha-icon> ${V("phase_add",e)}
      </ha-button>
      ${this._phaseDefs.some(r=>r.name.trim())?a`
        <div class="phase-seq-label">${V("phase_sequence_label",e)}</div>
        <div class="phase-seq">
          ${this._phaseSeq.map((r,i)=>a`
            <span class="phase-chip">
              ${i+1}. ${t(r)}
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((o,L)=>L!==i)}}>✕</button>
            </span>
          `)}
          ${B({label:V("phase_sequence_add_step",e),cls:"phase-seq-add",value:"",onChange:r=>{let i=r.target.value;i&&(this._phaseSeq=[...this._phaseSeq,i]),r.target.value=""}},a`
            <option value="">+ ${V("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(r=>r.name.trim()).map(r=>a`<option value=${r.id}>${r.name}</option>`)}
          `)}
        </div>
      `:s}
      `)}
    `}async _save(){if(this._loading||!this._name.trim()||this._missingDueDate())return;if(this._adaptiveSnapshot()!==this._adaptiveInitial){let t=parseInt(this._adaptiveMin,10),r=parseInt(this._adaptiveMax,10);if(!isNaN(t)&&!isNaN(r)&&t>r){this._error=`${V("adaptive_min_interval",this._lang)} > ${V("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=V("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=V("calendar_entity_required",this._lang);return}if(!this._applyConsumesQtyText())return;if(this._completeWhenEntity&&parseInt(this._completeWhenFor,10)>y2[1]){this._error=V("settings_value_out_of_range",this._lang).replace("{min}","1").replace("{max}",f(y2[1],this._lang));return}this._loading=!0,this._error="";let e;try{let t=await F(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:L=>{this._error=L}});if(t===void 0)return;let r=this._taskId||t?.task_id,i=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let o=L=>{this._warning=V("subsave_warning",this._lang).replace("{detail}",L)};if(r&&this._scheduleType==="sensor_based"&&i&&await F(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:r,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:o})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),r&&this._adaptiveSnapshot()!==this._adaptiveInitial){let L=parseFloat(this._adaptiveAlpha),M=parseInt(this._adaptiveMin,10),d=parseInt(this._adaptiveMax,10);await F(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:r,enabled:this._adaptiveEnabled,...L>=n5[0]&&L<=n5[1]?{ewa_alpha:L}:{},...!isNaN(M)&&M>=1?{min_interval_days:M}:{},...!isNaN(d)&&d>=1?{max_interval_days:d}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:o})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?r&&(this._taskId=r):this._seriesIndex+1<this._series.length?e=this._seriesIndex+1:(this._open=!1,this._series=[]),this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}e!==void 0&&await this._editSeriesItem(e)}_missingDueDate(){return this._scheduleType==="one_time"&&!this._dueDate}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):Z3.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(o=>o.trim()).filter(Boolean);let r=this.mirrorTodoDefault.length&&this._mirrorTodoMode!=="own"?[]:_3(this.hass,this._mirrorTodoEntities);e.mirror_todo_entities=r,e.mirror_todo_use_default=this.mirrorTodoDefault.length?this._mirrorTodoMode==="default":this._mirrorTodoMode!=="none",e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip;let i=parseInt(this._completeWhenFor,10);e.complete_when=this._completeWhenEntity&&this._completeWhenState.trim()?{entity_id:this._completeWhenEntity,to_state:this._completeWhenState.trim(),...this._completeWhenAnyTime?{any_time:!0}:{},...i>0?{for_minutes:i}:{}}:null,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=j4(this._readings);{let o={};for(let M of this._phaseDefs){if(!M.name.trim())continue;let d={...M.carry,name:M.name.trim()},p=M.checklistText.split(`
`).map(A=>A.trim()).filter(Boolean);p.length&&(d.checklist=p);let m=[];if(M.partId){let A=parseFloat(M.partQty);m.push({part_id:M.partId,quantity:Number.isFinite(A)&&A>0?A:1})}for(let A of M.extraParts)m.push(A.entry_id?{part_id:A.part_id,quantity:A.quantity,entry_id:A.entry_id}:{part_id:A.part_id,quantity:A.quantity});m.length&&(d.consumes_parts=m),M.reqOverride&&(d.required_completion_fields=[...M.reqFields]),o[M.id]=d}let L=this._phaseSeq.filter(M=>M in o);e.phases=Object.keys(o).length&&L.length?o:null,e.phase_sequence=e.phases?L:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(o=>o.entry_id?{part_id:o.part_id,quantity:o.quantity,entry_id:o.entry_id}:{part_id:o.part_id,quantity:o.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let o=this._compoundConditions.map(Mt).filter(L=>L!==null);if(o.length>0){let L={type:"compound",compound_logic:this._compoundLogic,conditions:o};this._autoCompleteOnRecovery&&(L.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(L.trigger_combinator="all"),this._triggerDetailAttribute&&(L.detail_attribute=this._triggerDetailAttribute),e.trigger_config=L}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let o=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],L={entity_id:o[0],entity_ids:o,type:this._triggerType};if(a6(L,this._typeFields()),this._holdUntilDone&&this._isStateLatch()?L.trigger_hold_until_done=!0:this._autoCompleteOnRecovery&&(L.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(L.trigger_combinator="all"),this._triggerDetailAttribute&&(L.detail_attribute=this._triggerDetailAttribute),o.length>1&&(L.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let M=parseFloat(this._triggerBaselineValue);!isNaN(M)&&M>=0&&(L.trigger_baseline_value=M)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let M=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(M)&&M>0&&(L.trigger_runtime_max_session_seconds=M)}e.trigger_config=L}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&H6.includes(this._scheduleType)){let o=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(o)?o:null}if(this.checklistsEnabled){let o=this._checklistText.split(`
`).map(L=>L.trim()).filter(Boolean).slice(0,100);e.checklist=o.length?o:null}if(this.completionActionsEnabled||this._actionPresent){let o=this._actionService.trim();if(o&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(o)){let L={service:o},M=this._actionTargetEntity.trim();this._actionTargetStored&&M===this._actionTargetInitial?L.target=JSON.parse(JSON.stringify(this._actionTargetStored)):M&&(L.target={entity_id:M});let d=this._buildActionData();Object.keys(d).length>0&&(L.data=d),this._actionSkipAuto&&(L.skip_auto=!0),e.on_complete_action=L}else e.on_complete_action=null}{let o={};this._qcNotes.trim()&&(o.notes=this._qcNotes.trim());let L=parseFloat(this._qcCost);isNaN(L)||(o.cost=L);let M=a2(this._qcDuration);M!==null&&(o.duration=M),this._qcFeedback&&(o.feedback=this._qcFeedback),e.quick_complete_defaults=this._quickOn?o:null}return e}_close(){this._open=!1,this._series=[],this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return s;let e=this._lang,t=this._triggerType==="compound";return a`
      <div class="select-row">
        ${N()?s:a`<label>${V("trigger_type",e)}</label>`}
        ${B({label:V("trigger_type",e),value:this._triggerType,onChange:r=>{this._triggerType=r.target.value,this._seedUpdateRule()}},a`
          ${Lt.map(r=>a`<option value=${r} ?selected=${r===this._triggerType}>${f3(r,e)}</option>`)}
        `)}
      </div>
      ${t?this._renderCompoundEditor():a`
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${V("entity_id",e)} (${V("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${r=>{let o=r.target.value.split(",").map(L=>L.trim()).filter(Boolean);this._triggerEntityId=o[0]||"",this._triggerEntityIds=o,this._seedUpdateRule(),o[0]&&this._fetchEntityAttributes(o[0])}}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:D0}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>V("entity_id",e)}
          @value-changed=${r=>{let i=(r.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=i[0]||"",this._triggerEntityIds=i,this._seedUpdateRule(),i[0]?this._fetchEntityAttributes(i[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?a`
          <div class="select-row">
            ${N()?s:a`<label>${V("entity_logic",e)}</label>`}
            ${B({label:V("entity_logic",e),value:this._triggerEntityLogic,onChange:r=>this._triggerEntityLogic=r.target.value},a`
              <option value="any" ?selected=${this._triggerEntityLogic==="any"}>${V("entity_logic_any",e)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic==="all"}>${V("entity_logic_all",e)}</option>
            `)}
          </div>
        `:s}
        ${this._renderAttributeSelect({label:V("attribute_optional",e),value:this._triggerAttribute,suggested:this._suggestedAttributes,available:this._availableAttributes,onSelect:r=>this._triggerAttribute=r})}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      ${this._renderDetailAttributeSelect(e)}
      ${this._isStateLatch()?this._renderTriggerEnd(e):a`
        ${E({checked:this._autoCompleteOnRecovery,onChange:r=>this._autoCompleteOnRecovery=r.target.checked},a`${V("auto_complete_on_recovery",e)}`)}
        <div class="field-help">${V("auto_complete_on_recovery_help",e)}</div>
      `}
      <ms-textfield
        label="${V("safety_interval",e)}"
        type="number"
        .value=${this._intervalDays}
        @input=${r=>this._intervalDays=r.target.value}
      ></ms-textfield>
      ${this._intervalDays?this._renderUnitSelect():s}
      ${this._intervalDays?a`
            <div class="select-row">
              ${N()?s:a`<label>${V("trigger_combinator",e)}</label>`}
              ${B({label:V("trigger_combinator",e),onChange:r=>this._triggerCombinator=r.target.value},a`
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${V("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${V("trigger_combinator_all",e)}</option>
              `)}
            </div>
          `:s}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((r,i)=>i===e?{...r,...t}:r)}_addCondition(){this._compoundConditions=[...this._compoundConditions,b3()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,r)=>r!==e),this.betaEditor&&this._compoundConditions.length===1&&this._flattenCompound()}_flattenCompound(){let[e]=this._compoundConditions;if(!e)return;let t=e.entityIds.split(",").map(L=>L.trim()).filter(Boolean),{entityIds:r,carry:i,...o}=e;this._compoundConditions=[],this._setTypeFields(o),this._triggerEntityId=t[0]||"",this._triggerEntityIds=t,t[0]&&this._fetchEntityAttributes(t[0])}_renderCompoundEditor(){let e=this._lang;return a`
      <div class="select-row">
        ${N()?s:a`<label>${V("compound_logic",e)}</label>`}
        ${B({label:V("compound_logic",e),value:this._compoundLogic,onChange:t=>this._compoundLogic=t.target.value},a`
          <option value="AND" ?selected=${this._compoundLogic==="AND"}>${V("compound_logic_and",e)}</option>
          <option value="OR" ?selected=${this._compoundLogic==="OR"}>${V("compound_logic_or",e)}</option>
        `)}
      </div>
      <div class="field-help">${V("compound_help",e)}</div>
      ${this._compoundConditions.length===0?a`<div class="field-help">${V("compound_no_conditions",e)}</div>`:this._compoundConditions.map((t,r)=>this._renderCondition(t,r))}
      <button type="button" class="secondary-btn" @click=${()=>this._addCondition()}>
        + ${V("compound_add_condition",e)}
      </button>
    `}_renderCondition(e,t){let r=this._lang,i=t+1;return a`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${V("compound_condition",r)} ${i}</span>
          <button
            type="button"
            class="icon-btn"
            title="${V("compound_remove_condition",r)}"
            @click=${()=>this._removeCondition(t)}
          >✕</button>
        </div>
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${V("entity_id",r)} (${V("comma_separated",r)})"
            .value=${e.entityIds}
            @input=${o=>this._patchCondition(t,{entityIds:o.target.value})}
          ></ms-textfield>
        `:a`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:D0}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(o=>o.trim()).filter(Boolean)}}
          .computeLabel=${()=>V("entity_id",r)}
          @value-changed=${o=>{let L=(o.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:L.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          ${N()?s:a`<label>${V("trigger_type",r)}</label>`}
          ${B({label:V("trigger_type",r),value:e.type,onChange:o=>this._patchCondition(t,{type:o.target.value})},a`
            ${i6.map(o=>a`<option value=${o} ?selected=${o===e.type}>${f3(o,r)}</option>`)}
          `)}
        </div>
        ${this._renderConditionTypeFields(e,t)}
      </div>
    `}_isStateLatch(){return this._triggerType==="state_change"&&(this._triggerTargetChanges===""||Number(this._triggerTargetChanges)===1)&&!!(this._triggerFromState.trim()||this._triggerToState.trim())}_renderTriggerEnd(e){let t=this._holdUntilDone?"hold":this._autoCompleteOnRecovery?"done":"ok",r={ok:"trigger_end_ok",done:"trigger_end_done",hold:"trigger_end_hold"},i=o=>{this._autoCompleteOnRecovery=o==="done",this._holdUntilDone=o==="hold"};return a`
      <div class="trigger-end" role="radiogroup" aria-label=${V("trigger_end",e)}>
        <div class="field-label">${V("trigger_end",e)}</div>
        ${Object.keys(r).map(o=>a`
          <label class="trigger-end-option">
            <input type="radio" name="trigger-end" value=${o} .checked=${t===o} @change=${()=>i(o)} />
            ${V(r[o],e)}
          </label>
        `)}
        ${t==="done"?a`<div class="field-help">${V("auto_complete_on_recovery_help",e)}</div>`:s}
        ${t==="hold"?a`<div class="field-help">${V("trigger_end_hold_help",e)}</div>`:s}
      </div>
    `}_renderCompleteWhen(e){return a`
      <div class="field complete-when-field">
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${V("complete_when",e)}"
            placeholder="binary_sensor.washer_door"
            .value=${this._completeWhenEntity}
            @input=${t=>this._completeWhenEntity=t.target.value.trim()}
          ></ms-textfield>
        `:a`
          <ha-form
            class="entity-picker-form"
            .hass=${this.hass}
            .schema=${[{name:"complete_when",selector:{entity:{}}}]}
            .data=${{complete_when:this._completeWhenEntity}}
            .computeLabel=${()=>V("complete_when",e)}
            @value-changed=${t=>{let r=(t.detail.value.complete_when||"").trim();r!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=r}}
          ></ha-form>`}
        ${this._completeWhenEntity?this._renderStateField({label:V("complete_when_state",e),value:this._completeWhenState,entityId:this._completeWhenEntity,onInput:t=>this._completeWhenState=t}):s}
        ${this._completeWhenEntity?a`
          <ms-textfield
            class="complete-when-for"
            label="${V("for_at_least_minutes",e)}"
            type="number"
            min=${y2[0]}
            max=${y2[1]}
            .value=${this._completeWhenFor}
            @input=${t=>this._completeWhenFor=t.target.value}
          ></ms-textfield>
          ${E({cls:"req-option complete-when-any-time",checked:this._completeWhenAnyTime,onChange:t=>this._completeWhenAnyTime=t.target.checked},a`<span>${V("complete_when_any_time",e)}</span>`)}
        `:s}
        <div class="field-help">${V("complete_when_help",e)}</div>
      </div>
    `}_renderStateField(e){return this._entityPickerFallback||!e.entityId?a`
        <ms-textfield
          label=${e.label}
          .value=${e.value}
          @input=${t=>e.onInput(t.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId}}}]}
        .data=${{s:e.value}}
        .computeLabel=${()=>e.label}
        @value-changed=${t=>e.onInput((t.detail.value.s||"").trim())}
      ></ha-form>
    `}_renderOnStatesField(e){let t=this._lang;return this._entityPickerFallback||!e.entityId?a`
        <ms-textfield
          label="${V("runtime_on_states",t)}"
          placeholder="on"
          .value=${e.value}
          @input=${r=>e.onInput(r.target.value)}
        ></ms-textfield>
      `:a`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{name:"s",selector:{state:{entity_id:e.entityId,multiple:!0}}}]}
        .data=${{s:(e.value||"").split(",").map(r=>r.trim()).filter(Boolean)}}
        .computeLabel=${()=>V("runtime_on_states",t)}
        @value-changed=${r=>e.onInput((r.detail.value.s||[]).join(", "))}
      ></ha-form>
    `}_renderAdaptiveSection(e){return this._scheduleType==="one_time"||this._scheduleType==="manual"?s:!this.adaptiveFeature&&!this._adaptiveWasEnabled?s:a`
      ${M1({cls:"adaptive-section",open:this._adaptiveEnabled,header:V("adaptive_section_title",e)},a`
        ${E({checked:this._adaptiveEnabled,onChange:t=>this._adaptiveEnabled=t.target.checked},a`${V("adaptive_enabled",e)}`)}
        ${this._adaptiveEnabled?a`
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
            min=${n5[0]}
            max=${n5[1]}
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${t=>this._adaptiveAlpha=t.target.value}
          ></ms-textfield>
          ${this.seasonalFeature?a`${E({checked:this._adaptiveSeasonal,onChange:t=>this._adaptiveSeasonal=t.target.checked},a`${V("adaptive_seasonal_enabled",e)}`)}`:s}
          ${E({checked:this._adaptivePrediction,onChange:t=>this._adaptivePrediction=t.target.checked},a`${V("adaptive_prediction_enabled",e)}`)}
        `:s}
      `)}
    `}_renderAttributeSelect(e){let t=this._lang;return e.available.length>0?a`
        <div class="select-row">
          ${N()?s:a`<label>${e.label}</label>`}
          ${B({label:e.label,value:e.value,onChange:r=>e.onSelect(r.target.value)},a`
            <option value="" ?selected=${!e.value}>${V("use_entity_state",t)}</option>
            ${e.suggested.map(r=>a`<option value=${r} ?selected=${r===e.value}>${r} ★</option>`)}
            ${e.available.filter(r=>!e.suggested.includes(r.name)).map(r=>a`<option value=${r.name} ?selected=${r.name===e.value}>${r.name}${r.numeric?"":" (non-numeric)"}</option>`)}
          `)}
        </div>
      `:a`
      <ms-textfield
        label="${e.label}"
        .value=${e.value}
        @input=${r=>e.onSelect(r.target.value.trim())}
      ></ms-textfield>
    `}_renderDetailAttributeSelect(e){let t=this._triggerType==="compound"?this._compoundConditions.flatMap(d=>d.entityIds.split(",").map(p=>p.trim()).filter(Boolean)):(this._triggerEntityIds.length?this._triggerEntityIds:[this._triggerEntityId]).filter(Boolean);if(!t.length)return s;let r=this.hass?.states??{},i=new Map;for(let d of t){this._fetchConditionAttributes(d);for(let p of this._conditionAttrOptions[d]?.available??[])i.has(p.name)||i.set(p.name,dt(r[d]?.attributes?.[p.name]))}let o=this._triggerDetailAttribute;o&&!i.has(o)&&i.set(o,"");let L=V("trigger_detail_attribute",e),M=i.size?a`
        <div class="select-row">
          ${N()?s:a`<label>${L}</label>`}
          ${B({label:L,cls:"detail-attribute-select",value:o,onChange:d=>this._triggerDetailAttribute=d.target.value},a`
            <option value="" ?selected=${!o}>${V("trigger_detail_none",e)}</option>
            ${[...i.entries()].sort(([d],[p])=>d.localeCompare(p)).map(([d,p])=>a`<option value=${d} ?selected=${d===o}>${p?`${d}: ${p}`:d}</option>`)}
          `)}
        </div>`:a`
        <ms-textfield class="detail-attribute-input" label=${L} .value=${o}
          @input=${d=>this._triggerDetailAttribute=d.target.value.trim()}></ms-textfield>`;return a`${M}<div class="field-help">${V("trigger_detail_attribute_help",e)}</div>`}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:V("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:r=>this._environmentalAttribute=r})}_renderConditionAttribute(e,t){let r=e.entityIds.split(",")[0]?.trim()||"";r&&this._fetchConditionAttributes(r);let i=r?this._conditionAttrOptions[r]:void 0;return this._renderAttributeSelect({label:V("attribute_optional",this._lang),value:e.attribute,suggested:i?.suggested??[],available:i?.available??[],onSelect:o=>this._patchCondition(t,{attribute:o})})}_renderConditionTypeFields(e,t){let r=this._lang;if(e.type==="threshold")return a`
        <ms-textfield label="${V("trigger_above",r)}" type="number" .value=${e.above}
          @input=${i=>this._patchCondition(t,{above:i.target.value})}></ms-textfield>
        <ms-textfield label="${V("trigger_below",r)}" type="number" .value=${e.below}
          @input=${i=>this._patchCondition(t,{below:i.target.value})}></ms-textfield>
        <ms-textfield label="${V("trigger_equals",r)}" type="number" .value=${e.equals}
          @input=${i=>this._patchCondition(t,{equals:i.target.value})}></ms-textfield>
        <ms-textfield label="${V("trigger_not_equals",r)}" type="number" .value=${e.notEquals}
          @input=${i=>this._patchCondition(t,{notEquals:i.target.value})}></ms-textfield>
        <ms-textfield label="${V("for_minutes",r)}" type="number" .value=${e.forMinutes}
          @input=${i=>this._patchCondition(t,{forMinutes:i.target.value})}></ms-textfield>
      `;if(e.type==="counter")return a`
        <ms-textfield label="${V("target_value",r)}" type="number" .value=${e.targetValue}
          @input=${i=>this._patchCondition(t,{targetValue:i.target.value})}></ms-textfield>
        ${E({checked:e.deltaMode,onChange:i=>this._patchCondition(t,{deltaMode:i.target.checked})},a`${V("delta_mode",r)}`)}
      `;if(e.type==="state_change"){let i=e.entityIds.split(",")[0]?.trim()||"";return a`
        ${this._renderStateField({label:V("from_state_optional",r),value:e.fromState,entityId:i,onInput:o=>this._patchCondition(t,{fromState:o})})}
        ${this._renderStateField({label:V("to_state_optional",r),value:e.toState,entityId:i,onInput:o=>this._patchCondition(t,{toState:o})})}
        <ms-textfield label="${V("target_changes",r)}" type="number" .value=${e.targetChanges}
          @input=${o=>this._patchCondition(t,{targetChanges:o.target.value})}></ms-textfield>
        <ms-textfield label="${V("for_minutes",r)}" type="number" .value=${e.forMinutes}
          @input=${o=>this._patchCondition(t,{forMinutes:o.target.value})}></ms-textfield>
      `}if(e.type==="runtime"){let i=e.entityIds.split(",")[0]?.trim()||"";return a`
        <ms-textfield label="${V("runtime_hours",r)}" type="number" .value=${e.runtimeHours}
          @input=${o=>this._patchCondition(t,{runtimeHours:o.target.value})}></ms-textfield>
        ${this._renderOnStatesField({value:e.onStates,entityId:i,onInput:o=>this._patchCondition(t,{onStates:o})})}
      `}return e.type==="due_date"?a`
        <ms-textfield label="${V("days_before",r)}" type="number" step="1"
          min=${a5[0]} max=${a5[1]} .value=${e.daysBefore}
          @input=${i=>this._patchCondition(t,{daysBefore:i.target.value})}></ms-textfield>
      `:s}_renderUnitSelect(){let e=this._lang;return a`
      <div class="select-row">
        ${N()?s:a`<label>${V("interval_unit",e)}</label>`}
        ${B({label:V("interval_unit",e),value:this._intervalUnit,onChange:t=>this._intervalUnit=t.target.value},a`
          ${["days","weeks","months","years"].map(t=>a`<option value=${t} ?selected=${t===this._intervalUnit}>${V("unit_"+t,e)}</option>`)}
        `)}
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(Z3.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(c._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let r=(M,d,p=0)=>{if(!(!M||p>10)){(M.tagName?.toLowerCase()??"")==="ha-entity-picker"&&d.push(M);for(let m of[M.shadowRoot,M])if(m)for(let A of Array.from(m.children??[]))r(A,d,p+1)}},i=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],o=[];for(let M of i)r(M,o);let L=o.length===0||o.some(M=>M.offsetHeight===0);if(e.offsetHeight===0||L){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){++this._previewSeq,this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let r=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{},...this._taskId?{entry_id:this._entryId,task_id:this._taskId}:{}});if(t!==this._previewSeq)return;this._schedulePreview=r.occurrences||[],this._schedulePreviewEnded=!!r.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return s;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",r=this._schedulePreview.map((o,L)=>{let M=new Date(`${o}T12:00:00`).getDay();return`${D1(M===0?6:M-1,e,"short")} ${P(o,e)}${L===0?t:""}`}).join(" \xB7 "),i=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?a`<div class="field-help">${V("schedule_preview_ontime",e)}</div>`:s;return a`
      <div class="trigger-live-hint schedule-preview">
        ${V("schedule_preview_title",e)}: ${r}${this._schedulePreviewEnded?a` <span class="field-help">${V("schedule_preview_ends",e)}</span>`:s}
        ${i}
      </div>
    `}_buildSchedule(){let e=i=>{let o=parseInt(this._calOffset,10)||0;return o&&(i.offset=Math.max(-L5,Math.min(o,L5))),i},t=i=>((this._calMonths.length||this._hadCalMonths)&&(i.months=[...this._calMonths].sort((o,L)=>o-L)),e(i));if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((i,o)=>i-o)});if(this._scheduleType==="nth_weekday")return t({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let r={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(r.business=!0),t(r)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,r)=>t-r)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleCalMonth(e){this._calMonths=this._calMonths.includes(e)?this._calMonths.filter(t=>t!==e):[...this._calMonths,e]}_renderCalMonths(){let e=this._lang;return a`
      <label class="field-label">${V("recurrence_months_label",e)}</label>
      <div class="field-help">${V("recurrence_months_hint",e)}</div>
      <div class="weekday-chips season-chips cal-month-chips">
        ${V6(e).map((t,r)=>a`
          <button
            type="button"
            class="season-chip ${this._calMonths.includes(r+1)?"selected":""}"
            @click=${()=>this._toggleCalMonth(r+1)}
          >${t}</button>`)}
      </div>`}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||Z3.includes(this._scheduleType)))return s;let r=V6(e);return a`
      <label class="field-label">${V("season_window_label",e)}</label>
      <div class="field-help">${V("season_window_hint",e)}</div>
      <div class="weekday-chips season-chips">
        ${r.map((i,o)=>a`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(o+1)?"selected":""}"
            @click=${()=>this._toggleSeasonMonth(o+1)}
          >${i}</button>`)}
      </div>

      <label class="field-label">${V("series_end_label",e)}</label>
      <div class="select-row">
        ${B({label:V("series_end_label",e),value:this._endsMode,onChange:i=>this._endsMode=i.target.value},a`
          <option value="never" ?selected=${this._endsMode==="never"}>${V("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${V("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${V("series_end_until",e)}</option>
        `)}
      </div>
      ${this._endsMode==="count"?a`
        <!-- max: MAX_SERIES_COUNT (const.py), what the history can count. -->
        <ms-textfield
          label="${V("series_end_count_label",e)}"
          type="number" min="1" max="500"
          .value=${this._endsCount}
          @input=${i=>this._endsCount=i.target.value}
        ></ms-textfield>`:s}
      ${this._endsMode==="until"?a`
        <ms-date-field
          kind="date"
          .hass=${this.hass}
          .lang=${e}
          label="${V("series_end_until_label",e)}"
          .value=${this._endsUntil}
          @value-changed=${i=>this._endsUntil=i.detail.value}
        ></ms-date-field>`:s}
    `}_renderCalendarFields(){let e=this._lang,t=lt(e);if(this._scheduleType==="weekdays")return a`
        <label class="field-label">${V("recurrence_on_days",e)}</label>
        <div class="weekday-chips">
          ${t.map((r,i)=>a`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(i)?"selected":""}"
              @click=${()=>this._toggleWeekday(i)}
            >${r}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;if(this._scheduleType==="nth_weekday"){let r=[["1",V("ord_1",e)],["2",V("ord_2",e)],["3",V("ord_3",e)],["4",V("ord_4",e)],["5",V("ord_5",e)],["-1",V("ord_last",e)]];return a`
        <div class="select-row">
          ${N()?s:a`<label>${V("recurrence_occurrence",e)}</label>`}
          ${B({label:V("recurrence_occurrence",e),value:this._nth,onChange:i=>this._nth=i.target.value},a`
            ${r.map(([i,o])=>a`<option value=${i} ?selected=${i===this._nth}>${o}</option>`)}
          `)}
        </div>
        <div class="select-row">
          ${N()?s:a`<label>${V("recurrence_weekday",e)}</label>`}
          ${B({label:V("recurrence_weekday",e),value:this._nthWeekday,onChange:i=>this._nthWeekday=i.target.value},a`
            ${t.map((i,o)=>a`<option value=${String(o)} ?selected=${String(o)===this._nthWeekday}>${i}</option>`)}
          `)}
        </div>
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`}return this._scheduleType==="calendar"?a`
        ${this._entityPickerFallback?a`
          <ms-textfield
            label="${V("calendar_entity_label",e)}"
            helper="${V("calendar_entity_hint",e)}"
            .value=${this._calendarEntity}
            @input=${r=>this._calendarEntity=r.target.value.trim()}
          ></ms-textfield>
        `:a`
          <ha-form
            class="entity-picker-form calendar-entity-form"
            .hass=${this.hass}
            .schema=${[{name:"calendar_entity",selector:{entity:{domain:"calendar"}}}]}
            .data=${{calendar_entity:this._calendarEntity}}
            .computeLabel=${()=>V("calendar_entity_label",e)}
            .computeHelper=${()=>V("calendar_entity_hint",e)}
            @value-changed=${r=>{this._calendarEntity=(r.detail.value.calendar_entity||"").trim()}}
          ></ha-form>`}
        ${this._renderCalOffsetField()}`:this._scheduleType==="day_of_month"?a`
        ${this._domLastDay?s:a`
          <ms-textfield
            label="${V("recurrence_day",e)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${r=>this._domDay=r.target.value}
          ></ms-textfield>`}
        ${E({cls:"checkbox-row",checked:this._domLastDay,onChange:r=>this._domLastDay=r.target.checked},a`<span>${V("recurrence_last_day",e)}</span>`)}
        ${E({cls:"checkbox-row",checked:this._domBusiness,onChange:r=>this._domBusiness=r.target.checked},a`<span>${V("recurrence_business_day",e)}</span>`)}
        ${this._renderCalMonths()}
        ${this._renderCalOffsetField()}`:s}_renderCalOffsetField(){let e=this._lang;return a`
      <ms-textfield
        label="${V("recurrence_offset",e)}"
        helper="${V("recurrence_offset_help",e)}"
        type="number"
        min=${-L5}
        max=${L5}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return s;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?a`<div class="trigger-live-hint warn">${V("trigger_hint_overlap",this._lang)}</div>`:s,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let r=this.hass.states[t];if(!r)return e;let i=this._lang,o=r.attributes?.unit_of_measurement,L=typeof o=="string"&&o?` ${o}`:"",M=this._triggerAttribute?r.attributes?.[this._triggerAttribute]:r.state,d=typeof M=="number"?M:parseFloat(String(M)),p=M!=="unknown"&&M!=="unavailable"&&M!=null&&!isNaN(d),m=x=>f(x,i,{maximumFractionDigits:1}),A=[];if(this._triggerType==="threshold"){let x=parseFloat(this._triggerAbove),y=parseFloat(this._triggerBelow),_=parseFloat(this._triggerEquals),b=parseFloat(this._triggerNotEquals);if([x,y,_,b].every(h=>isNaN(h)))return s;p&&A.push(V("trigger_hint_now",i).replace("{value}",m(d)+L)),isNaN(x)||A.push(V("trigger_hint_above",i).replace("{target}",m(x)+L)),isNaN(y)||A.push(V("trigger_hint_below",i).replace("{target}",m(y)+L)),isNaN(_)||A.push(V("trigger_hint_equals",i).replace("{target}",m(_)+L)),isNaN(b)||A.push(V("trigger_hint_not_equals",i).replace("{target}",m(b)+L))}else if(this._triggerType==="counter"){let x=parseFloat(this._triggerTargetValue);if(isNaN(x))return s;this._triggerDeltaMode?this._taskId?A.push(V("trigger_hint_counter_delta_edit",i).replace("{target}",m(x)+L)):p?A.push(V("trigger_hint_counter_delta",i).replace("{value}",m(d)+L).replace("{due}",m(d+x)+L).replace("{target}",m(x)+L)):A.push(V("trigger_hint_counter_delta_edit",i).replace("{target}",m(x)+L)):(p&&A.push(V("trigger_hint_now",i).replace("{value}",m(d)+L)),A.push(V("trigger_hint_counter_abs",i).replace("{target}",m(x)+L)))}else if(this._triggerType==="runtime"){let x=parseFloat(this._triggerRuntimeHours);if(isNaN(x))return s;A.push(V("trigger_hint_runtime",i).replace("{hours}",m(x))),A.push(V("trigger_hint_state_now",i).replace("{value}",String(r.state)))}else if(this._triggerType==="state_change"){let x=parseInt(this._triggerTargetChanges,10)||1,y=this._triggerToState.trim();A.push((y?V("trigger_hint_state_change_to",i).replace("{state}",y):V("trigger_hint_state_change",i)).replace("{count}",String(x))),A.push(V("trigger_hint_state_now",i).replace("{value}",String(r.state)))}else if(this._triggerType==="due_date"){let x=parseInt(this._triggerDaysBefore,10)||0;A.push(x===0?V("trigger_hint_due_date_same_day",i):j5("trigger_hint_due_date","trigger_hint_due_date_one",x,i,"days"));let y=M==null?"":String(M);y&&!isNaN(Date.parse(y))&&A.push(V("trigger_hint_due_date_now",i).replace("{date}",P(y,i)))}return A.length?a`<div class="trigger-live-hint">${A.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?a`
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
      `:this._triggerType==="counter"?a`
        <ms-textfield
          label="${V("target_value",e)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${t=>this._triggerTargetValue=t.target.value}
        ></ms-textfield>
        ${E({checked:this._triggerDeltaMode,onChange:t=>this._triggerDeltaMode=t.target.checked},a`${V("delta_mode",e)}`)}
        ${this._triggerDeltaMode?a`
              <ms-textfield
                label="${V("baseline_start_value",e)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${t=>this._triggerBaselineValue=t.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId?V("baseline_start_help_edit",e):V("baseline_start_help",e)}
                ${this._taskId&&this._liveBaselineValue!=null?a`<div class="baseline-effective">
                      ${V("baseline_current_effective",e).replace("{value}",String(this._liveBaselineValue))}
                    </div>`:s}
              </div>
            `:s}
      `:this._triggerType==="state_change"?a`
        ${this._renderStateField({label:V("from_state_optional",e),value:this._triggerFromState,entityId:this._triggerEntityId,onInput:t=>this._triggerFromState=t})}
        <div class="field-help">${V("state_value_help",e)}</div>
        ${this._renderStateField({label:V("to_state_optional",e),value:this._triggerToState,entityId:this._triggerEntityId,onInput:t=>this._triggerToState=t})}
        <ms-textfield
          label="${V("target_changes",e)}"
          type="number"
          min=${X4[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${V("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?a`<div class="field-help">${V("state_latch_help",e)}</div>`:s}
        <ms-textfield
          label="${V("for_at_least_minutes",e)}"
          type="number"
          min=${y2[0]}
          .value=${this._triggerForMinutes}
          @input=${t=>this._triggerForMinutes=t.target.value}
        ></ms-textfield>
        <div class="field-help">${V("for_minutes_state_help",e)}</div>
      `:this._triggerType==="runtime"?a`
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
      `:this._triggerType==="due_date"?a`
        <ms-textfield
          label="${V("days_before",e)}"
          type="number"
          step="1"
          min=${a5[0]}
          max=${a5[1]}
          .value=${this._triggerDaysBefore}
          @input=${t=>this._triggerDaysBefore=t.target.value}
        ></ms-textfield>
        <div class="field-help">${V("days_before_help",e)}</div>
      `:s}_section(e,t,r){return a`<section class="form-section ${e}">
      <h3 class="section-title">${t}</h3>
      ${r}
    </section>`}_renderIdentity(e){return a`
          ${this._taskId===null&&this._objectChoices.length>0?a`
            <div class="select-row">
              ${N()?s:a`<label>${V("object",e)}</label>`}
              ${B({label:V("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},a`
                ${this._objectChoices.map(t=>a`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
              `)}
            </div>
          `:s}
          <ms-textfield
            label="${V("task_name",e)}"
            required
            .value=${this._name}
            @input=${t=>this._name=t.target.value}
          ></ms-textfield>
          <div class="select-row">
            ${N()?s:a`<label>${V("maintenance_type",e)}</label>`}
            ${B({label:V("maintenance_type",e),value:this._type,onChange:t=>this._type=t.target.value},a`
              ${r6.map(t=>a`<option value=${t} ?selected=${t===this._type}>${V(t,e)}</option>`)}
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
          ${E({cls:"toggle-row",checked:this._enabled,onChange:t=>this._enabled=t.target.checked},a`${V("task_enabled",e)}`)}
    `}_renderDetails(e){return a`
      ${M1({cls:"details-section",open:this._detailsOpen,header:V("task_section_details",e)},a`
        <div class="select-row">
          ${N()?s:a`<label>${V("priority",e)}</label>`}
          ${B({label:V("priority",e),value:this._priority,onChange:t=>this._priority=t.target.value},a`
            ${Z0.map(t=>a`<option value=${t} ?selected=${t===this._priority}>${V("priority_"+t,e)}</option>`)}
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
    `}_renderScheduleSection(e){return this._section("schedule-section",V("task_section_schedule",e),a`
          <div class="select-row">
            ${N()?s:a`<label>${V("schedule_type",e)}</label>`}
            ${B({label:V("schedule_type",e),value:this._scheduleType,onChange:t=>this._scheduleType=t.target.value},a`
              ${at.map(t=>a`<option value=${t} ?selected=${t===this._scheduleType}>${V(t,e)}</option>`)}
            `)}
          </div>
          ${this._scheduleType==="time_based"?a`
                <ms-textfield
                  label="${V("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${t=>this._intervalDays=t.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  ${N()?s:a`<label>${V("interval_anchor",e)}</label>`}
                  ${B({label:V("interval_anchor",e),value:this._intervalAnchor,onChange:t=>this._intervalAnchor=t.target.value},a`
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${V("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${V("anchor_planned",e)}</option>
                  `)}
                  <div class="field-help anchor-help">${V("interval_anchor_hint",e)}</div>
                </div>
              `:s}
          ${this._renderCalendarFields()}
          ${this._scheduleType==="one_time"?a`
                <ms-date-field
                  kind="date"
                  .hass=${this.hass}
                  .lang=${e}
                  label="${V("due_date",e)}"
                  .value=${this._dueDate}
                  @value-changed=${t=>this._dueDate=t.detail.value}
                ></ms-date-field>
              `:s}
          ${this.scheduleTimeEnabled&&H6.includes(this._scheduleType)?a`
            ${E({cls:"checkbox-row schedule-time-toggle",checked:this._scheduleTimeOn,onChange:t=>this._scheduleTimeOn=t.target.checked},a`<span>${V("schedule_time_toggle",e)}</span>`)}
            ${this._scheduleTimeOn?a`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${e}
                .value=${this._scheduleTime}
                helper="${V("schedule_time_help",e)}"
                @value-changed=${t=>this._scheduleTime=t.detail.value}
              ></ms-date-field>
            `:s}
          `:s}
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
            min=${g0[0]}
            max=${g0[1]}
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
    `)}_renderTriggerSection(e){return this._scheduleType!=="sensor_based"?s:this._section("trigger-section",V("task_section_trigger",e),a`
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?a`
            ${this._entityPickerFallback?a`
              <ms-textfield
                label="${V("environmental_entity_optional",e)}"
                helper="${V("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${t=>this._environmentalEntity=t.target.value.trim()}
              ></ms-textfield>
            `:a`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:B9}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>V("environmental_entity_optional",e)}
              .computeHelper=${()=>V("environmental_entity_helper",e)}
              @value-changed=${t=>{this._environmentalEntity=(t.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):s}
          `:s}
    `)}_renderCompletionSection(e){return this._section("completion-section",V("task_section_completion",e),a`
          ${this._type==="reading"?a`
                <ms-textfield
                  label="${V("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${t=>this._readingUnit=t.target.value}
                ></ms-textfield>
                <div class="field-help">${V("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:s}
          ${this.checklistsEnabled?a`
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
          `:s}
          ${this._partsLoadFailed?a`<div class="field-help parts-load-failed">${V("parts_load_failed",e)}</div>`:s}
          ${this._isFleetTask?a`<div class="field-help parts-fleet-hint">${V("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?a`
                <div class="field">
                  <label>${V("consumes_parts_label",e)}</label>
                  ${this.parts.map(t=>this._renderConsumesRow(t))}
                  ${this._foreignOwners.length?a`
                        ${M1({cls:"shared-pools",open:this._hasForeignPick,header:V("shared_parts_other_objects",e)},a`
                          <div class="field-help">${V("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(t=>a`
                              <div class="shared-pool-owner">${t.name}</div>
                              ${t.parts.map(r=>this._renderConsumesRow(r,t.entry_id))}
                            `)}
                        `)}
                      `:s}
                </div>
              `:s}
          <div class="field-label">${V("require_on_completion",e)}</div>
          <div class="required-completion">
            ${S0.map(t=>a`
              ${E({cls:"req-option",checked:this._requiredCompletion.includes(t),onChange:r=>this._toggleRequired(t,r.target.checked)},a`<span>${V($2[t],e)}</span>`)}
            `)}
          </div>
          ${this._availableTags.length>0?a`
              <div class="select-row">
                ${N()?s:a`<label>${V("nfc_tag_id_optional",e)}</label>`}
                ${B({label:V("nfc_tag_id_optional",e),value:this._nfcTagId,onChange:t=>this._nfcTagId=t.target.value},a`
                  <option value="" ?selected=${!this._nfcTagId}>${V("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(t=>a`<option value=${t.id} ?selected=${t.id===this._nfcTagId}>${t.name}</option>`)}
                `)}
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${V("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:a`
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
          ${E({cls:"req-option",checked:this._requireTagScan,onChange:t=>this._requireTagScan=t.target.checked},a`<span>${V("require_tag_scan",e)}</span>`)}
          ${this._requireTagScan?a`<div class="field-help">${V("require_tag_scan_help",e)}</div>`:s}
          ${E({cls:"req-option",checked:!this._allowSkip,onChange:t=>this._allowSkip=!t.target.checked},a`<span>${V("disallow_skip",e)}</span>`)}
          ${this._allowSkip?s:a`<div class="field-help">${V("disallow_skip_help",e)}</div>`}
          ${this._renderQuickComplete(e)}
          ${this._renderCompleteWhen(e)}
          ${this._renderPhasesEditor(e)}
          ${this._renderCompletionActionsSection(e)}
    `)}_renderPeopleSection(e){return this._section("people-section",V("task_section_people",e),a`
          <div class="select-row">
            ${N()?s:a`<label>${V("responsible_user",e)}</label>`}
            ${B({label:V("responsible_user",e),value:this._responsibleUserId||"",onChange:t=>{let r=t.target.value;this._responsibleUserId=r||null}},a`
              <option value="" ?selected=${!this._responsibleUserId}>${V("no_user_assigned",e)}</option>
              ${this._availableUsers.map(t=>a`<option value=${t.id} ?selected=${t.id===this._responsibleUserId}>${t.name}</option>`)}
            `)}
          </div>
          ${this._availableUsers.length>=2?a`
            <div class="field">
              <label>${V("task_shared_with",e)}</label>
              <div class="field-help">${V("task_shared_with_help",e)}</div>
              ${this._responsibleUserId&&this._assigneePool.length>0&&!(this._assigneePool.length>=2&&this._rotationStrategy)?a`<div class="field-help shared-responsible-wins">${V("task_shared_responsible_wins",e)}</div>`:s}
              <div class="assignee-pool">
                ${this._availableUsers.map(t=>a`
                  ${E({cls:"pool-item",checked:this._assigneePool.includes(t.id),onChange:()=>this._toggleAssignee(t.id)},a`<span>${t.name}</span>`)}`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?a`
              <div class="select-row">
                ${N()?s:a`<label>${V("rotation_strategy",e)}</label>`}
                ${B({label:V("rotation_strategy",e),value:this._rotationStrategy,onChange:t=>this._rotationStrategy=t.target.value},a`
                  <option value="" ?selected=${!this._rotationStrategy}>${V("rotation_none",e)}</option>
                  ${d9.map(t=>a`<option value=${t} ?selected=${t===this._rotationStrategy}>${V("rotation_"+t,e)}</option>`)}
                `)}
              </div>`:s}
          `:s}
    `)}_renderNotificationsSection(e){return this._section("notifications-section",V("task_section_notifications",e),a`
          ${E({cls:"req-option",checked:!this._notifyEnabled,onChange:t=>this._notifyEnabled=!t.target.checked},a`<span>${V("no_notifications",e)}</span>`)}
          ${this._notifyEnabled?s:a`<div class="field-help">${V("no_notifications_help",e)}</div>`}
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${V("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${t=>this._notifyIcon=t.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||N0(this._type)}></ha-icon>
            ${V("notify_icon_hint",e).replace("{default}",N0(this._type))}
          </div>
          ${this._renderMirrorTodo(e)}
    `)}_renderMirrorTodo(e){let t=this.mirrorTodoDefault;if(!t.length)return a`
          <div class="field mirror-todo-field">
            ${this._renderMirrorTodoPicker(e)}
            <div class="field-help">${V("task_mirror_todo_hint",e)}</div>
          </div>`;let r=t.map(o=>d5(this.hass,o)).join(", "),i={default:V("task_mirror_todo_default",e).replace("{lists}",r),own:V("task_mirror_todo_own",e),none:V("task_mirror_todo_none",e)};return a`
          <div class="field mirror-todo-field">
            <div class="mirror-todo-choice" role="radiogroup" aria-label=${V("task_mirror_todo",e)}>
              <div class="field-label">${V("task_mirror_todo",e)}</div>
              ${Object.keys(i).map(o=>a`
                <label class="mirror-todo-option">
                  <input type="radio" name="mirror-todo" value=${o} .checked=${this._mirrorTodoMode===o}
                    @change=${()=>this._mirrorTodoMode=o} />
                  ${i[o]}
                </label>
              `)}
            </div>
            ${this._mirrorTodoMode==="own"?this._renderMirrorTodoPicker(e):s}
            ${this._mirrorTodoMode!=="none"?a`<div class="field-help">${V("task_mirror_todo_hint",e)}</div>`:s}
          </div>`}_renderMirrorTodoPicker(e){return a`
            ${this._entityPickerFallback?a`
              <ms-textfield
                label="${V("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${t=>{this._mirrorTodoEntities=_3(this.hass,t.target.value.split(",").map(r=>r.trim()))}}
              ></ms-textfield>
            `:a`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"],exclude_entities:N9(this.hass)}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>V("task_mirror_todo",e)}
                @value-changed=${t=>{this._mirrorTodoEntities=_3(this.hass,t.detail.value.mirror_todo_entities||[])}}
              ></ha-form>`}
            <div class="field-help mirror-todo-max">${V("task_mirror_todo_max",e).replace("{max}",String(5))}</div>`}_ruleDraft(){let e=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];return{name:this._name,enabled:this._enabled,typeLabel:V(this._type,this._lang),scheduleType:this._scheduleType,intervalDays:this._intervalDays,intervalUnit:this._intervalUnit,intervalAnchor:this._intervalAnchor,dueDate:this._dueDate,weekdays:this._weekdays,nth:this._nth,nthWeekday:this._nthWeekday,domDay:this._domDay,domLastDay:this._domLastDay,calendarEntity:this._calendarEntity?d5(this.hass,this._calendarEntity):"",warningDays:this._warningDays,triggerType:this._triggerType,triggerEntityIds:e,triggerAttribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,daysBefore:this._triggerDaysBefore,triggerCombinator:this._triggerCombinator,entityLogic:this._triggerEntityLogic,compoundLogic:this._compoundLogic,compoundCount:this._compoundConditions.length,compoundEntityIds:this._compoundConditions.flatMap(t=>t.entityIds.split(",").map(r=>r.trim()).filter(Boolean)),completeWhenEntity:this._completeWhenEntity,completeWhenState:this._completeWhenState,completeWhenFor:this._completeWhenFor,completeWhenAnyTime:this._completeWhenAnyTime,quickOn:this._quickOn,requiredCount:this._requiredCompletion.length,allowSkip:this._allowSkip,requireTagScan:this._requireTagScan,checklistCount:this.checklistsEnabled?this._checklistText.split(`
`).filter(t=>t.trim()).length:0,partsCount:Object.keys(this._consumesParts).length,responsibleUserId:this._responsibleUserId,pool:this._assigneePool,rotation:this._rotationStrategy,notifyEnabled:this._notifyEnabled,mirrorLists:this._mirrorListsShown()}}_mirrorListsShown(){return this.mirrorTodoDefault.length?this._mirrorTodoMode==="default"?this.mirrorTodoDefault:this._mirrorTodoMode==="own"?this._mirrorTodoEntities:[]:this._mirrorTodoMode==="none"?[]:this._mirrorTodoEntities}_userName(e){return this._availableUsers.find(t=>t.id===e)?.name??e}_sidebarTitle(e,t){switch(e){case"task":return V("task_section_details",t);case"schedule":return V("task_section_schedule",t);case"trigger":return V("task_section_trigger",t);case"completion":return V("task_section_completion",t);case"people":return V("task_section_people",t);case"notifications":return V("task_section_notifications",t);default:return V("beta_rules_add_rule",t)}}_selectRule(e){this._ruleSel=this._ruleSel===e?null:e,e==="add"&&this._loadObjectDevice()}_removeRule(e){e==="trigger"?(this._resetTriggerFields(),this._scheduleType=parseInt(this._intervalDays,10)>0?"time_based":"manual"):e==="schedule"&&(this._scheduleType==="sensor_based"?this._intervalDays="":this._scheduleType="manual"),this._ruleSel===e&&(this._ruleSel=null)}_combineTrigger(e,t=""){if(this._triggerType!=="compound"){let r=this._triggerEntityIds.length?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[];this._compoundConditions=[{entityIds:r.join(", "),...this._typeFields(),carry:{}}],this._compoundLogic="OR",this._triggerType="compound",this._triggerEntityId="",this._triggerEntityIds=[]}this._compoundConditions=[...this._compoundConditions,{...b3(),type:e,entityIds:t}]}_setSensorRule(e,t=""){this._scheduleType!=="time_based"&&this._scheduleType!=="sensor_based"&&(this._intervalDays=""),this._scheduleType="sensor_based",this._resetTriggerFields(),this._triggerType=e,e==="compound"&&(this._compoundConditions=[b3()]),t&&(this._triggerEntityId=t,this._triggerEntityIds=[t],this._seedUpdateRule(),this._fetchEntityAttributes(t))}_seedUpdateRule(){this._triggerType!=="state_change"||this._triggerEntityIds.length!==1||!this._triggerEntityId.startsWith("update.")||this._triggerFromState.trim()||this._triggerToState.trim()||(this._triggerFromState="off",this._triggerToState="on",this._autoCompleteOnRecovery=!0,this._holdUntilDone=!1)}_applyChoice(e){if(e.kind==="schedule"){if(e.effect==="safety"){parseInt(this._intervalDays,10)>0||(this._intervalDays="30"),this._ruleSel="trigger";return}this._scheduleType==="sensor_based"&&this._resetTriggerFields(),e.value==="time_based"&&!(parseInt(this._intervalDays,10)>0)&&(this._intervalDays="30"),this._scheduleType=e.value,this._ruleSel="schedule";return}let t=e.value;e.effect==="combine"?this._combineTrigger(t):this._setSensorRule(t),this._ruleSel="trigger"}_applySuggestion(e){if(e.target==="done_when"){e.entityId!==this._completeWhenEntity&&(this._completeWhenState=""),this._completeWhenEntity=e.entityId,this._ruleSel="completion";return}let t=e.triggerType??"threshold";this._scheduleType==="sensor_based"&&(this._triggerType==="compound"||!!this._triggerEntityId)?this._combineTrigger(t,e.entityId):this._setSensorRule(t,e.entityId),this._ruleSel="trigger"}async _loadObjectDevice(){let e=this._entryId;if(!e||this._objectDevice?.entryId===e)return;let t=null,r=null;try{let o=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"}))?.objects??[]).find(L=>L.entry_id===e);t=o?.object.ha_device_id??null,r=o?.object.area_id??null}catch{}this._entryId===e&&(this._objectDevice={entryId:e,deviceId:t,areaId:r})}async _loadTemplateChoices(){if(this._templateChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/templates",language:this._lang});this._templateChoices=(e?.templates??[]).filter(t=>!t.disabled).flatMap(t=>(t.tasks??[]).map(r=>({...r,template:t.name})))}catch{this._templateChoices=[]}}async _loadCopyChoices(){if(this._copyChoices===null)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._copyChoices=(e?.objects??[]).flatMap(t=>(t.tasks??[]).filter(r=>!r.battery_fleet_task&&!r.part_ref).map(r=>({entryId:t.entry_id,objectName:t.object.name,task:r})))}catch{this._copyChoices=[]}}_applyTemplateTask(e){this._name=e.name,this._type=r6.includes(e.type)?e.type:"custom";let t=e.interval_days&&e.interval_days>0?String(e.interval_days):"";e.schedule_type==="sensor_based"?(this._scheduleType="sensor_based",this._intervalDays=t):e.schedule_type==="manual"||!t?this._scheduleType="manual":(this._scheduleType="time_based",this._intervalDays=t,this._intervalUnit="days"),e.warning_days!==null&&e.warning_days!==void 0&&(this._warningDays=String(e.warning_days)),this._betaStep="form",this._ruleSel=this._scheduleType==="sensor_based"?"add":"schedule",this._ruleSel==="add"&&(this._addTab="device",this._loadObjectDevice())}async _applyCopy(e){let t=this._entryId,r=this._objectChoices;await this._edit(e.entryId,e.task),this._taskId=null,this._entryId=t,this._objectChoices=r,this._series=[],this._isFleetTask=!1,this._lastPerformed="",this._nfcTagId="",this._consumesParts={},this._consumesQtyText={},this._phaseDefs=this._phaseDefs.map(i=>({...i,partId:"",partQty:"",extraParts:[]})),await Promise.all([this._loadParts(),this._loadForeignPools()]),this._betaStep="form",this._ruleSel="task"}_choiceNote(e,t){return e.effect==="replace"?V("beta_rules_replaces",t):e.effect==="combine"?V("beta_rules_combines",t):e.effect==="safety"?V("beta_rules_adds_safety",t):""}_renderAddPicker(e){let t=a`
      <div class="add-tabs" role="tablist" aria-label=${V("beta_rules_add_rule",e)}>
        <button type="button" role="tab" class="add-tab-type" aria-selected=${this._addTab==="type"?"true":"false"}
          @click=${()=>{this._addTab="type"}}>${V("beta_rules_by_type",e)}</button>
        <button type="button" role="tab" class="add-tab-device" aria-selected=${this._addTab==="device"?"true":"false"}
          @click=${()=>{this._addTab="device",this._loadObjectDevice()}}>${V("beta_rules_by_device",e)}</button>
      </div>`;if(this._addTab==="type"){let p=W9({scheduleType:this._scheduleType,intervalDays:this._intervalDays,triggerType:this._triggerType}),m=A=>{let x=this._choiceNote(A,e);return a`
          <button type="button" class="add-choice" data-kind=${A.kind} data-value=${A.value} @click=${()=>this._applyChoice(A)}>
            <ha-icon icon=${A.icon}></ha-icon>
            <span class="add-choice-text">
              <span>${A.kind==="trigger"?f3(A.value,e):V(A.value,e)}</span>
              ${x?a`<span class="add-choice-note">${x}</span>`:s}
            </span>
          </button>`};return a`${t}
        <div class="add-group">${V("task_section_schedule",e)}</div>
        ${p.filter(A=>A.kind==="schedule").map(m)}
        <div class="add-group">${V("task_section_trigger",e)}</div>
        ${p.filter(A=>A.kind==="trigger").map(m)}`}let r=this._objectDevice;if(r===null||r.entryId!==this._entryId)return a`${t}<div class="field-help">…</div>`;if(!r.deviceId&&!r.areaId)return a`${t}<div class="field-help beta-no-device">${V("beta_rules_no_device",e)}</div>`;let i=U9(this.hass,{deviceId:r.deviceId,areaId:r.areaId,ownPlatform:"maintenance_supporter"});if(!i.length)return a`${t}<div class="field-help beta-no-device">${V(r.deviceId?"beta_rules_no_device_entities":"beta_rules_no_area_entities",e)}</div>`;let o=r.areaId||(r.deviceId?this.hass.devices?.[r.deviceId]?.area_id:null)||"",L=this.hass.areas?.[o]?.name||o,M=i.some(p=>p.group==="device"),d=(p,m)=>{if(m>0&&i[m-1].group===p.group)return s;let A=p.group==="device"?V("beta_rules_group_device",e):V(M?"beta_rules_group_area_more":"beta_rules_group_area",e).replace("{area}",L);return a`<div class="add-group device-group" data-group=${p.group}>${A}</div>`};return a`${t}
      ${i.map((p,m)=>a`${d(p,m)}
        <div class="device-entity" data-entity=${p.entityId} data-group=${p.group}>
          <div class="device-entity-name">${p.name}</div>
          <div class="device-entity-choices">
            ${q0(p).map(A=>a`
              <button type="button" class="add-choice" data-target=${A.target} data-type=${A.triggerType??""} @click=${()=>this._applySuggestion(A)}>
                <ha-icon icon=${A.icon}></ha-icon>
                <span>${A.target==="done_when"?V("beta_rules_done_when_suggest",e):f3(A.triggerType??"",e)}</span>
              </button>`)}
          </div>
        </div>`)}`}_renderSidebarBody(e,t){switch(e){case"task":return this._renderIdentity(t);case"schedule":return this._renderScheduleSection(t);case"trigger":return this._renderTriggerSection(t);case"completion":return this._renderCompletionSection(t);case"people":return this._renderPeopleSection(t);case"notifications":return this._renderNotificationsSection(t);default:return this._renderAddPicker(t)}}_renderRules(e){let t=z9(this._ruleDraft(),{lang:e,entityName:p=>d5(this.hass,p),userName:p=>this._userName(p)}),r=new Map(t.map(p=>[p.id,p])),i=[{title:V("task_section_details",e),ids:["task"]},{title:V("task_section_schedule",e),ids:["schedule","trigger"],add:!0},{title:V("task_section_completion",e),ids:["completion"]},{title:V("task_section_people",e),ids:["people"]},{title:V("task_section_notifications",e),ids:["notifications"]}],o=0,L=1,M=[];for(let p of i){o+=2,M.push(a`<h3 class="rules-group-title" style="order:${o}">${p.title}</h3>`);for(let m of p.ids){let A=r.get(m);if(!A)continue;o+=2,this._ruleSel===m&&(L=o+1);let x=this._ruleSel===m;M.push(a`
          <div class="rule-row ${x?"selected":""}" data-row=${A.id} style="order:${o}">
            <button type="button" class="rule-main" aria-expanded=${x?"true":"false"} @click=${()=>this._selectRule(A.id)}>
              <ha-icon icon=${A.icon}></ha-icon>
              <span class="rule-text">
                <span class="rule-sentence">${A.text}</span>
                ${A.chips.map(y=>a`<span class="rule-chip">${y}</span>`)}
                ${A.badges.length?a`<span class="rule-badges">${A.badges.map(y=>a`<span class="rule-badge">${y}</span>`)}</span>`:s}
              </span>
            </button>
            ${A.removable?a`
              <ha-icon-button class="rule-remove" .path=${Vt} .label=${V("remove",e)} title=${V("remove",e)}
                @click=${()=>this._removeRule(A.id)}></ha-icon-button>`:s}
          </div>`)}p.add&&(o+=2,this._ruleSel==="add"&&(L=o+1),M.push(a`
          <button type="button" class="rule-add" style="order:${o}" aria-expanded=${this._ruleSel==="add"?"true":"false"}
            @click=${()=>this._selectRule("add")}>
            <ha-icon icon="mdi:plus"></ha-icon>${V("beta_rules_add_rule",e)}
          </button>`))}let d=this._ruleSel;return a`
      <div class="rules-layout">
        ${M}
        <aside class="rules-sidebar ${d?"open":""}" style="order:${L}" aria-label=${d?this._sidebarTitle(d,e):V("beta_rules_select_hint",e)}>
          ${d?a`
                <div class="sidebar-head">
                  <ha-icon-button .path=${it} .label=${V("close",e)} @click=${()=>{this._ruleSel=null}}></ha-icon-button>
                  <span class="sidebar-title">${this._sidebarTitle(d,e)}</span>
                </div>
                <div class="sidebar-body">${this._renderSidebarBody(d,e)}</div>`:a`<div class="sidebar-hint">${V("beta_rules_select_hint",e)}</div>`}
        </aside>
      </div>`}_renderObjectChoice(e){return this._taskId!==null||this._objectChoices.length===0?s:a`
      <div class="select-row">
        ${N()?s:a`<label>${V("object",e)}</label>`}
        ${B({label:V("object",e),value:this._entryId,onChange:t=>{this._entryId=t.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}},a`
          ${this._objectChoices.map(t=>a`<option value=${t.entry_id} ?selected=${t.entry_id===this._entryId}>${t.name}</option>`)}
        `)}
      </div>`}_renderChooser(e){let t=(r,i,o,L,M)=>a`
      <button type="button" class="chooser-item ${r}" @click=${M}>
        <ha-icon icon=${i}></ha-icon>
        <span class="chooser-text">
          <span class="chooser-title">${o}</span>
          <span class="chooser-desc">${L}</span>
        </span>
        <ha-icon icon="mdi:chevron-right"></ha-icon>
      </button>`;return a`
      ${this._renderObjectChoice(e)}
      <div class="chooser">
        ${t("chooser-scratch","mdi:pencil",V("beta_new_scratch",e),V("beta_new_scratch_desc",e),()=>{this._betaStep="form",this._ruleSel="task"})}
        ${t("chooser-sensor","mdi:auto-fix",V("beta_new_from_sensor",e),V("beta_new_from_sensor_desc",e),()=>{this._betaStep="form",this._ruleSel="add",this._addTab="device",this._loadObjectDevice()})}
        ${t("chooser-template","mdi:text-box-outline",V("templates_from",e),V("beta_new_from_template_desc",e),()=>{this._betaStep="template",this._chooserFilter="",this._loadTemplateChoices()})}
        ${t("chooser-copy","mdi:content-copy",V("beta_new_copy",e),V("beta_new_copy_desc",e),()=>{this._betaStep="copy",this._chooserFilter="",this._loadCopyChoices()})}
      </div>`}_renderSearch(e){return a`<input type="search" class="chooser-search" aria-label=${V("beta_new_search",e)} placeholder=${V("beta_new_search",e)}
      .value=${this._chooserFilter} @input=${t=>{this._chooserFilter=t.target.value}} />`}_renderTemplatePick(e){if(this._templateChoices===null)return a`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),r=this._templateChoices.filter(i=>!t||`${i.name} ${i.template}`.toLowerCase().includes(t)).slice(0,200);return a`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${r.length?r.map(i=>a`
          <button type="button" class="chooser-item template-task" @click=${()=>this._applyTemplateTask(i)}>
            <ha-icon icon=${i.schedule_type==="sensor_based"?"mdi:gauge":"mdi:calendar-sync"}></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${i.name}</span>
              <span class="chooser-desc">${i.template}${i.interval_days?a` · ${f(i.interval_days,e)} ${V("unit_days",e)}`:s}</span>
            </span>
          </button>`):a`<div class="chooser-empty">—</div>`}
      </div>`}_renderCopyPick(e){if(this._copyChoices===null)return a`<div class="chooser-empty">…</div>`;let t=this._chooserFilter.trim().toLowerCase(),r=this._copyChoices.filter(i=>!t||`${i.task.name} ${i.objectName}`.toLowerCase().includes(t)).slice(0,200);return a`
      ${this._renderSearch(e)}
      <div class="chooser">
        ${r.length?r.map(i=>a`
          <button type="button" class="chooser-item copy-task" @click=${()=>{this._applyCopy(i)}}>
            <ha-icon icon="mdi:content-copy"></ha-icon>
            <span class="chooser-text">
              <span class="chooser-title">${i.task.name}</span>
              <span class="chooser-desc">${i.objectName}</span>
            </span>
          </button>`):a`<div class="chooser-empty">—</div>`}
      </div>`}_renderBeta(e,t,r){let i=this._betaStep;return a`
      <ha-dialog open class="beta-dialog" .headerTitle=${t}
        .headerSubtitle=${this._series.length>1?V("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length)):void 0}
        @closed=${this._close}>
        <!-- HA's header (2026): the title beside the close button; on a
             step under the start screen HA's back arrow takes its place. -->
        ${i==="template"||i==="copy"?a`<ha-icon-button slot="headerNavigationIcon" class="beta-back" .path=${ot} .label=${V("back",e)}
              @click=${()=>{this._betaStep="choose"}}></ha-icon-button>`:s}
        <div class="content beta-content">
          ${this._error?j("error",this._error):s}
          ${this._warning?j("warning",this._warning):s}
          ${i==="choose"?this._renderChooser(e):i==="template"?this._renderTemplatePick(e):i==="copy"?this._renderCopyPick(e):this._renderRules(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${V("cancel",e)}</ha-button>
          ${i==="form"&&r?a`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${V("task_series_skip",e)}
              </ha-button>`:s}
          ${i==="form"?a`<ha-button @click=${this._save} .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}>
                ${this._loading?V("saving",e):V(r?"task_series_save_next":"save",e)}
              </ha-button>`:s}
        </div>
      </ha-dialog>
    `}render(){if(!this._open)return a``;let e=this._lang,t=this._taskId?V("edit_task",e):V("new_task",e),r=this._seriesIndex+1<this._series.length;return this.betaEditor?this._renderBeta(e,t,r):a`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">
          ${t}
          ${this._series.length>1?a`<span class="series-position">${V("task_series_position",e).replace("{n}",String(this._seriesIndex+1)).replace("{total}",String(this._series.length))}</span>`:s}
        </div>
        <div class="content">
          ${this._error?j("error",this._error):s}
          ${this._warning?j("warning",this._warning):s}
          ${this._renderIdentity(e)}
          ${this._renderScheduleSection(e)}
          ${this._renderTriggerSection(e)}
          ${this._renderCompletionSection(e)}
          ${this._renderPeopleSection(e)}
          ${this._renderNotificationsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${V("cancel",e)}</ha-button>
          ${r?a`<ha-button appearance="plain" class="series-skip" .disabled=${this._loading} @click=${this._skipSeriesItem}>
                ${V("task_series_skip",e)}
              </ha-button>`:s}
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()||this._missingDueDate()}
          >
            ${this._loading?V("saving",e):V(r?"task_series_save_next":"save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};c._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calMonths","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),c.styles=[N1,d4,Q9,g`
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
  `],n([u({attribute:!1})],c.prototype,"hass",2),n([u({type:Boolean,attribute:"checklists-enabled"})],c.prototype,"checklistsEnabled",2),n([u({type:Boolean,attribute:"schedule-time-enabled"})],c.prototype,"scheduleTimeEnabled",2),n([u({type:Boolean,attribute:"completion-actions-enabled"})],c.prototype,"completionActionsEnabled",2),n([u({type:Boolean,attribute:"adaptive-feature"})],c.prototype,"adaptiveFeature",2),n([u({type:Boolean,attribute:"seasonal-feature"})],c.prototype,"seasonalFeature",2),n([u({type:Boolean,attribute:"environmental-feature"})],c.prototype,"environmentalFeature",2),n([u({type:Number,attribute:"default-warning-days"})],c.prototype,"defaultWarningDays",2),n([u({attribute:!1})],c.prototype,"mirrorTodoDefault",2),n([u({type:Boolean,attribute:"beta-editor"})],c.prototype,"betaEditor",2),n([l()],c.prototype,"_ruleSel",2),n([l()],c.prototype,"_addTab",2),n([l()],c.prototype,"_betaStep",2),n([l()],c.prototype,"_chooserFilter",2),n([l()],c.prototype,"_templateChoices",2),n([l()],c.prototype,"_copyChoices",2),n([l()],c.prototype,"_objectDevice",2),n([l()],c.prototype,"parts",2),n([l()],c.prototype,"_foreignOwners",2),n([l()],c.prototype,"_open",2),n([l()],c.prototype,"_entityPickerFallback",2),n([l()],c.prototype,"_loading",2),n([l()],c.prototype,"_error",2),n([l()],c.prototype,"_warning",2),n([l()],c.prototype,"_entryId",2),n([l()],c.prototype,"_taskId",2),n([l()],c.prototype,"_series",2),n([l()],c.prototype,"_seriesIndex",2),n([l()],c.prototype,"_isFleetTask",2),n([l()],c.prototype,"_objectChoices",2),n([l()],c.prototype,"_name",2),n([l()],c.prototype,"_type",2),n([l()],c.prototype,"_scheduleType",2),n([l()],c.prototype,"_intervalDays",2),n([l()],c.prototype,"_intervalUnit",2),n([l()],c.prototype,"_dueDate",2),n([l()],c.prototype,"_warningDays",2),n([l()],c.prototype,"_earliestCompletionDays",2),n([l()],c.prototype,"_intervalAnchor",2),n([l()],c.prototype,"_weekdays",2),n([l()],c.prototype,"_nth",2),n([l()],c.prototype,"_nthWeekday",2),n([l()],c.prototype,"_domDay",2),n([l()],c.prototype,"_domLastDay",2),n([l()],c.prototype,"_domBusiness",2),n([l()],c.prototype,"_calOffset",2),n([l()],c.prototype,"_calMonths",2),n([l()],c.prototype,"_calendarEntity",2),n([l()],c.prototype,"_seasonMonths",2),n([l()],c.prototype,"_endsMode",2),n([l()],c.prototype,"_endsCount",2),n([l()],c.prototype,"_endsUntil",2),n([l()],c.prototype,"_schedulePreview",2),n([l()],c.prototype,"_schedulePreviewEnded",2),n([l()],c.prototype,"_notes",2),n([l()],c.prototype,"_documentationUrl",2),n([l()],c.prototype,"_customIcon",2),n([l()],c.prototype,"_notifyIcon",2),n([l()],c.prototype,"_priority",2),n([l()],c.prototype,"_labels",2),n([l()],c.prototype,"_detailsOpen",2),n([l()],c.prototype,"_mirrorTodoEntities",2),n([l()],c.prototype,"_mirrorTodoMode",2),n([l()],c.prototype,"_completeWhenEntity",2),n([l()],c.prototype,"_completeWhenState",2),n([l()],c.prototype,"_completeWhenAnyTime",2),n([l()],c.prototype,"_completeWhenFor",2),n([l()],c.prototype,"_enabled",2),n([l()],c.prototype,"_triggerEntityId",2),n([l()],c.prototype,"_triggerEntityIds",2),n([l()],c.prototype,"_triggerEntityLogic",2),n([l()],c.prototype,"_triggerAttribute",2),n([l()],c.prototype,"_triggerType",2),n([l()],c.prototype,"_triggerAbove",2),n([l()],c.prototype,"_triggerBelow",2),n([l()],c.prototype,"_triggerEquals",2),n([l()],c.prototype,"_triggerNotEquals",2),n([l()],c.prototype,"_triggerForMinutes",2),n([l()],c.prototype,"_triggerCombinator",2),n([l()],c.prototype,"_triggerTargetValue",2),n([l()],c.prototype,"_triggerDeltaMode",2),n([l()],c.prototype,"_triggerBaselineValue",2),n([l()],c.prototype,"_liveBaselineValue",2),n([l()],c.prototype,"_autoCompleteOnRecovery",2),n([l()],c.prototype,"_holdUntilDone",2),n([l()],c.prototype,"_triggerFromState",2),n([l()],c.prototype,"_triggerToState",2),n([l()],c.prototype,"_triggerTargetChanges",2),n([l()],c.prototype,"_triggerRuntimeHours",2),n([l()],c.prototype,"_triggerDaysBefore",2),n([l()],c.prototype,"_triggerRuntimeMaxSession",2),n([l()],c.prototype,"_triggerOnStates",2),n([l()],c.prototype,"_triggerDetailAttribute",2),n([l()],c.prototype,"_compoundLogic",2),n([l()],c.prototype,"_compoundConditions",2),n([l()],c.prototype,"_suggestedAttributes",2),n([l()],c.prototype,"_availableAttributes",2),n([l()],c.prototype,"_entityDomain",2),n([l()],c.prototype,"_lastPerformed",2),n([l()],c.prototype,"_nfcTagId",2),n([l()],c.prototype,"_requireTagScan",2),n([l()],c.prototype,"_allowSkip",2),n([l()],c.prototype,"_notifyEnabled",2),n([l()],c.prototype,"_readingUnit",2),n([l()],c.prototype,"_readings",2),n([l()],c.prototype,"_consumesParts",2),n([l()],c.prototype,"_consumesQtyText",2),n([l()],c.prototype,"_partsLoadFailed",2),n([l()],c.prototype,"_availableTags",2),n([l()],c.prototype,"_responsibleUserId",2),n([l()],c.prototype,"_assigneePool",2),n([l()],c.prototype,"_rotationStrategy",2),n([l()],c.prototype,"_availableUsers",2),n([l()],c.prototype,"_checklistText",2),n([l()],c.prototype,"_phaseDefs",2),n([l()],c.prototype,"_phaseSeq",2),n([l()],c.prototype,"_requiredCompletion",2),n([l()],c.prototype,"_scheduleTime",2),n([l()],c.prototype,"_scheduleTimeOn",2),n([l()],c.prototype,"_actionService",2),n([l()],c.prototype,"_actionTargetEntity",2),n([l()],c.prototype,"_actionSkipAuto",2),n([l()],c.prototype,"_actionPresent",2),n([l()],c.prototype,"_actionData",2),n([l()],c.prototype,"_actionDataJsonFallback",2),n([l()],c.prototype,"_actionTesting",2),n([l()],c.prototype,"_actionTestResult",2),n([l()],c.prototype,"_actionTestError",2),n([l()],c.prototype,"_quickOn",2),n([l()],c.prototype,"_qcNotes",2),n([l()],c.prototype,"_qcCost",2),n([l()],c.prototype,"_qcDuration",2),n([l()],c.prototype,"_qcFeedback",2),n([l()],c.prototype,"_environmentalEntity",2),n([l()],c.prototype,"_environmentalAttribute",2),n([l()],c.prototype,"_adaptiveEnabled",2),n([l()],c.prototype,"_adaptiveAlpha",2),n([l()],c.prototype,"_adaptiveMin",2),n([l()],c.prototype,"_adaptiveMax",2),n([l()],c.prototype,"_adaptiveSeasonal",2),n([l()],c.prototype,"_adaptivePrediction",2),n([l()],c.prototype,"_conditionAttrOptions",2);W0=c;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",W0)});function pt(C,H){C.key!=="Escape"||C.defaultPrevented||C.composedPath().some(e=>e instanceof Element&&e.localName==="ms-camera-capture")||(C.preventDefault(),C.stopPropagation(),H())}function n2(){return H1("ha-adaptive-dialog")}function N2(C,H,e={}){return n2()?a`
      <ha-adaptive-dialog open .headerTitle=${e.title}
        @closed=${t=>{t.target===t.currentTarget&&C()}}>
        <div class="ha-shell-body">${H}</div>
      </ha-adaptive-dialog>
    `:a`
    <div class="modal-layer top-layer" popover="manual" ${u3}>
      <div class="backdrop" @click=${C}></div>
      <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
        @keydown=${t=>pt(t,C)}>${H}</div>
    </div>
  `}function j2(C){C?.querySelector(".dialog")?.focus({preventScroll:!0})}var D2,y3=v(()=>{"use strict";k();V1();P0();D2=g`
  ${v3}
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
`});var G,n6=v(()=>{"use strict";k();D();w();V1();z0();g5();G=class extends Z{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._check="";this._checked=!0;this._resolve=null;this._promptResolve=null;this._checkResolve=null}_show(e){this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"",this._options=e.options&&e.options.length?e.options:null,this._inputValue=e.inputValue||"",this._check=e.check||"",this._checked=!0,this._resolve=null,this._promptResolve=null,this._checkResolve=null,this._open=!0}confirm(e){return this._show(e),new Promise(t=>this._resolve=t)}confirmWithCheck(e){return this._show(e),new Promise(t=>this._checkResolve=t)}prompt(e){return this._show(e),new Promise(t=>this._promptResolve=t)}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._checkResolve?.({confirmed:!1,checked:!1}),this._checkResolve=null,this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._checkResolve?.({confirmed:!0,checked:this._checked}),this._checkResolve=null,this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return s;let e=T(this.hass);return a`
      <ha-dialog open .headerTitle=${b1(this._title)} @closed=${this._cancel}>
        ${Z1(this._title)}
        <div class="content">
          ${this._message}
          ${this._check?E({cls:"confirm-check",checked:this._checked,onChange:t=>this._checked=t.target.checked},this._check):s}
          ${this._inputLabel?a`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              ${this._options?a`${B({cls:"field-input field-select",onChange:t=>this._inputValue=t.target.value},a`
                    ${this._options.map(t=>a`<option value=${t.value} ?selected=${t.value===this._inputValue}>${t.label}</option>`)}
                  `)}`:a`<input class="field-input"
                    type="${this._inputType||"text"}"
                    .value=${this._inputValue}
                    @input=${t=>this._inputValue=t.target.value} />`}
            </label>
          `:s}
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
    `}};G.styles=[N1,g`
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
  `],n([u({attribute:!1})],G.prototype,"hass",2),n([l()],G.prototype,"_open",2),n([l()],G.prototype,"_title",2),n([l()],G.prototype,"_message",2),n([l()],G.prototype,"_confirmText",2),n([l()],G.prototype,"_danger",2),n([l()],G.prototype,"_inputLabel",2),n([l()],G.prototype,"_inputType",2),n([l()],G.prototype,"_options",2),n([l()],G.prototype,"_inputValue",2),n([l()],G.prototype,"_check",2),n([l()],G.prototype,"_checked",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",G)});function ct(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function U0(C){let H=ct(),e=H.querySelector(`${s6}[${M6}]`);return e||(e=document.createElement(s6),e.setAttribute(M6,""),H.appendChild(e)),e.hass=C,e}function f5(C,H){return U0(C).confirm(H)}var s6,M6,S3=v(()=>{"use strict";n6();s6="maintenance-confirm-dialog",M6="data-ms-lovelace-confirm"});var Q1,G0=v(()=>{"use strict";k();D();d0();Q1=class extends Z{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await l0(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?s:this._url?a`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:a`<div class="ph"></div>`}};Q1.styles=g`
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
  `,n([u({attribute:!1})],Q1.prototype,"hass",2),n([u()],Q1.prototype,"docId",2),n([l()],Q1.prototype,"_url",2),n([l()],Q1.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",Q1)});var C1,l6=v(()=>{"use strict";k();D();w();p1();Y();s5();y3();O0();M3();S3();P2();l3();G0();_5();_5();G1();C1=class extends Z{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new T2(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return T(this.hass)}openEdit(e){this._openGen++,this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(e.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(e),this._loadPartOptions()}_seedReadings(e){let t=[],r=new Set;for(let o of e.readings??[])r.has(o.id)||(r.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));for(let o of e.reading_values??[])r.has(o.id)||(r.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));this._readingRows=t;let i={};for(let o of e.reading_values??[])i[o.id]=String(o.value);this._readingText=i,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let e={};for(let t of this._readingRows){let r=(this._readingText[t.id]??"").trim();if(r==="")continue;let i=parseFloat(r.replace(",","."));isNaN(i)||(e[t.id]=i)}return e}async _loadPartOptions(){let e=this._draft;if(!e)return;let t=this._openGen;try{let r=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(t!==this._openGen)return;let i=[];for(let L of r.parts||[]){let M=L.entry_id===e.entry_id,d=L.consumers.some(p=>p.entry_id===e.entry_id&&p.task_id===e.task_id);!M&&!d||i.push({part_id:L.part_id,name:L.name,entry_id:L.entry_id,foreign:!M,object_name:L.object_name})}for(let L of e.used_parts||[]){let M=L.entry_id||e.entry_id;i.some(d=>d.part_id===L.part_id&&d.entry_id===M)||i.push({part_id:L.part_id,name:L.name||L.part_id,entry_id:M,foreign:M!==e.entry_id,object_name:null})}let o={};for(let L of e.used_parts||[])o[`${L.entry_id||e.entry_id}:${L.part_id}`]=L.quantity??1;this._partOptions=i,this._partQty=o,this._partQtyOriginal=this._partSelectionKey()}catch{if(t!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[t])=>e.localeCompare(t)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let e=this._lang,r=(this._originalSnapshot.used_parts||[]).filter(M=>M.quantity>0).map(M=>`${f(M.quantity,e)}\xD7 ${M.name||M.part_id}`).join(", ");if(!await f5(this.hass,{title:V("history_delete_entry",e),message:r?`${V("history_delete_confirm_entry",e)} ${V("history_delete_returns_parts",e).replace("{parts}",r)}`:V("history_delete_confirm_entry",e),confirmText:V("delete",e),danger:!0})||!this._draft||!this._originalSnapshot)return;let o=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:o.entry_id,task_id:o.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:o.entry_id,task_id:o.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(e){return F(this,e,{busy:t=>{this._saving=t},onError:t=>{this._error=t}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let e=this._draft,t=this._originalSnapshot,r={type:"maintenance_supporter/task/history/update",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:t.original_timestamp};if(e.timestamp!==t.timestamp&&(r.timestamp=e.timestamp),e.notes!==t.notes&&(r.notes=e.notes),e.cost!==t.cost&&(r.cost=e.cost),e.duration!==t.duration&&(r.duration=e.duration),e.completed_by!==t.completed_by&&(r.completed_by=e.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(r.used_parts=(this._partOptions||[]).filter(o=>(this._partQty[`${o.entry_id}:${o.part_id}`]||0)>0).map(o=>({part_id:o.part_id,quantity:this._partQty[`${o.entry_id}:${o.part_id}`],...o.foreign?{entry_id:o.entry_id}:{}}))),e.reading_value!==t.reading_value&&(r.reading_value=e.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let o=this._readingNumbers(),L={};for(let M of this._readingRows)L[M.id]=o[M.id]??null;r.reading_values=L}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(r.photo_doc_ids=this._photos.ids),Object.keys(r).filter(o=>!["type","entry_id","task_id","original_timestamp"].includes(o)).length===0){this.close();return}await this._runWs(r)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:e.entry_id,task_id:e.task_id,new_timestamp:e.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return s;let e=this._lang,t=this._draft,r=this._error||this._photos.errorText(e);return N2(()=>this.close(),a`
        ${n2()?s:a`<h2>${V("history_edit_title",e)}</h2>`}
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
          .helper=${W5(e)}
          .value=${Y7(t.timestamp)}
          @value-changed=${i=>{let o=i.detail.value;o&&this._set("timestamp",o)}}
        ></ms-date-field>
        <label>
          <span>${V("notes_label",e)}</span>
          <textarea
            rows="3"
            @input=${i=>{let o=i.target.value;this._set("notes",o||null)}}
            .value=${t.notes??""}></textarea>
        </label>
        <div class="row">
          <div class="cost-field">
            <span>${V("cost",e)}</span>
            <ms-cost-input .lang=${e} .value=${t.cost!=null?String(t.cost):""}
              @value-changed=${i=>{let o=i.detail.value;this._set("cost",o?Number(o):null)}}></ms-cost-input>
          </div>
          <label>
            <span>${V("duration",e)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${i=>{this._set("duration",a2(i.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(t,e)}
        ${this._partOptions&&this._partOptions.length>0?a`
          <div class="parts-block">
            <span class="parts-title">${V("complete_parts_used",e)}</span>
            ${this._partOptions.map(i=>{let o=`${i.entry_id}:${i.part_id}`,L=this._partQty[o]||0;return a`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${L>0}
                    @change=${M=>{let d=M.target.checked;this._partQty={...this._partQty,[o]:d?1:0}}} />
                  <span class="part-label">${i.name}${i.foreign&&i.object_name?` (${i.object_name})`:""}</span>
                  ${L>0?a`
                    <input class="part-qty" type="number" min=${z1[0]} max=${z1[1]} step="0.01"
                      .value=${String(L)}
                      @input=${M=>{let d=parseFloat(M.target.value);!isNaN(d)&&d>0&&(this._partQty={...this._partQty,[o]:d})}} />
                  `:s}
                </label>
              `})}
          </div>
        `:s}
        <div class="photos-block">
          <span class="parts-title">${V("completion_photos",e)}</span>
          ${this._photos.photos.length>0?a`
            <div class="photo-strip">
              ${this._photos.photos.map(i=>a`
                <div class="photo-tile">
                  <maintenance-history-photo .hass=${this.hass} .docId=${i.id}></maintenance-history-photo>
                  <button type="button" class="photo-remove" title=${V("remove",e)}
                    @click=${()=>this._photos.remove(i.id)}>✕</button>
                </div>`)}
            </div>`:s}
          ${this._photos.full?a`<span class="photos-hint">${V("photos_limit",e).replace("{max}",String(this._photos.max))}</span>`:a`<ms-photo-picker .lang=${e} .busy=${this._photos.uploading} .remaining=${this._photos.remaining}
                @files-picked=${i=>this._photos.addFiles(i.detail.files)}
              ></ms-photo-picker>`}
          <span class="photos-hint">${V("history_edit_photos_hint",e)}</span>
        </div>
        ${r?j("error",r):s}
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
    `,{title:V("history_edit_title",e)})}updated(e){e.has("_open")&&this._open&&j2(this.shadowRoot)}_renderReadings(e,t){return this._readingRows.length>0?a`
        <div class="readings-block">
          <span class="parts-title">${V("readings_section",t)}</span>
          ${this._readingRows.map(r=>a`
            <label class="reading-row-edit">
              <span class="reading-row-name">${r.name}${r.unit?` (${r.unit})`:""}</span>
              <input type="text" inputmode="decimal" class="reading-row-input"
                .value=${this._readingText[r.id]??""}
                @input=${i=>{this._readingText={...this._readingText,[r.id]:i.target.value}}} />
            </label>
          `)}
        </div>`:e.reading_value==null&&e.task_type!=="reading"?s:a`
      <label>
        <span>${V("reading_value_label",t)}${e.reading_unit?` (${e.reading_unit})`:""}</span>
        <input type="number" step="any"
          .value=${e.reading_value!=null?String(e.reading_value):""}
          @input=${r=>{let i=r.target.value,o=i===""?NaN:Number(i);this._set("reading_value",isNaN(o)?null:o)}} />
      </label>`}};C1.styles=[x3,D2,g`
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
  `],n([u({attribute:!1})],C1.prototype,"hass",2),n([l()],C1.prototype,"_open",2),n([l()],C1.prototype,"_saving",2),n([l()],C1.prototype,"_error",2),n([l()],C1.prototype,"_draft",2),n([l()],C1.prototype,"_partOptions",2),n([l()],C1.prototype,"_partQty",2),n([l()],C1.prototype,"_readingRows",2),n([l()],C1.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",C1)});function K1(C){return String(C??"").replace(/[&<>"']/g,H=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[H])}var d6=v(()=>{"use strict"});function Q0(C){return!C.startsWith("data:image/svg+xml,")&&!C.startsWith("data:image/png;base64,")?"":K1(C)}function mt(C){return C.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var X,p6=v(()=>{"use strict";k();D();w();x2();M0();d6();V1();G1();X=class extends Z{constructor(){super(...arguments);this.lang="";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._quickValues=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}get _dialogLang(){return this.lang||T(this.hass)}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(e,t,r,i){this._entryId=e,this._taskId=t,this._objectName=r,this._taskName=i,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._quickValues=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let r=[this.hass.connection.sendMessagePromise({...t,action:"view"})];if(this._taskId){if(r.push(this.hass.connection.sendMessagePromise({...t,action:"complete"})),this._quickValues=await this._quickCompleteValues(),e!==this._generateSeq)return;this._quickValues&&r.push(this.hass.connection.sendMessagePromise({...t,action:"quick_complete"}))}let i=await Promise.all(r);if(e!==this._generateSeq)return;this._viewResult=i[0],i.length>1&&(this._completeResult=i[1]),i.length>2&&(this._quickResult=i[2])}catch(t){if(e!==this._generateSeq)return;let r=t?.code,i=t?.message;this._error=r==="no_url"||typeof i=="string"&&i.includes("No Home Assistant URL")?V("qr_error_no_url",this._dialogLang):V("qr_error",this._dialogLang)}finally{e===this._generateSeq&&(this._loading=!1)}}async _quickCompleteValues(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});return Q5((e.tasks||[]).find(t=>t.id===this._taskId))}catch{return null}}_quickRecords(e){let t=this._quickValues??{},r=[t.notes?`\u201C${t.notes.length>40?`${t.notes.slice(0,39)}\u2026`:t.notes}\u201D`:"",t.cost!=null?`${V("quick_complete_defaults_cost",e)} ${J(t.cost,void 0,e)}`:"",t.duration!=null?v2(t.duration,e):""].filter(Boolean);return r.length?V("qr_quick_records",e).replace("{values}",r.join(", ")):V("qr_quick_records_nothing",e)}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,r=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),i=window.open("","_blank","width=600,height=500");if(!i)return;let o=this._dialogLang,L=K1(t),M=K1(r),d=!!this._completeResult,p=!!this._quickResult,m=K1(V("qr_action_view",o)),A=K1(V("qr_action_complete",o)),x=K1(V("qr_action_quick_complete",o));i.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${L}</title>
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
<h2>${L}</h2>
${M?`<div class="sub">${M}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${Q0(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${m}</div>
  </div>
  ${d?`<div class="qr-col">
    <img src="${Q0(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${A}</div>
  </div>`:""}
  ${p?`<div class="qr-col">
    <img src="${Q0(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${x}</div>
  </div>`:""}
</div>
<div class="url">${K1(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),i.document.close()}_downloadSvg(e,t){let r=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),i=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;b4(r,`qr-${mt(i)}-${t}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return a``;let e=this._dialogLang,t=this._taskName?`${V("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${V("qr_code",e)}: ${this._objectName}`,r=!!this._viewResult;return a`
      <ha-dialog open .headerTitle=${b1(t)} @closed=${this._close}>
        ${Z1(t)}
        <div class="content">
          ${this._loading?a`<div class="loading">${V("qr_generating",e)}</div>`:this._error?j("error",this._error):r?a`
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
                      ${this._completeResult?a`
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
                          `:s}
                      ${this._quickResult?a`
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
                          `:s}
                    </div>
                    ${this._taskId&&!this._quickResult?a`<div class="qr-quick-off">${V("qr_quick_complete_off",e)}</div>`:s}
                    <div class="url-display">${this._viewResult.url}</div>
                  `:s}
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
            .disabled=${!r}
          >
            ${V("qr_print",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};X.styles=g`
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
  `,n([u({attribute:!1})],X.prototype,"hass",2),n([u()],X.prototype,"lang",2),n([l()],X.prototype,"_open",2),n([l()],X.prototype,"_loading",2),n([l()],X.prototype,"_error",2),n([l()],X.prototype,"_viewResult",2),n([l()],X.prototype,"_completeResult",2),n([l()],X.prototype,"_quickResult",2),n([l()],X.prototype,"_quickValues",2),n([l()],X.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",X)});function c6(C,H,e=new Date){let t=C?.hours,r=Q(C?.snoozed_until);if(typeof t!="number"||!Number.isFinite(r))return V("snoozed",H);let i=B1(),L=I1(r,i)===I1(e,i)?q5(new Date(r),H):z5(C.snoozed_until,H);return j5("snoozed_for","snoozed_for_one",t,H,"hours").replace("{until}",L)}var m6=v(()=>{"use strict";w();Y()});function w3(C){if(!C)return s;if(customElements.get("ha-markdown")){let{content:H,links:e}=vt(C);return a`<ha-markdown
      class="notes-md"
      .content=${H}
      breaks
      ${B2(t=>ht(t,e))}
    ></ha-markdown>`}return a`${C}`}function vt(C){let H=[],e=i=>{let o=c0(i);return!o||At.has(o)||!g2(i)?null:(H.push(p0(i)),`${Y0}${H.length-1}`)},t=i=>i.replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)<(${k3}[^>\\n]*)>`,"g"),(o,L,M,d)=>{let p=L?null:e(d);return p?`${M}${p}`:o}).replace(new RegExp(`(!?)(\\[[^\\]\\n]*\\]\\(\\s*)(${k3}[^\\s)]*)`,"g"),(o,L,M,d)=>{let p=L?null:e(d);return p?`${M}${p}`:o}).replace(new RegExp(`(^|[^(])<(${k3}[^\\s<>]*)>`,"gm"),(o,L,M)=>{let d=e(M);return d?`${L}[${M.replace(/([\\[\]])/g,"\\$1")}](${d})`:o}).replace(new RegExp(`^( {0,3}\\[[^\\]\\n]+\\]:[ \\t]*)<?(${k3}[^\\s>]*)>?`,"gm"),(o,L,M)=>{let d=e(M);return d?`${L}${d}`:o});return{content:C.split(ut).map((i,o)=>o%2?i:t(i)).join(""),links:H}}function K0(C,H){for(let e of C.querySelectorAll(`a[href^="${Y0}"]`)){let t=H[Number(e.getAttribute("href").slice(Y0.length))];t&&e.setAttribute("href",t)}}function ht(C,H){if(!C)return;let e=A6.get(C);if(!e&&H.length===0)return;if(e){e.links=H,C.shadowRoot&&K0(C.shadowRoot,H);return}let t={links:H};A6.set(C,t),(async()=>{await C.updateComplete;let r=C.shadowRoot;r&&(new MutationObserver(()=>K0(r,t.links)).observe(r,{childList:!0,subtree:!0}),K0(r,t.links))})()}var Y0,At,ut,k3,A6,X0=v(()=>{"use strict";k();A3();X5();Y0="https://app-link.invalid/",At=new Set(["http","https","mailto","tel","ftp"]),ut=/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`\n]*`)/,k3="[a-zA-Z][a-zA-Z0-9+.-]+:";A6=new WeakMap});var u6=v(()=>{"use strict"});function v6(C,H,e,t){let r=e,i=M=>typeof M=="string"?M:null,o=M=>typeof M=="number"?M:null,L=i(r.timestamp)??"";return{entry_id:C,task_id:H,original_timestamp:L,type:i(r.type)||"completed",timestamp:L,notes:i(r.notes),cost:o(r.cost),duration:o(r.duration),completed_by:i(r.completed_by),used_parts:Array.isArray(r.used_parts)?r.used_parts:null,photo_doc_ids:c5(r),reading_value:o(r.reading_value),reading_values:q1(r),readings:t?.readings??[],task_type:t?.type??null,reading_unit:t?.reading_unit??null}}var h6=v(()=>{"use strict";m5();o2();u6()});function xt(C){return C&&x6(C.ref_no)?String(C.ref_no):null}function _6(C,H){let e=xt(C);return e&&H&&x6(H.ref_no)?`${e}.${H.ref_no}`:null}function g6(C,H){return C?a`<span class="ref-chip" title=${H??""}>#${C}</span>`:s}var x6,J0=v(()=>{"use strict";k();x6=C=>typeof C=="number"&&Number.isInteger(C)&&C>0});var e7=v(()=>{"use strict"});function b6(C,H){if(!C)return"";let e=_t[C.trim()];if(e)return V(e,H);for(let[t,r,i]of gt){let o=C.trim().match(t);if(o){let L=i(o,H);return V(r,H).replace(/\{(\w+)\}/g,(M,d)=>L[d]??M)}}return C}var _t,f6,gt,Z6=v(()=>{"use strict";w();_t={"Completed from dashboard button":"hist_note_button","Auto-completed: sensor recovered":"hist_note_auto_recovered_plain","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},f6={name:"name",notes:"notes_label",recurrence:"task_section_schedule","warning days":"warning_days"},gt=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",C=>({value:C[1]})],[/^Auto-completed: (.+) changed to (.+)$/,"hist_note_auto_entity",C=>({entity:C[1],state:C[2]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(C,H)=>({date:P(C[1],H)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",C=>({old:C[1],new:C[2]})],[/^From the template: (.+)$/,"hist_note_template_updated",(C,H)=>({fields:C[1].split(", ").map(e=>f6[e]?V(f6[e],H):e).join(", ")})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(C,H)=>({entity:C[1],schedule:V(C[2],H)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",C=>({entity:C[1],count:C[2]})]]});function O3(C){return typeof C=="string"?C.trim():""}function y6(C,H,e={}){let t=C.trigger_change;if(t&&typeof t=="object"){let r=O3(t.latest),i=O3(t.installed);if(r&&i&&r!==i)return V("trigger_update_available",H).split("{latest}").join(r).split("{installed}").join(i);let o=O3(t.to),L=O3(t.from);if(o)return`${V("trigger_val",H)}: ${L?`${L} \u2192 `:""}${o}`}return e.stateRule||typeof C.trigger_value!="number"||!Number.isFinite(C.trigger_value)?"":`${V("trigger_val",H)}: ${f(C.trigger_value,H,{maximumFractionDigits:3})}${e.unit?` ${e.unit}`:""}`}var S6=v(()=>{"use strict";w()});function k6(C){let H=e=>{let t=Q(e.timestamp);return Number.isNaN(t)?-1/0:t};return(C??[]).map((e,t)=>({entry:e,index:t,at:H(e)})).sort((e,t)=>t.at-e.at||t.index-e.index).map(e=>e.entry)}function bt(C,H){return C.taskRef&&H.ref_no?`${C.taskRef}-${H.ref_no}`:null}function Zt(C,H){let e=c5(H);return e.length>0?a`<div class="history-photos">
        ${e.map(t=>a`<maintenance-history-photo .hass=${C} .docId=${t}></maintenance-history-photo>`)}
      </div>`:s}function yt(C,H){let e=H.lang,t=o=>f(o,e,{maximumFractionDigits:3}),r=o=>o==null?"":` (${o>=0?"+":""}${t(o)})`,i=q1(C);return i.length>0?a`<div class="history-readings">
      ${i.map(o=>a`<span class="history-reading">
        <span class="history-reading-name">${o.name}</span>
        <span class="history-reading-value">${t(o.value)}${o.unit?` ${o.unit}`:""}${r(H.readingSlotDelta?.(C,o.id))}</span>
      </span>`)}
    </div>`:C.reading_value!=null?a`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${V("reading_label",e)}</span>
      <span class="history-reading-value">${t(C.reading_value)}${H.readingUnit?` ${H.readingUnit}`:""}${r(H.readingDelta?.(C))}</span>
    </span></div>`:s}function w6(C,H,e={}){let t=H.lang,{compact:r=!1,showRef:i=!0,showBadges:o=!0,showEdit:L=!0,showHead:M=!0}=e,d=H.openEdit,p=L&&!!d&&R7.includes(C.type),m=typeof C.parts_cost=="number"?C.parts_cost:null,A=C.cost_basis==="use",x=A&&!!C.purchase,y=y6(C,t,{unit:H.triggerUnit,stateRule:H.stateRule});return a`
    <div class="history-entry${r?" compact":""}">
      ${r?s:a`<div class="history-icon ${C.type}" style="background: ${z3(C.type)}">
            <ha-icon .icon=${C5[C.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        ${M?a`<div class="history-row">
          <strong>${V(C.type,t)}</strong>
          ${i?g6(bt(H,C),V("ref_number",t)):s}
          ${o&&C.phase_id?a`<span class="history-phase-badge">${H.phaseNames?.[C.phase_id]||C.phase_id}</span>`:s}
          ${o&&C.auto?a`<span class="history-auto-badge">${V("history_auto",t)}</span>`:s}
          ${p?a`<button class="history-edit-btn"
                     title=${V("history_edit_button",t)}
                     @click=${()=>d(C)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:s}
        </div>
        <div class="history-date">${z5(C.timestamp,t)}</div>`:s}
        ${C.notes?a`<div class="history-notes">${b6(C.notes,t)}</div>`:s}
        ${Zt(H.hass,C)}
        ${yt(C,H)}
        ${C.cost!=null||C.duration!=null||y||m!=null?a`<div class="history-details">
              ${C.cost!=null?x?a`<span>${V("history_purchase_stock",t).replace("{amount}",J(C.cost,H.currencySymbol,t))}</span>`:C.cost<0?a`<span class="history-credit">${L4(C.cost,H.currencySymbol,t)}</span>`:a`<span>${V("cost",t)}: ${J(C.cost,H.currencySymbol,t)}</span>`:s}
              ${m!=null?a`<span title=${V(A?"history_parts_counted_hint":"history_parts_info_hint",t)}>${V(A?"history_parts_counted":"history_parts_info",t).replace("{amount}",J(m,H.currencySymbol,t))}</span>`:s}
              ${C.duration!=null?a`<span>${V("duration",t)}: ${v2(C.duration,t)}</span>`:s}
              ${y?a`<span>${y}</span>`:s}
            </div>`:s}
      </div>
    </div>
  `}var O6=v(()=>{"use strict";k();w();G0();m5();J0();o2();e7();Z6();S6();Y();E1()});async function $6(C,H,e){if(!C)return null;let t={title:V("delete",e),confirmText:V("delete",e),danger:!0};if(!H?.part_ref)return await C.confirm({...t,message:V("delete_task_confirm",e)})?{}:null;let r=await C.confirmWithCheck({...t,message:V("delete_buy_task_confirm",e),check:V("delete_buy_task_off",e)});return r.confirmed?r.checked?{disable_auto_buy_task:!0}:{}:null}var T6=v(()=>{"use strict";w()});var $3,E6=v(()=>{"use strict";$3=class{constructor(){this._handle=null}schedule(H,e=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,H()},e)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}}});function P6(C,H){let e=C.interval_analysis,t=e?.weibull_beta,r=e?.weibull_eta;if(t==null||r==null||r<=0)return s;let i=C.interval_days??0,o=C.suggested_interval??i;return a`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${V("weibull_reliability_curve",H)}
        ${St(t,H)}
      </div>
      ${kt(t,r,i,o,H)}
      ${wt(e,H)}
      ${e?.confidence_interval_low!=null?Ot(e,C,H):s}
    </div>
  `}function St(C,H){let e,t,r;return C<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",r="beta_early_failures"):C<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",r="beta_random_failures"):C<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",r="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",r="beta_highly_predictable"),a`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${V(r,H)} (\u03B2=${f(C,H,2)})
    </span>
  `}function kt(C,H,e,t,r){let x=Math.max(e,t,H,1)*1.3,y=50,_=[];for(let a1=0;a1<=y;a1++){let d1=a1/y*x,o8=1-Math.exp(-Math.pow(d1/H,C)),a8=32+d1/x*260,L8=136-o8*128;_.push([a8,L8])}let b=_.map(([a1,d1])=>`${$(a1)},${$(d1)}`).join(" "),h="M32,136 "+_.map(([a1,d1])=>`L${$(a1)},${$(d1)}`).join(" ")+` L${$(_[y][0])},136 Z`,O=32+e/x*260,h1=1-Math.exp(-Math.pow(e/H,C)),M2=136-h1*128,V8=f((1-h1)*100,r,0),n7=32+t/x*260,i8=[0,.25,.5,.75,1];return a`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${V("chart_weibull",r)}">
        ${i8.map(a1=>{let d1=136-a1*128;return d2`
            <line x1="${32}" y1="${$(d1)}" x2="${292}" y2="${$(d1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${a1===.5?"4,3":s}" />
            <text x="${28}" y="${$(d1+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${f(a1*100,r,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(x)}</text>

        <path d="${h}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${b}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?d2`
          <line x1="${$(O)}" y1="${8}" x2="${$(O)}" y2="${$(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${$(O)}" cy="${$(M2)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${$(O+4)}" y="${$(M2-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${V8}%</text>
        `:s}

        ${t>0&&t!==e?d2`
          <line x1="${$(n7)}" y1="${8}" x2="${$(n7)}" y2="${$(136)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        `:s}

        <line x1="${32}" y1="${8}" x2="${32}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${32}" y1="${136}" x2="${292}" y2="${136}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${V("weibull_failure_probability",r)}</span>
      ${e>0?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${V("current_interval_marker",r)}</span>`:s}
      ${t>0&&t!==e?a`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${V("recommended_marker",r)}</span>`:s}
    </div>
  `}function wt(C,H){return a`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${V("characteristic_life",H)}</span>
        <span class="weibull-info-value">${V2(Math.round(C.weibull_eta),H)}</span>
      </div>
      ${C.weibull_r_squared!=null?a`
        <div class="weibull-info-item">
          <span>${V("weibull_r_squared",H)}</span>
          <span class="weibull-info-value">${f(C.weibull_r_squared,H,3)}</span>
        </div>
      `:s}
    </div>
  `}function Ot(C,H,e){let t=C.confidence_interval_low,r=C.confidence_interval_high,i=H.suggested_interval??H.interval_days??0,o=H.interval_days??0,L=Math.max(0,t-5),d=r+5-L,p=(t-L)/d*100,m=(r-t)/d*100,A=(i-L)/d*100,x=o>0?(o-L)/d*100:-1;return a`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${V("confidence_interval",e)}: ${V2(i,e)} (${t}\u2013${r})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${$(p)}%;width:${$(m)}%"></div>
        ${x>=0?a`<div class="confidence-marker current" style="left:${$(x)}%"></div>`:s}
        <div class="confidence-marker recommended" style="left:${$(A)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${V("confidence_conservative",e)} (${t}${V("days",e).charAt(0)})</span>
        <span class="confidence-text high">${V("confidence_aggressive",e)} (${r}${V("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var R6=v(()=>{"use strict";k();w();l5()});function t7(C){return Math.max(1,Math.round(C||0))}function B6(C,H,e){let t=C.degradation_trend!=null&&C.degradation_trend!=="insufficient_data",r=C.days_until_threshold!=null,i=C.environmental_factor!=null&&C.environmental_factor!==1;if(!t&&!r&&!i)return s;let o=C.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":C.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return a`
    <div class="prediction-section">
      ${C.sensor_prediction_urgency?a`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${V(L0(t7(C.days_until_threshold),H,$t),H).replace("{days}",String(t7(C.days_until_threshold)))}
        </div>
      `:s}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${V("sensor_prediction",H)}
      </div>
      <div class="prediction-grid">
        ${t?a`
          <div class="prediction-item">
            <ha-svg-icon path="${o}"></ha-svg-icon>
            <span class="prediction-label">${V("degradation_trend",H)}</span>
            <span class="prediction-value ${C.degradation_trend}">${V("trend_"+C.degradation_trend,H)}</span>
            ${C.degradation_rate!=null?a`<span class="prediction-rate">${C.degradation_rate>0?"+":""}${f(C.degradation_rate,H,Math.abs(C.degradation_rate)>=10?0:1)} ${C.trigger_entity_info?.unit_of_measurement||""}/${V("day_short",H)}</span>`:s}
          </div>
        `:s}
        ${r?a`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${V("days_until_threshold",H)}</span>
            <span class="prediction-value prediction-days${C.days_until_threshold===0?" exceeded":C.sensor_prediction_urgency?" urgent":""}">${C.days_until_threshold===0?V("threshold_exceeded",H):"~"+u2(t7(C.days_until_threshold),H)}</span>
            ${C.threshold_prediction_date?a`<span class="prediction-date">${P(C.threshold_prediction_date,H)}</span>`:s}
            ${C.threshold_prediction_confidence?a`<span class="confidence-dot ${C.threshold_prediction_confidence}"></span>`:s}
            ${(C.prediction_cycles??0)>0?a`<span class="prediction-cycles">${V("prediction_cycles",H)}: ${C.prediction_cycles}</span>`:s}
          </div>
        `:s}
        ${i&&e.environmental?a`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${V("environmental_adjustment",H)}</span>
            <span class="prediction-value">${f(C.environmental_factor,H,2)}x</span>
            ${C.environmental_entity?a`<span class="prediction-entity entity-link" @click=${L=>l4(L,C.environmental_entity)}>${C.environmental_entity}</span>`:s}
          </div>
        `:s}
      </div>
    </div>
  `}var $t,I6=v(()=>{"use strict";k();w();$t={one:"sensor_prediction_urgency_one",few:"sensor_prediction_urgency_few",other:"sensor_prediction_urgency"}});function F6(C,H,e,t){let r=Math.max(C||1,H);return a`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${V("current",t)}: ${C!=null?V2(C,t):"\u2014"}
        </div>
        <div class="interval-visual current"
          style="width: ${C!=null?Math.min(C/r*100,100):0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${V("recommended",t)}: ${V2(H,t)}
          <span class="confidence-badge ${e}">${V(`confidence_${e}`,t)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(H/r*100,100)}%"></div>
      </div>
    </div>
  `}var D6=v(()=>{"use strict";k();w()});function j6(){return Number(f1().slice(5,7))-1}function q6(C,H,e){if(!e.seasonal||!C.seasonal_factor||C.seasonal_factor===1)return s;let t=N6.map(L=>V(L,H)),r=j6(),i=C.seasonal_factors||C.interval_analysis?.seasonal_factors||null,o=i&&i.length===12?i:t.map((L,M)=>{let d=C.seasonal_factor||1,p=Math.sin((M-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,d+p))});return a`
    <div class="seasonal-card-compact">
      <h4>${V("seasonal_awareness",H)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((L,M)=>{let d=L*40,p=L<.9?"low":L>1.1?"high":"normal";return a`
            <div class="seasonal-bar ${p} ${M===r?"current":""}"
                 style="height: ${d}px"
                 title="${t[M]}: ${f(L,H,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${V("shorter",H)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${V("normal",H)}</span>
        <span class="legend-item"><span class="dot high"></span> ${V("longer",H)}</span>
      </div>
    </div>
  `}function z6(C,H){return Tt(C,H)}function Tt(C,H){let e=C.seasonal_factors??C.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return s;let t=C.interval_analysis?.seasonal_reason,r=j6(),i=300,o=100,L=8,d=o-L-4,p=Math.max(...e,1.5),m=i/12,A=m*.65,x=L+d-1/p*d;return a`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${V("seasonal_chart_title",H)}
        ${t?a`<span class="source-tag">${t==="learned"?V("seasonal_learned",H):V("seasonal_manual",H)}</span>`:s}
      </div>
      <svg viewBox="0 0 ${i} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${V("chart_seasonal",H)}">
        <line x1="0" y1="${$(x)}" x2="${i}" y2="${$(x)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((y,_)=>{let b=y/p*d,h=_*m+(m-A)/2,O=L+d-b,h1=_===r,M2=y<1?"var(--success-color, #4caf50)":y>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return d2`
            <rect x="${$(h)}" y="${$(O)}"
              width="${$(A)}" height="${$(b)}"
              fill="${M2}" opacity="${h1?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${N6.map((y,_)=>a`<span class="seasonal-label ${_===r?"active-month":""}">${V(y,H)}</span>`)}
      </div>
    </div>
  `}var N6,W6=v(()=>{"use strict";k();w();l5();Y();N6=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"]});var I,U6=v(()=>{"use strict";k();D();w();p1();m6();y3();Y();o3();t3();X0();h6();o2();J0();O6();a3();E1();w2();Z2();S3();T6();E6();x2();h2();R6();I6();D6();P2();p5();W6();G1();s3();I=class extends Z{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1,places:!1,beta_editor:!1};this._toast="";this._toastTimer=new $3;this._access=y1;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return T(this.hass)}async openFor(e,t){(e!==this._entryId||t!==this._taskId)&&(this._task=null),this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=f1(),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let e=await t1(this.hass);this._features={...this._features,...e.features},this._access=e.access,this._currencySymbol=H2(e.budget??void 0),N5(e.budget??void 0),this._partsCostMode=e.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(e,t){this._toast=e,this._toastTimer.schedule(()=>{this._toast=""},t)}async _loadTask(){let e=this._entryId,t=this._taskId;if(!e||!t)return;let r=++this._loadSeq,i="",o=await F(this,{type:"maintenance_supporter/object",entry_id:e},{onError:M=>{i=M}});if(r!==this._loadSeq)return;if(o===void 0){this._error=i;return}this._objectName=o?.object?.name||"";let L=(o?.tasks||[]).find(M=>M.id===t);this._task=L??null,this._taskRef=_6(o?.object,L),L||(this._error=V("ws_err_not_found",this._lang))}_runWs(e){return this._error="",F(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(e=!1){if(!(!this._entryId||!this._taskId||!this._task)){if(!e&&e1(this._task)){this._onQuickComplete();return}Promise.resolve().then(()=>(v1(),w1)).then(async({openCompleteDialog:t})=>{let r=this._task,i=[];try{i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}t(V3({entryId:this._entryId,taskId:this._taskId,taskName:r.name,task:r,objects:i,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}}async _onQuickComplete(){let e=this._entryId,t=this._task;this._busy=!0;try{let r=await K5(this.hass,e,t.id,this._lang);if(r.result==="dialog"){this._onComplete(!0);return}if(r.result==="failed"){this._error=r.message;return}if(r.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:r.message},bubbles:!0,composed:!0})),this.close();return}this._notifyChanged("complete"),r.undo&&i2(this,this.hass,{entryId:e,taskId:t.id,taskName:t.name},this._lang,()=>{}),this.close()}finally{this._busy=!1}}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._notifyChanged("snooze"),this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:c6(e,this._lang)},bubbles:!0,composed:!0})),this.close())}_onEdit(){!this._entryId||!this._taskId||Promise.resolve().then(()=>(v1(),w1)).then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(v1(),w1)).then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId)return;let e=await $6(U0(this.hass),this._task,this._lang);if(!e)return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId,...e})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(V("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._showToast(e?.recommended_interval?`${V("reanalyze_result",this._lang)}: ${i5(e.recommended_interval,"days",this._lang)} (${e.data_points} ${V("data_points",this._lang)})`:V("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(e){if(!this._entryId||!this._taskId)return;let t=v6(this._entryId,this._taskId,e,this._task);Promise.resolve().then(()=>(v1(),w1)).then(({openHistoryEditDialog:r})=>r(t))}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return s;let t=this._lang;return a`
      <div class="recommendation-card">
        <h4>${V("suggested_interval",t)}</h4>
        ${F6(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          ${m1(this.hass?.user,this._access)?a`<button class="btn primary qa-apply-suggestion"
                @click=${this._applySuggestion} ?disabled=${this._busy}>
                <ha-icon icon="mdi:check"></ha-icon>
                ${V("apply_suggestion",t)}
              </button>`:s}
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${V("reanalyze",t)}
          </button>
        </div>
      </div>
    `}_renderAdaptive(e){let t=this._lang,r=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,i=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,o=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,L=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!r&&!i&&!o&&!L?a`<div class="adaptive-empty">
        ${V("adaptive_no_data",t)}
      </div>`:a`
      <div class="adaptive-stack">
        ${this._toast?a`<div class="toast">${this._toast}</div>`:s}
        ${r?this._renderRecommendation(e):s}
        ${i?B6(e,t,this._features):s}
        ${o?P6(e,t):s}
        ${L?a`
          ${q6(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?z6(e,t):s}
        `:s}
      </div>
    `}_renderDetails(e){let t=this._lang,r=e.history||[],i=e.history_count??r.length,o=k6(r).slice(0,20);return a`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${V("times_performed",t)}</span>
            <span class="stat-value">${e.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${V("total_cost",t)}</span>
            <span class="stat-value">${J(e.total_cost??0,this._currencySymbol,t)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${V("avg_duration",t)}</span>
            <span class="stat-value">${v2(e.average_duration!=null?Math.round(e.average_duration):null,t)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${V("history",t)}</strong>
          <span class="history-count">${i}</span>
        </div>
        ${r.length===0?a`<div class="history-empty">${V("history_empty",t)}</div>`:a`
              <div class="history-list">
                ${o.map(L=>w6(L,{lang:t,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:m1(this.hass?.user,this._access)?M=>this._onEditHistoryEntry(M):void 0,readingUnit:e.reading_unit,readingSlotDelta:(M,d)=>D4(r,M,d),taskRef:this._taskRef,triggerUnit:n9(this.hass,e)||null,stateRule:s9(e)},{compact:!0}))}
                ${i>o.length?a`<div class="history-more">… +${i-o.length} ${V("older_entries",t)}</div>`:s}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return s;let e=this._lang,t=this._task,r=m1(this.hass?.user,this._access),i=!!t&&R5(t);return N2(()=>this.close(),a`
        ${t?a`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${O2(t)}"></span>
                  ${n2()?s:a`<span class="task-name">${t.name}</span>`}
                  ${L9(t,e)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&Promise.resolve().then(()=>(v1(),w1)).then(({openObjectQuickActions:o})=>{o(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?a`<span><strong>${V("next_due",e)}:</strong> ${P(t.next_due,e)}</span>`:s}
                  ${t.last_performed?a`<span><strong>${V("last_performed",e)}:</strong> ${P(t.last_performed,e)}</span>`:s}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?a`<span><strong>${V("interval",e)}:</strong> ${M4(t,e)}</span>`:s}
                  ${j1(t)?a`<span><strong>${V("phase_current",e)}:</strong> ${j1(t)}</span>`:s}
                </div>
                ${t.notes?a`<div class="notes-body">${w3(t.notes)}</div>`:s}
              </div>

              ${this._error?j("error",this._error):s}

              ${this._showSkip?a`
                    <div class="inline-form">
                      <ms-textfield label=${V("skip_reason",e)} .value=${this._skipReason}
                        @input=${o=>{this._skipReason=o.target.value}}></ms-textfield>
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${()=>{this._showSkip=!1}} ?disabled=${this._busy}>
                          ${V("cancel",e)}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${V("skip",e)}
                        </button>
                      </div>
                    </div>
                  `:this._showReset?a`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${V("reset_to_date",e)}
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._resetDate}
                        @value-changed=${o=>{this._resetDate=o.detail.value}}
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
                  `:this._showPostpone?a`
                    <div class="inline-form">
                      <ms-date-field
                        kind="date"
                        label=${V("postpone_date_prompt",e)}
                        .hass=${this.hass}
                        .lang=${e}
                        .value=${this._postponeDate}
                        @value-changed=${o=>{this._postponeDate=o.detail.value}}
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
                  `:a`
                    <div class="actions primary-row">
                      <ha-button appearance="accent" variant="success" @click=${()=>this._onComplete()} .disabled=${this._busy}
                        title=${e1(t)?V("qr_action_quick_complete",e):V("complete",e)}>
                        <ha-icon slot="start" icon="mdi:check"></ha-icon>
                        ${V("complete",e)}
                      </ha-button>
                      ${e1(t)?a`<ha-button appearance="outlined" variant="success" class="qa-complete-details" @click=${()=>this._onComplete(!0)} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:text-box-edit-outline"></ha-icon>
                            ${V("complete_with_details",e)}
                          </ha-button>`:s}
                      ${t.allow_skip!==!1?a`
                            <ha-button appearance="outlined" variant="warning" @click=${()=>{this._showSkip=!0}} .disabled=${this._busy}>
                              <ha-icon slot="start" icon="mdi:skip-next"></ha-icon>
                              ${V("skip",e)}
                            </ha-button>
                          `:s}
                      <ha-button appearance="outlined" variant="neutral" @click=${()=>{this._showReset=!0}} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:restart"></ha-icon>
                        ${V("reset",e)}
                      </ha-button>
                    </div>
                    <!-- QR is read tier (the panel offers it to operators too);
                         Edit / Archive / Delete follow canWrite() — the panel's
                         operator delegation, not is_admin alone. -->
                    <div class="actions secondary-row">
                      ${r?a`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-edit" @click=${this._onEdit} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:pencil"></ha-icon>
                            ${V("edit",e)}
                          </ha-button>`:s}
                      <ha-button size="small" appearance="outlined" variant="neutral" class="qa-qr" @click=${this._onQr} .disabled=${this._busy}>
                        <ha-icon slot="start" icon="mdi:qrcode"></ha-icon>
                        ${V("qr_code",e)}
                      </ha-button>
                      ${i?s:a`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-postpone"
                            @click=${()=>{this._showPostpone=!0}} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:calendar-arrow-right"></ha-icon>
                            ${V("postpone",e)}…
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="neutral" class="qa-snooze" @click=${this._onSnooze} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:bell-sleep-outline"></ha-icon>
                            ${V("snooze",e)}
                          </ha-button>`}
                      ${r?a`<ha-button size="small" appearance="outlined" variant="neutral" class="qa-archive"
                            @click=${t.archived?this._onUnarchive:this._onArchive}
                            .disabled=${this._busy}>
                            <ha-icon slot="start" icon="${t.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                            ${t.archived?V("unarchive",e):V("archive",e)}
                          </ha-button>
                          <ha-button size="small" appearance="outlined" variant="danger" class="danger qa-delete" @click=${this._onDelete} .disabled=${this._busy}>
                            <ha-icon slot="start" icon="mdi:delete"></ha-icon>
                            ${V("delete",e)}
                          </ha-button>`:s}
                    </div>
                    <div class="details-toggle">
                      <button class="link" @click=${()=>{this._showDetails=!this._showDetails}}>
                        <ha-icon icon="${this._showDetails?"mdi:chevron-up":"mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails?V("hide_details",e):V("show_details",e)}
                      </button>
                      ${this._features.adaptive||this._features.seasonal||this._features.environmental?a`<button class="link" @click=${()=>{this._showAdaptive=!this._showAdaptive}}>
                            <ha-icon icon="${this._showAdaptive?"mdi:chart-line":"mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive?V("hide_stats",e):V("show_stats",e)}
                          </button>`:s}
                    </div>
                    ${this._showDetails?this._renderDetails(t):s}
                    ${this._showAdaptive?this._renderAdaptive(t):s}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${V("open_in_panel",e)}
                      </button>
                    </div>
                  `}
            `:this._error?j("error",this._error):a`<div class="loading">${V("loading",e)}</div>`}
    `,{title:t?.name})}updated(e){e.has("_open")&&this._open&&j2(this.shadowRoot)}};I.styles=[U5,D2,g`
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
  `],n([u({attribute:!1})],I.prototype,"hass",2),n([l()],I.prototype,"_open",2),n([l()],I.prototype,"_entryId",2),n([l()],I.prototype,"_taskId",2),n([l()],I.prototype,"_task",2),n([l()],I.prototype,"_objectName",2),n([l()],I.prototype,"_taskRef",2),n([l()],I.prototype,"_busy",2),n([l()],I.prototype,"_error",2),n([l()],I.prototype,"_showSkip",2),n([l()],I.prototype,"_showReset",2),n([l()],I.prototype,"_showPostpone",2),n([l()],I.prototype,"_showDetails",2),n([l()],I.prototype,"_showAdaptive",2),n([l()],I.prototype,"_skipReason",2),n([l()],I.prototype,"_resetDate",2),n([l()],I.prototype,"_postponeDate",2),n([l()],I.prototype,"_features",2),n([l()],I.prototype,"_toast",2),n([l()],I.prototype,"_access",2),n([l()],I.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",I)});var G6=v(()=>{"use strict";m5();o5();Y()});function Q6(C,H,e){return C&&H?.[C]?.name||e}var K6=v(()=>{"use strict";Y();G6();e7();E1()});function Y6(C){if(C.key!=="Enter"&&C.key!==" ")return;let e=C.target?.closest?.('[role="menuitem"], [role="button"]');!e||e.getAttribute("aria-disabled")==="true"||(C.preventDefault(),e.click())}var X6=v(()=>{"use strict"});var l1,J6=v(()=>{"use strict";k();X5();X0();D();w();K6();p1();a3();w2();Z2();S3();y3();X6();G1();l1=class extends Z{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=y1;this._loadSeq=0}get _lang(){return T(this.hass)}async openFor(e){e!==this._entryId&&(this._data=null),this._entryId=e,this._error="",this._open=!0,await Promise.all([this._load(),t1(this.hass).then(t=>{this._access=t.access})])}close(){this._loadSeq++,this._open=!1,this._data=null,this._error=""}async _load(){let e=this._entryId;if(!e)return;let t=++this._loadSeq,r="",i=await F(this,{type:"maintenance_supporter/object",entry_id:e},{onError:o=>{r=o}});t===this._loadSeq&&(i===void 0?this._error=r:this._data=i)}_runWs(e){return this._error="",F(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_onEditObject(){!this._entryId||!this._data||Promise.resolve().then(()=>(v1(),w1)).then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&Promise.resolve().then(()=>(v1(),w1)).then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await f5(this.hass,{title:V("delete",this._lang),message:V("delete_object_confirm",this._lang),confirmText:V("delete",this._lang),danger:!0}))return;let t=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e&&!await f5(this.hass,{title:V("archive_object",this._lang),message:V("confirm_archive_object",this._lang),confirmText:V("archive_object",this._lang)}))return;let t=this._entryId;await this._runWs({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}_onTaskClick(e){this._entryId&&Promise.resolve().then(()=>(v1(),w1)).then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return s;let e=this._lang,t=this._data,r=t?.object,i=t?.tasks||[],o=m1(this.hass?.user,this._access);return N2(()=>this.close(),a`
        ${t&&r?a`
              <div class="header">
                ${n2()?s:a`<div class="title">${r.name}</div>`}
                ${this._renderMetaRow(r)}
              </div>

              ${this._error?j("error",this._error):s}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${V("tasks",e)}</strong>
                  <span class="count">${i.length}</span>
                </div>
                ${i.length===0?a`<div class="empty">${V("no_tasks",e)}</div>`:a`
                      <div class="task-list">
                        ${i.map(L=>a`
                          <div class="task-row" role="button" tabindex="0" @click=${()=>this._onTaskClick(L.id)} @keydown=${Y6}>
                            <span class="status-dot" style="background: ${O2(L)}"></span>
                            <span class="task-name">${L.name}</span>
                            <span class="task-status ${M5(L)}">${b0(M5(L),e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${r.notes?a`
                    <div class="notes-section">
                      <strong>${V("object_notes_label",e)}</strong>
                      <div class="notes-body">${w3(r.notes)}</div>
                    </div>
                  `:s}

              ${o?a`
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
                        <ha-icon icon="${r.archived?"mdi:archive-arrow-up-outline":"mdi:archive-outline"}"></ha-icon>
                        ${r.archived?V("unarchive_object",e):V("archive_object",e)}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${V("delete",e)}
                      </button>
                    </div>
                  `:s}
            `:this._error?j("error",this._error):a`<div class="loading">${V("loading",e)}</div>`}
    `,{title:r?.name})}updated(e){e.has("_open")&&this._open&&j2(this.shadowRoot)}_renderMetaRow(e){let t=this._lang,r=[];return e.area_id&&r.push([V("area",t),Q6(e.area_id,this.hass?.areas,V("no_area",t))]),e.manufacturer&&r.push([V("manufacturer",t),e.manufacturer]),e.model&&r.push([V("model",t),e.model]),e.serial_number&&r.push([V("serial_number_label",t),e.serial_number]),e.installation_date&&r.push([V("installed",t),P(e.installation_date,t)]),e.warranty_expiry&&r.push([V("warranty",t),P(e.warranty_expiry,t)]),e.documentation_url&&r.push([V("documentation_url_label",t),e.documentation_url,g2(e.documentation_url)]),r.length===0?s:a`
      <div class="meta">
        ${r.map(([i,o,L])=>a`
            <div class="meta-item">
              <span class="meta-label">${i}</span>
              <span class="meta-value">${L||S4(o)?a`<a href="${o}" target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span>
            </div>
          `)}
      </div>
    `}};l1.styles=[D2,g`
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
  `],n([u({attribute:!1})],l1.prototype,"hass",2),n([l()],l1.prototype,"_open",2),n([l()],l1.prototype,"_entryId",2),n([l()],l1.prototype,"_data",2),n([l()],l1.prototype,"_busy",2),n([l()],l1.prototype,"_error",2),n([l()],l1.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",l1)});var w1={};s8(w1,{__resetSettingsCacheForTests:()=>Nt,getRowActionStyle:()=>Dt,openCompleteDialog:()=>Wt,openCreateObjectDialog:()=>C7,openCreateTaskDialog:()=>r7,openEditObjectDialog:()=>jt,openEditTaskDialog:()=>qt,openHistoryEditDialog:()=>zt,openObjectQuickActions:()=>Gt,openQrDialog:()=>Ut,openTaskQuickActions:()=>H7});function q2(){return document.querySelector("home-assistant")?.hass}function Ft(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function O1(C){let H=Ft(),e=H.querySelector(C)??document.body.querySelector(C);return e?e.parentNode!==H&&H.appendChild(e):(e=document.createElement(C),H.appendChild(e)),e}function $1(C){let H=q2();if(!H)return!1;C.hass=H;let e=T(H);return p2(e)||g1(e).then(()=>{C.requestUpdate?.()}),a0(H.locale,H.config?.country,H.config?.time_zone),!0}function Dt(C){return t1(C).then(H=>H.rowActionStyle)}function Nt(){e9()}function C7(){let C=O1(e8);return $1(C)?(C.openCreate(),C8(C),!0):!1}async function C8(C){let H=q2();H&&(C.placesEnabled=(await t1(H)).features.places)}function jt(C,H){let e=O1(e8);return $1(e)?(e.openEdit(C,H),C8(e),!0):!1}function r7(C="",H){let e=O1(t8);if(!$1(e))return!1;let t=q2();return t?((async()=>{let r=await t1(t),i=e;r8(i,r),i.openCreate(C,H)})(),!0):!1}function r8(C,H){C.checklistsEnabled=H.features.checklists,C.scheduleTimeEnabled=H.features.schedule_time,C.completionActionsEnabled=H.features.completion_actions,C.adaptiveFeature=H.features.adaptive,C.seasonalFeature=H.features.seasonal,C.environmentalFeature=H.features.environmental,C.defaultWarningDays=H.defaultWarningDays,C.mirrorTodoDefault=H.mirrorTodoDefault,C.betaEditor=H.features.beta_editor}function qt(C,H){let e=O1(t8);if(!$1(e))return!1;let t=q2();return t?((async()=>{try{let[r,i]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:C}),t1(t)]),o=(r.tasks||[]).find(M=>M.id===H);if(!o){console.warn(`openEditTaskDialog: task ${H} not found in entry ${C}`);return}let L=e;r8(L,i),await L.openEdit(C,o)}catch(r){console.warn("openEditTaskDialog: failed to load task/features",r)}})(),!0):!1}function zt(C){let H=O1(Et);return $1(H)?(H.openEdit(C),!0):!1}function Wt(C){let H=O1(Pt);if(!$1(H))return!1;let e=H;return e.__msUndoWired||(e.__msUndoWired=!0,H.addEventListener("task-completed",t=>{let r=t.detail,i=q2();r?.undo&&i&&i2(H,i,r,T(i),()=>{})})),i3(H,C,T(q2())),!0}function Ut(C){let H=O1(Rt);return $1(H)?(H.openForTask(C.entry_id,C.task_id,C.object_name,C.task_name),!0):!1}function H7(C,H){let e=O1(Bt);return $1(e)?(e.openFor(C,H),!0):!1}function Gt(C){let H=O1(It);return $1(H)?(H.openFor(C),!0):!1}var e8,t8,Et,Pt,Rt,Bt,It,v1=v(()=>{"use strict";R9();L6();I0();l6();p6();U6();J6();h2();w();o3();w2();e8="maintenance-object-dialog",t8="maintenance-task-dialog",Et="maintenance-history-edit-dialog",Pt="maintenance-complete-dialog",Rt="maintenance-qr-dialog",Bt="maintenance-task-quick-actions-dialog",It="maintenance-object-quick-actions-dialog"});k();var _8=["assignee_pool","required_completion_fields","checklist","labels","mirror_todo_entities","next_event_titles","history","readings"],g8=["checklist_progress"],f8=["tasks","parts"],b8=["manual_docs","battery_fleet_excluded"];function q3(C,H,e=[]){for(let t of H)C[t]===void 0&&(C[t]=[]);for(let t of e)C[t]===void 0&&(C[t]={})}function Z8(C){let H=C;q3(H,f8),H.object&&typeof H.object=="object"&&q3(H.object,b8);for(let e of H.tasks)q3(e,_8,g8);return C}function e5(C){for(let H of C)Z8(H);return C}function y8(C,H){if(H.objects)return H.objects;let e=H.delta||[],t=H.removed||[];if(!e.length&&!t.length)return null;let r=new Map(C.map(i=>[i.entry_id,i]));for(let i of e)r.set(i.entry_id,i);for(let i of t)r.delete(i);return[...r.values()]}function O7(C,H){return H.objects&&e5(H.objects),H.delta&&e5(H.delta),y8(C,H)}function t5(C){return C.responsible_user_id?[C.responsible_user_id]:[...new Set((C.assignee_pool||[]).filter(H=>typeof H=="string"&&H))]}function $7(C,H){return!!H&&t5(C).includes(H)}x2();D();w();d0();function y4(C){return(C.tags||[]).includes("photo")}X5();function k4(){return window.customCards??[]}function f2(C){let H=window;H.customCards=H.customCards||[],H.customCards.some(e=>e.type===C.type)||H.customCards.push(C)}function w4(C,H,e=t=>import(t)){let t=window,r;try{let p=new URL(H);r=p.origin+p.pathname}catch{return}let i=`__msCardHeal:${C[0]}:${r}`;if(t[i])return;t[i]=!0;let o=0,L=0,M=!1,d=()=>{if(o+=1,C.some(m=>!customElements.get(m))&&L<3&&!M){L+=1,M=!0;try{let m=new URL(H);m.searchParams.set("heal",`${Date.now()}`),e(m.href).catch(()=>{}).finally(()=>{M=!1})}catch{return}}o<20&&window.setTimeout(d,o<8?500:2e3)};window.setTimeout(d,250)}H5();var re={"maintenance-supporter-card":[null,"picker_desc_card"],"maintenance-supporter-calendar-card":["picker_name_calendar","picker_desc_calendar"],"maintenance-supporter-panel-card":["picker_name_panel","picker_desc_panel"],"maintenance-budget-section-card":["picker_name_budget","picker_desc_budget"],"maintenance-groups-section-card":["picker_name_groups","picker_desc_groups"],"maintenance-vacation-section-card":["picker_name_vacation","picker_desc_vacation"],"maintenance-battery-fleet-card":["picker_name_battery_fleet","picker_desc_battery_fleet"],"maintenance-supporter":[null,"picker_desc_dashboard"],"maintenance-supporter-section":["picker_name_section","picker_desc_section"],"maintenance-supporter-vacation":["picker_name_vacation_status","picker_desc_vacation_status"],"maintenance-supporter-budget":["picker_name_budget_status","picker_desc_budget_status"],"maintenance-supporter-groups":["picker_name_groups","picker_desc_groups_status"]},m0=new WeakMap;function He(C){let H=window;for(let e of[...k4(),...H.customStrategies??[]]){let t=re[e.type];if(!t)continue;m0.has(e)||m0.set(e,{name:e.name,description:e.description});let r=m0.get(e),[i,o]=t;i&&(e.name=V(i,C,r.name)),e.description=V(o,C,r.description)}}function J5(){let C=0,H=()=>{let e=document.querySelector("home-assistant")?.hass;if(e?.language){let t=e.language;g1(t).then(()=>He(t));return}++C<60&&setTimeout(H,1e3)};H()}u0();A0();t3();k();function E4(C){let H=(C??[]).filter(e=>!!e);return H.length?a`<span class="event-titles"> · ${H.join(", ")}</span>`:s}function P4(C){return C?a`<span class="event-titles trigger-detail"> · ${C}</span>`:s}o3();w2();Z2();a3();k();w();l5();Y();s3();function M9(C,H,e="last-done"){let t=s4(C,H);return t?a`<span class="${e}" title="${V("last_performed",H)}: ${P(C,H)}">${t}</span>`:null}E1();k();D();w();E1();y0();p5();var A1=class extends Z{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._loadingObjects=!0;this._loadError=!1;this._views=[];this._objectsLoaded=!1;this._applySimplePreset=()=>{let e={...this._config,compact:!0,action_style:"icons",show_actions:!0,show_create:!1,show_assignee:!0,show_documents:!1};this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))};this._onEntitiesChanged=e=>{this._valueChanged("entity_ids",e.detail.value||[])}}get _lang(){return T(this.hass)}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._objectsLoaded&&(this._objectsLoaded=!0,this._loadObjects())}async _loadObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=e.objects||[],this._loadError=!1}catch{this._objects=[],this._loadError=!0}this._loadingObjects=!1;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e.views||[]}catch{this._views=[]}}_valueChanged(e,t){let r={...this._config,[e]:t};(Array.isArray(t)&&t.length===0||t===""||t===void 0||t===null)&&delete r[e],this._config=r,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}}))}_toggleStatus(e,t){let r=new Set(this._config.filter_status||[]);t?r.add(e):r.delete(e),this._valueChanged("filter_status",[...r])}_toggleObject(e,t,r){let i=new Set(this._config.filter_objects||[]);i.delete(t),r?i.add(e):i.delete(e),this._valueChanged("filter_objects",[...i])}_dropStale(e,t){this._valueChanged(e,(this._config[e]||[]).filter(r=>r!==t))}_toggleLabel(e,t){let r=new Set(this._config.filter_labels||[]);t?r.add(e):r.delete(e),this._valueChanged("filter_labels",[...r])}_toggleArea(e,t){let r=new Set(this._config.filter_areas||[]);t?r.add(e):r.delete(e),this._valueChanged("filter_areas",[...r])}_togglePriority(e,t){let r=new Set(this._config.filter_priority||[]);t?r.add(e):r.delete(e),this._valueChanged("filter_priority",[...r])}_staleRow(e,t){return a`
      <label class="object-row stale">
        <input type="checkbox" .checked=${!0} @change=${()=>this._dropStale(e,t)} />
        <span>${t}</span>
      </label>
    `}render(){let e=this._lang,t=new Set(this._config.filter_status||[]),r=new Set(this._config.filter_objects||[]),i=[...this._objects].map(h=>({entryId:h.entry_id,name:h.object.name,checked:r.has(h.entry_id)||r.has(h.object.name)})).sort((h,O)=>h.name.localeCompare(O.name)),o=new Set(this._objects.flatMap(h=>[h.entry_id,h.object.name])),L=[...r].filter(h=>!o.has(h)),M=new Set(this._config.filter_areas||[]),d=[...new Set(this._objects.map(h=>h.object.area_id).filter(h=>!!h).concat([...M]))],p=h=>this.hass?.areas?.[h]?.name||h,m=d.map(h=>({id:h,name:p(h)})).sort((h,O)=>h.name.localeCompare(O.name)),A=new Set(this._config.filter_labels||[]),x=new Set(this._config.filter_priority||[]),y=[...new Set(this._objects.flatMap(h=>h.tasks.flatMap(O=>O.labels||[])))].sort((h,O)=>h.localeCompare(O)),_=[...A].filter(h=>!y.includes(h)),b=[];for(let h of this._objects)for(let O of h.tasks)O.sensor_entity_id&&b.push(O.sensor_entity_id),O.binary_sensor_entity_id&&b.push(O.binary_sensor_entity_id);return a`
      <div class="editor">
        <ms-textfield
          class="card-title"
          label="${V("card_title",e)}"
          .value=${this._config.title||""}
          @input=${h=>this._valueChanged("title",h.target.value)}
        ></ms-textfield>

        <!-- #234: a starting point for a kitchen tablet; every option stays its own -->
        <div class="field simple-preset">
          <button type="button" class="preset-btn" @click=${this._applySimplePreset}>${V("card_simple_preset",e)}</button>
          <div class="field-help">${V("card_simple_preset_help",e)}</div>
        </div>

        <!-- Status filter (chip row) -->
        <div class="field">
          <div class="field-label">${V("card_filter_status",e)}</div>
          <div class="chip-row">
            ${P5.map(h=>a`
              <label class="chip ${t.has(h)?"active":""}">
                <input type="checkbox"
                  .checked=${t.has(h)}
                  @change=${O=>this._toggleStatus(h,O.target.checked)} />
                ${V(h,e)}
              </label>
            `)}
          </div>
          <div class="field-help">${V("card_filter_status_help",e)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${V("card_filter_objects",e)}</div>
          ${this._loadingObjects?a`<div class="field-help">${V("card_loading_objects",e)}</div>`:this._loadError?a`<div class="field-help error-text">${V("card_load_error",e)}</div>`:i.length===0&&L.length===0?a`<div class="field-help">${V("no_objects",e)}</div>`:a`
                <div class="object-list">
                  ${i.map(h=>a`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${h.checked}
                        @change=${O=>this._toggleObject(h.entryId,h.name,O.target.checked)} />
                      <span>${h.name}</span>
                    </label>
                  `)}
                  ${L.map(h=>this._staleRow("filter_objects",h))}
                </div>
                <div class="field-help">${V("card_filter_objects_help",e)}</div>
              `}
        </div>
        <!-- Area filter (C8): selects whole objects by the room they sit in.
             Hidden while no object has an area — the section would be an
             empty box otherwise. -->
        ${m.length?a`
        <div class="field">
          <div class="field-label">${V("card_filter_areas",e)}</div>
          <div class="object-list">
            ${m.map(h=>a`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${M.has(h.id)}
                  @change=${O=>this._toggleArea(h.id,O.target.checked)} />
                <span>${h.name}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${V("card_filter_areas_help",e)}</div>
        </div>`:s}
        ${y.length||_.length?a`
        <div class="field">
          <div class="field-label">${V("labels",e)}</div>
          <div class="object-list">
            ${y.map(h=>a`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${A.has(h)}
                  @change=${O=>this._toggleLabel(h,O.target.checked)} />
                <span>${h}</span>
              </label>
            `)}
            ${_.map(h=>this._staleRow("filter_labels",h))}
          </div>
        </div>`:s}
        <div class="field">
          <div class="field-label">${V("priority",e)}</div>
          <div class="object-list">
            ${l9.map(h=>a`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${x.has(h)}
                  @change=${O=>this._togglePriority(h,O.target.checked)} />
                <span>${V(`priority_${h}`,e)}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${V("card_filter_priority_help",e)}</div>
        </div>

        <!-- Entity-id filter (HA-native pattern). Limited to our integration's
             sensor + binary_sensor entities via includeEntities so the picker
             stays usable on installs with thousands of entities. -->
        <div class="field">
          <div class="field-label">${V("card_filter_entities",e)}</div>
          <ha-entities-picker
            .hass=${this.hass}
            .value=${this._config.entity_ids||[]}
            .includeDomains=${["sensor","binary_sensor"]}
            .includeEntities=${b}
            @value-changed=${this._onEntitiesChanged}
          ></ha-entities-picker>
          <div class="field-help">${V("card_filter_entities_help",e)}</div>
        </div>

        <!-- Saved-view scope (v2.26): applies the view's status/user/label
             filters on top of everything above. Hidden while no views exist —
             views are created in the panel toolbar, not here. -->
        ${this._views.length>0?a`
              <div class="field">
                <div class="field-label">${V("card_saved_view",e)}</div>
                <select
                  class="view-select"
                  .value=${this._config.view_id||""}
                  @change=${h=>this._valueChanged("view_id",h.target.value)}
                >
                  <option value="" ?selected=${!this._config.view_id}>
                    ${V("card_saved_view_none",e)}
                  </option>
                  ${this._views.map(h=>a`<option value=${h.id} ?selected=${this._config.view_id===h.id}>
                      ${h.name}
                    </option>`)}
                </select>
                <div class="field-help">${V("card_saved_view_help",e)}</div>
              </div>
            `:s}

        <ha-formfield label="${V("card_show_header",e)}">
          <ha-switch
            .checked=${this._config.show_header!==!1}
            @change=${h=>this._valueChanged("show_header",h.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${V("card_show_actions",e)}">
          <ha-switch
            .checked=${this._config.show_actions!==!1}
            @change=${h=>this._valueChanged("show_actions",h.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${V("card_show_create",e)}">
          <ha-switch
            class="show-create"
            .checked=${this._config.show_create??this._config.show_actions!==!1}
            @change=${h=>this._valueChanged("show_create",h.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <label class="editor-select">
          <span>${V("card_action_style",e)}</span>
          <select
            .value=${this._config.action_style??""}
            @change=${h=>{let O=h.target.value;this._valueChanged("action_style",O===""?void 0:O)}}
          >
            <option value="" ?selected=${!this._config.action_style}>${V("row_actions_follow",e)}</option>
            <option value="buttons" ?selected=${this._config.action_style==="buttons"}>${V("row_actions_buttons",e)}</option>
            <option value="icons" ?selected=${this._config.action_style==="icons"}>${V("row_actions_icons",e)}</option>
          </select>
        </label>

        <ha-formfield label="${V("responsible_user",e)}">
          <ha-switch
            .checked=${this._config.show_assignee!==!1}
            @change=${h=>this._valueChanged("show_assignee",h.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${V("documents",e)}">
          <ha-switch
            .checked=${this._config.show_documents!==!1}
            @change=${h=>this._valueChanged("show_documents",h.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${V("card_compact",e)}">
          <ha-switch
            .checked=${this._config.compact||!1}
            @change=${h=>this._valueChanged("compact",h.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ms-textfield
          class="card-max-items"
          label="${V("card_max_items",e)}"
          type="number"
          .value=${String(this._config.max_items||0)}
          @input=${h=>this._valueChanged("max_items",parseInt(h.target.value,10)||0)}
        ></ms-textfield>
        ${s}
      </div>
    `}};A1.styles=g`
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
  `,n([u({attribute:!1})],A1.prototype,"hass",2),n([l()],A1.prototype,"_config",2),n([l()],A1.prototype,"_objects",2),n([l()],A1.prototype,"_loadingObjects",2),n([l()],A1.prototype,"_loadError",2),n([l()],A1.prototype,"_views",2);customElements.get("maintenance-supporter-card-editor")||customElements.define("maintenance-supporter-card-editor",A1);I0();h2();k();D();k();D();w();w();function w9(C,H,e){return V(`part_waiting_${C}`,e).replace("{count}",f(H,e))}R0();p1();Z2();w2();Y();l5();h3();g5();var q=class q extends Z{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._choosing=null;this._error="";this._disposeFor=null;this._disposeQty="1";this._history=null;this._rosterSort=q._storedSort();this._typeFilter=null;this._recorded=[];this._access=y1;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async e=>{if(x5(U1.batteryRosterOpen,e?"1":"0"),!(!e||this._historyRequested)){this._historyRequested=!0;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=t.series}catch{this._history=null}}}}get _lang(){return T(this.hass)}get _canWrite(){return m1(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(e){D5(this,e),e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,g1(this._lang).then(()=>this.requestUpdate()),t1(this.hass).then(t=>{this._access=t.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let e=await F(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:t=>{this._loading=t},onError:t=>{this._error=t}});e!==void 0&&(this._ov=e)}async _act(e,t){return this._marking?!1:(this._error="",await F(this,e,{busy:i=>{this._marking=i},reload:async()=>{t?.(),await this._load()},onError:i=>{this._error=i}})!==void 0)}async _dispose(e,t){let r=parseFloat(this._disposeQty);!Number.isFinite(r)||r<=0||await this._act({type:"maintenance_supporter/part/dispose",entry_id:e,part_id:t,quantity:r})&&(this._disposeFor=null)}_renderDispose(e,t,r){return this._disposeFor!==t.part_id?a`<button class="bf-charged bf-dispose" title=${V("part_dispose_hint",r)} .disabled=${this._marking}
        @click=${()=>{this._disposeFor=t.part_id,this._disposeQty="1"}}><ha-icon icon="mdi:trash-can-outline"></ha-icon>${V("part_dispose",r)}</button>`:a`<input
        class="bf-dispose-qty"
        type="number"
        min="1"
        max=${String(t.restoring)}
        .value=${this._disposeQty}
        aria-label=${V("part_dispose_how_many",r)}
        title=${V("part_dispose_how_many",r)}
        @input=${i=>this._disposeQty=i.target.value}
        @keydown=${i=>{i.key==="Enter"&&this._dispose(e,t.part_id),i.key==="Escape"&&(this._disposeFor=null)}}
      /><button class="bf-charged bf-dispose confirm" title=${V("part_dispose_hint",r)} .disabled=${this._marking}
        @click=${()=>this._dispose(e,t.part_id)}><ha-icon icon="mdi:check"></ha-icon>${V("part_dispose",r)}</button
      ><button class="bf-charged bf-dispose" title=${V("cancel",r)} @click=${()=>this._disposeFor=null}
        ><ha-icon icon="mdi:close"></ha-icon
      ></button>`}_markOne(e,t){if(e.cell_choices&&e.cell_choices.length>1){this._choosing={entityId:e.entity_id,list:t,selected:e.cells_installed||e.cell_choices[0].type};return}this._mark([e.entity_id])}async _confirmCells(){let e=this._choosing;e&&(this._choosing=null,await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",entity_ids:[e.entityId],cells:{[e.entityId]:e.selected}}))}_renderCellChooser(e,t,r){let i=this._choosing;return!i||i.entityId!==e.entity_id||i.list!==t||!e.cell_choices?s:a`
      <div class="bf-cells" role="group" aria-label=${V("battery_fleet_cells_question",r)}>
        <div class="bf-cells-q">${V("battery_fleet_cells_question",r)}</div>
        ${e.cell_choices.map(o=>a`
          <label class="bf-cell-choice">
            <input type="radio" name=${`cells-${e.entity_id}`} .checked=${i.selected===o.type}
              @change=${()=>{this._choosing={...i,selected:o.type}}} />
            <span>${o.name}</span>
            ${o.rechargeable?a`<span class="bf-cell-tag">${V("battery_fleet_cells_rechargeable",r)}</span>`:s}
          </label>`)}
        <div class="bf-cells-actions">
          <button class="bf-cells-cancel" @click=${()=>{this._choosing=null}}>${V("cancel",r)}</button>
          <button class="bf-cells-ok" .disabled=${this._marking} @click=${()=>this._confirmCells()}>
            ${V("battery_fleet_mark_one",r)}
          </button>
        </div>
      </div>
    `}async _mark(e){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...e?{entity_ids:e}:{}})}async _setExcluded(e,t){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:e,excluded:t})}async _addBattery(e){let t=e.detail?.value;t&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:t,included:!0})}async _setTrackSelf(e){await this._setFleetOption("set_track_self_charging",e.target)}async _setDueWithoutSensor(e){await this._setFleetOption("set_due_without_sensor",e.target)}async _setAskCells(e){await this._setFleetOption("set_ask_cells",e.target)}async _setFleetOption(e,t){let r=t.checked;await this._act({type:`maintenance_supporter/battery_fleet/${e}`,enabled:r})||(t.checked=!r)}_rosterOpen(){return h5(U1.batteryRosterOpen)!=="0"}_predictedTitle(e,t){if(e.forecast_overdue)return V("battery_fleet_forecast_overdue",t);let r=this._predictedDate(this._forecastDays(e)??0);if(e.predicted_source==="trend")return V("battery_fleet_predicted_trend",t).replace("{date}",r).replace("{confidence}",V("cal_confidence_"+(e.prediction_confidence||"medium"),t));if(e.lifetime_months!=null&&e.lifetime_source){let i=V("lifetime_source_"+e.lifetime_source,t).replace("{n}",String(e.lifetime_samples??0));return V("battery_fleet_predicted_typical",t).replace("{date}",r).replace("{months}",String(e.lifetime_months)).replace("{type}",e.battery_type).replace("{source}",i)}return V("battery_fleet_predicted_on",t).replace("{date}",r)}_sparkline(e){let t=this._history?.[e.entity_id];if(!t||t.points.length<2)return s;let r=110,i=24,o=2,L=t.points[0][0],M=t.points[t.points.length-1][0],d=Date.now()/1e3,p=e.status!=="low"&&e.predicted_source==="trend"&&e.days_until!=null?d+e.days_until*86400:null,m=Math.max(M,p??M),A=h=>m===L?o:o+(h-L)/(m-L)*(r-2*o),x=h=>o+(1-Math.min(100,Math.max(0,h))/100)*(i-2*o),y=t.points.map(([h,O])=>`${$(A(h))},${$(x(O))}`).join(" "),_=t.points[t.points.length-1][1],b=$(x(t.threshold));return a`<svg
      class="bf-spark"
      viewBox="0 0 ${r} ${i}"
      role="img"
      aria-label=${V("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${V("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${b} x2=${r} y2=${b}></line>
      <polyline class="bf-spark-line" points=${y}></polyline>
      ${p!==null?a`<line
            class="bf-spark-proj"
            x1=${$(A(M))}
            y1=${$(x(_))}
            x2=${$(A(p))}
            y2=${b}
          ></line>`:s}
    </svg>`}static _storedSort(){return h5(U1.batteryRosterSort)==="name"?"name":"urgency"}_setSort(e){this._rosterSort=e,x5(U1.batteryRosterSort,e)}_sortedRoster(e){let t=this._typeFilter===null?e:e.filter(i=>i.battery_type===this._typeFilter);if(this._rosterSort==="name")return t;let r=i=>i.status==="low"?-1e3+(i.level??101)/101:i.days_until??1/0;return[...t].sort((i,o)=>r(i)-r(o)||i.device_name.localeCompare(o.device_name))}_predictedDate(e){return P(J7(f1(),e),this._lang)}_forecastDays(e){return e.forecast_days!==void 0?e.forecast_days:e.days_until}_fmtDate(e){return Number.isFinite(e)?P(new Date(e).toISOString(),this._lang):"\u2014"}_shoppingLine(e){return Object.entries(e).map(([t,r])=>a`<button
        class="bf-type-chip ${this._typeFilter===t?"bf-type-chip-active":""}"
        title=${V("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(t)}
      >
        ${r}× ${t}
      </button>`)}_toggleTypeFilter(e){if(this._typeFilter=this._typeFilter===e?null:e,this._typeFilter!==null){let t=this.shadowRoot?.querySelector(".bf-roster");t instanceof HTMLDetailsElement?t.open||(t.open=!0):t&&!t.expanded&&(t.expanded=!0,this._loadHistory(!0))}}async _recordJump(e,t){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:e,replaced_at:new Date(t.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,e]})}_levelTone(e,t){let r=t.low_threshold??20;return e<=r?"bad":e<=r+20?"warn":"good"}_levelBar(e){let t=e.level;return t==null?s:a`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${this._levelTone(t,e)}" style="width: ${Math.min(100,Math.max(0,t))}%"></span
    ></span>`}_jumpButton(e,t){let r=this._history?.[e.entity_id]?.jump;return!r||this._recorded.includes(e.entity_id)?s:a`<button
      class="bf-mark bf-jump"
      title=${V("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(r.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(e.entity_id,r)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(e,t,r){let i=e.available===!1?a`<span class="bf-offline">${V("battery_fleet_offline",t)}</span>`:e.no_sensor?a`<span class="bf-offline bf-nosensor">${V("battery_fleet_no_sensor",t)}</span>`:s,o=`${e.quantity}\xD7 ${e.battery_type}`,L=a`<span class="bf-type" title=${o}>${o}</span>`,M=this._canWrite,d=M&&(r.mark==="always"||e.no_sensor||e.can_mark_replaced),p=this._forecastDays(e);return a`
      <div class="bf-row">
        <span class="bf-dev">${e.device_name}</span>
        ${r.status?a`<span class="bf-status bf-${e.status}"
                >${e.no_sensor&&e.status==="low"?V("battery_fleet_status_due",t):V("battery_fleet_status_"+e.status,t)}</span
              >${L}${i}`:a`${i}${L}`}
        ${r.recharge&&e.rechargeable?a`<span class="bf-recharge" title=${V("battery_fleet_rechargeable",t)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:s}
        ${r.sparkline?this._sparkline(e):s}
        ${this._levelBar(e)}
        ${e.level!=null?a`<span class="bf-level bf-level-${this._levelTone(e.level,e)}">${e.level}%</span>`:s}
        ${d?a`<button
              class="bf-mark${r.mark==="replaced"?" bf-replaced":""}"
              title=${e.rechargeable?V("battery_fleet_mark_recharged",t):V("battery_fleet_mark_one",t)}
              .disabled=${this._marking}
              @click=${()=>this._markOne(e,r.list)}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:s}
        ${r.jump&&M?this._jumpButton(e,t):s}
        ${r.predicted&&p!=null?a`<span
              class="bf-predicted ${e.predicted_source==="trend"?"bf-trend":""} ${e.forecast_overdue?"bf-overdue":""} ${e.forecast_overdue&&e.status==="ok"?"bf-quiet":""}"
              title=${this._predictedTitle(e,t)}
              >${e.forecast_overdue?a`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:s}~${this._predictedDate(p)}</span
            >`:s}
        ${r.exclude&&M?a`<button
              class="bf-mark bf-exclude"
              title=${V("battery_fleet_exclude",t)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(e.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:s}
      </div>
      ${this._renderCellChooser(e,r.list,t)}
    `}render(){let e=this._lang;if(this._loading&&this._ov===null)return a`<div class="bf-card"><div class="bf-loading">…</div></div>`;let t=this._ov;if(!t)return this._error?a`<div class="bf-card"><div class="bf-error">${this._error}</div></div>`:s;let r=t.low.length;return a`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${V("battery_fleet_title",e)}</span>
          <span class="bf-count ${r?"bad":"ok"}">${r}</span>
        </div>
        ${this._error?a`<div class="bf-error">${this._error}</div>`:s}

        ${t.configured&&t.task_ok===!1?a`
              <div class="bf-repair">
                <span>${V("battery_fleet_trigger_lost",e)}</span>
                ${this._canWrite?a`<ha-button .disabled=${this._marking} @click=${this._repair}>
                      ${V("battery_fleet_repair",e)}
                    </ha-button>`:s}
              </div>
            `:s}

        ${r===0?a`<div class="bf-empty">${V("battery_fleet_none_low",e)}</div>`:a`
              <div class="bf-shopping">
                <span class="bf-label">${V("battery_fleet_buy_now",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${t.low.map(i=>this._renderRow(i,e,{list:"low",recharge:!0,mark:"always",exclude:!0}))}
              </div>
              ${this._canWrite?a`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${V("battery_fleet_mark_all",e)}
                    </ha-button>
                  </div>`:s}
            `}

        ${t.charging?.length?a`
              <div class="bf-charging">
                <span class="bf-label">${V("battery_fleet_charging",e)}</span>
                ${t.charging.map(i=>a`<span class="bf-charge-item">
                    <span class="bf-charge-name">${i.name}</span>
                    <span>${V("battery_fleet_ready",e).replace("{count}",f(i.stock,e))}</span>
                    ${i.restoring>0?a`<span class="bf-charge-waiting">${w9(i.reuse,i.restoring,e)}</span>
                          ${this._canWrite?a`<button
                                class="bf-charged"
                                title=${V("part_ready_again_hint",e)}
                                .disabled=${this._marking}
                                @click=${()=>this._act({type:"maintenance_supporter/part/ready_again",entry_id:t.entry_id,part_id:i.part_id})}
                              ><ha-icon icon="mdi:battery-charging-100"></ha-icon>${V(`part_reuse_${i.reuse}`,e)}</button>
                              ${this._renderDispose(t.entry_id,i,e)}`:s}`:s}
                  </span>`)}
              </div>
            `:s}
        ${t.soon.length?a`
              <div class="bf-soon">
                <span class="bf-label">${V("battery_fleet_soon",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_soon)}</span>
                <div class="bf-soon-hint">${V("battery_fleet_soon_hint",e)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${t.soon.map(i=>this._renderRow(i,e,{list:"soon",mark:"replaced",predicted:!0}))}
              </div>
            `:s}
        ${t.all?.length?a`
              ${M1({cls:"bf-roster",open:this._rosterOpen(),onToggle:this._loadHistory,header:a`${V("battery_fleet_all",e)} (${t.all.length})`},a`
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort==="urgency"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("urgency")}
                  >
                    ${V("battery_fleet_sort_urgency",e)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort==="name"?"bf-sort-active":""}"
                    @click=${()=>this._setSort("name")}
                  >
                    ${V("battery_fleet_sort_name",e)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(t.all).map(i=>this._renderRow(i,e,{list:"roster",status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
                </div>
                <div class="bf-roster-hint">${V("battery_fleet_all_hint",e)}</div>
                ${this._canWrite?this._renderRosterSettings(t,e):s}
              `)}
            `:s}
        ${this._renderExcluded(t,e)}
        <div class="bf-total">${V("battery_fleet_total",e).replace("{n}",String(t.total))}</div>
      </div>
    `}_renderRosterSettings(e,t){return a`
                <div class="bf-add">
                  <span class="bf-label">${V("battery_fleet_add",t)}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{entity:{domain:["sensor","binary_sensor"]}}}
                    .value=${""}
                    @value-changed=${this._addBattery}
                  ></ha-selector>
                  <div class="bf-roster-hint">${V("battery_fleet_add_hint",t)}</div>
                </div>
                ${E({cls:"bf-track-self",checked:!!e.track_self_charging,disabled:this._marking,onChange:this._setTrackSelf},a`${V("battery_fleet_track_self",t)}`)}
                <div class="bf-roster-hint">${V("battery_fleet_track_self_hint",t)}</div>
                ${E({cls:"bf-track-self bf-due-nosensor",checked:e.due_without_sensor!==!1,disabled:this._marking,onChange:this._setDueWithoutSensor},a`${V("battery_fleet_due_without_sensor",t)}`)}
                <div class="bf-roster-hint">${V("battery_fleet_due_without_sensor_hint",t)}</div>
                ${E({cls:"bf-track-self bf-ask-cells",checked:!!e.ask_cells,disabled:this._marking,onChange:this._setAskCells},a`${V("battery_fleet_ask_cells",t)}`)}
                <div class="bf-roster-hint">${V("battery_fleet_ask_cells_hint",t)}</div>
    `}_renderExcluded(e,t){return a`
        ${e.excluded?.length?a`
              <div class="bf-excluded">
                <span class="bf-label">${V("battery_fleet_excluded",t)}</span>
                ${e.excluded.map(r=>a`
                    <span class="bf-excluded-chip">
                      ${r.device_name}
                      ${this._canWrite?a`<button
                            class="bf-mark"
                            title=${V("battery_fleet_include",t)}
                            .disabled=${this._marking}
                            @click=${()=>this._setExcluded(r.entity_id,!1)}
                          >
                            <ha-icon icon="mdi:eye-outline"></ha-icon>
                          </button>`:s}
                    </span>
                  `)}
              </div>
            `:s}
    `}};q.styles=g`
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
  `,n([u({attribute:!1})],q.prototype,"hass",2),n([u({type:Boolean})],q.prototype,"flat",2),n([l()],q.prototype,"_ov",2),n([l()],q.prototype,"_loading",2),n([l()],q.prototype,"_marking",2),n([l()],q.prototype,"_choosing",2),n([l()],q.prototype,"_error",2),n([l()],q.prototype,"_disposeFor",2),n([l()],q.prototype,"_disposeQty",2),n([l()],q.prototype,"_history",2),n([l()],q.prototype,"_rosterSort",2),n([l()],q.prototype,"_typeFilter",2),n([l()],q.prototype,"_recorded",2),n([l()],q.prototype,"_access",2);var F0=q;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",F0);var F2=class extends Z{constructor(){super(...arguments);this._config={type:"custom:maintenance-battery-fleet-card"}}static getStubConfig(){return{type:"custom:maintenance-battery-fleet-card"}}setConfig(e){this._config=e}getCardSize(){return 6}render(){return this.hass?a`
      <ha-card .header=${this._config.title||void 0}>
        <div class="content">
          <maintenance-battery-fleet-section flat .hass=${this.hass}></maintenance-battery-fleet-section>
        </div>
      </ha-card>
    `:s}};F2.styles=g`
    ha-card {
      overflow: hidden;
    }
    .content {
      padding: 12px 16px 14px;
    }
  `,n([u({attribute:!1})],F2.prototype,"hass",2),n([l()],F2.prototype,"_config",2);customElements.get("maintenance-battery-fleet-card")||customElements.define("maintenance-battery-fleet-card",F2);f2({type:"maintenance-battery-fleet-card",name:"Battery Fleet",description:"All tracked batteries: what is low now, what runs out soon, and what to buy.",preview:!1});v1();k();D();var V7=["today","dashboard","calendar","settings"];w();var z2="maintenance-supporter-panel-card",i7="maintenance-supporter-panel",a7="maintenance-supporter",o7=870,Qt=320,Kt=480;function Yt(C){let e=C?.panels?.[a7]?.config?._panel_custom?.module_url;return typeof e=="string"&&e.startsWith("/")?e:null}function Xt(C){if(C==null||C===""||C==="fill")return null;if(typeof C=="number")return C>0?`${Math.round(C)}px`:null;let H=String(C).trim();return/^\d+(\.\d+)?$/.test(H)?`${H}px`:H||null}var L7=class extends HTMLElement{constructor(){super();this._config={type:`custom:${z2}`};this._panel=null;this._loading=null;this._observer=null;this._lastWidth=-1;this._preview=!1;this._onResize=()=>this._layout(!0);let e=this.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
      :host { display: block; box-sizing: border-box; overflow: hidden; border-radius: var(--ha-card-border-radius, 12px); }
      .status { padding: 16px; color: var(--secondary-text-color); font-size: 14px; }
      ${i7} { display: block; height: 100%; }
    `,e.appendChild(t),this._status=document.createElement("div"),this._status.className="status",this._status.hidden=!0,e.appendChild(this._status)}static getConfigElement(){return document.createElement("maintenance-supporter-panel-card-editor")}static getStubConfig(){return{type:`custom:${z2}`}}set preview(e){this._preview=!!e,this._layout(!0)}get preview(){return this._preview}_inEditorPreview(){if(this._preview)return!0;let e=this;for(let t=0;e&&t<40;t++){let r=e;if(r.tagName==="HUI-CARD-PREVIEW"||r.tagName==="HUI-DIALOG-EDIT-CARD")return!0;e=r.parentElement??r.getRootNode().host??null}return!1}setConfig(e){this._config={...e},this._panel&&(this._panel.presets=this._presets()),this._layout(!0)}getCardSize(){return 12}getGridOptions(){return{columns:"full",rows:"auto"}}set hass(e){this._hass=e,this._panel?this._panel.hass=e:this._mount()}get hass(){return this._hass}connectedCallback(){typeof ResizeObserver<"u"&&!this._observer&&(this._observer=new ResizeObserver(()=>this._layout(!1)),this._observer.observe(this)),window.addEventListener("resize",this._onResize),this._layout(!0),this._hass&&this._mount()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,window.removeEventListener("resize",this._onResize)}_presets(){let e={};return V7.includes(this._config.tab??"")&&(e.tab=this._config.tab),typeof this._config.view=="string"&&this._config.view.trim()&&(e.view=this._config.view.trim()),e}_setStatus(e){this._status.textContent=e,this._status.hidden=!1}async _mount(){if(this._panel||this._loading||!this._hass||!this.isConnected)return;let e=T(this._hass);if(!customElements.get(i7)){let r=Yt(this._hass);if(!r){this._setStatus(V("panel_card_not_registered",e));return}this._loading=import(r).then(()=>{},()=>{throw this._setStatus(V("panel_card_load_failed",e)),new Error("panel bundle failed to load")});try{await this._loading}catch{return}finally{this._loading=null}if(this._panel||!this._hass||!this.isConnected)return}let t=document.createElement(i7);t.embedded=!0,t.panel=this._hass.panels?.[a7]??{url_path:a7},t.presets=this._presets(),t.narrow=this._narrow(),t.hass=this._hass,this._status.hidden=!0,this.shadowRoot.appendChild(t),this._panel=t,this._layout(!0)}_narrow(){let e=this.getBoundingClientRect().width;return e>0?e<o7:window.innerWidth<o7}_layout(e){let t=this.getBoundingClientRect(),r=Math.round(t.width)!==this._lastWidth;if(!e&&!r)return;this._lastWidth=Math.round(t.width),this._panel&&t.width>0&&(this._panel.narrow=t.width<o7);let i=Xt(this._config.height);if(i){this.style.height=i;return}if(!this.isConnected)return;if(this._inEditorPreview()){this.style.height=`${Kt}px`;return}let o=Math.max(0,this._unscrolledTop(t)),L=Math.max(Qt,Math.floor(window.innerHeight-o));this.style.height=`${L}px`}_unscrolledTop(e){let t=e.top+window.scrollY,r=this.ownerDocument,i=this.parentElement??this.getRootNode().host??null;for(let o=0;i&&o<100;o++){let L=i;L!==r.documentElement&&L!==r.body&&typeof L.scrollTop=="number"&&L.scrollTop>0&&(t+=L.scrollTop),i=L.parentElement??L.getRootNode().host??null}return t}},s2=class extends Z{constructor(){super(...arguments);this._config={type:`custom:${z2}`};this._views=[];this._viewsLoaded=!1}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._viewsLoaded&&(this._viewsLoaded=!0,this._loadViews())}async _loadViews(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e?.views||[]}catch{this._views=[]}}_set(e,t){let r={...this._config};t===""||t===void 0?delete r[e]:r[e]=t,this._config=r,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r},bubbles:!0,composed:!0}))}render(){let e=T(this.hass),t=r=>V(r==="today"?"tab_today":r==="calendar"?"tab_calendar":r,e);return a`
      <div class="editor">
        <div class="field">
          <div class="field-label">${V("panel_card_tab",e)}</div>
          <select class="tab-select" .value=${this._config.tab||""} @change=${r=>this._set("tab",r.target.value)}>
            <option value="" ?selected=${!this._config.tab}>${V("panel_card_tab_default",e)}</option>
            ${V7.map(r=>a`<option value=${r} ?selected=${this._config.tab===r}>${t(r)}</option>`)}
          </select>
        </div>
        ${this._views.length>0?a`<div class="field">
              <div class="field-label">${V("panel_card_view",e)}</div>
              <select class="view-select" .value=${this._config.view||""} @change=${r=>this._set("view",r.target.value)}>
                <option value="" ?selected=${!this._config.view}>${V("card_saved_view_none",e)}</option>
                ${this._views.map(r=>a`<option value=${r.id} ?selected=${this._config.view===r.id||this._config.view===r.name}>${r.name}</option>`)}
              </select>
            </div>`:s}
        <div class="field">
          <div class="field-label">${V("panel_card_height",e)}</div>
          <input class="height-input" type="text" placeholder="fill"
            .value=${this._config.height===void 0?"":String(this._config.height)}
            @change=${r=>this._set("height",r.target.value.trim())} />
          <div class="field-help">${V("panel_card_height_help",e)}</div>
        </div>
      </div>
    `}};s2.styles=g`
    .editor { display: flex; flex-direction: column; gap: 16px; padding: 16px; }
    input.height-input { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; box-sizing: border-box; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; color: var(--secondary-text-color); font-weight: 500; }
    .field-help { font-size: 12px; color: var(--secondary-text-color); }
    select { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; }
  `,n([u({attribute:!1})],s2.prototype,"hass",2),n([l()],s2.prototype,"_config",2),n([l()],s2.prototype,"_views",2);customElements.get(z2)||customElements.define(z2,L7);customElements.get("maintenance-supporter-panel-card-editor")||customElements.define("maintenance-supporter-panel-card-editor",s2);f2({type:z2,name:"Maintenance Supporter \u2014 Panel",description:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",preview:!1});J5();var H8=2,K=class extends Z{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._globalRowStyle="buttons_compact";this._settings=k2;this._firstLoadDone=!1;this._objects=[];this._stats=null;this._unsub=null;this._viewFilters=null;this._userNames={};this._userPersons={};this._userService=null;this._userNamesLoaded=!1;this._taskDocs={};this._docsLoadedFor=new Set;this._dataLoaded=!1;this._lastConnection=null;this._subGen=0;this._onCompleted=async e=>{await this._loadData();let t=e.detail;t?.undo&&i2(this,this.hass,t,this._lang,()=>{this._loadData()})}}get _lang(){return T(this.hass)}static getConfigElement(){return document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0,filter_status:[...W3],max_items:10}}setConfig(e){let t=e.view_id!==this._config.view_id;this._config=e,t&&this._dataLoaded&&this.hass&&this._loadViewFilters()}getCardSize(){return 3}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._subGen++,this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),D5(this,e),this.hass&&!this._userNamesLoaded&&this._config.show_assignee!==!1&&this._objects.some(t=>t.tasks.some(r=>t5(r).length>0))&&this._loadUserNames(),this.hass&&this._config.show_documents!==!1)for(let t of this._objects)this._docsLoadedFor.has(t.entry_id)||t.tasks.some(r=>(r.document_count??0)>0)&&this._loadDocuments(t.entry_id);if(e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){t1(this.hass).then(t=>{this._settings=t,this._globalRowStyle=t.rowActionStyle}).catch(()=>{});let e=this._loadViewFilters();try{let[t,r]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);await e,this._objects=e5(t.objects),this._stats=r,N5(this._stats.budget)}catch{}await e,this._firstLoadDone=!0}_assigneeName(e){return this._config.show_assignee===!1?"":t5(e).map(t=>this._userNames[t]).filter(Boolean).join(", ")}_assigneeAvatars(e){return T4(t5(e).map(t=>this._userPersons[t]))}async _loadUserNames(){this._userNamesLoaded=!0,this._userService?this._userService.updateHass(this.hass):this._userService=new b2(this.hass);try{let e=await this._userService.getUsers();this._userPersons=Object.fromEntries(e.map(t=>[t.id,e3(t)])),this._userNames=Object.fromEntries(e.map(t=>[t.id,t.name]))}catch{}}async _loadDocuments(e){this._docsLoadedFor.add(e);try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:e}),r={};for(let i of t.documents||[])if(!y4(i))for(let o of i.task_ids||[])(r[o]||=[]).push({id:i.id,title:i.title,kind:i.kind,url:i.url});this._taskDocs={...this._taskDocs,[e]:r}}catch{}}_docsFor(e,t){if(this._config.show_documents===!1)return[];let i=[...this._taskDocs[e]?.[t.id]||[]];return t.documentation_url&&i.push({id:`url:${t.id}`,title:V("documentation_label",this._lang),kind:"weblink",url:t.documentation_url}),i}_renderDocChips(e,t){let r=this._docsFor(e,t);if(!r.length)return s;let i=r.slice(H8);return a`<div class="doc-chips">
      ${r.slice(0,H8).map(o=>a`
        <button
          type="button"
          class="doc-chip"
          title="${o.title}"
          @click=${L=>{L.stopPropagation(),this._openDoc(o)}}
        >
          <ha-icon icon=${o.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
          <span>${o.title}</span>
        </button>
      `)}
      ${i.length?a`<span class="doc-chip doc-more" title="${i.map(o=>o.title).join(`
`)}">+${i.length}</span>`:s}
    </div>`}async _openDoc(e){if(e.kind==="weblink"&&e.url){g2(e.url)&&window.open(e.url,"_blank","noopener");return}try{await Z4(this.hass,e.id)}catch{}}async _loadViewFilters(){if(!this._config.view_id){this._viewFilters=null;return}try{let t=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"})).views||[]).find(r=>r.id===this._config.view_id);this._viewFilters=t?t.filters:null}catch{this._viewFilters=null}}async _subscribe(){let e=++this._subGen;try{let t=await this.hass.connection.subscribeMessage(r=>{let i=O7(this._objects,r);i!==null&&(this._objects=i)},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected||e!==this._subGen){t();return}this._unsub=t}catch{}}get _selectedTasks(){let e=[],{filter_status:t,filter_objects:r,entity_ids:i,filter_due_min_days:o,filter_due_max_days:L,filter_labels:M,filter_priority:d,filter_areas:p}=this._config,m=i?.length?new Set(i):null,A=o!==void 0||L!==void 0,x=this._viewFilters,y=x?.user_id==="current_user"?this.hass.user?.id??null:x?.user_id??null;for(let _ of this._objects)if(!(x?.place&&(_.object.place||"home")!==x.place)&&!(r?.length&&!r.includes(_.entry_id)&&!r.includes(_.object.name))){if(p?.length){let b=_.object.area_id;if(!b||!p.includes(b))continue}for(let b of _.tasks)if(!b.is_done&&!(b.archived||_.object.archived)&&!(t?.length&&!t.includes(b.status))&&!(M?.length&&!(b.labels||[]).some(h=>M.includes(h)))&&!(d?.length&&!d.includes(b.priority||"normal"))&&!(m&&!(b.sensor_entity_id&&m.has(b.sensor_entity_id)||b.binary_sensor_entity_id&&m.has(b.binary_sensor_entity_id)))){if(A){let h=b.days_until_due;if(h==null||o!==void 0&&h<o||L!==void 0&&h>L)continue}x&&(x.status&&b.status!==x.status||x.label&&!(b.labels||[]).includes(x.label)||x.priority&&(b.priority||"normal")!==x.priority||y&&!$7(b,y))||e.push({entry_id:_.entry_id,object_name:_.object.name,task:b})}}return e.sort((_,b)=>{let h=U3(_.task.status)-U3(b.task.status);return h!==0?h:(_.task.days_until_due??1/0)-(b.task.days_until_due??1/0)}),e}_openComplete(e,t,r=!1){if(!r&&e1(t)){this._quickComplete(e,t);return}let i=this.shadowRoot.querySelector("maintenance-complete-dialog");i3(i,V3({entryId:e,taskId:t.id,taskName:t.name,task:t,objects:this._objects,lang:this._lang,features:this._settings.features,currencySymbol:H2(this._stats?.budget),partsCostMode:this._settings.partsCostMode}),this._lang)}async _quickComplete(e,t){let r=await K5(this.hass,e,t.id,this._lang);if(r.result==="dialog"){this._openComplete(e,t,!0);return}if(r.result==="failed"||r.result==="already"){this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:r.message},bubbles:!0,composed:!0}));return}await this._loadData(),r.undo?i2(this,this.hass,{entryId:e,taskId:t.id,taskName:t.name},this._lang,()=>{this._loadData()}):this.dispatchEvent(new CustomEvent("hass-notification",{detail:{message:V("quick_complete_success",this._lang)},bubbles:!0,composed:!0}))}_headerCounts(e){let t={overdue:0,due_soon:0,triggered:0};for(let{task:r}of e)B7(r.status)&&(t[r.status]+=1);return t}_openTaskDetail(e,t){H7(e,t)}render(){let e=this._lang,t=this._config.title||V("maintenance",e),r=this._config.show_header!==!1,i=(this._config.action_style??(this._globalRowStyle==="icons"?"icons":"buttons"))==="buttons",o=this._config.show_actions!==!1,L=(this._config.show_create??o)&&m1(this.hass?.user,this._settings.access),M=this._config.compact||!1,d=this._selectedTasks,{max_items:p}=this._config,m=p&&p>0?d.slice(0,p):d,A=this._objects.length||this._stats?this._headerCounts(d):null;return a`
      <ha-card>
        <div class="card-header">
          <h1>${t}</h1>
          <div class="header-right">
            ${r&&A?a`
                  <div class="header-stats">
                    ${A.overdue>0?a`<span class="badge overdue">${A.overdue}</span>`:s}
                    ${A.due_soon>0?a`<span class="badge due_soon">${A.due_soon}</span>`:s}
                    ${A.triggered>0?a`<span class="badge triggered">${A.triggered}</span>`:s}
                  </div>
                `:s}
            ${L?a`
                  <ha-icon-button
                    class="hdr-add"
                    title="${V("new_object",e)}"
                    @click=${()=>C7()}
                  >
                    <ha-icon icon="mdi:plus-box"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button
                    class="hdr-add"
                    title="${V("add_task",e)}"
                    @click=${()=>r7("",this._objects)}
                  >
                    <ha-icon icon="mdi:playlist-plus"></ha-icon>
                  </ha-icon-button>
                `:s}
          </div>
        </div>
        ${this._firstLoadDone?m.length===0?this._objects.some(x=>x.tasks.length>0)?a`<div class="empty-card">
                <!-- (#86) tasks exist but none match the filter (default:
                     actionable-only) — "all caught up", NOT "no tasks yet". -->
                <div class="all-caught-up">✓ ${V("card_all_caught_up",e)}</div>
              </div>`:a`<div class="empty-card">
                <div>${V("card_no_tasks_title",e)}</div>
                <a class="empty-link" href="/maintenance-supporter">${V("card_no_tasks_cta",e)}</a>
              </div>`:a`
              <div class="task-list ${M?"compact":""}">
                ${m.map(({entry_id:x,object_name:y,task:_})=>a`
                    <div class="task-item clickable"
                         @click=${()=>this._openTaskDetail(x,_.id)}
                         title="${V("open_task",e)}">
                      <div class="status-dot" style="background: ${O2(_)}"></div>
                      <div class="task-info">
                        <div class="task-name">
                          ${M&&this._assigneeName(_)?a`<span class="compact-assignee" title="${this._assigneeName(_)}">${this._assigneeAvatars(_)}</span>`:s}${_.name}${E4(_.next_event_titles)}${P4(_.trigger_detail)}
                          ${_.due_override?a`<ha-icon
                                class="postponed-icon"
                                icon="mdi:calendar-clock"
                                title="${V("postponed",e)}"
                              ></ha-icon>`:s}
                        </div>
                        ${M?s:a`<div class="task-meta">
                              ${y} · ${V(_.type,e)}${j1(_)?a` · ${j1(_)}`:s}${this._assigneeName(_)?a` · <span class="assignee"
                                    >${this._assigneeAvatars(_)}${this._assigneeName(_)}</span
                                  >`:s}
                            </div>`}
                      </div>
                      ${this._renderDocChips(x,_)}
                      <div class="task-due">
                        ${_.days_until_due!==null&&_.days_until_due!==void 0?_.days_until_due<0?a`<span class="overdue-text">${u2(_.days_until_due,e)}</span>`:u2(_.days_until_due,e):_.trigger_active?"\u26A1":M9(_.last_performed,e)??"\u2014"}
                      </div>
                      ${o&&R5(_)?a`<span class="inert-label">${V(_.enabled===!1?"disabled":"paused",e)}</span>`:o&&i?a`
                            <ha-button
                              size="small"
                              appearance="accent"
                              variant="success"
                              class="complete-btn-text"
                              title="${e1(_)?V("qr_action_quick_complete",e):V("complete",e)}"
                              @click=${b=>{b.stopPropagation(),this._openComplete(x,_)}}
                            >
                              <ha-icon slot="start" icon="mdi:check"></ha-icon>${V("complete",e)}
                            </ha-button>
                          `:o?a`
                            <ha-icon-button
                              class="complete-btn${e1(_)?" quick":""}"
                              title="${e1(_)?V("qr_action_quick_complete",e):V("complete",e)}"
                              @click=${b=>{b.stopPropagation(),this._openComplete(x,_)}}
                            >
                              <!-- #233: an open circle to tick off; a check read as done already -->
                              <ha-icon icon=${e1(_)?"mdi:checkbox-blank-circle-outline":"mdi:check"}></ha-icon>
                            </ha-icon-button>
                          `:s}
                    </div>
                  `)}
              </div>
            `:a`<div class="card-loading">${V("loading",e)}</div>`}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `}};K.styles=[U5,g`
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
    `],n([u({attribute:!1})],K.prototype,"hass",2),n([l()],K.prototype,"_config",2),n([l()],K.prototype,"_globalRowStyle",2),n([l()],K.prototype,"_settings",2),n([l()],K.prototype,"_firstLoadDone",2),n([l()],K.prototype,"_objects",2),n([l()],K.prototype,"_stats",2),n([l()],K.prototype,"_unsub",2),n([l()],K.prototype,"_viewFilters",2),n([l()],K.prototype,"_userNames",2),n([l()],K.prototype,"_taskDocs",2);customElements.get("maintenance-supporter-card")||customElements.define("maintenance-supporter-card",K);f2({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});J5();w4(["maintenance-supporter-card","maintenance-battery-fleet-card","maintenance-supporter-panel-card"],import.meta.url);export{K as MaintenanceSupporterCard};
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
