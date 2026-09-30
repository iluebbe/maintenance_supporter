/*! maintenance_supporter frontend 2.95.0 */
var vs=Object.defineProperty;var Gn=Object.getOwnPropertyDescriptor;var y=(r,s,e)=>()=>{if(e)throw e[0];try{return r&&(s=r(r=0)),s}catch(t){throw e=[t],t}};var Kn=(r,s)=>{for(var e in s)vs(r,e,{get:s[e],enumerable:!0})};var c=(r,s,e,t)=>{for(var i=t>1?void 0:t?Gn(s,e):s,a=r.length-1,o;a>=0;a--)(o=r[a])&&(i=(t?o(s,e,i):o(i))||i);return t&&i&&vs(s,e,i),i};var Ct,Rt,ui,bs,st,ys,$,xs,hi,_i=y(()=>{Ct=globalThis,Rt=Ct.ShadowRoot&&(Ct.ShadyCSS===void 0||Ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ui=Symbol(),bs=new WeakMap,st=class{constructor(s,e,t){if(this._$cssResult$=!0,t!==ui)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=s,this.t=e}get styleSheet(){let s=this.o,e=this.t;if(Rt&&s===void 0){let t=e!==void 0&&e.length===1;t&&(s=bs.get(e)),s===void 0&&((this.o=s=new CSSStyleSheet).replaceSync(this.cssText),t&&bs.set(e,s))}return s}toString(){return this.cssText}},ys=r=>new st(typeof r=="string"?r:r+"",void 0,ui),$=(r,...s)=>{let e=r.length===1?r[0]:s.reduce((t,i,a)=>t+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[a+1],r[0]);return new st(e,r,ui)},xs=(r,s)=>{if(Rt)r.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of s){let t=document.createElement("style"),i=Ct.litNonce;i!==void 0&&t.setAttribute("nonce",i),t.textContent=e.cssText,r.appendChild(t)}},hi=Rt?r=>r:r=>r instanceof CSSStyleSheet?(s=>{let e="";for(let t of s.cssRules)e+=t.cssText;return ys(e)})(r):r});var Yn,Qn,Jn,Zn,Xn,ea,It,ws,ta,ia,rt,nt,Pt,ks,ne,at=y(()=>{_i();_i();({is:Yn,defineProperty:Qn,getOwnPropertyDescriptor:Jn,getOwnPropertyNames:Zn,getOwnPropertySymbols:Xn,getPrototypeOf:ea}=Object),It=globalThis,ws=It.trustedTypes,ta=ws?ws.emptyScript:"",ia=It.reactiveElementPolyfillSupport,rt=(r,s)=>r,nt={toAttribute(r,s){switch(s){case Boolean:r=r?ta:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,s){let e=r;switch(s){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},Pt=(r,s)=>!Yn(r,s),ks={attribute:!0,type:String,converter:nt,reflect:!1,useDefault:!1,hasChanged:Pt};Symbol.metadata??=Symbol("metadata"),It.litPropertyMetadata??=new WeakMap;ne=class extends HTMLElement{static addInitializer(s){this._$Ei(),(this.l??=[]).push(s)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(s,e=ks){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(s)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(s,e),!e.noAccessor){let t=Symbol(),i=this.getPropertyDescriptor(s,t,e);i!==void 0&&Qn(this.prototype,s,i)}}static getPropertyDescriptor(s,e,t){let{get:i,set:a}=Jn(this.prototype,s)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let d=i?.call(this);a?.call(this,o),this.requestUpdate(s,d,t)},configurable:!0,enumerable:!0}}static getPropertyOptions(s){return this.elementProperties.get(s)??ks}static _$Ei(){if(this.hasOwnProperty(rt("elementProperties")))return;let s=ea(this);s.finalize(),s.l!==void 0&&(this.l=[...s.l]),this.elementProperties=new Map(s.elementProperties)}static finalize(){if(this.hasOwnProperty(rt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(rt("properties"))){let e=this.properties,t=[...Zn(e),...Xn(e)];for(let i of t)this.createProperty(i,e[i])}let s=this[Symbol.metadata];if(s!==null){let e=litPropertyMetadata.get(s);if(e!==void 0)for(let[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(let[e,t]of this.elementProperties){let i=this._$Eu(e,t);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(s){let e=[];if(Array.isArray(s)){let t=new Set(s.flat(1/0).reverse());for(let i of t)e.unshift(hi(i))}else s!==void 0&&e.push(hi(s));return e}static _$Eu(s,e){let t=e.attribute;return t===!1?void 0:typeof t=="string"?t:typeof s=="string"?s.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(s=>this.enableUpdating=s),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(s=>s(this))}addController(s){(this._$EO??=new Set).add(s),this.renderRoot!==void 0&&this.isConnected&&s.hostConnected?.()}removeController(s){this._$EO?.delete(s)}_$E_(){let s=new Map,e=this.constructor.elementProperties;for(let t of e.keys())this.hasOwnProperty(t)&&(s.set(t,this[t]),delete this[t]);s.size>0&&(this._$Ep=s)}createRenderRoot(){let s=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xs(s,this.constructor.elementStyles),s}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(s=>s.hostConnected?.())}enableUpdating(s){}disconnectedCallback(){this._$EO?.forEach(s=>s.hostDisconnected?.())}attributeChangedCallback(s,e,t){this._$AK(s,t)}_$ET(s,e){let t=this.constructor.elementProperties.get(s),i=this.constructor._$Eu(s,t);if(i!==void 0&&t.reflect===!0){let a=(t.converter?.toAttribute!==void 0?t.converter:nt).toAttribute(e,t.type);this._$Em=s,a==null?this.removeAttribute(i):this.setAttribute(i,a),this._$Em=null}}_$AK(s,e){let t=this.constructor,i=t._$Eh.get(s);if(i!==void 0&&this._$Em!==i){let a=t.getPropertyOptions(i),o=typeof a.converter=="function"?{fromAttribute:a.converter}:a.converter?.fromAttribute!==void 0?a.converter:nt;this._$Em=i;let d=o.fromAttribute(e,a.type);this[i]=d??this._$Ej?.get(i)??d,this._$Em=null}}requestUpdate(s,e,t,i=!1,a){if(s!==void 0){let o=this.constructor;if(i===!1&&(a=this[s]),t??=o.getPropertyOptions(s),!((t.hasChanged??Pt)(a,e)||t.useDefault&&t.reflect&&a===this._$Ej?.get(s)&&!this.hasAttribute(o._$Eu(s,t))))return;this.C(s,e,t)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(s,e,{useDefault:t,reflect:i,wrapped:a},o){t&&!(this._$Ej??=new Map).has(s)&&(this._$Ej.set(s,o??e??this[s]),a!==!0||o!==void 0)||(this._$AL.has(s)||(this.hasUpdated||t||(e=void 0),this._$AL.set(s,e)),i===!0&&this._$Em!==s&&(this._$Eq??=new Set).add(s))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}let s=this.scheduleUpdate();return s!=null&&await s,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(let[i,a]of this._$Ep)this[i]=a;this._$Ep=void 0}let t=this.constructor.elementProperties;if(t.size>0)for(let[i,a]of t){let{wrapped:o}=a,d=this[i];o!==!0||this._$AL.has(i)||d===void 0||this.C(i,void 0,a,d)}}let s=!1,e=this._$AL;try{s=this.shouldUpdate(e),s?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(t){throw s=!1,this._$EM(),t}s&&this._$AE(e)}willUpdate(s){}_$AE(s){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(s)),this.updated(s)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(s){return!0}update(s){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(s){}firstUpdated(s){}};ne.elementStyles=[],ne.shadowRootOptions={mode:"open"},ne[rt("elementProperties")]=new Map,ne[rt("finalized")]=new Map,ia?.({ReactiveElement:ne}),(It.reactiveElementVersions??=[]).push("2.1.2")});function Ns(r,s){if(!wi(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Es!==void 0?Es.createHTML(s):s}function Ne(r,s,e=r,t){if(s===Ee)return s;let i=t!==void 0?e._$Co?.[t]:e._$Cl,a=ct(s)?void 0:s._$litDirective$;return i?.constructor!==a&&(i?._$AO?.(!1),a===void 0?i=void 0:(i=new a(r),i._$AT(r,e,t)),t!==void 0?(e._$Co??=[])[t]=i:e._$Cl=i),i!==void 0&&(s=Ne(r,i._$AS(r,s.values),i,t)),s}var xi,$s,Lt,Es,Is,_e,Ps,sa,$e,lt,ct,wi,ra,mi,ot,Ss,Ts,we,As,Cs,Ls,ki,l,Oe,Zo,Ee,p,Rs,ke,na,dt,gi,pt,je,fi,vi,bi,yi,aa,js,Nt=y(()=>{xi=globalThis,$s=r=>r,Lt=xi.trustedTypes,Es=Lt?Lt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Is="$lit$",_e=`lit$${Math.random().toFixed(9).slice(2)}$`,Ps="?"+_e,sa=`<${Ps}>`,$e=document,lt=()=>$e.createComment(""),ct=r=>r===null||typeof r!="object"&&typeof r!="function",wi=Array.isArray,ra=r=>wi(r)||typeof r?.[Symbol.iterator]=="function",mi=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ss=/-->/g,Ts=/>/g,we=RegExp(`>|${mi}(?:([^\\s"'>=/]+)(${mi}*=${mi}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),As=/'/g,Cs=/"/g,Ls=/^(?:script|style|textarea|title)$/i,ki=r=>(s,...e)=>({_$litType$:r,strings:s,values:e}),l=ki(1),Oe=ki(2),Zo=ki(3),Ee=Symbol.for("lit-noChange"),p=Symbol.for("lit-nothing"),Rs=new WeakMap,ke=$e.createTreeWalker($e,129);na=(r,s)=>{let e=r.length-1,t=[],i,a=s===2?"<svg>":s===3?"<math>":"",o=ot;for(let d=0;d<e;d++){let h=r[d],_,m,b=-1,k=0;for(;k<h.length&&(o.lastIndex=k,m=o.exec(h),m!==null);)k=o.lastIndex,o===ot?m[1]==="!--"?o=Ss:m[1]!==void 0?o=Ts:m[2]!==void 0?(Ls.test(m[2])&&(i=RegExp("</"+m[2],"g")),o=we):m[3]!==void 0&&(o=we):o===we?m[0]===">"?(o=i??ot,b=-1):m[1]===void 0?b=-2:(b=o.lastIndex-m[2].length,_=m[1],o=m[3]===void 0?we:m[3]==='"'?Cs:As):o===Cs||o===As?o=we:o===Ss||o===Ts?o=ot:(o=we,i=void 0);let w=o===we&&r[d+1].startsWith("/>")?" ":"";a+=o===ot?h+sa:b>=0?(t.push(_),h.slice(0,b)+Is+h.slice(b)+_e+w):h+_e+(b===-2?d:w)}return[Ns(r,a+(r[e]||"<?>")+(s===2?"</svg>":s===3?"</math>":"")),t]},dt=class r{constructor({strings:s,_$litType$:e},t){let i;this.parts=[];let a=0,o=0,d=s.length-1,h=this.parts,[_,m]=na(s,e);if(this.el=r.createElement(_,t),ke.currentNode=this.el.content,e===2||e===3){let b=this.el.content.firstChild;b.replaceWith(...b.childNodes)}for(;(i=ke.nextNode())!==null&&h.length<d;){if(i.nodeType===1){if(i.hasAttributes())for(let b of i.getAttributeNames())if(b.endsWith(Is)){let k=m[o++],w=i.getAttribute(b).split(_e),v=/([.?@])?(.*)/.exec(k);h.push({type:1,index:a,name:v[2],strings:w,ctor:v[1]==="."?fi:v[1]==="?"?vi:v[1]==="@"?bi:je}),i.removeAttribute(b)}else b.startsWith(_e)&&(h.push({type:6,index:a}),i.removeAttribute(b));if(Ls.test(i.tagName)){let b=i.textContent.split(_e),k=b.length-1;if(k>0){i.textContent=Lt?Lt.emptyScript:"";for(let w=0;w<k;w++)i.append(b[w],lt()),ke.nextNode(),h.push({type:2,index:++a});i.append(b[k],lt())}}}else if(i.nodeType===8)if(i.data===Ps)h.push({type:2,index:a});else{let b=-1;for(;(b=i.data.indexOf(_e,b+1))!==-1;)h.push({type:7,index:a}),b+=_e.length-1}a++}}static createElement(s,e){let t=$e.createElement("template");return t.innerHTML=s,t}};gi=class{constructor(s,e){this._$AV=[],this._$AN=void 0,this._$AD=s,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(s){let{el:{content:e},parts:t}=this._$AD,i=(s?.creationScope??$e).importNode(e,!0);ke.currentNode=i;let a=ke.nextNode(),o=0,d=0,h=t[0];for(;h!==void 0;){if(o===h.index){let _;h.type===2?_=new pt(a,a.nextSibling,this,s):h.type===1?_=new h.ctor(a,h.name,h.strings,this,s):h.type===6&&(_=new yi(a,this,s)),this._$AV.push(_),h=t[++d]}o!==h?.index&&(a=ke.nextNode(),o++)}return ke.currentNode=$e,i}p(s){let e=0;for(let t of this._$AV)t!==void 0&&(t.strings!==void 0?(t._$AI(s,t,e),e+=t.strings.length-2):t._$AI(s[e])),e++}},pt=class r{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(s,e,t,i){this.type=2,this._$AH=p,this._$AN=void 0,this._$AA=s,this._$AB=e,this._$AM=t,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let s=this._$AA.parentNode,e=this._$AM;return e!==void 0&&s?.nodeType===11&&(s=e.parentNode),s}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(s,e=this){s=Ne(this,s,e),ct(s)?s===p||s==null||s===""?(this._$AH!==p&&this._$AR(),this._$AH=p):s!==this._$AH&&s!==Ee&&this._(s):s._$litType$!==void 0?this.$(s):s.nodeType!==void 0?this.T(s):ra(s)?this.k(s):this._(s)}O(s){return this._$AA.parentNode.insertBefore(s,this._$AB)}T(s){this._$AH!==s&&(this._$AR(),this._$AH=this.O(s))}_(s){this._$AH!==p&&ct(this._$AH)?this._$AA.nextSibling.data=s:this.T($e.createTextNode(s)),this._$AH=s}$(s){let{values:e,_$litType$:t}=s,i=typeof t=="number"?this._$AC(s):(t.el===void 0&&(t.el=dt.createElement(Ns(t.h,t.h[0]),this.options)),t);if(this._$AH?._$AD===i)this._$AH.p(e);else{let a=new gi(i,this),o=a.u(this.options);a.p(e),this.T(o),this._$AH=a}}_$AC(s){let e=Rs.get(s.strings);return e===void 0&&Rs.set(s.strings,e=new dt(s)),e}k(s){wi(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,t,i=0;for(let a of s)i===e.length?e.push(t=new r(this.O(lt()),this.O(lt()),this,this.options)):t=e[i],t._$AI(a),i++;i<e.length&&(this._$AR(t&&t._$AB.nextSibling,i),e.length=i)}_$AR(s=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);s!==this._$AB;){let t=$s(s).nextSibling;$s(s).remove(),s=t}}setConnected(s){this._$AM===void 0&&(this._$Cv=s,this._$AP?.(s))}},je=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(s,e,t,i,a){this.type=1,this._$AH=p,this._$AN=void 0,this.element=s,this.name=e,this._$AM=i,this.options=a,t.length>2||t[0]!==""||t[1]!==""?(this._$AH=Array(t.length-1).fill(new String),this.strings=t):this._$AH=p}_$AI(s,e=this,t,i){let a=this.strings,o=!1;if(a===void 0)s=Ne(this,s,e,0),o=!ct(s)||s!==this._$AH&&s!==Ee,o&&(this._$AH=s);else{let d=s,h,_;for(s=a[0],h=0;h<a.length-1;h++)_=Ne(this,d[t+h],e,h),_===Ee&&(_=this._$AH[h]),o||=!ct(_)||_!==this._$AH[h],_===p?s=p:s!==p&&(s+=(_??"")+a[h+1]),this._$AH[h]=_}o&&!i&&this.j(s)}j(s){s===p?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,s??"")}},fi=class extends je{constructor(){super(...arguments),this.type=3}j(s){this.element[this.name]=s===p?void 0:s}},vi=class extends je{constructor(){super(...arguments),this.type=4}j(s){this.element.toggleAttribute(this.name,!!s&&s!==p)}},bi=class extends je{constructor(s,e,t,i,a){super(s,e,t,i,a),this.type=5}_$AI(s,e=this){if((s=Ne(this,s,e,0)??p)===Ee)return;let t=this._$AH,i=s===p&&t!==p||s.capture!==t.capture||s.once!==t.once||s.passive!==t.passive,a=s!==p&&(t===p||i);i&&this.element.removeEventListener(this.name,this,t),a&&this.element.addEventListener(this.name,this,s),this._$AH=s}handleEvent(s){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,s):this._$AH.handleEvent(s)}},yi=class{constructor(s,e,t){this.element=s,this.type=6,this._$AN=void 0,this._$AM=e,this.options=t}get _$AU(){return this._$AM._$AU}_$AI(s){Ne(this,s)}},aa=xi.litHtmlPolyfillSupport;aa?.(dt,pt),(xi.litHtmlVersions??=[]).push("3.3.2");js=(r,s,e)=>{let t=e?.renderBefore??s,i=t._$litPart$;if(i===void 0){let a=e?.renderBefore??null;t._$litPart$=i=new pt(s.insertBefore(lt(),a),a,void 0,e??{})}return i._$AI(r),i}});var $i,S,oa,Os=y(()=>{at();at();Nt();Nt();$i=globalThis,S=class extends ne{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){let s=super.createRenderRoot();return this.renderOptions.renderBefore??=s.firstChild,s}update(s){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(s),this._$Do=js(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Ee}};S._$litElement$=!0,S.finalized=!0,$i.litElementHydrateSupport?.({LitElement:S});oa=$i.litElementPolyfillSupport;oa?.({LitElement:S});($i.litElementVersions??=[]).push("4.2.2")});var Hs=y(()=>{});var C=y(()=>{at();Nt();Os();Hs()});var Ds=y(()=>{});function f(r){return(s,e)=>typeof e=="object"?ma(r,s,e):((t,i,a)=>{let o=i.hasOwnProperty(a);return i.constructor.createProperty(a,t),o?Object.getOwnPropertyDescriptor(i,a):void 0})(r,s,e)}var _a,ma,Si=y(()=>{at();_a={attribute:!0,type:String,converter:nt,reflect:!1,hasChanged:Pt},ma=(r=_a,s,e)=>{let{kind:t,metadata:i}=e,a=globalThis.litPropertyMetadata.get(i);if(a===void 0&&globalThis.litPropertyMetadata.set(i,a=new Map),t==="setter"&&((r=Object.create(r)).wrapped=!0),a.set(e.name,r),t==="accessor"){let{name:o}=e;return{set(d){let h=s.get.call(this);s.set.call(this,d),this.requestUpdate(o,h,r,!0,d)},init(d){return d!==void 0&&this.C(o,void 0,r,d),d}}}if(t==="setter"){let{name:o}=e;return function(d){let h=this[o];s.call(this,d),this.requestUpdate(o,h,r,!0,d)}}throw Error("Unsupported decorator location: "+t)}});function u(r){return f({...r,state:!0,attribute:!1})}var Ms=y(()=>{Si();});var zs=y(()=>{});var He=y(()=>{});var Fs=y(()=>{He();});var Us=y(()=>{He();});var Bs=y(()=>{He();});var Ws=y(()=>{He();});var Vs=y(()=>{He();});var H=y(()=>{Ds();Si();Ms();zs();Fs();Us();Bs();Ws();Vs()});var Ks,Gs=y(()=>{Ks={maintenance:"Maintenance",objects:"Objects",tasks:"Tasks",overdue:"Overdue",due_soon:"Due Soon",triggered:"Triggered",trigger_replaced:"Trigger replaced",trigger_removed:"Trigger removed",ok:"OK",all:"All",new_object:"+ New Object",templates_from:"From template",templates_title:"Start from a template",templates_task_count:"{n} tasks",templates_task_count_one:"1 task",template_created:"Created from template",onboard_hint:"Add your first object to start tracking maintenance.",edit:"Edit",duplicate:"Duplicate",task_duplicated:"Task duplicated",task_moved:"Task moved",move_task_target:"Target object",move_task_message:"Choose the object this task should belong to. Its history, readings and trigger state move with it; it gets a new reference number and its entities are recreated under the new object. Linked documents stay with the current object.",bulk_move_message:"Choose the object the selected tasks should belong to. Tasks that already live there are skipped; history, readings and trigger state move along.",bulk_moved:"{n} tasks moved",more_actions:"More actions",move_task_title:"Move task",move_task:"Move to another object\u2026",object_duplicated:"Object duplicated",delete:"Delete",add_task:"+ Add Task",complete:"Complete",completed:"Completed",skip:"Skip",skipped:"Skipped",missed:"Missed",reset:"Reset",snooze:"Snooze",snoozed:"Snoozed",cancel:"Cancel",bulk_select:"Select",bulk_select_all:"Select all",bulk_n_selected:"{n} selected",bulk_completed:"{n} tasks completed",bulk_archived:"{n} tasks archived",bulk_delete_objects_confirm:"Delete {n} objects and all their tasks? Archiving keeps their history instead.",bulk_objects_deleted:"{n} objects deleted",bulk_objects_archived:"{n} objects archived",bulk_failed:"{n} failed: {reason}",completing:"Completing\u2026",interval:"Interval",warning:"Warning",last_performed:"Last performed",next_due:"Next due",days_until_due:"Days until due",avg_duration:"Avg duration",trigger:"Trigger",trigger_type:"Trigger type",threshold_above:"Upper limit",threshold_below:"Lower limit",threshold:"Threshold",counter:"Counter",state_change:"State change",runtime:"Runtime",runtime_hours:"Target runtime (hours)",target_value:"Target value",target_changes:"Target changes",for_minutes:"For (minutes)",time_based:"Time-based",sensor_based:"Sensor-based",manual:"Manual",one_time:"One-time",weekdays:"Weekdays",nth_weekday:"Nth weekday of month",day_of_month:"Day of month",calendar:"Calendar entity",calendar_entity_label:"Calendar",calendar_entity_hint:"Due once per event of this calendar, on the event's start date \u2014 the next event after the last completion.",calendar_entity_required:"Choose a calendar entity.",recurrence_on_days:"Repeat on",recurrence_occurrence:"Occurrence",recurrence_weekday:"Weekday",recurrence_day:"Day of month (1\u201331)",recurrence_last_day:"Last day of the month",recurrence_business_day:"Business days only (roll back from weekend)",recurrence_offset:"Offset (days, \xB1)",recurrence_offset_help:"Shift the date by \xB1N days, e.g. -2 = two days before.",last_day_month:"Last day of month",last_business_day_month:"Last business day",ord_1:"1st",ord_2:"2nd",ord_3:"3rd",ord_4:"4th",ord_5:"5th",ord_last:"Last",day_word:"Day",interval_value:"Interval",interval_unit:"Unit",unit_days:"Days",unit_weeks:"Weeks",unit_months:"Months",unit_years:"Years",due_date:"Due date",cleaning:"Cleaning",inspection:"Inspection",replacement:"Replacement",calibration:"Calibration",service:"Service",reading:"Reading",custom:"Custom",history:"History",cost:"Cost",report_button:"Report",report_title:"Maintenance report",report_generated:"Generated",report_times_done:"Done",report_total_cost:"Total cost",report_notes:"Notes",report_col_type:"Type",report_col_status:"Status",report_col_schedule:"Schedule",duration:"Duration",minutes_short:"min",both:"Both",trigger_val:"Trigger value",complete_title:"Complete: ",checklist:"Checklist",require_on_completion:"Require on completion",checklist_steps_optional:"Checklist steps (optional)",checklist_placeholder:`Clean filter
Replace seal
Test pressure`,checklist_help:"One step per line. Max 100 items.",err_too_long:"{field}: too long (max {n} characters)",err_too_short:"{field}: too short (min {n} characters)",err_value_too_high:"{field}: too large (max {n})",err_value_too_low:"{field}: too small (min {n})",err_required:"{field}: required",err_wrong_type:"{field}: wrong type (expected: {type})",err_invalid_choice:"{field}: not an allowed value",err_invalid_value:"{field}: invalid value",ws_err_not_found:"Not found \u2014 it may have been deleted meanwhile",ws_err_invalid_input:"Invalid input",ws_err_invalid_date:"Invalid date",ws_err_invalid_format:"Invalid format",ws_err_invalid_url:"Invalid link",ws_err_invalid_mirror_todo:"Invalid to-do list",ws_err_not_configured:"Not set up yet",ws_err_not_loaded:"Not loaded yet \u2014 try again in a moment",ws_err_limit_reached:"Limit reached",ws_err_too_many:"Too many entries",ws_err_too_large:"Too large",ws_err_not_archived:"Not archived",ws_err_invalid_target:"Invalid target",ws_err_create_failed:"Could not be created",ws_err_archived:"Archived \u2014 restore it first",ws_err_already_archived:"Already archived",ws_err_unavailable:"Currently unavailable",ws_err_unauthorized:"Not permitted for your user",ws_err_too_many_views:"Too many saved views",ws_err_storage_unavailable:"Storage is not available",ws_err_replace_failed:"Replacement failed",ws_err_not_paused:"Not paused",ws_err_not_available:"Nothing available",ws_err_no_url:"No link given",ws_err_no_phases:"This task has no phases",ws_err_invalid_view:"Invalid view",ws_err_invalid_user:"Unknown user",ws_err_invalid_range:"Invalid range",ws_err_invalid_parent:"Invalid parent object",ws_err_invalid_device:"Unknown device",ws_err_empty_csv:"The CSV file is empty",ws_err_empty:"Nothing to import",ws_err_duplicate_failed:"Could not duplicate",ws_err_already_paused:"Already paused",ws_err_invalid_cursor:"Invalid phase position",ws_err_invalid_entity_slug:"Invalid entity name",ws_err_invalid_trigger_config:"Invalid trigger configuration",ws_err_no_defaults:"No quick-complete defaults set",ws_err_self_link_device:"An object cannot be linked to itself",ws_err_too_early:"Too early \u2014 this task can only be completed closer to its due date",ws_err_invalid_search_template:"The search link must be an http(s) URL containing {q}",ws_err_invalid_icon:"The notification icon must be an mdi: name, e.g. mdi:air-filter",feat_schedule_time:"Time-of-day scheduling",feat_schedule_time_desc:"Tasks become overdue at a specific time of day instead of midnight.",schedule_time_toggle:"Due at a specific time",schedule_time_help:"Empty = midnight (default). HA timezone.",at_time:"at",notes_optional:"Notes (optional)",notes_markdown_hint:"Markdown is supported \u2014 **bold**, lists, [links](\u2026)",cost_optional:"Cost (optional)",duration_minutes:"Duration in minutes (optional)",completed_at_optional:"Completed at (optional, empty = now)",completed_at_pick:"Set date & time",completed_at_future_error:"The completion date cannot be in the future.",days:"days",day:"day",today:"Today",d_overdue:"d overdue",no_tasks:"No maintenance tasks yet. Create an object to get started.",no_tasks_short:"No tasks",no_history:"No history entries yet.",show_all:"Show all",cost_duration_chart:"Cost & Duration",installed:"Installed",min:"Min",max:"Max",save:"Save",saving:"Saving\u2026",edit_task:"Edit Task",new_task:"New Maintenance Task",task_name:"Task name",maintenance_type:"Maintenance type",priority:"Priority",labels:"Labels",labels_placeholder:"e.g. safety, seasonal, tenant-visible",labels_help:"Comma-separated tags for filtering and reporting.",task_mirror_todo:"Mirror into to-do lists",task_mirror_todo_hint:"The task appears in these lists while it is due; checking it off there completes it here.",priority_low:"Low",priority_normal:"Normal",priority_high:"High",all_priorities:"All priorities",schedule_type:"Schedule type",interval_days:"Interval (days)",warning_days:"Warning days",earliest_completion_days:"Earliest completion (days before due)",earliest_completion_days_help:"Leave empty to allow completing any time. 0 = only on/after the due date.",last_performed_optional:"Last performed (optional)",interval_anchor:"Interval anchor",anchor_completion:"From completion date",anchor_planned:"From planned date (no drift)",edit_object:"Edit Object",name:"Name",manufacturer_optional:"Manufacturer (optional)",model_optional:"Model (optional)",serial_number_optional:"Serial number (optional)",serial_number_label:"S/N",object_replaces:"Replaces",object_replaced_by:"Replaced by",documentation_url_label:"Manual",object_notes_label:"Notes",sort_due_date:"Due date",sort_object:"Object name",sort_type:"Type",sort_task_name:"Task name",all_objects:"All objects",all_parts:"All parts",all_areas:"All areas",areas_filter:"Filter areas\u2026",areas_filter_none:"No area matches the filter.",area_cost_year:"Cost {year}",area_object_count:"{n} objects",area_object_count_one:"1 object",area_range_12m:"Last 12 months",area_range_all:"All time",area_task_filter:"Filter by task\u2026",area_kpi_completions:"Completions",area_kpi_total_time:"Total time",area_cost_per_month:"Cost per month",area_cost_per_year:"Cost per year",area_cost_per_object:"Cost per object",area_cost_share:"Share",area_history_section:"History (all objects)",area_report_print:"Area report (PDF)",area_report_title:"Area report",area_report_period:"Period",area_no_costs:"No costs recorded in this period.",no_tasks_yet:"No tasks yet",add_first_task:"Add first task",trigger_configuration:"Trigger Configuration",entity_id:"Entity ID",comma_separated:"comma-separated",entity_logic:"Entity logic",entity_logic_any:"Any entity triggers",entity_logic_all:"All entities must trigger",entities:"entities",attribute_optional:"Attribute (optional, blank = state)",use_entity_state:"Use entity state (no attribute)",trigger_above:"Trigger above",trigger_below:"Trigger below",trigger_equals:"Trigger when equal to (=)",trigger_not_equals:"Trigger when different from (\u2260)",for_at_least_minutes:"For at least (minutes)",safety_interval:"Safety interval (optional)",trigger_combinator:"Combine trigger and interval",trigger_combinator_any:"Trigger or interval (whichever first)",trigger_combinator_all:"Trigger and interval (both required)",delta_mode:"Delta mode",from_state_optional:"From state (optional)",to_state_optional:"To state (optional)",documentation_url_optional:"Documentation URL (optional)",object_notes_optional:"Notes (optional)",nfc_tag_id_optional:"NFC Tag ID (optional)",nfc_tags_empty_help:"No NFC tags registered in Home Assistant yet.",nfc_tags_open_settings:"Open Tags settings",nfc_tags_refresh:"Refresh",environmental_entity_optional:"Environmental sensor (optional)",environmental_entity_helper:"e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",adaptive_prediction_enabled:"Enable sensor-driven predictions",adaptive_seasonal_enabled:"Enable seasonal awareness",adaptive_max_interval:"Maximum interval (days)",adaptive_min_interval:"Minimum interval (days)",adaptive_ewa_alpha:"Learning rate (alpha)",adaptive_enabled:"Enable adaptive scheduling",adaptive_section_title:"Adaptive Scheduling",environmental_attribute_optional:"Environmental attribute (optional)",nfc_tag_id:"NFC Tag ID",nfc_linked:"NFC tag linked",nfc_link_hint:"Click to link NFC tag",responsible_user:"Responsible User",shared_with:"Shared with (rotation)",shared_with_help:"Pick multiple people to share this task; the responsible person rotates on each completion.",rotation_strategy:"Rotation",rotation_none:"No rotation",rotation_round_robin:"Round-robin",rotation_least_completed:"Least completed",rotation_random:"Random",no_user_assigned:"(No user assigned)",all_users:"All Users",my_tasks:"My Tasks",tab_calendar:"Calendar",cal_no_events:"No maintenance",cal_every_n_days:"every {n} days",cal_every_day:"every day",cal_source_time:"Time-based",cal_source_time_adaptive:"Time-based (adaptive)",cal_source_sensor:"Sensor-based",cal_predicted:"predicted",cal_confidence_high:"high confidence",cal_confidence_medium:"medium confidence",cal_confidence_low:"low confidence",budget_monthly:"Monthly budget",budget_yearly:"Yearly budget",groups:"Groups",new_group:"New group",edit_group:"Edit group",no_groups:"No groups yet",delete_group:"Delete group",delete_group_confirm:"Delete group '{name}'?",group_select_tasks:"Select tasks",group_name_required:"Name is required",description_optional:"Description (optional)",selected:"Selected",loading_chart:"Loading chart data...",hide_outliers:"Hide outliers (sensor glitches)",was_maintenance_needed:"Was this maintenance needed?",feedback_needed:"Needed",feedback_not_needed:"Not needed",feedback_not_sure:"Not sure",suggested_interval:"Suggested interval",apply_suggestion:"Apply",reanalyze:"Re-analyze",reanalyze_result:"New analysis",reanalyze_insufficient_data:"Not enough data to produce a recommendation",data_points:"data points",dismiss_suggestion:"Dismiss",confidence_low:"Low",confidence_medium:"Medium",confidence_high:"High",recommended:"recommended",seasonal_awareness:"Seasonal Awareness",edit_seasonal_overrides:"Edit seasonal factors",seasonal_overrides_title:"Seasonal factors (override)",seasonal_overrides_hint:"Factor per month (0.1\u20135.0). Empty = learned automatically.",seasonal_override_invalid:"Invalid value",seasonal_override_range:"Factor must be between 0.1 and 5.0",clear_all:"Clear all",clear:"Clear",date_type_toggle:"Type the date",date_type_invalid:"Not a valid date \u2014 try 1978-03-15, a year like 1978, or your own date format",seasonal_chart_title:"Seasonal Factors",seasonal_learned:"Learned",seasonal_manual:"Manual",month_jan:"Jan",month_feb:"Feb",month_mar:"Mar",month_apr:"Apr",month_may:"May",month_jun:"Jun",month_jul:"Jul",month_aug:"Aug",month_sep:"Sep",month_oct:"Oct",month_nov:"Nov",month_dec:"Dec",sensor_prediction:"Sensor Prediction",degradation_trend:"Trend",trend_rising:"Rising",trend_falling:"Falling",trend_stable:"Stable",trend_insufficient_data:"Insufficient data",days_until_threshold:"Days until threshold",threshold_exceeded:"Threshold exceeded",environmental_adjustment:"Environmental factor",sensor_prediction_urgency:"Sensor predicts threshold in ~{days} days",day_short:"day",weibull_reliability_curve:"Reliability Curve",weibull_failure_probability:"Failure Probability",weibull_r_squared:"Fit R\xB2",beta_early_failures:"Early Failures",beta_random_failures:"Random Failures",beta_wear_out:"Wear-out",beta_highly_predictable:"Highly Predictable",confidence_interval:"Confidence Interval",confidence_conservative:"Conservative",confidence_aggressive:"Optimistic",current_interval_marker:"Current interval",recommended_marker:"Recommended",characteristic_life:"Characteristic life",chart_mini_sparkline:"Trend sparkline",chart_history:"Cost and duration history",chart_seasonal:"Seasonal factors, 12 months",chart_weibull:"Weibull reliability curve",chart_sparkline:"Sensor trigger value chart",days_progress:"Days progress",qr_code:"QR Code",qr_generating:"Generating QR code\u2026",qr_error:"Failed to generate QR code.",qr_error_no_url:"No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",save_error:"Failed to save. Please try again.",subsave_warning:"Saved, but one setting was rejected: {detail}",qr_print:"Print",qr_download:"Download SVG",qr_action_view:"View maintenance info",qr_action_complete:"Mark maintenance as complete",qr_action_quick_complete:"Quick-complete \u2014 no dialog",qr_print_quick_none:"Quick-complete codes need quick-complete defaults on a task (Settings \u2192 Advanced Features \u2192 Completion actions; task dialog \u2192 Quick-complete defaults) \u2014 none of the chosen objects' tasks has them yet.",qr_url_mode:"Link type",qr_mode_companion:"Companion App",qr_mode_local:"Local (mDNS)",qr_mode_server:"Server URL",overview:"Overview",strat_this_month:"This Month",strat_later:"Later",strat_week:"Week",strat_fortnight:"Fortnight",strat_month:"Month",strat_year:"Year",strat_other:"Other",strat_status:"Status",strat_empty_title:"No maintenance objects yet",strat_empty_content:"Open the Maintenance panel to add your first object \u2014 pool pump, HVAC filter, vehicle, anything that needs scheduled care.",strat_open_panel:"Open Maintenance panel",strat_add_object:"Add object",strat_not_loaded:"**Maintenance Supporter** is not loaded. Install/enable the integration first.",strat_group_by:"Group views by",strat_group_area:"By area (default)",strat_group_status:"By status (Overdue / Triggered / Due Soon / OK)",strat_group_floor:"By floor (uses HA floors)",strat_group_due_date:"By due date (Overdue / Today / Week / Month / Later)",strat_group_calendar:"Rolling calendar (Week / Fortnight / Month / Year)",strat_editor_help:'The "Overview" view is always first. Empty groups are skipped.',picker_name_calendar:"Maintenance Supporter \u2014 Calendar",picker_name_panel:"Maintenance Supporter \u2014 Panel",picker_name_budget:"Maintenance Supporter \u2014 Budget",picker_name_groups:"Maintenance Supporter \u2014 Groups",picker_name_vacation:"Maintenance Supporter \u2014 Vacation",picker_name_battery_fleet:"Battery Fleet",picker_name_section:"Maintenance Supporter \u2014 Section",picker_name_vacation_status:"Maintenance Supporter \u2014 Vacation Status",picker_name_budget_status:"Maintenance Supporter \u2014 Budget Status",picker_desc_card:"Overview of your maintenance tasks with quick actions.",picker_desc_calendar:"Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",picker_desc_panel:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",picker_desc_budget:"Edit the monthly and yearly budget right on the dashboard.",picker_desc_groups:"Create, rename and delete task groups right on the dashboard.",picker_desc_vacation:"Switch vacation mode on or off and set its dates right on the dashboard.",picker_desc_battery_fleet:"All tracked batteries: what is low now, what runs out soon, and what to buy.",picker_desc_dashboard:"Auto-generated dashboard. Group views by area, status, floor, or due date \u2014 picked from the strategy editor or YAML.",picker_desc_section:"Embed maintenance tasks (filterable by area, status, due date) as a section in any dashboard view.",picker_desc_vacation_status:"Compact vacation-mode status banner. Tap to open settings in the panel.",picker_desc_budget_status:"Monthly + yearly maintenance budget overview. Tap for details.",picker_desc_groups_status:"List of configured task groups with member counts.",hist_note_button:"Completed from dashboard button",hist_note_todo:"Completed from the To-do list",hist_note_voice:"Completed by voice",hist_note_notification:"Completed from the notification",hist_note_nfc:"Completed via NFC tag",hist_note_shopping_list:"Completed from the shopping list",hist_note_todo_mirror:"Completed from a mirrored to-do list",hist_note_skipped_notification:"Skipped from notification",hist_note_skipped_button:"Skipped from dashboard button",hist_note_sensor_triggered:"Sensor trigger activated",hist_note_initial:"Initial value set during task creation",hist_note_auto_recovered:"Auto-completed: sensor recovered ({value})",hist_note_reset:"Reset to {date}",hist_note_trigger_replaced:"Trigger entity replaced: {old} \u2192 {new}",hist_note_trigger_removed:"Sensor trigger removed (entity was: {entity}). Schedule converted to {schedule}.",hist_note_compound_removed:"Entity {entity} removed from compound trigger; {count} conditions remain.",recent_activities:"Recent Activities",search_notes:"Search notes",avg_cost:"Avg Cost",current:"Current",shorter:"Shorter",longer:"Longer",normal:"Normal",disabled:"Disabled",compound_logic:"Compound logic",compound:"Compound (multiple conditions)",compound_logic_and:"AND \u2014 all conditions must trigger",compound_logic_or:"OR \u2014 any condition triggers",compound_help:"Combine several sensor conditions into one trigger.",compound_no_conditions:"No conditions yet \u2014 add at least one.",compound_add_condition:"Add condition",compound_condition:"Condition",compound_remove_condition:"Remove condition",card_title:"Title",card_show_header:"Show header with statistics",card_show_actions:"Show action buttons",card_action_style:"Complete button style",card_compact:"Compact mode",card_max_items:"Max items (0 = all)",card_filter_status:"Filter by status",card_filter_status_help:"Empty = show all statuses.",card_filter_objects:"Filter by objects",card_filter_objects_help:"Empty = show all objects.",card_filter_areas:"Filter by areas",card_filter_areas_help:"Empty = show all areas.",card_filter_priority_help:"Empty = show all priorities. Tasks without an explicit priority count as Normal.",card_filter_entities:"Filter by entities (entity_ids)",card_filter_entities_help:"Pick sensor / binary_sensor entities from this integration. Empty = all.",card_loading_objects:"Loading objects\u2026",card_load_error:"Could not load objects \u2014 check the WebSocket connection.",card_no_tasks_title:"No maintenance tasks yet",card_no_tasks_cta:"\u2192 Create one in the Maintenance panel",no_objects:"No objects yet.",action_error:"Action failed. Please try again.",area_id_optional:"Area (optional)",installation_date_optional:"Installation date (optional)",warranty_expiry_optional:"Warranty expiry (optional)",warranty:"Warranty",warranty_valid_until:"valid until {date}",warranty_expires_in:"expires in {days} days",warranty_expired:"expired",cal_past_windows:"Past windows",cal_forward_windows:"Forward windows",history_edit_title:"Edit history entry",history_delete_entry:"Delete entry",history_delete_confirm:"Delete this history entry? The task's last-performed date falls back to the previous completion; photos stay with the object and consumed parts are not restocked.",history_edit_timestamp:"Timestamp",manufacturer:"Manufacturer",model:"Model",area:"Area",actions:"Actions",view_mode_label:"View",view_cards:"Card view",view_table:"Table view",objects_table_columns_label:"Objects table columns",objects_table_columns_hint:"Choose which columns appear in the objects table view.",custom_icon_optional:"Icon (optional, e.g. mdi:wrench)",notify_icon:"Notification icon",notify_icon_hint:"Shown by the Companion app on Android. Empty = the icon of this task's maintenance type ({default}).",task_enabled:"Task enabled",skip_reason_prompt:"Skip this task?",reason_optional:"Reason (optional)",reset_date_prompt:"Mark task as performed?",reset_date_optional:"Last performed date (optional, defaults to today)",notes_label:"Notes",documentation_label:"Documentation",no_nfc_tag:"\u2014 No tag \u2014",dashboard:"Dashboard",tab_today:"Today",palette_placeholder:"Search objects, tasks, spare parts, documents, notes\u2026",palette_no_results:"No matches",palette_hint:"\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close \xB7 / opens the search anywhere",search_open:"Search",search_group_parts:"Spare parts",search_group_content:"In documents",search_group_history:"History notes",search_page:"Page {page}",search_empty_hint:"Type to search objects, tasks, spare parts, documents and notes",search_searching:"Searching documents and notes\u2026",search_index_status:"Full-text search: {indexed} of {total} files indexed \xB7 {no_text} without text layer \xB7 {pending} pending",today_all_caught_up:"All caught up! Nothing due this week.",today_overdue:"Overdue",today_due_today:"Due today",today_this_week:"This week",settings:"Settings",settings_features:"Advanced Features",settings_features_desc:"Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",feat_adaptive:"Adaptive Scheduling",feat_adaptive_desc:"Learn optimal intervals from maintenance history",feat_seasonal:"Seasonal Adjustments",feat_seasonal_desc:"Adjust intervals based on seasonal patterns",feat_environmental:"Environmental Correlation",feat_environmental_desc:"Correlate intervals with temperature/humidity",feat_budget:"Budget Tracking",feat_budget_desc:"Track monthly and yearly maintenance spending",feat_groups:"Task Groups",feat_groups_desc:"Organize tasks into logical groups",feat_checklists:"Checklists",feat_checklists_desc:"Multi-step procedures for task completion",settings_general:"General",settings_default_warning:"Default warning days",settings_consumable_threshold:"Consumable low threshold (%)",settings_battery_low_percent:"Battery low threshold (%)",settings_battery_recovered_percent:"Battery counts as replaced above (%)",settings_battery_recovered_percent_hint:"A low battery stays counted as low until its level rises above this value or a replacement is recorded \u2014 so a level hovering around the low threshold cannot complete the fleet task again and again.",settings_battery_auto_record:"Record a replacement automatically when a low battery recovers",settings_battery_auto_record_hint:"When a battery that was low rises above the recovery threshold, the replacement date is recorded in Battery Notes and the spare cells are taken from stock \u2014 no tap needed.",settings_battery_lifetimes:"Typical battery lifetimes",settings_battery_lifetimes_hint:'Only used for batteries without a percentage: a Battery Notes note that has just a type and a last-replaced date, or a sensor that only reports "low". Their due date is last replaced + this lifetime. Batteries that report a level get their forecast from the measured discharge instead. Once the fleet has seen three replacements of a type, the median interval takes over from the built-in value \u2014 your own value always wins.',settings_battery_lifetime_months:"months",settings_battery_lifetime_reset:"Use default",settings_battery_lifetime_in_fleet:"in your fleet",settings_battery_lifetime_learned_models:"Learned per model: {list}",settings_thresholds_hint:"Defaults for new Suggested setups (percent-remaining consumables) and for fleet batteries without their own Battery Notes threshold. Existing tasks keep their value.",settings_part_search_url:"Shopping search link",settings_part_search_url_hint:"URL with {q} in place of the search terms, used for parts without a product link. Leave empty for the automatic store (by country, then by language).",settings_value_out_of_range:"Value must be between {min} and {max}",bn_summary:"{name}: {pct} % for {n} batteries",bn_floor_decides:"Your {floor} % floor decides for all of them; the higher of the two thresholds counts per battery.",bn_above_floor:"That is above your {floor} % floor, so {name} decides for all noted batteries.",bn_overrides:"{n} devices with their own threshold:",bn_more:"+ {n} more",settings_row_actions:"Task row actions",settings_ref_numbers_in_lists:"Reference numbers in lists",settings_ref_numbers_in_lists_hint:"Show the #8 / #8.3 chips in front of object and task names in the Today list, the task table, the object cards and the objects table.",settings_compact_refs:"Compact reference numbers",settings_compact_refs_hint:"Renumbers all objects, tasks and completions in order (1, 2, 3 \u2026) and closes the gaps left by deletions. Numbers already printed on service booklets, photos or notes will no longer match.",settings_compact_refs_confirm:"Renumber every object, task and completion sequentially in creation order? Numbers already written on printed service booklets, photos or notes will no longer match. This cannot be undone.",settings_compact_refs_done:"Renumbered {objects} objects, {tasks} tasks and {completions} completions.",row_actions_buttons_compact:"Buttons (icons only on phones)",row_actions_buttons:"Buttons with text",row_actions_icons:"Icons (classic)",row_actions_follow:"Follow the household setting",settings_panel_enabled:"Sidebar panel",settings_panel_title:"Sidebar panel title",settings_notifications:"Notifications",settings_notify_service:"Notification service",settings_shopping_list:"Shopping list (buy tasks)",settings_shopping_list_help:"Low-part buy reminders appear in this to-do list; checking one off restocks the part.",shopping_list_none:"Off \u2014 no shopping list",settings_install_assist_sentences:"Install Assist sentences",settings_install_assist_sentences_hint:"Copies the voice sentences into your configuration so the classic Assist agent recognises them. A file you edited yourself is never overwritten.",test_notification:"Test notification",send_test:"Send test",testing:"Sending\u2026",test_notification_success:"Test notification sent",test_notification_failed:"Test notification failed",notify_per_person:"Per-person delivery",member_avatars:"Member avatars",member_avatars_hint:"Shown next to assigned tasks \u2014 initials in the member's colour. Defaults come from the name; set your own initials or pick a colour to tell members apart.",member_initials:"Initials",member_color:"Colour",member_avatar_reset:"Reset",notify_no_own_device:"No own device \u2014 uses the household service",settings_notify_due_soon:"Notify when due soon",settings_notify_overdue:"Notify when overdue",settings_notify_triggered:"Notify when triggered",settings_interval_hours:"Repeat interval (hours, 0 = once)",settings_quiet_hours:"Quiet hours",settings_quiet_start:"Start",settings_quiet_end:"End",settings_max_per_day:"Max notifications per day (0 = unlimited)",settings_bundling:"Bundle notifications",settings_bundle_threshold:"Bundle threshold",settings_reminder_leads:"Extra reminders (days before due)",settings_reminder_leads_hint:"Comma-separated lead times, e.g. 14, 3, 0 \u2014 one extra reminder fires on each matching day. Empty = off.",settings_actions:"Mobile Action Buttons",settings_action_complete:"Show 'Complete' button",settings_action_skip:"Show 'Skip' button",settings_action_snooze:"Show 'Snooze' button",settings_weekly_digest:"Weekly digest",settings_weekly_digest_hint:"A single summary notification on Monday morning when tasks are due.",settings_warranty_reminder:"Warranty expiry reminder",settings_warranty_reminder_days:"Days before expiry",settings_warranty_reminder_hint:"Notify once when an object's warranty is this many days from expiring.",settings_snooze_hours:"Snooze duration (hours)",settings_budget:"Budget",settings_currency:"Currency",settings_currency_decimals:"Decimal places for amounts",settings_currency_decimals_hint:"How many decimals every amount shows: KPIs, budgets, costs in lists and reports, budget alerts. 0 = whole numbers.",settings_parts_cost_mode:"Spare parts count as spending",settings_parts_cost_purchase:"When bought",settings_parts_cost_use:"When used",settings_parts_cost_mode_hint:"When bought: a buy reminder's cost counts, and the parts a job uses are shown as information. When used: every completion books the value of the parts it used, and a purchase sets the part's price instead of counting. Applies to completions from now on \u2014 history keeps how it was booked.",settings_budget_monthly:"Monthly budget",settings_budget_yearly:"Yearly budget",settings_budget_alerts:"Budget alerts",settings_budget_threshold:"Alert threshold (%)",settings_import_export:"Import / Export",settings_export_json:"Export JSON",settings_export_yaml:"Export YAML",settings_export_csv:"Export CSV",settings_export_settings:"Export settings (JSON)",settings_import_placeholder:"Paste JSON or CSV content here\u2026",settings_import_btn:"Import",settings_import_success:"{count} objects imported successfully.",settings_import_unmatched_users:"Not found on this instance: {names}. Their task assignments were removed \u2014 add people with the same names in Home Assistant and import again to keep them.",settings_export_success:"Export downloaded.",settings_saved:"Setting saved.",settings_include_history:"Include history",settings_export_selection:"Limit to selected objects (optional)",settings_docs_archive:"Documents archive (with files)",settings_docs_archive_hint:"The JSON and YAML exports list your documents but not their files; CSV leaves documents out. This ZIP holds the uploaded files \u2014 restore it after importing the JSON and nothing is missing.",settings_docs_export_btn:"Download documents ZIP",settings_docs_import_btn:"Restore documents ZIP",settings_docs_import_success:"Restored: {blobs} files, {docs} documents",settings_docs_import_missing:"{n} skipped \u2014 their files were not in the ZIP",sort_alphabetical:"Alphabetical",sort_due_soonest:"Due soonest",sort_task_count:"Task count",sort_area:"Area",sort_assigned_user:"Assigned user",sort_group:"Group",groupby_none:"No grouping",groupby_area:"By area",groupby_group:"By group",groupby_user:"By user",groupby_object:"By object",filter_label:"Filter",user_label:"User",photo_label:"Photo",sort_label:"Sort",group_by_label:"Group by",state_value_help:'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',target_changes_help:"Number of matching transitions before the trigger fires (default: 1).",state_latch_help:"With 1 transition the trigger is a latch: it recovers when the entity leaves the To-state \u2014 or, with only a From-state set, when it returns to that state.",for_minutes_state_help:"0 counts every change immediately. Set minutes and the new state must hold that long first \u2014 brief flickers then neither trigger nor count.",qr_print_title:"Print QR codes",qr_print_desc:"Generate a printable page of QR codes to cut out and stick on your equipment.",qr_print_load:"Load objects",qr_print_filter:"Filter",qr_print_objects:"Objects",qr_print_actions:"Actions",qr_print_url_mode:"Link type",qr_print_estimate:"Estimated QR codes",qr_print_over_limit:"cap is 200, narrow the filter",qr_print_generate:"Generate QR codes",qr_print_generating:"Generating\u2026",qr_print_ready:"QR codes ready",qr_print_print_button:"Print",qr_print_empty:"Nothing to generate",qr_action_skip:"Skip",vacation_title:"Vacation mode",vacation_active:"active",vacation_ended:"ended",vacation_desc:"Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",vacation_enable:"Enable vacation mode",vacation_start:"Start",vacation_end:"End",vacation_buffer:"Buffer (days)",vacation_exempt_title:"Notify anyway during vacation",vacation_exempt_desc:"Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",vacation_load_tasks:"Load tasks",vacation_preview_btn:"Show preview",vacation_preview_affected:"tasks affected",vacation_event_due_soon:"becomes due soon",vacation_event_overdue:"becomes overdue",vacation_event_triggered_est:"sensor trigger possible",vacation_sensor_based:"(sensor-based)",vacation_action_notify:"Notify anyway",vacation_action_unsilence:"Silence again",vacation_marked_complete:"Marked complete",vacation_marked_skip:"Skipped",vacation_end_now:"End vacation now",add:"Add",show_stats:"Show stats + graphs",hide_stats:"Hide stats",adaptive_no_data:"Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",suggestion_applied:"Suggested interval applied",vacation_mode:"Vacation mode",vacation_status_active:"Active now",vacation_status_scheduled:"Scheduled",vacation_status_inactive:"Inactive",vacation_end_now_confirm:"End vacation immediately?",vacation_exempt_count:"exempt",vacation_advanced:"Advanced\u2026",vacation_open_panel:"Open in panel",enable:"Enable",saved:"Saved",budget_monthly_set:"Set monthly",budget_yearly_set:"Set yearly",budget_advanced:"Currency, alerts\u2026",budget_open_panel:"Open in panel",groups_empty:"No groups yet.",group_new_placeholder:"Add group\u2026",groups_manage_tasks:"Manage task assignments\u2026",groups_open_panel:"Open in panel",unassigned:"Unassigned",no_area:"No area",has_overdue:"Has overdue tasks",object:"Object",settings_panel_access:"Panel access",settings_panel_access_desc:"Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else only gets Complete, Skip, Reset, Postpone and Snooze.",settings_operator_write:"Allow selected users to create, edit & delete",settings_operator_write_desc:"Off: only admins can change content. On: the selected users below get full access too.",no_non_admin_users:"No non-admin users found. Add some in Settings \u2192 People.",owner_label:"Owner",feat_completion_actions:"Completion actions",feat_completion_actions_desc:"Per-task HA action on complete + quick-complete QR with pre-set values.",on_complete_action_title:"On complete: trigger HA action (optional)",on_complete_action_desc:"Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",on_complete_action_target:"Target entity",on_complete_action_target_hint:"Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",on_complete_action_target_more:"This action targets more than this field shows: {targets}. That is kept as it is \u2014 choosing another entity here replaces the whole target.",on_complete_action_skip_auto:"Not when the task completes itself (its sensor recovered)",on_complete_action_data:"Data (JSON, optional)",on_complete_action_test:"Validate configuration",on_complete_action_test_success:"\u2713 Configuration valid (action will fire only on task completion)",on_complete_action_test_failed:"Failed",action_test_bad_format:"Invalid service format (expected 'domain.service')",action_test_unknown_service:'Service "{service}" is not registered in Home Assistant. Check the spelling and that the integration providing it is loaded.',action_test_domain_mismatch:`Service "{service}" only works on {domain}.* entities; entity "{entity}" is in {entity_domain}.* \u2014 pick a service that matches the entity's domain (e.g. {suggestion})`,action_test_entity_missing:'Target entity "{entity}" was not found in Home Assistant \u2014 it may have been renamed or its integration removed.',quick_complete_defaults_title:"Quick-complete defaults (for QR scans, optional)",quick_complete_defaults_desc:"Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",quick_complete_defaults_notes:"Notes",quick_complete_defaults_cost:"Cost",quick_complete_defaults_duration:"Duration (minutes)",quick_complete_defaults_feedback_none:"No feedback",quick_complete_defaults_feedback_needed:"Was needed",quick_complete_defaults_feedback_not_needed:"Not needed",quick_complete_success:"Quickly marked complete",show_all_objects:"Show all objects",show_all_tasks:"Clear filter \u2014 show all tasks",filter_to_overdue:"Filter task list to overdue only",filter_to_due_soon:"Filter task list to due-soon only",filter_to_triggered:"Filter task list to triggered only",open_task:"Open task",show_details:"Show history + stats",hide_details:"Hide details",history_empty:"No history yet.",history_edit_button:"Edit entry",total_cost:"Total cost",times_performed:"Performed",older_entries:"older",open_in_panel:"Open in Maintenance panel",skip_reason:"Skip reason (optional)",reset_to_date:"Reset last_performed to",delete_task_confirm:"Delete this task and its history?",delete_object_confirm:"Delete this object and all its tasks?",loading:"Loading\u2026",archive:"Archive",undo:"Undo",task_archived:"Task archived",object_archived:"Object archived",unarchive:"Unarchive",archived:"Archived",show_archived:"Show archived",hide_archived:"Hide archived",section_collapse:"Collapse section",section_expand:"Expand section",confirm_archive_object:"Archive this object and its tasks? They keep their history and can be unarchived later.",settings_archive:"Archive & Retention",settings_archive_desc:"Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",settings_archive_oneoff_days:"Auto-archive completed one-off tasks after (days, 0 = off)",settings_delete_archived_oneoff_days:"Auto-delete archived one-off tasks after (days, 0 = never)",archive_object:"Archive object",unarchive_object:"Unarchive object",documents:"Documents",documents_empty:"No documents yet.",doc_upload:"Upload file",doc_uploading:"Uploading\u2026",doc_add_link:"Add link",doc_link_url:"URL (https://\u2026)",doc_link_title:"Title (optional)",doc_open:"Open",doc_delete_confirm:'Delete "{name}"?',doc_too_large:"File is too large (max 25 MB).",doc_upload_failed:"Upload failed.",docs_archive_too_large:"The archive is too large (max {max}).",docs_archive_no_manifest:"This ZIP has no manifest.json, so the restore cannot tell which document a file belongs to. Keep manifest.json next to the folders when zipping again.",completion_photos_optional:"Completion photos (optional)",completion_photos:"Completion photos",choose_photos:"Choose photos",choose_photo:"Choose photo",photos_android_hint:"The Android app hands over one photo per pick \u2014 each pick is added.",photos_limit:"Up to {max} photos per completion",history_edit_photos_hint:"Removing a photo here keeps the file in the object's documents.",uploading:"Uploading\u2026",remove:"Remove",doc_deduped:"Already stored elsewhere \u2014 shared, no extra space used.",doc_dup_in_object:"This file is already attached to this object.",doc_link_invalid:"Only http/https links are allowed.",doc_cat_manual:"Manual",doc_cat_warranty:"Warranty",doc_cat_invoice:"Invoice",doc_cat_spare_parts:"Spare parts",doc_cat_photo:"Photo",doc_cat_other:"Other",doc_link_badge:"Link",doc_storage_title:"Document storage",doc_storage_saved:"Saved via deduplication",doc_storage_refresh:"Refresh",doc_download:"Download",doc_close:"Close",doc_camera:"Take photo",camera_capture_shoot:"Capture",camera_switch_lens:"Switch camera",camera_switching:"Switching camera\u2026",camera_not_answered:"This camera did not answer. Tap the switch again to try the next one, or use the file picker.",camera_diagnostics:"Details for a bug report",camera_copy:"Copy",camera_copied:"Copied",doc_drop_hint:"Drop files here",doc_task_none:"No documents linked to this task.",doc_link_existing:"Link a document\u2026",doc_attach:"Link",doc_unlink:"Unlink",doc_page:"Page",chart_range_7d:"7d",chart_range_30d:"30d",chart_range_90d:"90d",chart_range_1y:"1y",chart_since_service:"since last service",chart_no_stats:"No long-term statistics for this entity \u2014 showing maintenance-event values only",auto_complete_on_recovery:"Auto-complete when the sensor recovers",auto_complete_on_recovery_help:"Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",doc_search:"Search documents\u2026",doc_search_none:"No matching documents",doc_description:"Description (optional)",doc_sort:"Sort documents",doc_sort_newest:"Newest first",doc_sort_oldest:"Oldest first",doc_sort_title:"By title (1, 2, 3 \u2026)",doc_sort_category:"By category",link_device_optional:"Link to existing device (optional)",parent_object_optional:"Parent object (optional)",parent_none:"(No parent)",paused:"Paused",pause_object:"Pause",resume_object:"Resume",pause_until_prompt:"Freeze this object's schedules \u2014 nothing becomes due and nothing notifies until it is resumed. Optionally set an auto-resume date.",pause_until_label:"Resume on (optional)",object_paused:"Object paused",object_resumed:"Object resumed \u2014 schedules restarted",object_paused_badge:"Paused",paused_until_label:"until",replace_object:"Replace\u2026",replace_object_prompt:"Retire this object and create a successor. History and costs stay archived on the old one; tasks and documents carry over to the new one, counters start fresh.",replace_name_label:"Successor name",replace_device_heading:"Device in Home Assistant",replace_device_keep:"Same device as before ({device})",replace_device_keep_hint:"Also the choice when the new unit is not in Home Assistant yet: once it is, pick it as the object's device in its settings \u2014 the sensor triggers move along then.",replace_device_other:"The new unit is another device",replace_device_pick:"Device of the new unit",replace_device_other_hint:"Sensor triggers, completion actions and the counter reset move to the matching entities of that device.",replace_device_none:"No device",object_replaced:"Object replaced \u2014 successor created",device_swap_moved:"{count} sensor links moved to the new device.",device_swap_moved_one:"One sensor link moved to the new device.",device_swap_unmatched:"{count} could not be matched \u2014 check those tasks' sensor triggers.",device_swap_unmatched_one:"One could not be matched \u2014 check that task's sensor trigger.",reading_unit_label:"Reading unit (e.g. kWh, m\xB3)",reading_unit_help:"Shown next to the recorded value when completing this task.",reading_value_label:"Reading value",reading_label:"Reading",readings_section:"Readings",readings_hint:"Several named values per completion \u2014 one row per meter. Leave empty to record a single value.",reading_name_label:"Reading name",reading_unit_short:"Unit",reading_add:"Add reading",reading_duplicate_name:"Name already used",reading_last:"last: {value}",reading_below_last:"Lower than the last reading ({value})",settings_templates_label:"Template gallery",settings_templates_hint:`Untick templates you'll never need \u2014 they disappear from the "From template" pickers (panel and config flow). Nothing else changes; you can re-enable them any time.`,home_profile_title:"Home profile",home_profile_hint:"Recommends templates and sets seasonal windows for your climate and hemisphere. Everything is worked out locally from your floors, areas and home location.",home_type_label:"Home type",home_type_auto:"Automatic ({detected})",home_region_label:"State, province or region",home_region_none:"not found",home_region_hint:"Some rules differ within a country \u2014 a yearly vehicle inspection in one state, none in the next. Found from your home location.",home_dwelling_house:"House",home_dwelling_apartment:"Apartment",home_dwelling_unknown:"not recognised",home_detected_from:"Detected from: {reasons}",home_reason_floors:"several floors",home_reason_basement:"a basement",home_reason_garden:"a garden",home_reason_shed:"a shed",home_reason_driveway:"a driveway",home_reason_garage:"a garage",home_reason_attic:"an attic",home_reason_lawn_mower:"a lawn mower",home_reason_gate:"a gate",home_reason_balcony:"a balcony",home_reason_small_home:"few rooms on one floor",home_reason_ups:"a UPS",home_climate_label:"Climate",home_climate_value:"K\xF6ppen {koppen} \xB7 coldest month {cold} \xB0C \xB7 warmest month {warm} \xB0C",home_climate_unknown:"No home location set in Home Assistant",home_hemisphere_south:"Southern hemisphere \u2014 seasonal windows are mirrored",home_trait_freeze:"Frost in winter",home_trait_snow:"Snowy winters",home_trait_severe_winter:"Severe winters",home_trait_damp:"Damp climate",home_trait_mediterranean:"Mediterranean climate",home_trait_earthquake:"Earthquake region",home_trait_hot_summer:"Hot summers",home_trait_hot_humid:"Hot and humid",home_trait_hot_dry:"Hot and dry",home_trait_termites:"Termite region",home_trait_wildfire:"Wildfire risk",home_trait_cyclone:"Hurricane / typhoon region",home_trait_tropical:"Tropical climate",home_trait_radon:"Radon test recommended",home_reason_starter:"Basics for your home",home_reason_country:"Common in {country}",home_reason_feature:"Found in your home: {feature}",templates_recommended_title:"Recommended for your home",templates_recommended_hint:"Based on your home profile \u2014 adjust it in Settings.",templates_legal_hint:"Notes on legal duties and intervals are guidance, not legal advice. Rules vary by region and change over time \u2014 local regulations and the manufacturer's instructions take precedence.",templates_not_typical:"Not typical for your home type",templates_set_up:"Already set up",worksheet:"Work sheet",worksheet_scan_view:"Scan to open the task",worksheet_scan_complete:"Scan to complete",worksheet_manual_excerpt:"Manual excerpt",worksheet_pages:"pages",worksheet_printed:"Printed",worksheet_never:"Never",card_all_caught_up:"All caught up \u2014 nothing needs attention",postpone:"Postpone",postpone_date_prompt:"Postpone this occurrence to which date?",postpone_date_label:"New due date",postponed:"Postponed",postponed_to:"Postponed to",season_window_label:"Seasonal window (months)",season_window_hint:"Only due in the selected months; off-season dates roll to the next active month. None = all year.",series_end_label:"Ends",series_end_never:"Never (repeats indefinitely)",series_end_after_count:"After a number of times",series_end_until:"On a date",series_end_count_label:"Number of times",series_end_until_label:"End date",parts_section:"Parts & consumables",parts_inventory_value:"Inventory value",part_add:"Add part",part_name:"Name",part_vendor:"Manufacturer",part_storage_location:"Storage location",part_product_url:"Product URL",part_unit:"Unit",part_cost:"Unit price",part_stock:"Stock",part_reorder_threshold:"Reorder at",part_restock_quantity:"Restock quantity",part_package_size:"Package size (units)",part_restock_packages:"Restock amount (packages)",part_package_hint:"Bought in packages, used in the unit: stock, the amount a task uses and the reorder threshold count units; the restock amount and the price are per package.",part_auto_buy:"Auto-create buy task when low",part_restock:"Adjust stock",parts_used_by:"Used by",restock_quantity_label:"Quantity bought",consumes_parts_label:"Consumes parts",task_parts_fleet_hint:"Battery quantities come from Battery Notes per device \u2014 nothing to link here.",shared_parts_other_objects:"Parts from other objects",shared_parts_help:"Several objects can share one stock. Completing this task takes from the owning object.",shared_part_unknown:"Unknown part",parts_load_failed:"Couldn't load this object's parts \u2014 the consumes-parts options are unavailable right now.",adopt_problem_button:"Adopt problem sensors",adopt_problem_title:"Adopt problem sensors",adopt_problem_hint:"Turn HA problem sensors (printer errors, filter warnings, low battery) into maintenance tasks that trigger while the problem is active and clear themselves when it resolves.",adopt_problem_none:"No problem sensors found that aren't already tracked.",adopt_problem_active:"active",adopt_problem_ok:"ok",adopt_problem_new_object:"(new)",adopt_object_hint:"Give several sensors the same object name and they become one object; type an existing object's name to add them there.",adopt_summary_title:"What adopting changes",adopt_summary_existing:'"{name}": tasks {before} \u2192 {after}',adopt_problem_adopt:"Adopt selected",adopt_problem_done:"Adopted {tasks} problem sensor(s)",adopt_problem_done_one:"Adopted 1 problem sensor",views_label:"Views",views_none:"\u2014 No view \u2014",views_manage:"Save / manage views",views_dialog_title:"Saved views",views_dialog_hint:"Save the current filters as a named view everyone can reuse.",views_name_placeholder:"View name",views_save_current:"Save current filters",views_none_yet:"No saved views yet.",close:"Close",trigger_hint_now:"The sensor reads {value} right now.",trigger_hint_above:"The task triggers once it rises above {target}.",trigger_hint_below:"It triggers once it falls below {target}.",trigger_hint_overlap:"These limits overlap: every reading triggers the task and it can never recover. Leave one of them empty.",trigger_hint_counter_delta:"Counts from the current reading ({value}): due at {due} (+{target}), and the count restarts after each completion.",trigger_hint_counter_delta_edit:"Counts usage since the last completion: due after +{target}; the count restarts after each completion.",trigger_hint_counter_abs:"The task becomes due once the sensor reaches {target}.",trigger_hint_runtime:"The task becomes due after {hours} h of accumulated on-time; the counter restarts after each completion.",trigger_hint_state_change:"The task becomes due after {count} state change(s).",trigger_hint_state_change_to:"The task becomes due after {count} change(s) to \u201C{state}\u201D.",trigger_hint_state_now:"Current state: {value}.",adopt_problem_part:"Uses part: {name}",label_filter:"Label",all_labels:"All labels",settings_notify_scope:"Notify only for view",settings_notify_scope_all:"All tasks",settings_notify_scope_hint:"Only tasks matching the selected saved view's label/user filters send reminders. Status, sorting and grouping of the view are ignored here.",settings_notify_completed:"Completion notifications",settings_notify_completed_hint:`Household news when a task is completed, with the reason and who did it. "Automatic only" announces just the completions nobody made on the spot: sensor recovery, shopping-list check-off, an automation's service call. Sent to the household service only; quiet hours and the daily cap apply.`,settings_title_style:"Notification title style",settings_title_style_hint:"What appears as the notification's TITLE. Default keeps the per-status text (e.g. 'Maintenance overdue!'). Object name / Task name help when phone notifications stack.",title_style_default:"Default (per-status title)",title_style_object_name:"Object name as title",title_style_task_name:"Task name as title",notify_completed_off:"Off",notify_completed_automatic:"Automatic completions only",notify_completed_all:"All completions",settings_notify_rule:"Your own notification rule",settings_notify_rule_hint:"Every notification also fires the event maintenance_supporter_notification (kind, status, object, task, reference numbers, priority, deep link, the payload). Route it with an automation \u2014 e.g. into Ticker, Telegram or Pushover.",settings_notify_event_only:"Only fire the event, send nothing myself",settings_notify_event_only_hint:"Your automation is the whole delivery. Rate limits, quiet hours and the daily cap still apply to when the event fires.",settings_notify_extra_data:"Extra notification data (template)",settings_notify_extra_data_hint:"JSON or YAML, Jinja allowed; merged into the notify call's data (your keys win). Variables: kind, status, priority, labels, notes, area_name, object_name, task_name, object_ref, task_ref, days_until_due, next_due, last_performed, responsible_user_id, sensor_entity_id, url, target, title, message. Test it with the Send test button.",card_saved_view:"Saved view",card_saved_view_none:"None",card_saved_view_help:"Applies the view's status, user, label and priority filters on top of the filters above. The view's sorting and grouping are panel display settings and are not applied on the card.",panel_card_tab:"Open on tab",panel_card_tab_default:"Remembered tab (as in the panel)",panel_card_view:"Open with saved view",panel_card_height:"Height",panel_card_height_help:"Empty = fill the screen below the card (panel view). Otherwise a CSS length such as 600px or 80vh for views with other cards.",panel_card_not_registered:"The Maintenance Supporter panel is not available \u2014 is the integration set up?",panel_card_load_failed:"The Maintenance Supporter panel could not be loaded \u2014 reload the page (after an update: clear the browser cache).",doc_part_none:"No documents linked to this part.",settings_templates_toggle_group:"Enable or disable all templates in this group",setups_button:"Suggested setups",setups_title:"Suggested setups (Beta)",setups_hint:"Devices of supported integrations whose consumable sensors can drive maintenance tasks. Adopting creates the object and wires each task to its sensor \u2014 it triggers when the consumable runs low and resolves itself after replacement.",setups_none:"No supported devices with unwired consumable sensors found.",setups_adopt:"Set up selected",setups_done:"{tasks} sensor-wired tasks created.",setups_done_one:"1 sensor-wired task created.",complete_parts_used:"Parts used this time",part_delete_confirm:"Delete part '{name}'? Its stock tracking, task links and any open buy reminder will be removed.",baseline_start_value:"Start reading (optional)",baseline_start_help:"Counting starts from this reading. Leave empty to count from the current value; enter the reading at the last service so usage since then already counts.",setups_baseline_hint:"reading at last service (optional)",baseline_start_help_edit:"Leave empty to keep the existing counting. Entering a value re-anchors the counting (e.g. the reading at the last service).",baseline_current_effective:"Currently effective start value: {value}",runtime_on_states:"Active states",runtime_on_states_help:"States that count as running \u2014 default: on. E.g. mowing, cleaning, printing. With an attribute selected, its values are matched instead.",runtime_max_session:"Max session runtime (seconds)",runtime_max_session_help:"A single run counts at most this many seconds \u2014 protects against a sensor stuck ON (lost connection, restart). Empty = no cap.",trend_approaching:"Heading toward the threshold",trend_easing:"Easing away from the threshold",split_select_hint:"Select a task to see its details here",setups_target_new:"Create new: {name}",setups_target_match:"{name} \u2014 matches: {reasons}",setups_reason_model:"model number",setups_reason_name:"name",setups_reason_area:"area",setups_reason_sibling:"same model on another device",setups_maybe_covered:'Probably there already as "{name}"',setups_already:"Already there: {names}",setups_reset_line:"Completing it also resets the counter in the integration (\u201C{button}\u201D)",setups_reset_enable:"\u2014 the button gets switched on for this",reset_offers_title:"Reset counters on completion",reset_offers_hint:"These tasks watch a counter the integration keeps itself. Connected, completing the task here also presses the integration's reset button \u2014 otherwise the counter keeps running and the task falls due again right away.",reset_offers_before:"Now: completing it leaves the counter in {integration} running",reset_offers_after:"Then: it also presses \u201C{button}\u201D",reset_offers_renamed:"Renamed since it was set up \u2014 check that this task is for this part",reset_offers_apply:"Connect resets",reset_offers_done:"{count} tasks now reset their counter on completion",reset_offers_done_one:"1 task now resets its counter on completion",setups_before_after:"Tasks on the object: {before} \u2192 {after}",setups_new_object_count:'New object "{name}" \xB7 tasks: {count}',schedule_preview_title:"Next dates",schedule_preview_ontime:"Assuming on-time completion.",schedule_preview_ends:"(series ends)",adopt_problem_responsible:"Responsible user for all adopted tasks (optional)",adopt_for_minutes_hint:"Only trigger once the problem has persisted this long \u2014 0 reacts to the first flicker.",adopt_problem_configure:"Configure",history_auto:"Automatic",battery_fleet_title:"Battery fleet",battery_fleet_none_low:"All batteries OK \u2014 nothing to replace.",battery_fleet_progress:"{n} to replace",battery_fleet_buy_now:"Buy now",battery_fleet_soon:"Needed soon",battery_fleet_soon_hint:"Predicted from the last replacement date \u2014 order ahead.",battery_fleet_mark_all:"Mark all replaced",battery_fleet_mark_one:"Mark this battery replaced",battery_fleet_offline:"offline",battery_fleet_no_sensor:"No sensor",battery_fleet_trigger_lost:"This task's sensor trigger was lost \u2014 it will not fire or auto-complete.",battery_fleet_repair:"Repair",battery_fleet_exclude:"Exclude from the fleet",battery_fleet_excluded:"Excluded",battery_fleet_include:"Track again",battery_fleet_all:"All tracked batteries",battery_fleet_all_hint:"Exclude a device here to drop it from the fleet before it ever reports low \u2014 a vacuum that recharges itself, or a phone that warns you on its own.",battery_fleet_add:"Add a battery",battery_fleet_add_hint:"Pick a battery sensor the automatic discovery missed \u2014 it joins the roster immediately.",battery_fleet_track_self:"Track self-charging batteries",battery_fleet_track_self_hint:"Phones, vacuums and other devices that recharge themselves appear as rechargeables \u2014 a low one asks for a charge, never for new cells.",battery_fleet_due_without_sensor:"Treat a passed forecast as due when a battery has no sensor",battery_fleet_due_without_sensor_hint:"Some devices report no battery level at all \u2014 Battery Notes only knows the type and the last replacement. Once the typical lifetime has passed, such a battery counts as low and the fleet task reminds you; marking it replaced resets the forecast.",battery_fleet_status_low:"Low",battery_fleet_status_soon:"Soon",battery_fleet_status_ok:"Healthy",battery_fleet_status_due:"Due",battery_fleet_predicted_on:"Expected around {date}",battery_fleet_predicted_typical:"Expected around {date} \u2014 {months} months typical for {type} ({source})",lifetime_source_default:"built-in default",lifetime_source_table:"built-in table",lifetime_source_learned:"learned from {n} replacements",lifetime_source_override:"your setting",lifetime_source_learned_device:"learned from this device's {n} replacements",lifetime_source_learned_model:"learned from {n} replacements on devices of this model",battery_fleet_predicted_trend:"Predicted from this battery's discharge trend: around {date} ({confidence})",battery_fleet_rechargeable:"Rechargeable: charge instead of replacing \u2014 never on the shopping list",battery_fleet_sort_name:"Sort by name",battery_fleet_sort_urgency:"Sort by urgency",battery_fleet_mark_recharged:"Mark as recharged",battery_fleet_sparkline_hint:"Battery level over the last 30 days \u2014 dotted: projected until the low threshold",battery_fleet_filter_type:"Show only this battery type",battery_fleet_record_replacement:"The level jumped around {date} \u2014 record this replacement in Battery Notes",battery_fleet_total:"{n} batteries tracked",battery_fleet_setup_button:"Battery fleet",battery_fleet_setup_done:"Battery fleet set up \u2014 one task tracks all your batteries.",update_banner:"A newer version of Maintenance Supporter is on the server \u2014 reload to update the panel.",update_reload:"Reload",row_actions_banner:"Complete and Skip in task rows are now buttons. Prefer the old icons?",row_actions_keep:"Keep buttons",row_actions_back:"Back to icons",battery_fleet_forecast_overdue:"Predicted date passed \u2014 the battery still reports healthy. If you swapped it, record the replacement; otherwise the forecast was off.",cost_from_parts:"Use \u2248 {amount} from parts",cost_parts_booked:"Parts used \u2248 {amount} are booked automatically \u2014 enter only additional costs.",cost_parts_info:"Parts used \u2248 {amount} \u2014 counted when they were bought, not here.",cost_purchase_use_hint:"The price paid becomes the part's price \u2014 spare parts count when they are used.",history_parts_counted:"Parts: {amount}",history_parts_counted_hint:"Value of the parts used \u2014 counted as spending",history_parts_info:"Parts \u2248 {amount}",history_parts_info_hint:"Value of the parts used \u2014 information only; the money counted when they were bought",history_purchase_stock:"Bought for {amount} (counted when used)",dismiss:"Dismiss",gs_label:"Getting started \u2014 these hints retire as your setup grows",gs_setups_chip:"Suggested setups found {n} devices with pre-wired triggers",gs_setups_chip_one:"Suggested setups found 1 device with pre-wired triggers",gs_adopt_chip:"{n} problem sensors can become maintenance tasks",gs_adopt_chip_one:"1 problem sensor can become a maintenance task",gs_fleet_chip:"One click sets up the battery fleet",gs_reset_chip:"{n} tasks can reset their counter in the integration",gs_reset_chip_one:"1 task can reset its counter in the integration",cal_editor_window:"Default window",cal_editor_window_week:"Week (7 days)",cal_editor_window_fortnight:"Fortnight (14 days)",cal_editor_window_month:"Month (30 days, default)",cal_editor_window_year:"Year (365 days, empty days collapsed)",cal_editor_window_past_30:"Past 30 days (history)",cal_editor_window_past_90:"Past 90 days (history)",cal_editor_show_chips:"Show window chips inside the card",cal_editor_chips_hint:"Hide the chips when the card is embedded in a strategy view that already serves as the window selector.",cal_editor_show_user_filter:"Show user filter dropdown",cal_editor_default_user:"Default user filter",cal_editor_my_tasks:"My tasks (current user)",cal_editor_show_object_filter:"Show object filter dropdown",cal_editor_object_hint:'Pre-select one object via YAML: object_filter: "<object name>" \u2014 or a list of names to restrict the card to several objects.',object_history_section:"History (all tasks)",object_history_all_tasks:"All tasks",object_history_empty:"No entries in this range.",object_history_cap_note:"History keeps up to 500 entries per task \u2014 very old entries may be missing.",service_record_title:"Service record",service_record_print:"Service record (PDF)",date:"Date",service_record_entries:"entries",ref_number:"Reference number",print_options_title:"Print service record",print_layout:"Layout",print_layout_chronological:"Chronological",print_layout_by_task:"By task",print_include:"Include",print_inc_readings:"Readings",print_inc_parts:"Parts used",print_inc_photos:"Photos",print_inc_documents:"Linked documents",print_inc_doc_desc:"Document descriptions",print_inc_checklist:"Checklist",print_inc_notes:"Notes",print_inc_costs:"Cost and duration",print_inc_person:"Completed by",print_inc_refs:"Reference numbers",print_inc_bare:"Completions without details",print_inc_qr:"QR code per task",print_button:"Print",report_scan_hint:"Scan to open the task",completed_by:"Completed by",date_from:"From",date_to:"To",phases_section:"Cycle phases (optional)",phases_hint:"Different work on one shared schedule \u2014 each completion moves to the next step (e.g. small service, small service, big service).",phase_add:"Add phase",phase_name:"Phase name",phase_sequence_label:"Cycle order",phase_sequence_add_step:"Add step",phase_current:"Current phase",phase_set:"Set as current",chart_history_fallback:"No long-term statistics for this entity \u2014 showing recorder state history (typically the last ~10 days)",chart_history_alarm:"Trigger view from recorder state history: 1 = alert state held for the hold time, 0 = fine (typically the last ~10 days)",chart_history_count:"Change count rebuilt from recorder state history since the last service (typically the last ~10 days)",prediction_cycles:"Learned from cycles",phase_require_override:"Override \u201CRequire on completion\u201D for this phase",history_add_past:"Add past completion",require_tag_scan:"Only complete by scanning the tag",require_tag_scan_help:"Proof of presence: Done is blocked on every surface until the NFC tag or QR code on the thing itself is scanned. Automations can pass 'via_tag_scan' to the complete service.",disallow_skip:"Don't allow skipping",disallow_skip_help:"The Skip action disappears from every surface, and the server refuses a skip from automations and voice too.",no_notifications:"No notifications for this task",no_notifications_help:"No reminders for this task \u2014 no status notifications, repeats, lead-time reminders or bundles. It still shows on the dashboard and in its entities; the weekly digest still counts it.",require_tag_scan_hint:"This task completes only by scanning its NFC tag or QR code on the thing itself \u2014 saving here will be refused."}});function Ht(r){return fa[r??""]??Ot.length}function Ys(r){return Ti.includes(r??"")}var ht,Ot,Ti,fa,_t,qe=y(()=>{"use strict";ht={ok:"var(--success-color, #4caf50)",due_soon:"var(--warning-color, #ff9800)",overdue:"var(--error-color, #f44336)",triggered:"var(--deep-orange-color, #ff5722)",archived:"var(--disabled-color, #9e9e9e)",paused:"var(--info-color, #2196f3)"},Ot=["overdue","triggered","due_soon","ok"],Ti=["overdue","triggered","due_soon"],fa=Object.fromEntries(Ot.map((r,s)=>[r,s]));_t={ok:"mdi:check-circle",due_soon:"mdi:alert-circle",overdue:"mdi:alert-octagon",triggered:"mdi:bell-alert",archived:"mdi:archive-outline",paused:"mdi:pause-circle-outline",completed:"mdi:check-circle",skipped:"mdi:skip-next",missed:"mdi:calendar-remove",reset:"mdi:refresh"}});var Qs,Js=y(()=>{"use strict";Qs="2.95.0"});function Ci(r){Se.en=Object.assign({},r,Se.en??{})}function me(r){let s=(r||Ai).toLowerCase();return s.startsWith("pt")&&s.endsWith("br")?"pt-br":s.substring(0,2)}function n(r,s,e){let t=me(s);return Se[t]?.[r]??Se.en?.[r]??e??r}function gt(r){let s=me(r);return s===Ai||s in Se}function ae(r){let s=me(r);return s===Ai||s in Se||!va.has(s)?Promise.resolve():(s in mt||(mt[s]=fetch(`${ba}/${s}.json?v=${Qs}`).then(e=>e.ok?e.json():null).then(e=>{e?Se[s]=e:delete mt[s]}).catch(()=>{delete mt[s]})),mt[s])}var Ai,Zs,Se,mt,va,ba,ft=y(()=>{"use strict";Js();Ai="en",Zs=(()=>{let r=window;return r.__msLocales||(r.__msLocales={store:{},inflight:{}}),r.__msLocales})(),Se=Zs.store,mt=Zs.inflight;va=new Set(["de","nl","fr","it","es","pt","pt-br","ru","uk","pl","cs","sv","zh","da","fi","nb","ja","hi","hu","ko","tr"]),ba="/maintenance_supporter_locales"});function Xs(r){let s=r?.language;!s||typeof r?.loadBackendTranslation!="function"||J.lang===s&&(J.localize||J.inflight)||(J.lang=s,J.localize=null,J.inflight=r.loadBackendTranslation("exceptions",Ri).then(e=>{J.lang===s&&(J.localize=e)}).catch(()=>{}).finally(()=>{J.inflight=null}))}function er(r,s,e){if(!s||!J.localize||r&&r!==Ri)return null;let t=`component.${Ri}.exceptions.${s}.message`,i=J.localize(t,e??void 0);return i&&i!==t?i:null}var Ri,J,Ii=y(()=>{"use strict";Ri="maintenance_supporter",J=(()=>{let r=window;return r.__msBackendErrors??={lang:"",localize:null,inflight:null}})()});function Te(r){return r?.currency_symbol||ya}function qt(r,s){s.has("hass")&&Pi(r.hass?.locale,r.hass?.config?.country);let e=r.hass?.language;e&&!gt(e)&&ae(e).then(()=>r.requestUpdate()),Xs(r.hass)}function I(r){return r?.language||"en"}function tr(r){let s=me(r);return{de:"de-DE",en:"en-US",nl:"nl-NL",fr:"fr-FR",it:"it-IT",es:"es-ES",pt:"pt-PT",ru:"ru-RU",uk:"uk-UA",zh:"zh-CN",da:"da-DK",fi:"fi-FI",nb:"nb-NO",ja:"ja-JP",hi:"hi-IN",pl:"pl-PL",cs:"cs-CZ",sv:"sv-SE","pt-br":"pt-BR",hu:"hu-HU",ko:"ko-KR",tr:"tr-TR"}[s]??"en-US"}function xa(r){sr.decimals=typeof r=="number"&&Number.isInteger(r)&&r>=0&&r<=3?r:0}function wa(){return sr.decimals??0}function Dt(r){r&&r.currency_decimals!==void 0&&r.currency_decimals!==null&&xa(Number(r.currency_decimals))}function Pi(r,s){r&&(oe.date=r.date_format,oe.time=r.time_format,oe.number=r.number_format,s!==void 0&&(oe.country=s||void 0))}function ka(r){switch(oe.number){case"comma_decimal":return["en-US","en"];case"decimal_comma":return["de","es","it"];case"space_comma":return["fr","sv","cs"];case"system":return;default:return tr(r)}}function L(r,s,e){if(!Number.isFinite(r))return String(r);let t=typeof e=="number"?{minimumFractionDigits:e,maximumFractionDigits:e}:{maximumFractionDigits:2,...e};if(oe.number==="none"){let i=Math.pow(10,t.maximumFractionDigits??2);return String(Math.round(r*i)/i)}try{return new Intl.NumberFormat(ka(s),t).format(r)}catch{return new Intl.NumberFormat(void 0,t).format(r)}}function le(r,s,e,t){let i=L(r,e,t??wa());return s?`${i} ${s}`:i}function Me(r,s,e){let t=L(r,e);return s?`${t} ${s}`:t}function De(r){let s=tr(r),e=oe.country;if(e&&/^[A-Za-z]{2}$/.test(e)){let t=`${me(r).split("-")[0]}-${e.toUpperCase()}`;try{return new Intl.DateTimeFormat(t),t}catch{}}return s}function rr(r,s){let e=String(r.getDate()).padStart(2,"0"),t=String(r.getMonth()+1).padStart(2,"0"),i=String(r.getFullYear());switch(oe.date){case"DMY":return`${e}/${t}/${i}`;case"MDY":return`${t}/${e}/${i}`;case"YMD":return`${i}-${t}-${e}`;case"system":return r.toLocaleDateString(void 0,{day:"2-digit",month:"2-digit",year:"numeric"});default:return r.toLocaleDateString(De(s),{day:"2-digit",month:"2-digit",year:"numeric"})}}function nr(r,s){switch(oe.time){case"12":return r.toLocaleTimeString(De(s),{hour:"2-digit",minute:"2-digit",hour12:!0});case"24":return r.toLocaleTimeString(De(s),{hour:"2-digit",minute:"2-digit",hour12:!1});case"system":return r.toLocaleTimeString(void 0,{hour:"2-digit",minute:"2-digit"});default:return r.toLocaleTimeString(De(s),{hour:"2-digit",minute:"2-digit"})}}function q(r,s){if(!r)return"\u2014";try{let e=r.includes("T")?r:r+"T00:00:00";return rr(new Date(e),s)}catch{return r}}function ar(r,s){if(!r)return"\u2014";try{let e=new Date(r);return rr(e,s)+" "+nr(e,s)}catch{return r}}function Li(r,s){if(r==null)return"\u2014";let e=s||"en";return r<0?`${Math.abs(r)} ${n("d_overdue",e)}`:r===0?n("today",e):`${r} ${r===1?n("day",e):n("days",e)}`}function vt(r,s,e){return r==null?"\u2014":`${r} ${n("unit_"+(s||"days"),e)}`}function Mt(r,s){return r==null?"\u2014":`${L(r,s,{maximumFractionDigits:1})} ${n("minutes_short",s)}`}function bt(r,s,e="long"){return new Date(Date.UTC(2024,0,1+r)).toLocaleDateString(De(s),{weekday:e,timeZone:"UTC"})}function or(r,s,e="long"){return new Date(Date.UTC(2024,r,1)).toLocaleDateString(De(s),{month:e,timeZone:"UTC"})}function lr(r,s){let e=r.schedule;if(r.schedule_type==="sensor_based"){let i=n("sensor_based",s),a=e&&e.kind==="interval"&&e.every?e.every:r.interval_days;return a?`${i} \xB7 ${vt(a,(e&&e.kind==="interval"?e.unit:r.interval_unit)||"days",s)}`:i}let t=e?.offset?` ${e.offset>0?"+":"\u2212"}${Math.abs(e.offset)}d`:"";switch(e?.kind){case"weekdays":return((e.weekdays||[]).map(i=>bt(i,s,"short")).join(" & ")||"\u2014")+t;case"nth_weekday":return e.weekday==null||e.nth==null?"\u2014":`${e.nth===-1?n("ord_last",s):n("ord_"+e.nth,s)} ${bt(e.weekday,s,"long")}${t}`;case"day_of_month":return e.day==null?"\u2014":(e.day===-1?n(e.business?"last_business_day_month":"last_day_month",s):`${n("day_word",s)} ${e.day}`)+t;case"calendar":return`${n("calendar_entity_label",s)}: ${r.schedule_entity_name||e.entity_id||"\u2014"}${t}`;case"one_time":return r.due_date?q(r.due_date,s):n("one_time",s);case"manual":return n("manual",s);case"interval":return vt(e.every,e.unit,s)}return r.schedule_type==="one_time"?r.due_date?q(r.due_date,s):n("one_time",s):r.schedule_type==="manual"?n("manual",s):r.schedule_type==="sensor_based"?n("sensor_based",s):r.interval_days!=null?vt(r.interval_days,r.interval_unit,s):"\u2014"}function cr(r,s){r.currentTarget.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:s},bubbles:!0,composed:!0}))}var ya,ir,oe,sr,zt,$a,Ea,Ft,R=y(()=>{"use strict";C();Gs();qe();ft();Ii();ft();ya="\u20AC";Ci(Ks);ir=window,oe=ir.__msDateTimePrefs??={},sr=ir.__msMoneyPrefs??={};zt=$`
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
`,$a=$`
  .person-chip { display: inline-flex; align-items: center; gap: 6px; min-width: 0; max-width: 100%; vertical-align: middle; }
  .person-avatar {
    width: 22px; height: 22px; border-radius: 50%; flex: none;
    display: inline-flex; align-items: center; justify-content: center;
    background: var(--person-color, #546e7a); color: #fff;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.02em; line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .person-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
`,Ea=$`
  .ref-chip {
    display: inline-block; font-size: 11.5px; font-weight: 500; line-height: 1; padding: 3px 6px;
    border-radius: 6px; border: 1px solid var(--divider-color); color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums; letter-spacing: .02em; vertical-align: middle; white-space: nowrap;
    user-select: all;
  }
  /* #189: "· Residual waste, Paper" after a calendar-driven task's name. */
  .event-titles { color: var(--secondary-text-color); font-weight: 400; }
`,Ft=$`
  ${$a}
  ${Ea}
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

    .group-card { min-width: 0; max-width: 100%; }

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
`});function dr(r,s,e){let t=new Blob([r],{type:e}),i=URL.createObjectURL(t),a=document.createElement("a");a.href=i,a.download=s,a.target="_blank",a.rel="noopener",a.style.display="none",document.body.appendChild(a),a.dispatchEvent(new MouseEvent("click")),document.body.removeChild(a),setTimeout(()=>URL.revokeObjectURL(i),6e4)}var Ni=y(()=>{"use strict"});async function Sa(r,s,e=300){return(await r.connection.sendMessagePromise({type:"auth/sign_path",path:s,expires:e})).path}async function ji(r,s,e=300){return Sa(r,`/api/maintenance_supporter/document/${s}`,e)}async function pr(r,s,e=""){let t=window.open("about:blank","_blank");try{let i=await ji(r,s);t&&(t.location.href=new URL(i+e,window.location.origin).href)}catch(i){throw t&&t.close(),i}}var Oi=y(()=>{"use strict";Ni()});function Ut(r){return!!r&&/^https?:\/\//i.test(r)}var Hi=y(()=>{"use strict"});function Ca(r){let s=(r||"").split(/\s+/).filter(Boolean);return s.length===0?"?":s.length===1?s[0][0].toUpperCase():(s[0][0]+s[s.length-1][0]).toUpperCase()}function Ra(r){let s=0;for(let e of r)s=s*31+e.charCodeAt(0)>>>0;return _r[s%_r.length]}function Wt(r){return r?{id:r.id,name:r.name,initials:r.initials||Ca(r.name),color:r.color||Ra(r.id)}:null}function Di(r){return r?l`<span class="person-avatar" style="--person-color: ${r.color}" title=${r.name}>${r.initials}</span>`:p}var _r,Mi=y(()=>{"use strict";C();_r=["#c62828","#ad1457","#6a1b9a","#4527a0","#283593","#1565c0","#00838f","#2e7d32","#558b2f","#ef6c00","#6d4c41","#546e7a"]});var Fe,zi=y(()=>{"use strict";Mi();Fe=class{constructor(s){this.usersCache=null;this.cacheTimestamp=0;this.CACHE_TTL_MS=6e4;this.hass=s}updateHass(s){this.hass=s}async getUsers(s=!1){let e=Date.now();if(!s&&this.usersCache&&e-this.cacheTimestamp<this.CACHE_TTL_MS)return this.usersCache;try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/users/list"});return this.usersCache=t.users,this.cacheTimestamp=e,this.usersCache}catch(t){return console.error("Failed to fetch users:",t),this.usersCache||[]}}async assignUser(s,e,t){await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/task/assign_user",entry_id:s,task_id:e,user_id:t})}async getTasksByUser(s){return(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tasks/by_user",user_id:s})).tasks}getUserName(s){return!s||!this.usersCache?null:this.usersCache.find(t=>t.id===s)?.name||null}getPerson(s){return Wt(this.getUser(s))}getUser(s){return!s||!this.usersCache?null:this.usersCache.find(e=>e.id===s)||null}getCurrentUserId(){return this.hass.user?.id||null}isCurrentUser(s){return s?s===this.getCurrentUserId():!1}clearCache(){this.usersCache=null,this.cacheTimestamp=0}}});function Ia(r,s){if(s<=0)return 0;let e=typeof r=="number"&&Number.isFinite(r)?Math.trunc(r):0;return e<0?0:e%s}function Pa(r){return!!(r?.phases&&r.phase_sequence&&r.phase_sequence.length>0)}function Fi(r){if(!r||!Pa(r))return null;let s=r.phase_sequence,e=Ia(r.phase_cursor,s.length),t=s[e],i=r.phases?.[t];return i?{id:t,name:i.name,index:e,count:s.length,notes:i.notes,checklist:i.checklist!==void 0?i.checklist:r.checklist??[],consumesParts:i.consumes_parts!==void 0?i.consumes_parts:r.consumes_parts??[],requiredFields:i.required_completion_fields!==void 0?i.required_completion_fields:r.required_completion_fields??[]}:null}function ge(r){let s=Fi(r);return s?`${s.index+1}/${s.count} \xB7 ${s.name}`:""}var Vt=y(()=>{"use strict"});function gr(){let r=new Uint8Array(4);return(globalThis.crypto??{getRandomValues:s=>s.map(()=>Math.floor(Math.random()*256))}).getRandomValues(r),Array.from(r,s=>s.toString(16).padStart(2,"0")).join("")}function fe(r){let s=r?.reading_values;if(!Array.isArray(s))return[];let e=[],t=new Set;for(let i of s){if(!i||typeof i!="object")continue;let a=i;typeof a.id!="string"||!a.id||t.has(a.id)||typeof a.value!="number"||!Number.isFinite(a.value)||(t.add(a.id),e.push({id:a.id,name:typeof a.name=="string"?a.name:a.id,unit:typeof a.unit=="string"?a.unit:null,value:a.value}))}return e}function fr(r){return r.filter(s=>s.type==="completed"&&(s.reading_value!=null||fe(s).length>0)).sort((s,e)=>s.timestamp.localeCompare(e.timestamp))}function vr(r){return fr(r??[]).map(s=>({timestamp:s.timestamp,values:fe(s)})).filter(s=>s.values.length>0)}function br(r,s,e){let t;for(let i of r){if(e!==void 0){let o=new Date(i.timestamp).getTime();if(!isNaN(o)&&o>=e)break}let a=i.values.find(o=>o.id===s);a&&(t=a)}return t}function yr(r,s,e){let t=fe(s).find(a=>a.id===e);if(!t)return null;let i=null;for(let a of fr(r)){if(a.timestamp>=s.timestamp)break;let o=fe(a).find(d=>d.id===e);o&&(i=o.value)}return i==null?null:t.value-i}function xr(r){let s=new Set,e=new Set;for(let t of r){let i=(t.name||"").trim().toLowerCase();i&&(s.has(i)?e.add(t.id):s.add(i))}return e}function wr(r){let s=[],e=new Set,t=new Set;for(let i of r){let a=(i.name||"").trim();if(!(!a||e.has(i.id)||t.has(a.toLowerCase()))&&(e.add(i.id),t.add(a.toLowerCase()),s.push({id:i.id,name:a,unit:(i.unit||"").trim()||null}),s.length>=20))break}return s}var Ae=y(()=>{"use strict"});function ee(r){return`${r.entry_id??""}\0${r.part_id}`}function kr(r,s,e,t){let i=!!r.entry_id&&r.entry_id!==s,a=i?r.entry_id:s,o=e.find(m=>m.entry_id===a),d=(o?.parts||[]).find(m=>m.id===r.part_id)||null,h=i&&o?.object?.name||"",_=d?.name||n("shared_part_unknown",t);return{part:d,foreign:i,ownerName:h,label:h?`${_} (${h})`:_}}function $r(r,s,e,t){let{part:i,label:a}=kr(r,s,e,t),o=i&&i.stock!==null&&i.stock!==void 0?` (${Me(i.stock,i.unit,t)})`:"",d=i?.storage_location?` \u2014 ${i.storage_location}`:"";return`${L(r.quantity,t)}\xD7 ${a}${o}${d}`}function Er(r,s,e,t){let a=(e.find(d=>d.entry_id===s)?.parts||[]).map(d=>({...d})),o=new Set(a.map(d=>ee({part_id:d.id})));for(let d of r?.consumes_parts||[]){if(!d.entry_id||d.entry_id===s)continue;let h=ee(d);if(o.has(h))continue;o.add(h);let{part:_,ownerName:m}=kr(d,s,e,t);a.push({id:d.part_id,name:_?.name||n("shared_part_unknown",t),unit:_?.unit,stock:_?.stock??null,storage_location:_?.storage_location,entry_id:d.entry_id,owner_name:m})}return a}var Gt=y(()=>{"use strict";R()});function La(r,s){return typeof r=="number"&&Number.isFinite(r)&&r>=.01?r:s}function Kt(r){let s=r.task??null,e=s?Fi(s):null,t=e?e.consumesParts:s?.consumes_parts||[],i=!!s?.part_ref,a=r.objects.find(m=>m.entry_id===r.entryId)?.parts||[],o=i?a.find(m=>m.id===s.part_ref.part_id):void 0,d=r.features?r.features.checklists:r.checklistsEnabled??!0,h=r.features?r.features.checklists?r.checklist??s?.checklist??[]:[]:r.checklist??[],_=r.features?r.features.adaptive&&(r.adaptiveEnabled??!!s?.adaptive_config?.enabled):!!r.adaptiveEnabled;return{entry_id:r.entryId,task_id:r.taskId,task_name:r.taskName,checklist:e?d?e.checklist:[]:h,adaptive_enabled:_,required_completion_fields:e?e.requiredFields:s?.required_completion_fields||[],task_type:s?.type||"",reading_unit:s?.reading_unit||"",readings:s?.readings||[],reading_history:vr(s?.history),parts:i?[]:Er({consumes_parts:t},r.entryId,r.objects,r.lang),consumes_parts:i?[]:t,phase_label:e?ge(s):"",require_tag_scan:!!s?.require_tag_scan,restock_default:i?La(o?.restock_quantity,1):null,restock_unit_cost:i?o?.cost??null:null,restock_package:i&&o?.package_size?Me(o.package_size,o.unit,r.lang):"",currency_symbol:Te({currency_symbol:r.currencySymbol}),consumes_info:t.map(m=>$r(m,r.entryId,r.objects,r.lang)),checklist_prefill:s?.checklist_progress||{},via_tag_scan:!!r.viaTagScan,parts_cost_mode:r.partsCostMode??"purchase"}}function Yt(r,s,e){r.entryId=s.entry_id,r.taskId=s.task_id,r.taskName=s.task_name,r.lang=e,r.checklist=s.checklist??[],r.adaptiveEnabled=!!s.adaptive_enabled,r.requiredFields=s.required_completion_fields??[],r.taskType=s.task_type??"",r.readingUnit=s.reading_unit??"",r.readings=s.readings??[],r.readingHistory=s.reading_history??[],r.parts=s.parts??[],r.consumesParts=s.consumes_parts??[],r.phaseLabel=s.phase_label??"",r.requireTagScan=!!s.require_tag_scan,r.restockDefault=s.restock_default??null,r.restockUnitCost=s.restock_unit_cost??null,r.restockPackage=s.restock_package??"",r.currencySymbol=Te(s),r.consumesInfo=s.consumes_info??[],r.checklistPrefill=s.checklist_prefill??{},r.viaTagScan=!!s.via_tag_scan,r.partsCostMode=s.parts_cost_mode??"purchase",r.open({viaTagScan:!!s.via_tag_scan})}var Qt=y(()=>{"use strict";Ae();Gt();Vt();R()});function te(r,s=ce){return r?r.is_admin?!0:s.operatorWriteEnabled&&s.operatorIds.includes(r.id):!1}var ce,Ue=y(()=>{"use strict";ce={operatorWriteEnabled:!1,operatorIds:[]}});var Sr,Tr,Ar,yt,xt,Ui,ve,Be,wt=y(()=>{"use strict";Sr={default_warning_days:[0,365],default_consumable_threshold:[1,90],battery_low_percent:[1,90],battery_recovered_percent:[20,100],archive_oneoff_days:[0,3650],delete_archived_oneoff_days:[0,3650],notify_due_soon_interval_hours:[0,720],notify_overdue_interval_hours:[0,720],notify_triggered_interval_hours:[0,720],max_notifications_per_day:[0,1e3],notification_bundle_threshold:[2,20],snooze_duration_hours:[1,168],warranty_reminder_days:[1,365],budget_alert_threshold:[10,100],currency_decimals:[0,3]},Tr=[0,1440],Ar=[1,1e4],yt=15,xt=[.1,.9],Ui=[0,365],ve=[.01,1e4],Be=[.01,1e5]});function Rr(r){return r==="use"?"use":"purchase"}function Ir(r){let s=Cr(r?.cost);if(s===null)return null;let e=Cr(r?.package_size);return e&&e>0?s/e:s}var Cr,Jt=y(()=>{"use strict";Cr=r=>typeof r=="number"&&Number.isFinite(r)?r:null});function ja(r){let[s,e]=Sr.default_warning_days,t=r?.general?.default_warning_days,i=r?.general?.row_action_style;return{features:{...We.features,...r?.features??{}},defaultWarningDays:typeof t=="number"&&Number.isFinite(t)&&t>=s&&t<=e?t:We.defaultWarningDays,rowActionStyle:Na.includes(i??"")?i:We.rowActionStyle,access:{operatorWriteEnabled:r?.operator_write_enabled===!0,operatorIds:Array.isArray(r?.admin_panel_user_ids)?r.admin_panel_user_ids.filter(a=>typeof a=="string"):[]},budget:r?.budget??null,rowActionNoticePending:r?.general?.row_action_notice_pending===!0,refsInLists:r?.general?.ref_numbers_in_lists===!0,objectsTableColumns:Array.isArray(r?.objects_table_columns)?r.objects_table_columns:void 0,partsCostMode:Rr(r?.budget?.parts_cost_mode)}}function Pr(){let r=window;return r.__msSettingsCache??={promise:null}}function G(r){let s=Pr();if(s.promise)return s.promise;let e=r.connection.sendMessagePromise({type:"maintenance_supporter/settings"}).then(t=>ja(t)).catch(()=>(s.promise===e&&(s.promise=null),We));return s.promise=e,e}function Lr(){Pr().promise=null}var Na,We,Ve=y(()=>{"use strict";Ue();wt();Jt();Na=["buttons_compact","buttons","icons"];We={features:{adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1},defaultWarningDays:7,rowActionStyle:"buttons_compact",access:ce,budget:null,rowActionNoticePending:!1,refsInLists:!1,objectsTableColumns:void 0,partsCostMode:"purchase"}});function qa(r){let s=r.replace(/_ids?$/,"").split("_").filter(Boolean);if(s.length===0)return r;let e=s.join(" ");return e.charAt(0).toUpperCase()+e.slice(1)}function Da(r,s){let e=Ha[r];if(e){let t=n(e,s);if(t&&t!==e)return t}return qa(r)}function Ma(r){let s=[...r.matchAll(/\['([^']+)'\]/g)].map(i=>i[1]),e=s.length?s[s.length-1]:void 0,t;return(t=r.match(/length of value must be at most (\d+)/))?{field:e,rule:"too_long",param:t[1]}:(t=r.match(/length of value must be at least (\d+)/))?{field:e,rule:"too_short",param:t[1]}:(t=r.match(/value must be at most (\S+)/))?{field:e,rule:"value_too_high",param:t[1]}:(t=r.match(/value must be at least (\S+)/))?{field:e,rule:"value_too_low",param:t[1]}:/required key not provided/.test(r)?{field:e,rule:"required"}:(t=r.match(/expected (\w+)/))?{field:e,rule:"wrong_type",param:t[1]}:/value must be one of/.test(r)?{field:e,rule:"invalid_choice"}:/not a valid value/.test(r)?{field:e,rule:"invalid_value"}:{field:e,rule:"unknown"}}function za(r,s){let e=new Set(Nr(s));return Nr(r).every(t=>e.has(t))}function jr(r,s,e){if(e=e??n("action_error",s),typeof r=="string")return r;if(typeof r!="object"||r===null)return e;let t=r,i=t.message||t.error?.message||"",a=t.code||t.error?.code||"",o=a?Oa[a]:void 0,d=er(t.translation_domain??t.error?.translation_domain,t.translation_key??t.error?.translation_key,t.translation_placeholders??t.error?.translation_placeholders);if(d)return d;if(!i&&!o)return e;let h=Ma(i),_=h.field?Da(h.field,s):"",m=b=>n(b,s).replace("{field}",_).replace("{n}",h.param??"");switch(h.rule){case"too_long":return m("err_too_long");case"too_short":return m("err_too_short");case"value_too_high":return m("err_value_too_high");case"value_too_low":return m("err_value_too_low");case"required":return m("err_required");case"wrong_type":return m("err_wrong_type").replace("{type}",h.param??"");case"invalid_choice":return m("err_invalid_choice");case"invalid_value":return m("err_invalid_value");default:if(o){let b=n(o,s);return me(s)==="en"&&i&&!za(i,a)?`${b} (${i})`:b}return i||e}}var Oa,Ha,Nr,Or=y(()=>{"use strict";R();Ii();ft();Oa={already_archived:"ws_err_already_archived",already_paused:"ws_err_already_paused",archived:"ws_err_archived",create_failed:"ws_err_create_failed",duplicate_failed:"ws_err_duplicate_failed",empty:"ws_err_empty",empty_csv:"ws_err_empty_csv",invalid_cursor:"ws_err_invalid_cursor",invalid_date:"ws_err_invalid_date",invalid_device:"ws_err_invalid_device",invalid_entity_slug:"ws_err_invalid_entity_slug",invalid_format:"ws_err_invalid_format",invalid_input:"ws_err_invalid_input",invalid_mirror_todo:"ws_err_invalid_mirror_todo",invalid_parent:"ws_err_invalid_parent",invalid_icon:"ws_err_invalid_icon",invalid_range:"ws_err_invalid_range",invalid_search_template:"ws_err_invalid_search_template",invalid_target:"ws_err_invalid_target",invalid_trigger_config:"ws_err_invalid_trigger_config",invalid_url:"ws_err_invalid_url",invalid_user:"ws_err_invalid_user",invalid_view:"ws_err_invalid_view",limit_reached:"ws_err_limit_reached",no_defaults:"ws_err_no_defaults",no_phases:"ws_err_no_phases",no_url:"ws_err_no_url",not_archived:"ws_err_not_archived",not_available:"ws_err_not_available",not_configured:"ws_err_not_configured",not_found:"ws_err_not_found",not_loaded:"ws_err_not_loaded",not_paused:"ws_err_not_paused",replace_failed:"ws_err_replace_failed",self_link_device:"ws_err_self_link_device",storage_unavailable:"ws_err_storage_unavailable",too_early:"ws_err_too_early",too_large:"ws_err_too_large",too_many:"ws_err_too_many",too_many_views:"ws_err_too_many_views",unauthorized:"ws_err_unauthorized",unavailable:"ws_err_unavailable"},Ha={entry_id:"object",name:"name",task_type:"maintenance_type",schedule_type:"schedule_type",interval_days:"interval_days",interval_anchor:"interval_anchor",warning_days:"warning_days",last_performed:"last_performed_optional",notes:"notes_optional",documentation_url:"documentation_url_optional",custom_icon:"custom_icon_optional",nfc_tag_id:"nfc_tag_id_optional",responsible_user_id:"responsible_user",entity_slug:"entity_slug",entity_id:"entity_id",area_id:"area_id_optional",manufacturer:"manufacturer_optional",model:"model_optional",serial_number:"serial_number_optional",installation_date:"installation_date_optional",warranty_expiry:"warranty_expiry_optional",checklist:"checklist_steps_optional",reason:"reason",feedback:"feedback",cost:"cost",duration:"duration",description:"description_optional",environmental_entity:"environmental_entity_optional",environmental_attribute:"environmental_attribute_optional",trigger_above:"trigger_above",trigger_below:"trigger_below",trigger_equals:"trigger_equals",trigger_not_equals:"trigger_not_equals",trigger_for_minutes:"trigger_for_minutes"};Nr=r=>r.toLowerCase().split(/[^a-z0-9]+/).filter(s=>s.length>1)});async function O(r,s,e={}){e.busy?.(!0);try{let t=typeof s=="function"?await s():await r.hass.connection.sendMessagePromise(s);return e.reload&&await e.reload(),e.successToast&&e.onSuccess?.(e.successToast),t===void 0?null:t}catch(t){let i=e.lang||I(r.hass);e.onError?.(jr(t,i,e.fallbackKey?n(e.fallbackKey,i):void 0),t);return}finally{e.busy?.(!1)}}var be=y(()=>{"use strict";Or();R()});var Hr=y(()=>{"use strict"});function kt(r){let s=r.getFullYear(),e=String(r.getMonth()+1).padStart(2,"0"),t=String(r.getDate()).padStart(2,"0");return`${s}-${e}-${t}`}function qr(r){let s=String(r.getHours()).padStart(2,"0"),e=String(r.getMinutes()).padStart(2,"0");return`${kt(r)}T${s}:${e}:00`}var Zt=y(()=>{"use strict";Jt();Hr();qe()});var Bi,$t,Wi=y(()=>{"use strict";Bi=["notes","cost","duration","photo","user"],$t={notes:"notes_label",cost:"cost",duration:"duration",photo:"photo_label",user:"user_label"}});function Xt(r){if(!r)return[];let s=[],e=r.photo_doc_id;typeof e=="string"&&s.push(e);let t=r.photo_doc_ids;Array.isArray(t)&&s.push(...t);let i=[];for(let a of s){if(typeof a!="string")continue;let o=a.trim();if(!(!o||i.includes(o))&&(i.push(o),i.length>=10))break}return i}var ei=y(()=>{"use strict"});async function Fa(r,s,e){let t=r.auth;if(t?.expired&&t.refreshAccessToken)try{await t.refreshAccessToken()}catch{}return fetch(s,{...e,headers:{...e.headers??{},Authorization:`Bearer ${t?.data?.access_token??""}`}})}async function Ua(r,s,e,t="doc_too_large",i=[]){let a=await Fa(r,s,{method:"POST",body:e});if(a.status===413)throw new Error(t);if(!a.ok){let o=await a.json().catch(()=>null);throw typeof o?.code=="string"&&i.includes(o.code)?new Error(o.code):new Error("doc_upload_failed")}return await a.json()}async function Ba(r,s,e,t){let i=new FormData;i.append("entry_id",s);for(let o of t)i.append("tags",o);i.append("file",e,e.name);let a=await Ua(r,"/api/maintenance_supporter/document/upload",i);if(!a.id)throw new Error("doc_upload_failed");return{id:a.id,deduped:!!a.deduped,duplicate_in_object:a.duplicate_in_object??null}}async function Mr(r,s,e){return(await Ba(r,s,e,["photo"])).id}async function Vi(r,s,e){await Promise.all(e.map(t=>r.connection.sendMessagePromise({type:"maintenance_supporter/documents/discard_upload",entry_id:s,doc_id:t}).catch(()=>{})))}var td,zr=y(()=>{"use strict";ei();td=500*1024*1024});var Ge,Gi=y(()=>{"use strict";R();zr();Ge=class{constructor(s,e){this.host=s;this.opts=e;this.photos=[];this.uploadedIds=[];this.uploading=!1;this.errorKey="";this._session=0;this._uploadEntry=new Map;this.max=e.max??10,s.addController(this)}hostConnected(){}get ids(){return this.photos.map(s=>s.id)}get remaining(){return Math.max(this.max-this.photos.length,0)}get full(){return this.remaining===0}errorText(s){return this.errorKey?n(this.errorKey,s).replace("{max}",String(this.max)):""}clearError(){this.errorKey=""}reset(s=[]){this._endSession(),this._revokeAll(),this.photos=s.map(e=>({id:e,preview:""})),this.uploadedIds=[],this._uploadEntry.clear(),this.errorKey="",this.host.requestUpdate()}async addFiles(s){if(s.length===0)return;let e=this._session,t=this.opts.hass(),i=this.opts.entryId(),a=s.slice(0,this.remaining);this.uploading=!0,this.errorKey="",this.host.requestUpdate();try{for(let o of a){let d=await Mr(t,i,o);if(e!==this._session){Vi(t,i,[d]);return}this.uploadedIds=[...this.uploadedIds,d],this._uploadEntry.set(d,i),this.photos=[...this.photos,{id:d,preview:URL.createObjectURL(o)}],this.host.requestUpdate()}s.length>a.length&&(this.errorKey="photos_limit")}catch(o){if(e!==this._session)return;this.errorKey=o instanceof Error&&o.message==="doc_too_large"?"doc_too_large":"doc_upload_failed"}finally{e===this._session&&(this.uploading=!1,this.host.requestUpdate())}}remove(s){let e=this.photos.find(t=>t.id===s);e?.preview&&URL.revokeObjectURL(e.preview),this.photos=this.photos.filter(t=>t.id!==s),this.uploadedIds.includes(s)&&(this.uploadedIds=this.uploadedIds.filter(t=>t!==s),this._discard([s])),this.host.requestUpdate()}discardOrphans(){if(this._endSession(),this.uploadedIds.length===0)return;let s=this.uploadedIds;this.uploadedIds=[],this._discard(s)}markAttached(){this._endSession(),this.uploadedIds=[],this._uploadEntry.clear()}_endSession(){this._session++,this.uploading=!1}_discard(s){let e=new Map;for(let i of s){let a=this._uploadEntry.get(i)??this.opts.entryId();this._uploadEntry.delete(i),e.set(a,[...e.get(a)??[],i])}let t=this.opts.hass();for(let[i,a]of e)Vi(t,i,a)}_revokeAll(){for(let s of this.photos)s.preview&&URL.revokeObjectURL(s.preview)}}});function Ke(r){let s=(r??"").trim();if(s==="")return null;let e=Number(s.replace(",","."));return!Number.isFinite(e)||e<0?null:Math.round(e)}var ti=y(()=>{"use strict"});function Wa(r){let e=q("2001-02-03",r).match(/\d+/g)||[],t=d=>e.findIndex(h=>Number(h)===d),i=t(2001),a=t(2),o=t(3);return i===0?"YMD":a>=0&&o>=0&&a<o?"MDY":"DMY"}function Ye(r,s,e){if(r<1e3||r>9999||s<1||s>12||e<1||e>31)return null;let t=new Date(r,s-1,e);return t.getFullYear()!==r||t.getMonth()!==s-1||t.getDate()!==e?null:`${r}-${String(s).padStart(2,"0")}-${String(e).padStart(2,"0")}`}function Fr(r,s){let e=r.trim(),t;if(t=e.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))return Ye(+t[1],+t[2],+t[3]);if(t=e.match(/^(\d{4})$/))return Ye(+t[1],1,1);if(t=e.match(/^(\d{1,2})[./](\d{4})$/))return Ye(+t[2],+t[1],1);if(t=e.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/))return Ye(+t[3],+t[2],+t[1]);if(t=e.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)){let i=+t[1],a=+t[2],o=+t[3];return Wa(s)==="MDY"?Ye(o,i,a):Ye(o,a,i)}return null}var Ur=y(()=>{"use strict";R()});function Va(r,s){if(s)switch(r){case"date":return s.split("T")[0];case"time":return s.length===5?`${s}:00`:s;case"datetime":{let[e,t="00:00:00"]=s.split("T");return`${e} ${t.length===5?`${t}:00`:t}`}}}function Ga(r,s){if(typeof s!="string"||!s)return"";switch(r){case"date":return s.slice(0,10);case"time":return s.slice(0,5);case"datetime":{let[e,t="00:00:00"]=s.split(" ");return`${e}T${t.length===5?`${t}:00`:t}`}}}var M,Qe=y(()=>{"use strict";C();H();R();Ur();M=class extends S{constructor(){super(...arguments);this.kind="date";this.label="";this.value="";this.clearable=!1;this.disabled=!1;this.required=!1;this.lang="en";this._typing=!1;this._typed="";this._typedInvalid=!1}_startTyping(){this._typed=this.value,this._typedInvalid=!1,this._typing=!0,this.updateComplete.then(()=>this.shadowRoot?.querySelector("input.typed")?.focus())}_commitTyped(){if(!this._typed.trim()){this._typing=!1;return}let e=Fr(this._typed,this.lang);if(!e){this._typedInvalid=!0;return}this._typing=!1,this._typedInvalid=!1,this._emit(e)}_onTypedKey(e){e.key==="Enter"?(e.preventDefault(),this._commitTyped()):e.key==="Escape"&&(e.preventDefault(),this._typing=!1,this._typedInvalid=!1)}_selector(){switch(this.kind){case"date":return{date:{}};case"time":return{time:{no_second:!0}};case"datetime":return{datetime:{}}}}_onSelectorChange(e){e.stopPropagation(),this._emit(Ga(this.kind,e.detail?.value))}_clear(){this._emit("")}_emit(e){e!==this.value&&(this.value=e,this.dispatchEvent(new CustomEvent("value-changed",{bubbles:!0,composed:!0,detail:{value:e}})))}render(){return l`
      <div class="field">
        ${this.label?l`<span class="label">${this.label}${this.required?l`<span class="req">*</span>`:p}</span>`:p}
        <div class="row">
          ${this._typing?l`<input class="typed" type="text" inputmode="numeric" autocomplete="off"
                .value=${this._typed}
                placeholder=${q("1978-03-15",this.lang)}
                aria-invalid=${this._typedInvalid?"true":"false"}
                @input=${e=>{this._typed=e.target.value,this._typedInvalid=!1}}
                @keydown=${this._onTypedKey}
                @blur=${this._commitTyped} />`:l`<ha-selector
                .hass=${this.hass}
                .selector=${this._selector()}
                .value=${Va(this.kind,this.value)}
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
    `}};M.styles=$`
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
    .helper {
      font-size: 11px;
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .helper.invalid { color: var(--error-color, #f44336); font-style: normal; }
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
  `,c([f({attribute:!1})],M.prototype,"hass",2),c([f()],M.prototype,"kind",2),c([f()],M.prototype,"label",2),c([f()],M.prototype,"value",2),c([f()],M.prototype,"helper",2),c([f({type:Boolean})],M.prototype,"clearable",2),c([f({type:Boolean})],M.prototype,"disabled",2),c([f({type:Boolean})],M.prototype,"required",2),c([f()],M.prototype,"lang",2),c([u()],M.prototype,"_typing",2),c([u()],M.prototype,"_typed",2),c([u()],M.prototype,"_typedInvalid",2);customElements.get("ms-date-field")||customElements.define("ms-date-field",M)});function ii(){if(window.externalApp!==void 0)return!0;let s=typeof navigator<"u"&&navigator.userAgent||"";return/Home Assistant\//.test(s)&&/Android/.test(s)}var Ki=y(()=>{"use strict"});function Et(r){try{return localStorage.getItem(r)}catch{return null}}function St(r,s){try{localStorage.setItem(r,s)}catch{}}var ye,Yi=y(()=>{"use strict";ye={objectSections:"msp-object-sections",printOptions:"msp-print-options",batteryRosterOpen:"msp-bf-roster-open",docSort:"msp-doc-sort",cameraLabel:"msp-camera-label",overviewTab:"msp-overview-tab",collapsedSections:"msp-collapsed-sections",chartRange:"msp-chart-range",chartHideOutliers:"msp-chart-hide-outliers",taskSort:"maintenance_supporter_sort",objectSort:"maintenance_supporter_object_sort",groupBy:"maintenance_supporter_groupby",objectView:"maintenance_supporter_object_view",objectsCache:"msp-objects-cache",gettingStartedDismissed:"msp-gs-dismissed",batteryRosterSort:"ms_bf_roster_sort",areaSort:"msp-area-sort"}});function Yr(){if(!ii())return!1;let r=typeof navigator<"u"?navigator.mediaDevices:void 0;return!!r&&typeof r.getUserMedia=="function"}function Vr(r){let s=/camera2?\s*(\d+)/i.exec(r);return s?Number(s[1]):Number.MAX_SAFE_INTEGER}function Gr(r,s){if(s){let t=r.find(i=>i.label===s);if(t)return t}return r.filter(t=>t.label&&Qr.test(t.label)).sort((t,i)=>Vr(t.label)-Vr(i.label))[0]??null}var Ka,Ya,Qa,Ja,Br,Qr,Wr,Kr,Za,K,Qi=y(()=>{"use strict";C();H();R();Ki();Yi();Ka=1920,Ya=.88,Qa={retryMs:500,windowMs:5e3},Ja=new Set(["NotReadableError","AbortError","TrackStartError"]),Br=80,Qr=/back|rear|environment|rück|hinten/i,Wr=/front|user|selfie|vorne/i;Kr=r=>r?.name||"Error",Za=r=>r?.message||"",K=class extends S{constructor(){super(...arguments);this.lang="en";this._open=!1;this._busy=!1;this._switching=!1;this._devices=[];this._deviceIndex=-1;this._switchFailed=!1;this._copied=!1;this.timing={...Qa};this._facing="environment";this._stream=null;this._opening=!1;this._gen=0;this._refused=new Set;this._log=[];this._t0=0;this._lastError=""}async open(){if(this._open||this._opening)return;this._opening=!0;let e=++this._gen;try{await this._acquireAndShow(e)}finally{this._opening=!1}}_live(e){return e===this._gen&&this.isConnected}async _acquireAndShow(e){let t=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!t||typeof t.getUserMedia!="function"){this._unavailable("no_media_devices");return}this._log=[],this._t0=Date.now(),this._lastError="",this._refused.clear(),this._switchFailed=!1,this._copied=!1,this._note(navigator.userAgent);let i=Et(ye.cameraLabel),a=await this._enumerate(t);if(!this._live(e))return;let o=Gr(a,i),d="refused";if(o&&(d=await this._openPatiently(t,e,this._byDevice(o))),d==="cancelled")return;if(d!=="ok"){if(d=await this._openPatiently(t,e,{video:{facingMode:{ideal:"environment"}},what:"facing environment"}),d==="cancelled")return;if(d!=="ok"){this._unavailable(this._lastError||"camera_unavailable");return}if(a=await this._enumerate(t),!this._live(e)){this._stopStream();return}}if(this._devices=a,this._deviceIndex=this._indexOfCurrent(),this._facing=this._currentFacing(),this._open=!0,await this.updateComplete,!this._live(e)){this._stopStream(),this._open=!1;return}await this._attach();let h=o?null:Gr(a,i),_=this._deviceIndex>=0?a[this._deviceIndex]:void 0;if(!h||h.deviceId===_?.deviceId)return;let m=await this._replace(t,e,[this._byDevice(h)],this._restoreCandidates(_));if(m!=="cancelled"){if(m==="lost"){this._unavailable("camera_lost");return}this._settle(m)}}async _openPatiently(e,t,i){let a=Date.now();for(;;){let o;try{o=await e.getUserMedia({video:i.video,audio:!1})}catch(d){let h=Kr(d),_=Za(d);if(this._lastError=h,this._note(`${i.what} \u2192 ${h}${_&&_!==h?`: ${_}`:""}`),!this._live(t))return"cancelled";if(!Ja.has(h))return"refused";if(Date.now()-a+this.timing.retryMs>this.timing.windowMs)return"busy";if(await new Promise(m=>setTimeout(m,this.timing.retryMs)),!this._live(t))return"cancelled";continue}if(!this._live(t)){for(let d of o.getTracks())d.stop();return"cancelled"}return this._stream=o,this._note(`${i.what} \u2192 ok (${this._describeTrack()})`),"ok"}}async _replace(e,t,i,a){this._switching=!0,this._stopStream();try{for(let o of i){let d=await this._openPatiently(e,t,o);if(d==="ok")return o;if(d==="cancelled")return d;if(d==="busy"){o.deviceId&&this._refused.add(o.deviceId);break}}for(let o of a){let d=await this._openPatiently(e,t,o);if(d==="ok")return"restored";if(d==="cancelled")return d}return"lost"}finally{this._switching=!1}}_settle(e){if(e==="restored"){this._switchFailed=!0;let i=this._indexOfCurrent();return i>=0&&(this._deviceIndex=i),this._attach(),!1}this._switchFailed=!1;let t=e.deviceId?this._devices.findIndex(i=>i.deviceId===e.deviceId):-1;return this._deviceIndex=t>=0?t:this._indexOfCurrent(),this._facing=this._currentFacing(),this._attach(),!0}_byDevice(e){return{video:{deviceId:{exact:e.deviceId}},what:e.label||"camera (no label)",deviceId:e.deviceId}}_restoreCandidates(e,t){let i=[],a=e?.deviceId||t;return a&&i.push({video:{deviceId:{exact:a}},what:`${e?.label||"previous camera"} (back again)`,deviceId:a}),i.push({video:{facingMode:{ideal:this._facing}},what:`facing ${this._facing} (back again)`}),i}async _attach(){let e=this._video;if(!(!e||!this._stream)){e.srcObject=this._stream;try{await e.play()}catch{}}}async _enumerate(e){if(typeof e.enumerateDevices!="function")return[];try{let t=(await e.enumerateDevices()).filter(i=>i.kind==="videoinput"&&!!i.deviceId);return this._note(`cameras: ${t.map(i=>i.label||"(no label)").join(" | ")||"none listed"}`),t}catch(t){return this._note(`enumerateDevices \u2192 ${Kr(t)}`),[]}}_indexOfCurrent(){let e=this._stream?.getVideoTracks()[0];if(!e)return-1;let t=e.getSettings().deviceId,i=t?this._devices.findIndex(a=>a.deviceId===t):-1;return i>=0?i:e.label?this._devices.findIndex(a=>a.label===e.label):-1}_currentFacing(){let e=this._stream?.getVideoTracks()[0],t=e?.getSettings().facingMode;if(t==="user"||t==="environment")return t;let i=(this._deviceIndex>=0?this._devices[this._deviceIndex]?.label:"")||e?.label||"";return Wr.test(i)?"user":Qr.test(i)?"environment":this._facing}_describeTrack(){let e=this._stream?.getVideoTracks()[0];if(!e)return"no track";let t=e.getSettings(),i=t.width&&t.height?`${t.width}\xD7${t.height}`:"size ?";return[e.label||"no label",i,t.facingMode].filter(Boolean).join(", ")}_note(e){this._log.push(`+${Date.now()-this._t0} ms ${e}`),this._log.length>Br&&this._log.splice(1,this._log.length-Br)}async _switchCamera(){let e=typeof navigator<"u"?navigator.mediaDevices:void 0;if(!e||this._devices.length<2||this._busy||this._switching)return;let t=this._gen,i=this._deviceIndex,a=i>=0?this._devices[i]:void 0,o=this._stream?.getVideoTracks()[0]?.getSettings().deviceId||a?.deviceId,d=this._facing==="user"?"environment":"user",h=this._nextCameras(i,o);!h.length&&this._refused.size&&(this._refused.clear(),h=this._nextCameras(i,o)),this._note(`switch from ${a?.label||"unknown camera"}`);let _=[...h.map(m=>this._byDevice(this._devices[m])),{video:{facingMode:{exact:d}},what:`facing ${d} (exact)`},{video:{facingMode:{ideal:d}},what:`facing ${d}`}];this._busy=!0,this._switchFailed=!1,this._copied=!1;try{let m=await this._replace(e,t,_,this._restoreCandidates(a,o));if(m==="cancelled")return;if(m==="lost"){this._unavailable("camera_lost");return}if(m!=="restored"&&!m.deviceId){if(this._isCamera(o,this._facing)){this._switchFailed=!0,await this._attach();return}this._facing=d}if(this._settle(m)&&m!=="restored"&&m.deviceId){let b=this._devices[this._deviceIndex]?.label??"";b&&St(ye.cameraLabel,Wr.test(b)?"":b)}}finally{this._busy=!1}}_nextCameras(e,t){let i=this._devices.length,a=[];for(let o=1;o<=(e<0?i:i-1);o++){let d=(e+o)%i,h=this._devices[d].deviceId;h===t||this._refused.has(h)||a.push(d)}return a}_isCamera(e,t){let i=this._stream?.getVideoTracks()[0]?.getSettings();return e&&i?.deviceId?i.deviceId===e:!!i?.facingMode&&i.facingMode===t}close(){this._gen++,this._stopStream(),this._open=!1,this._busy=!1,this._switching=!1}disconnectedCallback(){super.disconnectedCallback(),this._gen++,this._stopStream()}get _video(){return this.shadowRoot?.querySelector("video")??null}_stopStream(){for(let t of this._stream?.getTracks()??[])t.stop();this._stream=null;let e=this._video;e&&(e.srcObject=null)}_unavailable(e){this._stopStream(),this._open=!1,this.dispatchEvent(new CustomEvent("capture-unavailable",{detail:{reason:e},bubbles:!0,composed:!0}))}async _copyLog(){let e=this._log.join(`
`),t=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(e),t=!0)}catch{}if(!t){let i=this.shadowRoot?.querySelector(".details textarea");if(i){i.focus(),i.select();try{t=document.execCommand("copy")}catch{t=!1}}}this._copied=t}async _shoot(){let e=this._video;if(!(!e||this._busy||this._switching)){this._busy=!0;try{let t=e.videoWidth||640,i=e.videoHeight||480,a=Math.min(1,Ka/Math.max(t,i)),o=document.createElement("canvas");o.width=Math.round(t*a),o.height=Math.round(i*a);let d=o.getContext("2d");if(!d)throw new Error("no_canvas");d.drawImage(e,0,0,o.width,o.height);let h=await new Promise(b=>o.toBlob(b,"image/jpeg",Ya));if(!h)throw new Error("no_blob");let _=new Date().toISOString().replace(/[-:]/g,"").slice(0,15),m=new File([h],`photo-${_}.jpg`,{type:"image/jpeg"});this.close(),this.dispatchEvent(new CustomEvent("photo-captured",{detail:{file:m},bubbles:!0,composed:!0}))}catch(t){this._unavailable(t instanceof Error?t.message:String(t))}finally{this._busy=!1}}}render(){if(!this._open)return p;let e=this.lang,t=this._busy||this._switching;return l`
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
    `}};K.styles=$`
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
  `,c([f({type:String})],K.prototype,"lang",2),c([u()],K.prototype,"_open",2),c([u()],K.prototype,"_busy",2),c([u()],K.prototype,"_switching",2),c([u()],K.prototype,"_devices",2),c([u()],K.prototype,"_deviceIndex",2),c([u()],K.prototype,"_switchFailed",2),c([u()],K.prototype,"_copied",2);customElements.get("ms-camera-capture")||customElements.define("ms-camera-capture",K)});var si,Y,Tt=y(()=>{"use strict";C();H();R();Ki();Qi();Qi();si=$`
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
`,Y=class extends S{constructor(){super(...arguments);this.lang="en";this.disabled=!1;this.busy=!1;this.accept="image/*";this.showCamera=!0;this.showGallery=!0;this.compact=!1;this.remaining=1/0;this._singlePick=ii();this._inAppCamera=Yr()}createRenderRoot(){return this}get _locked(){return this.disabled||this.busy}_emit(e){e.length!==0&&this.dispatchEvent(new CustomEvent("files-picked",{detail:{files:e},bubbles:!0,composed:!0}))}_onInput(e){let t=e.target,i=Array.from(t.files??[]);t.value="",this._emit(i)}_onCameraClick(e){!this._inAppCamera||this._locked||(e.preventDefault(),this.querySelector("ms-camera-capture")?.open())}_onCameraUnavailable(){this._inAppCamera=!1,this.querySelector(".photo-pick-camera input")?.click()}_onKeydown(e){e.key!=="Enter"&&e.key!==" "||(e.preventDefault(),!this._locked&&e.currentTarget.click())}render(){if(this.remaining<=0||!this.showCamera&&!this.showGallery)return p;let e=this.lang,t=this._locked?"disabled":"",i=this.busy?n("uploading",e):n("doc_camera",e),a=n(this._singlePick?"choose_photo":"choose_photos",e);return l`
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
    `}};c([f({type:String})],Y.prototype,"lang",2),c([f({type:Boolean})],Y.prototype,"disabled",2),c([f({type:Boolean})],Y.prototype,"busy",2),c([f({type:String})],Y.prototype,"accept",2),c([f({type:Boolean})],Y.prototype,"showCamera",2),c([f({type:Boolean})],Y.prototype,"showGallery",2),c([f({type:Boolean})],Y.prototype,"compact",2),c([f({type:Number})],Y.prototype,"remaining",2),c([u()],Y.prototype,"_inAppCamera",2);customElements.get("ms-photo-picker")||customElements.define("ms-photo-picker",Y)});var Je,T,Ji=y(()=>{"use strict";C();H();Ae();R();be();Zt();wt();Gt();Jt();Wi();Gi();ti();Qe();Tt();Tt();Je=ve,T=class extends S{constructor(){super(...arguments);this.entryId="";this.taskId="";this.taskName="";this.lang="en";this.checklist=[];this.adaptiveEnabled=!1;this.taskType="";this.readingUnit="";this.readings=[];this.readingHistory=[];this.restockDefault=null;this.restockUnitCost=null;this.restockPackage="";this.currencySymbol="";this.partsCostMode="purchase";this.parts=[];this.consumesParts=[];this.consumesInfo=[];this.requiredFields=[];this.phaseLabel="";this.requireTagScan=!1;this.viaTagScan=!1;this._open=!1;this._notes="";this._cost="";this._duration="";this._loading=!1;this._error="";this._checklistState={};this._feedback="needed";this._photos=new Ge(this,{entryId:()=>this.entryId,hass:()=>this.hass});this._readingValue="";this._readingValues={};this._restockQty="";this._completedAt="";this._usedParts={};this._usedQtyText={};this.checklistPrefill={}}open(e={}){this._open||(this._open=!0,this.viaTagScan=!!e.viaTagScan,this._notes="",this._cost="",this._duration="",this._error="",this._checklistState=Object.fromEntries(this.checklist.map((t,i)=>[String(i),!!this.checklistPrefill[t]]).filter(([,t])=>t)),this._feedback="needed",this._photos.reset(),this._readingValue="",this._readingValues={},this._restockQty=this.restockDefault!==null?String(this.restockDefault):"",this._completedAt="",this._usedParts=Object.fromEntries(this.consumesParts.map(t=>[ee(t),{...t}])),this._usedQtyText={})}_rangeError(e,t){let i=this.lang;return n("settings_value_out_of_range",i).replace("{min}",L(e,i,{maximumFractionDigits:2})).replace("{max}",L(t,i,{maximumFractionDigits:2}))}_toggleCheck(e){let t=String(e);this._checklistState={...this._checklistState,[t]:!this._checklistState[t]}}_setFeedback(e){this._feedback=e}async _complete(){if(this._loading||this._photos.uploading)return;this._error="",this._photos.clearError();let e={type:"maintenance_supporter/task/complete",entry_id:this.entryId,task_id:this.taskId};if(this._notes&&(e.notes=this._notes),this._cost){let a=parseFloat(this._cost);!isNaN(a)&&a>=0&&(e.cost=a)}let t=Ke(this._duration);if(t!==null&&(e.duration=t),this.checklist.length>0&&(e.checklist_state=this._checklistState),this.adaptiveEnabled&&(e.feedback=this._feedback),this._photos.photos.length>0&&(e.photo_doc_ids=this._photos.ids),this.viaTagScan&&(e.via_tag_scan=!0),this._completedAt){if(new Date(this._completedAt).getTime()>Date.now()){this._error=n("completed_at_future_error",this.lang);return}e.completed_at=this._completedAt.length===16?`${this._completedAt}:00`:this._completedAt}if(this.readings.length>0){let a={};for(let o of this.readings){let d=(this._readingValues[o.id]??"").trim();if(d==="")continue;let h=parseFloat(d.replace(",","."));isNaN(h)||(a[o.id]=h)}Object.keys(a).length>0&&(e.reading_values=a)}else if(this._readingValue!==""){let a=parseFloat(this._readingValue);isNaN(a)||(e.reading_value=a)}if(this.restockDefault!==null&&this._restockQty.trim()!==""){let a=parseFloat(this._restockQty.replace(",","."));if(!Number.isFinite(a)||a<Be[0]||a>Be[1]){this._error=this._rangeError(...Be);return}e.restock_quantity=a}if(this.parts.length>0){let a=[];for(let[o,d]of Object.entries(this._usedParts)){let h=this._usedQtyText[o],_=h===void 0?d.quantity:parseFloat(h.replace(",","."));if(!Number.isFinite(_)||_<Je[0]||_>Je[1]){this._error=this._rangeError(...Je);return}a.push({...d,quantity:_})}e.used_parts=a.map(o=>o.entry_id?{part_id:o.part_id,quantity:o.quantity,entry_id:o.entry_id}:{part_id:o.part_id,quantity:o.quantity})}await O(this,e,{busy:a=>{this._loading=a},lang:this.lang,fallbackKey:"save_error",onError:a=>{this._error=a}})!==void 0&&(this._photos.markAttached(),this._open=!1,this.dispatchEvent(new CustomEvent("task-completed")))}_renderReadingField(e,t){let i=this._completedAt?new Date(this._completedAt).getTime():NaN,a=br(this.readingHistory,e.id,isNaN(i)?void 0:i),o=e.unit||this.readingUnit,d=(this._readingValues[e.id]??"").trim(),h=d===""?NaN:parseFloat(d.replace(",",".")),_=a!==void 0&&!isNaN(h)&&h<a.value,m=a!==void 0?L(a.value,t,{maximumFractionDigits:3}):"";return l`
      <label class="field reading-field">
        <span class="field-label">${e.name}${o?` (${o})`:""}</span>
        <input type="text" inputmode="decimal" class="field-input"
          placeholder=${a!==void 0?n("reading_last",t).replace("{value}",m):""}
          .value=${this._readingValues[e.id]??""}
          @input=${b=>{this._readingValues={...this._readingValues,[e.id]:b.target.value}}} />
        ${_?l`<span class="reading-warn">${n("reading_below_last",t).replace("{value}",m)}</span>`:p}
      </label>`}get _missingRequired(){let e={notes:this._notes.trim()!=="",cost:this._cost.trim()!=="",duration:this._duration.trim()!=="",photo:this._photos.photos.length>0,user:!!this.hass?.user};return this.requiredFields.filter(t=>!e[t])}_req(e){return this.requiredFields.includes(e)?l`<span class="req-mark" aria-hidden="true">*</span>`:p}_purchaseSuggestion(){if(this.restockDefault===null)return null;let e=parseFloat(this._restockQty);return this.restockUnitCost==null||!Number.isFinite(e)||e<=0?null:Math.round(this.restockUnitCost*e*100)/100}_partsValue(){if(this.restockDefault!==null||!this.parts.length)return null;let e=0,t=!1;for(let i of Object.values(this._usedParts)){let a=this.parts.find(d=>ee({part_id:d.id,entry_id:d.entry_id})===ee(i)),o=Ir(a);o!==null&&(e+=o*(i.quantity||1),t=!0)}return t?Math.round(e*100)/100:null}_renderCostSuggestion(e){let t=this._purchaseSuggestion();if(this.restockDefault!==null){let d=this.partsCostMode==="use"?l`<div class="cost-note">${n("cost_purchase_use_hint",e)}</div>`:p;if(this._cost.trim()!==""||t==null||t<=0)return d;let h=le(t,this.currencySymbol,e);return l`<button
          type="button"
          class="cost-suggestion"
          @click=${()=>this._cost=String(Math.round(t*100)/100)}
        >${n("cost_from_parts",e).replace("{amount}",h)}</button>${d}`}let i=this._partsValue();if(i==null||i<=0)return p;let a=le(i,this.currencySymbol,e),o=this.partsCostMode==="use"?"cost_parts_booked":"cost_parts_info";return l`<div class="cost-note">${n(o,e).replace("{amount}",a)}</div>`}_close(){this._open=!1,this._photos.discardOrphans()}_pickCompletedAt(){this._completedAt=qr(new Date)}render(){if(!this._open)return l``;let e=this.lang||this.hass?.language||"en",t=this._error||this._photos.errorText(e);return l`
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
                <label class="checklist-item" @click=${()=>this._toggleCheck(a)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(a)]} />
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
                ${this.parts.map(i=>{let a=ee({part_id:i.id,entry_id:i.entry_id}),o=this._usedParts[a],d=o!==void 0,h=i.entry_id?{part_id:i.id,quantity:1,entry_id:i.entry_id}:{part_id:i.id,quantity:1};return l`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${d}
                        @change=${_=>{let m={...this._usedParts};if(_.target.checked)m[a]=m[a]||h;else{delete m[a];let b={...this._usedQtyText};delete b[a],this._usedQtyText=b}this._usedParts=m}} />
                      <span
                        >${i.name}${i.owner_name?l`<span class="used-part-owner"> (${i.owner_name})</span>`:p}${i.stock!==null&&i.stock!==void 0?` (${Me(i.stock,i.unit,e)})`:""}</span
                      >
                    </label>
                    ${d?l`<input class="used-part-qty" type="number" min=${Je[0]} max=${Je[1]} step="0.01"
                          .value=${this._usedQtyText[a]??String(o.quantity)}
                          @input=${_=>{let m=_.target.value;this._usedQtyText={...this._usedQtyText,[a]:m};let b=parseFloat(m.replace(",","."));Number.isFinite(b)&&b>=Je[0]&&(this._usedParts={...this._usedParts,[a]:{...h,quantity:b}})}} />`:p}
                  </div>`})}
              </div>`:this.consumesInfo.length?l`<div class="consumes-hint">
                  ${this.consumesInfo.map(i=>l`<div>${i}</div>`)}
                </div>`:p}
          ${this.restockDefault!==null?l`
              <label class="field">
                <span class="field-label">${n("restock_quantity_label",e)}${this.restockPackage?` (\xD7 ${this.restockPackage})`:""}</span>
                <input type="number" step="0.01" min=${Be[0]} max=${Be[1]} class="field-input"
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
            <span class="field-label">${n("notes_optional",e)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${i=>this._notes=i.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${n("cost_optional",e)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${i=>this._cost=i.target.value} />
            ${this._renderCostSuggestion(e)}
          </label>
          <label class="field">
            <span class="field-label">${n("duration_minutes",e)}${this._req("duration")}</span>
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
                  @value-changed=${i=>this._completedAt=i.detail.value}
                ></ms-date-field>`:l`<button type="button" class="backdate-pick" @click=${this._pickCompletedAt}>
                  <ha-icon icon="mdi:calendar-clock"></ha-icon>${n("completed_at_pick",e)}
                </button>`}
          </div>
          <div class="field">
            <span class="field-label">${n("completion_photos_optional",e)}${this._req("photo")}</span>
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
            title=${this._photos.uploading?n("uploading",e):this._missingRequired.length?this._missingRequired.map(i=>n("err_required",e).replace("{field}",n($t[i]??i,e))).join(" \xB7 "):""}
          >
            ${this._loading?n("completing",e):n("complete",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};T.styles=[zt,si,$`
    .req-mark {
      color: var(--error-color, #f44336);
      margin-left: 2px;
      font-weight: 600;
    }
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
  `],c([f({attribute:!1})],T.prototype,"hass",2),c([f()],T.prototype,"entryId",2),c([f()],T.prototype,"taskId",2),c([f()],T.prototype,"taskName",2),c([f()],T.prototype,"lang",2),c([f({type:Array})],T.prototype,"checklist",2),c([f({type:Boolean})],T.prototype,"adaptiveEnabled",2),c([f()],T.prototype,"taskType",2),c([f()],T.prototype,"readingUnit",2),c([f({attribute:!1})],T.prototype,"readings",2),c([f({attribute:!1})],T.prototype,"readingHistory",2),c([f({attribute:!1})],T.prototype,"restockDefault",2),c([f({attribute:!1})],T.prototype,"restockUnitCost",2),c([f({attribute:!1})],T.prototype,"restockPackage",2),c([f()],T.prototype,"currencySymbol",2),c([f({attribute:!1})],T.prototype,"partsCostMode",2),c([f({attribute:!1})],T.prototype,"parts",2),c([f({attribute:!1})],T.prototype,"consumesParts",2),c([f({type:Array})],T.prototype,"consumesInfo",2),c([f({type:Array})],T.prototype,"requiredFields",2),c([f()],T.prototype,"phaseLabel",2),c([f({type:Boolean})],T.prototype,"requireTagScan",2),c([f({type:Boolean})],T.prototype,"viaTagScan",2),c([u()],T.prototype,"_open",2),c([u()],T.prototype,"_notes",2),c([u()],T.prototype,"_cost",2),c([u()],T.prototype,"_duration",2),c([u()],T.prototype,"_loading",2),c([u()],T.prototype,"_error",2),c([u()],T.prototype,"_checklistState",2),c([u()],T.prototype,"_feedback",2),c([u()],T.prototype,"_readingValue",2),c([u()],T.prototype,"_readingValues",2),c([u()],T.prototype,"_restockQty",2),c([u()],T.prototype,"_completedAt",2),c([u()],T.prototype,"_usedParts",2),c([u()],T.prototype,"_usedQtyText",2),c([f({attribute:!1})],T.prototype,"checklistPrefill",2);customElements.get("maintenance-complete-dialog")||customElements.define("maintenance-complete-dialog",T)});function A(r){return r.toFixed(1)}var ri=y(()=>{"use strict";R()});var D,Xi=y(()=>{"use strict";C();H();D=class extends S{constructor(){super(...arguments);this.label="";this.value="";this.placeholder="";this.type="text";this.required=!1;this.disabled=!1;this.multiline=!1;this.rows=3}_onInput(e){let t=e.target.value;this.value=t,this.dispatchEvent(new CustomEvent("input",{bubbles:!0,composed:!0,detail:{value:t}}))}render(){return l`
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
    `}};D.styles=$`
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
  `,c([f()],D.prototype,"label",2),c([f()],D.prototype,"value",2),c([f()],D.prototype,"placeholder",2),c([f()],D.prototype,"type",2),c([f({type:Boolean})],D.prototype,"required",2),c([f({type:Boolean})],D.prototype,"disabled",2),c([f()],D.prototype,"step",2),c([f()],D.prototype,"min",2),c([f()],D.prototype,"max",2),c([f()],D.prototype,"pattern",2),c([f()],D.prototype,"helper",2),c([f({type:Boolean})],D.prototype,"multiline",2),c([f({type:Number})],D.prototype,"rows",2);customElements.get("ms-textfield")||customElements.define("ms-textfield",D)});var j,Jr=y(()=>{"use strict";C();H();R();be();Xi();Qe();j=class extends S{constructor(){super(...arguments);this.objects=[];this._open=!1;this._loading=!1;this._error="";this._name="";this._manufacturer="";this._model="";this._serialNumber="";this._areaId="";this._installationDate="";this._warrantyExpiry="";this._documentationUrl="";this._notes="";this._haDeviceId="";this._parentEntryId="";this._entryId=null;this._replacing=!1;this._oldDeviceId="";this._replaceDevice="keep"}get _lang(){return I(this.hass)}openCreate(){this._entryId=null,this._name="",this._manufacturer="",this._model="",this._serialNumber="",this._areaId="",this._installationDate="",this._warrantyExpiry="",this._documentationUrl="",this._notes="",this._haDeviceId="",this._parentEntryId="",this._replacing=!1,this._error="",this._open=!0}openReplace(e,t){this._entryId=e,this._replacing=!0,this._name=t.name||"",this._oldDeviceId=t.ha_device_id||"",this._haDeviceId="",this._replaceDevice="keep",this._error="",this._open=!0}openEdit(e,t){this._entryId=e,this._name=t.name||"",this._manufacturer=t.manufacturer||"",this._model=t.model||"",this._serialNumber=t.serial_number||"",this._areaId=t.area_id||"",this._installationDate=t.installation_date||"",this._warrantyExpiry=t.warranty_expiry||"",this._documentationUrl=t.documentation_url||"",this._notes=t.notes||"",this._haDeviceId=t.ha_device_id||"",this._parentEntryId=t.parent_entry_id||"",this._replacing=!1,this._error="",this._open=!0}async _replace(){if(this._loading||!this._entryId)return;let e={type:"maintenance_supporter/object/replace",entry_id:this._entryId,name:this._name.trim()||null};this._oldDeviceId?(this._replaceDevice==="other"&&(e.ha_device_id=this._haDeviceId),this._replaceDevice==="none"&&(e.ha_device_id=null)):this._haDeviceId&&(e.ha_device_id=this._haDeviceId);let t=await O(this,e,{busy:i=>{this._loading=i},fallbackKey:"save_error",onError:i=>{this._error=i}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-replaced",{detail:{entry_id:t?.entry_id,device_swap:t?.device_swap}})))}_deviceName(e){let i=this.hass?.devices?.[e];return i?.name_by_user||i?.name||e}_deviceSelector(e){return l`<ha-form
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
    `}async _save(){if(this._loading||!this._name.trim())return;this._error="";let e={name:this._name,manufacturer:this._manufacturer||null,model:this._model||null,serial_number:this._serialNumber||null,area_id:this._areaId||null,installation_date:this._installationDate||null,warranty_expiry:this._warrantyExpiry||null,documentation_url:this._documentationUrl.trim()||null,notes:this._notes.trim()||null,ha_device_id:this._haDeviceId||null,parent_entry_id:this._parentEntryId||null},t=await O(this,this._entryId?{type:"maintenance_supporter/object/update",entry_id:this._entryId,...e}:{type:"maintenance_supporter/object/create",...e},{busy:i=>{this._loading=i},fallbackKey:"save_error",onError:i=>{this._error=i}});t!==void 0&&(this._open=!1,this.dispatchEvent(new CustomEvent("object-saved",{detail:{device_swap:t?.device_swap}})))}_parentChoices(){return(this.objects||[]).filter(e=>e.entry_id!==this._entryId)}_close(){this._open=!1}render(){if(!this._open)return l``;if(this._replacing)return this._renderReplace();let e=this._lang,t=this._entryId?n("edit_object",e):n("new_object",e);return l`
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
                      value=${i.entry_id}
                      ?selected=${this._parentEntryId===i.entry_id}
                    >${i.object.name}</option>`)}
                </select>
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
    `}};j.styles=$`
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
  `,c([f({attribute:!1})],j.prototype,"hass",2),c([f({attribute:!1})],j.prototype,"objects",2),c([u()],j.prototype,"_open",2),c([u()],j.prototype,"_loading",2),c([u()],j.prototype,"_error",2),c([u()],j.prototype,"_name",2),c([u()],j.prototype,"_manufacturer",2),c([u()],j.prototype,"_model",2),c([u()],j.prototype,"_serialNumber",2),c([u()],j.prototype,"_areaId",2),c([u()],j.prototype,"_installationDate",2),c([u()],j.prototype,"_warrantyExpiry",2),c([u()],j.prototype,"_documentationUrl",2),c([u()],j.prototype,"_notes",2),c([u()],j.prototype,"_haDeviceId",2),c([u()],j.prototype,"_parentEntryId",2),c([u()],j.prototype,"_entryId",2),c([u()],j.prototype,"_replacing",2),c([u()],j.prototype,"_oldDeviceId",2),c([u()],j.prototype,"_replaceDevice",2);customElements.get("maintenance-object-dialog")||customElements.define("maintenance-object-dialog",j)});var es,Zr,Xr,en=y(()=>{"use strict";es=["sensor","binary_sensor","number","input_number","input_boolean","switch","climate","vacuum","cover","fan","light","water_heater","humidifier","media_player","weather","air_quality","valve","lawn_mower","lock"],Zr=["sensor"],Xr=["temperature","humidity","pressure"]});var Xa,eo,ts,tn=y(()=>{"use strict";Xa={cleaning:"mdi:broom",inspection:"mdi:magnify",replacement:"mdi:swap-horizontal",calibration:"mdi:tune",service:"mdi:wrench",reading:"mdi:counter",custom:"mdi:wrench-clock"},eo="mdi:wrench-clock",ts=r=>r&&Xa[r]||eo});function rn(){return{entityIds:"",type:"threshold",attribute:"",above:"",below:"",equals:"",notEquals:"",forMinutes:"0",targetValue:"",deltaMode:!1,fromState:"",toState:"",targetChanges:"",runtimeHours:"",onStates:"",carry:{}}}function an(r){return{type:r.type||"threshold",attribute:r.attribute||"",above:r.trigger_above?.toString()??"",below:r.trigger_below?.toString()??"",equals:r.trigger_equals?.toString()??"",notEquals:r.trigger_not_equals?.toString()??"",forMinutes:r.trigger_for_minutes?.toString()??"0",targetValue:r.trigger_target_value?.toString()??"",deltaMode:r.trigger_delta_mode||!1,fromState:r.trigger_from_state||"",toState:r.trigger_to_state||"",targetChanges:r.trigger_target_changes?.toString()??"",runtimeHours:r.trigger_runtime_hours?.toString()??"",onStates:(r.trigger_on_states||[]).join(", ")}}function on(r,s){s.attribute&&(r.attribute=s.attribute);let e=parseInt(s.forMinutes,10);if(s.type==="threshold"){let t=parseFloat(s.above);isNaN(t)||(r.trigger_above=t);let i=parseFloat(s.below);isNaN(i)||(r.trigger_below=i);let a=parseFloat(s.equals);isNaN(a)||(r.trigger_equals=a);let o=parseFloat(s.notEquals);isNaN(o)||(r.trigger_not_equals=o),isNaN(e)||(r.trigger_for_minutes=e)}else if(s.type==="counter"){let t=parseFloat(s.targetValue);isNaN(t)||(r.trigger_target_value=t),r.trigger_delta_mode=s.deltaMode}else if(s.type==="state_change"){s.fromState&&(r.trigger_from_state=s.fromState),s.toState&&(r.trigger_to_state=s.toState);let t=parseInt(s.targetChanges,10);isNaN(t)||(r.trigger_target_changes=t),isNaN(e)||(r.trigger_for_minutes=e)}else if(s.type==="runtime"){let t=parseFloat(s.runtimeHours);isNaN(t)||(r.trigger_runtime_hours=t);let i=(s.onStates||"").split(",").map(a=>a.trim()).filter(Boolean);i.length>0&&(r.trigger_on_states=i)}}function oo(r){return{entityIds:(r.entity_ids||(r.entity_id?[r.entity_id]:[])).join(", "),...an(r),carry:Object.fromEntries(Object.entries(r).filter(([e])=>!ao.has(e)&&!e.startsWith("_")))}}function lo(r){let s=r.entityIds.split(",").map(t=>t.trim()).filter(Boolean);if(s.length===0)return null;let e={...r.carry||{},entity_id:s[0],entity_ids:s,type:r.type};return on(e,r),e}function co(r){return Array.from({length:7},(s,e)=>bt(e,r,"short"))}function po(r){return Array.from({length:12},(s,e)=>or(e,r,"short"))}var io,so,ro,ni,sn,nn,no,de,Ce,ao,g,is,ln=y(()=>{"use strict";C();H();R();zi();Gt();Ae();en();be();wt();ti();Wi();Xi();tn();Qe();io=["cleaning","inspection","replacement","calibration","service","reading","custom"],so=["low","normal","high"],ro=["time_based","weekdays","nth_weekday","day_of_month","calendar","sensor_based","one_time","manual"],ni=["weekdays","nth_weekday","day_of_month","calendar"],sn=["time_based","one_time",...ni],nn=["threshold","counter","state_change","runtime"],no=[...nn,"compound"],de={alpha:"0.3",min:"7",max:"365"},Ce=ve;ao=new Set(["entity_id","entity_ids","type","attribute","trigger_above","trigger_below","trigger_equals","trigger_not_equals","trigger_for_minutes","trigger_target_value","trigger_delta_mode","trigger_from_state","trigger_to_state","trigger_target_changes","trigger_runtime_hours","trigger_on_states"]);g=class g extends S{constructor(){super(...arguments);this.checklistsEnabled=!1;this.scheduleTimeEnabled=!1;this.completionActionsEnabled=!1;this.adaptiveFeature=!1;this.seasonalFeature=!1;this.environmentalFeature=!1;this.defaultWarningDays=7;this.parts=[];this._foreignOwners=[];this._open=!1;this._entityPickerFallback=!1;this._pickerProbeStrikes=0;this._loading=!1;this._error="";this._warning="";this._entryId="";this._taskId=null;this._isFleetTask=!1;this._objectChoices=[];this._name="";this._type="custom";this._scheduleType="time_based";this._intervalDays="30";this._intervalUnit="days";this._dueDate="";this._warningDays="7";this._earliestCompletionDays="";this._intervalAnchor="completion";this._weekdays=[];this._nth="1";this._nthWeekday="5";this._domDay="1";this._domLastDay=!1;this._domBusiness=!1;this._calOffset="0";this._calendarEntity="";this._seasonMonths=[];this._endsMode="never";this._endsCount="";this._endsUntil="";this._schedulePreview=[];this._schedulePreviewEnded=!1;this._previewSeq=0;this._notes="";this._documentationUrl="";this._customIcon="";this._notifyIcon="";this._priority="normal";this._labels="";this._mirrorTodoEntities=[];this._enabled=!0;this._triggerEntityId="";this._triggerEntityIds=[];this._triggerEntityLogic="any";this._triggerAttribute="";this._triggerType="threshold";this._triggerAbove="";this._triggerBelow="";this._triggerEquals="";this._triggerNotEquals="";this._triggerForMinutes="0";this._triggerCombinator="any";this._triggerTargetValue="";this._triggerDeltaMode=!1;this._triggerBaselineValue="";this._liveBaselineValue=null;this._autoCompleteOnRecovery=!1;this._triggerFromState="";this._triggerToState="";this._triggerTargetChanges="";this._triggerRuntimeHours="";this._triggerRuntimeMaxSession="";this._triggerOnStates="";this._compoundLogic="AND";this._compoundConditions=[];this._suggestedAttributes=[];this._availableAttributes=[];this._entityDomain="";this._lastPerformed="";this._nfcTagId="";this._requireTagScan=!1;this._allowSkip=!0;this._notifyEnabled=!0;this._readingUnit="";this._readings=[];this._consumesParts={};this._consumesQtyText={};this._partsLoadFailed=!1;this._availableTags=[];this._responsibleUserId=null;this._loadedLastPerformed="";this._loadedResponsibleUserId=null;this._assigneePool=[];this._rotationStrategy="";this._availableUsers=[];this._checklistText="";this._phaseDefs=[];this._phaseSeq=[];this._requiredCompletion=[];this._scheduleTime="";this._scheduleTimeOn=!1;this._actionService="";this._actionTargetEntity="";this._actionTargetStored=null;this._actionTargetInitial="";this._actionSkipAuto=!1;this._actionPresent=!1;this._actionData={};this._actionDataJsonFallback="";this._actionTesting=!1;this._actionTestResult="";this._actionTestError="";this._qcNotes="";this._qcCost="";this._qcDuration="";this._qcFeedback="";this._environmentalEntity="";this._environmentalAttribute="";this._environmentalInitial="";this._environmentalAttributeInitial="";this._adaptiveEnabled=!1;this._adaptiveAlpha=de.alpha;this._adaptiveMin=de.min;this._adaptiveMax=de.max;this._adaptiveSeasonal=!0;this._adaptivePrediction=!0;this._adaptiveInitial="";this._adaptiveWasEnabled=!1;this._userService=null;this._conditionAttrOptions={};this._conditionAttrPending=new Set}_adaptiveSnapshot(){return JSON.stringify([this._adaptiveEnabled,this._adaptiveAlpha,this._adaptiveMin,this._adaptiveMax,this._adaptiveSeasonal,this._adaptivePrediction])}get _lang(){return I(this.hass)}async openCreate(e,t){this._entryId=e,this._taskId=null,this._isFleetTask=!1,this._error="",this._warning="",!e&&t&&t.length>0?(this._objectChoices=t.map(i=>({entry_id:i.entry_id,name:i.object.name})).sort((i,a)=>i.name.localeCompare(a.name)),this._entryId=this._objectChoices[0].entry_id):this._objectChoices=[],this._resetFields(),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}async openEdit(e,t){this._entryId=e,this._taskId=t.id,this._error="",this._warning="",this._objectChoices=[],this._isFleetTask=t.battery_fleet_task===!0,this._name=t.name,this._type=t.type,this._scheduleType=t.schedule_type,this._intervalDays=t.interval_days!=null?String(t.interval_days):"",this._intervalUnit=t.interval_unit||"days",this._dueDate=t.due_date||"";let i=t.schedule;this._weekdays=i?.kind==="weekdays"?[...i.weekdays??[]]:[],this._nth=i?.kind==="nth_weekday"?String(i.nth??1):"1",this._nthWeekday=i?.kind==="nth_weekday"?String(i.weekday??5):"5",this._domDay=i?.kind==="day_of_month"&&(i.day??1)>=1?String(i.day??1):"1",this._domLastDay=i?.kind==="day_of_month"&&i.day===-1,this._domBusiness=i?.kind==="day_of_month"&&i.business===!0,this._calendarEntity=i?.kind==="calendar"&&i.entity_id||"",this._calOffset=i?.offset?String(i.offset):"0",this._seasonMonths=Array.isArray(i?.season_months)?[...i.season_months]:[];let a=i?.ends;a&&typeof a.count=="number"?(this._endsMode="count",this._endsCount=String(a.count),this._endsUntil=""):a&&typeof a.until=="string"?(this._endsMode="until",this._endsUntil=a.until,this._endsCount=""):(this._endsMode="never",this._endsCount="",this._endsUntil=""),this._warningDays=t.warning_days.toString(),this._earliestCompletionDays=t.earliest_completion_days!=null?String(t.earliest_completion_days):"",this._intervalAnchor=t.interval_anchor||"completion",this._notes=t.notes||"",this._documentationUrl=t.documentation_url||"",this._customIcon=t.custom_icon||"",this._notifyIcon=t.notify_icon||"",this._priority=t.priority||"normal",this._labels=(t.labels||[]).join(", "),this._mirrorTodoEntities=[...t.mirror_todo_entities||[]],this._enabled=t.enabled!==!1,this._lastPerformed=t.last_performed||"",this._loadedLastPerformed=this._lastPerformed,this._nfcTagId=t.nfc_tag_id||"",this._requireTagScan=!!t.require_tag_scan,this._allowSkip=t.allow_skip!==!1,this._notifyEnabled=t.notify_enabled!==!1,this._readingUnit=t.reading_unit||"",this._readings=(t.readings||[]).map(_=>({..._})),this._consumesParts=Object.fromEntries((t.consumes_parts||[]).map(_=>[ee(_),{..._}])),this._consumesQtyText={},this._responsibleUserId=t.responsible_user_id||null,this._loadedResponsibleUserId=this._responsibleUserId,this._assigneePool=[...t.assignee_pool||[]],this._rotationStrategy=t.rotation_strategy||"",this._checklistText=(t.checklist||[]).join(`
`),this._phaseDefs=Object.entries(t.phases||{}).map(([_,m])=>{let{name:b,checklist:k,consumes_parts:w,required_completion_fields:v,...x}=m,E=m.consumes_parts||[],P=E.findIndex(re=>!re.entry_id),V=P>=0?E[P]:void 0;return{id:_,name:m.name||_,checklistText:(m.checklist||[]).join(`
`),partId:V?.part_id||"",partQty:V?.quantity!=null?String(V.quantity):"",reqOverride:m.required_completion_fields!==void 0,reqFields:[...m.required_completion_fields||[]],extraParts:E.filter((re,Le)=>Le!==P).map(re=>({...re})),carry:x}}),this._phaseSeq=[...t.phase_sequence||[]],this._requiredCompletion=[...t.required_completion_fields||[]],this._scheduleTime=t.schedule_time||"",this._scheduleTimeOn=!!t.schedule_time;let o=t.on_complete_action;if(o&&o.service){this._actionService=o.service;let _=o.target?.entity_id;this._actionTargetEntity=Array.isArray(_)?_[0]||"":_||"",this._actionTargetStored=o.target&&typeof o.target=="object"?JSON.parse(JSON.stringify(o.target)):null,this._actionTargetInitial=this._actionTargetEntity,this._actionData=o.data&&typeof o.data=="object"?{...o.data}:{},this._actionDataJsonFallback="",this._actionSkipAuto=o.skip_auto===!0,this._actionPresent=!0}else this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1;let d=t.quick_complete_defaults;this._qcNotes=d?.notes||"",this._qcCost=d?.cost!=null?String(d.cost):"",this._qcDuration=d?.duration!=null?String(d.duration):"",this._qcFeedback=d?.feedback||"";let h=t.adaptive_config||{};if(this._environmentalEntity=h.environmental_entity||"",this._environmentalAttribute=h.environmental_attribute||"",this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute,this._adaptiveEnabled=!!h.enabled,this._adaptiveAlpha=h.ewa_alpha?.toString()??de.alpha,this._adaptiveMin=h.min_interval_days?.toString()??de.min,this._adaptiveMax=h.max_interval_days?.toString()??de.max,this._adaptiveSeasonal=h.seasonal_enabled!==!1,this._adaptivePrediction=h.sensor_prediction_enabled!==!1,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=this._adaptiveEnabled,t.trigger_config){let _=t.trigger_config;this._triggerEntityId=_.entity_id||_.entity_ids&&_.entity_ids[0]||"",this._triggerEntityIds=_.entity_ids||(_.entity_id?[_.entity_id]:[]),this._triggerEntityLogic=_.entity_logic||"any",this._setTypeFields(an(_)),this._triggerCombinator=_.trigger_combinator==="all"?"all":"any",this._triggerBaselineValue=_.trigger_baseline_value?.toString()||"",this._liveBaselineValue=t.trigger_baseline_value??null,this._autoCompleteOnRecovery=_.auto_complete_on_recovery||!1,this._triggerRuntimeMaxSession=_.trigger_runtime_max_session_seconds?.toString()||"",_.type==="compound"?(this._compoundLogic=_.compound_logic==="OR"?"OR":"AND",this._compoundConditions=(_.conditions||[]).map(oo)):(this._compoundLogic="AND",this._compoundConditions=[])}else this._resetTriggerFields();this._triggerEntityId&&this._fetchEntityAttributes(this._triggerEntityId),await Promise.all([this._loadUsers(),this._loadTags(),this._loadParts(),this._loadForeignPools()]),this._open=!0}_resetFields(){this._name="",this._type="custom",this._scheduleType="time_based",this._intervalDays="30",this._intervalUnit="days",this._dueDate="",this._warningDays=String(this.defaultWarningDays),this._earliestCompletionDays="",this._intervalAnchor="completion",this._weekdays=[],this._nth="1",this._nthWeekday="5",this._domDay="1",this._domLastDay=!1,this._domBusiness=!1,this._calOffset="0",this._seasonMonths=[],this._endsMode="never",this._endsCount="",this._endsUntil="",this._notes="",this._documentationUrl="",this._customIcon="",this._notifyIcon="",this._priority="normal",this._labels="",this._mirrorTodoEntities=[],this._enabled=!0,this._lastPerformed="",this._nfcTagId="",this._requireTagScan=!1,this._allowSkip=!0,this._readingUnit="",this._readings=[],this._consumesParts={},this._consumesQtyText={},this._responsibleUserId=null,this._assigneePool=[],this._rotationStrategy="",this._checklistText="",this._phaseDefs=[],this._phaseSeq=[],this._requiredCompletion=[],this._scheduleTime="",this._scheduleTimeOn=!1,this._environmentalEntity="",this._environmentalAttribute="",this._environmentalInitial="",this._environmentalAttributeInitial="",this._adaptiveEnabled=!1,this._adaptiveAlpha=de.alpha,this._adaptiveMin=de.min,this._adaptiveMax=de.max,this._adaptiveSeasonal=!0,this._adaptivePrediction=!0,this._adaptiveInitial=this._adaptiveSnapshot(),this._adaptiveWasEnabled=!1,this._actionService="",this._actionTargetEntity="",this._actionTargetStored=null,this._actionTargetInitial="",this._actionData={},this._actionDataJsonFallback="",this._actionSkipAuto=!1,this._actionPresent=!1,this._actionTesting=!1,this._actionTestResult="",this._qcNotes="",this._qcCost="",this._qcDuration="",this._qcFeedback="",this._resetTriggerFields()}_typeFields(){return{type:this._triggerType,attribute:this._triggerAttribute,above:this._triggerAbove,below:this._triggerBelow,equals:this._triggerEquals,notEquals:this._triggerNotEquals,forMinutes:this._triggerForMinutes,targetValue:this._triggerTargetValue,deltaMode:this._triggerDeltaMode,fromState:this._triggerFromState,toState:this._triggerToState,targetChanges:this._triggerTargetChanges,runtimeHours:this._triggerRuntimeHours,onStates:this._triggerOnStates}}_setTypeFields(e){this._triggerType=e.type,this._triggerAttribute=e.attribute,this._triggerAbove=e.above,this._triggerBelow=e.below,this._triggerEquals=e.equals,this._triggerNotEquals=e.notEquals,this._triggerForMinutes=e.forMinutes,this._triggerTargetValue=e.targetValue,this._triggerDeltaMode=e.deltaMode,this._triggerFromState=e.fromState,this._triggerToState=e.toState,this._triggerTargetChanges=e.targetChanges,this._triggerRuntimeHours=e.runtimeHours,this._triggerOnStates=e.onStates}_resetTriggerFields(){this._triggerEntityId="",this._triggerEntityIds=[],this._triggerEntityLogic="any",this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="",this._setTypeFields(rn()),this._triggerCombinator="any",this._triggerBaselineValue="",this._liveBaselineValue=null,this._autoCompleteOnRecovery=!1,this._triggerRuntimeMaxSession="",this._compoundLogic="AND",this._compoundConditions=[]}async _loadUsers(){this._userService||(this._userService=new Fe(this.hass));try{this._availableUsers=await this._userService.getUsers()}catch(e){console.error("Failed to load users:",e),this._availableUsers=[]}}_toggleAssignee(e){this._assigneePool=this._assigneePool.includes(e)?this._assigneePool.filter(t=>t!==e):[...this._assigneePool,e]}async _testAction(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e)){this._actionTestResult="error",this._actionTestError=n("action_test_bad_format",this._lang),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3);return}let[t,i]=e.split(".");if(!this.hass?.services?.[t]?.[i]){this._actionTestResult="error",this._actionTestError=n("action_test_unknown_service",this._lang).replace("{service}",e),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}let a=this._actionTargetEntity.trim();if(a){let o=a.split(".")[0];if(o!==t&&!new Set(["homeassistant","scene","notify","persistent_notification"]).has(t)){this._actionTestResult="error",this._actionTestError=n("action_test_domain_mismatch",this._lang).replace("{service}",e).replace("{domain}",t).replace("{entity}",a).replace("{entity_domain}",o).replace("{suggestion}",`${o}.${i}`),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}if(!this.hass.states?.[a]){this._actionTestResult="error",this._actionTestError=n("action_test_entity_missing",this._lang).replace("{entity}",a),setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},8e3);return}}this._actionTestResult="ok",setTimeout(()=>{this._actionTestResult="",this._actionTestError=""},5e3)}_buildActionData(){if(this._actionDataJsonFallback.trim())try{let e=JSON.parse(this._actionDataJsonFallback);if(e&&typeof e=="object"&&!Array.isArray(e))return e}catch{}return{...this._actionData}}_serviceSchema(){let e=this._actionService.trim();if(!e||!/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(e))return null;let[t,i]=e.split("."),a=this.hass?.services?.[t]?.[i]?.fields;return!a||Object.keys(a).length===0?null:Object.entries(a).map(([o,d])=>({name:o,required:!!d.required,selector:d.selector||{text:{}}}))}_actionTargetExtended(){let e=this._actionTargetStored;return e?Object.entries(e).some(([t,i])=>t==="entity_id"?Array.isArray(i)&&i.length>1:Array.isArray(i)?i.length>0:!!i):!1}_actionTargetSummary(){let e=this._actionTargetStored||{},t=a=>(Array.isArray(a)?a:[a]).filter(o=>typeof o=="string"&&!!o),i=this.hass;return[...t(e.entity_id).map(a=>i.states?.[a]?.attributes?.friendly_name||a),...t(e.device_id).map(a=>i.devices?.[a]?.name_by_user||i.devices?.[a]?.name||a),...t(e.area_id).map(a=>i.areas?.[a]?.name||a),...t(e.floor_id).map(a=>i.floors?.[a]?.name||a),...t(e.label_id)].join(", ")}_renderCompletionActionsSection(e){if(!this.completionActionsEnabled&&!this._actionPresent)return p;let t=this._serviceSchema();return l`
      <details class="ca-section">
        <summary>${n("on_complete_action_title",e)}</summary>
        <p class="field-help">${n("on_complete_action_desc",e)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${i=>{this._actionService=i.detail.value||"";let a=this._serviceSchema();if(a){let o=new Set(a.map(d=>d.name));this._actionData=Object.fromEntries(Object.entries(this._actionData).filter(([d])=>o.has(d)))}}}
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
        <ms-textfield
          label="${n("quick_complete_defaults_cost",e)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${i=>{this._qcCost=i.target.value}}
        ></ms-textfield>
        <ms-textfield
          label="${n("quick_complete_defaults_duration",e)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${i=>{this._qcDuration=i.target.value}}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${i=>{this._qcFeedback=i.target.value}}>
          <option value="">${n("quick_complete_defaults_feedback_none",e)}</option>
          <option value="needed">${n("quick_complete_defaults_feedback_needed",e)}</option>
          <option value="not_needed">${n("quick_complete_defaults_feedback_not_needed",e)}</option>
          <option value="not_sure">${n("feedback_not_sure",e)}</option>
        </select>
      </details>`:p}
    `}async _loadParts(){if(this.parts=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId});this.parts=e.parts||[],this._partsLoadFailed=!1}catch{this.parts=[],this._partsLoadFailed=!0}}async _loadForeignPools(){if(this._foreignOwners=[],!!this._entryId)try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._foreignOwners=(e.objects||[]).filter(t=>t.entry_id!==this._entryId&&(t.parts||[]).length>0).map(t=>({entry_id:t.entry_id,name:t.object?.name||t.entry_id,parts:t.parts||[]})).sort((t,i)=>t.name.localeCompare(i.name))}catch{this._foreignOwners=[]}}async _loadTags(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/tags/list"});this._availableTags=e.tags||[]}catch{this._availableTags=[]}}_fetchConditionAttributes(e){!e||!this.hass||this._conditionAttrOptions[e]||this._conditionAttrPending.has(e)||(this._conditionAttrPending.add(e),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e}).then(t=>{let i=t;this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:i.suggested_attributes||[],available:i.available_attributes||[]}}}).catch(()=>{this._conditionAttrOptions={...this._conditionAttrOptions,[e]:{suggested:[],available:[]}}}))}async _fetchEntityAttributes(e){if(!e||!this.hass){this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain="";return}try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/entity/attributes",entity_id:e});this._entityDomain=t.domain||"",this._suggestedAttributes=t.suggested_attributes||[],this._availableAttributes=t.available_attributes||[]}catch{this._suggestedAttributes=[],this._availableAttributes=[],this._entityDomain=""}}get _hasForeignPick(){return Object.values(this._consumesParts).some(e=>!!e.entry_id)}_renderConsumesRow(e,t){let i=ee({part_id:e.id,entry_id:t}),a=this._consumesParts[i],o=t?{part_id:e.id,quantity:1,entry_id:t}:{part_id:e.id,quantity:1};return l`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${a!==void 0}
            @change=${d=>{let h={...this._consumesParts};if(d.target.checked)h[i]=h[i]||o;else{delete h[i];let _={...this._consumesQtyText};delete _[i],this._consumesQtyText=_}this._consumesParts=h}}
          />
          <span>${e.name}${e.unit?` (${e.unit})`:""}</span>
        </label>
        ${a!==void 0?l`<input
              class="consumes-qty"
              type="number"
              min=${Ce[0]}
              max=${Ce[1]}
              step="0.01"
              .value=${this._consumesQtyText[i]??String(a.quantity)}
              @input=${d=>{let h=d.target.value;this._consumesQtyText={...this._consumesQtyText,[i]:h};let _=parseFloat(h.replace(",","."));Number.isFinite(_)&&_>=Ce[0]&&(this._consumesParts={...this._consumesParts,[i]:{...o,quantity:_}})}}
            />`:p}
      </div>
    `}_applyConsumesQtyText(){let e={...this._consumesParts};for(let t of Object.keys(e)){let i=this._consumesQtyText[t];if(i===void 0)continue;let a=parseFloat(i.replace(",","."));if(!Number.isFinite(a)||a<Ce[0]||a>Ce[1]){let o=d=>L(d,this._lang,{maximumFractionDigits:2});return this._error=n("settings_value_out_of_range",this._lang).replace("{min}",o(Ce[0])).replace("{max}",o(Ce[1])),!1}e[t]={...e[t],quantity:a}}return this._consumesParts=e,!0}_toggleRequired(e,t){let i=new Set(this._requiredCompletion);t?i.add(e):i.delete(e),this._requiredCompletion=[...i]}_patchReading(e,t){this._readings=this._readings.map(i=>i.id===e?{...i,...t}:i)}_renderReadingsEditor(e){let t=xr(this._readings);return l`
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
            <ha-icon-button class="phase-remove reading-remove" @click=${()=>this._readings=this._readings.filter(a=>a.id!==i.id)}>
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </ha-icon-button>
          </div>
        `)}
        ${this._readings.length<20?l`
          <ha-button appearance="plain" class="reading-add"
            @click=${()=>this._readings=[...this._readings,{id:gr(),name:"",unit:this._readings.length?this._readings[this._readings.length-1].unit:this._readingUnit}]}>
            <ha-icon icon="mdi:plus"></ha-icon> ${n("reading_add",e)}
          </ha-button>`:p}
      </div>
    `}_phaseSlug(e){let t=e.toLowerCase().replace(/[^a-z0-9_-]+/g,"-").replace(/^-+|-+$/g,"").slice(0,24)||"phase",i=t,a=2;for(;this._phaseDefs.some(o=>o.id===i);)i=`${t}-${a++}`;return i}_addPhaseDef(){let e=this._phaseSlug(`phase-${this._phaseDefs.length+1}`);this._phaseDefs=[...this._phaseDefs,{id:e,name:"",checklistText:"",partId:"",partQty:"",reqOverride:!1,reqFields:[],extraParts:[],carry:{}}]}_removePhaseDef(e){this._phaseDefs=this._phaseDefs.filter(t=>t.id!==e),this._phaseSeq=this._phaseSeq.filter(t=>t!==e)}_patchPhaseDef(e,t){this._phaseDefs=this._phaseDefs.map(i=>i.id===e?{...i,...t}:i)}_renderPhasesEditor(e){let t=i=>this._phaseDefs.find(a=>a.id===i)?.name||i;return l`
      <h3>${n("phases_section",e)}</h3>
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
                <input class="phase-qty" type="number" min=${ve[0]} step="0.01" placeholder="1" .value=${i.partQty}
                  @input=${a=>this._patchPhaseDef(i.id,{partQty:a.target.value})} />
              `:p}
            `:p}
            <ha-icon-button class="phase-remove" @click=${()=>this._removePhaseDef(i.id)}>
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
              ${Bi.map(a=>l`
                <label class="req-option">
                  <input
                    type="checkbox"
                    .checked=${i.reqFields.includes(a)}
                    @change=${o=>{let d=o.target.checked,h=new Set(i.reqFields);d?h.add(a):h.delete(a),this._patchPhaseDef(i.id,{reqFields:[...h]})}}
                  />
                  <span>${n($t[a],e)}</span>
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
              <button class="phase-chip-x" @click=${()=>{this._phaseSeq=this._phaseSeq.filter((o,d)=>d!==a)}}>✕</button>
            </span>
          `)}
          <select
            class="phase-seq-add"
            .value=${""}
            @change=${i=>{let a=i.target.value;a&&(this._phaseSeq=[...this._phaseSeq,a]),i.target.value=""}}
          >
            <option value="">+ ${n("phase_sequence_add_step",e)}</option>
            ${this._phaseDefs.filter(i=>i.name.trim()).map(i=>l`<option value=${i.id}>${i.name}</option>`)}
          </select>
        </div>
      `:p}
    `}async _save(){if(!this._loading&&this._name.trim()){if(this._adaptiveSnapshot()!==this._adaptiveInitial){let e=parseInt(this._adaptiveMin,10),t=parseInt(this._adaptiveMax,10);if(!isNaN(e)&&!isNaN(t)&&e>t){this._error=`${n("adaptive_min_interval",this._lang)} > ${n("adaptive_max_interval",this._lang)}`;return}}if(this._triggerType==="threshold"&&this._thresholdLimitsOverlap()){this._error=n("trigger_hint_overlap",this._lang);return}if(this._scheduleType==="calendar"&&!this._calendarEntity.trim().startsWith("calendar.")){this._error=n("calendar_entity_required",this._lang);return}if(this._applyConsumesQtyText()){this._loading=!0,this._error="";try{let e=await O(this,()=>this.hass.connection.sendMessagePromise(this._savePayload()),{fallbackKey:"save_error",onError:o=>{this._error=o}});if(e===void 0)return;let t=this._taskId||e?.task_id,i=this._environmentalEntity!==this._environmentalInitial||this._environmentalAttribute!==this._environmentalAttributeInitial;this._warning="";let a=o=>{this._warning=n("subsave_warning",this._lang).replace("{detail}",o)};if(t&&this._scheduleType==="sensor_based"&&i&&await O(this,{type:"maintenance_supporter/task/set_environmental_entity",entry_id:this._entryId,task_id:t,environmental_entity:this._environmentalEntity||null,environmental_attribute:this._environmentalAttribute||null},{onError:a})!==void 0&&(this._environmentalInitial=this._environmentalEntity,this._environmentalAttributeInitial=this._environmentalAttribute),t&&this._adaptiveSnapshot()!==this._adaptiveInitial){let o=parseFloat(this._adaptiveAlpha),d=parseInt(this._adaptiveMin,10),h=parseInt(this._adaptiveMax,10);await O(this,{type:"maintenance_supporter/task/set_adaptive",entry_id:this._entryId,task_id:t,enabled:this._adaptiveEnabled,...o>=xt[0]&&o<=xt[1]?{ewa_alpha:o}:{},...!isNaN(d)&&d>=1?{min_interval_days:d}:{},...!isNaN(h)&&h>=1?{max_interval_days:h}:{},seasonal_enabled:this._adaptiveSeasonal,sensor_prediction_enabled:this._adaptivePrediction},{onError:a})!==void 0&&(this._adaptiveInitial=this._adaptiveSnapshot())}this._warning?t&&(this._taskId=t):this._open=!1,this.dispatchEvent(new CustomEvent("task-saved"))}finally{this._loading=!1}}}}_savePayload(){let e={type:this._taskId?"maintenance_supporter/task/update":"maintenance_supporter/task/create",entry_id:this._entryId,name:this._name,task_type:this._type,schedule_type:this._scheduleType,warning_days:Number.isNaN(parseInt(this._warningDays,10))?this.defaultWarningDays:Math.max(0,parseInt(this._warningDays,10))},t=this._earliestCompletionDays.trim();e.earliest_completion_days=t===""?null:Math.max(0,parseInt(t,10)||0),this._taskId&&(e.task_id=this._taskId),this._scheduleType==="one_time"?(e.due_date=this._dueDate||null,e.interval_days=null):ni.includes(this._scheduleType)?(e.schedule={...this._buildSchedule(),...this._recurrenceExtras()},e.interval_days=null,this._taskId&&(e.due_date=null)):(this._taskId&&(e.due_date=null),this._scheduleType!=="manual"&&this._intervalDays?(e.interval_days=parseInt(this._intervalDays,10),e.interval_unit=this._intervalUnit,e.interval_anchor=this._intervalAnchor,this._scheduleType==="time_based"&&(e.schedule={kind:"interval",...this._recurrenceExtras()})):this._taskId&&(e.interval_days=null,e.interval_anchor="completion")),e.notes=this._notes||null,e.documentation_url=this._documentationUrl||null,e.custom_icon=this._customIcon||null,e.notify_icon=this._notifyIcon.trim()||null,e.priority=this._priority,e.labels=this._labels.split(",").map(i=>i.trim()).filter(Boolean),e.mirror_todo_entities=this._mirrorTodoEntities.filter(Boolean),e.enabled=this._enabled,(!this._taskId||this._lastPerformed!==this._loadedLastPerformed)&&(e.last_performed=this._lastPerformed||null),e.nfc_tag_id=this._nfcTagId||null,e.require_tag_scan=this._requireTagScan,e.allow_skip=this._allowSkip,e.notify_enabled=this._notifyEnabled,e.reading_unit=this._readingUnit.trim()||null,e.readings=wr(this._readings);{let i={};for(let o of this._phaseDefs){if(!o.name.trim())continue;let d={...o.carry,name:o.name.trim()},h=o.checklistText.split(`
`).map(m=>m.trim()).filter(Boolean);h.length&&(d.checklist=h);let _=[];if(o.partId){let m=parseFloat(o.partQty);_.push({part_id:o.partId,quantity:Number.isFinite(m)&&m>0?m:1})}for(let m of o.extraParts)_.push(m.entry_id?{part_id:m.part_id,quantity:m.quantity,entry_id:m.entry_id}:{part_id:m.part_id,quantity:m.quantity});_.length&&(d.consumes_parts=_),o.reqOverride&&(d.required_completion_fields=[...o.reqFields]),i[o.id]=d}let a=this._phaseSeq.filter(o=>o in i);e.phases=Object.keys(i).length&&a.length?i:null,e.phase_sequence=e.phases?a:null}if((this.parts.length||this._foreignOwners.length)&&(e.consumes_parts=Object.values(this._consumesParts).map(i=>i.entry_id?{part_id:i.part_id,quantity:i.quantity,entry_id:i.entry_id}:{part_id:i.part_id,quantity:i.quantity})),(!this._taskId||this._responsibleUserId!==this._loadedResponsibleUserId)&&(e.responsible_user_id=this._responsibleUserId),e.assignee_pool=this._assigneePool,e.required_completion_fields=this._requiredCompletion,e.rotation_strategy=this._assigneePool.length>=2&&this._rotationStrategy?this._rotationStrategy:null,this._scheduleType==="sensor_based"&&this._triggerType==="compound"){let i=this._compoundConditions.map(lo).filter(a=>a!==null);if(i.length>0){let a={type:"compound",compound_logic:this._compoundLogic,conditions:i};this._autoCompleteOnRecovery&&(a.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(a.trigger_combinator="all"),e.trigger_config=a}else this._taskId&&(e.trigger_config=null)}else if(this._scheduleType==="sensor_based"&&this._triggerEntityId){let i=this._triggerEntityIds.length>0?this._triggerEntityIds:[this._triggerEntityId],a={entity_id:i[0],entity_ids:i,type:this._triggerType};if(on(a,this._typeFields()),this._autoCompleteOnRecovery&&(a.auto_complete_on_recovery=!0),this._triggerCombinator==="all"&&(a.trigger_combinator="all"),i.length>1&&(a.entity_logic=this._triggerEntityLogic),this._triggerType==="counter"&&this._triggerDeltaMode&&this._triggerBaselineValue){let o=parseFloat(this._triggerBaselineValue);!isNaN(o)&&o>=0&&(a.trigger_baseline_value=o)}else if(this._triggerType==="runtime"&&this._triggerRuntimeMaxSession){let o=parseInt(this._triggerRuntimeMaxSession,10);!isNaN(o)&&o>0&&(a.trigger_runtime_max_session_seconds=o)}e.trigger_config=a}else this._taskId&&(e.trigger_config=null);if(this.scheduleTimeEnabled&&sn.includes(this._scheduleType)){let i=this._scheduleTimeOn?this._scheduleTime.trim():"";e.schedule_time=/^([01]\d|2[0-3]):[0-5]\d$/.test(i)?i:null}if(this.checklistsEnabled){let i=this._checklistText.split(`
`).map(a=>a.trim()).filter(Boolean).slice(0,100);e.checklist=i.length?i:null}if(this.completionActionsEnabled||this._actionPresent){let i=this._actionService.trim();if(i&&/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(i)){let a={service:i},o=this._actionTargetEntity.trim();this._actionTargetStored&&o===this._actionTargetInitial?a.target=JSON.parse(JSON.stringify(this._actionTargetStored)):o&&(a.target={entity_id:o});let d=this._buildActionData();Object.keys(d).length>0&&(a.data=d),this._actionSkipAuto&&(a.skip_auto=!0),e.on_complete_action=a}else e.on_complete_action=null}if(this.completionActionsEnabled){let i={};this._qcNotes.trim()&&(i.notes=this._qcNotes.trim());let a=parseFloat(this._qcCost);!isNaN(a)&&a>=0&&(i.cost=a);let o=Ke(this._qcDuration);o!==null&&(i.duration=o),this._qcFeedback&&(i.feedback=this._qcFeedback),e.quick_complete_defaults=Object.keys(i).length?i:null}return e}_close(){this._open=!1,this._warning="",this._pickerProbeTimer!==void 0&&(clearTimeout(this._pickerProbeTimer),this._pickerProbeTimer=void 0),this._pickerProbeStrikes=0}_renderTriggerFields(){if(this._scheduleType!=="sensor_based")return p;let e=this._lang,t=this._triggerType==="compound";return l`
      <h3>${n("trigger_configuration",e)}</h3>
      <div class="select-row">
        <label>${n("trigger_type",e)}</label>
        <select
          .value=${this._triggerType}
          @change=${i=>this._triggerType=i.target.value}
        >
          ${no.map(i=>l`<option value=${i} ?selected=${i===this._triggerType}>${n(i,e)}</option>`)}
        </select>
      </div>
      ${t?this._renderCompoundEditor():l`
        ${this._entityPickerFallback?l`
          <ms-textfield
            label="${n("entity_id",e)} (${n("comma_separated",e)})"
            .value=${this._triggerEntityIds.length>0?this._triggerEntityIds.join(", "):this._triggerEntityId}
            @input=${i=>{let o=i.target.value.split(",").map(d=>d.trim()).filter(Boolean);this._triggerEntityId=o[0]||"",this._triggerEntityIds=o,o[0]&&this._fetchEntityAttributes(o[0])}}
          ></ms-textfield>
        `:l`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{name:"trigger_entities",selector:{entity:{multiple:!0,domain:es}}}]}
          .data=${{trigger_entities:this._triggerEntityIds.length>0?this._triggerEntityIds:this._triggerEntityId?[this._triggerEntityId]:[]}}
          .computeLabel=${()=>n("entity_id",e)}
          @value-changed=${i=>{let a=(i.detail.value.trigger_entities||[]).filter(Boolean);this._triggerEntityId=a[0]||"",this._triggerEntityIds=a,a[0]?this._fetchEntityAttributes(a[0]):this._fetchEntityAttributes("")}}
        ></ha-form>`}
        ${this._triggerEntityIds.length>1?l`
          <div class="select-row">
            <label>${n("entity_logic",e)}</label>
            <select
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
      <label>
        <input
          type="checkbox"
          .checked=${this._autoCompleteOnRecovery}
          @change=${i=>this._autoCompleteOnRecovery=i.target.checked}
        />
        ${n("auto_complete_on_recovery",e)}
      </label>
      <div class="field-help">${n("auto_complete_on_recovery_help",e)}</div>
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
              <select
                @change=${i=>this._triggerCombinator=i.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator==="any"}>${n("trigger_combinator_any",e)}</option>
                <option value="all" ?selected=${this._triggerCombinator==="all"}>${n("trigger_combinator_all",e)}</option>
              </select>
            </div>
          `:p}
    `}_patchCondition(e,t){this._compoundConditions=this._compoundConditions.map((i,a)=>a===e?{...i,...t}:i)}_addCondition(){this._compoundConditions=[...this._compoundConditions,rn()]}_removeCondition(e){this._compoundConditions=this._compoundConditions.filter((t,i)=>i!==e)}_renderCompoundEditor(){let e=this._lang;return l`
      <div class="select-row">
        <label>${n("compound_logic",e)}</label>
        <select
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
          .schema=${[{name:"condition_entities",selector:{entity:{multiple:!0,domain:es}}}]}
          .data=${{condition_entities:e.entityIds.split(",").map(o=>o.trim()).filter(Boolean)}}
          .computeLabel=${()=>n("entity_id",i)}
          @value-changed=${o=>{let d=(o.detail.value.condition_entities||[]).filter(Boolean);this._patchCondition(t,{entityIds:d.join(", ")})}}
        ></ha-form>`}
        ${this._renderConditionAttribute(e,t)}
        <div class="select-row">
          <label>${n("trigger_type",i)}</label>
          <select
            .value=${e.type}
            @change=${o=>this._patchCondition(t,{type:o.target.value})}
          >
            ${nn.map(o=>l`<option value=${o} ?selected=${o===e.type}>${n(o,i)}</option>`)}
          </select>
        </div>
        ${this._renderConditionTypeFields(e,t)}
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
            min=${xt[0]}
            max=${xt[1]}
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
          <select
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
    `}_renderEnvironmentalAttribute(e){this._fetchConditionAttributes(this._environmentalEntity);let t=this._conditionAttrOptions[this._environmentalEntity];return this._renderAttributeSelect({label:n("environmental_attribute_optional",e),value:this._environmentalAttribute,suggested:t?.suggested??[],available:t?.available??[],onSelect:i=>this._environmentalAttribute=i})}_renderConditionAttribute(e,t){let i=e.entityIds.split(",")[0]?.trim()||"";i&&this._fetchConditionAttributes(i);let a=i?this._conditionAttrOptions[i]:void 0;return this._renderAttributeSelect({label:n("attribute_optional",this._lang),value:e.attribute,suggested:a?.suggested??[],available:a?.available??[],onSelect:o=>this._patchCondition(t,{attribute:o})})}_renderConditionTypeFields(e,t){let i=this._lang;if(e.type==="threshold")return l`
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
      `}return p}_renderUnitSelect(){let e=this._lang;return l`
      <div class="select-row">
        <label>${n("interval_unit",e)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${t=>this._intervalUnit=t.target.value}
        >
          ${["days","weeks","months","years"].map(t=>l`<option value=${t} ?selected=${t===this._intervalUnit}>${n("unit_"+t,e)}</option>`)}
        </select>
      </div>`}_toggleWeekday(e){this._weekdays=this._weekdays.includes(e)?this._weekdays.filter(t=>t!==e):[...this._weekdays,e]}_previewScheduleDict(){if(this._scheduleType==="one_time")return this._dueDate?{kind:"one_time",due_date:this._dueDate}:null;if(this._scheduleType==="calendar"&&!this._calendarEntity.trim())return null;if(ni.includes(this._scheduleType))return{...this._buildSchedule(),...this._recurrenceExtras()};let e=parseInt(this._intervalDays,10);return this._scheduleType==="manual"||!e||e<=0?null:{kind:"interval",every:e,unit:this._intervalUnit,anchor:this._intervalAnchor,...this._recurrenceExtras()}}updated(e){super.updated?.(e),this._scheduleEntityPickerProbe();for(let t of e.keys())if(g._PREVIEW_RELEVANT.has(String(t))){this._schedulePreviewRefresh();return}}_scheduleEntityPickerProbe(){this._entityPickerFallback||this._pickerProbeTimer!==void 0||!this._open||this._scheduleType!=="sensor_based"||(this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),1500))}_probeEntityPickers(){if(this._pickerProbeTimer=void 0,this._entityPickerFallback||!this._open)return;let e=this.shadowRoot?.querySelector("ha-form.entity-picker-form"),t=(this.shadowRoot?.querySelector(".content")?.offsetHeight??0)>0;if(!e||!t){this._pickerProbeStrikes=0;return}let i=(h,_,m=0)=>{if(!(!h||m>10)){(h.tagName?.toLowerCase()??"")==="ha-entity-picker"&&_.push(h);for(let b of[h.shadowRoot,h])if(b)for(let k of Array.from(b.children??[]))i(k,_,m+1)}},a=[...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form")??[]],o=[];for(let h of a)i(h,o);let d=o.length===0||o.some(h=>h.offsetHeight===0);if(e.offsetHeight===0||d){if(this._pickerProbeStrikes+=1,this._pickerProbeStrikes>=2){this._entityPickerFallback=!0;return}this._pickerProbeTimer=setTimeout(()=>this._probeEntityPickers(),700)}else this._pickerProbeStrikes=0}_schedulePreviewRefresh(){this._previewTimer&&clearTimeout(this._previewTimer),this._previewTimer=setTimeout(()=>{this._fetchSchedulePreview()},300)}async _fetchSchedulePreview(){let e=this._open?this._previewScheduleDict():null;if(!e){this._schedulePreview=[],this._schedulePreviewEnded=!1;return}let t=++this._previewSeq;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/schedule/preview",schedule:e,...this._lastPerformed?{last_performed:this._lastPerformed}:{}});if(t!==this._previewSeq)return;this._schedulePreview=i.occurrences||[],this._schedulePreviewEnded=!!i.series_ended}catch{}}_renderSchedulePreview(){if(this._schedulePreview.length===0)return p;let e=this._lang,t=this.scheduleTimeEnabled&&this._scheduleTimeOn&&this._scheduleTime?` ${this._scheduleTime}`:"",i=this._schedulePreview.map((o,d)=>{let h=new Date(`${o}T12:00:00`).getDay();return`${bt(h===0?6:h-1,e,"short")} ${q(o,e)}${d===0?t:""}`}).join(" \xB7 "),a=this._scheduleType==="time_based"&&this._intervalAnchor==="completion"?l`<div class="field-help">${n("schedule_preview_ontime",e)}</div>`:p;return l`
      <div class="trigger-live-hint schedule-preview">
        ${n("schedule_preview_title",e)}: ${i}${this._schedulePreviewEnded?l` <span class="field-help">${n("schedule_preview_ends",e)}</span>`:p}
        ${a}
      </div>
    `}_buildSchedule(){let e=i=>{let a=parseInt(this._calOffset,10)||0;return a&&(i.offset=Math.max(-yt,Math.min(a,yt))),i};if(this._scheduleType==="weekdays")return e({kind:"weekdays",weekdays:[...this._weekdays].sort((i,a)=>i-a)});if(this._scheduleType==="nth_weekday")return e({kind:"nth_weekday",nth:parseInt(this._nth,10),weekday:parseInt(this._nthWeekday,10)});if(this._scheduleType==="calendar")return e({kind:"calendar",entity_id:this._calendarEntity.trim()});let t={kind:"day_of_month",day:this._domLastDay?-1:parseInt(this._domDay,10)||1};return this._domBusiness&&(t.business=!0),e(t)}_recurrenceExtras(){let e={};if(this._seasonMonths.length&&(e.season_months=[...this._seasonMonths].sort((t,i)=>t-i)),this._endsMode==="count"){let t=parseInt(this._endsCount,10);t>=1&&(e.ends={count:t})}else this._endsMode==="until"&&this._endsUntil&&(e.ends={until:this._endsUntil});return e}_toggleSeasonMonth(e){this._seasonMonths=this._seasonMonths.includes(e)?this._seasonMonths.filter(t=>t!==e):[...this._seasonMonths,e]}_renderRecurrenceExtras(){let e=this._lang;if(!(this._scheduleType==="time_based"||ni.includes(this._scheduleType)))return p;let i=po(e);return l`
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
        <select .value=${this._endsMode}
          @change=${a=>this._endsMode=a.target.value}>
          <option value="never" ?selected=${this._endsMode==="never"}>${n("series_end_never",e)}</option>
          <option value="count" ?selected=${this._endsMode==="count"}>${n("series_end_after_count",e)}</option>
          <option value="until" ?selected=${this._endsMode==="until"}>${n("series_end_until",e)}</option>
        </select>
      </div>
      ${this._endsMode==="count"?l`
        <ms-textfield
          label="${n("series_end_count_label",e)}"
          type="number" min="1"
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
    `}_renderCalendarFields(){let e=this._lang,t=co(e);if(this._scheduleType==="weekdays")return l`
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
          <select .value=${this._nth} @change=${a=>this._nth=a.target.value}>
            ${i.map(([a,o])=>l`<option value=${a} ?selected=${a===this._nth}>${o}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${n("recurrence_weekday",e)}</label>
          <select .value=${this._nthWeekday} @change=${a=>this._nthWeekday=a.target.value}>
            ${t.map((a,o)=>l`<option value=${String(o)} ?selected=${String(o)===this._nthWeekday}>${a}</option>`)}
          </select>
        </div>
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
        ${this._renderCalOffsetField()}`:p}_renderCalOffsetField(){let e=this._lang;return l`
      <ms-textfield
        label="${n("recurrence_offset",e)}"
        helper="${n("recurrence_offset_help",e)}"
        type="number"
        min=${-yt}
        max=${yt}
        .value=${this._calOffset}
        @input=${t=>this._calOffset=t.target.value}
      ></ms-textfield>`}_thresholdLimitsOverlap(){let e=parseFloat(this._triggerAbove),t=parseFloat(this._triggerBelow);return!isNaN(e)&&!isNaN(t)&&t>e}_renderTriggerLiveHint(){if(this._triggerType==="compound")return p;let e=this._triggerType==="threshold"&&this._thresholdLimitsOverlap()?l`<div class="trigger-live-hint warn">${n("trigger_hint_overlap",this._lang)}</div>`:p,t=this._triggerEntityId||this._triggerEntityIds[0];if(!t||!this.hass?.states)return e;let i=this.hass.states[t];if(!i)return e;let a=this._lang,o=i.attributes?.unit_of_measurement,d=typeof o=="string"&&o?` ${o}`:"",h=this._triggerAttribute?i.attributes?.[this._triggerAttribute]:i.state,_=typeof h=="number"?h:parseFloat(String(h)),m=h!=="unknown"&&h!=="unavailable"&&h!=null&&!isNaN(_),b=w=>L(w,a,{maximumFractionDigits:1}),k=[];if(this._triggerType==="threshold"){let w=parseFloat(this._triggerAbove),v=parseFloat(this._triggerBelow);if(isNaN(w)&&isNaN(v))return p;m&&k.push(n("trigger_hint_now",a).replace("{value}",b(_)+d)),isNaN(w)||k.push(n("trigger_hint_above",a).replace("{target}",b(w)+d)),isNaN(v)||k.push(n("trigger_hint_below",a).replace("{target}",b(v)+d))}else if(this._triggerType==="counter"){let w=parseFloat(this._triggerTargetValue);if(isNaN(w))return p;this._triggerDeltaMode?this._taskId?k.push(n("trigger_hint_counter_delta_edit",a).replace("{target}",b(w)+d)):m?k.push(n("trigger_hint_counter_delta",a).replace("{value}",b(_)+d).replace("{due}",b(_+w)+d).replace("{target}",b(w)+d)):k.push(n("trigger_hint_counter_delta_edit",a).replace("{target}",b(w)+d)):(m&&k.push(n("trigger_hint_now",a).replace("{value}",b(_)+d)),k.push(n("trigger_hint_counter_abs",a).replace("{target}",b(w)+d)))}else if(this._triggerType==="runtime"){let w=parseFloat(this._triggerRuntimeHours);if(isNaN(w))return p;k.push(n("trigger_hint_runtime",a).replace("{hours}",b(w))),k.push(n("trigger_hint_state_now",a).replace("{value}",String(i.state)))}else if(this._triggerType==="state_change"){let w=parseInt(this._triggerTargetChanges,10)||1,v=this._triggerToState.trim();k.push((v?n("trigger_hint_state_change_to",a).replace("{state}",v):n("trigger_hint_state_change",a)).replace("{count}",String(w))),k.push(n("trigger_hint_state_now",a).replace("{value}",String(i.state)))}return k.length?l`<div class="trigger-live-hint">${k.join(" ")}</div>${e}`:e}_renderTriggerTypeFields(){let e=this._lang;return this._triggerType==="threshold"?l`
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
          min=${Ar[0]}
          .value=${this._triggerTargetChanges}
          @input=${t=>this._triggerTargetChanges=t.target.value}
        ></ms-textfield>
        <div class="field-help">${n("target_changes_help",e)}</div>
        ${(this._triggerTargetChanges||"1")==="1"&&(this._triggerFromState||this._triggerToState)?l`<div class="field-help">${n("state_latch_help",e)}</div>`:p}
        <ms-textfield
          label="${n("for_at_least_minutes",e)}"
          type="number"
          min=${Tr[0]}
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
      `:p}render(){if(!this._open)return l``;let e=this._lang,t=this._taskId?n("edit_task",e):n("new_task",e);return l`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t}</div>
        <div class="content">
          ${this._error?l`<div class="error">${this._error}</div>`:p}
          ${this._warning?l`<div class="error warning">${this._warning}</div>`:p}
          ${this._taskId===null&&this._objectChoices.length>0?l`
            <div class="select-row">
              <label>${n("object",e)}</label>
              <select
                .value=${this._entryId}
                @change=${i=>{this._entryId=i.target.value,this._consumesParts={},this._consumesQtyText={},this._loadParts(),this._loadForeignPools()}}
              >
                ${this._objectChoices.map(i=>l`<option value=${i.entry_id} ?selected=${i.entry_id===this._entryId}>${i.name}</option>`)}
              </select>
            </div>
          `:p}
          <ms-textfield
            label="${n("task_name",e)}"
            required
            .value=${this._name}
            @input=${i=>this._name=i.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${n("maintenance_type",e)}</label>
            <select
              .value=${this._type}
              @change=${i=>this._type=i.target.value}
            >
              ${io.map(i=>l`<option value=${i} ?selected=${i===this._type}>${n(i,e)}</option>`)}
            </select>
          </div>
          ${this._type==="reading"?l`
                <ms-textfield
                  label="${n("reading_unit_label",e)}"
                  .value=${this._readingUnit}
                  @input=${i=>this._readingUnit=i.target.value}
                ></ms-textfield>
                <div class="field-help">${n("reading_unit_help",e)}</div>
                ${this._renderReadingsEditor(e)}
              `:p}
          ${this._partsLoadFailed?l`<div class="field-help parts-load-failed">${n("parts_load_failed",e)}</div>`:p}
          ${this._isFleetTask?l`<div class="field-help parts-fleet-hint">${n("task_parts_fleet_hint",e)}</div>`:this.parts.length||this._foreignOwners.length?l`
                <div class="field">
                  <label>${n("consumes_parts_label",e)}</label>
                  ${this.parts.map(i=>this._renderConsumesRow(i))}
                  ${this._foreignOwners.length?l`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${n("shared_parts_other_objects",e)}</summary>
                          <div class="field-help">${n("shared_parts_help",e)}</div>
                          ${this._foreignOwners.map(i=>l`
                              <div class="shared-pool-owner">${i.name}</div>
                              ${i.parts.map(a=>this._renderConsumesRow(a,i.entry_id))}
                            `)}
                        </details>
                      `:p}
                </div>
              `:p}
          <div class="select-row">
            <label>${n("priority",e)}</label>
            <select
              .value=${this._priority}
              @change=${i=>this._priority=i.target.value}
            >
              ${so.map(i=>l`<option value=${i} ?selected=${i===this._priority}>${n("priority_"+i,e)}</option>`)}
            </select>
          </div>
          <div class="field">
            <label>${n("labels",e)}</label>
            <input
              type="text"
              .value=${this._labels}
              placeholder="${n("labels_placeholder",e)}"
              @input=${i=>this._labels=i.target.value}
            />
            <div class="field-help">${n("labels_help",e)}</div>
          </div>
          <div class="field mirror-todo-field">
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${n("task_mirror_todo",e)}"
                placeholder="todo.family, todo.kids"
                .value=${this._mirrorTodoEntities.join(", ")}
                @input=${i=>{this._mirrorTodoEntities=i.target.value.split(",").map(a=>a.trim()).filter(Boolean)}}
              ></ms-textfield>
            `:l`
              <ha-form
                class="entity-picker-form"
                .hass=${this.hass}
                .schema=${[{name:"mirror_todo_entities",selector:{entity:{multiple:!0,domain:["todo"]}}}]}
                .data=${{mirror_todo_entities:this._mirrorTodoEntities}}
                .computeLabel=${()=>n("task_mirror_todo",e)}
                @value-changed=${i=>{let a=(i.detail.value.mirror_todo_entities||[]).filter(Boolean);this._mirrorTodoEntities=a}}
              ></ha-form>`}
            <div class="field-help">${n("task_mirror_todo_hint",e)}</div>
          </div>
          <div class="select-row">
            <label>${n("schedule_type",e)}</label>
            <select
              .value=${this._scheduleType}
              @change=${i=>this._scheduleType=i.target.value}
            >
              ${ro.map(i=>l`<option value=${i} ?selected=${i===this._scheduleType}>${n(i,e)}</option>`)}
            </select>
          </div>
          ${this._scheduleType==="time_based"?l`
                <ms-textfield
                  label="${n("interval_value",e)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${i=>this._intervalDays=i.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${n("interval_anchor",e)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${i=>this._intervalAnchor=i.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor==="completion"}>${n("anchor_completion",e)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor==="planned"}>${n("anchor_planned",e)}</option>
                  </select>
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
                  @value-changed=${i=>this._dueDate=i.detail.value}
                ></ms-date-field>
              `:p}
          ${this.scheduleTimeEnabled&&sn.includes(this._scheduleType)?l`
            <label class="checkbox-row schedule-time-toggle">
              <input type="checkbox" .checked=${this._scheduleTimeOn}
                @change=${i=>this._scheduleTimeOn=i.target.checked} />
              <span>${n("schedule_time_toggle",e)}</span>
            </label>
            ${this._scheduleTimeOn?l`
              <ms-date-field
                kind="time"
                .hass=${this.hass}
                .lang=${e}
                .value=${this._scheduleTime}
                helper="${n("schedule_time_help",e)}"
                @value-changed=${i=>this._scheduleTime=i.detail.value}
              ></ms-date-field>
            `:p}
          `:p}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-textfield
            label="${n("warning_days",e)}"
            type="number"
            min=${Ui[0]}
            max=${Ui[1]}
            .value=${this._warningDays}
            @input=${i=>this._warningDays=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("earliest_completion_days",e)}"
            helper="${n("earliest_completion_days_help",e)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${i=>this._earliestCompletionDays=i.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled?l`
            <h3>${n("checklist_steps_optional",e)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${n("checklist_placeholder",e)}"
              .value=${this._checklistText}
              @input=${i=>this._checklistText=i.target.value}
            ></textarea>
            <div class="field-help">${n("checklist_help",e)}</div>
          `:p}
          ${this._renderPhasesEditor(e)}
          <h3>${n("require_on_completion",e)}</h3>
          <div class="required-completion">
            ${Bi.map(i=>l`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(i)}
                  @change=${a=>this._toggleRequired(i,a.target.checked)}
                />
                <span>${n($t[i],e)}</span>
              </label>
            `)}
          </div>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${e}
            label="${n("last_performed_optional",e)}"
            .value=${this._lastPerformed}
            @value-changed=${i=>this._lastPerformed=i.detail.value}
          ></ms-date-field>
          <div class="select-row">
            <label>${n("responsible_user",e)}</label>
            <select
              .value=${this._responsibleUserId||""}
              @change=${i=>{let a=i.target.value;this._responsibleUserId=a||null}}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${n("no_user_assigned",e)}</option>
              ${this._availableUsers.map(i=>l`<option value=${i.id} ?selected=${i.id===this._responsibleUserId}>${i.name}</option>`)}
            </select>
          </div>
          ${this._availableUsers.length>=2?l`
            <div class="field">
              <label>${n("shared_with",e)}</label>
              <div class="field-help">${n("shared_with_help",e)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map(i=>l`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(i.id)}
                      @change=${()=>this._toggleAssignee(i.id)} />
                    <span>${i.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length>=2?l`
              <div class="select-row">
                <label>${n("rotation_strategy",e)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${i=>this._rotationStrategy=i.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${n("rotation_none",e)}</option>
                  ${["round_robin","least_completed","random"].map(i=>l`<option value=${i} ?selected=${i===this._rotationStrategy}>${n("rotation_"+i,e)}</option>`)}
                </select>
              </div>`:p}
          `:p}
          ${this._renderTriggerFields()}
          ${this._scheduleType==="sensor_based"&&(this.environmentalFeature||this._environmentalInitial)?l`
            ${this._entityPickerFallback?l`
              <ms-textfield
                label="${n("environmental_entity_optional",e)}"
                helper="${n("environmental_entity_helper",e)}"
                .value=${this._environmentalEntity}
                @input=${i=>this._environmentalEntity=i.target.value.trim()}
              ></ms-textfield>
            `:l`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{name:"environmental_entity",selector:{entity:{domain:Zr,device_class:Xr}}}]}
              .data=${{environmental_entity:this._environmentalEntity}}
              .computeLabel=${()=>n("environmental_entity_optional",e)}
              .computeHelper=${()=>n("environmental_entity_helper",e)}
              @value-changed=${i=>{this._environmentalEntity=(i.detail.value.environmental_entity||"").trim()}}
            ></ha-form>`}
            ${this._environmentalEntity?this._renderEnvironmentalAttribute(e):p}
          `:p}
          ${this._renderAdaptiveSection(e)}
          <ms-textfield
            label="${n("notes_optional",e)}"
            multiline
            .rows=${3}
            .helper=${n("notes_markdown_hint",e)}
            .value=${this._notes}
            @input=${i=>this._notes=i.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${n("documentation_url_optional",e)}"
            .value=${this._documentationUrl}
            @input=${i=>this._documentationUrl=i.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${n("custom_icon_optional",e)}"
            .value=${this._customIcon}
            @value-changed=${i=>this._customIcon=i.detail.value||""}
          ></ha-icon-picker>
          <ha-icon-picker
            class="notify-icon-picker"
            .hass=${this.hass}
            label="${n("notify_icon",e)}"
            .value=${this._notifyIcon}
            @value-changed=${i=>this._notifyIcon=i.detail.value||""}
          ></ha-icon-picker>
          <div class="field-help notify-icon-help">
            <ha-icon icon=${this._notifyIcon.trim()||ts(this._type)}></ha-icon>
            ${n("notify_icon_hint",e).replace("{default}",ts(this._type))}
          </div>
          ${this._availableTags.length>0?l`
              <div class="select-row">
                <label>${n("nfc_tag_id_optional",e)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${i=>this._nfcTagId=i.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${n("no_nfc_tag",e)}</option>
                  ${this._availableTags.map(i=>l`<option value=${i.id} ?selected=${i.id===this._nfcTagId}>${i.name}</option>`)}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${n("nfc_tags_refresh",e)}">↻</button>
              </div>
            `:l`
              <ms-textfield
                label="${n("nfc_tag_id_optional",e)}"
                .value=${this._nfcTagId}
                @input=${i=>this._nfcTagId=i.target.value}
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
              @change=${i=>this._requireTagScan=i.target.checked}
            />
            <span>${n("require_tag_scan",e)}</span>
          </label>
          ${this._requireTagScan?l`<div class="field-help">${n("require_tag_scan_help",e)}</div>`:p}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._allowSkip}
              @change=${i=>this._allowSkip=!i.target.checked}
            />
            <span>${n("disallow_skip",e)}</span>
          </label>
          ${this._allowSkip?p:l`<div class="field-help">${n("disallow_skip_help",e)}</div>`}
          <label class="req-option">
            <input
              type="checkbox"
              .checked=${!this._notifyEnabled}
              @change=${i=>this._notifyEnabled=!i.target.checked}
            />
            <span>${n("no_notifications",e)}</span>
          </label>
          ${this._notifyEnabled?p:l`<div class="field-help">${n("no_notifications_help",e)}</div>`}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${i=>this._enabled=i.target.checked}
            />
            ${n("task_enabled",e)}
          </label>
          ${this._renderCompletionActionsSection(e)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${n("cancel",e)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading||!this._name.trim()}
          >
            ${this._loading?n("saving",e):n("save",e)}
          </ha-button>
        </div>
      </ha-dialog>
    `}};g._PREVIEW_RELEVANT=new Set(["_open","_scheduleType","_intervalDays","_intervalUnit","_intervalAnchor","_dueDate","_weekdays","_nth","_nthWeekday","_domDay","_domLastDay","_domBusiness","_calOffset","_calendarEntity","_seasonMonths","_endsMode","_endsCount","_endsUntil","_lastPerformed"]),g.styles=$`
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
    .schedule-time-toggle {
      display: flex;
      margin: 8px 0 4px;
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
    .error.warning { color: var(--warning-color, #ff9800); }
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
  `,c([f({attribute:!1})],g.prototype,"hass",2),c([f({type:Boolean,attribute:"checklists-enabled"})],g.prototype,"checklistsEnabled",2),c([f({type:Boolean,attribute:"schedule-time-enabled"})],g.prototype,"scheduleTimeEnabled",2),c([f({type:Boolean,attribute:"completion-actions-enabled"})],g.prototype,"completionActionsEnabled",2),c([f({type:Boolean,attribute:"adaptive-feature"})],g.prototype,"adaptiveFeature",2),c([f({type:Boolean,attribute:"seasonal-feature"})],g.prototype,"seasonalFeature",2),c([f({type:Boolean,attribute:"environmental-feature"})],g.prototype,"environmentalFeature",2),c([f({type:Number,attribute:"default-warning-days"})],g.prototype,"defaultWarningDays",2),c([u()],g.prototype,"parts",2),c([u()],g.prototype,"_foreignOwners",2),c([u()],g.prototype,"_open",2),c([u()],g.prototype,"_entityPickerFallback",2),c([u()],g.prototype,"_loading",2),c([u()],g.prototype,"_error",2),c([u()],g.prototype,"_warning",2),c([u()],g.prototype,"_entryId",2),c([u()],g.prototype,"_taskId",2),c([u()],g.prototype,"_isFleetTask",2),c([u()],g.prototype,"_objectChoices",2),c([u()],g.prototype,"_name",2),c([u()],g.prototype,"_type",2),c([u()],g.prototype,"_scheduleType",2),c([u()],g.prototype,"_intervalDays",2),c([u()],g.prototype,"_intervalUnit",2),c([u()],g.prototype,"_dueDate",2),c([u()],g.prototype,"_warningDays",2),c([u()],g.prototype,"_earliestCompletionDays",2),c([u()],g.prototype,"_intervalAnchor",2),c([u()],g.prototype,"_weekdays",2),c([u()],g.prototype,"_nth",2),c([u()],g.prototype,"_nthWeekday",2),c([u()],g.prototype,"_domDay",2),c([u()],g.prototype,"_domLastDay",2),c([u()],g.prototype,"_domBusiness",2),c([u()],g.prototype,"_calOffset",2),c([u()],g.prototype,"_calendarEntity",2),c([u()],g.prototype,"_seasonMonths",2),c([u()],g.prototype,"_endsMode",2),c([u()],g.prototype,"_endsCount",2),c([u()],g.prototype,"_endsUntil",2),c([u()],g.prototype,"_schedulePreview",2),c([u()],g.prototype,"_schedulePreviewEnded",2),c([u()],g.prototype,"_notes",2),c([u()],g.prototype,"_documentationUrl",2),c([u()],g.prototype,"_customIcon",2),c([u()],g.prototype,"_notifyIcon",2),c([u()],g.prototype,"_priority",2),c([u()],g.prototype,"_labels",2),c([u()],g.prototype,"_mirrorTodoEntities",2),c([u()],g.prototype,"_enabled",2),c([u()],g.prototype,"_triggerEntityId",2),c([u()],g.prototype,"_triggerEntityIds",2),c([u()],g.prototype,"_triggerEntityLogic",2),c([u()],g.prototype,"_triggerAttribute",2),c([u()],g.prototype,"_triggerType",2),c([u()],g.prototype,"_triggerAbove",2),c([u()],g.prototype,"_triggerBelow",2),c([u()],g.prototype,"_triggerEquals",2),c([u()],g.prototype,"_triggerNotEquals",2),c([u()],g.prototype,"_triggerForMinutes",2),c([u()],g.prototype,"_triggerCombinator",2),c([u()],g.prototype,"_triggerTargetValue",2),c([u()],g.prototype,"_triggerDeltaMode",2),c([u()],g.prototype,"_triggerBaselineValue",2),c([u()],g.prototype,"_liveBaselineValue",2),c([u()],g.prototype,"_autoCompleteOnRecovery",2),c([u()],g.prototype,"_triggerFromState",2),c([u()],g.prototype,"_triggerToState",2),c([u()],g.prototype,"_triggerTargetChanges",2),c([u()],g.prototype,"_triggerRuntimeHours",2),c([u()],g.prototype,"_triggerRuntimeMaxSession",2),c([u()],g.prototype,"_triggerOnStates",2),c([u()],g.prototype,"_compoundLogic",2),c([u()],g.prototype,"_compoundConditions",2),c([u()],g.prototype,"_suggestedAttributes",2),c([u()],g.prototype,"_availableAttributes",2),c([u()],g.prototype,"_entityDomain",2),c([u()],g.prototype,"_lastPerformed",2),c([u()],g.prototype,"_nfcTagId",2),c([u()],g.prototype,"_requireTagScan",2),c([u()],g.prototype,"_allowSkip",2),c([u()],g.prototype,"_notifyEnabled",2),c([u()],g.prototype,"_readingUnit",2),c([u()],g.prototype,"_readings",2),c([u()],g.prototype,"_consumesParts",2),c([u()],g.prototype,"_consumesQtyText",2),c([u()],g.prototype,"_partsLoadFailed",2),c([u()],g.prototype,"_availableTags",2),c([u()],g.prototype,"_responsibleUserId",2),c([u()],g.prototype,"_assigneePool",2),c([u()],g.prototype,"_rotationStrategy",2),c([u()],g.prototype,"_availableUsers",2),c([u()],g.prototype,"_checklistText",2),c([u()],g.prototype,"_phaseDefs",2),c([u()],g.prototype,"_phaseSeq",2),c([u()],g.prototype,"_requiredCompletion",2),c([u()],g.prototype,"_scheduleTime",2),c([u()],g.prototype,"_scheduleTimeOn",2),c([u()],g.prototype,"_actionService",2),c([u()],g.prototype,"_actionTargetEntity",2),c([u()],g.prototype,"_actionSkipAuto",2),c([u()],g.prototype,"_actionPresent",2),c([u()],g.prototype,"_actionData",2),c([u()],g.prototype,"_actionDataJsonFallback",2),c([u()],g.prototype,"_actionTesting",2),c([u()],g.prototype,"_actionTestResult",2),c([u()],g.prototype,"_actionTestError",2),c([u()],g.prototype,"_qcNotes",2),c([u()],g.prototype,"_qcCost",2),c([u()],g.prototype,"_qcDuration",2),c([u()],g.prototype,"_qcFeedback",2),c([u()],g.prototype,"_environmentalEntity",2),c([u()],g.prototype,"_environmentalAttribute",2),c([u()],g.prototype,"_adaptiveEnabled",2),c([u()],g.prototype,"_adaptiveAlpha",2),c([u()],g.prototype,"_adaptiveMin",2),c([u()],g.prototype,"_adaptiveMax",2),c([u()],g.prototype,"_adaptiveSeasonal",2),c([u()],g.prototype,"_adaptivePrediction",2),c([u()],g.prototype,"_conditionAttrOptions",2);is=g;customElements.get("maintenance-task-dialog")||customElements.define("maintenance-task-dialog",is)});function uo(r,s){r.key!=="Escape"||r.defaultPrevented||r.composedPath().some(e=>e instanceof Element&&e.localName==="ms-camera-capture")||(r.preventDefault(),r.stopPropagation(),s())}function et(r,s){return l`
    <div class="backdrop" @click=${r}></div>
    <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
      @keydown=${e=>uo(e,r)}>${s}</div>
  `}function tt(r){r?.querySelector(".dialog")?.focus({preventScroll:!0})}var Xe,ai=y(()=>{"use strict";C();Xe=$`
  .backdrop {
    position: fixed; inset: 0; z-index: 100;
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
    z-index: 101;
  }
  /* Focused programmatically on open (so Escape works at once) — no ring. */
  .dialog:focus { outline: none; }
`});var U,cn=y(()=>{"use strict";C();H();R();U=class extends S{constructor(){super(...arguments);this._open=!1;this._title="";this._message="";this._confirmText="";this._danger=!1;this._inputLabel="";this._inputType="";this._options=null;this._inputValue="";this._resolve=null;this._promptResolve=null}confirm(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel="",this._inputType="",this._options=null,this._inputValue="",this._open=!0,new Promise(t=>{this._resolve=t,this._promptResolve=null})}prompt(e){return this._title=e.title,this._message=e.message,this._confirmText=e.confirmText||"OK",this._danger=e.danger||!1,this._inputLabel=e.inputLabel||"",this._inputType=e.inputType||"text",this._options=e.options&&e.options.length?e.options:null,this._inputValue=e.inputValue||"",this._open=!0,new Promise(t=>{this._promptResolve=t,this._resolve=null})}_cancel(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!1,value:""}),this._promptResolve=null),this._resolve?.(!1),this._resolve=null}_confirmAction(){this._open=!1,this._promptResolve&&(this._promptResolve({confirmed:!0,value:this._inputValue}),this._promptResolve=null),this._resolve?.(!0),this._resolve=null}render(){if(!this._open)return p;let e=I(this.hass);return l`
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
    `}};U.styles=[zt,$`
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
  `],c([f({attribute:!1})],U.prototype,"hass",2),c([u()],U.prototype,"_open",2),c([u()],U.prototype,"_title",2),c([u()],U.prototype,"_message",2),c([u()],U.prototype,"_confirmText",2),c([u()],U.prototype,"_danger",2),c([u()],U.prototype,"_inputLabel",2),c([u()],U.prototype,"_inputType",2),c([u()],U.prototype,"_options",2),c([u()],U.prototype,"_inputValue",2);customElements.get("maintenance-confirm-dialog")||customElements.define("maintenance-confirm-dialog",U)});function ho(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function Re(r,s){let e=ho(),t=e.querySelector(`${dn}[${pn}]`);return t||(t=document.createElement(dn),t.setAttribute(pn,""),e.appendChild(t)),t.hass=r,t.confirm(s)}var dn,pn,oi=y(()=>{"use strict";cn();dn="maintenance-confirm-dialog",pn="data-ms-lovelace-confirm"});var xe,ss=y(()=>{"use strict";C();H();Oi();xe=class extends S{constructor(){super(...arguments);this.docId="";this._url="";this._failed=!1;this._signedFor=""}updated(){this.hass&&this.docId&&this._signedFor!==this.docId&&(this._signedFor=this.docId,this._url="",this._failed=!1,this._sign())}async _sign(){try{this._url=await ji(this.hass,this.docId)}catch{this._failed=!0}}render(){return this._failed||!this.docId?p:this._url?l`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${()=>this._failed=!0} />
      </a>`:l`<div class="ph"></div>`}};xe.styles=$`
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
  `,c([f({attribute:!1})],xe.prototype,"hass",2),c([f()],xe.prototype,"docId",2),c([u()],xe.prototype,"_url",2),c([u()],xe.prototype,"_failed",2);customElements.get("maintenance-history-photo")||customElements.define("maintenance-history-photo",xe)});var B,un=y(()=>{"use strict";C();H();R();be();wt();ai();Gi();ti();oi();Qe();ss();Tt();Tt();B=class extends S{constructor(){super(...arguments);this._open=!1;this._saving=!1;this._error="";this._draft=null;this._originalSnapshot=null;this._partOptions=null;this._partQty={};this._partQtyOriginal="";this._openGen=0;this._photos=new Ge(this,{entryId:()=>this._draft?.entry_id??"",hass:()=>this.hass});this._photosOriginal="";this._readingRows=[];this._readingText={};this._readingsOriginal=""}get _lang(){return I(this.hass)}openEdit(e){this._openGen++,this._draft={...e},this._originalSnapshot={...e},this._error="",this._open=!0,this._partOptions=null,this._partQty={},this._partQtyOriginal="",this._photos.reset(e.photo_doc_ids??[]),this._photosOriginal=JSON.stringify(this._photos.ids),this._seedReadings(e),this._loadPartOptions()}_seedReadings(e){let t=[],i=new Set;for(let o of e.readings??[])i.has(o.id)||(i.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));for(let o of e.reading_values??[])i.has(o.id)||(i.add(o.id),t.push({id:o.id,name:o.name,unit:o.unit??null}));this._readingRows=t;let a={};for(let o of e.reading_values??[])a[o.id]=String(o.value);this._readingText=a,this._readingsOriginal=JSON.stringify(this._readingNumbers())}_readingNumbers(){let e={};for(let t of this._readingRows){let i=(this._readingText[t.id]??"").trim();if(i==="")continue;let a=parseFloat(i.replace(",","."));isNaN(a)||(e[t.id]=a)}return e}async _loadPartOptions(){let e=this._draft;if(!e)return;let t=this._openGen;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/parts/overview"});if(t!==this._openGen)return;let a=[];for(let d of i.parts||[]){let h=d.entry_id===e.entry_id,_=d.consumers.some(m=>m.entry_id===e.entry_id&&m.task_id===e.task_id);!h&&!_||a.push({part_id:d.part_id,name:d.name,entry_id:d.entry_id,foreign:!h,object_name:d.object_name})}for(let d of e.used_parts||[]){let h=d.entry_id||e.entry_id;a.some(_=>_.part_id===d.part_id&&_.entry_id===h)||a.push({part_id:d.part_id,name:d.name||d.part_id,entry_id:h,foreign:h!==e.entry_id,object_name:null})}let o={};for(let d of e.used_parts||[])o[`${d.entry_id||e.entry_id}:${d.part_id}`]=d.quantity??1;this._partOptions=a,this._partQty=o,this._partQtyOriginal=this._partSelectionKey()}catch{if(t!==this._openGen)return;this._partOptions=[]}}_partSelectionKey(){return JSON.stringify(Object.entries(this._partQty).filter(([,e])=>e>0).sort(([e],[t])=>e.localeCompare(t)))}close(){this._openGen++,this._open=!1,this._error="",this._draft=null,this._originalSnapshot=null,this._photos.discardOrphans()}_set(e,t){this._draft&&(this._draft={...this._draft,[e]:t})}async _delete(){if(!this._draft||!this._originalSnapshot)return;let e=this._lang;if(!await Re(this.hass,{title:n("history_delete_entry",e),message:n("history_delete_confirm",e),confirmText:n("delete",e),danger:!0})||!this._draft||!this._originalSnapshot)return;let i=this._draft;this._error="",await this._runWs({type:"maintenance_supporter/task/history/delete",entry_id:i.entry_id,task_id:i.task_id,timestamp:this._originalSnapshot.original_timestamp})!==void 0&&(this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:i.entry_id,task_id:i.task_id,deleted:!0},bubbles:!0,composed:!0})),this.close())}_runWs(e){return O(this,e,{busy:t=>{this._saving=t},onError:t=>{this._error=t}})}async _save(){if(!this._draft||!this._originalSnapshot||this._saving||this._photos.uploading)return;this._error="",this._photos.clearError();let e=this._draft,t=this._originalSnapshot,i={type:"maintenance_supporter/task/history/update",entry_id:e.entry_id,task_id:e.task_id,original_timestamp:t.original_timestamp};if(e.timestamp!==t.timestamp&&(i.timestamp=e.timestamp),e.notes!==t.notes&&(i.notes=e.notes),e.cost!==t.cost&&(i.cost=e.cost),e.duration!==t.duration&&(i.duration=e.duration),e.completed_by!==t.completed_by&&(i.completed_by=e.completed_by),this._partOptions!==null&&this._partSelectionKey()!==this._partQtyOriginal&&(i.used_parts=(this._partOptions||[]).filter(o=>(this._partQty[`${o.entry_id}:${o.part_id}`]||0)>0).map(o=>({part_id:o.part_id,quantity:this._partQty[`${o.entry_id}:${o.part_id}`],...o.foreign?{entry_id:o.entry_id}:{}}))),e.reading_value!==t.reading_value&&(i.reading_value=e.reading_value??null),this._readingRows.length>0&&JSON.stringify(this._readingNumbers())!==this._readingsOriginal){let o=this._readingNumbers(),d={};for(let h of this._readingRows)d[h.id]=o[h.id]??null;i.reading_values=d}if(JSON.stringify(this._photos.ids)!==this._photosOriginal&&(i.photo_doc_ids=this._photos.ids),Object.keys(i).filter(o=>!["type","entry_id","task_id","original_timestamp"].includes(o)).length===0){this.close();return}await this._runWs(i)!==void 0&&(this._photos.markAttached(),this.dispatchEvent(new CustomEvent("history-entry-saved",{detail:{entry_id:e.entry_id,task_id:e.task_id,new_timestamp:e.timestamp},bubbles:!0,composed:!0})),this.close())}render(){if(!this._open||!this._draft)return p;let e=this._lang,t=this._draft,i=this._error||this._photos.errorText(e);return et(()=>this.close(),l`
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
          .value=${t.timestamp.slice(0,19)}
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
          <label>
            <span>${n("cost",e)}</span>
            <input type="number" min="0" step="0.01"
              .value=${t.cost!=null?String(t.cost):""}
              @input=${a=>{let o=a.target.value;this._set("cost",o?Number(o):null)}} />
          </label>
          <label>
            <span>${n("duration",e)}</span>
            <input type="number" min="0" step="1" inputmode="numeric"
              .value=${t.duration!=null?String(t.duration):""}
              @input=${a=>{this._set("duration",Ke(a.target.value))}} />
          </label>
        </div>
        ${this._renderReadings(t,e)}
        ${this._partOptions&&this._partOptions.length>0?l`
          <div class="parts-block">
            <span class="parts-title">${n("complete_parts_used",e)}</span>
            ${this._partOptions.map(a=>{let o=`${a.entry_id}:${a.part_id}`,d=this._partQty[o]||0;return l`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${d>0}
                    @change=${h=>{let _=h.target.checked;this._partQty={...this._partQty,[o]:_?1:0}}} />
                  <span class="part-label">${a.name}${a.foreign&&a.object_name?` (${a.object_name})`:""}</span>
                  ${d>0?l`
                    <input class="part-qty" type="number" min=${ve[0]} max=${ve[1]} step="0.01"
                      .value=${String(d)}
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
    `)}updated(e){e.has("_open")&&this._open&&tt(this.shadowRoot)}_renderReadings(e,t){return this._readingRows.length>0?l`
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
      </label>`}};B.styles=[si,Xe,$`
    :host { display: contents; --ms-modal-max-height: 90vh; --ms-modal-gap: 12px; }
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
    .parts-title { color: var(--secondary-text-color); font-size: 13px; }
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
  `],c([f({attribute:!1})],B.prototype,"hass",2),c([u()],B.prototype,"_open",2),c([u()],B.prototype,"_saving",2),c([u()],B.prototype,"_error",2),c([u()],B.prototype,"_draft",2),c([u()],B.prototype,"_partOptions",2),c([u()],B.prototype,"_partQty",2),c([u()],B.prototype,"_readingRows",2),c([u()],B.prototype,"_readingText",2);customElements.get("maintenance-history-edit-dialog")||customElements.define("maintenance-history-edit-dialog",B)});function Ie(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function rs(r){return!r.startsWith("data:image/svg+xml,")&&!r.startsWith("data:image/png;base64,")?"":Ie(r)}function _o(r){return r.replace(/[/\\:*?"<>|#%]+/g,"").replace(/\s+/g,"-").toLowerCase().substring(0,100)}var W,hn=y(()=>{"use strict";C();H();R();Ni();W=class extends S{constructor(){super(...arguments);this.lang="";this._open=!1;this._loading=!1;this._error="";this._viewResult=null;this._completeResult=null;this._quickResult=null;this._urlMode="companion";this._entryId="";this._taskId=null;this._objectName="";this._taskName="";this._generateSeq=0}get _dialogLang(){return this.lang||I(this.hass)}openForObject(e,t){this._entryId=e,this._taskId=null,this._objectName=t,this._taskName="",this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}openForTask(e,t,i,a){this._entryId=e,this._taskId=t,this._objectName=i,this._taskName=a,this._urlMode="companion",this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null,this._open=!0,this._generate()}async _generate(){let e=++this._generateSeq;this._loading=!0,this._error="",this._viewResult=null,this._completeResult=null,this._quickResult=null;try{let t={type:"maintenance_supporter/qr/generate",entry_id:this._entryId,url_mode:this._urlMode};this._taskId&&(t.task_id=this._taskId);let i=[this.hass.connection.sendMessagePromise({...t,action:"view"})];this._taskId&&(i.push(this.hass.connection.sendMessagePromise({...t,action:"complete"})),await this._hasQuickCompleteDefaults()&&i.push(this.hass.connection.sendMessagePromise({...t,action:"quick_complete"})));let a=await Promise.all(i);if(e!==this._generateSeq)return;this._viewResult=a[0],a.length>1&&(this._completeResult=a[1]),a.length>2&&(this._quickResult=a[2])}catch(t){if(e!==this._generateSeq)return;let i=t?.code,a=t?.message;this._error=i==="no_url"||typeof a=="string"&&a.includes("No Home Assistant URL")?n("qr_error_no_url",this._dialogLang):n("qr_error",this._dialogLang)}finally{e===this._generateSeq&&(this._loading=!1)}}async _hasQuickCompleteDefaults(){try{let t=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:this._entryId})).tasks||[]).find(i=>i.id===this._taskId);return!!t?.quick_complete_defaults&&Object.keys(t.quick_complete_defaults).length>0}catch{return!1}}_setUrlMode(e){this._urlMode!==e&&(this._urlMode=e,this._generate())}_print(){if(!this._viewResult)return;let e=this._viewResult,t=e.label.task_name?`${e.label.object_name} \u2014 ${e.label.task_name}`:e.label.object_name,i=[e.label.manufacturer,e.label.model].filter(Boolean).join(" "),a=window.open("","_blank","width=600,height=500");if(!a)return;let o=this._dialogLang,d=Ie(t),h=Ie(i),_=!!this._completeResult,m=!!this._quickResult,b=Ie(n("qr_action_view",o)),k=Ie(n("qr_action_complete",o)),w=Ie(n("qr_action_quick_complete",o));a.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
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
  .qr-col img{width:${m?"170px":_?"200px":"280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${d}</h2>
${h?`<div class="sub">${h}</div>`:""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${rs(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${b}</div>
  </div>
  ${_?`<div class="qr-col">
    <img src="${rs(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${k}</div>
  </div>`:""}
  ${m?`<div class="qr-col">
    <img src="${rs(this._quickResult.svg_data_uri)}" alt="QR Quick-complete" />
    <div class="qr-label">${w}</div>
  </div>`:""}
</div>
<div class="url">${Ie(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`),a.document.close()}_downloadSvg(e,t){let i=decodeURIComponent(e.svg_data_uri.replace("data:image/svg+xml,","")),a=this._taskName?`${this._objectName}-${this._taskName}`:this._objectName;dr(i,`qr-${_o(a)}-${t}.svg`,"image/svg+xml")}_close(){this._open=!1,this._viewResult=null,this._completeResult=null,this._quickResult=null,this._error="",this._loading=!1}render(){if(!this._open)return l``;let e=this._dialogLang,t=this._taskName?`${n("qr_code",e)}: ${this._objectName} \u2014 ${this._taskName}`:`${n("qr_code",e)}: ${this._objectName}`,i=!!this._viewResult;return l`
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
    `}};W.styles=$`
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
  `,c([f({attribute:!1})],W.prototype,"hass",2),c([f()],W.prototype,"lang",2),c([u()],W.prototype,"_open",2),c([u()],W.prototype,"_loading",2),c([u()],W.prototype,"_error",2),c([u()],W.prototype,"_viewResult",2),c([u()],W.prototype,"_completeResult",2),c([u()],W.prototype,"_quickResult",2),c([u()],W.prototype,"_urlMode",2);customElements.get("maintenance-qr-dialog")||customElements.define("maintenance-qr-dialog",W)});function li(r){return r?customElements.get("ha-markdown")?l`<ha-markdown class="notes-md" .content=${r} breaks></ha-markdown>`:l`${r}`:p}var ns=y(()=>{"use strict";C()});function _n(r,s,e,t){let i=e,a=h=>typeof h=="string"?h:null,o=h=>typeof h=="number"?h:null,d=a(i.timestamp)??"";return{entry_id:r,task_id:s,original_timestamp:d,type:a(i.type)||"completed",timestamp:d,notes:a(i.notes),cost:o(i.cost),duration:o(i.duration),completed_by:a(i.completed_by),used_parts:Array.isArray(i.used_parts)?i.used_parts:null,photo_doc_ids:Xt(i),reading_value:o(i.reading_value),reading_values:fe(i),readings:t?.readings??[],task_type:t?.type??null,reading_unit:t?.reading_unit??null}}var mn=y(()=>{"use strict";ei();Ae()});function mo(r){return r&&gn(r.ref_no)?String(r.ref_no):null}function fn(r,s){let e=mo(r);return e&&s&&gn(s.ref_no)?`${e}.${s.ref_no}`:null}function vn(r,s){return r?l`<span class="ref-chip" title=${s??""}>#${r}</span>`:p}var gn,as=y(()=>{"use strict";C();gn=r=>typeof r=="number"&&Number.isInteger(r)&&r>0});var bn=y(()=>{"use strict"});function yn(r,s){if(!r)return"";let e=go[r.trim()];if(e)return n(e,s);for(let[t,i,a]of fo){let o=r.trim().match(t);if(o){let d=a(o,s);return n(i,s).replace(/\{(\w+)\}/g,(h,_)=>d[_]??h)}}return r}var go,fo,xn=y(()=>{"use strict";R();go={"Completed from dashboard button":"hist_note_button","Completed from the To-do list":"hist_note_todo","Completed by voice":"hist_note_voice","Completed from the notification":"hist_note_notification","Completed via NFC tag":"hist_note_nfc","Completed from the shopping list":"hist_note_shopping_list","Completed from a mirrored to-do list":"hist_note_todo_mirror","Skipped from notification":"hist_note_skipped_notification","Skipped from dashboard button":"hist_note_skipped_button","Sensor trigger activated":"hist_note_sensor_triggered","Initial value set during task creation":"hist_note_initial"},fo=[[/^Auto-completed: sensor recovered \((.+)\)$/,"hist_note_auto_recovered",r=>({value:r[1]})],[/^Reset to (\d{4}-\d{2}-\d{2})$/,"hist_note_reset",(r,s)=>({date:q(r[1],s)})],[/^Trigger entity replaced: (.+) → (.+)$/,"hist_note_trigger_replaced",r=>({old:r[1],new:r[2]})],[/^Sensor trigger removed \(entity was: (.+)\)\. Schedule converted to (\w+)\.$/,"hist_note_trigger_removed",(r,s)=>({entity:r[1],schedule:n(r[2],s)})],[/^Entity (.+) removed from compound trigger; (\d+) conditions remain\.$/,"hist_note_compound_removed",r=>({entity:r[1],count:r[2]})]]});function wn(r){let s=e=>{let t=e.timestamp??"",i=Date.parse(t.length===10?`${t}T00:00:00`:t);return Number.isNaN(i)?-1/0:i};return(r??[]).map((e,t)=>({entry:e,index:t,at:s(e)})).sort((e,t)=>t.at-e.at||t.index-e.index).map(e=>e.entry)}function bo(r,s){return r.taskRef&&s.ref_no?`${r.taskRef}-${s.ref_no}`:null}function yo(r,s){let e=Xt(s);return e.length>0?l`<div class="history-photos">
        ${e.map(t=>l`<maintenance-history-photo .hass=${r} .docId=${t}></maintenance-history-photo>`)}
      </div>`:p}function xo(r,s){let e=s.lang,t=o=>L(o,e,{maximumFractionDigits:3}),i=o=>o==null?"":` (${o>=0?"+":""}${t(o)})`,a=fe(r);return a.length>0?l`<div class="history-readings">
      ${a.map(o=>l`<span class="history-reading">
        <span class="history-reading-name">${o.name}</span>
        <span class="history-reading-value">${t(o.value)}${o.unit?` ${o.unit}`:""}${i(s.readingSlotDelta?.(r,o.id))}</span>
      </span>`)}
    </div>`:r.reading_value!=null?l`<div class="history-readings"><span class="history-reading">
      <span class="history-reading-name">${n("reading_label",e)}</span>
      <span class="history-reading-value">${t(r.reading_value)}${s.readingUnit?` ${s.readingUnit}`:""}${i(s.readingDelta?.(r))}</span>
    </span></div>`:p}function kn(r,s,e={}){let t=s.lang,{compact:i=!1,showRef:a=!0,showBadges:o=!0,showEdit:d=!0}=e,h=s.openEdit,_=d&&!!h&&vo.includes(r.type),m=typeof r.parts_cost=="number"?r.parts_cost:null,b=r.cost_basis==="use",k=b&&!!r.purchase;return l`
    <div class="history-entry${i?" compact":""}">
      ${i?p:l`<div class="history-icon ${r.type}">
            <ha-icon .icon=${_t[r.type]||"mdi:circle"}></ha-icon>
          </div>`}
      <div class="history-content">
        <div class="history-row">
          <strong>${n(r.type,t)}</strong>
          ${a?vn(bo(s,r),n("ref_number",t)):p}
          ${o&&r.phase_id?l`<span class="history-phase-badge">${s.phaseNames?.[r.phase_id]||r.phase_id}</span>`:p}
          ${o&&r.auto?l`<span class="history-auto-badge">${n("history_auto",t)}</span>`:p}
          ${_?l`<button class="history-edit-btn"
                     title=${n("history_edit_button",t)}
                     @click=${()=>h(r)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>`:p}
        </div>
        <div class="history-date">${ar(r.timestamp,t)}</div>
        ${r.notes?l`<div>${yn(r.notes,t)}</div>`:p}
        ${yo(s.hass,r)}
        ${xo(r,s)}
        ${r.cost!=null||r.duration!=null||r.trigger_value!=null||m!=null?l`<div class="history-details">
              ${r.cost!=null?k?l`<span>${n("history_purchase_stock",t).replace("{amount}",le(r.cost,s.currencySymbol,t))}</span>`:l`<span>${n("cost",t)}: ${le(r.cost,s.currencySymbol,t)}</span>`:p}
              ${m!=null?l`<span title=${n(b?"history_parts_counted_hint":"history_parts_info_hint",t)}>${n(b?"history_parts_counted":"history_parts_info",t).replace("{amount}",le(m,s.currencySymbol,t))}</span>`:p}
              ${r.duration!=null?l`<span>${n("duration",t)}: ${Mt(r.duration,t)}</span>`:p}
              ${r.trigger_value!=null?l`<span>${n("trigger_val",t)}: ${r.trigger_value}</span>`:p}
            </div>`:p}
      </div>
    </div>
  `}var vo,$n=y(()=>{"use strict";C();R();ss();ei();as();Ae();bn();xn();vo=["completed","reset","skipped"]});function At(r){return r.archived?"archived":r.is_done?"done":r.status||"ok"}function os(r,s){return n(r==="done"?"completed":r,s)}function ci(r){let s=At(r);return s==="done"?wo:ht[s]||"var(--disabled-color, #9e9e9e)"}function ko(r){return _t[r==="done"?"completed":r]||"mdi:circle-medium"}function En(r,s,e="pill"){let t=At(r),i=os(t,s);return e==="chip"?l`<span class="status-chip ${t}">${i}</span>`:l`<span class="status-badge ${t}" role="img" title="${i}" aria-label="${i}"><ha-icon icon="${ko(t)}"></ha-icon><span class="status-label">${i}</span></span>`}var wo,ls=y(()=>{"use strict";C();R();qe();wo="var(--maint-done-color, #78909c)"});var di,Sn=y(()=>{"use strict";di=class{constructor(){this._handle=null}schedule(s,e=4e3){this.clear(),this._handle=setTimeout(()=>{this._handle=null,s()},e)}clear(){this._handle!==null&&(clearTimeout(this._handle),this._handle=null)}get pending(){return this._handle!==null}}});function Tn(r,s){let e=r.interval_analysis,t=e?.weibull_beta,i=e?.weibull_eta;if(t==null||i==null||i<=0)return p;let a=r.interval_days??0,o=r.suggested_interval??a;return l`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${n("weibull_reliability_curve",s)}
        ${$o(t,s)}
      </div>
      ${Eo(t,i,a,o,s)}
      ${So(e,s)}
      ${e?.confidence_interval_low!=null?To(e,r,s):p}
    </div>
  `}function $o(r,s){let e,t,i;return r<.8?(e="early_failures",t="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z",i="beta_early_failures"):r<=1.2?(e="random_failures",t="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z",i="beta_random_failures"):r<=3.5?(e="wear_out",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z",i="beta_wear_out"):(e="highly_predictable",t="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z",i="beta_highly_predictable"),l`
    <span class="beta-badge ${e}">
      <ha-svg-icon path="${t}"></ha-svg-icon>
      ${n(i,s)} (\u03B2=${L(r,s,2)})
    </span>
  `}function Eo(r,s,e,t,i){let w=Math.max(e,t,s,1)*1.3,v=50,x=[];for(let Q=0;Q<=v;Q++){let X=Q/v*w,Bn=1-Math.exp(-Math.pow(X/s,r)),Wn=32+X/w*260,Vn=136-Bn*128;x.push([Wn,Vn])}let E=x.map(([Q,X])=>`${A(Q)},${A(X)}`).join(" "),P="M32,136 "+x.map(([Q,X])=>`L${A(Q)},${A(X)}`).join(" ")+` L${A(x[v][0])},136 Z`,V=32+e/w*260,re=1-Math.exp(-Math.pow(e/s,r)),Le=136-re*128,Fn=L((1-re)*100,i,0),fs=32+t/w*260,Un=[0,.25,.5,.75,1];return l`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${300} ${160}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_weibull",i)}">
        ${Un.map(Q=>{let X=136-Q*128;return Oe`
            <line x1="${32}" y1="${A(X)}" x2="${292}" y2="${A(X)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${Q===.5?"4,3":p}" />
            <text x="${28}" y="${A(X+3)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${L(Q*100,i,0)}%</text>
          `})}

        <text x="${32}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${324/2}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(w/2)}</text>
        <text x="${292}" y="${156}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(w)}</text>

        <path d="${P}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${E}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${e>0?Oe`
          <line x1="${A(V)}" y1="${8}" x2="${A(V)}" y2="${A(136)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${A(V)}" cy="${A(Le)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${A(V+4)}" y="${A(Le-6)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${Fn}%</text>
        `:p}

        ${t>0&&t!==e?Oe`
          <line x1="${A(fs)}" y1="${8}" x2="${A(fs)}" y2="${A(136)}"
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
  `}function So(r,s){return l`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${n("characteristic_life",s)}</span>
        <span class="weibull-info-value">${Math.round(r.weibull_eta)} ${n("days",s)}</span>
      </div>
      ${r.weibull_r_squared!=null?l`
        <div class="weibull-info-item">
          <span>${n("weibull_r_squared",s)}</span>
          <span class="weibull-info-value">${L(r.weibull_r_squared,s,3)}</span>
        </div>
      `:p}
    </div>
  `}function To(r,s,e){let t=r.confidence_interval_low,i=r.confidence_interval_high,a=s.suggested_interval??s.interval_days??0,o=s.interval_days??0,d=Math.max(0,t-5),_=i+5-d,m=(t-d)/_*100,b=(i-t)/_*100,k=(a-d)/_*100,w=o>0?(o-d)/_*100:-1;return l`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${n("confidence_interval",e)}: ${a} ${n("days",e)} (${t}\u2013${i})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${A(m)}%;width:${A(b)}%"></div>
        ${w>=0?l`<div class="confidence-marker current" style="left:${A(w)}%"></div>`:p}
        <div class="confidence-marker recommended" style="left:${A(k)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${n("confidence_conservative",e)} (${t}${n("days",e).charAt(0)})</span>
        <span class="confidence-text high">${n("confidence_aggressive",e)} (${i}${n("days",e).charAt(0)})</span>
      </div>
    </div>
  `}var An=y(()=>{"use strict";C();R();ri()});function Cn(r,s,e){let t=r.degradation_trend!=null&&r.degradation_trend!=="insufficient_data",i=r.days_until_threshold!=null,a=r.environmental_factor!=null&&r.environmental_factor!==1;if(!t&&!i&&!a)return p;let o=r.degradation_trend==="rising"?"M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z":r.degradation_trend==="falling"?"M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z":"M22,12L18,8V11H3V13H18V16L22,12Z";return l`
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
            ${r.degradation_rate!=null?l`<span class="prediction-rate">${r.degradation_rate>0?"+":""}${L(r.degradation_rate,s,Math.abs(r.degradation_rate)>=10?0:1)} ${r.trigger_entity_info?.unit_of_measurement||""}/${n("day_short",s)}</span>`:p}
          </div>
        `:p}
        ${i?l`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${n("days_until_threshold",s)}</span>
            <span class="prediction-value prediction-days${r.days_until_threshold===0?" exceeded":r.sensor_prediction_urgency?" urgent":""}">${r.days_until_threshold===0?n("threshold_exceeded",s):"~"+Math.round(r.days_until_threshold)+" "+n("days",s)}</span>
            ${r.threshold_prediction_date?l`<span class="prediction-date">${q(r.threshold_prediction_date,s)}</span>`:p}
            ${r.threshold_prediction_confidence?l`<span class="confidence-dot ${r.threshold_prediction_confidence}"></span>`:p}
            ${(r.prediction_cycles??0)>0?l`<span class="prediction-cycles">${n("prediction_cycles",s)}: ${r.prediction_cycles}</span>`:p}
          </div>
        `:p}
        ${a&&e.environmental?l`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${n("environmental_adjustment",s)}</span>
            <span class="prediction-value">${L(r.environmental_factor,s,2)}x</span>
            ${r.environmental_entity?l`<span class="prediction-entity entity-link" @click=${d=>cr(d,r.environmental_entity)}>${r.environmental_entity}</span>`:p}
          </div>
        `:p}
      </div>
    </div>
  `}var Rn=y(()=>{"use strict";C();R()});function In(r,s,e,t){let i=Math.max(r||1,s);return l`
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
  `}var Pn=y(()=>{"use strict";C();R()});function Nn(r,s,e){if(!e.seasonal||!r.seasonal_factor||r.seasonal_factor===1)return p;let t=Ln.map(d=>n(d,s)),i=new Date().getMonth(),a=r.seasonal_factors||r.interval_analysis?.seasonal_factors||null,o=a&&a.length===12?a:t.map((d,h)=>{let _=r.seasonal_factor||1,m=Math.sin((h-6)*Math.PI/6)*.3;return Math.max(.7,Math.min(1.3,_+m))});return l`
    <div class="seasonal-card-compact">
      <h4>${n("seasonal_awareness",s)}</h4>
      <div class="seasonal-mini-chart">
        ${o.map((d,h)=>{let _=d*40,m=d<.9?"low":d>1.1?"high":"normal";return l`
            <div class="seasonal-bar ${m} ${h===i?"current":""}"
                 style="height: ${_}px"
                 title="${t[h]}: ${L(d,s,2)}x">
            </div>
          `})}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${n("shorter",s)}</span>
        <span class="legend-item"><span class="dot normal"></span> ${n("normal",s)}</span>
        <span class="legend-item"><span class="dot high"></span> ${n("longer",s)}</span>
      </div>
    </div>
  `}function jn(r,s){return Ao(r,s)}function Ao(r,s){let e=r.seasonal_factors??r.interval_analysis?.seasonal_factors;if(!e||e.length!==12)return p;let t=r.interval_analysis?.seasonal_reason,i=new Date().getMonth(),a=300,o=100,d=8,_=o-d-4,m=Math.max(...e,1.5),b=a/12,k=b*.65,w=d+_-1/m*_;return l`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${n("seasonal_chart_title",s)}
        ${t?l`<span class="source-tag">${t==="learned"?n("seasonal_learned",s):n("seasonal_manual",s)}</span>`:p}
      </div>
      <svg viewBox="0 0 ${a} ${o}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${n("chart_seasonal",s)}">
        <line x1="0" y1="${A(w)}" x2="${a}" y2="${A(w)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${e.map((v,x)=>{let E=v/m*_,P=x*b+(b-k)/2,V=d+_-E,re=x===i,Le=v<1?"var(--success-color, #4caf50)":v>1?"var(--warning-color, #ff9800)":"var(--secondary-text-color)";return Oe`
            <rect x="${A(P)}" y="${A(V)}"
              width="${A(k)}" height="${A(E)}"
              fill="${Le}" opacity="${re?1:.5}" rx="2" />
          `})}
      </svg>
      <div class="seasonal-labels">
        ${Ln.map((v,x)=>l`<span class="seasonal-label ${x===i?"active-month":""}">${n(v,s)}</span>`)}
      </div>
    </div>
  `}var Ln,On=y(()=>{"use strict";C();R();ri();Ln=["month_jan","month_feb","month_mar","month_apr","month_may","month_jun","month_jul","month_aug","month_sep","month_oct","month_nov","month_dec"]});var N,Hn=y(()=>{"use strict";C();H();R();be();ai();Zt();Qt();Vt();ns();mn();Ae();as();$n();ls();Ve();Ue();oi();Sn();An();Rn();Pn();Qe();On();N=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._taskId=null;this._task=null;this._objectName="";this._taskRef=null;this._busy=!1;this._error="";this._showSkip=!1;this._showReset=!1;this._showPostpone=!1;this._showDetails=!1;this._showAdaptive=!1;this._skipReason="";this._resetDate="";this._postponeDate="";this._features={adaptive:!1,seasonal:!1,environmental:!1,budget:!1,groups:!1,checklists:!1,schedule_time:!1,completion_actions:!1};this._toast="";this._toastTimer=new di;this._access=ce;this._currencySymbol="";this._partsCostMode="purchase";this._loadSeq=0}get _lang(){return I(this.hass)}async openFor(e,t){(e!==this._entryId||t!==this._taskId)&&(this._task=null),this._entryId=e,this._taskId=t,this._error="",this._showSkip=!1,this._showReset=!1,this._showPostpone=!1,this._showAdaptive=!1,this._skipReason="",this._postponeDate="",this._resetDate=kt(new Date),this._open=!0,await Promise.all([this._loadTask(),this._loadFeatures()])}async _loadFeatures(){let e=await G(this.hass);this._features={...this._features,...e.features},this._access=e.access,this._currencySymbol=Te(e.budget??void 0),Dt(e.budget??void 0),this._partsCostMode=e.partsCostMode}close(){this._loadSeq++,this._open=!1,this._task=null,this._error="",this._toastTimer.clear(),this._toast=""}_showToast(e,t){this._toast=e,this._toastTimer.schedule(()=>{this._toast=""},t)}async _loadTask(){let e=this._entryId,t=this._taskId;if(!e||!t)return;let i=++this._loadSeq,a="",o=await O(this,{type:"maintenance_supporter/object",entry_id:e},{onError:h=>{a=h}});if(i!==this._loadSeq)return;if(o===void 0){this._error=a;return}this._objectName=o?.object?.name||"";let d=(o?.tasks||[]).find(h=>h.id===t);this._task=d??null,this._taskRef=fn(o?.object,d),d||(this._error=n("ws_err_not_found",this._lang))}_runWs(e){return this._error="",O(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_notifyChanged(e){this.dispatchEvent(new CustomEvent("task-action-fired",{detail:{entry_id:this._entryId,task_id:this._taskId,action:e},bubbles:!0,composed:!0}))}_onComplete(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(se(),pe)).then(async({openCompleteDialog:e})=>{let t=this._task,i=[];try{i=(await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0})).objects||[]}catch{}e(Kt({entryId:this._entryId,taskId:this._taskId,taskName:t.name,task:t,objects:i,lang:this._lang,features:this._features,currencySymbol:this._currencySymbol,partsCostMode:this._partsCostMode}))&&(this._notifyChanged("complete"),this.close())})}async _onSkipConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/skip",entry_id:this._entryId,task_id:this._taskId,reason:this._skipReason.trim()||null})!==void 0&&(this._notifyChanged("skip"),this.close())}async _onResetConfirm(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/reset",entry_id:this._entryId,task_id:this._taskId,date:this._resetDate||void 0})!==void 0&&(this._notifyChanged("reset"),this.close())}async _onPostponeConfirm(){if(!this._entryId||!this._taskId||!this._postponeDate)return;await this._runWs({type:"maintenance_supporter/task/postpone",entry_id:this._entryId,task_id:this._taskId,until:this._postponeDate})!==void 0&&(this._notifyChanged("postpone"),this.close())}async _onSnooze(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/snooze",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("snooze"),this.close())}_onEdit(){!this._entryId||!this._taskId||Promise.resolve().then(()=>(se(),pe)).then(({openEditTaskDialog:e})=>{e(this._entryId,this._taskId),this.close()})}_onQr(){!this._entryId||!this._taskId||!this._task||Promise.resolve().then(()=>(se(),pe)).then(({openQrDialog:e})=>{e({entry_id:this._entryId,task_id:this._taskId,task_name:this._task.name,object_name:this._objectName}),this.close()})}async _onDelete(){if(!this._entryId||!this._taskId||!await Re(this.hass,{title:n("delete",this._lang),message:n("delete_task_confirm",this._lang),confirmText:n("delete",this._lang),danger:!0}))return;await this._runWs({type:"maintenance_supporter/task/delete",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("delete"),this.close())}async _onArchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/archive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("archive"),this.close())}async _onUnarchive(){if(!this._entryId||!this._taskId)return;await this._runWs({type:"maintenance_supporter/task/unarchive",entry_id:this._entryId,task_id:this._taskId})!==void 0&&(this._notifyChanged("unarchive"),this.close())}_onOpenInPanel(){if(!this._entryId||!this._taskId)return;let e=`/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;history.pushState(null,"",e),window.dispatchEvent(new CustomEvent("location-changed")),this.close()}async _applySuggestion(){if(!this._entryId||!this._taskId||!this._task?.suggested_interval)return;await this._runWs({type:"maintenance_supporter/task/apply_suggestion",entry_id:this._entryId,task_id:this._taskId,interval:this._task.suggested_interval})!==void 0&&(this._showToast(n("suggestion_applied",this._lang)),this._notifyChanged("apply_suggestion"),await this._loadTask())}async _reanalyzeInterval(){if(!this._entryId||!this._taskId)return;let e=await this._runWs({type:"maintenance_supporter/task/analyze_interval",entry_id:this._entryId,task_id:this._taskId});e!==void 0&&(this._showToast(e?.recommended_interval?`${n("reanalyze_result",this._lang)}: ${vt(e.recommended_interval,"days",this._lang)} (${e.data_points} ${n("data_points",this._lang)})`:n("reanalyze_insufficient_data",this._lang)),await this._loadTask())}_onEditHistoryEntry(e){if(!this._entryId||!this._taskId)return;let t=_n(this._entryId,this._taskId,e,this._task);Promise.resolve().then(()=>(se(),pe)).then(({openHistoryEditDialog:i})=>i(t))}_renderRecommendation(e){if(!this._features.adaptive||!e.suggested_interval||e.suggested_interval===e.interval_days)return p;let t=this._lang;return l`
      <div class="recommendation-card">
        <h4>${n("suggested_interval",t)}</h4>
        ${In(e.interval_days,e.suggested_interval,e.interval_confidence||"medium",t)}
        <div class="recommendation-actions">
          ${te(this.hass?.user,this._access)?l`<button class="btn primary qa-apply-suggestion"
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
    `}_renderAdaptive(e){let t=this._lang,i=this._features.adaptive&&e.suggested_interval&&e.suggested_interval!==e.interval_days,a=e.degradation_trend!=null&&e.degradation_trend!=="insufficient_data"||e.days_until_threshold!=null||e.environmental_factor!=null&&e.environmental_factor!==1,o=this._features.adaptive&&e.interval_analysis?.weibull_beta!=null&&e.interval_analysis?.weibull_eta!=null,d=this._features.seasonal&&e.seasonal_factor&&e.seasonal_factor!==1;return!i&&!a&&!o&&!d?l`<div class="adaptive-empty">
        ${n("adaptive_no_data",t)}
      </div>`:l`
      <div class="adaptive-stack">
        ${this._toast?l`<div class="toast">${this._toast}</div>`:p}
        ${i?this._renderRecommendation(e):p}
        ${a?Cn(e,t,this._features):p}
        ${o?Tn(e,t):p}
        ${d?l`
          ${Nn(e,t,this._features)}
          ${e.seasonal_factors?.length===12||e.interval_analysis?.seasonal_factors?.length===12?jn(e,t):p}
        `:p}
      </div>
    `}_renderDetails(e){let t=this._lang,i=e.history||[],a=e.history_count??i.length,o=wn(i).slice(0,20);return l`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${n("times_performed",t)}</span>
            <span class="stat-value">${e.times_performed??0}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${n("total_cost",t)}</span>
            <span class="stat-value">${le(e.total_cost??0,this._currencySymbol,t)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${n("avg_duration",t)}</span>
            <span class="stat-value">${Mt(e.average_duration!=null?Math.round(e.average_duration):null,t)}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${n("history",t)}</strong>
          <span class="history-count">${a}</span>
        </div>
        ${i.length===0?l`<div class="history-empty">${n("history_empty",t)}</div>`:l`
              <div class="history-list">
                ${o.map(d=>kn(d,{lang:t,hass:this.hass,currencySymbol:this._currencySymbol,openEdit:te(this.hass?.user,this._access)?h=>this._onEditHistoryEntry(h):void 0,readingUnit:e.reading_unit,readingSlotDelta:(h,_)=>yr(i,h,_),taskRef:this._taskRef},{compact:!0}))}
                ${a>o.length?l`<div class="history-more">… +${a-o.length} ${n("older_entries",t)}</div>`:p}
              </div>
            `}
      </div>
    `}render(){if(!this._open)return p;let e=this._lang,t=this._task,i=te(this.hass?.user,this._access),a=!!t&&(!!t.archived||t.enabled===!1||t.status==="paused");return et(()=>this.close(),l`
        ${t?l`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${ci(t)}"></span>
                  <span class="task-name">${t.name}</span>
                  ${En(t,e)}
                </div>
                <div class="object">
                  <button class="link-inline" @click=${()=>{this._entryId&&Promise.resolve().then(()=>(se(),pe)).then(({openObjectQuickActions:o})=>{o(this._entryId),this.close()})}}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${t.next_due?l`<span><strong>${n("next_due",e)}:</strong> ${q(t.next_due,e)}</span>`:p}
                  ${t.last_performed?l`<span><strong>${n("last_performed",e)}:</strong> ${q(t.last_performed,e)}</span>`:p}
                  ${t.schedule?.kind&&!["manual","one_time"].includes(t.schedule.kind)||t.interval_days!=null?l`<span><strong>${n("interval",e)}:</strong> ${lr(t,e)}</span>`:p}
                  ${ge(t)?l`<span><strong>${n("phase_current",e)}:</strong> ${ge(t)}</span>`:p}
                </div>
                ${t.notes?l`<div class="notes-body">${li(t.notes)}</div>`:p}
              </div>

              ${this._error?l`<div class="error">${this._error}</div>`:p}

              ${this._showSkip?l`
                    <div class="inline-form">
                      <label>${n("skip_reason",e)}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${o=>{this._skipReason=o.target.value}} />
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
                      <label>${n("reset_to_date",e)}</label>
                      <ms-date-field
                        kind="date"
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
                      <label>${n("postpone_date_prompt",e)}</label>
                      <ms-date-field
                        kind="date"
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
    `)}updated(e){e.has("_open")&&this._open&&tt(this.shadowRoot)}};N.styles=[Ft,Xe,$`
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
  `],c([f({attribute:!1})],N.prototype,"hass",2),c([u()],N.prototype,"_open",2),c([u()],N.prototype,"_entryId",2),c([u()],N.prototype,"_taskId",2),c([u()],N.prototype,"_task",2),c([u()],N.prototype,"_objectName",2),c([u()],N.prototype,"_taskRef",2),c([u()],N.prototype,"_busy",2),c([u()],N.prototype,"_error",2),c([u()],N.prototype,"_showSkip",2),c([u()],N.prototype,"_showReset",2),c([u()],N.prototype,"_showPostpone",2),c([u()],N.prototype,"_showDetails",2),c([u()],N.prototype,"_showAdaptive",2),c([u()],N.prototype,"_skipReason",2),c([u()],N.prototype,"_resetDate",2),c([u()],N.prototype,"_postponeDate",2),c([u()],N.prototype,"_features",2),c([u()],N.prototype,"_toast",2),c([u()],N.prototype,"_access",2),c([u()],N.prototype,"_partsCostMode",2);customElements.get("maintenance-task-quick-actions-dialog")||customElements.define("maintenance-task-quick-actions-dialog",N)});var Z,qn=y(()=>{"use strict";C();Hi();ns();H();R();be();ls();Ve();Ue();oi();ai();Z=class extends S{constructor(){super(...arguments);this._open=!1;this._entryId=null;this._data=null;this._busy=!1;this._error="";this._access=ce}get _lang(){return I(this.hass)}async openFor(e){this._entryId=e,this._error="",this._open=!0,await Promise.all([this._load(),G(this.hass).then(t=>{this._access=t.access})])}close(){this._open=!1,this._data=null,this._error=""}async _load(){if(!this._entryId)return;let e=await O(this,{type:"maintenance_supporter/object",entry_id:this._entryId},{onError:t=>{this._error=t}});e!==void 0&&(this._data=e)}_runWs(e){return this._error="",O(this,e,{busy:t=>{this._busy=t},onError:t=>{this._error=t}})}_onEditObject(){!this._entryId||!this._data||Promise.resolve().then(()=>(se(),pe)).then(({openEditObjectDialog:e})=>{e(this._entryId,this._data.object),this.close()})}_onAddTask(){this._entryId&&Promise.resolve().then(()=>(se(),pe)).then(({openCreateTaskDialog:e})=>{e(this._entryId),this.close()})}async _onDelete(){if(!this._entryId||!this._data||!await Re(this.hass,{title:n("delete",this._lang),message:n("delete_object_confirm",this._lang),confirmText:n("delete",this._lang),danger:!0}))return;let t=this._entryId;await this._runWs({type:"maintenance_supporter/object/delete",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-deleted",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}async _onArchiveObject(){if(!this._entryId||!this._data)return;let e=!!this._data.object.archived;if(!e&&!await Re(this.hass,{title:n("archive_object",this._lang),message:n("confirm_archive_object",this._lang),confirmText:n("archive_object",this._lang)}))return;let t=this._entryId;await this._runWs({type:e?"maintenance_supporter/object/unarchive":"maintenance_supporter/object/archive",entry_id:t})!==void 0&&(this.dispatchEvent(new CustomEvent("object-changed",{detail:{entry_id:t},bubbles:!0,composed:!0})),this.close())}_onTaskClick(e){this._entryId&&Promise.resolve().then(()=>(se(),pe)).then(({openTaskQuickActions:t})=>{t(this._entryId,e)})}render(){if(!this._open)return p;let e=this._lang,t=this._data,i=t?.object,a=t?.tasks||[],o=te(this.hass?.user,this._access);return et(()=>this.close(),l`
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
                        ${a.map(d=>l`
                          <div class="task-row" @click=${()=>this._onTaskClick(d.id)}>
                            <span class="status-dot" style="background: ${ci(d)}"></span>
                            <span class="task-name">${d.name}</span>
                            <span class="task-status ${At(d)}">${os(At(d),e)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${i.notes?l`
                    <div class="notes-section">
                      <strong>${n("object_notes_label",e)}</strong>
                      <div class="notes-body">${li(i.notes)}</div>
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
            `:l`<div class="loading">${n("loading",e)}</div>`}
    `)}updated(e){e.has("_open")&&this._open&&tt(this.shadowRoot)}_renderMetaRow(e){let t=this._lang,i=[];return e.area_id&&i.push([n("area",t),e.area_id]),e.manufacturer&&i.push([n("manufacturer",t),e.manufacturer]),e.model&&i.push([n("model",t),e.model]),e.serial_number&&i.push([n("serial_number_label",t),e.serial_number]),e.installation_date&&i.push([n("installed",t),e.installation_date]),e.warranty_expiry&&i.push([n("warranty",t),e.warranty_expiry]),e.documentation_url&&i.push([n("documentation_url_label",t),e.documentation_url]),i.length===0?p:l`
      <div class="meta">
        ${i.map(([a,o])=>l`
            <div class="meta-item">
              <span class="meta-label">${a}</span>
              <span class="meta-value">${Ut(o)?l`<a href="${o}" target="_blank" rel="noopener noreferrer">${o}</a>`:o}</span>
            </div>
          `)}
      </div>
    `}};Z.styles=[Xe,$`
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
  `],c([f({attribute:!1})],Z.prototype,"hass",2),c([u()],Z.prototype,"_open",2),c([u()],Z.prototype,"_entryId",2),c([u()],Z.prototype,"_data",2),c([u()],Z.prototype,"_busy",2),c([u()],Z.prototype,"_error",2),c([u()],Z.prototype,"_access",2);customElements.get("maintenance-object-quick-actions-dialog")||customElements.define("maintenance-object-quick-actions-dialog",Z)});var pe={};Kn(pe,{__resetSettingsCacheForTests:()=>Oo,getRowActionStyle:()=>jo,openCompleteDialog:()=>Mo,openCreateObjectDialog:()=>cs,openCreateTaskDialog:()=>ds,openEditObjectDialog:()=>Ho,openEditTaskDialog:()=>qo,openHistoryEditDialog:()=>Do,openObjectQuickActions:()=>Fo,openQrDialog:()=>zo,openTaskQuickActions:()=>ps});function pi(){return document.querySelector("home-assistant")?.hass}function No(){return document.querySelector("home-assistant")?.shadowRoot??document.body}function ue(r){let s=No(),e=s.querySelector(r)??document.body.querySelector(r);return e?e.parentNode!==s&&s.appendChild(e):(e=document.createElement(r),s.appendChild(e)),e}function he(r){let s=pi();if(!s)return!1;r.hass=s;let e=I(s);return gt(e)||ae(e).then(()=>{r.requestUpdate?.()}),Pi(s.locale,s.config?.country),!0}function jo(r){return G(r).then(s=>s.rowActionStyle)}function Oo(){Lr()}function cs(){let r=ue(Dn);return he(r)?(r.openCreate(),!0):!1}function Ho(r,s){let e=ue(Dn);return he(e)?(e.openEdit(r,s),!0):!1}function ds(r="",s){let e=ue(Mn);if(!he(e))return!1;let t=pi();return t?((async()=>{let i=await G(t),a=e;zn(a,i),a.openCreate(r,s)})(),!0):!1}function zn(r,s){r.checklistsEnabled=s.features.checklists,r.scheduleTimeEnabled=s.features.schedule_time,r.completionActionsEnabled=s.features.completion_actions,r.adaptiveFeature=s.features.adaptive,r.seasonalFeature=s.features.seasonal,r.environmentalFeature=s.features.environmental,r.defaultWarningDays=s.defaultWarningDays}function qo(r,s){let e=ue(Mn);if(!he(e))return!1;let t=pi();return t?((async()=>{try{let[i,a]=await Promise.all([t.connection.sendMessagePromise({type:"maintenance_supporter/object",entry_id:r}),G(t)]),o=(i.tasks||[]).find(h=>h.id===s);if(!o){console.warn(`openEditTaskDialog: task ${s} not found in entry ${r}`);return}let d=e;zn(d,a),await d.openEdit(r,o)}catch(i){console.warn("openEditTaskDialog: failed to load task/features",i)}})(),!0):!1}function Do(r){let s=ue(Co);return he(s)?(s.openEdit(r),!0):!1}function Mo(r){let s=ue(Ro);return he(s)?(Yt(s,r,I(pi())),!0):!1}function zo(r){let s=ue(Io);return he(s)?(s.openForTask(r.entry_id,r.task_id,r.object_name,r.task_name),!0):!1}function ps(r,s){let e=ue(Po);return he(e)?(e.openFor(r,s),!0):!1}function Fo(r){let s=ue(Lo);return he(s)?(s.openFor(r),!0):!1}var Dn,Mn,Co,Ro,Io,Po,Lo,se=y(()=>{"use strict";Jr();ln();Ji();un();hn();Hn();qn();R();Qt();Ve();Dn="maintenance-object-dialog",Mn="maintenance-task-dialog",Co="maintenance-history-edit-dialog",Ro="maintenance-complete-dialog",Io="maintenance-qr-dialog",Po="maintenance-task-quick-actions-dialog",Lo="maintenance-object-quick-actions-dialog"});C();var la=["assignee_pool","required_completion_fields","checklist","labels","mirror_todo_entities","next_event_titles","history","readings"],ca=["checklist_progress"],da=["tasks","parts"],pa=["manual_docs","battery_fleet_excluded"];function Ei(r,s,e=[]){for(let t of s)r[t]===void 0&&(r[t]=[]);for(let t of e)r[t]===void 0&&(r[t]={})}function ua(r){let s=r;Ei(s,da),s.object&&typeof s.object=="object"&&Ei(s.object,pa);for(let e of s.tasks)Ei(e,la,ca);return r}function ut(r){for(let s of r)ua(s);return r}function ha(r,s){if(s.objects)return s.objects;let e=s.delta||[],t=s.removed||[];if(!e.length&&!t.length)return null;let i=new Map(r.map(a=>[a.entry_id,a]));for(let a of e)i.set(a.entry_id,a);for(let a of t)i.delete(a);return[...i.values()]}function qs(r,s){return s.objects&&ut(s.objects),s.delta&&ut(s.delta),ha(r,s)}H();R();Oi();Hi();function ur(){return window.customCards??[]}function ze(r){let s=window;s.customCards=s.customCards||[],s.customCards.some(e=>e.type===r.type)||s.customCards.push(r)}function hr(r,s,e=t=>import(t)){let t=window,i;try{let m=new URL(s);i=m.origin+m.pathname}catch{return}let a=`__msCardHeal:${r[0]}:${i}`;if(t[a])return;t[a]=!0;let o=0,d=0,h=!1,_=()=>{if(o+=1,r.some(b=>!customElements.get(b))&&d<3&&!h){d+=1,h=!0;try{let b=new URL(s);b.searchParams.set("heal",`${Date.now()}`),e(b.href).catch(()=>{}).finally(()=>{h=!1})}catch{return}}o<20&&window.setTimeout(_,o<8?500:2e3)};window.setTimeout(_,250)}ft();var Ta={"maintenance-supporter-card":[null,"picker_desc_card"],"maintenance-supporter-calendar-card":["picker_name_calendar","picker_desc_calendar"],"maintenance-supporter-panel-card":["picker_name_panel","picker_desc_panel"],"maintenance-budget-section-card":["picker_name_budget","picker_desc_budget"],"maintenance-groups-section-card":["picker_name_groups","picker_desc_groups"],"maintenance-vacation-section-card":["picker_name_vacation","picker_desc_vacation"],"maintenance-battery-fleet-card":["picker_name_battery_fleet","picker_desc_battery_fleet"],"maintenance-supporter":[null,"picker_desc_dashboard"],"maintenance-supporter-section":["picker_name_section","picker_desc_section"],"maintenance-supporter-vacation":["picker_name_vacation_status","picker_desc_vacation_status"],"maintenance-supporter-budget":["picker_name_budget_status","picker_desc_budget_status"],"maintenance-supporter-groups":["picker_name_groups","picker_desc_groups_status"]},qi=new WeakMap;function Aa(r){let s=window;for(let e of[...ur(),...s.customStrategies??[]]){let t=Ta[e.type];if(!t)continue;qi.has(e)||qi.set(e,{name:e.name,description:e.description});let i=qi.get(e),[a,o]=t;a&&(e.name=n(a,r,i.name)),e.description=n(o,r,i.description)}}function Bt(){let r=0,s=()=>{let e=document.querySelector("home-assistant")?.hass;if(e?.language){let t=e.language;ae(t).then(()=>Aa(t));return}++r<60&&setTimeout(s,1e3)};s()}zi();Mi();Vt();C();function mr(r){let s=(r??[]).filter(e=>!!e);return s.length?l`<span class="event-titles"> · ${s.join(", ")}</span>`:p}Qt();Ve();Ue();qe();C();H();R();qe();var ie=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._objects=[];this._loadingObjects=!0;this._loadError=!1;this._views=[];this._objectsLoaded=!1;this._onEntitiesChanged=e=>{this._valueChanged("entity_ids",e.detail.value||[])}}get _lang(){return I(this.hass)}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._objectsLoaded&&(this._objectsLoaded=!0,this._loadObjects())}async _loadObjects(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects"});this._objects=e.objects||[],this._loadError=!1}catch{this._objects=[],this._loadError=!0}this._loadingObjects=!1;try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e.views||[]}catch{this._views=[]}}_valueChanged(e,t){let i={...this._config,[e]:t};(Array.isArray(t)&&t.length===0||t===""||t===void 0||t===null)&&delete i[e],this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i}}))}_toggleStatus(e,t){let i=new Set(this._config.filter_status||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_status",[...i])}_toggleObject(e,t){let i=new Set(this._config.filter_objects||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_objects",[...i])}_toggleLabel(e,t){let i=new Set(this._config.filter_labels||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_labels",[...i])}_toggleArea(e,t){let i=new Set(this._config.filter_areas||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_areas",[...i])}_togglePriority(e,t){let i=new Set(this._config.filter_priority||[]);t?i.add(e):i.delete(e),this._valueChanged("filter_priority",[...i])}render(){let e=this._lang,t=new Set(this._config.filter_status||[]),i=new Set(this._config.filter_objects||[]),a=[...this._objects].map(v=>v.object.name).sort((v,x)=>v.localeCompare(x)),o=new Set(this._config.filter_areas||[]),d=[...new Set(this._objects.map(v=>v.object.area_id).filter(v=>!!v).concat([...o]))],h=v=>this.hass?.areas?.[v]?.name||v,_=d.map(v=>({id:v,name:h(v)})).sort((v,x)=>v.name.localeCompare(x.name)),m=new Set(this._config.filter_labels||[]),b=new Set(this._config.filter_priority||[]),k=[...new Set(this._objects.flatMap(v=>v.tasks.flatMap(x=>x.labels||[])))].sort((v,x)=>v.localeCompare(x)),w=[];for(let v of this._objects)for(let x of v.tasks)x.sensor_entity_id&&w.push(x.sensor_entity_id),x.binary_sensor_entity_id&&w.push(x.binary_sensor_entity_id);return l`
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
            ${Ot.map(v=>l`
              <label class="chip ${t.has(v)?"active":""}">
                <input type="checkbox"
                  .checked=${t.has(v)}
                  @change=${x=>this._toggleStatus(v,x.target.checked)} />
                ${n(v,e)}
              </label>
            `)}
          </div>
          <div class="field-help">${n("card_filter_status_help",e)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${n("card_filter_objects",e)}</div>
          ${this._loadingObjects?l`<div class="field-help">${n("card_loading_objects",e)}</div>`:this._loadError?l`<div class="field-help error-text">${n("card_load_error",e)}</div>`:a.length===0?l`<div class="field-help">${n("no_objects",e)}</div>`:l`
                <div class="object-list">
                  ${a.map(v=>l`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${i.has(v)}
                        @change=${x=>this._toggleObject(v,x.target.checked)} />
                      <span>${v}</span>
                    </label>
                  `)}
                </div>
                <div class="field-help">${n("card_filter_objects_help",e)}</div>
              `}
        </div>
        <!-- Area filter (C8): selects whole objects by the room they sit in.
             Hidden while no object has an area — the section would be an
             empty box otherwise. -->
        ${_.length?l`
        <div class="field">
          <div class="field-label">${n("card_filter_areas",e)}</div>
          <div class="object-list">
            ${_.map(v=>l`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${o.has(v.id)}
                  @change=${x=>this._toggleArea(v.id,x.target.checked)} />
                <span>${v.name}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${n("card_filter_areas_help",e)}</div>
        </div>`:p}
        ${k.length?l`
        <div class="field">
          <div class="field-label">${n("labels",e)}</div>
          <div class="object-list">
            ${k.map(v=>l`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${m.has(v)}
                  @change=${x=>this._toggleLabel(v,x.target.checked)} />
                <span>${v}</span>
              </label>
            `)}
          </div>
        </div>`:p}
        <div class="field">
          <div class="field-label">${n("priority",e)}</div>
          <div class="object-list">
            ${["high","normal","low"].map(v=>l`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${b.has(v)}
                  @change=${x=>this._togglePriority(v,x.target.checked)} />
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
            .includeEntities=${w}
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
            @change=${v=>{let x=v.target.value;this._valueChanged("action_style",x===""?void 0:x)}}
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
    `}};ie.styles=$`
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
  `,c([f({attribute:!1})],ie.prototype,"hass",2),c([u()],ie.prototype,"_config",2),c([u()],ie.prototype,"_objects",2),c([u()],ie.prototype,"_loadingObjects",2),c([u()],ie.prototype,"_loadError",2),c([u()],ie.prototype,"_views",2);customElements.get("maintenance-supporter-card-editor")||customElements.define("maintenance-supporter-card-editor",ie);Ji();C();H();C();H();R();Yi();be();Ue();Ve();Zt();ri();var z=class z extends S{constructor(){super(...arguments);this.flat=!1;this._ov=null;this._loading=!1;this._marking=!1;this._error="";this._history=null;this._rosterSort=z._storedSort();this._typeFilter=null;this._recorded=[];this._access=ce;this._historyRequested=!1;this._localeReady=!1;this._markAll=async()=>{await this._mark(void 0)};this._repair=async()=>{await this._act({type:"maintenance_supporter/battery_fleet/setup",language:this._lang})};this._loadHistory=async e=>{let t=e.target.open;if(St(ye.batteryRosterOpen,t?"1":"0"),!(!t||this._historyRequested)){this._historyRequested=!0;try{let i=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/battery_fleet/overview_history"});this._history=i.series}catch{this._history=null}}}}get _lang(){return I(this.hass)}get _canWrite(){return te(this.hass?.user,this._access)}connectedCallback(){super.connectedCallback(),this.hass&&this._load()}updated(e){qt(this,e),e.has("hass")&&this.hass&&!this._localeReady&&(this._localeReady=!0,ae(this._lang).then(()=>this.requestUpdate()),G(this.hass).then(t=>{this._access=t.access}),this._ov===null&&!this._loading&&this._load())}async _load(){this._error="";let e=await O(this,{type:"maintenance_supporter/battery_fleet/overview"},{busy:t=>{this._loading=t},onError:t=>{this._error=t}});e!==void 0&&(this._ov=e)}async _act(e,t){this._marking||(this._error="",await O(this,e,{busy:i=>{this._marking=i},reload:async()=>{t?.(),await this._load()},onError:i=>{this._error=i}}))}async _mark(e){await this._act({type:"maintenance_supporter/battery_fleet/mark_replaced",...e?{entity_ids:e}:{}})}async _setExcluded(e,t){await this._act({type:"maintenance_supporter/battery_fleet/set_excluded",entity_id:e,excluded:t})}async _addBattery(e){let t=e.detail?.value;t&&await this._act({type:"maintenance_supporter/battery_fleet/set_included",entity_id:t,included:!0})}async _setTrackSelf(e){await this._setFleetOption("set_track_self_charging",e.target.checked)}async _setDueWithoutSensor(e){await this._setFleetOption("set_due_without_sensor",e.target.checked)}async _setFleetOption(e,t){await this._act({type:`maintenance_supporter/battery_fleet/${e}`,enabled:t})}_rosterOpen(){return Et(ye.batteryRosterOpen)!=="0"}_predictedTitle(e,t){if(e.forecast_overdue)return n("battery_fleet_forecast_overdue",t);let i=this._predictedDate(e.days_until??0);if(e.predicted_source==="trend")return n("battery_fleet_predicted_trend",t).replace("{date}",i).replace("{confidence}",n("cal_confidence_"+(e.prediction_confidence||"medium"),t));if(e.lifetime_months!=null&&e.lifetime_source){let a=n("lifetime_source_"+e.lifetime_source,t).replace("{n}",String(e.lifetime_samples??0));return n("battery_fleet_predicted_typical",t).replace("{date}",i).replace("{months}",String(e.lifetime_months)).replace("{type}",e.battery_type).replace("{source}",a)}return n("battery_fleet_predicted_on",t).replace("{date}",i)}_sparkline(e){let t=this._history?.[e.entity_id];if(!t||t.points.length<2)return p;let i=110,a=24,o=2,d=t.points[0][0],h=t.points[t.points.length-1][0],_=Date.now()/1e3,m=e.status!=="low"&&e.predicted_source==="trend"&&e.days_until!=null?_+e.days_until*86400:null,b=Math.max(h,m??h),k=P=>b===d?o:o+(P-d)/(b-d)*(i-2*o),w=P=>o+(1-Math.min(100,Math.max(0,P))/100)*(a-2*o),v=t.points.map(([P,V])=>`${A(k(P))},${A(w(V))}`).join(" "),x=t.points[t.points.length-1][1],E=A(w(t.threshold));return l`<svg
      class="bf-spark"
      viewBox="0 0 ${i} ${a}"
      role="img"
      aria-label=${n("battery_fleet_sparkline_hint",this._lang)}
    >
      <title>${n("battery_fleet_sparkline_hint",this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${E} x2=${i} y2=${E}></line>
      <polyline class="bf-spark-line" points=${v}></polyline>
      ${m!==null?l`<line
            class="bf-spark-proj"
            x1=${A(k(h))}
            y1=${A(w(x))}
            x2=${A(k(m))}
            y2=${E}
          ></line>`:p}
    </svg>`}static _storedSort(){return Et(ye.batteryRosterSort)==="name"?"name":"urgency"}_setSort(e){this._rosterSort=e,St(ye.batteryRosterSort,e)}_sortedRoster(e){let t=this._typeFilter===null?e:e.filter(a=>a.battery_type===this._typeFilter);if(this._rosterSort==="name")return t;let i=a=>a.status==="low"?-1e3+(a.level??101)/101:a.days_until??1/0;return[...t].sort((a,o)=>i(a)-i(o)||a.device_name.localeCompare(o.device_name))}_predictedDate(e){return this._fmtDate(Date.now()+e*864e5)}_fmtDate(e){return q(kt(new Date(e)),this._lang)}_shoppingLine(e){return Object.entries(e).map(([t,i])=>l`<button
        class="bf-type-chip ${this._typeFilter===t?"bf-type-chip-active":""}"
        title=${n("battery_fleet_filter_type",this._lang)}
        @click=${()=>this._toggleTypeFilter(t)}
      >
        ${i}× ${t}
      </button>`)}_toggleTypeFilter(e){if(this._typeFilter=this._typeFilter===e?null:e,this._typeFilter!==null){let t=this.shadowRoot?.querySelector("details.bf-roster");t&&!t.open&&(t.open=!0)}}async _recordJump(e,t){await this._act({type:"maintenance_supporter/battery_fleet/record_replacement",entity_id:e,replaced_at:new Date(t.at*1e3).toISOString()},()=>{this._recorded=[...this._recorded,e]})}_levelBar(e){let t=e.level;if(t==null)return p;let i=e.low_threshold??20,a=t<=i?"bad":t<=i+20?"warn":"good";return l`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${a}" style="width: ${Math.min(100,Math.max(0,t))}%"></span
    ></span>`}_jumpButton(e,t){let i=this._history?.[e.entity_id]?.jump;return!i||this._recorded.includes(e.entity_id)?p:l`<button
      class="bf-mark bf-jump"
      title=${n("battery_fleet_record_replacement",t).replace("{date}",this._fmtDate(i.at*1e3))}
      .disabled=${this._marking}
      @click=${()=>this._recordJump(e.entity_id,i)}
    >
      <ha-icon icon="mdi:calendar-sync"></ha-icon>
    </button>`}_renderRow(e,t,i){let a=e.available===!1?l`<span class="bf-offline">${n("battery_fleet_offline",t)}</span>`:e.no_sensor?l`<span class="bf-offline bf-nosensor">${n("battery_fleet_no_sensor",t)}</span>`:p,o=l`<span class="bf-type">${e.quantity}× ${e.battery_type}</span>`,d=this._canWrite,h=d&&(i.mark==="always"||e.no_sensor||e.can_mark_replaced);return l`
      <div class="bf-row">
        <span class="bf-dev">${e.device_name}</span>
        ${i.status?l`<span class="bf-status bf-${e.status}"
                >${e.no_sensor&&e.status==="low"?n("battery_fleet_status_due",t):n("battery_fleet_status_"+e.status,t)}</span
              >${o}${a}`:l`${a}${o}`}
        ${i.recharge&&e.rechargeable?l`<span class="bf-recharge" title=${n("battery_fleet_rechargeable",t)}
              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
            ></span>`:p}
        ${i.sparkline?this._sparkline(e):p}
        ${this._levelBar(e)}
        ${e.level!=null?l`<span class="bf-level">${e.level}%</span>`:p}
        ${h?l`<button
              class="bf-mark${i.mark==="replaced"?" bf-replaced":""}"
              title=${e.rechargeable?n("battery_fleet_mark_recharged",t):n("battery_fleet_mark_one",t)}
              .disabled=${this._marking}
              @click=${()=>this._mark([e.entity_id])}
            >
              <ha-icon icon="mdi:battery-sync"></ha-icon>
            </button>`:p}
        ${i.jump&&d?this._jumpButton(e,t):p}
        ${i.predicted&&e.days_until!=null?l`<span
              class="bf-predicted ${e.predicted_source==="trend"?"bf-trend":""} ${e.forecast_overdue?"bf-overdue":""}"
              title=${this._predictedTitle(e,t)}
              >${e.forecast_overdue?l`<ha-icon icon="mdi:calendar-alert"></ha-icon>`:p}~${this._predictedDate(e.days_until)}</span
            >`:p}
        ${i.exclude&&d?l`<button
              class="bf-mark bf-exclude"
              title=${n("battery_fleet_exclude",t)}
              .disabled=${this._marking}
              @click=${()=>this._setExcluded(e.entity_id,!0)}
            >
              <ha-icon icon="mdi:eye-off-outline"></ha-icon>
            </button>`:p}
      </div>
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
                ${t.low.map(a=>this._renderRow(a,e,{recharge:!0,mark:"always",exclude:!0}))}
              </div>
              ${this._canWrite?l`<div class="bf-actions">
                    <ha-button .disabled=${this._marking} @click=${this._markAll}>
                      <ha-icon icon="mdi:battery-sync"></ha-icon> ${n("battery_fleet_mark_all",e)}
                    </ha-button>
                  </div>`:p}
            `}

        ${t.soon.length?l`
              <div class="bf-soon">
                <span class="bf-label">${n("battery_fleet_soon",e)}</span>
                <span class="bf-list">${this._shoppingLine(t.needs_soon)}</span>
                <div class="bf-soon-hint">${n("battery_fleet_soon_hint",e)}</div>
              </div>
              <div class="bf-rows bf-soon-rows">
                ${t.soon.map(a=>this._renderRow(a,e,{mark:"replaced",predicted:!0}))}
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
                  ${this._sortedRoster(t.all).map(a=>this._renderRow(a,e,{status:!0,recharge:!0,sparkline:!0,mark:"replaced",jump:!0,predicted:!0,exclude:!0}))}
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
    `}};z.styles=$`
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
    .bf-row .bf-mark {
      grid-column: 8;
    }
    /* D#162: the sensorless row's Replaced action sits in the percentage
     * slot (always empty for such a row) instead of the row-action column
     * - a new max-content track there widens EVERY row via the subgrid
     * and pushed the phone roster 34 px past its edge. */
    .bf-row .bf-mark.bf-replaced {
      grid-column: 7;
      justify-self: end;
    }
    /* D#162 (maisun's iPhone): since 2.79 rows WITH a level offer Replaced
     * too — level and button shared column 7 and overlapped. With a
     * percentage present the button takes the row-action column instead. */
    .bf-row .bf-level + .bf-mark.bf-replaced {
      grid-column: 8;
      justify-self: start;
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
      .bf-row .bf-level + .bf-mark.bf-replaced {
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
  `,c([f({attribute:!1})],z.prototype,"hass",2),c([f({type:Boolean})],z.prototype,"flat",2),c([u()],z.prototype,"_ov",2),c([u()],z.prototype,"_loading",2),c([u()],z.prototype,"_marking",2),c([u()],z.prototype,"_error",2),c([u()],z.prototype,"_history",2),c([u()],z.prototype,"_rosterSort",2),c([u()],z.prototype,"_typeFilter",2),c([u()],z.prototype,"_recorded",2),c([u()],z.prototype,"_access",2);var Zi=z;customElements.get("maintenance-battery-fleet-section")||customElements.define("maintenance-battery-fleet-section",Zi);var Ze=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-battery-fleet-card"}}static getStubConfig(){return{type:"custom:maintenance-battery-fleet-card"}}setConfig(e){this._config=e}getCardSize(){return 6}render(){return this.hass?l`
      <ha-card .header=${this._config.title||void 0}>
        <div class="content">
          <maintenance-battery-fleet-section flat .hass=${this.hass}></maintenance-battery-fleet-section>
        </div>
      </ha-card>
    `:p}};Ze.styles=$`
    ha-card {
      overflow: hidden;
    }
    .content {
      padding: 12px 16px 14px;
    }
  `,c([f({attribute:!1})],Ze.prototype,"hass",2),c([u()],Ze.prototype,"_config",2);customElements.get("maintenance-battery-fleet-card")||customElements.define("maintenance-battery-fleet-card",Ze);ze({type:"maintenance-battery-fleet-card",name:"Battery Fleet",description:"All tracked batteries: what is low now, what runs out soon, and what to buy.",preview:!1});se();C();H();var us=["today","dashboard","calendar","settings"];R();var it="maintenance-supporter-panel-card",hs="maintenance-supporter-panel",ms="maintenance-supporter",_s=870,Uo=320,Bo=480;function Wo(r){let e=r?.panels?.[ms]?.config?._panel_custom?.module_url;return typeof e=="string"&&e.startsWith("/")?e:null}function Vo(r){if(r==null||r===""||r==="fill")return null;if(typeof r=="number")return r>0?`${Math.round(r)}px`:null;let s=String(r).trim();return/^\d+(\.\d+)?$/.test(s)?`${s}px`:s||null}var gs=class extends HTMLElement{constructor(){super();this._config={type:`custom:${it}`};this._panel=null;this._loading=null;this._observer=null;this._lastWidth=-1;this._preview=!1;this._onResize=()=>this._layout(!0);let e=this.attachShadow({mode:"open"}),t=document.createElement("style");t.textContent=`
      :host { display: block; box-sizing: border-box; overflow: hidden; border-radius: var(--ha-card-border-radius, 12px); }
      .status { padding: 16px; color: var(--secondary-text-color); font-size: 14px; }
      ${hs} { display: block; height: 100%; }
    `,e.appendChild(t),this._status=document.createElement("div"),this._status.className="status",this._status.hidden=!0,e.appendChild(this._status)}static getConfigElement(){return document.createElement("maintenance-supporter-panel-card-editor")}static getStubConfig(){return{type:`custom:${it}`}}set preview(e){this._preview=!!e,this._layout(!0)}get preview(){return this._preview}_inEditorPreview(){if(this._preview)return!0;let e=this;for(let t=0;e&&t<40;t++){let i=e;if(i.tagName==="HUI-CARD-PREVIEW"||i.tagName==="HUI-DIALOG-EDIT-CARD")return!0;e=i.parentElement??i.getRootNode().host??null}return!1}setConfig(e){this._config={...e},this._panel&&(this._panel.presets=this._presets()),this._layout(!0)}getCardSize(){return 12}getGridOptions(){return{columns:"full",rows:"auto"}}set hass(e){this._hass=e,this._panel?this._panel.hass=e:this._mount()}get hass(){return this._hass}connectedCallback(){typeof ResizeObserver<"u"&&!this._observer&&(this._observer=new ResizeObserver(()=>this._layout(!1)),this._observer.observe(this)),window.addEventListener("resize",this._onResize),this._layout(!0),this._hass&&this._mount()}disconnectedCallback(){this._observer?.disconnect(),this._observer=null,window.removeEventListener("resize",this._onResize)}_presets(){let e={};return us.includes(this._config.tab??"")&&(e.tab=this._config.tab),typeof this._config.view=="string"&&this._config.view.trim()&&(e.view=this._config.view.trim()),e}_setStatus(e){this._status.textContent=e,this._status.hidden=!1}async _mount(){if(this._panel||this._loading||!this._hass||!this.isConnected)return;let e=I(this._hass);if(!customElements.get(hs)){let i=Wo(this._hass);if(!i){this._setStatus(n("panel_card_not_registered",e));return}this._loading=import(i).then(()=>{},()=>{throw this._setStatus(n("panel_card_load_failed",e)),new Error("panel bundle failed to load")});try{await this._loading}catch{return}finally{this._loading=null}if(this._panel||!this._hass||!this.isConnected)return}let t=document.createElement(hs);t.embedded=!0,t.panel=this._hass.panels?.[ms]??{url_path:ms},t.presets=this._presets(),t.narrow=this._narrow(),t.hass=this._hass,this._status.hidden=!0,this.shadowRoot.appendChild(t),this._panel=t,this._layout(!0)}_narrow(){let e=this.getBoundingClientRect().width;return e>0?e<_s:window.innerWidth<_s}_layout(e){let t=this.getBoundingClientRect(),i=Math.round(t.width)!==this._lastWidth;if(!e&&!i)return;this._lastWidth=Math.round(t.width),this._panel&&t.width>0&&(this._panel.narrow=t.width<_s);let a=Vo(this._config.height);if(a){this.style.height=a;return}if(!this.isConnected)return;if(this._inEditorPreview()){this.style.height=`${Bo}px`;return}let o=Math.max(0,this._unscrolledTop(t)),d=Math.max(Uo,Math.floor(window.innerHeight-o));this.style.height=`${d}px`}_unscrolledTop(e){let t=e.top+window.scrollY,i=this.ownerDocument,a=this.parentElement??this.getRootNode().host??null;for(let o=0;a&&o<100;o++){let d=a;d!==i.documentElement&&d!==i.body&&typeof d.scrollTop=="number"&&d.scrollTop>0&&(t+=d.scrollTop),a=d.parentElement??d.getRootNode().host??null}return t}},Pe=class extends S{constructor(){super(...arguments);this._config={type:`custom:${it}`};this._views=[];this._viewsLoaded=!1}setConfig(e){this._config={...e}}updated(e){super.updated(e),e.has("hass")&&this.hass&&!this._viewsLoaded&&(this._viewsLoaded=!0,this._loadViews())}async _loadViews(){try{let e=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"});this._views=e?.views||[]}catch{this._views=[]}}_set(e,t){let i={...this._config};t===""||t===void 0?delete i[e]:i[e]=t,this._config=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0}))}render(){let e=I(this.hass),t=i=>n(i==="today"?"tab_today":i==="calendar"?"tab_calendar":i,e);return l`
      <div class="editor">
        <div class="field">
          <div class="field-label">${n("panel_card_tab",e)}</div>
          <select class="tab-select" .value=${this._config.tab||""} @change=${i=>this._set("tab",i.target.value)}>
            <option value="" ?selected=${!this._config.tab}>${n("panel_card_tab_default",e)}</option>
            ${us.map(i=>l`<option value=${i} ?selected=${this._config.tab===i}>${t(i)}</option>`)}
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
    `}};Pe.styles=$`
    .editor { display: flex; flex-direction: column; gap: 16px; padding: 16px; }
    input.height-input { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; box-sizing: border-box; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .field-label { font-size: 13px; color: var(--secondary-text-color); font-weight: 500; }
    .field-help { font-size: 12px; color: var(--secondary-text-color); }
    select { padding: 8px; border-radius: 4px; border: 1px solid var(--divider-color); background: var(--card-background-color); color: var(--primary-text-color); font-size: 14px; max-width: 320px; }
  `,c([f({attribute:!1})],Pe.prototype,"hass",2),c([u()],Pe.prototype,"_config",2),c([u()],Pe.prototype,"_views",2);customElements.get(it)||customElements.define(it,gs);customElements.get("maintenance-supporter-panel-card-editor")||customElements.define("maintenance-supporter-panel-card-editor",Pe);ze({type:it,name:"Maintenance Supporter \u2014 Panel",description:"The complete Maintenance Supporter panel as a card \u2014 for a panel view / dashboard subview without the sidebar entry.",preview:!1});Bt();var F=class extends S{constructor(){super(...arguments);this._config={type:"custom:maintenance-supporter-card"};this._globalRowStyle="buttons_compact";this._settings=We;this._firstLoadDone=!1;this._objects=[];this._stats=null;this._unsub=null;this._viewFilters=null;this._userNames={};this._userPersons={};this._userService=null;this._userNamesLoaded=!1;this._taskDocs={};this._docsLoadedFor=new Set;this._dataLoaded=!1;this._lastConnection=null;this._onCompleted=async()=>{await this._loadData()}}get _lang(){return I(this.hass)}static getConfigElement(){return document.createElement("maintenance-supporter-card-editor")}static getStubConfig(){return{type:"custom:maintenance-supporter-card",show_header:!0,show_actions:!0,filter_status:[...Ti],max_items:10}}setConfig(e){let t=e.view_id!==this._config.view_id;this._config=e,t&&this._dataLoaded&&this.hass&&this._loadViewFilters()}getCardSize(){return 3}connectedCallback(){super.connectedCallback()}disconnectedCallback(){super.disconnectedCallback(),this._unsub&&(this._unsub(),this._unsub=null),this._dataLoaded=!1,this._lastConnection=null}updated(e){if(super.updated(e),qt(this,e),this.hass&&!this._userNamesLoaded&&this._config.show_assignee!==!1&&this._objects.some(t=>t.tasks.some(i=>i.responsible_user_id))&&this._loadUserNames(),this.hass&&this._config.show_documents!==!1)for(let t of this._objects)this._docsLoadedFor.has(t.entry_id)||t.tasks.some(i=>(i.document_count??0)>0)&&this._loadDocuments(t.entry_id);if(e.has("hass")&&this.hass){if(!this._dataLoaded)this._dataLoaded=!0,this._lastConnection=this.hass.connection,this._loadData(),this._subscribe();else if(this.hass.connection!==this._lastConnection){if(this._lastConnection=this.hass.connection,this._unsub){try{this._unsub()}catch{}this._unsub=null}this._subscribe(),this._loadData()}}}async _loadData(){G(this.hass).then(t=>{this._settings=t,this._globalRowStyle=t.rowActionStyle}).catch(()=>{});let e=this._loadViewFilters();try{let[t,i]=await Promise.all([this.hass.connection.sendMessagePromise({type:"maintenance_supporter/objects",compact:!0}),this.hass.connection.sendMessagePromise({type:"maintenance_supporter/statistics"})]);await e,this._objects=ut(t.objects),this._stats=i,Dt(this._stats.budget)}catch{}await e,this._firstLoadDone=!0}_assigneeName(e){if(this._config.show_assignee===!1)return"";let t=e.responsible_user_id;return t&&this._userNames[t]||""}async _loadUserNames(){this._userNamesLoaded=!0,this._userService?this._userService.updateHass(this.hass):this._userService=new Fe(this.hass);try{let e=await this._userService.getUsers();this._userPersons=Object.fromEntries(e.map(t=>[t.id,Wt(t)])),this._userNames=Object.fromEntries(e.map(t=>[t.id,t.name]))}catch{}}async _loadDocuments(e){this._docsLoadedFor.add(e);try{let t=await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/documents/list",entry_id:e}),i={};for(let a of t.documents||[])for(let o of a.task_ids||[])(i[o]||=[]).push({id:a.id,title:a.title,kind:a.kind,url:a.url});this._taskDocs={...this._taskDocs,[e]:i}}catch{}}_docsFor(e,t){if(this._config.show_documents===!1)return[];let a=[...this._taskDocs[e]?.[t.id]||[]];return t.documentation_url&&a.push({id:`url:${t.id}`,title:n("documentation_label",this._lang),kind:"weblink",url:t.documentation_url}),a}async _openDoc(e){if(e.kind==="weblink"&&e.url){Ut(e.url)&&window.open(e.url,"_blank","noopener");return}try{await pr(this.hass,e.id)}catch{}}async _loadViewFilters(){if(!this._config.view_id){this._viewFilters=null;return}try{let t=((await this.hass.connection.sendMessagePromise({type:"maintenance_supporter/views/list"})).views||[]).find(i=>i.id===this._config.view_id);this._viewFilters=t?t.filters:null}catch{this._viewFilters=null}}async _subscribe(){try{let e=await this.hass.connection.subscribeMessage(t=>{let i=qs(this._objects,t);i!==null&&(this._objects=i)},{type:"maintenance_supporter/subscribe",deltas:!0,compact:!0});if(!this.isConnected){e();return}this._unsub=e}catch{}}get _selectedTasks(){let e=[],{filter_status:t,filter_objects:i,entity_ids:a,filter_due_min_days:o,filter_due_max_days:d,filter_labels:h,filter_priority:_,filter_areas:m}=this._config,b=a?.length?new Set(a):null,k=o!==void 0||d!==void 0,w=this._viewFilters,v=w?.user_id==="current_user"?this.hass.user?.id??null:w?.user_id??null;for(let x of this._objects)if(!(i?.length&&!i.includes(x.object.name))){if(m?.length){let E=x.object.area_id;if(!E||!m.includes(E))continue}for(let E of x.tasks)if(!E.is_done&&!(E.archived||x.object.archived)&&!(t?.length&&!t.includes(E.status))&&!(h?.length&&!(E.labels||[]).some(P=>h.includes(P)))&&!(_?.length&&!_.includes(E.priority||"normal"))&&!(b&&!(E.sensor_entity_id&&b.has(E.sensor_entity_id)||E.binary_sensor_entity_id&&b.has(E.binary_sensor_entity_id)))){if(k){let P=E.days_until_due;if(P==null||o!==void 0&&P<o||d!==void 0&&P>d)continue}w&&(w.status&&E.status!==w.status||w.label&&!(E.labels||[]).includes(w.label)||w.priority&&(E.priority||"normal")!==w.priority||v&&E.responsible_user_id!==v)||e.push({entry_id:x.entry_id,object_name:x.object.name,task:E})}}return e.sort((x,E)=>{let P=Ht(x.task.status)-Ht(E.task.status);return P!==0?P:(x.task.days_until_due??1/0)-(E.task.days_until_due??1/0)}),e}_openComplete(e,t){let i=this.shadowRoot.querySelector("maintenance-complete-dialog");Yt(i,Kt({entryId:e,taskId:t.id,taskName:t.name,task:t,objects:this._objects,lang:this._lang,features:this._settings.features,currencySymbol:Te(this._stats?.budget),partsCostMode:this._settings.partsCostMode}),this._lang)}_headerCounts(e){let t={overdue:0,due_soon:0,triggered:0};for(let{task:i}of e)Ys(i.status)&&(t[i.status]+=1);return t}_openTaskDetail(e,t){ps(e,t)}render(){let e=this._lang,t=this._config.title||n("maintenance",e),i=this._config.show_header!==!1,a=(this._config.action_style??(this._globalRowStyle==="icons"?"icons":"buttons"))==="buttons",o=this._config.show_actions!==!1,d=o&&te(this.hass?.user,this._settings.access),h=this._config.compact||!1,_=this._selectedTasks,{max_items:m}=this._config,b=m&&m>0?_.slice(0,m):_,k=this._objects.length||this._stats?this._headerCounts(_):null;return l`
      <ha-card>
        <div class="card-header">
          <h1>${t}</h1>
          <div class="header-right">
            ${i&&k?l`
                  <div class="header-stats">
                    ${k.overdue>0?l`<span class="badge overdue">${k.overdue}</span>`:p}
                    ${k.due_soon>0?l`<span class="badge due_soon">${k.due_soon}</span>`:p}
                    ${k.triggered>0?l`<span class="badge triggered">${k.triggered}</span>`:p}
                  </div>
                `:p}
            ${d?l`
                  <ha-icon-button
                    class="hdr-add"
                    title="${n("new_object",e)}"
                    @click=${()=>cs()}
                  >
                    <ha-icon icon="mdi:plus-box"></ha-icon>
                  </ha-icon-button>
                  <ha-icon-button
                    class="hdr-add"
                    title="${n("add_task",e)}"
                    @click=${()=>ds("",this._objects)}
                  >
                    <ha-icon icon="mdi:playlist-plus"></ha-icon>
                  </ha-icon-button>
                `:p}
          </div>
        </div>
        ${this._firstLoadDone?b.length===0?this._objects.some(w=>w.tasks.length>0)?l`<div class="empty-card">
                <!-- (#86) tasks exist but none match the filter (default:
                     actionable-only) — "all caught up", NOT "no tasks yet". -->
                <div class="all-caught-up">✓ ${n("card_all_caught_up",e)}</div>
              </div>`:l`<div class="empty-card">
                <div>${n("card_no_tasks_title",e)}</div>
                <a class="empty-link" href="/maintenance-supporter">${n("card_no_tasks_cta",e)}</a>
              </div>`:l`
              <div class="task-list ${h?"compact":""}">
                ${b.map(({entry_id:w,object_name:v,task:x})=>l`
                    <div class="task-item clickable"
                         @click=${()=>this._openTaskDetail(w,x.id)}
                         title="${n("open_task",e)}">
                      <div class="status-dot" style="background: ${ht[x.status]||"#ccc"}"></div>
                      <div class="task-info">
                        <div class="task-name">
                          ${x.name}${mr(x.next_event_titles)}
                          ${x.due_override?l`<ha-icon
                                class="postponed-icon"
                                icon="mdi:calendar-clock"
                                title="${n("postponed",e)}"
                              ></ha-icon>`:p}
                        </div>
                        ${h?this._assigneeName(x)?l`<div class="task-meta compact-assignee" title="${this._assigneeName(x)}">
                                ${Di(this._userPersons[x.responsible_user_id])}${this._assigneeName(x)}
                              </div>`:p:l`<div class="task-meta">
                              ${v} · ${n(x.type,e)}${ge(x)?l` · ${ge(x)}`:p}${this._assigneeName(x)?l` · <span class="assignee"
                                    >${Di(this._userPersons[x.responsible_user_id])}${this._assigneeName(x)}</span
                                  >`:p}
                            </div>`}
                      </div>
                      ${this._docsFor(w,x).length?l`<div class="doc-chips">
                            ${this._docsFor(w,x).map(E=>l`
                              <button
                                type="button"
                                class="doc-chip"
                                title="${E.title}"
                                @click=${P=>{P.stopPropagation(),this._openDoc(E)}}
                              >
                                <ha-icon icon=${E.kind==="weblink"?"mdi:link-variant":"mdi:file-document-outline"}></ha-icon>
                                <span>${E.title}</span>
                              </button>
                            `)}
                          </div>`:p}
                      <div class="task-due">
                        ${x.days_until_due!==null&&x.days_until_due!==void 0?x.days_until_due<0?l`<span class="overdue-text">${Li(x.days_until_due,e)}</span>`:Li(x.days_until_due,e):x.trigger_active?"\u26A1":"\u2014"}
                      </div>
                      ${o&&a?l`
                            <ha-button
                              size="small"
                              appearance="accent"
                              variant="success"
                              class="complete-btn-text"
                              title="${n("complete",e)}"
                              @click=${E=>{E.stopPropagation(),this._openComplete(w,x)}}
                            >
                              <ha-icon slot="start" icon="mdi:check"></ha-icon>${n("complete",e)}
                            </ha-button>
                          `:o?l`
                            <ha-icon-button
                              class="complete-btn"
                              title="${n("complete",e)}"
                              @click=${E=>{E.stopPropagation(),this._openComplete(w,x)}}
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
    `}};F.styles=[Ft,$`
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
        display: inline-flex;
        --ha-icon-button-size: 32px;
        --mdc-icon-button-size: 32px;
        --mdc-icon-size: 18px;
        color: var(--primary-color);
      }
      /* DESIGN PROTOTYPE (#145): action_style: buttons — HA-native labelled button. */
      .complete-btn-text { --ha-button-font-size: 13px; flex: none; white-space: nowrap; }
      .complete-btn-text ha-icon { --mdc-icon-size: 18px; }
    `],c([f({attribute:!1})],F.prototype,"hass",2),c([u()],F.prototype,"_config",2),c([u()],F.prototype,"_globalRowStyle",2),c([u()],F.prototype,"_settings",2),c([u()],F.prototype,"_firstLoadDone",2),c([u()],F.prototype,"_objects",2),c([u()],F.prototype,"_stats",2),c([u()],F.prototype,"_unsub",2),c([u()],F.prototype,"_viewFilters",2),c([u()],F.prototype,"_userNames",2),c([u()],F.prototype,"_taskDocs",2);customElements.get("maintenance-supporter-card")||customElements.define("maintenance-supporter-card",F);ze({type:"maintenance-supporter-card",name:"Maintenance Supporter",description:"Overview of your maintenance tasks with quick actions.",preview:!0});Bt();hr(["maintenance-supporter-card","maintenance-battery-fleet-card","maintenance-supporter-panel-card"],import.meta.url);export{F as MaintenanceSupporterCard};
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
