/*! maintenance_supporter design-system entry 2.63.1 */
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e7) {
    throw err = [e7], e7;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i6 = decorators.length - 1, decorator; i6 >= 0; i6--)
    if (decorator = decorators[i6])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// node_modules/@lit/reactive-element/css-tag.js
var t, e, s, o, n, r, i, S, c;
var init_css_tag = __esm({
  "node_modules/@lit/reactive-element/css-tag.js"() {
    t = globalThis;
    e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
    s = /* @__PURE__ */ Symbol();
    o = /* @__PURE__ */ new WeakMap();
    n = class {
      constructor(t5, e7, o7) {
        if (this._$cssResult$ = true, o7 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t5, this.t = e7;
      }
      get styleSheet() {
        let t5 = this.o;
        const s4 = this.t;
        if (e && void 0 === t5) {
          const e7 = void 0 !== s4 && 1 === s4.length;
          e7 && (t5 = o.get(s4)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e7 && o.set(s4, t5));
        }
        return t5;
      }
      toString() {
        return this.cssText;
      }
    };
    r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
    i = (t5, ...e7) => {
      const o7 = 1 === t5.length ? t5[0] : e7.reduce((e8, s4, o8) => e8 + ((t6) => {
        if (true === t6._$cssResult$) return t6.cssText;
        if ("number" == typeof t6) return t6;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(s4) + t5[o8 + 1], t5[0]);
      return new n(o7, t5, s);
    };
    S = (s4, o7) => {
      if (e) s4.adoptedStyleSheets = o7.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
      else for (const e7 of o7) {
        const o8 = document.createElement("style"), n5 = t.litNonce;
        void 0 !== n5 && o8.setAttribute("nonce", n5), o8.textContent = e7.cssText, s4.appendChild(o8);
      }
    };
    c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
      let e7 = "";
      for (const s4 of t6.cssRules) e7 += s4.cssText;
      return r(e7);
    })(t5) : t5;
  }
});

// node_modules/@lit/reactive-element/reactive-element.js
var i2, e2, h, r2, o2, n2, a, c2, l, p, d, u, f, b, y;
var init_reactive_element = __esm({
  "node_modules/@lit/reactive-element/reactive-element.js"() {
    init_css_tag();
    init_css_tag();
    ({ is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object);
    a = globalThis;
    c2 = a.trustedTypes;
    l = c2 ? c2.emptyScript : "";
    p = a.reactiveElementPolyfillSupport;
    d = (t5, s4) => t5;
    u = { toAttribute(t5, s4) {
      switch (s4) {
        case Boolean:
          t5 = t5 ? l : null;
          break;
        case Object:
        case Array:
          t5 = null == t5 ? t5 : JSON.stringify(t5);
      }
      return t5;
    }, fromAttribute(t5, s4) {
      let i6 = t5;
      switch (s4) {
        case Boolean:
          i6 = null !== t5;
          break;
        case Number:
          i6 = null === t5 ? null : Number(t5);
          break;
        case Object:
        case Array:
          try {
            i6 = JSON.parse(t5);
          } catch (t6) {
            i6 = null;
          }
      }
      return i6;
    } };
    f = (t5, s4) => !i2(t5, s4);
    b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
    Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
    y = class extends HTMLElement {
      static addInitializer(t5) {
        this._$Ei(), (this.l ??= []).push(t5);
      }
      static get observedAttributes() {
        return this.finalize(), this._$Eh && [...this._$Eh.keys()];
      }
      static createProperty(t5, s4 = b) {
        if (s4.state && (s4.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t5) && ((s4 = Object.create(s4)).wrapped = true), this.elementProperties.set(t5, s4), !s4.noAccessor) {
          const i6 = /* @__PURE__ */ Symbol(), h3 = this.getPropertyDescriptor(t5, i6, s4);
          void 0 !== h3 && e2(this.prototype, t5, h3);
        }
      }
      static getPropertyDescriptor(t5, s4, i6) {
        const { get: e7, set: r6 } = h(this.prototype, t5) ?? { get() {
          return this[s4];
        }, set(t6) {
          this[s4] = t6;
        } };
        return { get: e7, set(s5) {
          const h3 = e7?.call(this);
          r6?.call(this, s5), this.requestUpdate(t5, h3, i6);
        }, configurable: true, enumerable: true };
      }
      static getPropertyOptions(t5) {
        return this.elementProperties.get(t5) ?? b;
      }
      static _$Ei() {
        if (this.hasOwnProperty(d("elementProperties"))) return;
        const t5 = n2(this);
        t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
      }
      static finalize() {
        if (this.hasOwnProperty(d("finalized"))) return;
        if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
          const t6 = this.properties, s4 = [...r2(t6), ...o2(t6)];
          for (const i6 of s4) this.createProperty(i6, t6[i6]);
        }
        const t5 = this[Symbol.metadata];
        if (null !== t5) {
          const s4 = litPropertyMetadata.get(t5);
          if (void 0 !== s4) for (const [t6, i6] of s4) this.elementProperties.set(t6, i6);
        }
        this._$Eh = /* @__PURE__ */ new Map();
        for (const [t6, s4] of this.elementProperties) {
          const i6 = this._$Eu(t6, s4);
          void 0 !== i6 && this._$Eh.set(i6, t6);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
      }
      static finalizeStyles(s4) {
        const i6 = [];
        if (Array.isArray(s4)) {
          const e7 = new Set(s4.flat(1 / 0).reverse());
          for (const s5 of e7) i6.unshift(c(s5));
        } else void 0 !== s4 && i6.push(c(s4));
        return i6;
      }
      static _$Eu(t5, s4) {
        const i6 = s4.attribute;
        return false === i6 ? void 0 : "string" == typeof i6 ? i6 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
      }
      constructor() {
        super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
      }
      _$Ev() {
        this._$ES = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
      }
      addController(t5) {
        (this._$EO ??= /* @__PURE__ */ new Set()).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
      }
      removeController(t5) {
        this._$EO?.delete(t5);
      }
      _$E_() {
        const t5 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
        for (const i6 of s4.keys()) this.hasOwnProperty(i6) && (t5.set(i6, this[i6]), delete this[i6]);
        t5.size > 0 && (this._$Ep = t5);
      }
      createRenderRoot() {
        const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return S(t5, this.constructor.elementStyles), t5;
      }
      connectedCallback() {
        this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t5) => t5.hostConnected?.());
      }
      enableUpdating(t5) {
      }
      disconnectedCallback() {
        this._$EO?.forEach((t5) => t5.hostDisconnected?.());
      }
      attributeChangedCallback(t5, s4, i6) {
        this._$AK(t5, i6);
      }
      _$ET(t5, s4) {
        const i6 = this.constructor.elementProperties.get(t5), e7 = this.constructor._$Eu(t5, i6);
        if (void 0 !== e7 && true === i6.reflect) {
          const h3 = (void 0 !== i6.converter?.toAttribute ? i6.converter : u).toAttribute(s4, i6.type);
          this._$Em = t5, null == h3 ? this.removeAttribute(e7) : this.setAttribute(e7, h3), this._$Em = null;
        }
      }
      _$AK(t5, s4) {
        const i6 = this.constructor, e7 = i6._$Eh.get(t5);
        if (void 0 !== e7 && this._$Em !== e7) {
          const t6 = i6.getPropertyOptions(e7), h3 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
          this._$Em = e7;
          const r6 = h3.fromAttribute(s4, t6.type);
          this[e7] = r6 ?? this._$Ej?.get(e7) ?? r6, this._$Em = null;
        }
      }
      requestUpdate(t5, s4, i6, e7 = false, h3) {
        if (void 0 !== t5) {
          const r6 = this.constructor;
          if (false === e7 && (h3 = this[t5]), i6 ??= r6.getPropertyOptions(t5), !((i6.hasChanged ?? f)(h3, s4) || i6.useDefault && i6.reflect && h3 === this._$Ej?.get(t5) && !this.hasAttribute(r6._$Eu(t5, i6)))) return;
          this.C(t5, s4, i6);
        }
        false === this.isUpdatePending && (this._$ES = this._$EP());
      }
      C(t5, s4, { useDefault: i6, reflect: e7, wrapped: h3 }, r6) {
        i6 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t5) && (this._$Ej.set(t5, r6 ?? s4 ?? this[t5]), true !== h3 || void 0 !== r6) || (this._$AL.has(t5) || (this.hasUpdated || i6 || (s4 = void 0), this._$AL.set(t5, s4)), true === e7 && this._$Em !== t5 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t5));
      }
      async _$EP() {
        this.isUpdatePending = true;
        try {
          await this._$ES;
        } catch (t6) {
          Promise.reject(t6);
        }
        const t5 = this.scheduleUpdate();
        return null != t5 && await t5, !this.isUpdatePending;
      }
      scheduleUpdate() {
        return this.performUpdate();
      }
      performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
          if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
            for (const [t7, s5] of this._$Ep) this[t7] = s5;
            this._$Ep = void 0;
          }
          const t6 = this.constructor.elementProperties;
          if (t6.size > 0) for (const [s5, i6] of t6) {
            const { wrapped: t7 } = i6, e7 = this[s5];
            true !== t7 || this._$AL.has(s5) || void 0 === e7 || this.C(s5, void 0, i6, e7);
          }
        }
        let t5 = false;
        const s4 = this._$AL;
        try {
          t5 = this.shouldUpdate(s4), t5 ? (this.willUpdate(s4), this._$EO?.forEach((t6) => t6.hostUpdate?.()), this.update(s4)) : this._$EM();
        } catch (s5) {
          throw t5 = false, this._$EM(), s5;
        }
        t5 && this._$AE(s4);
      }
      willUpdate(t5) {
      }
      _$AE(t5) {
        this._$EO?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
      }
      _$EM() {
        this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
      }
      get updateComplete() {
        return this.getUpdateComplete();
      }
      getUpdateComplete() {
        return this._$ES;
      }
      shouldUpdate(t5) {
        return true;
      }
      update(t5) {
        this._$Eq &&= this._$Eq.forEach((t6) => this._$ET(t6, this[t6])), this._$EM();
      }
      updated(t5) {
      }
      firstUpdated(t5) {
      }
    };
    y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");
  }
});

// node_modules/lit-html/lit-html.js
function V(t5, i6) {
  if (!u2(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e3 ? e3.createHTML(i6) : i6;
}
function M(t5, i6, s4 = t5, e7) {
  if (i6 === E) return i6;
  let h3 = void 0 !== e7 ? s4._$Co?.[e7] : s4._$Cl;
  const o7 = a2(i6) ? void 0 : i6._$litDirective$;
  return h3?.constructor !== o7 && (h3?._$AO?.(false), void 0 === o7 ? h3 = void 0 : (h3 = new o7(t5), h3._$AT(t5, s4, e7)), void 0 !== e7 ? (s4._$Co ??= [])[e7] = h3 : s4._$Cl = h3), void 0 !== h3 && (i6 = M(t5, h3._$AS(t5, i6.values), h3, e7)), i6;
}
var t2, i3, s2, e3, h2, o3, n3, r3, l2, c3, a2, u2, d2, f2, v, _, m, p2, g, $, y2, x, b2, w, T, E, A, C, P, N, S2, R, k, H, I, L, z, Z, B, D;
var init_lit_html = __esm({
  "node_modules/lit-html/lit-html.js"() {
    t2 = globalThis;
    i3 = (t5) => t5;
    s2 = t2.trustedTypes;
    e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
    h2 = "$lit$";
    o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
    n3 = "?" + o3;
    r3 = `<${n3}>`;
    l2 = document;
    c3 = () => l2.createComment("");
    a2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
    u2 = Array.isArray;
    d2 = (t5) => u2(t5) || "function" == typeof t5?.[Symbol.iterator];
    f2 = "[ 	\n\f\r]";
    v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
    _ = /-->/g;
    m = />/g;
    p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
    g = /'/g;
    $ = /"/g;
    y2 = /^(?:script|style|textarea|title)$/i;
    x = (t5) => (i6, ...s4) => ({ _$litType$: t5, strings: i6, values: s4 });
    b2 = x(1);
    w = x(2);
    T = x(3);
    E = /* @__PURE__ */ Symbol.for("lit-noChange");
    A = /* @__PURE__ */ Symbol.for("lit-nothing");
    C = /* @__PURE__ */ new WeakMap();
    P = l2.createTreeWalker(l2, 129);
    N = (t5, i6) => {
      const s4 = t5.length - 1, e7 = [];
      let n5, l3 = 2 === i6 ? "<svg>" : 3 === i6 ? "<math>" : "", c4 = v;
      for (let i7 = 0; i7 < s4; i7++) {
        const s5 = t5[i7];
        let a3, u3, d3 = -1, f3 = 0;
        for (; f3 < s5.length && (c4.lastIndex = f3, u3 = c4.exec(s5), null !== u3); ) f3 = c4.lastIndex, c4 === v ? "!--" === u3[1] ? c4 = _ : void 0 !== u3[1] ? c4 = m : void 0 !== u3[2] ? (y2.test(u3[2]) && (n5 = RegExp("</" + u3[2], "g")), c4 = p2) : void 0 !== u3[3] && (c4 = p2) : c4 === p2 ? ">" === u3[0] ? (c4 = n5 ?? v, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? p2 : '"' === u3[3] ? $ : g) : c4 === $ || c4 === g ? c4 = p2 : c4 === _ || c4 === m ? c4 = v : (c4 = p2, n5 = void 0);
        const x2 = c4 === p2 && t5[i7 + 1].startsWith("/>") ? " " : "";
        l3 += c4 === v ? s5 + r3 : d3 >= 0 ? (e7.push(a3), s5.slice(0, d3) + h2 + s5.slice(d3) + o3 + x2) : s5 + o3 + (-2 === d3 ? i7 : x2);
      }
      return [V(t5, l3 + (t5[s4] || "<?>") + (2 === i6 ? "</svg>" : 3 === i6 ? "</math>" : "")), e7];
    };
    S2 = class _S {
      constructor({ strings: t5, _$litType$: i6 }, e7) {
        let r6;
        this.parts = [];
        let l3 = 0, a3 = 0;
        const u3 = t5.length - 1, d3 = this.parts, [f3, v2] = N(t5, i6);
        if (this.el = _S.createElement(f3, e7), P.currentNode = this.el.content, 2 === i6 || 3 === i6) {
          const t6 = this.el.content.firstChild;
          t6.replaceWith(...t6.childNodes);
        }
        for (; null !== (r6 = P.nextNode()) && d3.length < u3; ) {
          if (1 === r6.nodeType) {
            if (r6.hasAttributes()) for (const t6 of r6.getAttributeNames()) if (t6.endsWith(h2)) {
              const i7 = v2[a3++], s4 = r6.getAttribute(t6).split(o3), e8 = /([.?@])?(.*)/.exec(i7);
              d3.push({ type: 1, index: l3, name: e8[2], strings: s4, ctor: "." === e8[1] ? I : "?" === e8[1] ? L : "@" === e8[1] ? z : H }), r6.removeAttribute(t6);
            } else t6.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r6.removeAttribute(t6));
            if (y2.test(r6.tagName)) {
              const t6 = r6.textContent.split(o3), i7 = t6.length - 1;
              if (i7 > 0) {
                r6.textContent = s2 ? s2.emptyScript : "";
                for (let s4 = 0; s4 < i7; s4++) r6.append(t6[s4], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
                r6.append(t6[i7], c3());
              }
            }
          } else if (8 === r6.nodeType) if (r6.data === n3) d3.push({ type: 2, index: l3 });
          else {
            let t6 = -1;
            for (; -1 !== (t6 = r6.data.indexOf(o3, t6 + 1)); ) d3.push({ type: 7, index: l3 }), t6 += o3.length - 1;
          }
          l3++;
        }
      }
      static createElement(t5, i6) {
        const s4 = l2.createElement("template");
        return s4.innerHTML = t5, s4;
      }
    };
    R = class {
      constructor(t5, i6) {
        this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i6;
      }
      get parentNode() {
        return this._$AM.parentNode;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      u(t5) {
        const { el: { content: i6 }, parts: s4 } = this._$AD, e7 = (t5?.creationScope ?? l2).importNode(i6, true);
        P.currentNode = e7;
        let h3 = P.nextNode(), o7 = 0, n5 = 0, r6 = s4[0];
        for (; void 0 !== r6; ) {
          if (o7 === r6.index) {
            let i7;
            2 === r6.type ? i7 = new k(h3, h3.nextSibling, this, t5) : 1 === r6.type ? i7 = new r6.ctor(h3, r6.name, r6.strings, this, t5) : 6 === r6.type && (i7 = new Z(h3, this, t5)), this._$AV.push(i7), r6 = s4[++n5];
          }
          o7 !== r6?.index && (h3 = P.nextNode(), o7++);
        }
        return P.currentNode = l2, e7;
      }
      p(t5) {
        let i6 = 0;
        for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t5, s4, i6), i6 += s4.strings.length - 2) : s4._$AI(t5[i6])), i6++;
      }
    };
    k = class _k {
      get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
      }
      constructor(t5, i6, s4, e7) {
        this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i6, this._$AM = s4, this.options = e7, this._$Cv = e7?.isConnected ?? true;
      }
      get parentNode() {
        let t5 = this._$AA.parentNode;
        const i6 = this._$AM;
        return void 0 !== i6 && 11 === t5?.nodeType && (t5 = i6.parentNode), t5;
      }
      get startNode() {
        return this._$AA;
      }
      get endNode() {
        return this._$AB;
      }
      _$AI(t5, i6 = this) {
        t5 = M(this, t5, i6), a2(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== E && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : d2(t5) ? this.k(t5) : this._(t5);
      }
      O(t5) {
        return this._$AA.parentNode.insertBefore(t5, this._$AB);
      }
      T(t5) {
        this._$AH !== t5 && (this._$AR(), this._$AH = this.O(t5));
      }
      _(t5) {
        this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(l2.createTextNode(t5)), this._$AH = t5;
      }
      $(t5) {
        const { values: i6, _$litType$: s4 } = t5, e7 = "number" == typeof s4 ? this._$AC(t5) : (void 0 === s4.el && (s4.el = S2.createElement(V(s4.h, s4.h[0]), this.options)), s4);
        if (this._$AH?._$AD === e7) this._$AH.p(i6);
        else {
          const t6 = new R(e7, this), s5 = t6.u(this.options);
          t6.p(i6), this.T(s5), this._$AH = t6;
        }
      }
      _$AC(t5) {
        let i6 = C.get(t5.strings);
        return void 0 === i6 && C.set(t5.strings, i6 = new S2(t5)), i6;
      }
      k(t5) {
        u2(this._$AH) || (this._$AH = [], this._$AR());
        const i6 = this._$AH;
        let s4, e7 = 0;
        for (const h3 of t5) e7 === i6.length ? i6.push(s4 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s4 = i6[e7], s4._$AI(h3), e7++;
        e7 < i6.length && (this._$AR(s4 && s4._$AB.nextSibling, e7), i6.length = e7);
      }
      _$AR(t5 = this._$AA.nextSibling, s4) {
        for (this._$AP?.(false, true, s4); t5 !== this._$AB; ) {
          const s5 = i3(t5).nextSibling;
          i3(t5).remove(), t5 = s5;
        }
      }
      setConnected(t5) {
        void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
      }
    };
    H = class {
      get tagName() {
        return this.element.tagName;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      constructor(t5, i6, s4, e7, h3) {
        this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i6, this._$AM = e7, this.options = h3, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = A;
      }
      _$AI(t5, i6 = this, s4, e7) {
        const h3 = this.strings;
        let o7 = false;
        if (void 0 === h3) t5 = M(this, t5, i6, 0), o7 = !a2(t5) || t5 !== this._$AH && t5 !== E, o7 && (this._$AH = t5);
        else {
          const e8 = t5;
          let n5, r6;
          for (t5 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r6 = M(this, e8[s4 + n5], i6, n5), r6 === E && (r6 = this._$AH[n5]), o7 ||= !a2(r6) || r6 !== this._$AH[n5], r6 === A ? t5 = A : t5 !== A && (t5 += (r6 ?? "") + h3[n5 + 1]), this._$AH[n5] = r6;
        }
        o7 && !e7 && this.j(t5);
      }
      j(t5) {
        t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
      }
    };
    I = class extends H {
      constructor() {
        super(...arguments), this.type = 3;
      }
      j(t5) {
        this.element[this.name] = t5 === A ? void 0 : t5;
      }
    };
    L = class extends H {
      constructor() {
        super(...arguments), this.type = 4;
      }
      j(t5) {
        this.element.toggleAttribute(this.name, !!t5 && t5 !== A);
      }
    };
    z = class extends H {
      constructor(t5, i6, s4, e7, h3) {
        super(t5, i6, s4, e7, h3), this.type = 5;
      }
      _$AI(t5, i6 = this) {
        if ((t5 = M(this, t5, i6, 0) ?? A) === E) return;
        const s4 = this._$AH, e7 = t5 === A && s4 !== A || t5.capture !== s4.capture || t5.once !== s4.once || t5.passive !== s4.passive, h3 = t5 !== A && (s4 === A || e7);
        e7 && this.element.removeEventListener(this.name, this, s4), h3 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
      }
      handleEvent(t5) {
        "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
      }
    };
    Z = class {
      constructor(t5, i6, s4) {
        this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i6, this.options = s4;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AI(t5) {
        M(this, t5);
      }
    };
    B = t2.litHtmlPolyfillSupport;
    B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.2");
    D = (t5, i6, s4) => {
      const e7 = s4?.renderBefore ?? i6;
      let h3 = e7._$litPart$;
      if (void 0 === h3) {
        const t6 = s4?.renderBefore ?? null;
        e7._$litPart$ = h3 = new k(i6.insertBefore(c3(), t6), t6, void 0, s4 ?? {});
      }
      return h3._$AI(t5), h3;
    };
  }
});

// node_modules/lit-element/lit-element.js
var s3, i4, o4;
var init_lit_element = __esm({
  "node_modules/lit-element/lit-element.js"() {
    init_reactive_element();
    init_reactive_element();
    init_lit_html();
    init_lit_html();
    s3 = globalThis;
    i4 = class extends y {
      constructor() {
        super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
      }
      createRenderRoot() {
        const t5 = super.createRenderRoot();
        return this.renderOptions.renderBefore ??= t5.firstChild, t5;
      }
      update(t5) {
        const r6 = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = D(r6, this.renderRoot, this.renderOptions);
      }
      connectedCallback() {
        super.connectedCallback(), this._$Do?.setConnected(true);
      }
      disconnectedCallback() {
        super.disconnectedCallback(), this._$Do?.setConnected(false);
      }
      render() {
        return E;
      }
    };
    i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
    o4 = s3.litElementPolyfillSupport;
    o4?.({ LitElement: i4 });
    (s3.litElementVersions ??= []).push("4.2.2");
  }
});

// node_modules/lit-html/is-server.js
var init_is_server = __esm({
  "node_modules/lit-html/is-server.js"() {
  }
});

// node_modules/lit/index.js
var init_lit = __esm({
  "node_modules/lit/index.js"() {
    init_reactive_element();
    init_lit_html();
    init_lit_element();
    init_is_server();
  }
});

// node_modules/@lit/reactive-element/decorators/custom-element.js
var init_custom_element = __esm({
  "node_modules/@lit/reactive-element/decorators/custom-element.js"() {
  }
});

// node_modules/@lit/reactive-element/decorators/property.js
function n4(t5) {
  return (e7, o7) => "object" == typeof o7 ? r4(t5, e7, o7) : ((t6, e8, o8) => {
    const r6 = e8.hasOwnProperty(o8);
    return e8.constructor.createProperty(o8, t6), r6 ? Object.getOwnPropertyDescriptor(e8, o8) : void 0;
  })(t5, e7, o7);
}
var o5, r4;
var init_property = __esm({
  "node_modules/@lit/reactive-element/decorators/property.js"() {
    init_reactive_element();
    o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
    r4 = (t5 = o5, e7, r6) => {
      const { kind: n5, metadata: i6 } = r6;
      let s4 = globalThis.litPropertyMetadata.get(i6);
      if (void 0 === s4 && globalThis.litPropertyMetadata.set(i6, s4 = /* @__PURE__ */ new Map()), "setter" === n5 && ((t5 = Object.create(t5)).wrapped = true), s4.set(r6.name, t5), "accessor" === n5) {
        const { name: o7 } = r6;
        return { set(r7) {
          const n6 = e7.get.call(this);
          e7.set.call(this, r7), this.requestUpdate(o7, n6, t5, true, r7);
        }, init(e8) {
          return void 0 !== e8 && this.C(o7, void 0, t5, e8), e8;
        } };
      }
      if ("setter" === n5) {
        const { name: o7 } = r6;
        return function(r7) {
          const n6 = this[o7];
          e7.call(this, r7), this.requestUpdate(o7, n6, t5, true, r7);
        };
      }
      throw Error("Unsupported decorator location: " + n5);
    };
  }
});

// node_modules/@lit/reactive-element/decorators/state.js
function r5(r6) {
  return n4({ ...r6, state: true, attribute: false });
}
var init_state = __esm({
  "node_modules/@lit/reactive-element/decorators/state.js"() {
    init_property();
  }
});

// node_modules/@lit/reactive-element/decorators/event-options.js
var init_event_options = __esm({
  "node_modules/@lit/reactive-element/decorators/event-options.js"() {
  }
});

// node_modules/@lit/reactive-element/decorators/base.js
var init_base = __esm({
  "node_modules/@lit/reactive-element/decorators/base.js"() {
  }
});

// node_modules/@lit/reactive-element/decorators/query.js
var init_query = __esm({
  "node_modules/@lit/reactive-element/decorators/query.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-all.js
var init_query_all = __esm({
  "node_modules/@lit/reactive-element/decorators/query-all.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-async.js
var init_query_async = __esm({
  "node_modules/@lit/reactive-element/decorators/query-async.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
var init_query_assigned_elements = __esm({
  "node_modules/@lit/reactive-element/decorators/query-assigned-elements.js"() {
    init_base();
  }
});

// node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
var init_query_assigned_nodes = __esm({
  "node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js"() {
    init_base();
  }
});

// node_modules/lit/decorators.js
var init_decorators = __esm({
  "node_modules/lit/decorators.js"() {
    init_custom_element();
    init_property();
    init_state();
    init_event_options();
    init_query();
    init_query_all();
    init_query_async();
    init_query_assigned_elements();
    init_query_assigned_nodes();
  }
});

// locales/en.json
var en_default;
var init_en = __esm({
  "locales/en.json"() {
    en_default = {
      maintenance: "Maintenance",
      objects: "Objects",
      tasks: "Tasks",
      overdue: "Overdue",
      due_soon: "Due Soon",
      triggered: "Triggered",
      trigger_replaced: "Trigger replaced",
      trigger_removed: "Trigger removed",
      ok: "OK",
      all: "All",
      new_object: "+ New Object",
      templates_from: "From template",
      templates_title: "Start from a template",
      templates_task_count: "{n} tasks",
      template_created: "Created from template",
      onboard_hint: "Add your first object to start tracking maintenance.",
      edit: "Edit",
      duplicate: "Duplicate",
      task_duplicated: "Task duplicated",
      object_duplicated: "Object duplicated",
      delete: "Delete",
      add_task: "+ Add Task",
      complete: "Complete",
      completed: "Completed",
      skip: "Skip",
      skipped: "Skipped",
      missed: "Missed",
      reset: "Reset",
      snooze: "Snooze",
      snoozed: "Snoozed",
      cancel: "Cancel",
      bulk_select: "Select",
      bulk_select_all: "Select all",
      bulk_n_selected: "{n} selected",
      bulk_completed: "{n} tasks completed",
      bulk_archived: "{n} tasks archived",
      completing: "Completing\u2026",
      interval: "Interval",
      warning: "Warning",
      last_performed: "Last performed",
      next_due: "Next due",
      days_until_due: "Days until due",
      avg_duration: "Avg duration",
      trigger: "Trigger",
      trigger_type: "Trigger type",
      threshold_above: "Upper limit",
      threshold_below: "Lower limit",
      threshold: "Threshold",
      counter: "Counter",
      state_change: "State change",
      runtime: "Runtime",
      runtime_hours: "Target runtime (hours)",
      target_value: "Target value",
      baseline: "Baseline",
      target_changes: "Target changes",
      for_minutes: "For (minutes)",
      time_based: "Time-based",
      sensor_based: "Sensor-based",
      manual: "Manual",
      one_time: "One-time",
      weekdays: "Weekdays",
      nth_weekday: "Nth weekday of month",
      day_of_month: "Day of month",
      recurrence_on_days: "Repeat on",
      recurrence_occurrence: "Occurrence",
      recurrence_weekday: "Weekday",
      recurrence_day: "Day of month (1\u201331)",
      recurrence_last_day: "Last day of the month",
      recurrence_business_day: "Business days only (roll back from weekend)",
      recurrence_offset: "Offset (days, \xB1)",
      recurrence_offset_help: "Shift the date by \xB1N days, e.g. -2 = two days before.",
      last_day_month: "Last day of month",
      last_business_day_month: "Last business day",
      ord_1: "1st",
      ord_2: "2nd",
      ord_3: "3rd",
      ord_4: "4th",
      ord_5: "5th",
      ord_last: "Last",
      day_word: "Day",
      interval_value: "Interval",
      interval_unit: "Unit",
      unit_days: "Days",
      unit_weeks: "Weeks",
      unit_months: "Months",
      unit_years: "Years",
      due_date: "Due date",
      cleaning: "Cleaning",
      inspection: "Inspection",
      replacement: "Replacement",
      calibration: "Calibration",
      service: "Service",
      reading: "Reading",
      custom: "Custom",
      history: "History",
      cost: "Cost",
      report_button: "Report",
      report_title: "Maintenance report",
      report_generated: "Generated",
      report_times_done: "Done",
      report_total_cost: "Total cost",
      report_every: "every {n} {unit}",
      report_notes: "Notes",
      report_col_type: "Type",
      report_col_status: "Status",
      report_col_schedule: "Schedule",
      duration: "Duration",
      both: "Both",
      trigger_val: "Trigger value",
      complete_title: "Complete: ",
      checklist: "Checklist",
      require_on_completion: "Require on completion",
      checklist_steps_optional: "Checklist steps (optional)",
      checklist_placeholder: "Clean filter\nReplace seal\nTest pressure",
      checklist_help: "One step per line. Max 100 items.",
      err_too_long: "{field}: too long (max {n} characters)",
      err_too_short: "{field}: too short (min {n} characters)",
      err_value_too_high: "{field}: too large (max {n})",
      err_value_too_low: "{field}: too small (min {n})",
      err_required: "{field}: required",
      err_wrong_type: "{field}: wrong type (expected: {type})",
      err_invalid_choice: "{field}: not an allowed value",
      err_invalid_value: "{field}: invalid value",
      feat_schedule_time: "Time-of-day scheduling",
      feat_schedule_time_desc: "Tasks become overdue at a specific time of day instead of midnight.",
      schedule_time_optional: "Due at time (optional, HH:MM)",
      schedule_time_help: "Empty = midnight (default). HA timezone.",
      at_time: "at",
      notes_optional: "Notes (optional)",
      cost_optional: "Cost (optional)",
      duration_minutes: "Duration in minutes (optional)",
      completed_at_optional: "Completed at (optional, empty = now)",
      completed_at_future_error: "The completion date cannot be in the future.",
      days: "days",
      day: "day",
      today: "Today",
      d_overdue: "d overdue",
      no_tasks: "No maintenance tasks yet. Create an object to get started.",
      no_tasks_short: "No tasks",
      no_history: "No history entries yet.",
      show_all: "Show all",
      cost_duration_chart: "Cost & Duration",
      installed: "Installed",
      confirm_delete_object: "Delete this object and all its tasks?",
      confirm_delete_task: "Delete this task?",
      min: "Min",
      max: "Max",
      save: "Save",
      saving: "Saving\u2026",
      edit_task: "Edit Task",
      new_task: "New Maintenance Task",
      task_name: "Task name",
      maintenance_type: "Maintenance type",
      priority: "Priority",
      labels: "Labels",
      labels_placeholder: "e.g. safety, seasonal, tenant-visible",
      labels_help: "Comma-separated tags for filtering and reporting.",
      priority_low: "Low",
      priority_normal: "Normal",
      priority_high: "High",
      all_priorities: "All priorities",
      schedule_type: "Schedule type",
      interval_days: "Interval (days)",
      warning_days: "Warning days",
      earliest_completion_days: "Earliest completion (days before due)",
      earliest_completion_days_help: "Leave empty to allow completing any time. 0 = only on/after the due date.",
      last_performed_optional: "Last performed (optional)",
      interval_anchor: "Interval anchor",
      anchor_completion: "From completion date",
      anchor_planned: "From planned date (no drift)",
      edit_object: "Edit Object",
      name: "Name",
      manufacturer_optional: "Manufacturer (optional)",
      model_optional: "Model (optional)",
      serial_number_optional: "Serial number (optional)",
      serial_number_label: "S/N",
      documentation_url_label: "Manual",
      object_notes_label: "Notes",
      sort_due_date: "Due date",
      sort_object: "Object name",
      sort_type: "Type",
      sort_task_name: "Task name",
      all_objects: "All objects",
      all_parts: "All parts",
      tasks_lower: "tasks",
      no_tasks_yet: "No tasks yet",
      add_first_task: "Add first task",
      trigger_configuration: "Trigger Configuration",
      entity_id: "Entity ID",
      comma_separated: "comma-separated",
      entity_logic: "Entity logic",
      entity_logic_any: "Any entity triggers",
      entity_logic_all: "All entities must trigger",
      entities: "entities",
      attribute_optional: "Attribute (optional, blank = state)",
      use_entity_state: "Use entity state (no attribute)",
      trigger_above: "Trigger above",
      trigger_below: "Trigger below",
      trigger_equals: "Trigger when equal to (=)",
      trigger_not_equals: "Trigger when different from (\u2260)",
      for_at_least_minutes: "For at least (minutes)",
      safety_interval_days: "Safety interval (days, optional)",
      safety_interval: "Safety interval (optional)",
      trigger_combinator: "Combine trigger and interval",
      trigger_combinator_any: "Trigger or interval (whichever first)",
      trigger_combinator_all: "Trigger and interval (both required)",
      delta_mode: "Delta mode",
      from_state_optional: "From state (optional)",
      to_state_optional: "To state (optional)",
      documentation_url_optional: "Documentation URL (optional)",
      object_notes_optional: "Notes (optional)",
      nfc_tag_id_optional: "NFC Tag ID (optional)",
      nfc_tags_empty_help: "No NFC tags registered in Home Assistant yet.",
      nfc_tags_open_settings: "Open Tags settings",
      nfc_tags_refresh: "Refresh",
      environmental_entity_optional: "Environmental sensor (optional)",
      environmental_entity_helper: "e.g. sensor.outdoor_temperature \u2014 adjusts the interval based on environmental conditions",
      adaptive_prediction_enabled: "Enable sensor-driven predictions",
      adaptive_seasonal_enabled: "Enable seasonal awareness",
      adaptive_max_interval: "Maximum interval (days)",
      adaptive_min_interval: "Minimum interval (days)",
      adaptive_ewa_alpha: "Learning rate (alpha)",
      adaptive_enabled: "Enable adaptive scheduling",
      adaptive_section_title: "Adaptive Scheduling",
      environmental_attribute_optional: "Environmental attribute (optional)",
      nfc_tag_id: "NFC Tag ID",
      nfc_linked: "NFC tag linked",
      nfc_link_hint: "Click to link NFC tag",
      responsible_user: "Responsible User",
      shared_with: "Shared with (rotation)",
      shared_with_help: "Pick multiple people to share this task; the responsible person rotates on each completion.",
      rotation_strategy: "Rotation",
      rotation_none: "No rotation",
      rotation_round_robin: "Round-robin",
      rotation_least_completed: "Least completed",
      rotation_random: "Random",
      no_user_assigned: "(No user assigned)",
      all_users: "All Users",
      my_tasks: "My Tasks",
      tab_calendar: "Calendar",
      cal_no_events: "No maintenance",
      cal_window_7: "7 days",
      cal_window_14: "14 days",
      cal_window_30: "30 days",
      cal_window_365: "1 year",
      cal_every_n_days: "every {n} days",
      cal_source_time: "Time-based",
      cal_source_time_adaptive: "Time-based (adaptive)",
      cal_source_sensor: "Sensor-based",
      cal_predicted: "predicted",
      cal_confidence_high: "high confidence",
      cal_confidence_medium: "medium confidence",
      cal_confidence_low: "low confidence",
      budget_monthly: "Monthly budget",
      budget_yearly: "Yearly budget",
      groups: "Groups",
      new_group: "New group",
      edit_group: "Edit group",
      no_groups: "No groups yet",
      delete_group: "Delete group",
      delete_group_confirm: "Delete group '{name}'?",
      group_select_tasks: "Select tasks",
      group_name_required: "Name is required",
      description_optional: "Description (optional)",
      selected: "Selected",
      loading_chart: "Loading chart data...",
      hide_outliers: "Hide outliers (sensor glitches)",
      was_maintenance_needed: "Was this maintenance needed?",
      feedback_needed: "Needed",
      feedback_not_needed: "Not needed",
      feedback_not_sure: "Not sure",
      suggested_interval: "Suggested interval",
      apply_suggestion: "Apply",
      reanalyze: "Re-analyze",
      reanalyze_result: "New analysis",
      reanalyze_insufficient_data: "Not enough data to produce a recommendation",
      data_points: "data points",
      dismiss_suggestion: "Dismiss",
      confidence_low: "Low",
      confidence_medium: "Medium",
      confidence_high: "High",
      recommended: "recommended",
      seasonal_awareness: "Seasonal Awareness",
      edit_seasonal_overrides: "Edit seasonal factors",
      seasonal_overrides_title: "Seasonal factors (override)",
      seasonal_overrides_hint: "Factor per month (0.1\u20135.0). Empty = learned automatically.",
      seasonal_override_invalid: "Invalid value",
      seasonal_override_range: "Factor must be between 0.1 and 5.0",
      clear_all: "Clear all",
      seasonal_chart_title: "Seasonal Factors",
      seasonal_learned: "Learned",
      seasonal_manual: "Manual",
      month_jan: "Jan",
      month_feb: "Feb",
      month_mar: "Mar",
      month_apr: "Apr",
      month_may: "May",
      month_jun: "Jun",
      month_jul: "Jul",
      month_aug: "Aug",
      month_sep: "Sep",
      month_oct: "Oct",
      month_nov: "Nov",
      month_dec: "Dec",
      sensor_prediction: "Sensor Prediction",
      degradation_trend: "Trend",
      trend_rising: "Rising",
      trend_falling: "Falling",
      trend_stable: "Stable",
      trend_insufficient_data: "Insufficient data",
      days_until_threshold: "Days until threshold",
      threshold_exceeded: "Threshold exceeded",
      environmental_adjustment: "Environmental factor",
      sensor_prediction_urgency: "Sensor predicts threshold in ~{days} days",
      day_short: "day",
      weibull_reliability_curve: "Reliability Curve",
      weibull_failure_probability: "Failure Probability",
      weibull_r_squared: "Fit R\xB2",
      beta_early_failures: "Early Failures",
      beta_random_failures: "Random Failures",
      beta_wear_out: "Wear-out",
      beta_highly_predictable: "Highly Predictable",
      confidence_interval: "Confidence Interval",
      confidence_conservative: "Conservative",
      confidence_aggressive: "Optimistic",
      current_interval_marker: "Current interval",
      recommended_marker: "Recommended",
      characteristic_life: "Characteristic life",
      chart_mini_sparkline: "Trend sparkline",
      chart_history: "Cost and duration history",
      chart_seasonal: "Seasonal factors, 12 months",
      chart_weibull: "Weibull reliability curve",
      chart_sparkline: "Sensor trigger value chart",
      days_progress: "Days progress",
      qr_code: "QR Code",
      qr_generating: "Generating QR code\u2026",
      qr_error: "Failed to generate QR code.",
      qr_error_no_url: "No HA URL configured. Please set an external or internal URL in Settings \u2192 System \u2192 Network.",
      save_error: "Failed to save. Please try again.",
      qr_print: "Print",
      qr_download: "Download SVG",
      qr_action: "Action on scan",
      qr_action_view: "View maintenance info",
      qr_action_complete: "Mark maintenance as complete",
      qr_url_mode: "Link type",
      qr_mode_companion: "Companion App",
      qr_mode_local: "Local (mDNS)",
      qr_mode_server: "Server URL",
      overview: "Overview",
      analysis: "Analysis",
      recent_activities: "Recent Activities",
      search_notes: "Search notes",
      avg_cost: "Avg Cost",
      no_advanced_features: "No advanced features enabled",
      no_advanced_features_hint: "Enable \u201CAdaptive Intervals\u201D or \u201CSeasonal Patterns\u201D in the integration settings to see analysis data here.",
      analysis_not_enough_data: "Not enough data for analysis yet.",
      analysis_not_enough_data_hint: "Weibull analysis requires at least 5 completed maintenances; seasonal patterns become visible after 6+ data points per month.",
      analysis_manual_task_hint: "Manual tasks without an interval do not generate analysis data.",
      completions: "completions",
      current: "Current",
      shorter: "Shorter",
      longer: "Longer",
      normal: "Normal",
      disabled: "Disabled",
      compound_logic: "Compound logic",
      compound: "Compound (multiple conditions)",
      compound_logic_and: "AND \u2014 all conditions must trigger",
      compound_logic_or: "OR \u2014 any condition triggers",
      compound_help: "Combine several sensor conditions into one trigger.",
      compound_no_conditions: "No conditions yet \u2014 add at least one.",
      compound_add_condition: "Add condition",
      compound_condition: "Condition",
      compound_remove_condition: "Remove condition",
      card_title: "Title",
      card_show_header: "Show header with statistics",
      card_show_actions: "Show action buttons",
      card_compact: "Compact mode",
      card_max_items: "Max items (0 = all)",
      card_filter_status: "Filter by status",
      card_filter_status_help: "Empty = show all statuses.",
      card_filter_objects: "Filter by objects",
      card_filter_objects_help: "Empty = show all objects.",
      card_filter_areas: "Filter by areas",
      card_filter_areas_help: "Empty = show all areas.",
      card_filter_priority_help: "Empty = show all priorities. Tasks without an explicit priority count as Normal.",
      card_filter_entities: "Filter by entities (entity_ids)",
      card_filter_entities_help: "Pick sensor / binary_sensor entities from this integration. Empty = all.",
      card_loading_objects: "Loading objects\u2026",
      card_load_error: "Could not load objects \u2014 check the WebSocket connection.",
      card_no_tasks_title: "No maintenance tasks yet",
      card_no_tasks_cta: "\u2192 Create one in the Maintenance panel",
      no_objects: "No objects yet.",
      action_error: "Action failed. Please try again.",
      area_id_optional: "Area (optional)",
      installation_date_optional: "Installation date (optional)",
      warranty_expiry_optional: "Warranty expiry (optional)",
      warranty: "Warranty",
      warranty_valid_until: "valid until {date}",
      warranty_expires_in: "expires in {days} days",
      warranty_expired: "expired",
      cal_past_windows: "Past windows",
      cal_forward_windows: "Forward windows",
      history_edit_title: "Edit history entry",
      history_edit_timestamp: "Timestamp",
      manufacturer: "Manufacturer",
      model: "Model",
      area: "Area",
      actions: "Actions",
      view_mode_label: "View",
      view_cards: "Card view",
      view_table: "Table view",
      objects_table_columns_label: "Objects table columns",
      objects_table_columns_hint: "Choose which columns appear in the objects table view.",
      custom_icon_optional: "Icon (optional, e.g. mdi:wrench)",
      task_enabled: "Task enabled",
      skip_reason_prompt: "Skip this task?",
      reason_optional: "Reason (optional)",
      reset_date_prompt: "Mark task as performed?",
      reset_date_optional: "Last performed date (optional, defaults to today)",
      notes_label: "Notes",
      documentation_label: "Documentation",
      no_nfc_tag: "\u2014 No tag \u2014",
      dashboard: "Dashboard",
      tab_today: "Today",
      palette_placeholder: "Search objects and tasks\u2026",
      palette_no_results: "No matches",
      palette_hint: "\u2191\u2193 to navigate \xB7 Enter to open \xB7 Esc to close",
      today_all_caught_up: "All caught up! Nothing due this week.",
      today_overdue: "Overdue",
      today_due_today: "Due today",
      today_this_week: "This week",
      settings: "Settings",
      settings_features: "Advanced Features",
      settings_features_desc: "Enable or disable advanced features. Disabling hides them from the UI but does not delete data.",
      feat_adaptive: "Adaptive Scheduling",
      feat_adaptive_desc: "Learn optimal intervals from maintenance history",
      feat_predictions: "Sensor Predictions",
      feat_predictions_desc: "Predict trigger dates from sensor degradation",
      feat_seasonal: "Seasonal Adjustments",
      feat_seasonal_desc: "Adjust intervals based on seasonal patterns",
      feat_environmental: "Environmental Correlation",
      feat_environmental_desc: "Correlate intervals with temperature/humidity",
      feat_budget: "Budget Tracking",
      feat_budget_desc: "Track monthly and yearly maintenance spending",
      feat_groups: "Task Groups",
      feat_groups_desc: "Organize tasks into logical groups",
      feat_checklists: "Checklists",
      feat_checklists_desc: "Multi-step procedures for task completion",
      settings_general: "General",
      settings_default_warning: "Default warning days",
      settings_panel_enabled: "Sidebar panel",
      settings_panel_title: "Sidebar panel title",
      settings_notifications: "Notifications",
      settings_notify_service: "Notification service",
      settings_install_assist_sentences: "Install Assist sentences",
      settings_install_assist_sentences_hint: "Copies the voice sentences into your configuration so the classic Assist agent recognises them. A file you edited yourself is never overwritten.",
      test_notification: "Test notification",
      send_test: "Send test",
      testing: "Sending\u2026",
      test_notification_success: "Test notification sent",
      test_notification_failed: "Test notification failed",
      notify_per_person: "Per-person delivery",
      notify_no_own_device: "No own device \u2014 uses the household service",
      settings_notify_due_soon: "Notify when due soon",
      settings_notify_overdue: "Notify when overdue",
      settings_notify_triggered: "Notify when triggered",
      settings_interval_hours: "Repeat interval (hours, 0 = once)",
      settings_quiet_hours: "Quiet hours",
      settings_quiet_start: "Start",
      settings_quiet_end: "End",
      settings_max_per_day: "Max notifications per day (0 = unlimited)",
      settings_bundling: "Bundle notifications",
      settings_bundle_threshold: "Bundle threshold",
      settings_reminder_leads: "Extra reminders (days before due)",
      settings_reminder_leads_hint: "Comma-separated lead times, e.g. 14, 3, 0 \u2014 one extra reminder fires on each matching day. Empty = off.",
      settings_actions: "Mobile Action Buttons",
      settings_action_complete: "Show 'Complete' button",
      settings_action_skip: "Show 'Skip' button",
      settings_action_snooze: "Show 'Snooze' button",
      settings_weekly_digest: "Weekly digest",
      settings_weekly_digest_hint: "A single summary notification on Monday morning when tasks are due.",
      settings_warranty_reminder: "Warranty expiry reminder",
      settings_warranty_reminder_days: "Days before expiry",
      settings_warranty_reminder_hint: "Notify once when an object's warranty is this many days from expiring.",
      settings_snooze_hours: "Snooze duration (hours)",
      settings_budget: "Budget",
      settings_currency: "Currency",
      settings_budget_monthly: "Monthly budget",
      settings_budget_yearly: "Yearly budget",
      settings_budget_alerts: "Budget alerts",
      settings_budget_threshold: "Alert threshold (%)",
      settings_import_export: "Import / Export",
      settings_export_json: "Export JSON",
      settings_export_yaml: "Export YAML",
      settings_export_csv: "Export CSV",
      settings_export_settings: "Export settings (JSON)",
      settings_import_csv: "Import CSV",
      settings_import_placeholder: "Paste JSON or CSV content here\u2026",
      settings_import_btn: "Import",
      settings_import_success: "{count} objects imported successfully.",
      settings_export_success: "Export downloaded.",
      settings_saved: "Setting saved.",
      settings_include_history: "Include history",
      settings_export_selection: "Limit to selected objects (optional)",
      settings_docs_archive: "Documents archive (with files)",
      settings_docs_archive_hint: "The JSON/YAML/CSV exports carry settings only. This ZIP includes the uploaded file contents so a restore is complete.",
      settings_docs_export_btn: "Download documents ZIP",
      settings_docs_import_btn: "Restore documents ZIP",
      settings_docs_import_success: "Restored: {blobs} files, {docs} documents",
      sort_alphabetical: "Alphabetical",
      sort_due_soonest: "Due soonest",
      sort_task_count: "Task count",
      sort_area: "Area",
      sort_assigned_user: "Assigned user",
      sort_group: "Group",
      groupby_none: "No grouping",
      groupby_area: "By area",
      groupby_group: "By group",
      groupby_user: "By user",
      filter_label: "Filter",
      user_label: "User",
      photo_label: "Photo",
      sort_label: "Sort",
      group_by_label: "Group by",
      state_value_help: 'Use the HA state value (usually lowercase, e.g. "on"/"off"). Case is normalised on save.',
      target_changes_help: "Number of matching transitions before the trigger fires (default: 1).",
      for_minutes_state_help: "0 counts every change immediately. Set minutes and the new state must hold that long first \u2014 brief flickers then neither trigger nor count.",
      qr_print_title: "Print QR codes",
      qr_print_desc: "Generate a printable page of QR codes to cut out and stick on your equipment.",
      qr_print_load: "Load objects",
      qr_print_filter: "Filter",
      qr_print_objects: "Objects",
      qr_print_actions: "Actions",
      qr_print_url_mode: "Link type",
      qr_print_estimate: "Estimated QR codes",
      qr_print_over_limit: "cap is 200, narrow the filter",
      qr_print_generate: "Generate QR codes",
      qr_print_generating: "Generating\u2026",
      qr_print_ready: "QR codes ready",
      qr_print_print_button: "Print",
      qr_print_empty: "Nothing to generate",
      qr_action_skip: "Skip",
      vacation_title: "Vacation mode",
      vacation_active: "active",
      vacation_ended: "ended",
      vacation_desc: "Plan a vacation: notifications are paused during the period plus a buffer of days. You can opt specific tasks back in.",
      vacation_enable: "Enable vacation mode",
      vacation_start: "Start",
      vacation_end: "End",
      vacation_buffer: "Buffer (days)",
      vacation_exempt_title: "Notify anyway during vacation",
      vacation_exempt_desc: "Pick tasks that should still notify during vacation (e.g. critical pool chemistry).",
      vacation_load_tasks: "Load tasks",
      vacation_preview_btn: "Show preview",
      vacation_preview_affected: "tasks affected",
      vacation_event_due_soon: "becomes due soon",
      vacation_event_overdue: "becomes overdue",
      vacation_event_triggered_est: "sensor trigger possible",
      vacation_sensor_based: "(sensor-based)",
      vacation_action_notify: "Notify anyway",
      vacation_action_unsilence: "Silence again",
      vacation_marked_complete: "Marked complete",
      vacation_marked_skip: "Skipped",
      vacation_end_now: "End vacation now",
      add: "Add",
      show_stats: "Show stats + graphs",
      hide_stats: "Hide stats",
      adaptive_no_data: "Not enough completion history yet for adaptive analysis. Complete this task a few more times to unlock interval recommendations and reliability charts.",
      suggestion_applied: "Suggested interval applied",
      vacation_mode: "Vacation mode",
      vacation_status_active: "Active now",
      vacation_status_scheduled: "Scheduled",
      vacation_status_inactive: "Inactive",
      vacation_end_now_confirm: "End vacation immediately?",
      vacation_exempt_count: "exempt",
      vacation_advanced: "Advanced\u2026",
      vacation_open_panel: "Open in panel",
      enable: "Enable",
      saved: "Saved",
      budget_monthly_set: "Set monthly",
      budget_yearly_set: "Set yearly",
      budget_advanced: "Currency, alerts\u2026",
      budget_open_panel: "Open in panel",
      groups_empty: "No groups yet.",
      group_new_placeholder: "Add group\u2026",
      group_delete_confirm: 'Delete group "{name}"?',
      groups_manage_tasks: "Manage task assignments\u2026",
      groups_open_panel: "Open in panel",
      unassigned: "Unassigned",
      no_area: "No area",
      has_overdue: "Has overdue tasks",
      object: "Object",
      settings_panel_access: "Panel access",
      settings_panel_access_desc: "Admins always have full access. To delegate create, edit and delete to specific non-admins, switch this on and pick them below \u2014 everyone else sees only Complete and Skip.",
      settings_operator_write: "Allow selected users to create, edit & delete",
      settings_operator_write_desc: "Off: only admins can change content. On: the selected users below get full access too.",
      no_non_admin_users: "No non-admin users found. Add some in Settings \u2192 People.",
      owner_label: "Owner",
      feat_completion_actions: "Completion actions",
      feat_completion_actions_desc: "Per-task HA action on complete + quick-complete QR with pre-set values.",
      on_complete_action_title: "On complete: trigger HA action (optional)",
      on_complete_action_desc: "Calls an HA service when the task is completed \u2014 e.g. reset a counter on the device.",
      on_complete_action_service: "Service",
      on_complete_action_target: "Target entity",
      on_complete_action_target_hint: "Note: the entity domain must match the service \u2014 e.g. 'button.press' only works on button.*, 'counter.increment' only on counter.*, 'input_button.press' only on input_button.* etc. On a mismatch the action will silently fail (HA logs 'Referenced entities ... missing or not currently available').",
      on_complete_action_data: "Data (JSON, optional)",
      on_complete_action_test: "Validate configuration",
      on_complete_action_test_success: "\u2713 Configuration valid (action will fire only on task completion)",
      on_complete_action_test_failed: "Failed",
      quick_complete_defaults_title: "Quick-complete defaults (for QR scans, optional)",
      quick_complete_defaults_desc: "Pre-set values for quick-complete QR scans. Without these, the QR opens the complete dialog.",
      quick_complete_defaults_notes: "Notes",
      quick_complete_defaults_cost: "Cost",
      quick_complete_defaults_duration: "Duration (minutes)",
      quick_complete_defaults_feedback_none: "No feedback",
      quick_complete_defaults_feedback_needed: "Was needed",
      quick_complete_defaults_feedback_not_needed: "Not needed",
      quick_complete_success: "Quickly marked complete",
      show_all_objects: "Show all objects",
      show_all_tasks: "Clear filter \u2014 show all tasks",
      filter_to_overdue: "Filter task list to overdue only",
      filter_to_due_soon: "Filter task list to due-soon only",
      filter_to_triggered: "Filter task list to triggered only",
      open_task: "Open task",
      show_details: "Show history + stats",
      hide_details: "Hide details",
      history_empty: "No history yet.",
      history_edit_button: "Edit entry",
      total_cost: "Total cost",
      times_performed: "Performed",
      older_entries: "older",
      open_in_panel: "Open in Maintenance panel",
      skip_reason: "Skip reason (optional)",
      reset_to_date: "Reset last_performed to",
      delete_task_confirm: "Delete this task and its history?",
      delete_object_confirm: "Delete this object and all its tasks?",
      loading: "Loading\u2026",
      archive: "Archive",
      undo: "Undo",
      task_archived: "Task archived",
      object_archived: "Object archived",
      unarchive: "Unarchive",
      archived: "Archived",
      show_archived: "Show archived",
      hide_archived: "Hide archived",
      confirm_archive_object: "Archive this object and its tasks? They keep their history and can be unarchived later.",
      settings_archive: "Archive & Retention",
      settings_archive_desc: "Retire completed one-off tasks without deleting them. Archived items are hidden and inert but keep their history and cost.",
      settings_archive_oneoff_days: "Auto-archive completed one-off tasks after (days, 0 = off)",
      settings_delete_archived_oneoff_days: "Auto-delete archived one-off tasks after (days, 0 = never)",
      archive_object: "Archive object",
      unarchive_object: "Unarchive object",
      documents: "Documents",
      documents_empty: "No documents yet.",
      doc_upload: "Upload file",
      doc_uploading: "Uploading\u2026",
      doc_add_link: "Add link",
      doc_link_url: "URL (https://\u2026)",
      doc_link_title: "Title (optional)",
      doc_open: "Open",
      doc_delete_confirm: 'Delete "{name}"?',
      doc_too_large: "File is too large (max 25 MB).",
      doc_upload_failed: "Upload failed.",
      completion_photo_optional: "Completion photo (optional)",
      add_photo: "Add photo",
      uploading: "Uploading\u2026",
      remove: "Remove",
      doc_deduped: "Already stored elsewhere \u2014 shared, no extra space used.",
      doc_dup_in_object: "This file is already attached to this object.",
      doc_link_invalid: "Only http/https links are allowed.",
      doc_cat_manual: "Manual",
      doc_cat_warranty: "Warranty",
      doc_cat_invoice: "Invoice",
      doc_cat_spare_parts: "Spare parts",
      doc_cat_photo: "Photo",
      doc_cat_other: "Other",
      doc_link_badge: "Link",
      doc_storage_title: "Document storage",
      doc_storage_saved: "Saved via deduplication",
      doc_storage_refresh: "Refresh",
      doc_download: "Download",
      doc_close: "Close",
      doc_camera: "Take photo",
      doc_drop_hint: "Drop files here",
      doc_task_none: "No documents linked to this task.",
      doc_link_existing: "Link a document\u2026",
      doc_attach: "Link",
      doc_unlink: "Unlink",
      doc_page: "Page",
      chart_range_7d: "7d",
      chart_range_30d: "30d",
      chart_range_90d: "90d",
      chart_range_1y: "1y",
      chart_since_service: "since last service",
      chart_no_stats: "No long-term statistics for this entity \u2014 showing maintenance-event values only",
      auto_complete_on_recovery: "Auto-complete when the sensor recovers",
      auto_complete_on_recovery_help: "Records a completion (sets last performed) when the trigger clears itself \u2014 e.g. salt refilled, filter replaced.",
      doc_search: "Search documents\u2026",
      doc_search_none: "No matching documents",
      link_device_optional: "Link to existing device (optional)",
      parent_object_optional: "Parent object (optional)",
      parent_none: "(No parent)",
      paused: "Paused",
      pause_object: "Pause",
      resume_object: "Resume",
      pause_until_prompt: "Freeze this object's schedules \u2014 nothing becomes due and nothing notifies until it is resumed. Optionally set an auto-resume date.",
      pause_until_label: "Resume on (optional)",
      object_paused: "Object paused",
      object_resumed: "Object resumed \u2014 schedules restarted",
      object_paused_badge: "Paused",
      paused_until_label: "until",
      replace_object: "Replace\u2026",
      replace_object_prompt: "Retire this object and create a successor. History and costs stay archived on the old one; tasks and documents carry over to the new one, counters start fresh.",
      replace_name_label: "Successor name",
      object_replaced: "Object replaced \u2014 successor created",
      reading_unit_label: "Reading unit (e.g. kWh, m\xB3)",
      reading_unit_help: "Shown next to the recorded value when completing this task.",
      reading_value_label: "Reading value",
      reading_label: "Reading",
      settings_templates_label: "Template gallery",
      settings_templates_hint: `Untick templates you'll never need \u2014 they disappear from the "From template" pickers (panel and config flow). Nothing else changes; you can re-enable them any time.`,
      worksheet: "Work sheet",
      worksheet_scan_view: "Scan to open the task",
      worksheet_scan_complete: "Scan to complete",
      worksheet_manual_excerpt: "Manual excerpt",
      worksheet_pages: "pages",
      worksheet_printed: "Printed",
      worksheet_never: "Never",
      card_all_caught_up: "All caught up \u2014 nothing needs attention",
      postpone: "Postpone",
      postpone_date_prompt: "Postpone this occurrence to which date?",
      postpone_date_label: "New due date",
      postponed: "Postponed",
      postponed_to: "Postponed to",
      season_window_label: "Seasonal window (months)",
      season_window_hint: "Only due in the selected months; off-season dates roll to the next active month. None = all year.",
      series_end_label: "Ends",
      series_end_never: "Never (repeats indefinitely)",
      series_end_after_count: "After a number of times",
      series_end_until: "On a date",
      series_end_count_label: "Number of times",
      series_end_until_label: "End date",
      parts_section: "Parts & consumables",
      parts_inventory_value: "Inventory value",
      part_add: "Add part",
      part_name: "Name",
      part_vendor: "Manufacturer",
      part_storage_location: "Storage location",
      part_product_url: "Product URL",
      part_unit: "Unit",
      part_cost: "Unit price",
      part_stock: "Stock",
      part_reorder_threshold: "Reorder at",
      part_restock_quantity: "Restock quantity",
      part_auto_buy: "Auto-create buy task when low",
      part_restock: "Adjust stock",
      parts_used_by: "Used by",
      restock_quantity_label: "Quantity bought",
      consumes_parts_label: "Consumes parts",
      shared_parts_other_objects: "Parts from other objects",
      shared_parts_help: "Several objects can share one stock. Completing this task takes from the owning object.",
      shared_part_unknown: "Unknown part",
      parts_load_failed: "Couldn't load this object's parts \u2014 the consumes-parts options are unavailable right now.",
      adopt_problem_button: "Adopt problem sensors",
      adopt_problem_title: "Adopt problem sensors",
      adopt_problem_hint: "Turn HA problem sensors (printer errors, filter warnings, low battery) into maintenance tasks that trigger while the problem is active and clear themselves when it resolves.",
      adopt_problem_none: "No problem sensors found that aren't already tracked.",
      adopt_problem_active: "active",
      adopt_problem_ok: "ok",
      adopt_problem_new_object: "(new)",
      adopt_problem_adopt: "Adopt selected",
      adopt_problem_done: "Adopted {tasks} problem sensor(s)",
      views_label: "Views",
      views_none: "\u2014 No view \u2014",
      views_manage: "Save / manage views",
      views_dialog_title: "Saved views",
      views_dialog_hint: "Save the current filters as a named view everyone can reuse.",
      views_name_placeholder: "View name",
      views_save_current: "Save current filters",
      views_none_yet: "No saved views yet.",
      close: "Close",
      trigger_hint_now: "The sensor reads {value} right now.",
      trigger_hint_above: "The task triggers once it rises above {target}.",
      trigger_hint_below: "It triggers once it falls below {target}.",
      trigger_hint_counter_delta: "Counts from the current reading ({value}): due at {due} (+{target}), and the count restarts after each completion.",
      trigger_hint_counter_delta_edit: "Counts usage since the last completion: due after +{target}; the count restarts after each completion.",
      trigger_hint_counter_abs: "The task becomes due once the sensor reaches {target}.",
      trigger_hint_runtime: "The task becomes due after {hours} h of accumulated on-time; the counter restarts after each completion.",
      trigger_hint_state_change: "The task becomes due after {count} state change(s).",
      trigger_hint_state_change_to: "The task becomes due after {count} change(s) to \u201C{state}\u201D.",
      trigger_hint_state_now: "Current state: {value}.",
      adopt_problem_part: "Uses part: {name}",
      label_filter: "Label",
      all_labels: "All labels",
      settings_notify_scope: "Notify only for view",
      settings_notify_scope_all: "All tasks",
      settings_notify_scope_hint: "Only tasks matching the selected saved view's label/user filters send reminders. Status, sorting and grouping of the view are ignored here.",
      card_saved_view: "Saved view",
      card_saved_view_none: "None",
      card_saved_view_help: "Applies the view's status, user and label filters on top of the filters above. The view's sorting and grouping are panel display settings and are not applied on the card.",
      doc_part_none: "No documents linked to this part.",
      settings_templates_toggle_group: "Enable or disable all templates in this group",
      setups_button: "Suggested setups",
      setups_title: "Suggested setups (Beta)",
      setups_hint: "Devices of supported integrations whose consumable sensors can drive maintenance tasks. Adopting creates the object and wires each task to its sensor \u2014 it triggers when the consumable runs low and resolves itself after replacement.",
      setups_none: "No supported devices with unwired consumable sensors found.",
      setups_adopt: "Set up selected",
      setups_done: "{tasks} sensor-wired tasks created.",
      complete_parts_used: "Parts used this time",
      part_delete_confirm: "Delete part '{name}'? Its stock tracking, task links and any open buy reminder will be removed.",
      baseline_start_value: "Start reading (optional)",
      baseline_start_help: "Counting starts from this reading. Leave empty to count from the current value; enter the reading at the last service so usage since then already counts.",
      setups_baseline_hint: "reading at last service (optional)",
      baseline_start_help_edit: "Leave empty to keep the existing counting. Entering a value re-anchors the counting (e.g. the reading at the last service).",
      baseline_current_effective: "Currently effective start value: {value}",
      runtime_on_states: "Active states",
      runtime_on_states_help: "States that count as running \u2014 default: on. E.g. mowing, cleaning, printing. With an attribute selected, its values are matched instead.",
      setups_target_new: "Create new: {name}",
      schedule_preview_title: "Next dates",
      schedule_preview_ontime: "Assuming on-time completion.",
      schedule_preview_ends: "(series ends)",
      adopt_problem_responsible: "Responsible user for all adopted tasks (optional)",
      adopt_for_minutes_hint: "Only trigger once the problem has persisted this long \u2014 0 reacts to the first flicker.",
      adopt_problem_configure: "Configure",
      history_auto: "Automatic",
      battery_fleet_title: "Battery fleet",
      battery_fleet_none_low: "All batteries OK \u2014 nothing to replace.",
      battery_fleet_buy_now: "Buy now",
      battery_fleet_soon: "Needed soon",
      battery_fleet_soon_hint: "Predicted from the last replacement date \u2014 order ahead.",
      battery_fleet_mark_all: "Mark all replaced",
      battery_fleet_mark_one: "Mark this battery replaced",
      battery_fleet_offline: "offline",
      battery_fleet_trigger_lost: "This task's sensor trigger was lost \u2014 it will not fire or auto-complete.",
      battery_fleet_repair: "Repair",
      battery_fleet_exclude: "Exclude from the fleet",
      battery_fleet_excluded: "Excluded",
      battery_fleet_include: "Track again",
      battery_fleet_all: "All tracked batteries",
      battery_fleet_all_hint: "Exclude a device here to drop it from the fleet before it ever reports low \u2014 a vacuum that recharges itself, or a phone that warns you on its own.",
      battery_fleet_add: "Add a battery",
      battery_fleet_add_hint: "Pick a battery sensor the automatic discovery missed \u2014 it joins the roster immediately.",
      battery_fleet_track_self: "Track self-charging batteries",
      battery_fleet_track_self_hint: "Phones, vacuums and other devices that recharge themselves appear as rechargeables \u2014 a low one asks for a charge, never for new cells.",
      battery_fleet_status_low: "Low",
      battery_fleet_status_soon: "Soon",
      battery_fleet_status_ok: "Healthy",
      battery_fleet_predicted_on: "Expected around {date}",
      battery_fleet_predicted_trend: "Predicted from this battery's discharge trend: around {date} ({confidence})",
      battery_fleet_rechargeable: "Rechargeable: charge instead of replacing \u2014 never on the shopping list",
      battery_fleet_sort_name: "Sort by name",
      battery_fleet_sort_urgency: "Sort by urgency",
      battery_fleet_mark_recharged: "Mark as recharged",
      battery_fleet_sparkline_hint: "Battery level over the last 30 days \u2014 dotted: projected until the low threshold",
      battery_fleet_filter_type: "Show only this battery type",
      battery_fleet_record_replacement: "The level jumped around {date} \u2014 record this replacement in Battery Notes",
      battery_fleet_total: "{n} batteries tracked",
      battery_fleet_setup_button: "Battery fleet",
      battery_fleet_setup_done: "Battery fleet set up \u2014 one task tracks all your batteries.",
      update_banner: "A newer version of Maintenance Supporter is on the server \u2014 reload to update the panel.",
      update_reload: "Reload",
      battery_fleet_forecast_overdue: "Predicted date passed \u2014 the battery still reports healthy. If you swapped it, record the replacement; otherwise the forecast was off.",
      cost_from_parts: "Use \u2248 {amount} from parts",
      dismiss: "Dismiss",
      gs_label: "Getting started \u2014 these hints retire as your setup grows",
      gs_setups_chip: "Suggested setups found {n} devices with pre-wired triggers",
      gs_adopt_chip: "{n} problem sensors can become maintenance tasks",
      gs_fleet_chip: "One click sets up the battery fleet",
      cal_editor_window: "Default window",
      cal_editor_window_week: "Week (7 days)",
      cal_editor_window_fortnight: "Fortnight (14 days)",
      cal_editor_window_month: "Month (30 days, default)",
      cal_editor_window_year: "Year (365 days, empty days collapsed)",
      cal_editor_show_chips: "Show window chips inside the card",
      cal_editor_chips_hint: "Hide the chips when the card is embedded in a strategy view that already serves as the window selector.",
      cal_editor_show_user_filter: "Show user filter dropdown",
      cal_editor_default_user: "Default user filter",
      cal_editor_my_tasks: "My tasks (current user)",
      cal_editor_show_object_filter: "Show object filter dropdown",
      cal_editor_object_hint: 'Pre-select one object via YAML: object_filter: "<object name>" \u2014 or a list of names to restrict the card to several objects.'
    };
  }
});

// helpers/bundle-version.ts
var BUNDLE_VERSION;
var init_bundle_version = __esm({
  "helpers/bundle-version.ts"() {
    "use strict";
    BUNDLE_VERSION = true ? "2.63.1" : "dev";
  }
});

// status-constants.ts
var STATUS_COLORS, STATUS_ICONS;
var init_status_constants = __esm({
  "status-constants.ts"() {
    "use strict";
    STATUS_COLORS = {
      ok: "var(--success-color, #4caf50)",
      due_soon: "var(--warning-color, #ff9800)",
      overdue: "var(--error-color, #f44336)",
      // Theme-token first so it adapts to dark/custom themes (was a bare #ff5722).
      triggered: "var(--deep-orange-color, #ff5722)",
      // v2.10.0: archived is a neutral, greyed-out state (retired but retained).
      archived: "var(--disabled-color, #9e9e9e)",
      // v2.20 (N3): paused is frozen-but-present — info blue, clearly not urgent.
      paused: "var(--info-color, #2196f3)"
    };
    STATUS_ICONS = {
      ok: "mdi:check-circle",
      due_soon: "mdi:alert-circle",
      overdue: "mdi:alert-octagon",
      triggered: "mdi:bell-alert",
      archived: "mdi:archive-outline",
      paused: "mdi:pause-circle-outline",
      completed: "mdi:check-circle",
      skipped: "mdi:skip-next",
      missed: "mdi:calendar-remove",
      reset: "mdi:refresh"
    };
  }
});

// styles.ts
function seedEnglish(en) {
  STORE.en = Object.assign({}, en, STORE.en ?? {});
}
function normLang(lang) {
  const l3 = (lang || DEFAULT_LANG).toLowerCase();
  if (l3.startsWith("pt") && l3.endsWith("br")) return "pt-br";
  return l3.substring(0, 2);
}
function t3(key, lang) {
  const l3 = normLang(lang);
  return STORE[l3]?.[key] ?? STORE.en[key] ?? key;
}
function syncLocaleFromHass(host, changedProps) {
  if (changedProps.has("hass")) setDateTimePrefs(host.hass?.locale);
  const lang = host.hass?.language;
  if (lang && !isLocaleLoaded(lang)) {
    ensureLocale(lang).then(() => host.requestUpdate());
  }
}
function langOf(hass) {
  return hass?.language || "en";
}
function isLocaleLoaded(lang) {
  const l3 = normLang(lang);
  return l3 === DEFAULT_LANG || l3 in STORE;
}
function ensureLocale(lang) {
  const l3 = normLang(lang);
  if (l3 === DEFAULT_LANG || l3 in STORE || !SUPPORTED_LANGS.has(l3)) {
    return Promise.resolve();
  }
  if (!(l3 in _localeInflight)) {
    _localeInflight[l3] = fetch(`${LOCALES_BASE}/${l3}.json?v=${BUNDLE_VERSION}`).then((r6) => r6.ok ? r6.json() : null).then((data) => {
      if (data) {
        STORE[l3] = data;
      } else {
        delete _localeInflight[l3];
      }
    }).catch(() => {
      delete _localeInflight[l3];
    });
  }
  return _localeInflight[l3];
}
function langToLocale(lang) {
  const l3 = normLang(lang);
  const map = {
    de: "de-DE",
    en: "en-US",
    nl: "nl-NL",
    fr: "fr-FR",
    it: "it-IT",
    es: "es-ES",
    pt: "pt-PT",
    ru: "ru-RU",
    uk: "uk-UA",
    zh: "zh-CN",
    da: "da-DK",
    fi: "fi-FI",
    nb: "nb-NO",
    ja: "ja-JP",
    hi: "hi-IN",
    // pl/cs/sv were missing and silently fell back to en-US — Polish users
    // saw MM/DD dates (caught by the live multi-language check, 2026-07-19).
    pl: "pl-PL",
    cs: "cs-CZ",
    sv: "sv-SE",
    "pt-br": "pt-BR",
    hu: "hu-HU",
    ko: "ko-KR",
    tr: "tr-TR"
  };
  return map[l3] ?? "en-US";
}
function setDateTimePrefs(locale) {
  if (!locale) return;
  DT_PREFS.date = locale.date_format;
  DT_PREFS.time = locale.time_format;
}
function _formatDateObj(d3, lang) {
  const dd = String(d3.getDate()).padStart(2, "0");
  const mm = String(d3.getMonth() + 1).padStart(2, "0");
  const yyyy = String(d3.getFullYear());
  switch (DT_PREFS.date) {
    case "DMY":
      return `${dd}/${mm}/${yyyy}`;
    case "MDY":
      return `${mm}/${dd}/${yyyy}`;
    case "YMD":
      return `${yyyy}-${mm}-${dd}`;
    case "system":
      return d3.toLocaleDateString(void 0, { day: "2-digit", month: "2-digit", year: "numeric" });
    default:
      return d3.toLocaleDateString(langToLocale(lang), { day: "2-digit", month: "2-digit", year: "numeric" });
  }
}
function _formatTimeObj(d3, lang) {
  switch (DT_PREFS.time) {
    case "12":
      return d3.toLocaleTimeString(langToLocale(lang), { hour: "2-digit", minute: "2-digit", hour12: true });
    case "24":
      return d3.toLocaleTimeString(langToLocale(lang), { hour: "2-digit", minute: "2-digit", hour12: false });
    case "system":
      return d3.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" });
    default:
      return d3.toLocaleTimeString(langToLocale(lang), { hour: "2-digit", minute: "2-digit" });
  }
}
function formatDate(iso, lang) {
  if (!iso) return "\u2014";
  try {
    const local = iso.includes("T") ? iso : iso + "T00:00:00";
    return _formatDateObj(new Date(local), lang);
  } catch {
    return iso;
  }
}
function formatDateTime(iso, lang) {
  if (!iso) return "\u2014";
  try {
    const d3 = new Date(iso);
    return _formatDateObj(d3, lang) + " " + _formatTimeObj(d3, lang);
  } catch {
    return iso;
  }
}
function formatDueDays(days, lang) {
  if (days === null || days === void 0) return "\u2014";
  const l3 = lang || "en";
  if (days < 0) return `${Math.abs(days)} ${t3("d_overdue", l3)}`;
  if (days === 0) return t3("today", l3);
  return `${days} ${days === 1 ? t3("day", l3) : t3("days", l3)}`;
}
function formatInterval(intervalDays, unit, lang) {
  if (intervalDays === null || intervalDays === void 0) return "\u2014";
  return `${intervalDays} ${t3("unit_" + (unit || "days"), lang)}`;
}
function weekdayName(i6, lang, style = "long") {
  return new Date(Date.UTC(2024, 0, 1 + i6)).toLocaleDateString(langToLocale(lang), { weekday: style, timeZone: "UTC" });
}
function formatRecurrence(task, lang) {
  const s4 = task.schedule;
  const off = s4?.offset ? ` ${s4.offset > 0 ? "+" : "\u2212"}${Math.abs(s4.offset)}d` : "";
  switch (s4?.kind) {
    case "weekdays":
      return ((s4.weekdays || []).map((d3) => weekdayName(d3, lang, "short")).join(" & ") || "\u2014") + off;
    case "nth_weekday": {
      if (s4.weekday == null || s4.nth == null) return "\u2014";
      const ord = s4.nth === -1 ? t3("ord_last", lang) : t3("ord_" + s4.nth, lang);
      return `${ord} ${weekdayName(s4.weekday, lang, "long")}${off}`;
    }
    case "day_of_month": {
      if (s4.day == null) return "\u2014";
      const base = s4.day === -1 ? t3(s4.business ? "last_business_day_month" : "last_day_month", lang) : `${t3("day_word", lang)} ${s4.day}`;
      return base + off;
    }
    case "one_time":
      return task.due_date ? formatDate(task.due_date, lang) : t3("one_time", lang);
    case "manual":
      return t3("manual", lang);
    case "interval":
      return formatInterval(s4.every, s4.unit, lang);
  }
  if (task.schedule_type === "one_time") return task.due_date ? formatDate(task.due_date, lang) : t3("one_time", lang);
  if (task.schedule_type === "manual") return t3("manual", lang);
  if (task.schedule_type === "sensor_based") return t3("sensor_based", lang);
  return task.interval_days != null ? formatInterval(task.interval_days, task.interval_unit, lang) : "\u2014";
}
function fireMoreInfo(ev, entityId) {
  ev.currentTarget.dispatchEvent(
    new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true
    })
  );
}
var DEFAULT_CURRENCY_SYMBOL, DEFAULT_LANG, _localeGlobals, STORE, SUPPORTED_LANGS, LOCALES_BASE, _localeInflight, _w, DT_PREFS, nativeFieldStyles, sharedStyles;
var init_styles = __esm({
  "styles.ts"() {
    "use strict";
    init_lit();
    init_en();
    init_bundle_version();
    init_status_constants();
    DEFAULT_CURRENCY_SYMBOL = "\u20AC";
    DEFAULT_LANG = "en";
    _localeGlobals = (() => {
      const w2 = window;
      if (!w2.__msLocales) w2.__msLocales = { store: {}, inflight: {} };
      return w2.__msLocales;
    })();
    STORE = _localeGlobals.store;
    seedEnglish(en_default);
    SUPPORTED_LANGS = /* @__PURE__ */ new Set([
      "de",
      "nl",
      "fr",
      "it",
      "es",
      "pt",
      "pt-br",
      "ru",
      "uk",
      "pl",
      "cs",
      "sv",
      "zh",
      "da",
      "fi",
      "nb",
      "ja",
      "hi",
      "hu",
      "ko",
      "tr"
    ]);
    LOCALES_BASE = "/maintenance_supporter_locales";
    _localeInflight = _localeGlobals.inflight;
    _w = window;
    DT_PREFS = _w.__msDateTimePrefs ??= {};
    nativeFieldStyles = i`
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
`;
    sharedStyles = i`
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
`;
  }
});

// helpers/download.ts
function downloadTextFile(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a3 = document.createElement("a");
  a3.href = url;
  a3.download = filename;
  a3.target = "_blank";
  a3.rel = "noopener";
  a3.style.display = "none";
  document.body.appendChild(a3);
  a3.dispatchEvent(new MouseEvent("click"));
  document.body.removeChild(a3);
  setTimeout(() => URL.revokeObjectURL(url), 6e4);
}
function downloadUrl(url, filename) {
  const a3 = document.createElement("a");
  a3.href = url;
  a3.download = filename;
  a3.target = "_blank";
  a3.rel = "noopener";
  a3.style.display = "none";
  document.body.appendChild(a3);
  a3.dispatchEvent(new MouseEvent("click"));
  document.body.removeChild(a3);
}
var init_download = __esm({
  "helpers/download.ts"() {
    "use strict";
  }
});

// helpers/url.ts
function isSafeHttpUrl(url) {
  return !!url && /^https?:\/\//i.test(url);
}
var init_url = __esm({
  "helpers/url.ts"() {
    "use strict";
  }
});

// user-service.ts
var UserService;
var init_user_service = __esm({
  "user-service.ts"() {
    "use strict";
    UserService = class {
      // 1 minute cache
      constructor(hass) {
        this.usersCache = null;
        this.cacheTimestamp = 0;
        this.CACHE_TTL_MS = 6e4;
        this.hass = hass;
      }
      updateHass(hass) {
        this.hass = hass;
      }
      /**
       * Get list of all active HA users (with caching)
       */
      async getUsers(forceRefresh = false) {
        const now = Date.now();
        if (!forceRefresh && this.usersCache && now - this.cacheTimestamp < this.CACHE_TTL_MS) {
          return this.usersCache;
        }
        try {
          const response = await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/users/list"
          });
          this.usersCache = response.users;
          this.cacheTimestamp = now;
          return this.usersCache;
        } catch (error) {
          console.error("Failed to fetch users:", error);
          return this.usersCache || [];
        }
      }
      /**
       * Assign a user to a task (or unassign if userId is null)
       */
      async assignUser(entryId, taskId, userId) {
        await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/task/assign_user",
          entry_id: entryId,
          task_id: taskId,
          user_id: userId
        });
      }
      /**
       * Get tasks assigned to a specific user
       */
      async getTasksByUser(userId) {
        const response = await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/tasks/by_user",
          user_id: userId
        });
        return response.tasks;
      }
      /**
       * Get user name by ID (from cache, returns null if not found)
       */
      getUserName(userId) {
        if (!userId || !this.usersCache) {
          return null;
        }
        const user = this.usersCache.find((u3) => u3.id === userId);
        return user?.name || null;
      }
      /**
       * Get full user object by ID (from cache)
       */
      getUser(userId) {
        if (!userId || !this.usersCache) {
          return null;
        }
        return this.usersCache.find((u3) => u3.id === userId) || null;
      }
      /**
       * Get current logged-in user ID
       */
      getCurrentUserId() {
        return this.hass.user?.id || null;
      }
      /**
       * Check if a user ID is the current user
       */
      isCurrentUser(userId) {
        if (!userId) return false;
        return userId === this.getCurrentUserId();
      }
      /**
       * Clear the user cache (useful when users are added/removed)
       */
      clearCache() {
        this.usersCache = null;
        this.cacheTimestamp = 0;
      }
    };
  }
});

// helpers/shared-parts.ts
function partLinkKey(link) {
  return `${link.entry_id ?? ""}\0${link.part_id}`;
}
function resolvePartLink(link, ownEntryId, objects, lang) {
  const foreign = !!link.entry_id && link.entry_id !== ownEntryId;
  const ownerId = foreign ? link.entry_id : ownEntryId;
  const owner = objects.find((o7) => o7.entry_id === ownerId);
  const part = (owner?.parts || []).find((p3) => p3.id === link.part_id) || null;
  const ownerName = foreign ? owner?.object?.name || "" : "";
  const base = part?.name || t3("shared_part_unknown", lang);
  return { part, foreign, ownerName, label: ownerName ? `${base} (${ownerName})` : base };
}
function partsForCompletion(task, ownEntryId, objects, lang) {
  const own = objects.find((o7) => o7.entry_id === ownEntryId)?.parts || [];
  const out = own.map((p3) => ({ ...p3 }));
  const seen = new Set(out.map((p3) => partLinkKey({ part_id: p3.id })));
  for (const link of task?.consumes_parts || []) {
    if (!link.entry_id || link.entry_id === ownEntryId) continue;
    const key = partLinkKey(link);
    if (seen.has(key)) continue;
    seen.add(key);
    const { part, ownerName } = resolvePartLink(link, ownEntryId, objects, lang);
    out.push({
      id: link.part_id,
      name: part?.name || t3("shared_part_unknown", lang),
      unit: part?.unit,
      stock: part?.stock ?? null,
      storage_location: part?.storage_location,
      entry_id: link.entry_id,
      owner_name: ownerName
    });
  }
  return out;
}
var init_shared_parts = __esm({
  "helpers/shared-parts.ts"() {
    "use strict";
    init_styles();
  }
});

// ws-errors.ts
function _label(field, lang) {
  const key = FIELD_LABEL_KEYS[field];
  if (!key) return field;
  const translated = t3(key, lang);
  return translated && translated !== key ? translated : field;
}
function _parse(message) {
  const fieldMatch = message.match(/data\['([^']+)'\]/);
  const field = fieldMatch?.[1];
  let m2;
  if (m2 = message.match(/length of value must be at most (\d+)/)) {
    return { field, rule: "too_long", param: m2[1] };
  }
  if (m2 = message.match(/length of value must be at least (\d+)/)) {
    return { field, rule: "too_short", param: m2[1] };
  }
  if (m2 = message.match(/value must be at most (\S+)/)) {
    return { field, rule: "value_too_high", param: m2[1] };
  }
  if (m2 = message.match(/value must be at least (\S+)/)) {
    return { field, rule: "value_too_low", param: m2[1] };
  }
  if (/required key not provided/.test(message)) {
    return { field, rule: "required" };
  }
  if (m2 = message.match(/expected (\w+)/)) {
    return { field, rule: "wrong_type", param: m2[1] };
  }
  if (/value must be one of/.test(message)) {
    return { field, rule: "invalid_choice" };
  }
  if (/not a valid value/.test(message)) {
    return { field, rule: "invalid_value" };
  }
  return { field, rule: "unknown" };
}
function describeWsError(e7, lang, fallback) {
  fallback = fallback ?? t3("action_error", lang);
  if (typeof e7 === "string") return e7;
  if (typeof e7 !== "object" || e7 === null) return fallback;
  const err = e7;
  const raw = err.message || err.error?.message || "";
  if (!raw) return fallback;
  const parsed = _parse(raw);
  const field = parsed.field ? _label(parsed.field, lang) : "";
  const tpl = (key) => t3(key, lang).replace("{field}", field).replace("{n}", parsed.param ?? "");
  switch (parsed.rule) {
    case "too_long":
      return tpl("err_too_long");
    case "too_short":
      return tpl("err_too_short");
    case "value_too_high":
      return tpl("err_value_too_high");
    case "value_too_low":
      return tpl("err_value_too_low");
    case "required":
      return tpl("err_required");
    case "wrong_type":
      return tpl("err_wrong_type").replace("{type}", parsed.param ?? "");
    case "invalid_choice":
      return tpl("err_invalid_choice");
    case "invalid_value":
      return tpl("err_invalid_value");
    default:
      return raw || fallback;
  }
}
var FIELD_LABEL_KEYS;
var init_ws_errors = __esm({
  "ws-errors.ts"() {
    "use strict";
    init_styles();
    FIELD_LABEL_KEYS = {
      entry_id: "object",
      name: "name",
      task_type: "maintenance_type",
      schedule_type: "schedule_type",
      interval_days: "interval_days",
      interval_anchor: "interval_anchor",
      warning_days: "warning_days",
      last_performed: "last_performed_optional",
      notes: "notes_optional",
      documentation_url: "documentation_url_optional",
      custom_icon: "custom_icon_optional",
      nfc_tag_id: "nfc_tag_id_optional",
      responsible_user_id: "responsible_user",
      entity_slug: "entity_slug",
      entity_id: "entity_id",
      area_id: "area_id_optional",
      manufacturer: "manufacturer_optional",
      model: "model_optional",
      serial_number: "serial_number_optional",
      installation_date: "installation_date_optional",
      warranty_expiry: "warranty_expiry_optional",
      checklist: "checklist_steps_optional",
      reason: "reason",
      feedback: "feedback",
      cost: "cost",
      duration: "duration",
      description: "description_optional",
      group_name: "name",
      group_description: "description_optional",
      environmental_entity: "environmental_entity_optional",
      environmental_attribute: "environmental_attribute_optional",
      trigger_above: "trigger_above",
      trigger_below: "trigger_below",
      trigger_equals: "trigger_equals",
      trigger_not_equals: "trigger_not_equals",
      trigger_for_minutes: "trigger_for_minutes"
    };
  }
});

// components/required-completion-labels.ts
var REQUIRED_COMPLETION_KEYS, REQUIRED_COMPLETION_LABELS;
var init_required_completion_labels = __esm({
  "components/required-completion-labels.ts"() {
    "use strict";
    REQUIRED_COMPLETION_KEYS = ["notes", "cost", "duration", "photo", "user"];
    REQUIRED_COMPLETION_LABELS = {
      notes: "notes_label",
      cost: "cost",
      duration: "duration",
      photo: "photo_label",
      user: "user_label"
    };
  }
});

// components/complete-dialog.ts
var MaintenanceCompleteDialog;
var init_complete_dialog = __esm({
  "components/complete-dialog.ts"() {
    "use strict";
    init_lit();
    init_decorators();
    init_styles();
    init_ws_errors();
    init_shared_parts();
    init_required_completion_labels();
    MaintenanceCompleteDialog = class extends i4 {
      constructor() {
        super(...arguments);
        this.entryId = "";
        this.taskId = "";
        this.taskName = "";
        this.lang = "en";
        this.checklist = [];
        this.adaptiveEnabled = false;
        this.taskType = "";
        this.readingUnit = "";
        this.restockDefault = null;
        this.restockUnitCost = null;
        this.currencySymbol = "";
        this.parts = [];
        this.consumesParts = [];
        this.consumesInfo = [];
        this.requiredFields = [];
        this._open = false;
        this._notes = "";
        this._cost = "";
        this._duration = "";
        this._loading = false;
        this._error = "";
        this._checklistState = {};
        this._feedback = "needed";
        this._photoDocId = "";
        this._photoPreview = "";
        this._photoUploading = false;
        this._readingValue = "";
        this._restockQty = "";
        this._completedAt = "";
        this._usedParts = {};
        this.checklistPrefill = {};
      }
      open() {
        if (this._open) return;
        this._open = true;
        this._notes = "";
        this._cost = "";
        this._duration = "";
        this._error = "";
        this._checklistState = Object.fromEntries(
          this.checklist.map((item, i6) => [String(i6), !!this.checklistPrefill[item]]).filter(([, done]) => done)
        );
        this._feedback = "needed";
        this._photoDocId = "";
        this._photoPreview = "";
        this._photoUploading = false;
        this._readingValue = "";
        this._restockQty = this.restockDefault !== null ? String(this.restockDefault) : "";
        this._completedAt = "";
        this._usedParts = Object.fromEntries(this.consumesParts.map((l3) => [partLinkKey(l3), { ...l3 }]));
      }
      _toggleCheck(idx) {
        const key = String(idx);
        this._checklistState = {
          ...this._checklistState,
          [key]: !this._checklistState[key]
        };
      }
      _setFeedback(value) {
        this._feedback = value;
      }
      async _onPhotoInput(e7) {
        const input = e7.target;
        const file = input.files?.[0];
        input.value = "";
        if (!file) return;
        this._photoUploading = true;
        this._error = "";
        try {
          const form = new FormData();
          form.append("entry_id", this.entryId);
          form.append("tags", "photo");
          form.append("file", file, file.name);
          const resp = await fetch("/api/maintenance_supporter/document/upload", {
            method: "POST",
            headers: { Authorization: `Bearer ${this.hass.auth?.data?.access_token ?? ""}` },
            body: form
          });
          if (!resp.ok) {
            this._error = resp.status === 413 ? t3("doc_too_large", this.lang) : t3("doc_upload_failed", this.lang);
            return;
          }
          const doc = await resp.json();
          if (doc.id) {
            this._photoDocId = doc.id;
            this._photoPreview = URL.createObjectURL(file);
          }
        } catch {
          this._error = t3("doc_upload_failed", this.lang);
        } finally {
          this._photoUploading = false;
        }
      }
      _removePhoto() {
        if (this._photoPreview) URL.revokeObjectURL(this._photoPreview);
        this._photoDocId = "";
        this._photoPreview = "";
      }
      async _complete() {
        this._loading = true;
        this._error = "";
        try {
          const data = {
            type: "maintenance_supporter/task/complete",
            entry_id: this.entryId,
            task_id: this.taskId
          };
          if (this._notes) data.notes = this._notes;
          if (this._cost) {
            const cost = parseFloat(this._cost);
            if (!isNaN(cost) && cost >= 0) data.cost = cost;
          }
          if (this._duration) {
            const dur = parseInt(this._duration, 10);
            if (!isNaN(dur) && dur >= 0) data.duration = dur;
          }
          if (this.checklist.length > 0) {
            data.checklist_state = this._checklistState;
          }
          if (this.adaptiveEnabled) {
            data.feedback = this._feedback;
          }
          if (this._photoDocId) {
            data.photo_doc_id = this._photoDocId;
          }
          if (this._completedAt) {
            if (new Date(this._completedAt).getTime() > Date.now()) {
              this._error = t3("completed_at_future_error", this.lang);
              this._loading = false;
              return;
            }
            data.completed_at = this._completedAt.length === 16 ? `${this._completedAt}:00` : this._completedAt;
          }
          if (this._readingValue !== "") {
            const rv = parseFloat(this._readingValue);
            if (!isNaN(rv)) data.reading_value = rv;
          }
          if (this.restockDefault !== null && this._restockQty !== "") {
            const rq = parseFloat(this._restockQty);
            if (!isNaN(rq) && rq >= 1) data.restock_quantity = rq;
          }
          if (this.parts.length > 0) {
            data.used_parts = Object.values(this._usedParts).filter((l3) => Number.isFinite(l3.quantity) && l3.quantity > 0).map(
              (l3) => l3.entry_id ? { part_id: l3.part_id, quantity: l3.quantity, entry_id: l3.entry_id } : { part_id: l3.part_id, quantity: l3.quantity }
            );
          }
          await this.hass.connection.sendMessagePromise(data);
          this._open = false;
          this.dispatchEvent(new CustomEvent("task-completed"));
        } catch (e7) {
          this._error = describeWsError(e7, this.lang, t3("save_error", this.lang));
        } finally {
          this._loading = false;
        }
      }
      /** Required details the user has not supplied yet (drives Save + markers). */
      get _missingRequired() {
        const filled = {
          notes: this._notes.trim() !== "",
          cost: this._cost.trim() !== "",
          duration: this._duration.trim() !== "",
          photo: this._photoDocId !== "",
          // "Who did it" is filled in server-side from the authenticated
          // connection (websocket/tasks_actions.py), so the dialog satisfies it
          // as long as we ARE a logged-in user. Claiming it is always satisfied
          // was how a task requiring "user" ended up unclosable: Save stayed
          // enabled and the backend rejected the completion every time.
          user: !!this.hass?.user
        };
        return this.requiredFields.filter((f3) => !filled[f3]);
      }
      /** Marker appended to a required field's label. */
      _req(field) {
        return this.requiredFields.includes(field) ? b2`<span class="req-mark" aria-hidden="true">*</span>` : A;
      }
      /** #104 follow-up: suggested cost derived from the parts this completion
       *  touches — the SELECTED "parts used" (qty × each part's unit cost) on a
       *  consuming task, or restock qty × unit cost on a buy task. Null when no
       *  involved part carries a price. Follows the live selection, so ticking
       *  a part off updates the suggestion. */
      _partsCostSuggestion() {
        if (this.restockDefault !== null) {
          const qty = parseFloat(this._restockQty);
          if (this.restockUnitCost == null || !Number.isFinite(qty) || qty <= 0) return null;
          return Math.round(this.restockUnitCost * qty * 100) / 100;
        }
        if (!this.parts.length) return null;
        let sum = 0;
        let priced = false;
        for (const link of Object.values(this._usedParts)) {
          const def = this.parts.find(
            (pt) => partLinkKey({ part_id: pt.id, entry_id: pt.entry_id }) === partLinkKey(link)
          );
          if (def?.cost != null) {
            sum += def.cost * (link.quantity || 1);
            priced = true;
          }
        }
        return priced ? Math.round(sum * 100) / 100 : null;
      }
      /** The one-click "use ≈ X from parts" chip under the cost field. Hidden
       *  once the user typed a cost themselves — a suggestion, never an
       *  overwrite. */
      _renderCostSuggestion(L2) {
        if (this._cost.trim() !== "") return A;
        const suggestion = this._partsCostSuggestion();
        if (suggestion == null || suggestion <= 0) return A;
        const amount = `${suggestion.toFixed(2)}${this.currencySymbol ? ` ${this.currencySymbol}` : ""}`;
        return b2`<button
      type="button"
      class="cost-suggestion"
      @click=${() => this._cost = suggestion.toFixed(2)}
    >${t3("cost_from_parts", L2).replace("{amount}", amount)}</button>`;
      }
      _close() {
        this._open = false;
      }
      render() {
        if (!this._open) return b2``;
        const L2 = this.lang || this.hass?.language || "en";
        return b2`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${t3("complete_title", L2)}${this.taskName}</div>
        <div class="content">
          ${this._error ? b2`<div class="error">${this._error}</div>` : A}
          ${this.checklist.length > 0 ? b2`
            <div class="checklist-section">
              <label class="checklist-label">${t3("checklist", L2)}</label>
              ${this.checklist.map((item, idx) => b2`
                <label class="checklist-item" @click=${() => this._toggleCheck(idx)}>
                  <input type="checkbox" .checked=${!!this._checklistState[String(idx)]} />
                  <span>${item}</span>
                </label>
              `)}
            </div>
          ` : A}
          ${this.taskType === "reading" ? b2`
              <label class="field">
                <span class="field-label">${t3("reading_value_label", L2)}${this.readingUnit ? ` (${this.readingUnit})` : ""}</span>
                <input type="number" step="any" class="field-input"
                  .value=${this._readingValue}
                  @input=${(e7) => this._readingValue = e7.target.value} />
              </label>` : A}
          ${this.parts.length ? b2`<div class="used-parts">
                <span class="field-label">${t3("complete_parts_used", L2)}</span>
                ${this.parts.map((pt) => {
          const key = partLinkKey({ part_id: pt.id, entry_id: pt.entry_id });
          const link = this._usedParts[key];
          const checked = link !== void 0;
          const base = pt.entry_id ? { part_id: pt.id, quantity: 1, entry_id: pt.entry_id } : { part_id: pt.id, quantity: 1 };
          return b2`<div class="used-part-row">
                    <label class="used-part-check">
                      <input type="checkbox" .checked=${checked}
                        @change=${(e7) => {
            const next = { ...this._usedParts };
            if (e7.target.checked) next[key] = next[key] || base;
            else delete next[key];
            this._usedParts = next;
          }} />
                      <span
                        >${pt.name}${pt.owner_name ? b2`<span class="used-part-owner"> (${pt.owner_name})</span>` : A}${pt.stock !== null && pt.stock !== void 0 ? ` (${pt.stock}${pt.unit ? " " + pt.unit : ""})` : ""}</span
                      >
                    </label>
                    ${checked ? b2`<input class="used-part-qty" type="number" min="0.01" max="999" step="0.01"
                          .value=${String(link.quantity)}
                          @input=${(e7) => {
            const v2 = parseFloat(e7.target.value);
            this._usedParts = {
              ...this._usedParts,
              [key]: { ...base, quantity: Number.isFinite(v2) && v2 >= 0.01 ? v2 : 1 }
            };
          }} />` : A}
                  </div>`;
        })}
              </div>` : this.consumesInfo.length ? b2`<div class="consumes-hint">
                  ${this.consumesInfo.map((line) => b2`<div>${line}</div>`)}
                </div>` : A}
          ${this.restockDefault !== null ? b2`
              <label class="field">
                <span class="field-label">${t3("restock_quantity_label", L2)}</span>
                <input type="number" step="0.01" min="0.01" class="field-input"
                  .value=${this._restockQty}
                  @input=${(e7) => this._restockQty = e7.target.value} />
              </label>` : A}
          <!-- Native <input>s rather than <ha-textfield>: when this dialog
               is opened from a Lovelace card via dialog-mount, ha-textfield
               isn't yet registered (HA loads it lazily when its own panels
               need it) so the elements render with zero height and the user
               only sees the title + Cancel/Complete buttons — the original
               bug report. Native inputs always render. -->
          <label class="field">
            <span class="field-label">${t3("notes_optional", L2)}${this._req("notes")}</span>
            <input type="text" class="field-input"
              .value=${this._notes}
              @input=${(e7) => this._notes = e7.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${t3("cost_optional", L2)}${this._req("cost")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._cost}
              @input=${(e7) => this._cost = e7.target.value} />
            ${this._renderCostSuggestion(L2)}
          </label>
          <label class="field">
            <span class="field-label">${t3("duration_minutes", L2)}${this._req("duration")}</span>
            <input type="number" step="0.01" min="0" class="field-input"
              .value=${this._duration}
              @input=${(e7) => this._duration = e7.target.value} />
          </label>
          <label class="field">
            <span class="field-label">${t3("completed_at_optional", L2)}</span>
            <input type="datetime-local" class="field-input"
              max=${new Date(Date.now() - (/* @__PURE__ */ new Date()).getTimezoneOffset() * 6e4).toISOString().slice(0, 16)}
              .value=${this._completedAt}
              @change=${(e7) => this._completedAt = e7.target.value} />
          </label>
          <div class="field">
            <span class="field-label">${t3("completion_photo_optional", L2)}${this._req("photo")}</span>
            ${this._photoPreview ? b2`
                <div class="photo-preview">
                  <img src=${this._photoPreview} alt="" />
                  <button type="button" class="photo-remove" @click=${this._removePhoto}
                    title="${t3("remove", L2)}">✕</button>
                </div>` : b2`
                <label class="photo-pick">
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <span>${this._photoUploading ? t3("uploading", L2) : t3("add_photo", L2)}</span>
                  <input type="file" accept="image/*" capture="environment"
                    ?disabled=${this._photoUploading}
                    @change=${this._onPhotoInput} />
                </label>`}
          </div>
          ${this.adaptiveEnabled ? b2`
            <div class="feedback-section">
              <label class="feedback-label">${t3("was_maintenance_needed", L2)}</label>
              <div class="feedback-buttons">
                <button
                  class="feedback-btn ${this._feedback === "needed" ? "selected" : ""}"
                  @click=${() => this._setFeedback("needed")}
                >${t3("feedback_needed", L2)}</button>
                <button
                  class="feedback-btn ${this._feedback === "not_needed" ? "selected" : ""}"
                  @click=${() => this._setFeedback("not_needed")}
                >${t3("feedback_not_needed", L2)}</button>
                <button
                  class="feedback-btn ${this._feedback === "not_sure" ? "selected" : ""}"
                  @click=${() => this._setFeedback("not_sure")}
                >${t3("feedback_not_sure", L2)}</button>
              </div>
            </div>
          ` : A}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${t3("cancel", L2)}
          </ha-button>
          <ha-button
            @click=${this._complete}
            .disabled=${this._loading || this._missingRequired.length > 0}
            title=${this._missingRequired.length ? this._missingRequired.map((f3) => t3("err_required", L2).replace("{field}", t3(REQUIRED_COMPLETION_LABELS[f3] ?? f3, L2))).join(" \xB7 ") : ""}
          >
            ${this._loading ? t3("completing", L2) : t3("complete", L2)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
      }
    };
    MaintenanceCompleteDialog.styles = [nativeFieldStyles, i`
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
  `];
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceCompleteDialog.prototype, "hass", 2);
    __decorateClass([
      n4()
    ], MaintenanceCompleteDialog.prototype, "entryId", 2);
    __decorateClass([
      n4()
    ], MaintenanceCompleteDialog.prototype, "taskId", 2);
    __decorateClass([
      n4()
    ], MaintenanceCompleteDialog.prototype, "taskName", 2);
    __decorateClass([
      n4()
    ], MaintenanceCompleteDialog.prototype, "lang", 2);
    __decorateClass([
      n4({ type: Array })
    ], MaintenanceCompleteDialog.prototype, "checklist", 2);
    __decorateClass([
      n4({ type: Boolean })
    ], MaintenanceCompleteDialog.prototype, "adaptiveEnabled", 2);
    __decorateClass([
      n4()
    ], MaintenanceCompleteDialog.prototype, "taskType", 2);
    __decorateClass([
      n4()
    ], MaintenanceCompleteDialog.prototype, "readingUnit", 2);
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceCompleteDialog.prototype, "restockDefault", 2);
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceCompleteDialog.prototype, "restockUnitCost", 2);
    __decorateClass([
      n4()
    ], MaintenanceCompleteDialog.prototype, "currencySymbol", 2);
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceCompleteDialog.prototype, "parts", 2);
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceCompleteDialog.prototype, "consumesParts", 2);
    __decorateClass([
      n4({ type: Array })
    ], MaintenanceCompleteDialog.prototype, "consumesInfo", 2);
    __decorateClass([
      n4({ type: Array })
    ], MaintenanceCompleteDialog.prototype, "requiredFields", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_open", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_notes", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_cost", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_duration", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_loading", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_error", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_checklistState", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_feedback", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_photoDocId", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_photoPreview", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_photoUploading", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_readingValue", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_restockQty", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_completedAt", 2);
    __decorateClass([
      r5()
    ], MaintenanceCompleteDialog.prototype, "_usedParts", 2);
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceCompleteDialog.prototype, "checklistPrefill", 2);
    if (!customElements.get("maintenance-complete-dialog")) {
      customElements.define("maintenance-complete-dialog", MaintenanceCompleteDialog);
    }
  }
});

// components/ms-textfield.ts
var MsTextfield;
var init_ms_textfield = __esm({
  "components/ms-textfield.ts"() {
    "use strict";
    init_lit();
    init_decorators();
    MsTextfield = class extends i4 {
      constructor() {
        super(...arguments);
        this.label = "";
        this.value = "";
        this.placeholder = "";
        this.type = "text";
        this.required = false;
        this.disabled = false;
      }
      /** Forwards the native input's value into our `value` property and
       *  re-fires as a bubbling `input` event so consumers reading
       *  `(e.target as HTMLInputElement).value` still work — that's the
       *  pattern used everywhere ha-textfield was. */
      _onInput(e7) {
        const v2 = e7.target.value;
        this.value = v2;
        this.dispatchEvent(
          new CustomEvent("input", { bubbles: true, composed: true, detail: { value: v2 } })
        );
      }
      render() {
        return b2`
      <label class="field">
        ${this.label ? b2`<span class="label">${this.label}${this.required ? b2`<span class="req">*</span>` : A}</span>` : A}
        <input
          .value=${this.value ?? ""}
          .type=${this.type}
          ?required=${this.required}
          ?disabled=${this.disabled}
          placeholder=${this.placeholder}
          step=${this.step ?? A}
          min=${this.min ?? A}
          max=${this.max ?? A}
          pattern=${this.pattern ?? A}
          @input=${this._onInput}
          @change=${this._onInput}
        />
        ${this.helper ? b2`<span class="helper">${this.helper}</span>` : A}
      </label>
    `;
      }
    };
    MsTextfield.styles = i`
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
  `;
    __decorateClass([
      n4()
    ], MsTextfield.prototype, "label", 2);
    __decorateClass([
      n4()
    ], MsTextfield.prototype, "value", 2);
    __decorateClass([
      n4()
    ], MsTextfield.prototype, "placeholder", 2);
    __decorateClass([
      n4()
    ], MsTextfield.prototype, "type", 2);
    __decorateClass([
      n4({ type: Boolean })
    ], MsTextfield.prototype, "required", 2);
    __decorateClass([
      n4({ type: Boolean })
    ], MsTextfield.prototype, "disabled", 2);
    __decorateClass([
      n4()
    ], MsTextfield.prototype, "step", 2);
    __decorateClass([
      n4()
    ], MsTextfield.prototype, "min", 2);
    __decorateClass([
      n4()
    ], MsTextfield.prototype, "max", 2);
    __decorateClass([
      n4()
    ], MsTextfield.prototype, "pattern", 2);
    __decorateClass([
      n4()
    ], MsTextfield.prototype, "helper", 2);
    if (!customElements.get("ms-textfield")) {
      customElements.define("ms-textfield", MsTextfield);
    }
  }
});

// components/object-dialog.ts
var MaintenanceObjectDialog;
var init_object_dialog = __esm({
  "components/object-dialog.ts"() {
    "use strict";
    init_lit();
    init_decorators();
    init_styles();
    init_ws_errors();
    init_ms_textfield();
    MaintenanceObjectDialog = class extends i4 {
      constructor() {
        super(...arguments);
        this.objects = [];
        this._open = false;
        this._loading = false;
        this._error = "";
        this._name = "";
        this._manufacturer = "";
        this._model = "";
        this._serialNumber = "";
        this._areaId = "";
        this._installationDate = "";
        this._warrantyExpiry = "";
        this._documentationUrl = "";
        this._notes = "";
        this._haDeviceId = "";
        this._parentEntryId = "";
        this._entryId = null;
      }
      // null = create, string = update
      get _lang() {
        return langOf(this.hass);
      }
      openCreate() {
        this._entryId = null;
        this._name = "";
        this._manufacturer = "";
        this._model = "";
        this._serialNumber = "";
        this._areaId = "";
        this._installationDate = "";
        this._warrantyExpiry = "";
        this._documentationUrl = "";
        this._notes = "";
        this._haDeviceId = "";
        this._parentEntryId = "";
        this._error = "";
        this._open = true;
      }
      openEdit(entryId, obj) {
        this._entryId = entryId;
        this._name = obj.name || "";
        this._manufacturer = obj.manufacturer || "";
        this._model = obj.model || "";
        this._serialNumber = obj.serial_number || "";
        this._areaId = obj.area_id || "";
        this._installationDate = obj.installation_date || "";
        this._warrantyExpiry = obj.warranty_expiry || "";
        this._documentationUrl = obj.documentation_url || "";
        this._notes = obj.notes || "";
        this._haDeviceId = obj.ha_device_id || "";
        this._parentEntryId = obj.parent_entry_id || "";
        this._error = "";
        this._open = true;
      }
      async _save() {
        if (this._loading) return;
        if (!this._name.trim()) return;
        this._loading = true;
        this._error = "";
        try {
          if (this._entryId) {
            await this.hass.connection.sendMessagePromise({
              type: "maintenance_supporter/object/update",
              entry_id: this._entryId,
              name: this._name,
              manufacturer: this._manufacturer || null,
              model: this._model || null,
              serial_number: this._serialNumber || null,
              area_id: this._areaId || null,
              installation_date: this._installationDate || null,
              warranty_expiry: this._warrantyExpiry || null,
              documentation_url: this._documentationUrl.trim() || null,
              notes: this._notes.trim() || null,
              ha_device_id: this._haDeviceId || null,
              parent_entry_id: this._parentEntryId || null
            });
          } else {
            await this.hass.connection.sendMessagePromise({
              type: "maintenance_supporter/object/create",
              name: this._name,
              manufacturer: this._manufacturer || null,
              model: this._model || null,
              serial_number: this._serialNumber || null,
              area_id: this._areaId || null,
              installation_date: this._installationDate || null,
              warranty_expiry: this._warrantyExpiry || null,
              documentation_url: this._documentationUrl.trim() || null,
              notes: this._notes.trim() || null,
              ha_device_id: this._haDeviceId || null,
              parent_entry_id: this._parentEntryId || null
            });
          }
          this._open = false;
          this.dispatchEvent(new CustomEvent("object-saved"));
        } catch (e7) {
          this._error = describeWsError(e7, this._lang, t3("save_error", this._lang));
        } finally {
          this._loading = false;
        }
      }
      _parentChoices() {
        return (this.objects || []).filter((o7) => o7.entry_id !== this._entryId);
      }
      _close() {
        this._open = false;
      }
      render() {
        if (!this._open) return b2``;
        const L2 = this._lang;
        const title = this._entryId ? t3("edit_object", L2) : t3("new_object", L2);
        return b2`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${title}</div>
        <div class="content">
          ${this._error ? b2`<div class="error">${this._error}</div>` : A}
          <ms-textfield
            label="${t3("name", L2)}"
            required
            .value=${this._name}
            @input=${(e7) => this._name = e7.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${t3("manufacturer_optional", L2)}"
            .value=${this._manufacturer}
            @input=${(e7) => this._manufacturer = e7.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${t3("model_optional", L2)}"
            .value=${this._model}
            @input=${(e7) => this._model = e7.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${t3("serial_number_optional", L2)}"
            .value=${this._serialNumber}
            @input=${(e7) => this._serialNumber = e7.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${t3("documentation_url_optional", L2)}"
            type="url"
            .value=${this._documentationUrl}
            @input=${(e7) => this._documentationUrl = e7.target.value}
          ></ms-textfield>
          <ha-area-picker
            .hass=${this.hass}
            label="${t3("area_id_optional", L2)}"
            .value=${this._areaId}
            @value-changed=${(e7) => this._areaId = e7.detail.value || ""}
          ></ha-area-picker>
          <ms-textfield
            label="${t3("installation_date_optional", L2)}"
            type="date"
            .value=${this._installationDate}
            @input=${(e7) => this._installationDate = e7.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${t3("warranty_expiry_optional", L2)}"
            type="date"
            .value=${this._warrantyExpiry}
            @input=${(e7) => this._warrantyExpiry = e7.target.value}
          ></ms-textfield>
          <ha-form
            .hass=${this.hass}
            .data=${{ device: this._haDeviceId || void 0 }}
            .schema=${[{ name: "device", selector: { device: {} } }]}
            .computeLabel=${() => t3("link_device_optional", L2)}
            @value-changed=${(e7) => this._haDeviceId = e7.detail.value?.device || ""}
          ></ha-form>
          ${this._parentChoices().length ? b2`<label class="textarea-field">
                <span class="textarea-label">${t3("parent_object_optional", L2)}</span>
                <select
                  class="parent-select"
                  .value=${this._parentEntryId}
                  @change=${(e7) => this._parentEntryId = e7.target.value}
                >
                  <option value="" ?selected=${!this._parentEntryId}>
                    ${t3("parent_none", L2)}
                  </option>
                  ${this._parentChoices().map(
          (o7) => b2`<option
                      value=${o7.entry_id}
                      ?selected=${this._parentEntryId === o7.entry_id}
                    >${o7.object.name}</option>`
        )}
                </select>
              </label>` : A}
          <label class="textarea-field">
            <span class="textarea-label">${t3("object_notes_optional", L2)}</span>
            <textarea
              rows="3"
              .value=${this._notes}
              @input=${(e7) => this._notes = e7.target.value}
            ></textarea>
          </label>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${t3("cancel", this._lang)}
          </ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading || !this._name.trim()}
          >
            ${this._loading ? t3("saving", this._lang) : t3("save", this._lang)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
      }
    };
    MaintenanceObjectDialog.styles = i`
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
  `;
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceObjectDialog.prototype, "hass", 2);
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceObjectDialog.prototype, "objects", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_open", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_loading", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_error", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_name", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_manufacturer", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_model", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_serialNumber", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_areaId", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_installationDate", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_warrantyExpiry", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_documentationUrl", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_notes", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_haDeviceId", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_parentEntryId", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectDialog.prototype, "_entryId", 2);
    if (!customElements.get("maintenance-object-dialog")) {
      customElements.define("maintenance-object-dialog", MaintenanceObjectDialog);
    }
  }
});

// helpers/trigger-domains.ts
var TRIGGER_PICKER_DOMAINS, ENVIRONMENTAL_PICKER_DOMAINS, ENVIRONMENTAL_PICKER_DEVICE_CLASSES;
var init_trigger_domains = __esm({
  "helpers/trigger-domains.ts"() {
    "use strict";
    TRIGGER_PICKER_DOMAINS = [
      "sensor",
      "binary_sensor",
      "number",
      "input_number",
      "input_boolean",
      "switch",
      "climate",
      "vacuum",
      "cover",
      "fan",
      "light",
      "water_heater",
      "humidifier",
      "media_player",
      "weather",
      "air_quality",
      "valve",
      "lawn_mower",
      "lock"
    ];
    ENVIRONMENTAL_PICKER_DOMAINS = ["sensor"];
    ENVIRONMENTAL_PICKER_DEVICE_CLASSES = ["temperature", "humidity", "pressure"];
  }
});

// components/task-dialog.ts
function emptyCondition() {
  return {
    entityIds: "",
    type: "threshold",
    attribute: "",
    above: "",
    below: "",
    equals: "",
    notEquals: "",
    forMinutes: "0",
    targetValue: "",
    deltaMode: false,
    fromState: "",
    toState: "",
    targetChanges: "",
    runtimeHours: "",
    onStates: "",
    carry: {}
  };
}
function conditionToDraft(c4) {
  const ids = c4.entity_ids || (c4.entity_id ? [c4.entity_id] : []);
  return {
    entityIds: ids.join(", "),
    type: c4.type || "threshold",
    attribute: c4.attribute || "",
    above: c4.trigger_above?.toString() ?? "",
    below: c4.trigger_below?.toString() ?? "",
    equals: c4.trigger_equals?.toString() ?? "",
    notEquals: c4.trigger_not_equals?.toString() ?? "",
    forMinutes: c4.trigger_for_minutes?.toString() ?? "0",
    targetValue: c4.trigger_target_value?.toString() ?? "",
    deltaMode: c4.trigger_delta_mode || false,
    fromState: c4.trigger_from_state || "",
    toState: c4.trigger_to_state || "",
    targetChanges: c4.trigger_target_changes?.toString() ?? "",
    runtimeHours: c4.trigger_runtime_hours?.toString() ?? "",
    onStates: (c4.trigger_on_states || []).join(", "),
    carry: Object.fromEntries(
      Object.entries(c4).filter(([k2]) => !MANAGED_CONDITION_KEYS.has(k2) && !k2.startsWith("_"))
    )
  };
}
function draftToCondition(d3) {
  const ids = d3.entityIds.split(",").map((s4) => s4.trim()).filter(Boolean);
  if (ids.length === 0) return null;
  const c4 = { ...d3.carry || {}, entity_id: ids[0], entity_ids: ids, type: d3.type };
  if (d3.attribute) c4.attribute = d3.attribute;
  if (d3.type === "threshold") {
    const a3 = parseFloat(d3.above);
    if (!isNaN(a3)) c4.trigger_above = a3;
    const b3 = parseFloat(d3.below);
    if (!isNaN(b3)) c4.trigger_below = b3;
    const eq = parseFloat(d3.equals);
    if (!isNaN(eq)) c4.trigger_equals = eq;
    const ne = parseFloat(d3.notEquals);
    if (!isNaN(ne)) c4.trigger_not_equals = ne;
    const f3 = parseInt(d3.forMinutes, 10);
    if (!isNaN(f3)) c4.trigger_for_minutes = f3;
  } else if (d3.type === "counter") {
    const v2 = parseFloat(d3.targetValue);
    if (!isNaN(v2)) c4.trigger_target_value = v2;
    c4.trigger_delta_mode = d3.deltaMode;
  } else if (d3.type === "state_change") {
    if (d3.fromState) c4.trigger_from_state = d3.fromState;
    if (d3.toState) c4.trigger_to_state = d3.toState;
    const n5 = parseInt(d3.targetChanges, 10);
    if (!isNaN(n5)) c4.trigger_target_changes = n5;
  } else if (d3.type === "runtime") {
    const h3 = parseFloat(d3.runtimeHours);
    if (!isNaN(h3)) c4.trigger_runtime_hours = h3;
    const on = (d3.onStates || "").split(",").map((s4) => s4.trim()).filter(Boolean);
    if (on.length > 0) c4.trigger_on_states = on;
  }
  return c4;
}
function weekdayNames(lang) {
  return Array.from({ length: 7 }, (_2, i6) => weekdayName(i6, lang, "short"));
}
function monthNames(lang) {
  const fmt = new Intl.DateTimeFormat(lang || "en", { month: "short" });
  return Array.from({ length: 12 }, (_2, i6) => fmt.format(new Date(2021, i6, 1)));
}
var MAINTENANCE_TYPE_KEYS, PRIORITY_KEYS, SCHEDULE_TYPE_KEYS, CALENDAR_KINDS, TRIGGER_TYPE_KEYS, TRIGGER_TYPE_KEYS_WITH_COMPOUND, ADAPTIVE_DEFAULTS, MANAGED_CONDITION_KEYS, _MaintenanceTaskDialog, MaintenanceTaskDialog;
var init_task_dialog = __esm({
  "components/task-dialog.ts"() {
    "use strict";
    init_lit();
    init_decorators();
    init_styles();
    init_user_service();
    init_shared_parts();
    init_trigger_domains();
    init_ws_errors();
    init_required_completion_labels();
    init_ms_textfield();
    MAINTENANCE_TYPE_KEYS = ["cleaning", "inspection", "replacement", "calibration", "service", "reading", "custom"];
    PRIORITY_KEYS = ["low", "normal", "high"];
    SCHEDULE_TYPE_KEYS = ["time_based", "weekdays", "nth_weekday", "day_of_month", "sensor_based", "one_time", "manual"];
    CALENDAR_KINDS = ["weekdays", "nth_weekday", "day_of_month"];
    TRIGGER_TYPE_KEYS = ["threshold", "counter", "state_change", "runtime"];
    TRIGGER_TYPE_KEYS_WITH_COMPOUND = [...TRIGGER_TYPE_KEYS, "compound"];
    ADAPTIVE_DEFAULTS = { alpha: "0.3", min: "7", max: "365" };
    MANAGED_CONDITION_KEYS = /* @__PURE__ */ new Set([
      "entity_id",
      "entity_ids",
      "type",
      "attribute",
      "trigger_above",
      "trigger_below",
      "trigger_equals",
      "trigger_not_equals",
      "trigger_for_minutes",
      "trigger_target_value",
      "trigger_delta_mode",
      "trigger_from_state",
      "trigger_to_state",
      "trigger_target_changes",
      "trigger_runtime_hours",
      "trigger_on_states"
    ]);
    _MaintenanceTaskDialog = class _MaintenanceTaskDialog extends i4 {
      constructor() {
        super(...arguments);
        this.checklistsEnabled = false;
        this.scheduleTimeEnabled = false;
        this.completionActionsEnabled = false;
        this.defaultWarningDays = 7;
        this.parts = [];
        this._foreignOwners = [];
        this._open = false;
        this._entityPickerFallback = false;
        this._pickerProbeStrikes = 0;
        this._loading = false;
        this._error = "";
        this._entryId = "";
        this._taskId = null;
        this._objectChoices = [];
        this._name = "";
        this._type = "custom";
        this._scheduleType = "time_based";
        this._intervalDays = "30";
        this._intervalUnit = "days";
        this._dueDate = "";
        this._warningDays = "7";
        this._earliestCompletionDays = "";
        this._intervalAnchor = "completion";
        this._weekdays = [];
        this._nth = "1";
        this._nthWeekday = "5";
        this._domDay = "1";
        this._domLastDay = false;
        this._domBusiness = false;
        this._calOffset = "0";
        this._seasonMonths = [];
        this._endsMode = "never";
        this._endsCount = "";
        this._endsUntil = "";
        this._schedulePreview = [];
        this._schedulePreviewEnded = false;
        this._previewSeq = 0;
        this._notes = "";
        this._documentationUrl = "";
        this._customIcon = "";
        this._priority = "normal";
        this._labels = "";
        this._enabled = true;
        this._triggerEntityId = "";
        this._triggerEntityIds = [];
        this._triggerEntityLogic = "any";
        this._triggerAttribute = "";
        this._triggerType = "threshold";
        this._triggerAbove = "";
        this._triggerBelow = "";
        this._triggerEquals = "";
        this._triggerNotEquals = "";
        this._triggerForMinutes = "0";
        this._triggerCombinator = "any";
        this._triggerTargetValue = "";
        this._triggerDeltaMode = false;
        this._triggerBaselineValue = "";
        this._liveBaselineValue = null;
        this._autoCompleteOnRecovery = false;
        this._triggerFromState = "";
        this._triggerToState = "";
        this._triggerTargetChanges = "";
        this._triggerRuntimeHours = "";
        this._triggerOnStates = "";
        this._compoundLogic = "AND";
        this._compoundConditions = [];
        this._suggestedAttributes = [];
        this._availableAttributes = [];
        this._entityDomain = "";
        this._lastPerformed = "";
        this._nfcTagId = "";
        this._readingUnit = "";
        this._consumesParts = {};
        this._partsLoadFailed = false;
        this._availableTags = [];
        this._responsibleUserId = null;
        this._assigneePool = [];
        this._rotationStrategy = "";
        this._availableUsers = [];
        this._checklistText = "";
        this._requiredCompletion = [];
        this._scheduleTime = "";
        this._actionService = "";
        this._actionTargetEntity = "";
        this._actionData = {};
        this._actionDataJsonFallback = "";
        this._actionTesting = false;
        this._actionTestResult = "";
        this._actionTestError = "";
        this._qcNotes = "";
        this._qcCost = "";
        this._qcDuration = "";
        this._qcFeedback = "";
        this._environmentalEntity = "";
        this._environmentalAttribute = "";
        this._environmentalInitial = "";
        // for change detection on save
        this._environmentalAttributeInitial = "";
        this._adaptiveEnabled = false;
        this._adaptiveAlpha = ADAPTIVE_DEFAULTS.alpha;
        this._adaptiveMin = ADAPTIVE_DEFAULTS.min;
        this._adaptiveMax = ADAPTIVE_DEFAULTS.max;
        this._adaptiveSeasonal = true;
        this._adaptivePrediction = true;
        this._adaptiveInitial = "";
        this._userService = null;
        this._conditionAttrOptions = {};
        this._conditionAttrPending = /* @__PURE__ */ new Set();
      }
      _adaptiveSnapshot() {
        return JSON.stringify([
          this._adaptiveEnabled,
          this._adaptiveAlpha,
          this._adaptiveMin,
          this._adaptiveMax,
          this._adaptiveSeasonal,
          this._adaptivePrediction
        ]);
      }
      get _lang() {
        return langOf(this.hass);
      }
      async openCreate(entryId, objects) {
        this._entryId = entryId;
        this._taskId = null;
        this._error = "";
        if (!entryId && objects && objects.length > 0) {
          this._objectChoices = objects.map((o7) => ({ entry_id: o7.entry_id, name: o7.object.name })).sort((a3, b3) => a3.name.localeCompare(b3.name));
          this._entryId = this._objectChoices[0].entry_id;
        } else {
          this._objectChoices = [];
        }
        this._resetFields();
        await Promise.all([this._loadUsers(), this._loadTags(), this._loadParts(), this._loadForeignPools()]);
        this._open = true;
      }
      async openEdit(entryId, task) {
        this._entryId = entryId;
        this._taskId = task.id;
        this._error = "";
        this._name = task.name;
        this._type = task.type;
        this._scheduleType = task.schedule_type;
        this._intervalDays = task.interval_days != null ? String(task.interval_days) : "";
        this._intervalUnit = task.interval_unit || "days";
        this._dueDate = task.due_date || "";
        const sched = task.schedule;
        this._weekdays = sched?.kind === "weekdays" ? [...sched.weekdays ?? []] : [];
        this._nth = sched?.kind === "nth_weekday" ? String(sched.nth ?? 1) : "1";
        this._nthWeekday = sched?.kind === "nth_weekday" ? String(sched.weekday ?? 5) : "5";
        this._domDay = sched?.kind === "day_of_month" && (sched.day ?? 1) >= 1 ? String(sched.day ?? 1) : "1";
        this._domLastDay = sched?.kind === "day_of_month" && sched.day === -1;
        this._domBusiness = sched?.kind === "day_of_month" && sched.business === true;
        this._calOffset = sched?.offset ? String(sched.offset) : "0";
        this._seasonMonths = Array.isArray(sched?.season_months) ? [...sched.season_months] : [];
        const ends = sched?.ends;
        if (ends && typeof ends.count === "number") {
          this._endsMode = "count";
          this._endsCount = String(ends.count);
          this._endsUntil = "";
        } else if (ends && typeof ends.until === "string") {
          this._endsMode = "until";
          this._endsUntil = ends.until;
          this._endsCount = "";
        } else {
          this._endsMode = "never";
          this._endsCount = "";
          this._endsUntil = "";
        }
        this._warningDays = task.warning_days.toString();
        this._earliestCompletionDays = task.earliest_completion_days != null ? String(task.earliest_completion_days) : "";
        this._intervalAnchor = task.interval_anchor || "completion";
        this._notes = task.notes || "";
        this._documentationUrl = task.documentation_url || "";
        this._customIcon = task.custom_icon || "";
        this._priority = task.priority || "normal";
        this._labels = (task.labels || []).join(", ");
        this._enabled = task.enabled !== false;
        this._lastPerformed = task.last_performed || "";
        this._nfcTagId = task.nfc_tag_id || "";
        this._readingUnit = task.reading_unit || "";
        this._consumesParts = Object.fromEntries(
          (task.consumes_parts || []).map((l3) => [partLinkKey(l3), { ...l3 }])
        );
        this._responsibleUserId = task.responsible_user_id || null;
        this._assigneePool = [...task.assignee_pool || []];
        this._rotationStrategy = task.rotation_strategy || "";
        this._checklistText = (task.checklist || []).join("\n");
        this._requiredCompletion = [...task.required_completion_fields || []];
        this._scheduleTime = task.schedule_time || "";
        const oca = task.on_complete_action;
        if (oca && oca.service) {
          this._actionService = oca.service;
          const tgt = oca.target?.entity_id;
          this._actionTargetEntity = Array.isArray(tgt) ? tgt[0] || "" : tgt || "";
          this._actionData = oca.data && typeof oca.data === "object" ? { ...oca.data } : {};
          this._actionDataJsonFallback = "";
        } else {
          this._actionService = "";
          this._actionTargetEntity = "";
          this._actionData = {};
          this._actionDataJsonFallback = "";
        }
        const qcd = task.quick_complete_defaults;
        this._qcNotes = qcd?.notes || "";
        this._qcCost = qcd?.cost != null ? String(qcd.cost) : "";
        this._qcDuration = qcd?.duration != null ? String(qcd.duration) : "";
        this._qcFeedback = qcd?.feedback || "";
        const ac = task.adaptive_config || {};
        this._environmentalEntity = ac.environmental_entity || "";
        this._environmentalAttribute = ac.environmental_attribute || "";
        this._environmentalInitial = this._environmentalEntity;
        this._environmentalAttributeInitial = this._environmentalAttribute;
        this._adaptiveEnabled = !!ac.enabled;
        this._adaptiveAlpha = ac.ewa_alpha?.toString() ?? ADAPTIVE_DEFAULTS.alpha;
        this._adaptiveMin = ac.min_interval_days?.toString() ?? ADAPTIVE_DEFAULTS.min;
        this._adaptiveMax = ac.max_interval_days?.toString() ?? ADAPTIVE_DEFAULTS.max;
        this._adaptiveSeasonal = ac.seasonal_enabled !== false;
        this._adaptivePrediction = ac.sensor_prediction_enabled !== false;
        this._adaptiveInitial = this._adaptiveSnapshot();
        if (task.trigger_config) {
          const tc = task.trigger_config;
          this._triggerEntityId = tc.entity_id || tc.entity_ids && tc.entity_ids[0] || "";
          this._triggerEntityIds = tc.entity_ids || (tc.entity_id ? [tc.entity_id] : []);
          this._triggerEntityLogic = tc.entity_logic || "any";
          this._triggerAttribute = tc.attribute || "";
          this._triggerType = tc.type || "threshold";
          this._triggerAbove = tc.trigger_above?.toString() || "";
          this._triggerBelow = tc.trigger_below?.toString() || "";
          this._triggerEquals = tc.trigger_equals?.toString() || "";
          this._triggerNotEquals = tc.trigger_not_equals?.toString() || "";
          this._triggerForMinutes = tc.trigger_for_minutes?.toString() || "0";
          this._triggerCombinator = tc.trigger_combinator === "all" ? "all" : "any";
          this._triggerTargetValue = tc.trigger_target_value?.toString() || "";
          this._triggerDeltaMode = tc.trigger_delta_mode || false;
          this._triggerBaselineValue = tc.trigger_baseline_value?.toString() || "";
          this._liveBaselineValue = task.trigger_baseline_value ?? null;
          this._autoCompleteOnRecovery = tc.auto_complete_on_recovery || false;
          this._triggerFromState = tc.trigger_from_state || "";
          this._triggerToState = tc.trigger_to_state || "";
          this._triggerTargetChanges = tc.trigger_target_changes?.toString() || "";
          this._triggerRuntimeHours = tc.trigger_runtime_hours?.toString() || "";
          this._triggerOnStates = (tc.trigger_on_states || []).join(", ");
          if (tc.type === "compound") {
            this._compoundLogic = tc.compound_logic === "OR" ? "OR" : "AND";
            this._compoundConditions = (tc.conditions || []).map(conditionToDraft);
          } else {
            this._compoundLogic = "AND";
            this._compoundConditions = [];
          }
        } else {
          this._resetTriggerFields();
        }
        if (this._triggerEntityId) {
          this._fetchEntityAttributes(this._triggerEntityId);
        }
        await Promise.all([this._loadUsers(), this._loadTags(), this._loadParts(), this._loadForeignPools()]);
        this._open = true;
      }
      _resetFields() {
        this._name = "";
        this._type = "custom";
        this._scheduleType = "time_based";
        this._intervalDays = "30";
        this._intervalUnit = "days";
        this._dueDate = "";
        this._warningDays = String(this.defaultWarningDays);
        this._earliestCompletionDays = "";
        this._intervalAnchor = "completion";
        this._weekdays = [];
        this._nth = "1";
        this._nthWeekday = "5";
        this._domDay = "1";
        this._domLastDay = false;
        this._domBusiness = false;
        this._calOffset = "0";
        this._seasonMonths = [];
        this._endsMode = "never";
        this._endsCount = "";
        this._endsUntil = "";
        this._notes = "";
        this._documentationUrl = "";
        this._customIcon = "";
        this._priority = "normal";
        this._labels = "";
        this._enabled = true;
        this._lastPerformed = "";
        this._nfcTagId = "";
        this._readingUnit = "";
        this._consumesParts = {};
        this._responsibleUserId = null;
        this._assigneePool = [];
        this._rotationStrategy = "";
        this._checklistText = "";
        this._requiredCompletion = [];
        this._scheduleTime = "";
        this._environmentalEntity = "";
        this._environmentalAttribute = "";
        this._environmentalInitial = "";
        this._environmentalAttributeInitial = "";
        this._adaptiveEnabled = false;
        this._adaptiveAlpha = ADAPTIVE_DEFAULTS.alpha;
        this._adaptiveMin = ADAPTIVE_DEFAULTS.min;
        this._adaptiveMax = ADAPTIVE_DEFAULTS.max;
        this._adaptiveSeasonal = true;
        this._adaptivePrediction = true;
        this._adaptiveInitial = this._adaptiveSnapshot();
        this._actionService = "";
        this._actionTargetEntity = "";
        this._actionData = {};
        this._actionDataJsonFallback = "";
        this._actionTesting = false;
        this._actionTestResult = "";
        this._qcNotes = "";
        this._qcCost = "";
        this._qcDuration = "";
        this._qcFeedback = "";
        this._resetTriggerFields();
      }
      _resetTriggerFields() {
        this._triggerEntityId = "";
        this._triggerEntityIds = [];
        this._triggerEntityLogic = "any";
        this._triggerAttribute = "";
        this._suggestedAttributes = [];
        this._availableAttributes = [];
        this._entityDomain = "";
        this._triggerType = "threshold";
        this._triggerAbove = "";
        this._triggerBelow = "";
        this._triggerEquals = "";
        this._triggerNotEquals = "";
        this._triggerForMinutes = "0";
        this._triggerCombinator = "any";
        this._triggerTargetValue = "";
        this._triggerDeltaMode = false;
        this._triggerBaselineValue = "";
        this._liveBaselineValue = null;
        this._autoCompleteOnRecovery = false;
        this._triggerFromState = "";
        this._triggerToState = "";
        this._triggerTargetChanges = "";
        this._triggerRuntimeHours = "";
        this._triggerOnStates = "";
        this._compoundLogic = "AND";
        this._compoundConditions = [];
      }
      async _loadUsers() {
        if (!this._userService) {
          this._userService = new UserService(this.hass);
        }
        try {
          this._availableUsers = await this._userService.getUsers();
        } catch (error) {
          console.error("Failed to load users:", error);
          this._availableUsers = [];
        }
      }
      _toggleAssignee(userId) {
        this._assigneePool = this._assigneePool.includes(userId) ? this._assigneePool.filter((u3) => u3 !== userId) : [...this._assigneePool, userId];
      }
      // v1.3.0: fire the configured action immediately so the user can verify
      // it works before saving the task. Doesn't persist anything.
      async _testAction() {
        const svc = this._actionService.trim();
        if (!svc || !/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(svc)) {
          this._actionTestResult = "error";
          this._actionTestError = "Invalid service format (expected 'domain.service')";
          setTimeout(() => {
            this._actionTestResult = "";
            this._actionTestError = "";
          }, 5e3);
          return;
        }
        const [domain, name] = svc.split(".");
        if (!this.hass?.services?.[domain]?.[name]) {
          this._actionTestResult = "error";
          this._actionTestError = `Service "${svc}" is not registered in Home Assistant. Check spelling and that the integration providing it is loaded.`;
          setTimeout(() => {
            this._actionTestResult = "";
            this._actionTestError = "";
          }, 8e3);
          return;
        }
        const tgt = this._actionTargetEntity.trim();
        if (tgt) {
          const entityDomain = tgt.split(".")[0];
          const crossDomainServices = /* @__PURE__ */ new Set([
            "homeassistant",
            "scene",
            "notify",
            "persistent_notification"
          ]);
          if (entityDomain !== domain && !crossDomainServices.has(domain)) {
            this._actionTestResult = "error";
            this._actionTestError = `Service "${svc}" only works on ${domain}.* entities; entity "${tgt}" is in ${entityDomain}.* \u2014 pick a service that matches the entity domain (e.g. ${entityDomain}.${name})`;
            setTimeout(() => {
              this._actionTestResult = "";
              this._actionTestError = "";
            }, 8e3);
            return;
          }
          if (!this.hass.states?.[tgt]) {
            this._actionTestResult = "error";
            this._actionTestError = `Target entity "${tgt}" not found in Home Assistant \u2014 the entity may have been renamed or its integration removed.`;
            setTimeout(() => {
              this._actionTestResult = "";
              this._actionTestError = "";
            }, 8e3);
            return;
          }
        }
        this._actionTestResult = "ok";
        setTimeout(() => {
          this._actionTestResult = "";
          this._actionTestError = "";
        }, 5e3);
      }
      // v1.3.1: derive the data dict from either the schema-driven _actionData
      // (preferred) or the JSON fallback textfield. Returns {} on any parse
      // problem so the caller still gets a usable empty object.
      _buildActionData() {
        if (this._actionDataJsonFallback.trim()) {
          try {
            const parsed = JSON.parse(this._actionDataJsonFallback);
            if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
              return parsed;
            }
          } catch {
          }
        }
        return { ...this._actionData };
      }
      // v1.3.1: look up the selected service in hass.services and convert its
      // `fields` map into the schema shape ha-form expects. Returns null when
      // the service is unknown or has no fields metadata — caller falls back
      // to a free-form JSON textfield.
      _serviceSchema() {
        const svc = this._actionService.trim();
        if (!svc || !/^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(svc)) return null;
        const [domain, name] = svc.split(".");
        const fields = this.hass?.services?.[domain]?.[name]?.fields;
        if (!fields || Object.keys(fields).length === 0) return null;
        return Object.entries(fields).map(([fname, def]) => ({
          name: fname,
          required: !!def.required,
          selector: def.selector || { text: {} }
        }));
      }
      _renderCompletionActionsSection(L2) {
        if (!this.completionActionsEnabled) return A;
        const schema = this._serviceSchema();
        return b2`
      <details class="ca-section">
        <summary>${t3("on_complete_action_title", L2)}</summary>
        <p class="field-help">${t3("on_complete_action_desc", L2)}</p>
        <ha-service-picker
          .hass=${this.hass}
          .value=${this._actionService}
          @value-changed=${(e7) => {
          this._actionService = e7.detail.value || "";
          const newSchema = this._serviceSchema();
          if (newSchema) {
            const allowed = new Set(newSchema.map((f3) => f3.name));
            this._actionData = Object.fromEntries(
              Object.entries(this._actionData).filter(([k2]) => allowed.has(k2))
            );
          }
        }}
        ></ha-service-picker>
        <ha-form
          .hass=${this.hass}
          .schema=${[{
          name: "target_entity",
          selector: { entity: {} }
        }]}
          .data=${{ target_entity: this._actionTargetEntity }}
          .computeLabel=${() => t3("on_complete_action_target", L2)}
          @value-changed=${(e7) => {
          const v2 = e7.detail.value;
          this._actionTargetEntity = v2.target_entity || "";
        }}
        ></ha-form>
        <p class="field-help ca-domain-hint">
          ${t3("on_complete_action_target_hint", L2)}
        </p>
        ${schema ? b2`
              <ha-form
                class="ca-data-form"
                .hass=${this.hass}
                .schema=${schema}
                .data=${this._actionData}
                @value-changed=${(e7) => {
          this._actionData = { ...e7.detail.value };
        }}
              ></ha-form>
            ` : b2`
              <ms-textfield
                label="${t3("on_complete_action_data", L2)}"
                placeholder="{}"
                .value=${this._actionDataJsonFallback}
                @input=${(e7) => {
          this._actionDataJsonFallback = e7.target.value;
        }}
              ></ms-textfield>
            `}
        <div class="ca-test-row">
          <button type="button" ?disabled=${this._actionTesting || !this._actionService}
            @click=${this._testAction}>
            ${this._actionTesting ? "\u2026" : t3("on_complete_action_test", L2)}
          </button>
          ${this._actionTestResult === "ok" ? b2`<span class="ca-test-ok">${t3("on_complete_action_test_success", L2)}</span>` : A}
          ${this._actionTestResult === "error" ? b2`<div class="ca-test-error-block">
                <span class="ca-test-error">${t3("on_complete_action_test_failed", L2)}</span>
                ${this._actionTestError ? b2`<div class="ca-test-error-detail">${this._actionTestError}</div>` : A}
              </div>` : A}
        </div>
      </details>

      <details class="ca-section">
        <summary>${t3("quick_complete_defaults_title", L2)}</summary>
        <p class="field-help">${t3("quick_complete_defaults_desc", L2)}</p>
        <ms-textfield
          label="${t3("quick_complete_defaults_notes", L2)}"
          .value=${this._qcNotes}
          @input=${(e7) => {
          this._qcNotes = e7.target.value;
        }}
        ></ms-textfield>
        <ms-textfield
          label="${t3("quick_complete_defaults_cost", L2)}"
          type="number" min="0" step="0.01"
          .value=${this._qcCost}
          @input=${(e7) => {
          this._qcCost = e7.target.value;
        }}
        ></ms-textfield>
        <ms-textfield
          label="${t3("quick_complete_defaults_duration", L2)}"
          type="number" min="0" step="1"
          .value=${this._qcDuration}
          @input=${(e7) => {
          this._qcDuration = e7.target.value;
        }}
        ></ms-textfield>
        <select class="qc-feedback"
          .value=${this._qcFeedback}
          @change=${(e7) => {
          this._qcFeedback = e7.target.value;
        }}>
          <option value="">${t3("quick_complete_defaults_feedback_none", L2)}</option>
          <option value="needed">${t3("quick_complete_defaults_feedback_needed", L2)}</option>
          <option value="not_needed">${t3("quick_complete_defaults_feedback_not_needed", L2)}</option>
        </select>
      </details>
    `;
      }
      async _loadParts() {
        this.parts = [];
        if (!this._entryId) return;
        try {
          const result = await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/object",
            entry_id: this._entryId
          });
          this.parts = result.parts || [];
          this._partsLoadFailed = false;
        } catch {
          this.parts = [];
          this._partsLoadFailed = true;
        }
      }
      /** #111: the other objects' spare-part pools this task could draw on.
       *
       *  A sibling of `_loadParts`, run in the SAME Promise.all rather than nested
       *  inside it: chaining it after the own-parts fetch delays the dialog opening
       *  by a further round trip for a list that is secondary to it.
       *
       *  Failure is soft on purpose — the own-parts picker is the primary path and
       *  must not disappear because this second call did not come back. */
      async _loadForeignPools() {
        this._foreignOwners = [];
        if (!this._entryId) return;
        try {
          const result = await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/objects"
          });
          this._foreignOwners = (result.objects || []).filter((o7) => o7.entry_id !== this._entryId && (o7.parts || []).length > 0).map((o7) => ({
            entry_id: o7.entry_id,
            name: o7.object?.name || o7.entry_id,
            parts: o7.parts || []
          })).sort((a3, b3) => a3.name.localeCompare(b3.name));
        } catch {
          this._foreignOwners = [];
        }
      }
      async _loadTags() {
        try {
          const result = await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/tags/list"
          });
          this._availableTags = result.tags || [];
        } catch {
          this._availableTags = [];
        }
      }
      _fetchConditionAttributes(entityId) {
        if (!entityId || !this.hass) return;
        if (this._conditionAttrOptions[entityId] || this._conditionAttrPending.has(entityId)) return;
        this._conditionAttrPending.add(entityId);
        void this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/entity/attributes",
          entity_id: entityId
        }).then((result) => {
          const r6 = result;
          this._conditionAttrOptions = {
            ...this._conditionAttrOptions,
            [entityId]: {
              suggested: r6.suggested_attributes || [],
              available: r6.available_attributes || []
            }
          };
        }).catch(() => {
          this._conditionAttrOptions = {
            ...this._conditionAttrOptions,
            [entityId]: { suggested: [], available: [] }
          };
        });
      }
      async _fetchEntityAttributes(entityId) {
        if (!entityId || !this.hass) {
          this._suggestedAttributes = [];
          this._availableAttributes = [];
          this._entityDomain = "";
          return;
        }
        try {
          const result = await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/entity/attributes",
            entity_id: entityId
          });
          this._entityDomain = result.domain || "";
          this._suggestedAttributes = result.suggested_attributes || [];
          this._availableAttributes = result.available_attributes || [];
        } catch {
          this._suggestedAttributes = [];
          this._availableAttributes = [];
          this._entityDomain = "";
        }
      }
      /** A task already drawing on a shared pool opens that section expanded — a
       *  collapsed disclosure would hide a link that is very much active. */
      get _hasForeignPick() {
        return Object.values(this._consumesParts).some((l3) => !!l3.entry_id);
      }
      /** One "consumes parts" checkbox + quantity.
       *
       *  `ownerEntryId` is undefined for the object's own parts and set for a pool
       *  owned by another object (#111) — that argument is the ONLY difference
       *  between the two lists, which is why they share this renderer. */
      _renderConsumesRow(part, ownerEntryId) {
        const key = partLinkKey({ part_id: part.id, entry_id: ownerEntryId });
        const link = this._consumesParts[key];
        const base = ownerEntryId ? { part_id: part.id, quantity: 1, entry_id: ownerEntryId } : { part_id: part.id, quantity: 1 };
        return b2`
      <div class="consumes-row">
        <label class="consumes-check">
          <input
            type="checkbox"
            .checked=${link !== void 0}
            @change=${(e7) => {
          const next = { ...this._consumesParts };
          if (e7.target.checked) next[key] = next[key] || base;
          else delete next[key];
          this._consumesParts = next;
        }}
          />
          <span>${part.name}${part.unit ? ` (${part.unit})` : ""}</span>
        </label>
        ${link !== void 0 ? b2`<input
              class="consumes-qty"
              type="number"
              min="0.01"
              max="999"
              step="0.01"
              .value=${String(link.quantity)}
              @input=${(e7) => {
          const v2 = parseFloat(e7.target.value);
          this._consumesParts = {
            ...this._consumesParts,
            [key]: { ...base, quantity: Number.isFinite(v2) && v2 >= 0.01 ? v2 : 1 }
          };
        }}
            />` : A}
      </div>
    `;
      }
      _toggleRequired(field, on) {
        const next = new Set(this._requiredCompletion);
        if (on) next.add(field);
        else next.delete(field);
        this._requiredCompletion = [...next];
      }
      async _save() {
        if (this._loading) return;
        if (!this._name.trim()) return;
        if (this._adaptiveSnapshot() !== this._adaptiveInitial) {
          const minIv = parseInt(this._adaptiveMin, 10);
          const maxIv = parseInt(this._adaptiveMax, 10);
          if (!isNaN(minIv) && !isNaN(maxIv) && minIv > maxIv) {
            this._error = `${t3("adaptive_min_interval", this._lang)} > ${t3("adaptive_max_interval", this._lang)}`;
            return;
          }
        }
        this._loading = true;
        this._error = "";
        try {
          const data = {
            type: this._taskId ? "maintenance_supporter/task/update" : "maintenance_supporter/task/create",
            entry_id: this._entryId,
            name: this._name,
            task_type: this._type,
            schedule_type: this._scheduleType,
            // `0` is a legal, meaningful value — "no due-soon window, go straight
            // from ok to overdue" (backend range is 0–365). The old
            // `parseInt(...) || 7` treated it as falsy and silently rewrote a
            // stored 0 to 7 on EVERY save, even when the user never touched the
            // field. Same class as bug #42, but worse: it needed no user action.
            // Only a genuinely unparseable field falls back, and to the
            // configured default rather than a hardcoded 7.
            warning_days: Number.isNaN(parseInt(this._warningDays, 10)) ? this.defaultWarningDays : Math.max(0, parseInt(this._warningDays, 10))
          };
          const ecd = this._earliestCompletionDays.trim();
          data.earliest_completion_days = ecd === "" ? null : Math.max(0, parseInt(ecd, 10) || 0);
          if (this._taskId) data.task_id = this._taskId;
          if (this._scheduleType === "one_time") {
            data.due_date = this._dueDate || null;
            data.interval_days = null;
          } else if (CALENDAR_KINDS.includes(this._scheduleType)) {
            data.schedule = { ...this._buildSchedule(), ...this._recurrenceExtras() };
            data.interval_days = null;
            if (this._taskId) data.due_date = null;
          } else {
            if (this._taskId) data.due_date = null;
            if (this._scheduleType !== "manual" && this._intervalDays) {
              data.interval_days = parseInt(this._intervalDays, 10);
              data.interval_unit = this._intervalUnit;
              data.interval_anchor = this._intervalAnchor;
              if (this._scheduleType === "time_based") {
                data.schedule = { kind: "interval", ...this._recurrenceExtras() };
              }
            } else if (this._taskId) {
              data.interval_days = null;
              data.interval_anchor = "completion";
            }
          }
          data.notes = this._notes || null;
          data.documentation_url = this._documentationUrl || null;
          data.custom_icon = this._customIcon || null;
          data.priority = this._priority;
          data.labels = this._labels.split(",").map((s4) => s4.trim()).filter(Boolean);
          data.enabled = this._enabled;
          data.last_performed = this._lastPerformed || null;
          data.nfc_tag_id = this._nfcTagId || null;
          data.reading_unit = this._readingUnit.trim() || null;
          if (this.parts.length || this._foreignOwners.length) {
            data.consumes_parts = Object.values(this._consumesParts).map(
              (l3) => l3.entry_id ? { part_id: l3.part_id, quantity: l3.quantity, entry_id: l3.entry_id } : { part_id: l3.part_id, quantity: l3.quantity }
            );
          }
          data.responsible_user_id = this._responsibleUserId;
          data.assignee_pool = this._assigneePool;
          data.required_completion_fields = this._requiredCompletion;
          data.rotation_strategy = this._assigneePool.length >= 2 && this._rotationStrategy ? this._rotationStrategy : null;
          if (this._scheduleType === "sensor_based" && this._triggerType === "compound") {
            const conditions = this._compoundConditions.map(draftToCondition).filter((c4) => c4 !== null);
            if (conditions.length > 0) {
              const triggerConfig = {
                type: "compound",
                compound_logic: this._compoundLogic,
                conditions
              };
              if (this._autoCompleteOnRecovery) triggerConfig.auto_complete_on_recovery = true;
              if (this._triggerCombinator === "all") triggerConfig.trigger_combinator = "all";
              data.trigger_config = triggerConfig;
            } else if (this._taskId) {
              data.trigger_config = null;
            }
          } else if (this._scheduleType === "sensor_based" && this._triggerEntityId) {
            const entityIds = this._triggerEntityIds.length > 0 ? this._triggerEntityIds : [this._triggerEntityId];
            const triggerConfig = {
              entity_id: entityIds[0],
              entity_ids: entityIds,
              type: this._triggerType
            };
            if (this._triggerAttribute) triggerConfig.attribute = this._triggerAttribute;
            if (this._autoCompleteOnRecovery) triggerConfig.auto_complete_on_recovery = true;
            if (this._triggerCombinator === "all") triggerConfig.trigger_combinator = "all";
            if (entityIds.length > 1) {
              triggerConfig.entity_logic = this._triggerEntityLogic;
            }
            if (this._triggerType === "threshold") {
              if (this._triggerAbove) {
                const v2 = parseFloat(this._triggerAbove);
                if (!isNaN(v2)) triggerConfig.trigger_above = v2;
              }
              if (this._triggerBelow) {
                const v2 = parseFloat(this._triggerBelow);
                if (!isNaN(v2)) triggerConfig.trigger_below = v2;
              }
              if (this._triggerEquals) {
                const v2 = parseFloat(this._triggerEquals);
                if (!isNaN(v2)) triggerConfig.trigger_equals = v2;
              }
              if (this._triggerNotEquals) {
                const v2 = parseFloat(this._triggerNotEquals);
                if (!isNaN(v2)) triggerConfig.trigger_not_equals = v2;
              }
              if (this._triggerForMinutes) {
                const v2 = parseInt(this._triggerForMinutes, 10);
                if (!isNaN(v2)) triggerConfig.trigger_for_minutes = v2;
              }
            } else if (this._triggerType === "counter") {
              if (this._triggerTargetValue) {
                const v2 = parseFloat(this._triggerTargetValue);
                if (!isNaN(v2)) triggerConfig.trigger_target_value = v2;
              }
              triggerConfig.trigger_delta_mode = this._triggerDeltaMode;
              if (this._triggerDeltaMode && this._triggerBaselineValue) {
                const b3 = parseFloat(this._triggerBaselineValue);
                if (!isNaN(b3) && b3 >= 0) triggerConfig.trigger_baseline_value = b3;
              }
            } else if (this._triggerType === "state_change") {
              if (this._triggerFromState) triggerConfig.trigger_from_state = this._triggerFromState;
              if (this._triggerToState) triggerConfig.trigger_to_state = this._triggerToState;
              if (this._triggerTargetChanges) {
                const v2 = parseInt(this._triggerTargetChanges, 10);
                if (!isNaN(v2)) triggerConfig.trigger_target_changes = v2;
              }
              if (this._triggerForMinutes) {
                const v2 = parseInt(this._triggerForMinutes, 10);
                if (!isNaN(v2)) triggerConfig.trigger_for_minutes = v2;
              }
            } else if (this._triggerType === "runtime") {
              if (this._triggerRuntimeHours) {
                const v2 = parseFloat(this._triggerRuntimeHours);
                if (!isNaN(v2)) triggerConfig.trigger_runtime_hours = v2;
              }
              const onStates = this._triggerOnStates.split(",").map((s4) => s4.trim()).filter(Boolean);
              if (onStates.length > 0) triggerConfig.trigger_on_states = onStates;
            }
            data.trigger_config = triggerConfig;
          } else if (this._taskId) {
            data.trigger_config = null;
          }
          if (this.scheduleTimeEnabled && this._scheduleType === "time_based") {
            const t5 = this._scheduleTime.trim();
            data.schedule_time = /^([01]\d|2[0-3]):[0-5]\d$/.test(t5) ? t5 : null;
          }
          if (this.checklistsEnabled) {
            const items = this._checklistText.split("\n").map((l3) => l3.trim()).filter(Boolean).slice(0, 100);
            data.checklist = items.length ? items : null;
          }
          if (this.completionActionsEnabled) {
            const svc = this._actionService.trim();
            if (svc && /^[a-z][a-z0-9_]*\.[a-z0-9_]+$/.test(svc)) {
              const action = { service: svc };
              const tgt = this._actionTargetEntity.trim();
              if (tgt) action.target = { entity_id: tgt };
              const dataDict = this._buildActionData();
              if (Object.keys(dataDict).length > 0) {
                action.data = dataDict;
              }
              data.on_complete_action = action;
            } else {
              data.on_complete_action = null;
            }
            const qcd = {};
            if (this._qcNotes.trim()) qcd.notes = this._qcNotes.trim();
            const cost = parseFloat(this._qcCost);
            if (!isNaN(cost) && cost >= 0) qcd.cost = cost;
            const dur = parseInt(this._qcDuration, 10);
            if (!isNaN(dur) && dur >= 0) qcd.duration = dur;
            if (this._qcFeedback) qcd.feedback = this._qcFeedback;
            data.quick_complete_defaults = Object.keys(qcd).length ? qcd : null;
          }
          const result = await this.hass.connection.sendMessagePromise(data);
          const savedTaskId = this._taskId || result?.task_id;
          const envChanged = this._environmentalEntity !== this._environmentalInitial || this._environmentalAttribute !== this._environmentalAttributeInitial;
          if (savedTaskId && this._scheduleType === "sensor_based" && envChanged) {
            try {
              await this.hass.connection.sendMessagePromise({
                type: "maintenance_supporter/task/set_environmental_entity",
                entry_id: this._entryId,
                task_id: savedTaskId,
                environmental_entity: this._environmentalEntity || null,
                environmental_attribute: this._environmentalAttribute || null
              });
              this._environmentalInitial = this._environmentalEntity;
              this._environmentalAttributeInitial = this._environmentalAttribute;
            } catch {
            }
          }
          if (savedTaskId && this._adaptiveSnapshot() !== this._adaptiveInitial) {
            const alpha = parseFloat(this._adaptiveAlpha);
            const minIv = parseInt(this._adaptiveMin, 10);
            const maxIv = parseInt(this._adaptiveMax, 10);
            try {
              await this.hass.connection.sendMessagePromise({
                type: "maintenance_supporter/task/set_adaptive",
                entry_id: this._entryId,
                task_id: savedTaskId,
                enabled: this._adaptiveEnabled,
                ...alpha >= 0.1 && alpha <= 0.9 ? { ewa_alpha: alpha } : {},
                ...!isNaN(minIv) && minIv >= 1 ? { min_interval_days: minIv } : {},
                ...!isNaN(maxIv) && maxIv >= 1 ? { max_interval_days: maxIv } : {},
                seasonal_enabled: this._adaptiveSeasonal,
                sensor_prediction_enabled: this._adaptivePrediction
              });
              this._adaptiveInitial = this._adaptiveSnapshot();
            } catch {
            }
          }
          this._open = false;
          this.dispatchEvent(new CustomEvent("task-saved"));
        } catch (e7) {
          this._error = describeWsError(e7, this._lang, t3("save_error", this._lang));
        } finally {
          this._loading = false;
        }
      }
      _close() {
        this._open = false;
        if (this._pickerProbeTimer !== void 0) {
          clearTimeout(this._pickerProbeTimer);
          this._pickerProbeTimer = void 0;
        }
        this._pickerProbeStrikes = 0;
      }
      _renderTriggerFields() {
        if (this._scheduleType !== "sensor_based") return A;
        const L2 = this._lang;
        const isCompound = this._triggerType === "compound";
        return b2`
      <h3>${t3("trigger_configuration", L2)}</h3>
      <div class="select-row">
        <label>${t3("trigger_type", L2)}</label>
        <select
          .value=${this._triggerType}
          @change=${(e7) => this._triggerType = e7.target.value}
        >
          ${TRIGGER_TYPE_KEYS_WITH_COMPOUND.map(
          (key) => b2`<option value=${key} ?selected=${key === this._triggerType}>${t3(key, L2)}</option>`
        )}
        </select>
      </div>
      ${isCompound ? this._renderCompoundEditor() : b2`
        ${this._entityPickerFallback ? b2`
          <ms-textfield
            label="${t3("entity_id", L2)} (${t3("comma_separated", L2)})"
            .value=${this._triggerEntityIds.length > 0 ? this._triggerEntityIds.join(", ") : this._triggerEntityId}
            @input=${(e7) => {
          const raw = e7.target.value;
          const ids = raw.split(",").map((s4) => s4.trim()).filter(Boolean);
          this._triggerEntityId = ids[0] || "";
          this._triggerEntityIds = ids;
          if (ids[0]) this._fetchEntityAttributes(ids[0]);
        }}
          ></ms-textfield>
        ` : b2`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{
          name: "trigger_entities",
          selector: { entity: { multiple: true, domain: TRIGGER_PICKER_DOMAINS } }
        }]}
          .data=${{
          trigger_entities: this._triggerEntityIds.length > 0 ? this._triggerEntityIds : this._triggerEntityId ? [this._triggerEntityId] : []
        }}
          .computeLabel=${() => t3("entity_id", L2)}
          @value-changed=${(e7) => {
          const ids = (e7.detail.value.trigger_entities || []).filter(Boolean);
          this._triggerEntityId = ids[0] || "";
          this._triggerEntityIds = ids;
          if (ids[0]) this._fetchEntityAttributes(ids[0]);
          else this._fetchEntityAttributes("");
        }}
        ></ha-form>`}
        ${this._triggerEntityIds.length > 1 ? b2`
          <div class="select-row">
            <label>${t3("entity_logic", L2)}</label>
            <select
              .value=${this._triggerEntityLogic}
              @change=${(e7) => this._triggerEntityLogic = e7.target.value}
            >
              <option value="any" ?selected=${this._triggerEntityLogic === "any"}>${t3("entity_logic_any", L2)}</option>
              <option value="all" ?selected=${this._triggerEntityLogic === "all"}>${t3("entity_logic_all", L2)}</option>
            </select>
          </div>
        ` : A}
        ${this._renderAttributeSelect({
          label: t3("attribute_optional", L2),
          value: this._triggerAttribute,
          suggested: this._suggestedAttributes,
          available: this._availableAttributes,
          onSelect: (v2) => this._triggerAttribute = v2
        })}
        ${this._renderTriggerTypeFields()}
        ${this._renderTriggerLiveHint()}
      `}
      <label>
        <input
          type="checkbox"
          .checked=${this._autoCompleteOnRecovery}
          @change=${(e7) => this._autoCompleteOnRecovery = e7.target.checked}
        />
        ${t3("auto_complete_on_recovery", L2)}
      </label>
      <div class="field-help">${t3("auto_complete_on_recovery_help", L2)}</div>
      <ms-textfield
        label="${t3("safety_interval", L2)}"
        type="number"
        .value=${this._intervalDays}
        @input=${(e7) => this._intervalDays = e7.target.value}
      ></ms-textfield>
      ${this._intervalDays ? this._renderUnitSelect() : A}
      ${this._intervalDays ? b2`
            <div class="select-row">
              <label>${t3("trigger_combinator", L2)}</label>
              <select
                @change=${(e7) => this._triggerCombinator = e7.target.value}
              >
                <option value="any" ?selected=${this._triggerCombinator === "any"}>${t3("trigger_combinator_any", L2)}</option>
                <option value="all" ?selected=${this._triggerCombinator === "all"}>${t3("trigger_combinator_all", L2)}</option>
              </select>
            </div>
          ` : A}
    `;
      }
      /** Immutably patch one compound condition and trigger a re-render. */
      _patchCondition(index, patch) {
        this._compoundConditions = this._compoundConditions.map(
          (c4, i6) => i6 === index ? { ...c4, ...patch } : c4
        );
      }
      _addCondition() {
        this._compoundConditions = [...this._compoundConditions, emptyCondition()];
      }
      _removeCondition(index) {
        this._compoundConditions = this._compoundConditions.filter((_2, i6) => i6 !== index);
      }
      /** Compound trigger editor: AND/OR logic + a list of inline conditions. */
      _renderCompoundEditor() {
        const L2 = this._lang;
        return b2`
      <div class="select-row">
        <label>${t3("compound_logic", L2)}</label>
        <select
          .value=${this._compoundLogic}
          @change=${(e7) => this._compoundLogic = e7.target.value}
        >
          <option value="AND" ?selected=${this._compoundLogic === "AND"}>${t3("compound_logic_and", L2)}</option>
          <option value="OR" ?selected=${this._compoundLogic === "OR"}>${t3("compound_logic_or", L2)}</option>
        </select>
      </div>
      <div class="field-help">${t3("compound_help", L2)}</div>
      ${this._compoundConditions.length === 0 ? b2`<div class="field-help">${t3("compound_no_conditions", L2)}</div>` : this._compoundConditions.map((c4, i6) => this._renderCondition(c4, i6))}
      <button type="button" class="secondary-btn" @click=${() => this._addCondition()}>
        + ${t3("compound_add_condition", L2)}
      </button>
    `;
      }
      /** One compound condition row: entity + sub-type + type-specific params. */
      _renderCondition(c4, i6) {
        const L2 = this._lang;
        const num = i6 + 1;
        return b2`
      <div class="compound-condition">
        <div class="compound-condition-head">
          <span class="compound-condition-title">${t3("compound_condition", L2)} ${num}</span>
          <button
            type="button"
            class="icon-btn"
            title="${t3("compound_remove_condition", L2)}"
            @click=${() => this._removeCondition(i6)}
          >✕</button>
        </div>
        ${this._entityPickerFallback ? b2`
          <ms-textfield
            label="${t3("entity_id", L2)} (${t3("comma_separated", L2)})"
            .value=${c4.entityIds}
            @input=${(e7) => this._patchCondition(i6, { entityIds: e7.target.value })}
          ></ms-textfield>
        ` : b2`
        <ha-form
          class="entity-picker-form"
          .hass=${this.hass}
          .schema=${[{
          name: "condition_entities",
          selector: { entity: { multiple: true, domain: TRIGGER_PICKER_DOMAINS } }
        }]}
          .data=${{ condition_entities: c4.entityIds.split(",").map((s4) => s4.trim()).filter(Boolean) }}
          .computeLabel=${() => t3("entity_id", L2)}
          @value-changed=${(e7) => {
          const ids = (e7.detail.value.condition_entities || []).filter(Boolean);
          this._patchCondition(i6, { entityIds: ids.join(", ") });
        }}
        ></ha-form>`}
        ${this._renderConditionAttribute(c4, i6)}
        <div class="select-row">
          <label>${t3("trigger_type", L2)}</label>
          <select
            .value=${c4.type}
            @change=${(e7) => this._patchCondition(i6, { type: e7.target.value })}
          >
            ${TRIGGER_TYPE_KEYS.map(
          (key) => b2`<option value=${key} ?selected=${key === c4.type}>${t3(key, L2)}</option>`
        )}
          </select>
        </div>
        ${this._renderConditionTypeFields(c4, i6)}
      </div>
    `;
      }
      /** State field bound to an entity (#129 follow-up): HA's state selector
       *  suggests the entity's known states instead of free text. Falls back to
       *  the plain textfield without an entity or when the pickers are broken in
       *  this context (same _entityPickerFallback flag). */
      _renderStateField(args) {
        if (this._entityPickerFallback || !args.entityId) {
          return b2`
        <ms-textfield
          label=${args.label}
          .value=${args.value}
          @input=${(e7) => args.onInput(e7.target.value)}
        ></ms-textfield>
      `;
        }
        return b2`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{ name: "s", selector: { state: { entity_id: args.entityId } } }]}
        .data=${{ s: args.value }}
        .computeLabel=${() => args.label}
        @value-changed=${(e7) => args.onInput((e7.detail.value.s || "").trim())}
      ></ha-form>
    `;
      }
      /** Multi-state variant for runtime ON-states — keeps the internal
       *  comma-string representation so the save path stays unchanged. */
      _renderOnStatesField(args) {
        const L2 = this._lang;
        if (this._entityPickerFallback || !args.entityId) {
          return b2`
        <ms-textfield
          label="${t3("runtime_on_states", L2)}"
          placeholder="on"
          .value=${args.value}
          @input=${(e7) => args.onInput(e7.target.value)}
        ></ms-textfield>
      `;
        }
        return b2`
      <ha-form
        class="state-picker-form"
        .hass=${this.hass}
        .schema=${[{ name: "s", selector: { state: { entity_id: args.entityId, multiple: true } } }]}
        .data=${{ s: (args.value || "").split(",").map((x2) => x2.trim()).filter(Boolean) }}
        .computeLabel=${() => t3("runtime_on_states", L2)}
        @value-changed=${(e7) => args.onInput((e7.detail.value.s || []).join(", "))}
      ></ha-form>
    `;
      }
      /** Adaptive-scheduling tuning (parity with the options flow's adaptive
       *  step). Hidden for one-time/manual tasks — there is no recurrence to
       *  adapt. Collapsed unless adaptive is already enabled. */
      _renderAdaptiveSection(L2) {
        if (this._scheduleType === "one_time" || this._scheduleType === "manual") return A;
        return b2`
      <details class="adaptive-section" ?open=${this._adaptiveEnabled}>
        <summary>${t3("adaptive_section_title", L2)}</summary>
        <label>
          <input
            type="checkbox"
            .checked=${this._adaptiveEnabled}
            @change=${(e7) => this._adaptiveEnabled = e7.target.checked}
          />
          ${t3("adaptive_enabled", L2)}
        </label>
        ${this._adaptiveEnabled ? b2`
          <ms-textfield
            label="${t3("adaptive_min_interval", L2)}"
            type="number"
            min="1"
            .value=${this._adaptiveMin}
            @input=${(e7) => this._adaptiveMin = e7.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${t3("adaptive_max_interval", L2)}"
            type="number"
            min="1"
            .value=${this._adaptiveMax}
            @input=${(e7) => this._adaptiveMax = e7.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${t3("adaptive_ewa_alpha", L2)}"
            type="number"
            min="0.1"
            max="0.9"
            step="0.1"
            .value=${this._adaptiveAlpha}
            @input=${(e7) => this._adaptiveAlpha = e7.target.value}
          ></ms-textfield>
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptiveSeasonal}
              @change=${(e7) => this._adaptiveSeasonal = e7.target.checked}
            />
            ${t3("adaptive_seasonal_enabled", L2)}
          </label>
          <label>
            <input
              type="checkbox"
              .checked=${this._adaptivePrediction}
              @change=${(e7) => this._adaptivePrediction = e7.target.checked}
            />
            ${t3("adaptive_prediction_enabled", L2)}
          </label>
        ` : A}
      </details>
    `;
      }
      /** Shared attribute selector: "use entity state" + suggested★ + remaining
       *  attributes (non-numeric flagged), textfield fallback when none known. */
      _renderAttributeSelect(cfg) {
        const L2 = this._lang;
        if (cfg.available.length > 0) {
          return b2`
        <div class="select-row">
          <label>${cfg.label}</label>
          <select
            .value=${cfg.value}
            @change=${(e7) => cfg.onSelect(e7.target.value)}
          >
            <option value="" ?selected=${!cfg.value}>${t3("use_entity_state", L2)}</option>
            ${cfg.suggested.map(
            (attr) => b2`<option value=${attr} ?selected=${attr === cfg.value}>${attr} ★</option>`
          )}
            ${cfg.available.filter((a3) => !cfg.suggested.includes(a3.name)).map(
            (a3) => b2`<option value=${a3.name} ?selected=${a3.name === cfg.value}>${a3.name}${a3.numeric ? "" : " (non-numeric)"}</option>`
          )}
          </select>
        </div>
      `;
        }
        return b2`
      <ms-textfield
        label="${cfg.label}"
        .value=${cfg.value}
        @input=${(e7) => cfg.onSelect(e7.target.value.trim())}
      ></ms-textfield>
    `;
      }
      /** Environmental attribute — the same live-fetched dropdown the flat and
       *  compound attribute fields use, keyed by the environmental entity. */
      _renderEnvironmentalAttribute(L2) {
        this._fetchConditionAttributes(this._environmentalEntity);
        const opts = this._conditionAttrOptions[this._environmentalEntity];
        return this._renderAttributeSelect({
          label: t3("environmental_attribute_optional", L2),
          value: this._environmentalAttribute,
          suggested: opts?.suggested ?? [],
          available: opts?.available ?? [],
          onSelect: (v2) => this._environmentalAttribute = v2
        });
      }
      /** Attribute selector for one compound condition — the same live-fetched
       *  dropdown the flat editor has, keyed by the condition's first entity. */
      _renderConditionAttribute(c4, i6) {
        const firstId = c4.entityIds.split(",")[0]?.trim() || "";
        if (firstId) this._fetchConditionAttributes(firstId);
        const opts = firstId ? this._conditionAttrOptions[firstId] : void 0;
        return this._renderAttributeSelect({
          label: t3("attribute_optional", this._lang),
          value: c4.attribute,
          suggested: opts?.suggested ?? [],
          available: opts?.available ?? [],
          onSelect: (v2) => this._patchCondition(i6, { attribute: v2 })
        });
      }
      /** Type-specific inputs for a single compound condition (mirrors the flat
       *  per-type fields, bound to the condition draft). */
      _renderConditionTypeFields(c4, i6) {
        const L2 = this._lang;
        if (c4.type === "threshold") {
          return b2`
        <ms-textfield label="${t3("trigger_above", L2)}" type="number" .value=${c4.above}
          @input=${(e7) => this._patchCondition(i6, { above: e7.target.value })}></ms-textfield>
        <ms-textfield label="${t3("trigger_below", L2)}" type="number" .value=${c4.below}
          @input=${(e7) => this._patchCondition(i6, { below: e7.target.value })}></ms-textfield>
        <ms-textfield label="${t3("trigger_equals", L2)}" type="number" .value=${c4.equals}
          @input=${(e7) => this._patchCondition(i6, { equals: e7.target.value })}></ms-textfield>
        <ms-textfield label="${t3("trigger_not_equals", L2)}" type="number" .value=${c4.notEquals}
          @input=${(e7) => this._patchCondition(i6, { notEquals: e7.target.value })}></ms-textfield>
        <ms-textfield label="${t3("for_minutes", L2)}" type="number" .value=${c4.forMinutes}
          @input=${(e7) => this._patchCondition(i6, { forMinutes: e7.target.value })}></ms-textfield>
      `;
        }
        if (c4.type === "counter") {
          return b2`
        <ms-textfield label="${t3("target_value", L2)}" type="number" .value=${c4.targetValue}
          @input=${(e7) => this._patchCondition(i6, { targetValue: e7.target.value })}></ms-textfield>
        <label>
          <input type="checkbox" .checked=${c4.deltaMode}
            @change=${(e7) => this._patchCondition(i6, { deltaMode: e7.target.checked })} />
          ${t3("delta_mode", L2)}
        </label>
      `;
        }
        if (c4.type === "state_change") {
          const condEntity = c4.entityIds.split(",")[0]?.trim() || "";
          return b2`
        ${this._renderStateField({
            label: t3("from_state_optional", L2),
            value: c4.fromState,
            entityId: condEntity,
            onInput: (v2) => this._patchCondition(i6, { fromState: v2 })
          })}
        ${this._renderStateField({
            label: t3("to_state_optional", L2),
            value: c4.toState,
            entityId: condEntity,
            onInput: (v2) => this._patchCondition(i6, { toState: v2 })
          })}
        <ms-textfield label="${t3("target_changes", L2)}" type="number" .value=${c4.targetChanges}
          @input=${(e7) => this._patchCondition(i6, { targetChanges: e7.target.value })}></ms-textfield>
      `;
        }
        if (c4.type === "runtime") {
          const condEntity = c4.entityIds.split(",")[0]?.trim() || "";
          return b2`
        <ms-textfield label="${t3("runtime_hours", L2)}" type="number" .value=${c4.runtimeHours}
          @input=${(e7) => this._patchCondition(i6, { runtimeHours: e7.target.value })}></ms-textfield>
        ${this._renderOnStatesField({
            value: c4.onStates,
            entityId: condEntity,
            onInput: (v2) => this._patchCondition(i6, { onStates: v2 })
          })}
      `;
        }
        return A;
      }
      /** Shared interval-unit dropdown (DRY: time-based interval + sensor safety
       *  interval). Bound to _intervalUnit; options localized via unit_* keys. */
      _renderUnitSelect() {
        const L2 = this._lang;
        return b2`
      <div class="select-row">
        <label>${t3("interval_unit", L2)}</label>
        <select
          .value=${this._intervalUnit}
          @change=${(e7) => this._intervalUnit = e7.target.value}
        >
          ${["days", "weeks", "months", "years"].map(
          (u3) => b2`<option value=${u3} ?selected=${u3 === this._intervalUnit}>${t3("unit_" + u3, L2)}</option>`
        )}
        </select>
      </div>`;
      }
      _toggleWeekday(i6) {
        this._weekdays = this._weekdays.includes(i6) ? this._weekdays.filter((d3) => d3 !== i6) : [...this._weekdays, i6];
      }
      /** The draft schedule in engine (Schedule.to_dict) form — MIRRORS the
       *  _save mapping; keep both in sync when adding schedule fields. Null =
       *  nothing to preview (manual, or trigger-only without an interval). */
      _previewScheduleDict() {
        if (this._scheduleType === "one_time") {
          return this._dueDate ? { kind: "one_time", due_date: this._dueDate } : null;
        }
        if (CALENDAR_KINDS.includes(this._scheduleType)) {
          return { ...this._buildSchedule(), ...this._recurrenceExtras() };
        }
        const every = parseInt(this._intervalDays, 10);
        if (this._scheduleType === "manual" || !every || every <= 0) return null;
        return {
          kind: "interval",
          every,
          unit: this._intervalUnit,
          anchor: this._intervalAnchor,
          ...this._recurrenceExtras()
        };
      }
      updated(changed) {
        super.updated?.(changed);
        this._scheduleEntityPickerProbe();
        for (const key of changed.keys()) {
          if (_MaintenanceTaskDialog._PREVIEW_RELEVANT.has(String(key))) {
            this._schedulePreviewRefresh();
            return;
          }
        }
      }
      /** #129 SAFETY NET (not the primary fix): HA's modern pickers resolve data
       *  via Lit context — events that must bubble up to providers on the
       *  <home-assistant> element. A dialog mounted outside that tree gets
       *  pickers that upgrade to an EMPTY shadow root. The root cause is solved
       *  by mounting dialogs inside <home-assistant>'s shadow root
       *  (dialog-mount.ts); this probe remains as defense in depth for unknown
       *  contexts: two consecutive zero-height measurements of the leaf pickers
       *  inside a visible dialog flip the trigger fields back to the
       *  comma-separated text inputs. */
      _scheduleEntityPickerProbe() {
        if (this._entityPickerFallback || this._pickerProbeTimer !== void 0 || !this._open || this._scheduleType !== "sensor_based") return;
        this._pickerProbeTimer = setTimeout(() => this._probeEntityPickers(), 1500);
      }
      _probeEntityPickers() {
        this._pickerProbeTimer = void 0;
        if (this._entityPickerFallback || !this._open) return;
        const form = this.shadowRoot?.querySelector("ha-form.entity-picker-form");
        const dialogVisible = (this.shadowRoot?.querySelector(".content")?.offsetHeight ?? 0) > 0;
        if (!form || !dialogVisible) {
          this._pickerProbeStrikes = 0;
          return;
        }
        const collectLeaves = (el, out, depth = 0) => {
          if (!el || depth > 10) return;
          if ((el.tagName?.toLowerCase() ?? "") === "ha-entity-picker") out.push(el);
          for (const root of [el.shadowRoot, el]) {
            if (!root) continue;
            for (const child of Array.from(root.children ?? [])) collectLeaves(child, out, depth + 1);
          }
        };
        const forms = [...this.shadowRoot?.querySelectorAll("ha-form.entity-picker-form") ?? []];
        const leaves = [];
        for (const f3 of forms) collectLeaves(f3, leaves);
        const broken = leaves.length === 0 || leaves.some((leaf) => leaf.offsetHeight === 0);
        if (form.offsetHeight === 0 || broken) {
          this._pickerProbeStrikes += 1;
          if (this._pickerProbeStrikes >= 2) {
            this._entityPickerFallback = true;
            return;
          }
          this._pickerProbeTimer = setTimeout(() => this._probeEntityPickers(), 700);
        } else {
          this._pickerProbeStrikes = 0;
        }
      }
      _schedulePreviewRefresh() {
        if (this._previewTimer) clearTimeout(this._previewTimer);
        this._previewTimer = setTimeout(() => void this._fetchSchedulePreview(), 300);
      }
      async _fetchSchedulePreview() {
        const sched = this._open ? this._previewScheduleDict() : null;
        if (!sched) {
          this._schedulePreview = [];
          this._schedulePreviewEnded = false;
          return;
        }
        const seq = ++this._previewSeq;
        try {
          const res = await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/schedule/preview",
            schedule: sched,
            ...this._lastPerformed ? { last_performed: this._lastPerformed } : {}
          });
          if (seq !== this._previewSeq) return;
          this._schedulePreview = res.occurrences || [];
          this._schedulePreviewEnded = !!res.series_ended;
        } catch {
        }
      }
      _renderSchedulePreview() {
        if (this._schedulePreview.length === 0) return A;
        const L2 = this._lang;
        const time = this.scheduleTimeEnabled && this._scheduleTime ? ` ${this._scheduleTime}` : "";
        const chips = this._schedulePreview.map((iso, i6) => {
          const js = (/* @__PURE__ */ new Date(`${iso}T12:00:00`)).getDay();
          const wd = weekdayName(js === 0 ? 6 : js - 1, L2, "short");
          return `${wd} ${formatDate(iso, L2)}${i6 === 0 ? time : ""}`;
        }).join(" \xB7 ");
        const onTime = this._scheduleType === "time_based" && this._intervalAnchor === "completion" ? b2`<div class="field-help">${t3("schedule_preview_ontime", L2)}</div>` : A;
        return b2`
      <div class="trigger-live-hint schedule-preview">
        ${t3("schedule_preview_title", L2)}: ${chips}${this._schedulePreviewEnded ? b2` <span class="field-help">${t3("schedule_preview_ends", L2)}</span>` : A}
        ${onTime}
      </div>
    `;
      }
      /** Build the nested `schedule` object for the selected calendar kind. */
      _buildSchedule() {
        const withOffset = (schedule2) => {
          const off = parseInt(this._calOffset, 10) || 0;
          if (off) schedule2.offset = Math.max(-15, Math.min(off, 15));
          return schedule2;
        };
        if (this._scheduleType === "weekdays") {
          return withOffset({ kind: "weekdays", weekdays: [...this._weekdays].sort((a3, b3) => a3 - b3) });
        }
        if (this._scheduleType === "nth_weekday") {
          return withOffset({
            kind: "nth_weekday",
            nth: parseInt(this._nth, 10),
            weekday: parseInt(this._nthWeekday, 10)
          });
        }
        const schedule = {
          kind: "day_of_month",
          day: this._domLastDay ? -1 : parseInt(this._domDay, 10) || 1
        };
        if (this._domBusiness) schedule.business = true;
        return withOffset(schedule);
      }
      /** The season/finite-series extras to attach to a recurring schedule. Empty
       *  values are omitted, so a clean schedule stays clean (and, since the sent
       *  schedule is authoritative, an omitted extra clears a previously-set one). */
      _recurrenceExtras() {
        const extras = {};
        if (this._seasonMonths.length) extras.season_months = [...this._seasonMonths].sort((a3, b3) => a3 - b3);
        if (this._endsMode === "count") {
          const n5 = parseInt(this._endsCount, 10);
          if (n5 >= 1) extras.ends = { count: n5 };
        } else if (this._endsMode === "until" && this._endsUntil) {
          extras.ends = { until: this._endsUntil };
        }
        return extras;
      }
      _toggleSeasonMonth(m2) {
        this._seasonMonths = this._seasonMonths.includes(m2) ? this._seasonMonths.filter((x2) => x2 !== m2) : [...this._seasonMonths, m2];
      }
      /** Seasonal window + finite-series end — shown for recurring (interval +
       *  calendar) kinds, where both apply. */
      _renderRecurrenceExtras() {
        const L2 = this._lang;
        const recurring = this._scheduleType === "time_based" || CALENDAR_KINDS.includes(this._scheduleType);
        if (!recurring) return A;
        const months = monthNames(L2);
        return b2`
      <label class="field-label">${t3("season_window_label", L2)}</label>
      <div class="field-help">${t3("season_window_hint", L2)}</div>
      <div class="weekday-chips season-chips">
        ${months.map((name, i6) => b2`
          <button
            type="button"
            class="season-chip ${this._seasonMonths.includes(i6 + 1) ? "selected" : ""}"
            @click=${() => this._toggleSeasonMonth(i6 + 1)}
          >${name}</button>`)}
      </div>

      <label class="field-label">${t3("series_end_label", L2)}</label>
      <div class="select-row">
        <select .value=${this._endsMode}
          @change=${(e7) => this._endsMode = e7.target.value}>
          <option value="never" ?selected=${this._endsMode === "never"}>${t3("series_end_never", L2)}</option>
          <option value="count" ?selected=${this._endsMode === "count"}>${t3("series_end_after_count", L2)}</option>
          <option value="until" ?selected=${this._endsMode === "until"}>${t3("series_end_until", L2)}</option>
        </select>
      </div>
      ${this._endsMode === "count" ? b2`
        <ms-textfield
          label="${t3("series_end_count_label", L2)}"
          type="number" min="1"
          .value=${this._endsCount}
          @input=${(e7) => this._endsCount = e7.target.value}
        ></ms-textfield>` : A}
      ${this._endsMode === "until" ? b2`
        <ms-textfield
          label="${t3("series_end_until_label", L2)}"
          type="date"
          .value=${this._endsUntil}
          @input=${(e7) => this._endsUntil = e7.target.value}
        ></ms-textfield>` : A}
    `;
      }
      /** Per-kind field groups for the calendar recurrence kinds. */
      _renderCalendarFields() {
        const L2 = this._lang;
        const days = weekdayNames(L2);
        if (this._scheduleType === "weekdays") {
          return b2`
        <label class="field-label">${t3("recurrence_on_days", L2)}</label>
        <div class="weekday-chips">
          ${days.map((name, i6) => b2`
            <button
              type="button"
              class="weekday-chip ${this._weekdays.includes(i6) ? "selected" : ""}"
              @click=${() => this._toggleWeekday(i6)}
            >${name}</button>`)}
        </div>
        ${this._renderCalOffsetField()}`;
        }
        if (this._scheduleType === "nth_weekday") {
          const nths = [
            ["1", t3("ord_1", L2)],
            ["2", t3("ord_2", L2)],
            ["3", t3("ord_3", L2)],
            ["4", t3("ord_4", L2)],
            ["5", t3("ord_5", L2)],
            ["-1", t3("ord_last", L2)]
          ];
          return b2`
        <div class="select-row">
          <label>${t3("recurrence_occurrence", L2)}</label>
          <select .value=${this._nth} @change=${(e7) => this._nth = e7.target.value}>
            ${nths.map(([v2, lbl]) => b2`<option value=${v2} ?selected=${v2 === this._nth}>${lbl}</option>`)}
          </select>
        </div>
        <div class="select-row">
          <label>${t3("recurrence_weekday", L2)}</label>
          <select .value=${this._nthWeekday} @change=${(e7) => this._nthWeekday = e7.target.value}>
            ${days.map((name, i6) => b2`<option value=${String(i6)} ?selected=${String(i6) === this._nthWeekday}>${name}</option>`)}
          </select>
        </div>
        ${this._renderCalOffsetField()}`;
        }
        if (this._scheduleType === "day_of_month") {
          return b2`
        ${this._domLastDay ? A : b2`
          <ms-textfield
            label="${t3("recurrence_day", L2)}"
            type="number"
            min="1"
            max="31"
            .value=${this._domDay}
            @input=${(e7) => this._domDay = e7.target.value}
          ></ms-textfield>`}
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domLastDay}
            @change=${(e7) => this._domLastDay = e7.target.checked} />
          <span>${t3("recurrence_last_day", L2)}</span>
        </label>
        <label class="checkbox-row">
          <input type="checkbox" .checked=${this._domBusiness}
            @change=${(e7) => this._domBusiness = e7.target.checked} />
          <span>${t3("recurrence_business_day", L2)}</span>
        </label>
        ${this._renderCalOffsetField()}`;
        }
        return A;
      }
      /** (#83) ±N-day shift shared by all calendar kinds. */
      _renderCalOffsetField() {
        const L2 = this._lang;
        return b2`
      <ms-textfield
        label="${t3("recurrence_offset", L2)}"
        helper="${t3("recurrence_offset_help", L2)}"
        type="number"
        min="-15"
        max="15"
        .value=${this._calOffset}
        @input=${(e7) => this._calOffset = e7.target.value}
      ></ms-textfield>`;
      }
      /** Live "what happens next" hint for sensor-based triggers.
       *
       * Reads the bound entity's CURRENT state client-side (the dialog already
       * holds `hass`) and spells out the trigger semantics against it — clearing
       * the most common usage-meter confusion: a delta counter counts from the
       * sensor's current reading (not from zero) and restarts after each
       * completion. Renders nothing when there's no entity/state to read.
       */
      _renderTriggerLiveHint() {
        if (this._triggerType === "compound") return A;
        const entityId = this._triggerEntityId || this._triggerEntityIds[0];
        if (!entityId || !this.hass?.states) return A;
        const st = this.hass.states[entityId];
        if (!st) return A;
        const L2 = this._lang;
        const unitAttr = st.attributes?.unit_of_measurement;
        const unit = typeof unitAttr === "string" && unitAttr ? ` ${unitAttr}` : "";
        const raw = this._triggerAttribute ? st.attributes?.[this._triggerAttribute] : st.state;
        const num = typeof raw === "number" ? raw : parseFloat(String(raw));
        const hasNum = raw !== "unknown" && raw !== "unavailable" && raw != null && !isNaN(num);
        const fmt = (v2) => Number.isInteger(v2) ? String(v2) : String(Math.round(v2 * 10) / 10);
        const parts = [];
        if (this._triggerType === "threshold") {
          const above = parseFloat(this._triggerAbove);
          const below = parseFloat(this._triggerBelow);
          if (isNaN(above) && isNaN(below)) return A;
          if (hasNum) parts.push(t3("trigger_hint_now", L2).replace("{value}", fmt(num) + unit));
          if (!isNaN(above)) parts.push(t3("trigger_hint_above", L2).replace("{target}", fmt(above) + unit));
          if (!isNaN(below)) parts.push(t3("trigger_hint_below", L2).replace("{target}", fmt(below) + unit));
        } else if (this._triggerType === "counter") {
          const target = parseFloat(this._triggerTargetValue);
          if (isNaN(target)) return A;
          if (this._triggerDeltaMode) {
            if (this._taskId) {
              parts.push(t3("trigger_hint_counter_delta_edit", L2).replace("{target}", fmt(target) + unit));
            } else if (hasNum) {
              parts.push(
                t3("trigger_hint_counter_delta", L2).replace("{value}", fmt(num) + unit).replace("{due}", fmt(num + target) + unit).replace("{target}", fmt(target) + unit)
              );
            } else {
              parts.push(t3("trigger_hint_counter_delta_edit", L2).replace("{target}", fmt(target) + unit));
            }
          } else {
            if (hasNum) parts.push(t3("trigger_hint_now", L2).replace("{value}", fmt(num) + unit));
            parts.push(t3("trigger_hint_counter_abs", L2).replace("{target}", fmt(target) + unit));
          }
        } else if (this._triggerType === "runtime") {
          const hours = parseFloat(this._triggerRuntimeHours);
          if (isNaN(hours)) return A;
          parts.push(t3("trigger_hint_runtime", L2).replace("{hours}", fmt(hours)));
          parts.push(t3("trigger_hint_state_now", L2).replace("{value}", String(st.state)));
        } else if (this._triggerType === "state_change") {
          const n5 = parseInt(this._triggerTargetChanges, 10) || 1;
          const to = this._triggerToState.trim();
          parts.push(
            (to ? t3("trigger_hint_state_change_to", L2).replace("{state}", to) : t3("trigger_hint_state_change", L2)).replace("{count}", String(n5))
          );
          parts.push(t3("trigger_hint_state_now", L2).replace("{value}", String(st.state)));
        }
        if (!parts.length) return A;
        return b2`<div class="trigger-live-hint">${parts.join(" ")}</div>`;
      }
      _renderTriggerTypeFields() {
        const L2 = this._lang;
        if (this._triggerType === "threshold") {
          return b2`
        <ms-textfield
          label="${t3("trigger_above", L2)}"
          type="number"
          step="any"
          .value=${this._triggerAbove}
          @input=${(e7) => this._triggerAbove = e7.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${t3("trigger_below", L2)}"
          type="number"
          step="any"
          .value=${this._triggerBelow}
          @input=${(e7) => this._triggerBelow = e7.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${t3("trigger_equals", L2)}"
          type="number"
          step="any"
          .value=${this._triggerEquals}
          @input=${(e7) => this._triggerEquals = e7.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${t3("trigger_not_equals", L2)}"
          type="number"
          step="any"
          .value=${this._triggerNotEquals}
          @input=${(e7) => this._triggerNotEquals = e7.target.value}
        ></ms-textfield>
        <ms-textfield
          label="${t3("for_at_least_minutes", L2)}"
          type="number"
          .value=${this._triggerForMinutes}
          @input=${(e7) => this._triggerForMinutes = e7.target.value}
        ></ms-textfield>
      `;
        }
        if (this._triggerType === "counter") {
          return b2`
        <ms-textfield
          label="${t3("target_value", L2)}"
          type="number"
          step="any"
          .value=${this._triggerTargetValue}
          @input=${(e7) => this._triggerTargetValue = e7.target.value}
        ></ms-textfield>
        <label>
          <input
            type="checkbox"
            .checked=${this._triggerDeltaMode}
            @change=${(e7) => this._triggerDeltaMode = e7.target.checked}
          />
          ${t3("delta_mode", L2)}
        </label>
        ${this._triggerDeltaMode ? b2`
              <ms-textfield
                label="${t3("baseline_start_value", L2)}"
                type="number"
                step="any"
                .value=${this._triggerBaselineValue}
                @input=${(e7) => this._triggerBaselineValue = e7.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${this._taskId ? t3("baseline_start_help_edit", L2) : t3("baseline_start_help", L2)}
                ${this._taskId && this._liveBaselineValue != null ? b2`<div class="baseline-effective">
                      ${t3("baseline_current_effective", L2).replace(
            "{value}",
            String(this._liveBaselineValue)
          )}
                    </div>` : A}
              </div>
            ` : A}
      `;
        }
        if (this._triggerType === "state_change") {
          return b2`
        ${this._renderStateField({
            label: t3("from_state_optional", L2),
            value: this._triggerFromState,
            entityId: this._triggerEntityId,
            onInput: (v2) => this._triggerFromState = v2
          })}
        <div class="field-help">${t3("state_value_help", L2)}</div>
        ${this._renderStateField({
            label: t3("to_state_optional", L2),
            value: this._triggerToState,
            entityId: this._triggerEntityId,
            onInput: (v2) => this._triggerToState = v2
          })}
        <ms-textfield
          label="${t3("target_changes", L2)}"
          type="number"
          min="1"
          .value=${this._triggerTargetChanges}
          @input=${(e7) => this._triggerTargetChanges = e7.target.value}
        ></ms-textfield>
        <div class="field-help">${t3("target_changes_help", L2)}</div>
        <ms-textfield
          label="${t3("for_at_least_minutes", L2)}"
          type="number"
          min="0"
          .value=${this._triggerForMinutes}
          @input=${(e7) => this._triggerForMinutes = e7.target.value}
        ></ms-textfield>
        <div class="field-help">${t3("for_minutes_state_help", L2)}</div>
      `;
        }
        if (this._triggerType === "runtime") {
          return b2`
        <ms-textfield
          label="${t3("runtime_hours", L2)}"
          type="number"
          step="1"
          .value=${this._triggerRuntimeHours}
          @input=${(e7) => this._triggerRuntimeHours = e7.target.value}
        ></ms-textfield>
        ${this._renderOnStatesField({
            value: this._triggerOnStates,
            entityId: this._triggerEntityId,
            onInput: (v2) => this._triggerOnStates = v2
          })}
        <div class="field-help">${t3("runtime_on_states_help", L2)}</div>
      `;
        }
        return A;
      }
      render() {
        if (!this._open) return b2``;
        const L2 = this._lang;
        const title = this._taskId ? t3("edit_task", L2) : t3("new_task", L2);
        return b2`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${title}</div>
        <div class="content">
          ${this._error ? b2`<div class="error">${this._error}</div>` : A}
          ${this._objectChoices.length > 0 ? b2`
            <div class="select-row">
              <label>${t3("object", L2)}</label>
              <select
                .value=${this._entryId}
                @change=${(e7) => {
          this._entryId = e7.target.value;
          this._consumesParts = {};
          this._loadParts();
          this._loadForeignPools();
        }}
              >
                ${this._objectChoices.map(
          (o7) => b2`<option value=${o7.entry_id} ?selected=${o7.entry_id === this._entryId}>${o7.name}</option>`
        )}
              </select>
            </div>
          ` : A}
          <ms-textfield
            label="${t3("task_name", L2)}"
            required
            .value=${this._name}
            @input=${(e7) => this._name = e7.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${t3("maintenance_type", L2)}</label>
            <select
              .value=${this._type}
              @change=${(e7) => this._type = e7.target.value}
            >
              ${MAINTENANCE_TYPE_KEYS.map(
          (key) => b2`<option value=${key} ?selected=${key === this._type}>${t3(key, L2)}</option>`
        )}
            </select>
          </div>
          ${this._type === "reading" ? b2`
                <ms-textfield
                  label="${t3("reading_unit_label", L2)}"
                  .value=${this._readingUnit}
                  @input=${(e7) => this._readingUnit = e7.target.value}
                ></ms-textfield>
                <div class="field-help">${t3("reading_unit_help", L2)}</div>
              ` : A}
          ${this._partsLoadFailed ? b2`<div class="field-help parts-load-failed">${t3("parts_load_failed", L2)}</div>` : A}
          ${this.parts.length || this._foreignOwners.length ? b2`
                <div class="field">
                  <label>${t3("consumes_parts_label", L2)}</label>
                  ${this.parts.map((part) => this._renderConsumesRow(part))}
                  ${this._foreignOwners.length ? b2`
                        <details class="shared-pools" ?open=${this._hasForeignPick}>
                          <summary>${t3("shared_parts_other_objects", L2)}</summary>
                          <div class="field-help">${t3("shared_parts_help", L2)}</div>
                          ${this._foreignOwners.map(
          (owner) => b2`
                              <div class="shared-pool-owner">${owner.name}</div>
                              ${owner.parts.map(
            (part) => this._renderConsumesRow(part, owner.entry_id)
          )}
                            `
        )}
                        </details>
                      ` : A}
                </div>
              ` : A}
          <div class="select-row">
            <label>${t3("priority", L2)}</label>
            <select
              .value=${this._priority}
              @change=${(e7) => this._priority = e7.target.value}
            >
              ${PRIORITY_KEYS.map(
          (key) => b2`<option value=${key} ?selected=${key === this._priority}>${t3("priority_" + key, L2)}</option>`
        )}
            </select>
          </div>
          <div class="field">
            <label>${t3("labels", L2)}</label>
            <input
              type="text"
              .value=${this._labels}
              placeholder="${t3("labels_placeholder", L2)}"
              @input=${(e7) => this._labels = e7.target.value}
            />
            <div class="field-help">${t3("labels_help", L2)}</div>
          </div>
          <div class="select-row">
            <label>${t3("schedule_type", L2)}</label>
            <select
              .value=${this._scheduleType}
              @change=${(e7) => this._scheduleType = e7.target.value}
            >
              ${SCHEDULE_TYPE_KEYS.map(
          (key) => b2`<option value=${key} ?selected=${key === this._scheduleType}>${t3(key, L2)}</option>`
        )}
            </select>
          </div>
          ${this._scheduleType === "time_based" ? b2`
                <ms-textfield
                  label="${t3("interval_value", L2)}"
                  type="number"
                  .value=${this._intervalDays}
                  @input=${(e7) => this._intervalDays = e7.target.value}
                ></ms-textfield>
                ${this._renderUnitSelect()}
                <div class="select-row">
                  <label>${t3("interval_anchor", L2)}</label>
                  <select
                    .value=${this._intervalAnchor}
                    @change=${(e7) => this._intervalAnchor = e7.target.value}
                  >
                    <option value="completion" ?selected=${this._intervalAnchor === "completion"}>${t3("anchor_completion", L2)}</option>
                    <option value="planned" ?selected=${this._intervalAnchor === "planned"}>${t3("anchor_planned", L2)}</option>
                  </select>
                </div>
                ${this.scheduleTimeEnabled ? b2`
                  <ms-textfield
                    label="${t3("schedule_time_optional", L2)}"
                    type="time"
                    .value=${this._scheduleTime}
                    helper="${t3("schedule_time_help", L2)}"
                    @input=${(e7) => this._scheduleTime = e7.target.value}
                  ></ms-textfield>
                ` : A}
              ` : A}
          ${this._renderCalendarFields()}
          ${this._scheduleType === "one_time" ? b2`
                <ms-textfield
                  label="${t3("due_date", L2)}"
                  type="date"
                  .value=${this._dueDate}
                  @input=${(e7) => this._dueDate = e7.target.value}
                ></ms-textfield>
              ` : A}
          ${this._renderRecurrenceExtras()}
          ${this._renderSchedulePreview()}
          <ms-textfield
            label="${t3("warning_days", L2)}"
            type="number"
            min="0"
            max="365"
            .value=${this._warningDays}
            @input=${(e7) => this._warningDays = e7.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${t3("earliest_completion_days", L2)}"
            helper="${t3("earliest_completion_days_help", L2)}"
            type="number"
            .value=${this._earliestCompletionDays}
            @input=${(e7) => this._earliestCompletionDays = e7.target.value}
          ></ms-textfield>
          ${this.checklistsEnabled ? b2`
            <h3>${t3("checklist_steps_optional", L2)}</h3>
            <textarea
              id="checklist-textarea"
              class="checklist-textarea"
              rows="5"
              placeholder="${t3("checklist_placeholder", L2)}"
              .value=${this._checklistText}
              @input=${(e7) => this._checklistText = e7.target.value}
            ></textarea>
            <div class="field-help">${t3("checklist_help", L2)}</div>
          ` : A}
          <h3>${t3("require_on_completion", L2)}</h3>
          <div class="required-completion">
            ${REQUIRED_COMPLETION_KEYS.map((field) => b2`
              <label class="req-option">
                <input
                  type="checkbox"
                  .checked=${this._requiredCompletion.includes(field)}
                  @change=${(e7) => this._toggleRequired(field, e7.target.checked)}
                />
                <span>${t3(REQUIRED_COMPLETION_LABELS[field], L2)}</span>
              </label>
            `)}
          </div>
          <ms-textfield
            label="${t3("last_performed_optional", L2)}"
            type="date"
            .value=${this._lastPerformed}
            @input=${(e7) => this._lastPerformed = e7.target.value}
          ></ms-textfield>
          <div class="select-row">
            <label>${t3("responsible_user", L2)}</label>
            <select
              .value=${this._responsibleUserId || ""}
              @change=${(e7) => {
          const val = e7.target.value;
          this._responsibleUserId = val || null;
        }}
            >
              <option value="" ?selected=${!this._responsibleUserId}>${t3("no_user_assigned", L2)}</option>
              ${this._availableUsers.map(
          (user) => b2`<option value=${user.id} ?selected=${user.id === this._responsibleUserId}>${user.name}</option>`
        )}
            </select>
          </div>
          ${this._availableUsers.length >= 2 ? b2`
            <div class="field">
              <label>${t3("shared_with", L2)}</label>
              <div class="field-help">${t3("shared_with_help", L2)}</div>
              <div class="assignee-pool">
                ${this._availableUsers.map((user) => b2`
                  <label class="pool-item">
                    <input type="checkbox"
                      .checked=${this._assigneePool.includes(user.id)}
                      @change=${() => this._toggleAssignee(user.id)} />
                    <span>${user.name}</span>
                  </label>`)}
              </div>
            </div>
            ${this._assigneePool.length >= 2 ? b2`
              <div class="select-row">
                <label>${t3("rotation_strategy", L2)}</label>
                <select
                  .value=${this._rotationStrategy}
                  @change=${(e7) => this._rotationStrategy = e7.target.value}
                >
                  <option value="" ?selected=${!this._rotationStrategy}>${t3("rotation_none", L2)}</option>
                  ${["round_robin", "least_completed", "random"].map(
          (key) => b2`<option value=${key} ?selected=${key === this._rotationStrategy}>${t3("rotation_" + key, L2)}</option>`
        )}
                </select>
              </div>` : A}
          ` : A}
          ${this._renderTriggerFields()}
          ${this._scheduleType === "sensor_based" ? b2`
            ${this._entityPickerFallback ? b2`
              <ms-textfield
                label="${t3("environmental_entity_optional", L2)}"
                helper="${t3("environmental_entity_helper", L2)}"
                .value=${this._environmentalEntity}
                @input=${(e7) => this._environmentalEntity = e7.target.value.trim()}
              ></ms-textfield>
            ` : b2`
            <ha-form
              class="entity-picker-form"
              .hass=${this.hass}
              .schema=${[{
          name: "environmental_entity",
          selector: { entity: {
            domain: ENVIRONMENTAL_PICKER_DOMAINS,
            device_class: ENVIRONMENTAL_PICKER_DEVICE_CLASSES
          } }
        }]}
              .data=${{ environmental_entity: this._environmentalEntity }}
              .computeLabel=${() => t3("environmental_entity_optional", L2)}
              .computeHelper=${() => t3("environmental_entity_helper", L2)}
              @value-changed=${(e7) => {
          this._environmentalEntity = (e7.detail.value.environmental_entity || "").trim();
        }}
            ></ha-form>`}
            ${this._environmentalEntity ? this._renderEnvironmentalAttribute(L2) : A}
          ` : A}
          ${this._renderAdaptiveSection(L2)}
          <ms-textfield
            label="${t3("notes_optional", L2)}"
            .value=${this._notes}
            @input=${(e7) => this._notes = e7.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${t3("documentation_url_optional", L2)}"
            .value=${this._documentationUrl}
            @input=${(e7) => this._documentationUrl = e7.target.value}
          ></ms-textfield>
          <ha-icon-picker
            .hass=${this.hass}
            label="${t3("custom_icon_optional", L2)}"
            .value=${this._customIcon}
            @value-changed=${(e7) => this._customIcon = e7.detail.value || ""}
          ></ha-icon-picker>
          ${this._availableTags.length > 0 ? b2`
              <div class="select-row">
                <label>${t3("nfc_tag_id_optional", L2)}</label>
                <select
                  .value=${this._nfcTagId}
                  @change=${(e7) => this._nfcTagId = e7.target.value}
                >
                  <option value="" ?selected=${!this._nfcTagId}>${t3("no_nfc_tag", L2)}</option>
                  ${this._availableTags.map(
          (tag) => b2`<option value=${tag.id} ?selected=${tag.id === this._nfcTagId}>${tag.name}</option>`
        )}
                </select>
                <button type="button" class="link-button" @click=${this._loadTags}
                  title="${t3("nfc_tags_refresh", L2)}">↻</button>
              </div>
            ` : b2`
              <ms-textfield
                label="${t3("nfc_tag_id_optional", L2)}"
                .value=${this._nfcTagId}
                @input=${(e7) => this._nfcTagId = e7.target.value}
              ></ms-textfield>
              <div class="field-help">
                ${t3("nfc_tags_empty_help", L2)}
                <a href="/config/tags">${t3("nfc_tags_open_settings", L2)}</a>
                ·
                <button type="button" class="link-button" @click=${this._loadTags}>
                  ${t3("nfc_tags_refresh", L2)}
                </button>
              </div>
            `}
          <label class="toggle-row">
            <input
              type="checkbox"
              .checked=${this._enabled}
              @change=${(e7) => this._enabled = e7.target.checked}
            />
            ${t3("task_enabled", L2)}
          </label>
          ${this._renderCompletionActionsSection(L2)}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>${t3("cancel", L2)}</ha-button>
          <ha-button
            @click=${this._save}
            .disabled=${this._loading || !this._name.trim()}
          >
            ${this._loading ? t3("saving", L2) : t3("save", L2)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
      }
    };
    _MaintenanceTaskDialog._PREVIEW_RELEVANT = /* @__PURE__ */ new Set([
      "_open",
      "_scheduleType",
      "_intervalDays",
      "_intervalUnit",
      "_intervalAnchor",
      "_dueDate",
      "_weekdays",
      "_nth",
      "_nthWeekday",
      "_domDay",
      "_domLastDay",
      "_domBusiness",
      "_calOffset",
      "_seasonMonths",
      "_endsMode",
      "_endsCount",
      "_endsUntil",
      "_lastPerformed"
    ]);
    _MaintenanceTaskDialog.styles = i`
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
  `;
    __decorateClass([
      n4({ attribute: false })
    ], _MaintenanceTaskDialog.prototype, "hass", 2);
    __decorateClass([
      n4({ type: Boolean, attribute: "checklists-enabled" })
    ], _MaintenanceTaskDialog.prototype, "checklistsEnabled", 2);
    __decorateClass([
      n4({ type: Boolean, attribute: "schedule-time-enabled" })
    ], _MaintenanceTaskDialog.prototype, "scheduleTimeEnabled", 2);
    __decorateClass([
      n4({ type: Boolean, attribute: "completion-actions-enabled" })
    ], _MaintenanceTaskDialog.prototype, "completionActionsEnabled", 2);
    __decorateClass([
      n4({ type: Number, attribute: "default-warning-days" })
    ], _MaintenanceTaskDialog.prototype, "defaultWarningDays", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "parts", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_foreignOwners", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_open", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_entityPickerFallback", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_loading", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_error", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_entryId", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_taskId", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_objectChoices", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_name", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_type", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_scheduleType", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_intervalDays", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_intervalUnit", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_dueDate", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_warningDays", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_earliestCompletionDays", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_intervalAnchor", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_weekdays", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_nth", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_nthWeekday", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_domDay", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_domLastDay", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_domBusiness", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_calOffset", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_seasonMonths", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_endsMode", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_endsCount", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_endsUntil", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_schedulePreview", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_schedulePreviewEnded", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_notes", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_documentationUrl", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_customIcon", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_priority", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_labels", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_enabled", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerEntityId", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerEntityIds", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerEntityLogic", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerAttribute", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerType", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerAbove", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerBelow", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerEquals", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerNotEquals", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerForMinutes", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerCombinator", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerTargetValue", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerDeltaMode", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerBaselineValue", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_liveBaselineValue", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_autoCompleteOnRecovery", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerFromState", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerToState", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerTargetChanges", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerRuntimeHours", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_triggerOnStates", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_compoundLogic", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_compoundConditions", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_suggestedAttributes", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_availableAttributes", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_entityDomain", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_lastPerformed", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_nfcTagId", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_readingUnit", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_consumesParts", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_partsLoadFailed", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_availableTags", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_responsibleUserId", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_assigneePool", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_rotationStrategy", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_availableUsers", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_checklistText", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_requiredCompletion", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_scheduleTime", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_actionService", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_actionTargetEntity", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_actionData", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_actionDataJsonFallback", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_actionTesting", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_actionTestResult", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_actionTestError", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_qcNotes", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_qcCost", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_qcDuration", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_qcFeedback", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_environmentalEntity", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_environmentalAttribute", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_adaptiveEnabled", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_adaptiveAlpha", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_adaptiveMin", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_adaptiveMax", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_adaptiveSeasonal", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_adaptivePrediction", 2);
    __decorateClass([
      r5()
    ], _MaintenanceTaskDialog.prototype, "_conditionAttrOptions", 2);
    MaintenanceTaskDialog = _MaintenanceTaskDialog;
    if (!customElements.get("maintenance-task-dialog")) {
      customElements.define("maintenance-task-dialog", MaintenanceTaskDialog);
    }
  }
});

// components/history-edit-dialog.ts
var MaintenanceHistoryEditDialog;
var init_history_edit_dialog = __esm({
  "components/history-edit-dialog.ts"() {
    "use strict";
    init_lit();
    init_decorators();
    init_styles();
    init_ws_errors();
    MaintenanceHistoryEditDialog = class extends i4 {
      constructor() {
        super(...arguments);
        this._open = false;
        this._saving = false;
        this._error = "";
        this._draft = null;
        // Original snapshot so we can detect "no change" and skip the WS call
        this._originalSnapshot = null;
        this._partOptions = null;
        this._partQty = {};
        this._partQtyOriginal = "";
      }
      get _lang() {
        return langOf(this.hass);
      }
      /** Open the dialog with the given history-entry data. The caller must
       *  pass `original_timestamp` (the entry's current timestamp before edit)
       *  so the backend can find the entry. */
      openEdit(draft) {
        this._draft = { ...draft };
        this._originalSnapshot = { ...draft };
        this._error = "";
        this._open = true;
        this._partOptions = null;
        this._partQty = {};
        this._partQtyOriginal = "";
        void this._loadPartOptions();
      }
      /** The object's own parts + pooled parts this task draws on — from the
       *  instance-wide overview so pooled owners resolve without extra calls. */
      async _loadPartOptions() {
        const draft = this._draft;
        if (!draft) return;
        try {
          const result = await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/parts/overview"
          });
          const options = [];
          for (const row of result.parts || []) {
            const own = row.entry_id === draft.entry_id;
            const linked = row.consumers.some((c4) => c4.entry_id === draft.entry_id && c4.task_id === draft.task_id);
            if (!own && !linked) continue;
            options.push({
              part_id: row.part_id,
              name: row.name,
              entry_id: row.entry_id,
              foreign: !own,
              object_name: row.object_name
            });
          }
          for (const link of draft.used_parts || []) {
            const owner = link.entry_id || draft.entry_id;
            if (!options.some((o7) => o7.part_id === link.part_id && o7.entry_id === owner)) {
              options.push({
                part_id: link.part_id,
                name: link.name || link.part_id,
                entry_id: owner,
                foreign: owner !== draft.entry_id,
                object_name: null
              });
            }
          }
          const qty = {};
          for (const link of draft.used_parts || []) {
            qty[`${link.entry_id || draft.entry_id}:${link.part_id}`] = link.quantity ?? 1;
          }
          this._partOptions = options;
          this._partQty = qty;
          this._partQtyOriginal = this._partSelectionKey();
        } catch {
          this._partOptions = [];
        }
      }
      _partSelectionKey() {
        return JSON.stringify(
          Object.entries(this._partQty).filter(([, q]) => q > 0).sort(([a3], [b3]) => a3.localeCompare(b3))
        );
      }
      close() {
        this._open = false;
        this._error = "";
        this._draft = null;
        this._originalSnapshot = null;
      }
      _set(key, value) {
        if (!this._draft) return;
        this._draft = { ...this._draft, [key]: value };
      }
      async _save() {
        if (!this._draft || !this._originalSnapshot) return;
        this._saving = true;
        this._error = "";
        try {
          const patch = {
            type: "maintenance_supporter/task/history/update",
            entry_id: this._draft.entry_id,
            task_id: this._draft.task_id,
            original_timestamp: this._originalSnapshot.original_timestamp
          };
          if (this._draft.timestamp !== this._originalSnapshot.timestamp) {
            patch.timestamp = this._draft.timestamp;
          }
          if (this._draft.notes !== this._originalSnapshot.notes) {
            patch.notes = this._draft.notes;
          }
          if (this._draft.cost !== this._originalSnapshot.cost) {
            patch.cost = this._draft.cost;
          }
          if (this._draft.duration !== this._originalSnapshot.duration) {
            patch.duration = this._draft.duration;
          }
          if (this._draft.completed_by !== this._originalSnapshot.completed_by) {
            patch.completed_by = this._draft.completed_by;
          }
          if (this._partOptions !== null && this._partSelectionKey() !== this._partQtyOriginal) {
            patch.used_parts = (this._partOptions || []).filter((o7) => (this._partQty[`${o7.entry_id}:${o7.part_id}`] || 0) > 0).map((o7) => ({
              part_id: o7.part_id,
              quantity: this._partQty[`${o7.entry_id}:${o7.part_id}`],
              ...o7.foreign ? { entry_id: o7.entry_id } : {}
            }));
          }
          const changedKeys = Object.keys(patch).filter(
            (k2) => !["type", "entry_id", "task_id", "original_timestamp"].includes(k2)
          );
          if (changedKeys.length === 0) {
            this.close();
            return;
          }
          await this.hass.connection.sendMessagePromise(patch);
          this.dispatchEvent(
            new CustomEvent("history-entry-saved", {
              detail: {
                entry_id: this._draft.entry_id,
                task_id: this._draft.task_id,
                new_timestamp: this._draft.timestamp
              },
              bubbles: true,
              composed: true
            })
          );
          this.close();
        } catch (e7) {
          this._error = describeWsError(e7, this._lang);
        } finally {
          this._saving = false;
        }
      }
      render() {
        if (!this._open || !this._draft) return A;
        const L2 = this._lang;
        const d3 = this._draft;
        return b2`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        <h2>${t3("history_edit_title", L2) || "Edit history entry"}</h2>
        <div class="entry-type">
          <ha-icon icon="mdi:tag-outline"></ha-icon>
          <span>${t3(d3.type, L2) || d3.type}</span>
        </div>
        <label>
          <span>${t3("history_edit_timestamp", L2) || "Timestamp"}</span>
          <input type="datetime-local"
            .value=${d3.timestamp.length >= 16 ? d3.timestamp.slice(0, 16) : d3.timestamp}
            @change=${(e7) => {
          const v2 = e7.target.value;
          this._set("timestamp", v2.length === 16 ? `${v2}:00` : v2);
        }} />
        </label>
        <label>
          <span>${t3("notes_label", L2)}</span>
          <textarea
            rows="3"
            @input=${(e7) => {
          const v2 = e7.target.value;
          this._set("notes", v2 ? v2 : null);
        }}
            .value=${d3.notes ?? ""}></textarea>
        </label>
        <div class="row">
          <label>
            <span>${t3("cost", L2) || "Cost"}</span>
            <input type="number" min="0" step="0.01"
              .value=${d3.cost != null ? String(d3.cost) : ""}
              @input=${(e7) => {
          const v2 = e7.target.value;
          this._set("cost", v2 ? Number(v2) : null);
        }} />
          </label>
          <label>
            <span>${t3("duration", L2) || "Duration (min)"}</span>
            <input type="number" min="0"
              .value=${d3.duration != null ? String(d3.duration) : ""}
              @input=${(e7) => {
          const v2 = e7.target.value;
          this._set("duration", v2 ? Number(v2) : null);
        }} />
          </label>
        </div>
        ${this._partOptions && this._partOptions.length > 0 ? b2`
          <div class="parts-block">
            <span class="parts-title">${t3("complete_parts_used", L2)}</span>
            ${this._partOptions.map((o7) => {
          const key = `${o7.entry_id}:${o7.part_id}`;
          const qty = this._partQty[key] || 0;
          return b2`
                <label class="part-row-edit">
                  <input type="checkbox" .checked=${qty > 0}
                    @change=${(e7) => {
            const on = e7.target.checked;
            this._partQty = { ...this._partQty, [key]: on ? 1 : 0 };
          }} />
                  <span class="part-label">${o7.name}${o7.foreign && o7.object_name ? ` (${o7.object_name})` : ""}</span>
                  ${qty > 0 ? b2`
                    <input class="part-qty" type="number" min="0.01" max="999" step="0.01"
                      .value=${String(qty)}
                      @input=${(e7) => {
            const v2 = parseFloat(e7.target.value);
            if (!isNaN(v2) && v2 > 0) this._partQty = { ...this._partQty, [key]: v2 };
          }} />
                  ` : A}
                </label>
              `;
        })}
          </div>
        ` : A}
        ${this._error ? b2`<div class="error">${this._error}</div>` : A}
        <div class="actions">
          <button class="cancel" @click=${this.close} ?disabled=${this._saving}>
            ${t3("cancel", L2) || "Cancel"}
          </button>
          <button class="save" @click=${this._save} ?disabled=${this._saving}>
            ${this._saving ? t3("saving", L2) || "Saving\u2026" : t3("save", L2) || "Save"}
          </button>
        </div>
      </div>
    `;
      }
    };
    MaintenanceHistoryEditDialog.styles = i`
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
  `;
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceHistoryEditDialog.prototype, "hass", 2);
    __decorateClass([
      r5()
    ], MaintenanceHistoryEditDialog.prototype, "_open", 2);
    __decorateClass([
      r5()
    ], MaintenanceHistoryEditDialog.prototype, "_saving", 2);
    __decorateClass([
      r5()
    ], MaintenanceHistoryEditDialog.prototype, "_error", 2);
    __decorateClass([
      r5()
    ], MaintenanceHistoryEditDialog.prototype, "_draft", 2);
    __decorateClass([
      r5()
    ], MaintenanceHistoryEditDialog.prototype, "_partOptions", 2);
    __decorateClass([
      r5()
    ], MaintenanceHistoryEditDialog.prototype, "_partQty", 2);
    if (!customElements.get("maintenance-history-edit-dialog")) {
      customElements.define(
        "maintenance-history-edit-dialog",
        MaintenanceHistoryEditDialog
      );
    }
  }
});

// components/qr-dialog.ts
function escapeHtml(s4) {
  return s4.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function sanitizeDataUri(uri) {
  if (!uri.startsWith("data:image/svg+xml,") && !uri.startsWith("data:image/png;base64,")) {
    return "";
  }
  return escapeHtml(uri);
}
function sanitizeFilename(s4) {
  return s4.replace(/[/\\:*?"<>|#%]+/g, "").replace(/\s+/g, "-").toLowerCase().substring(0, 100);
}
var MaintenanceQrDialog;
var init_qr_dialog = __esm({
  "components/qr-dialog.ts"() {
    "use strict";
    init_lit();
    init_decorators();
    init_styles();
    init_download();
    MaintenanceQrDialog = class extends i4 {
      constructor() {
        super(...arguments);
        this.lang = "en";
        this._open = false;
        this._loading = false;
        this._error = "";
        this._viewResult = null;
        this._completeResult = null;
        this._urlMode = "companion";
        this._entryId = "";
        this._taskId = null;
        this._objectName = "";
        this._taskName = "";
        this._generateSeq = 0;
      }
      openForObject(entryId, objectName) {
        this._entryId = entryId;
        this._taskId = null;
        this._objectName = objectName;
        this._taskName = "";
        this._urlMode = "companion";
        this._error = "";
        this._viewResult = null;
        this._completeResult = null;
        this._open = true;
        this._generate();
      }
      openForTask(entryId, taskId, objectName, taskName) {
        this._entryId = entryId;
        this._taskId = taskId;
        this._objectName = objectName;
        this._taskName = taskName;
        this._urlMode = "companion";
        this._error = "";
        this._viewResult = null;
        this._completeResult = null;
        this._open = true;
        this._generate();
      }
      async _generate() {
        const seq = ++this._generateSeq;
        this._loading = true;
        this._error = "";
        this._viewResult = null;
        this._completeResult = null;
        try {
          const base = {
            type: "maintenance_supporter/qr/generate",
            entry_id: this._entryId,
            url_mode: this._urlMode
          };
          if (this._taskId) base.task_id = this._taskId;
          const promises = [
            this.hass.connection.sendMessagePromise({ ...base, action: "view" })
          ];
          if (this._taskId) {
            promises.push(
              this.hass.connection.sendMessagePromise({ ...base, action: "complete" })
            );
          }
          const results = await Promise.all(promises);
          if (seq !== this._generateSeq) return;
          this._viewResult = results[0];
          if (results.length > 1) {
            this._completeResult = results[1];
          }
        } catch (err) {
          if (seq !== this._generateSeq) return;
          const code = err?.code;
          const msg = err?.message;
          this._error = code === "no_url" || typeof msg === "string" && msg.includes("No Home Assistant URL") ? t3("qr_error_no_url", this.lang) : t3("qr_error", this.lang);
        } finally {
          if (seq === this._generateSeq) this._loading = false;
        }
      }
      _setUrlMode(mode) {
        if (this._urlMode === mode) return;
        this._urlMode = mode;
        this._generate();
      }
      _print() {
        if (!this._viewResult) return;
        const r6 = this._viewResult;
        const title = r6.label.task_name ? `${r6.label.object_name} \u2014 ${r6.label.task_name}` : r6.label.object_name;
        const subtitle = [r6.label.manufacturer, r6.label.model].filter(Boolean).join(" ");
        const w2 = window.open("", "_blank", "width=600,height=500");
        if (!w2) return;
        const L2 = this.lang || "en";
        const safeTitle = escapeHtml(title);
        const safeSub = escapeHtml(subtitle);
        const hasComplete = !!this._completeResult;
        const viewLabel = escapeHtml(t3("qr_action_view", L2));
        const completeLabel = escapeHtml(t3("qr_action_complete", L2));
        w2.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${safeTitle}</title>
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
  .qr-col img{width:${hasComplete ? "200px" : "280px"}}
  .qr-label{font-size:13px;font-weight:500;color:#333}
  .url{font-size:10px;color:#999;word-break:break-all;margin-top:8px;max-width:480px}
</style></head><body>
<h2>${safeTitle}</h2>
${safeSub ? `<div class="sub">${safeSub}</div>` : ""}
<div class="qr-row">
  <div class="qr-col">
    <img src="${sanitizeDataUri(this._viewResult.svg_data_uri)}" alt="QR Info" />
    <div class="qr-label">${viewLabel}</div>
  </div>
  ${hasComplete ? `<div class="qr-col">
    <img src="${sanitizeDataUri(this._completeResult.svg_data_uri)}" alt="QR Complete" />
    <div class="qr-label">${completeLabel}</div>
  </div>` : ""}
</div>
<div class="url">${escapeHtml(this._viewResult.url)}</div>
<script>setTimeout(()=>window.print(),300)<\/script>
</body></html>`);
        w2.document.close();
      }
      _downloadSvg(result, suffix) {
        const svgContent = decodeURIComponent(
          result.svg_data_uri.replace("data:image/svg+xml,", "")
        );
        const name = this._taskName ? `${this._objectName}-${this._taskName}` : this._objectName;
        downloadTextFile(svgContent, `qr-${sanitizeFilename(name)}-${suffix}.svg`, "image/svg+xml");
      }
      _close() {
        this._open = false;
        this._viewResult = null;
        this._completeResult = null;
        this._error = "";
        this._loading = false;
      }
      render() {
        if (!this._open) return b2``;
        const L2 = this.lang || this.hass?.language || "en";
        const heading = this._taskName ? `${t3("qr_code", L2)}: ${this._objectName} \u2014 ${this._taskName}` : `${t3("qr_code", L2)}: ${this._objectName}`;
        const hasResults = !!this._viewResult;
        return b2`
      <ha-dialog open @closed=${this._close}>
        <div class="dialog-title">${heading}</div>
        <div class="content">
          ${this._loading ? b2`<div class="loading">${t3("qr_generating", L2)}</div>` : this._error ? b2`<div class="error">${this._error}</div>` : hasResults ? b2`
                    <div class="qr-pair">
                      <div class="qr-item">
                        <img
                          class="qr-image ${this._completeResult ? "small" : ""}"
                          src="${this._viewResult.svg_data_uri}"
                          alt="QR Info"
                        />
                        <div class="qr-item-label">${t3("qr_action_view", L2)}</div>
                        <button class="dl-btn"
                          @click=${() => this._downloadSvg(this._viewResult, "info")}>
                          <ha-icon icon="mdi:download"></ha-icon>
                          ${t3("qr_download", L2)}
                        </button>
                      </div>
                      ${this._completeResult ? b2`
                            <div class="qr-item">
                              <img
                                class="qr-image small"
                                src="${this._completeResult.svg_data_uri}"
                                alt="QR Complete"
                              />
                              <div class="qr-item-label">${t3("qr_action_complete", L2)}</div>
                              <button class="dl-btn"
                                @click=${() => this._downloadSvg(this._completeResult, "complete")}>
                                <ha-icon icon="mdi:download"></ha-icon>
                                ${t3("qr_download", L2)}
                              </button>
                            </div>
                          ` : A}
                    </div>
                    <div class="url-display">${this._viewResult.url}</div>
                  ` : A}
          <div class="action-row">
            <label>${t3("qr_url_mode", L2)}</label>
            <div class="action-toggle">
              <button class="toggle-btn ${this._urlMode === "companion" ? "active" : ""}"
                @click=${() => this._setUrlMode("companion")}>${t3("qr_mode_companion", L2)}</button>
              <button class="toggle-btn ${this._urlMode === "local" ? "active" : ""}"
                @click=${() => this._setUrlMode("local")}>${t3("qr_mode_local", L2)}</button>
              <button class="toggle-btn ${this._urlMode === "server" ? "active" : ""}"
                @click=${() => this._setUrlMode("server")}>${t3("qr_mode_server", L2)}</button>
            </div>
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${t3("cancel", L2)}
          </ha-button>
          <ha-button
            @click=${this._print}
            .disabled=${!hasResults}
          >
            ${t3("qr_print", L2)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
      }
    };
    MaintenanceQrDialog.styles = i`
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
  `;
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceQrDialog.prototype, "hass", 2);
    __decorateClass([
      n4()
    ], MaintenanceQrDialog.prototype, "lang", 2);
    __decorateClass([
      r5()
    ], MaintenanceQrDialog.prototype, "_open", 2);
    __decorateClass([
      r5()
    ], MaintenanceQrDialog.prototype, "_loading", 2);
    __decorateClass([
      r5()
    ], MaintenanceQrDialog.prototype, "_error", 2);
    __decorateClass([
      r5()
    ], MaintenanceQrDialog.prototype, "_viewResult", 2);
    __decorateClass([
      r5()
    ], MaintenanceQrDialog.prototype, "_completeResult", 2);
    __decorateClass([
      r5()
    ], MaintenanceQrDialog.prototype, "_urlMode", 2);
    if (!customElements.get("maintenance-qr-dialog")) {
      customElements.define("maintenance-qr-dialog", MaintenanceQrDialog);
    }
  }
});

// helpers/interval.ts
function intervalSpanDays(intervalDays, unit) {
  if (!intervalDays || intervalDays <= 0) return 0;
  return intervalDays * (UNIT_DAYS[unit || "days"] ?? 1);
}
function daysProgress(intervalDays, daysUntilDue, unit) {
  const span = intervalSpanDays(intervalDays, unit);
  if (span <= 0 || daysUntilDue == null) return { pct: 0, overflow: false };
  const raw = (span - daysUntilDue) / span * 100;
  return { pct: Math.max(0, Math.min(100, raw)), overflow: raw > 100 };
}
var UNIT_DAYS;
var init_interval = __esm({
  "helpers/interval.ts"() {
    "use strict";
    UNIT_DAYS = {
      days: 1,
      weeks: 7,
      months: 30.4368,
      years: 365.25
    };
  }
});

// helpers/calendar-bucket.ts
function isoDateLocal(d3) {
  const y3 = d3.getFullYear();
  const m2 = String(d3.getMonth() + 1).padStart(2, "0");
  const day = String(d3.getDate()).padStart(2, "0");
  return `${y3}-${m2}-${day}`;
}
function buildWindowDates(today, windowDays) {
  const out = [];
  for (let i6 = 0; i6 < windowDays; i6++) {
    const d3 = new Date(today);
    d3.setDate(d3.getDate() + i6);
    d3.setHours(0, 0, 0, 0);
    out.push(isoDateLocal(d3));
  }
  return out;
}
function addDaysIso(iso, days) {
  const [y3, m2, d3] = iso.split("-").map(Number);
  const date = new Date(y3, m2 - 1, d3);
  date.setDate(date.getDate() + days);
  return isoDateLocal(date);
}
function computeAvgCost(history2) {
  if (!history2 || history2.length === 0) return null;
  const costs = history2.map((h3) => h3.cost).filter((c4) => typeof c4 === "number");
  if (costs.length === 0) return null;
  return costs.reduce((a3, b3) => a3 + b3, 0) / costs.length;
}
function projectTask(input) {
  const { windowStart, windowEnd, task, entryId, objectName } = input;
  const out = [];
  const baseEvent = (date, projected) => ({
    date,
    entry_id: entryId,
    task_id: task.id,
    task_name: task.name,
    object_name: objectName,
    // Projected recurrences are hypothetical future occurrences that assume
    // the current cycle resolves on schedule. If the parent task is currently
    // overdue/triggered, carrying that status forward to the projection (e.g.
    // "OVERDUE 211d" on the May 7 projection of a 7-day-interval task) is
    // misleading — the projection IS the assumption that the user completes
    // it today, so the projected slot should read as a fresh "ok" event.
    status: projected && (task.status === "overdue" || task.status === "triggered") ? "ok" : task.status,
    days_until_due: projected ? null : task.days_until_due ?? null,
    projected,
    schedule_type: task.schedule_type,
    interval_days: task.interval_days ?? null,
    interval_unit: task.interval_unit ?? null,
    responsible_user_id: task.responsible_user_id ?? null,
    avg_cost: computeAvgCost(task.history),
    adaptive_enabled: !!task.adaptive_config?.enabled,
    prediction_confidence: task.threshold_prediction_confidence ?? null
  });
  const stepDays = Math.max(
    1,
    Math.round(intervalSpanDays(task.interval_days, task.interval_unit))
  );
  if (task.status === "overdue" || task.status === "triggered") {
    out.push(baseEvent(windowStart, false));
    if (task.schedule_type === "time_based" && task.interval_days && task.interval_days > 0) {
      let cursor = addDaysIso(windowStart, stepDays);
      let count = 1;
      while (cursor <= windowEnd && count < MAX_OCCURRENCES_PER_TASK) {
        out.push(baseEvent(cursor, true));
        count++;
        cursor = addDaysIso(cursor, stepDays);
      }
    }
    return out;
  }
  const nextDue = task.next_due;
  if (typeof nextDue !== "string" || !nextDue) return out;
  const firstDate = nextDue.slice(0, 10);
  if (firstDate >= windowStart && firstDate <= windowEnd) {
    out.push(baseEvent(firstDate, false));
  } else if (firstDate > windowEnd) {
    return out;
  }
  if (task.schedule_type === "time_based" && task.interval_days && task.interval_days > 0) {
    let cursor = addDaysIso(firstDate, stepDays);
    let count = out.length;
    while (cursor <= windowEnd && count < MAX_OCCURRENCES_PER_TASK) {
      if (cursor >= windowStart) {
        out.push(baseEvent(cursor, true));
        count++;
      }
      cursor = addDaysIso(cursor, stepDays);
    }
  }
  return out;
}
function buildCalendarBuckets(objects, today, windowDays, userFilter = null) {
  const days = buildWindowDates(today, windowDays);
  const windowStart = days[0];
  const windowEnd = days[days.length - 1];
  const allEvents = [];
  for (const obj of objects) {
    const objectName = obj.object?.name || "";
    const entryId = obj.entry_id;
    const tasks = obj.tasks || [];
    for (const task of tasks) {
      if (userFilter && task.responsible_user_id !== userFilter) continue;
      if (task.enabled === false) continue;
      const projected = projectTask({
        windowStart,
        windowEnd,
        task,
        entryId,
        objectName
      });
      allEvents.push(...projected);
    }
  }
  const byDate = /* @__PURE__ */ new Map();
  for (const day of days) byDate.set(day, []);
  for (const ev of allEvents) {
    const bucket = byDate.get(ev.date);
    if (bucket) bucket.push(ev);
  }
  for (const [, evs] of byDate) {
    evs.sort((a3, b3) => {
      const rA = STATUS_RANK[a3.status] ?? 99;
      const rB = STATUS_RANK[b3.status] ?? 99;
      if (rA !== rB) return rA - rB;
      if (a3.projected !== b3.projected) return a3.projected ? 1 : -1;
      const cmp = a3.object_name.localeCompare(b3.object_name);
      if (cmp !== 0) return cmp;
      return a3.task_name.localeCompare(b3.task_name);
    });
  }
  return days.map((d3) => ({ date: d3, events: byDate.get(d3) ?? [] }));
}
function buildPastWindowDates(today, pastDays) {
  const out = [];
  for (let i6 = pastDays - 1; i6 >= 0; i6--) {
    const d3 = new Date(today);
    d3.setDate(d3.getDate() - i6);
    d3.setHours(0, 0, 0, 0);
    out.push(isoDateLocal(d3));
  }
  return out;
}
function buildPastBuckets(objects, today, pastDays, userFilter = null) {
  const days = buildPastWindowDates(today, pastDays);
  const windowStart = days[0];
  const windowEnd = days[days.length - 1];
  const byDate = /* @__PURE__ */ new Map();
  for (const day of days) byDate.set(day, []);
  for (const obj of objects) {
    const objectName = obj.object?.name || "";
    const entryId = obj.entry_id;
    const tasks = obj.tasks || [];
    for (const task of tasks) {
      if (userFilter && task.responsible_user_id !== userFilter) continue;
      const history2 = task.history || [];
      for (const h3 of history2) {
        if (typeof h3?.timestamp !== "string") continue;
        const dateKey = h3.timestamp.slice(0, 10);
        if (dateKey < windowStart || dateKey > windowEnd) continue;
        const bucket = byDate.get(dateKey);
        if (!bucket) continue;
        const evType = h3.type ?? "completed";
        bucket.push({
          date: dateKey,
          entry_id: entryId,
          task_id: task.id,
          task_name: task.name,
          object_name: objectName,
          status: HISTORY_TYPE_TO_STATUS[evType] ?? "ok",
          days_until_due: null,
          projected: false,
          schedule_type: task.schedule_type,
          interval_days: task.interval_days ?? null,
          responsible_user_id: task.responsible_user_id ?? null,
          avg_cost: typeof h3.cost === "number" ? h3.cost : null,
          adaptive_enabled: !!task.adaptive_config?.enabled,
          prediction_confidence: null,
          history_timestamp: h3.timestamp,
          history_type: evType,
          history_cost: typeof h3.cost === "number" ? h3.cost : null,
          history_notes: typeof h3.notes === "string" ? h3.notes : null,
          history_duration: typeof h3.duration === "number" ? h3.duration : null
        });
      }
    }
  }
  const PAST_TYPE_RANK = {
    completed: 0,
    reset: 1,
    skipped: 2,
    triggered: 3,
    trigger_replaced: 4
  };
  for (const [, evs] of byDate) {
    evs.sort((a3, b3) => {
      const rA = PAST_TYPE_RANK[a3.history_type ?? ""] ?? 99;
      const rB = PAST_TYPE_RANK[b3.history_type ?? ""] ?? 99;
      if (rA !== rB) return rA - rB;
      const cmp = a3.object_name.localeCompare(b3.object_name);
      if (cmp !== 0) return cmp;
      return a3.task_name.localeCompare(b3.task_name);
    });
  }
  return days.map((d3) => ({ date: d3, events: byDate.get(d3) ?? [] }));
}
var MAX_OCCURRENCES_PER_TASK, STATUS_RANK, HISTORY_TYPE_TO_STATUS;
var init_calendar_bucket = __esm({
  "helpers/calendar-bucket.ts"() {
    "use strict";
    init_interval();
    MAX_OCCURRENCES_PER_TASK = 5;
    STATUS_RANK = {
      overdue: 0,
      triggered: 1,
      due_soon: 2,
      ok: 3
    };
    HISTORY_TYPE_TO_STATUS = {
      completed: "ok",
      reset: "ok",
      skipped: "due_soon",
      // A cycle that was NOT done in time (skip-while-overdue writes it, and the
      // coordinator stamps it automatically) — must never paint green. Found by
      // the 2026-08 drift audit: the missing entry fell through to "ok".
      missed: "overdue",
      triggered: "triggered",
      trigger_replaced: "triggered",
      trigger_removed: "ok"
      // config change, not a due/triggered event
    };
  }
});

// renderers/weibull.ts
function renderWeibullSection(task, lang) {
  const analysis = task.interval_analysis;
  const beta = analysis?.weibull_beta;
  const eta = analysis?.weibull_eta;
  if (beta == null || eta == null || eta <= 0) return A;
  const currentInterval = task.interval_days ?? 0;
  const rec = task.suggested_interval ?? currentInterval;
  return b2`
    <div class="weibull-section">
      <div class="weibull-title">
        <ha-svg-icon aria-hidden="true" path="M3,14L3.5,14.07L8.07,9.5C7.89,8.85 8.06,8.11 8.59,7.59C9.37,6.8 10.63,6.8 11.41,7.59C11.94,8.11 12.11,8.85 11.93,9.5L14.5,12.07L15,12C15.18,12 15.35,12 15.5,12.07L19.07,8.5C19,8.35 19,8.18 19,8A2,2 0 0,1 21,6A2,2 0 0,1 23,8A2,2 0 0,1 21,10C20.82,10 20.65,10 20.5,9.93L16.93,13.5C17,13.65 17,13.82 17,14A2,2 0 0,1 15,16A2,2 0 0,1 13,14L13.07,13.5L10.5,10.93C10.18,11 9.82,11 9.5,10.93L4.93,15.5L5,16A2,2 0 0,1 3,18A2,2 0 0,1 1,16A2,2 0 0,1 3,14Z"></ha-svg-icon>
        ${t3("weibull_reliability_curve", lang)}
        ${renderBetaBadge(beta, lang)}
      </div>
      ${renderWeibullChart(beta, eta, currentInterval, rec, lang)}
      ${renderWeibullInfo(analysis, lang)}
      ${analysis?.confidence_interval_low != null ? renderConfidenceInterval(analysis, task, lang) : A}
    </div>
  `;
}
function renderBetaBadge(beta, lang) {
  let cls;
  let icon;
  let key;
  if (beta < 0.8) {
    cls = "early_failures";
    icon = "M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z";
    key = "beta_early_failures";
  } else if (beta <= 1.2) {
    cls = "random_failures";
    icon = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,17H11V15H13V17M13,13H11V7H13V13Z";
    key = "beta_random_failures";
  } else if (beta <= 3.5) {
    cls = "wear_out";
    icon = "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12H12V6Z";
    key = "beta_wear_out";
  } else {
    cls = "highly_predictable";
    icon = "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.91,10.59L6.5,12L11,16.5Z";
    key = "beta_highly_predictable";
  }
  return b2`
    <span class="beta-badge ${cls}">
      <ha-svg-icon path="${icon}"></ha-svg-icon>
      ${t3(key, lang)} (\u03B2=${beta.toFixed(2)})
    </span>
  `;
}
function renderWeibullChart(beta, eta, currentInterval, recommended, lang) {
  const W = 300, H3 = 160;
  const PAD_L2 = 32, PAD_R2 = 8, PAD_T3 = 8, PAD_B3 = 24;
  const chartW = W - PAD_L2 - PAD_R2;
  const chartH = H3 - PAD_T3 - PAD_B3;
  const maxT = Math.max(currentInterval, recommended, eta, 1) * 1.3;
  const N2 = 50;
  const points = [];
  for (let i6 = 0; i6 <= N2; i6++) {
    const t_val = i6 / N2 * maxT;
    const cdf = 1 - Math.exp(-Math.pow(t_val / eta, beta));
    const x2 = PAD_L2 + t_val / maxT * chartW;
    const y3 = PAD_T3 + chartH - cdf * chartH;
    points.push([x2, y3]);
  }
  const polyline = points.map(([x2, y3]) => `${x2.toFixed(1)},${y3.toFixed(1)}`).join(" ");
  const areaPath = `M${PAD_L2},${PAD_T3 + chartH} ` + points.map(([x2, y3]) => `L${x2.toFixed(1)},${y3.toFixed(1)}`).join(" ") + ` L${points[N2][0].toFixed(1)},${PAD_T3 + chartH} Z`;
  const curX = PAD_L2 + currentInterval / maxT * chartW;
  const curCdf = 1 - Math.exp(-Math.pow(currentInterval / eta, beta));
  const curY = PAD_T3 + chartH - curCdf * chartH;
  const reliability = ((1 - curCdf) * 100).toFixed(0);
  const recX = PAD_L2 + recommended / maxT * chartW;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];
  return b2`
    <div class="weibull-chart">
      <svg viewBox="0 0 ${W} ${H3}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t3("chart_weibull", lang)}">
        ${yTicks.map((tick) => {
    const y3 = PAD_T3 + chartH - tick * chartH;
    return w`
            <line x1="${PAD_L2}" y1="${y3.toFixed(1)}" x2="${W - PAD_R2}" y2="${y3.toFixed(1)}"
              stroke="var(--divider-color)" stroke-width="0.5" stroke-dasharray="${tick === 0.5 ? "4,3" : A}" />
            <text x="${PAD_L2 - 4}" y="${(y3 + 3).toFixed(1)}" fill="var(--secondary-text-color)"
              font-size="8" text-anchor="end">${(tick * 100).toFixed(0)}%</text>
          `;
  })}

        <text x="${PAD_L2}" y="${H3 - 4}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">0</text>
        <text x="${(PAD_L2 + W - PAD_R2) / 2}" y="${H3 - 4}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(maxT / 2)}</text>
        <text x="${W - PAD_R2}" y="${H3 - 4}" fill="var(--secondary-text-color)" font-size="8" text-anchor="middle">${Math.round(maxT)}</text>

        <path d="${areaPath}" fill="var(--primary-color, #03a9f4)" opacity="0.08" />
        <polyline points="${polyline}" fill="none"
          stroke="var(--primary-color, #03a9f4)" stroke-width="2" />

        ${currentInterval > 0 ? w`
          <line x1="${curX.toFixed(1)}" y1="${PAD_T3}" x2="${curX.toFixed(1)}" y2="${(PAD_T3 + chartH).toFixed(1)}"
            stroke="var(--primary-color, #03a9f4)" stroke-width="1.5" stroke-dasharray="4,3" />
          <circle cx="${curX.toFixed(1)}" cy="${curY.toFixed(1)}" r="3"
            fill="var(--primary-color, #03a9f4)" />
          <text x="${(curX + 4).toFixed(1)}" y="${(curY - 6).toFixed(1)}" fill="var(--primary-color, #03a9f4)"
            font-size="9" font-weight="600">R=${reliability}%</text>
        ` : A}

        ${recommended > 0 && recommended !== currentInterval ? w`
          <line x1="${recX.toFixed(1)}" y1="${PAD_T3}" x2="${recX.toFixed(1)}" y2="${(PAD_T3 + chartH).toFixed(1)}"
            stroke="var(--success-color, #4caf50)" stroke-width="1.5" stroke-dasharray="4,3" />
        ` : A}

        <line x1="${PAD_L2}" y1="${PAD_T3}" x2="${PAD_L2}" y2="${PAD_T3 + chartH}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
        <line x1="${PAD_L2}" y1="${PAD_T3 + chartH}" x2="${W - PAD_R2}" y2="${PAD_T3 + chartH}"
          stroke="var(--secondary-text-color)" stroke-width="1" />
      </svg>
    </div>
    <div class="chart-legend">
      <span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4)"></span> ${t3("weibull_failure_probability", lang)}</span>
      ${currentInterval > 0 ? b2`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color, #03a9f4); opacity:0.5"></span> ${t3("current_interval_marker", lang)}</span>` : A}
      ${recommended > 0 && recommended !== currentInterval ? b2`<span class="legend-item"><span class="legend-swatch" style="background:var(--success-color, #4caf50)"></span> ${t3("recommended_marker", lang)}</span>` : A}
    </div>
  `;
}
function renderWeibullInfo(analysis, lang) {
  return b2`
    <div class="weibull-info-row">
      <div class="weibull-info-item">
        <span>${t3("characteristic_life", lang)}</span>
        <span class="weibull-info-value">${Math.round(analysis.weibull_eta)} ${t3("days", lang)}</span>
      </div>
      ${analysis.weibull_r_squared != null ? b2`
        <div class="weibull-info-item">
          <span>${t3("weibull_r_squared", lang)}</span>
          <span class="weibull-info-value">${analysis.weibull_r_squared.toFixed(3)}</span>
        </div>
      ` : A}
    </div>
  `;
}
function renderConfidenceInterval(analysis, task, lang) {
  const low = analysis.confidence_interval_low;
  const high = analysis.confidence_interval_high;
  const rec = task.suggested_interval ?? task.interval_days ?? 0;
  const current = task.interval_days ?? 0;
  const barMin = Math.max(0, low - 5);
  const barMax = high + 5;
  const range = barMax - barMin;
  const fillLeft = (low - barMin) / range * 100;
  const fillWidth = (high - low) / range * 100;
  const recPos = (rec - barMin) / range * 100;
  const curPos = current > 0 ? (current - barMin) / range * 100 : -1;
  return b2`
    <div class="confidence-range">
      <div class="confidence-range-title">
        ${t3("confidence_interval", lang)}: ${rec} ${t3("days", lang)} (${low}\u2013${high})
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill" style="left:${fillLeft.toFixed(1)}%;width:${fillWidth.toFixed(1)}%"></div>
        ${curPos >= 0 ? b2`<div class="confidence-marker current" style="left:${curPos.toFixed(1)}%"></div>` : A}
        <div class="confidence-marker recommended" style="left:${recPos.toFixed(1)}%"></div>
      </div>
      <div class="confidence-labels">
        <span class="confidence-text low">${t3("confidence_conservative", lang)} (${low}${t3("days", lang).charAt(0)})</span>
        <span class="confidence-text high">${t3("confidence_aggressive", lang)} (${high}${t3("days", lang).charAt(0)})</span>
      </div>
    </div>
  `;
}
var init_weibull = __esm({
  "renderers/weibull.ts"() {
    "use strict";
    init_lit();
    init_styles();
  }
});

// renderers/prediction.ts
function renderPredictionSection(task, lang, features) {
  const hasDegradation = task.degradation_trend != null && task.degradation_trend !== "insufficient_data";
  const hasThreshold = task.days_until_threshold != null;
  const hasEnv = task.environmental_factor != null && task.environmental_factor !== 1;
  if (!hasDegradation && !hasThreshold && !hasEnv) return A;
  const trendIcon = task.degradation_trend === "rising" ? "M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" : task.degradation_trend === "falling" ? "M16,18L18.29,15.71L13.41,10.83L9.41,14.83L2,7.41L3.41,6L9.41,12L13.41,8L19.71,14.29L22,12V18H16Z" : "M22,12L18,8V11H3V13H18V16L22,12Z";
  return b2`
    <div class="prediction-section">
      ${task.sensor_prediction_urgency ? b2`
        <div class="prediction-urgency-banner">
          <ha-svg-icon path="M1,21H23L12,2L1,21M12,18A1,1 0 0,1 11,17A1,1 0 0,1 12,16A1,1 0 0,1 13,17A1,1 0 0,1 12,18M13,15H11V10H13V15Z"></ha-svg-icon>
          ${t3("sensor_prediction_urgency", lang).replace("{days}", String(Math.round(task.days_until_threshold || 0)))}
        </div>
      ` : A}
      <div class="prediction-title">
        <ha-svg-icon path="M2,2V4H7V2H2M22,2V4H13V2H22M7,7V9H2V7H7M22,7V9H13V7H22M7,12V14H2V12H7M22,12V14H13V12H22M7,17V19H2V17H7M22,17V19H13V17H22M9,2V19L12,22L15,19V2H9M11,4H13V17.17L12,18.17L11,17.17V4Z"></ha-svg-icon>
        ${t3("sensor_prediction", lang)}
      </div>
      <div class="prediction-grid">
        ${hasDegradation ? b2`
          <div class="prediction-item">
            <ha-svg-icon path="${trendIcon}"></ha-svg-icon>
            <span class="prediction-label">${t3("degradation_trend", lang)}</span>
            <span class="prediction-value ${task.degradation_trend}">${t3("trend_" + task.degradation_trend, lang)}</span>
            ${task.degradation_rate != null ? b2`<span class="prediction-rate">${task.degradation_rate > 0 ? "+" : ""}${Math.abs(task.degradation_rate) >= 10 ? Math.round(task.degradation_rate).toLocaleString() : task.degradation_rate.toFixed(1)} ${task.trigger_entity_info?.unit_of_measurement || ""}/${t3("day_short", lang)}</span>` : A}
          </div>
        ` : A}
        ${hasThreshold ? b2`
          <div class="prediction-item">
            <ha-svg-icon path="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22A9,9 0 0,0 21,13A9,9 0 0,0 12,4M12.5,8H11V14L15.75,16.85L16.5,15.62L12.5,13.25V8M7.88,3.39L6.6,1.86L2,5.71L3.29,7.24L7.88,3.39M22,5.72L17.4,1.86L16.11,3.39L20.71,7.25L22,5.72Z"></ha-svg-icon>
            <span class="prediction-label">${t3("days_until_threshold", lang)}</span>
            <span class="prediction-value prediction-days${task.days_until_threshold === 0 ? " exceeded" : task.sensor_prediction_urgency ? " urgent" : ""}">${task.days_until_threshold === 0 ? t3("threshold_exceeded", lang) : "~" + Math.round(task.days_until_threshold) + " " + t3("days", lang)}</span>
            ${task.threshold_prediction_date ? b2`<span class="prediction-date">${formatDate(task.threshold_prediction_date, lang)}</span>` : A}
            ${task.threshold_prediction_confidence ? b2`<span class="confidence-dot ${task.threshold_prediction_confidence}"></span>` : A}
          </div>
        ` : A}
        ${hasEnv && features.environmental ? b2`
          <div class="prediction-item">
            <ha-svg-icon path="M15,13V5A3,3 0 0,0 12,2A3,3 0 0,0 9,5V13A5,5 0 0,0 7,17A5,5 0 0,0 12,22A5,5 0 0,0 17,17A5,5 0 0,0 15,13M12,4A1,1 0 0,1 13,5V8H11V5A1,1 0 0,1 12,4Z"></ha-svg-icon>
            <span class="prediction-label">${t3("environmental_adjustment", lang)}</span>
            <span class="prediction-value">${task.environmental_factor.toFixed(2)}x</span>
            ${task.environmental_entity ? b2`<span class="prediction-entity entity-link" @click=${(ev) => fireMoreInfo(ev, task.environmental_entity)}>${task.environmental_entity}</span>` : A}
          </div>
        ` : A}
      </div>
    </div>
  `;
}
var init_prediction = __esm({
  "renderers/prediction.ts"() {
    "use strict";
    init_lit();
    init_styles();
  }
});

// renderers/recommendation.ts
function renderRecommendationBars(current, suggested, confidence, lang) {
  const maxBar = Math.max(current || 1, suggested);
  return b2`
    <div class="interval-comparison">
      <div class="interval-bar">
        <div class="interval-label">
          ${t3("current", lang)}: ${current ?? "\u2014"} ${current != null ? t3("days", lang) : ""}
        </div>
        <div class="interval-visual current"
          style="width: ${current != null ? Math.min(current / maxBar * 100, 100) : 0}%"></div>
      </div>
      <div class="interval-bar">
        <div class="interval-label">
          ${t3("recommended", lang)}: ${suggested} ${t3("days", lang)}
          <span class="confidence-badge ${confidence}">${t3(`confidence_${confidence}`, lang)}</span>
        </div>
        <div class="interval-visual suggested"
          style="width: ${Math.min(suggested / maxBar * 100, 100)}%"></div>
      </div>
    </div>
  `;
}
var init_recommendation = __esm({
  "renderers/recommendation.ts"() {
    "use strict";
    init_lit();
    init_styles();
  }
});

// renderers/seasonal.ts
function renderSeasonalCardCompact(task, lang, features) {
  if (!features.seasonal || !task.seasonal_factor || task.seasonal_factor === 1) {
    return A;
  }
  const months = MONTH_KEYS.map((k2) => t3(k2, lang));
  const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
  const realFactors = task.seasonal_factors || task.interval_analysis?.seasonal_factors || null;
  const seasonalData = realFactors && realFactors.length === 12 ? realFactors : months.map((_2, i6) => {
    const base = task.seasonal_factor || 1;
    const variation = Math.sin((i6 - 6) * Math.PI / 6) * 0.3;
    return Math.max(0.7, Math.min(1.3, base + variation));
  });
  return b2`
    <div class="seasonal-card-compact">
      <h4>${t3("seasonal_awareness", lang)}</h4>
      <div class="seasonal-mini-chart">
        ${seasonalData.map((factor, i6) => {
    const height = factor * 40;
    const colorClass = factor < 0.9 ? "low" : factor > 1.1 ? "high" : "normal";
    const isCurrentMonth = i6 === currentMonth;
    return b2`
            <div class="seasonal-bar ${colorClass} ${isCurrentMonth ? "current" : ""}"
                 style="height: ${height}px"
                 title="${months[i6]}: ${factor.toFixed(2)}x">
            </div>
          `;
  })}
      </div>
      <div class="seasonal-legend">
        <span class="legend-item"><span class="dot low"></span> ${t3("shorter", lang) || "K\xFCrzer"}</span>
        <span class="legend-item"><span class="dot normal"></span> ${t3("normal", lang) || "Normal"}</span>
        <span class="legend-item"><span class="dot high"></span> ${t3("longer", lang) || "L\xE4nger"}</span>
      </div>
    </div>
  `;
}
function renderSeasonalCardExpanded(task, lang) {
  return renderSeasonalChart(task, lang);
}
function renderSeasonalChart(task, lang) {
  const factors = task.seasonal_factors ?? task.interval_analysis?.seasonal_factors;
  if (!factors || factors.length !== 12) return A;
  const reason = task.interval_analysis?.seasonal_reason;
  const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
  const W = 300, H3 = 100;
  const PAD_T3 = 8, PAD_B3 = 4;
  const chartH = H3 - PAD_T3 - PAD_B3;
  const maxFactor = Math.max(...factors, 1.5);
  const barW = W / 12;
  const barInner = barW * 0.65;
  const baselineY = PAD_T3 + chartH - 1 / maxFactor * chartH;
  return b2`
    <div class="seasonal-chart">
      <div class="seasonal-chart-title">
        <ha-svg-icon aria-hidden="true" path="M17.75 4.09L15.22 6.03L16.13 9.09L13.5 7.28L10.87 9.09L11.78 6.03L9.25 4.09L12.44 4L13.5 1L14.56 4L17.75 4.09M21.25 11L19.61 12.25L20.2 14.23L18.5 13.06L16.8 14.23L17.39 12.25L15.75 11L17.81 10.95L18.5 9L19.19 10.95L21.25 11M18.97 15.95C19.8 15.87 20.69 17.05 20.16 17.8C19.84 18.25 19.5 18.67 19.08 19.07C15.17 23 8.84 23 4.94 19.07C1.03 15.17 1.03 8.83 4.94 4.93C5.34 4.53 5.76 4.17 6.21 3.85C6.96 3.32 8.14 4.21 8.06 5.04C7.79 7.9 8.75 10.87 10.95 13.06C13.14 15.26 16.1 16.22 18.97 15.95Z"></ha-svg-icon>
        ${t3("seasonal_chart_title", lang)}
        ${reason ? b2`<span class="source-tag">${reason === "learned" ? t3("seasonal_learned", lang) : t3("seasonal_manual", lang)}</span>` : A}
      </div>
      <svg viewBox="0 0 ${W} ${H3}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t3("chart_seasonal", lang)}">
        <line x1="0" y1="${baselineY.toFixed(1)}" x2="${W}" y2="${baselineY.toFixed(1)}"
          stroke="var(--divider-color)" stroke-width="1" stroke-dasharray="4,3" />
        ${factors.map((f3, i6) => {
    const barH = f3 / maxFactor * chartH;
    const x2 = i6 * barW + (barW - barInner) / 2;
    const y3 = PAD_T3 + chartH - barH;
    const isCurrent = i6 === currentMonth;
    const color = f3 < 1 ? "var(--success-color, #4caf50)" : f3 > 1 ? "var(--warning-color, #ff9800)" : "var(--secondary-text-color)";
    return w`
            <rect x="${x2.toFixed(1)}" y="${y3.toFixed(1)}"
              width="${barInner.toFixed(1)}" height="${barH.toFixed(1)}"
              fill="${color}" opacity="${isCurrent ? 1 : 0.5}" rx="2" />
          `;
  })}
      </svg>
      <div class="seasonal-labels">
        ${MONTH_KEYS.map(
    (key, i6) => b2`<span class="seasonal-label ${i6 === currentMonth ? "active-month" : ""}">${t3(key, lang)}</span>`
  )}
      </div>
    </div>
  `;
}
var MONTH_KEYS;
var init_seasonal = __esm({
  "renderers/seasonal.ts"() {
    "use strict";
    init_lit();
    init_styles();
    MONTH_KEYS = [
      "month_jan",
      "month_feb",
      "month_mar",
      "month_apr",
      "month_may",
      "month_jun",
      "month_jul",
      "month_aug",
      "month_sep",
      "month_oct",
      "month_nov",
      "month_dec"
    ];
  }
});

// components/task-quick-actions-dialog.ts
var MaintenanceTaskQuickActionsDialog;
var init_task_quick_actions_dialog = __esm({
  "components/task-quick-actions-dialog.ts"() {
    "use strict";
    init_lit();
    init_decorators();
    init_styles();
    init_ws_errors();
    init_calendar_bucket();
    init_shared_parts();
    init_weibull();
    init_prediction();
    init_recommendation();
    init_seasonal();
    MaintenanceTaskQuickActionsDialog = class extends i4 {
      constructor() {
        super(...arguments);
        this._open = false;
        this._entryId = null;
        this._taskId = null;
        this._task = null;
        this._objectName = "";
        this._busy = false;
        this._error = "";
        this._showSkip = false;
        this._showReset = false;
        this._showDetails = false;
        this._showAdaptive = false;
        this._skipReason = "";
        this._resetDate = "";
        this._features = {
          adaptive: false,
          predictions: false,
          seasonal: false,
          environmental: false,
          budget: false,
          groups: false,
          checklists: false,
          schedule_time: false,
          completion_actions: false
        };
        this._toast = "";
        this._featuresLoaded = false;
      }
      get _lang() {
        return langOf(this.hass);
      }
      /** Open the dialog. Loads fresh data from /object via WS so dialog stays in
       *  sync even if the underlying card has stale data. */
      async openFor(entryId, taskId) {
        this._entryId = entryId;
        this._taskId = taskId;
        this._error = "";
        this._showSkip = false;
        this._showReset = false;
        this._showAdaptive = false;
        this._skipReason = "";
        this._resetDate = isoDateLocal(/* @__PURE__ */ new Date());
        this._open = true;
        await Promise.all([this._loadTask(), this._loadFeatures()]);
      }
      /** Pull the active feature flags so adaptive sections only render when
       *  Adaptive / Seasonal / Environmental are actually enabled (matches the
       *  panel's behaviour). Cached after first load. */
      async _loadFeatures() {
        if (this._featuresLoaded) return;
        try {
          const r6 = await this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/settings" });
          if (r6?.features) {
            this._features = { ...this._features, ...r6.features };
          }
          this._featuresLoaded = true;
        } catch {
        }
      }
      close() {
        this._open = false;
        this._task = null;
        this._error = "";
      }
      async _loadTask() {
        if (!this._entryId || !this._taskId) return;
        try {
          const r6 = await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/object",
            entry_id: this._entryId
          });
          this._objectName = r6.object?.name || "";
          const found = (r6.tasks || []).find((t5) => t5.id === this._taskId);
          this._task = found ?? null;
        } catch (e7) {
          this._error = describeWsError(e7, this._lang);
        }
      }
      async _runWs(payload) {
        this._busy = true;
        this._error = "";
        try {
          await this.hass.connection.sendMessagePromise(payload);
          this._busy = false;
          return true;
        } catch (e7) {
          this._error = describeWsError(e7, this._lang);
          this._busy = false;
          return false;
        }
      }
      _notifyChanged(action) {
        this.dispatchEvent(
          new CustomEvent("task-action-fired", {
            detail: { entry_id: this._entryId, task_id: this._taskId, action },
            bubbles: true,
            composed: true
          })
        );
      }
      _onComplete() {
        if (!this._entryId || !this._taskId || !this._task) return;
        Promise.resolve().then(() => (init_dialog_mount(), dialog_mount_exports)).then(async ({ openCompleteDialog: openCompleteDialog2 }) => {
          const task = this._task;
          const isBuy = !!task.part_ref;
          let parts = [];
          if (!isBuy) {
            try {
              const r6 = await this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects", compact: true });
              parts = partsForCompletion(task, this._entryId, r6.objects || [], this._lang);
            } catch {
            }
          }
          const ok = openCompleteDialog2({
            entry_id: this._entryId,
            task_id: this._taskId,
            task_name: task.name,
            checklist: task.checklist || [],
            adaptive_enabled: !!task.adaptive_config?.enabled,
            required_completion_fields: task.required_completion_fields || [],
            task_type: task.type || "",
            reading_unit: task.reading_unit || "",
            parts,
            consumes_parts: isBuy ? [] : task.consumes_parts || []
          });
          if (ok) {
            this._notifyChanged("complete");
            this.close();
          }
        });
      }
      async _onSkipConfirm() {
        if (!this._entryId || !this._taskId) return;
        const ok = await this._runWs({
          type: "maintenance_supporter/task/skip",
          entry_id: this._entryId,
          task_id: this._taskId,
          reason: this._skipReason.trim() || null
        });
        if (ok) {
          this._notifyChanged("skip");
          this.close();
        }
      }
      async _onResetConfirm() {
        if (!this._entryId || !this._taskId) return;
        const ok = await this._runWs({
          type: "maintenance_supporter/task/reset",
          entry_id: this._entryId,
          task_id: this._taskId,
          date: this._resetDate || void 0
        });
        if (ok) {
          this._notifyChanged("reset");
          this.close();
        }
      }
      _onEdit() {
        if (!this._entryId || !this._taskId) return;
        Promise.resolve().then(() => (init_dialog_mount(), dialog_mount_exports)).then(({ openEditTaskDialog: openEditTaskDialog2 }) => {
          openEditTaskDialog2(this._entryId, this._taskId);
          this.close();
        });
      }
      _onQr() {
        if (!this._entryId || !this._taskId || !this._task) return;
        Promise.resolve().then(() => (init_dialog_mount(), dialog_mount_exports)).then(({ openQrDialog: openQrDialog2 }) => {
          openQrDialog2({
            entry_id: this._entryId,
            task_id: this._taskId,
            task_name: this._task.name,
            object_name: this._objectName
          });
          this.close();
        });
      }
      async _onDelete() {
        if (!this._entryId || !this._taskId) return;
        const confirmText = t3("delete_task_confirm", this._lang) || `Delete "${this._task?.name}"?`;
        if (!window.confirm(confirmText)) return;
        const ok = await this._runWs({
          type: "maintenance_supporter/task/delete",
          entry_id: this._entryId,
          task_id: this._taskId
        });
        if (ok) {
          this._notifyChanged("delete");
          this.close();
        }
      }
      async _onArchive() {
        if (!this._entryId || !this._taskId) return;
        const ok = await this._runWs({
          type: "maintenance_supporter/task/archive",
          entry_id: this._entryId,
          task_id: this._taskId
        });
        if (ok) {
          this._notifyChanged("archive");
          this.close();
        }
      }
      async _onUnarchive() {
        if (!this._entryId || !this._taskId) return;
        const ok = await this._runWs({
          type: "maintenance_supporter/task/unarchive",
          entry_id: this._entryId,
          task_id: this._taskId
        });
        if (ok) {
          this._notifyChanged("unarchive");
          this.close();
        }
      }
      _onOpenInPanel() {
        if (!this._entryId || !this._taskId) return;
        const path = `/maintenance-supporter?entry_id=${encodeURIComponent(this._entryId)}&task_id=${encodeURIComponent(this._taskId)}`;
        history.pushState(null, "", path);
        window.dispatchEvent(new CustomEvent("location-changed"));
        this.close();
      }
      async _applySuggestion() {
        if (!this._entryId || !this._taskId || !this._task?.suggested_interval) return;
        const ok = await this._runWs({
          type: "maintenance_supporter/task/apply_suggestion",
          entry_id: this._entryId,
          task_id: this._taskId,
          interval: this._task.suggested_interval
        });
        if (ok) {
          this._toast = t3("suggestion_applied", this._lang) || "Applied";
          this._notifyChanged("apply_suggestion");
          await this._loadTask();
          setTimeout(() => {
            this._toast = "";
          }, 2500);
        }
      }
      async _reanalyzeInterval() {
        if (!this._entryId || !this._taskId) return;
        this._busy = true;
        this._error = "";
        try {
          const r6 = await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/task/analyze_interval",
            entry_id: this._entryId,
            task_id: this._taskId
          });
          this._toast = r6.recommended_interval ? `${t3("reanalyze_result", this._lang) || "Recomputed"}: ${formatInterval(r6.recommended_interval, "days", this._lang)} (${r6.data_points} pts)` : t3("reanalyze_insufficient_data", this._lang) || "Not enough data";
          await this._loadTask();
          setTimeout(() => {
            this._toast = "";
          }, 3500);
        } catch (e7) {
          this._error = describeWsError(e7, this._lang);
        } finally {
          this._busy = false;
        }
      }
      _onEditHistoryEntry(entry) {
        if (!this._entryId || !this._taskId) return;
        Promise.resolve().then(() => (init_dialog_mount(), dialog_mount_exports)).then(({ openHistoryEditDialog: openHistoryEditDialog2 }) => {
          openHistoryEditDialog2({
            entry_id: this._entryId,
            task_id: this._taskId,
            original_timestamp: entry.timestamp,
            type: entry.type,
            timestamp: entry.timestamp,
            notes: entry.notes ?? null,
            cost: entry.cost ?? null,
            duration: entry.duration ?? null,
            completed_by: entry.completed_by ?? null,
            used_parts: entry.used_parts ?? null
          });
        });
      }
      /** Inline recommendation card (Current vs Suggested with apply/reanalyze).
       *  Bars + confidence badge come from the shared renderer; the action row
       *  uses native <button>s because <ha-button> isn't always registered in
       *  the Lovelace context (same lazy-load issue that bit complete-dialog
       *  with ha-textfield in #50). The panel uses ha-button + adds Dismiss. */
      _renderRecommendation(task) {
        if (!this._features.adaptive || !task.suggested_interval || task.suggested_interval === task.interval_days) {
          return A;
        }
        const L2 = this._lang;
        return b2`
      <div class="recommendation-card">
        <h4>${t3("suggested_interval", L2)}</h4>
        ${renderRecommendationBars(
          task.interval_days,
          task.suggested_interval,
          task.interval_confidence || "medium",
          L2
        )}
        <div class="recommendation-actions">
          <button class="btn primary"
            @click=${this._applySuggestion} ?disabled=${this._busy}>
            <ha-icon icon="mdi:check"></ha-icon>
            ${t3("apply_suggestion", L2)}
          </button>
          <button class="btn"
            @click=${this._reanalyzeInterval} ?disabled=${this._busy}>
            <ha-icon icon="mdi:refresh"></ha-icon>
            ${t3("reanalyze", L2)}
          </button>
        </div>
      </div>
    `;
      }
      /** Adaptive section: prediction + recommendation + Weibull + seasonal,
       *  reusing the panel's renderers. Only renders blocks that have data. */
      _renderAdaptive(task) {
        const L2 = this._lang;
        const hasRecommendation = this._features.adaptive && task.suggested_interval && task.suggested_interval !== task.interval_days;
        const hasPrediction = task.degradation_trend != null && task.degradation_trend !== "insufficient_data" || task.days_until_threshold != null || task.environmental_factor != null && task.environmental_factor !== 1;
        const hasWeibull = this._features.adaptive && task.interval_analysis?.weibull_beta != null && task.interval_analysis?.weibull_eta != null;
        const hasSeasonal = this._features.seasonal && task.seasonal_factor && task.seasonal_factor !== 1;
        if (!hasRecommendation && !hasPrediction && !hasWeibull && !hasSeasonal) {
          return b2`<div class="adaptive-empty">
        ${t3("adaptive_no_data", L2) || "Not enough completion history yet for adaptive analysis."}
      </div>`;
        }
        return b2`
      <div class="adaptive-stack">
        ${this._toast ? b2`<div class="toast">${this._toast}</div>` : A}
        ${hasRecommendation ? this._renderRecommendation(task) : A}
        ${hasPrediction ? renderPredictionSection(task, L2, this._features) : A}
        ${hasWeibull ? renderWeibullSection(task, L2) : A}
        ${hasSeasonal ? b2`
          ${renderSeasonalCardCompact(task, L2, this._features)}
          ${task.seasonal_factors?.length === 12 || task.interval_analysis?.seasonal_factors?.length === 12 ? renderSeasonalCardExpanded(task, L2) : A}
        ` : A}
      </div>
    `;
      }
      /** Read-only details panel: stats + history. Shown when the user clicks
       *  "Show details" in the dialog. Edit-buttons on history entries open the
       *  existing history-edit dialog (which lives in the same dialog-mount). */
      _renderDetails(task) {
        const L2 = this._lang;
        const history2 = task.history || [];
        const completed = history2.filter((h3) => h3.type === "completed");
        const totalCost = completed.reduce(
          (s4, h3) => s4 + (typeof h3.cost === "number" ? h3.cost : 0),
          0
        );
        const avgDuration = (() => {
          const durs = completed.map((h3) => typeof h3.duration === "number" ? h3.duration : null).filter((d3) => d3 != null);
          if (!durs.length) return null;
          return Math.round(durs.reduce((s4, d3) => s4 + d3, 0) / durs.length);
        })();
        return b2`
      <div class="details">
        <div class="stats-grid">
          <div class="stat">
            <span class="stat-label">${t3("times_performed", L2) || "Performed"}</span>
            <span class="stat-value">${completed.length}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${t3("total_cost", L2) || "Total cost"}</span>
            <span class="stat-value">${totalCost.toFixed(2)}</span>
          </div>
          <div class="stat">
            <span class="stat-label">${t3("avg_duration", L2) || "Avg duration"}</span>
            <span class="stat-value">${avgDuration != null ? `${avgDuration}m` : "\u2014"}</span>
          </div>
        </div>
        <div class="history-header">
          <strong>${t3("history", L2) || "History"}</strong>
          <span class="history-count">${history2.length}</span>
        </div>
        ${history2.length === 0 ? b2`<div class="history-empty">${t3("history_empty", L2) || "No history yet."}</div>` : b2`
              <div class="history-list">
                ${[...history2].reverse().slice(0, 20).map((entry) => {
          const editable = ["completed", "reset", "skipped"].includes(entry.type);
          return b2`
                    <div class="history-entry">
                      <div class="history-line">
                        <span class="history-type type-${entry.type}">${t3(entry.type, L2)}</span>
                        <span class="history-date">${formatDateTime(entry.timestamp, L2)}</span>
                        ${editable ? b2`<button class="history-edit"
                                   title="${t3("history_edit_button", L2) || "Edit"}"
                                   @click=${() => this._onEditHistoryEntry(entry)}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                            </button>` : A}
                      </div>
                      ${entry.notes ? b2`<div class="history-notes">${entry.notes}</div>` : A}
                      ${entry.cost != null || entry.duration != null ? b2`<div class="history-meta">
                            ${entry.cost != null ? b2`<span>💰 ${entry.cost.toFixed(2)}</span>` : A}
                            ${entry.duration != null ? b2`<span>⏱️ ${entry.duration}m</span>` : A}
                          </div>` : A}
                    </div>
                  `;
        })}
                ${history2.length > 20 ? b2`<div class="history-more">… +${history2.length - 20} ${t3("older_entries", L2) || "older"}</div>` : A}
              </div>
            `}
      </div>
    `;
      }
      render() {
        if (!this._open) return A;
        const L2 = this._lang;
        const task = this._task;
        const isAdmin = this.hass?.user?.is_admin ?? true;
        return b2`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${task ? b2`
              <div class="header">
                <div class="title">
                  <span class="status-dot" style="background: ${STATUS_COLORS[task.status] || "#ccc"}"></span>
                  <span class="task-name">${task.name}</span>
                </div>
                <div class="object">
                  <button class="link-inline" @click=${() => {
          if (!this._entryId) return;
          Promise.resolve().then(() => (init_dialog_mount(), dialog_mount_exports)).then(({ openObjectQuickActions: openObjectQuickActions2 }) => {
            openObjectQuickActions2(this._entryId);
            this.close();
          });
        }}>${this._objectName}</button>
                </div>
                <div class="quick-info">
                  ${task.next_due ? b2`<span><strong>${t3("next_due", L2) || "Next due"}:</strong> ${formatDate(task.next_due, L2)}</span>` : A}
                  ${task.last_performed ? b2`<span><strong>${t3("last_performed", L2) || "Last"}:</strong> ${formatDate(task.last_performed, L2)}</span>` : A}
                  ${task.schedule?.kind && !["manual", "one_time"].includes(task.schedule.kind) || task.interval_days != null ? b2`<span><strong>${t3("interval", L2) || "Interval"}:</strong> ${formatRecurrence(task, L2)}</span>` : A}
                </div>
              </div>

              ${this._error ? b2`<div class="error">${this._error}</div>` : A}

              ${this._showSkip ? b2`
                    <div class="inline-form">
                      <label>${t3("skip_reason", L2) || "Skip reason (optional)"}</label>
                      <input type="text" .value=${this._skipReason}
                        @input=${(e7) => {
          this._skipReason = e7.target.value;
        }} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${() => {
          this._showSkip = false;
        }} ?disabled=${this._busy}>
                          ${t3("cancel", L2) || "Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onSkipConfirm} ?disabled=${this._busy}>
                          ${t3("skip", L2) || "Skip"}
                        </button>
                      </div>
                    </div>
                  ` : this._showReset ? b2`
                    <div class="inline-form">
                      <label>${t3("reset_to_date", L2) || "Reset last_performed to"}</label>
                      <input type="date" .value=${this._resetDate}
                        @input=${(e7) => {
          this._resetDate = e7.target.value;
        }} />
                      <div class="inline-actions">
                        <button class="btn cancel" @click=${() => {
          this._showReset = false;
        }} ?disabled=${this._busy}>
                          ${t3("cancel", L2) || "Cancel"}
                        </button>
                        <button class="btn primary" @click=${this._onResetConfirm} ?disabled=${this._busy}>
                          ${t3("reset", L2) || "Reset"}
                        </button>
                      </div>
                    </div>
                  ` : b2`
                    <div class="actions primary-row">
                      <button class="btn primary" @click=${this._onComplete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:check"></ha-icon>
                        ${t3("complete", L2) || "Complete"}
                      </button>
                      <button class="btn" @click=${() => {
          this._showSkip = true;
        }} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:skip-next"></ha-icon>
                        ${t3("skip", L2) || "Skip"}
                      </button>
                      <button class="btn" @click=${() => {
          this._showReset = true;
        }} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:restart"></ha-icon>
                        ${t3("reset", L2) || "Reset"}
                      </button>
                    </div>
                    ${isAdmin ? b2`
                          <div class="actions secondary-row">
                            <button class="btn ghost" @click=${this._onEdit} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:pencil"></ha-icon>
                              ${t3("edit", L2) || "Edit"}
                            </button>
                            <button class="btn ghost" @click=${this._onQr} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:qrcode"></ha-icon>
                              ${t3("qr_code", L2) || "QR"}
                            </button>
                            <button class="btn ghost"
                              @click=${task.archived ? this._onUnarchive : this._onArchive}
                              ?disabled=${this._busy}>
                              <ha-icon icon="${task.archived ? "mdi:archive-arrow-up-outline" : "mdi:archive-outline"}"></ha-icon>
                              ${task.archived ? t3("unarchive", L2) || "Unarchive" : t3("archive", L2) || "Archive"}
                            </button>
                            <button class="btn ghost danger" @click=${this._onDelete} ?disabled=${this._busy}>
                              <ha-icon icon="mdi:delete"></ha-icon>
                              ${t3("delete", L2) || "Delete"}
                            </button>
                          </div>
                        ` : A}
                    <div class="details-toggle">
                      <button class="link" @click=${() => {
          this._showDetails = !this._showDetails;
        }}>
                        <ha-icon icon="${this._showDetails ? "mdi:chevron-up" : "mdi:chevron-down"}"></ha-icon>
                        ${this._showDetails ? t3("hide_details", L2) || "Hide details" : t3("show_details", L2) || "Show history + stats"}
                      </button>
                      ${this._features.adaptive || this._features.seasonal || this._features.environmental ? b2`<button class="link" @click=${() => {
          this._showAdaptive = !this._showAdaptive;
        }}>
                            <ha-icon icon="${this._showAdaptive ? "mdi:chart-line" : "mdi:chart-line-variant"}"></ha-icon>
                            ${this._showAdaptive ? t3("hide_stats", L2) || "Hide stats" : t3("show_stats", L2) || "Show stats + graphs"}
                          </button>` : A}
                    </div>
                    ${this._showDetails ? this._renderDetails(task) : A}
                    ${this._showAdaptive ? this._renderAdaptive(task) : A}
                    <div class="footer">
                      <button class="link" @click=${this._onOpenInPanel}>
                        <ha-icon icon="mdi:open-in-new"></ha-icon>
                        ${t3("open_in_panel", L2) || "Open in Maintenance panel"}
                      </button>
                    </div>
                  `}
            ` : b2`<div class="loading">${t3("loading", L2) || "Loading\u2026"}</div>`}
      </div>
    `;
      }
    };
    MaintenanceTaskQuickActionsDialog.styles = [sharedStyles, i`
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
  `];
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceTaskQuickActionsDialog.prototype, "hass", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_open", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_entryId", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_taskId", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_task", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_objectName", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_busy", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_error", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_showSkip", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_showReset", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_showDetails", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_showAdaptive", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_skipReason", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_resetDate", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_features", 2);
    __decorateClass([
      r5()
    ], MaintenanceTaskQuickActionsDialog.prototype, "_toast", 2);
    if (!customElements.get("maintenance-task-quick-actions-dialog")) {
      customElements.define(
        "maintenance-task-quick-actions-dialog",
        MaintenanceTaskQuickActionsDialog
      );
    }
  }
});

// components/object-quick-actions-dialog.ts
var MaintenanceObjectQuickActionsDialog;
var init_object_quick_actions_dialog = __esm({
  "components/object-quick-actions-dialog.ts"() {
    "use strict";
    init_lit();
    init_url();
    init_decorators();
    init_styles();
    init_ws_errors();
    MaintenanceObjectQuickActionsDialog = class extends i4 {
      constructor() {
        super(...arguments);
        this._open = false;
        this._entryId = null;
        this._data = null;
        this._busy = false;
        this._error = "";
      }
      get _lang() {
        return langOf(this.hass);
      }
      async openFor(entryId) {
        this._entryId = entryId;
        this._error = "";
        this._open = true;
        await this._load();
      }
      close() {
        this._open = false;
        this._data = null;
        this._error = "";
      }
      async _load() {
        if (!this._entryId) return;
        try {
          const r6 = await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/object",
            entry_id: this._entryId
          });
          this._data = r6;
        } catch (e7) {
          this._error = describeWsError(e7, this._lang);
        }
      }
      _onEditObject() {
        if (!this._entryId || !this._data) return;
        Promise.resolve().then(() => (init_dialog_mount(), dialog_mount_exports)).then(({ openEditObjectDialog: openEditObjectDialog2 }) => {
          openEditObjectDialog2(this._entryId, this._data.object);
          this.close();
        });
      }
      _onAddTask() {
        if (!this._entryId) return;
        Promise.resolve().then(() => (init_dialog_mount(), dialog_mount_exports)).then(({ openCreateTaskDialog: openCreateTaskDialog2 }) => {
          openCreateTaskDialog2(this._entryId);
          this.close();
        });
      }
      async _onDelete() {
        if (!this._entryId || !this._data) return;
        const confirmText = t3("delete_object_confirm", this._lang) || `Delete "${this._data.object.name}" and all its tasks?`;
        if (!window.confirm(confirmText)) return;
        this._busy = true;
        this._error = "";
        try {
          await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/object/delete",
            entry_id: this._entryId
          });
          this.dispatchEvent(
            new CustomEvent("object-deleted", {
              detail: { entry_id: this._entryId },
              bubbles: true,
              composed: true
            })
          );
          this.close();
        } catch (e7) {
          this._error = describeWsError(e7, this._lang);
        } finally {
          this._busy = false;
        }
      }
      async _onArchiveObject() {
        if (!this._entryId || !this._data) return;
        const archived = !!this._data.object.archived;
        if (!archived) {
          const confirmText = t3("confirm_archive_object", this._lang) || "Archive this object and its tasks?";
          if (!window.confirm(confirmText)) return;
        }
        this._busy = true;
        this._error = "";
        try {
          await this.hass.connection.sendMessagePromise({
            type: archived ? "maintenance_supporter/object/unarchive" : "maintenance_supporter/object/archive",
            entry_id: this._entryId
          });
          this.dispatchEvent(
            new CustomEvent("object-changed", {
              detail: { entry_id: this._entryId },
              bubbles: true,
              composed: true
            })
          );
          this.close();
        } catch (e7) {
          this._error = describeWsError(e7, this._lang);
        } finally {
          this._busy = false;
        }
      }
      _onTaskClick(taskId) {
        if (!this._entryId) return;
        Promise.resolve().then(() => (init_dialog_mount(), dialog_mount_exports)).then(({ openTaskQuickActions: openTaskQuickActions2 }) => {
          openTaskQuickActions2(this._entryId, taskId);
        });
      }
      render() {
        if (!this._open) return A;
        const L2 = this._lang;
        const data = this._data;
        const obj = data?.object;
        const tasks = data?.tasks || [];
        const isAdmin = this.hass?.user?.is_admin ?? true;
        return b2`
      <div class="backdrop" @click=${this.close}></div>
      <div class="dialog" role="dialog" aria-modal="true">
        ${data && obj ? b2`
              <div class="header">
                <div class="title">${obj.name}</div>
                ${this._renderMetaRow(obj)}
              </div>

              ${this._error ? b2`<div class="error">${this._error}</div>` : A}

              <div class="tasks-section">
                <div class="section-header">
                  <strong>${t3("tasks", L2) || "Tasks"}</strong>
                  <span class="count">${tasks.length}</span>
                </div>
                ${tasks.length === 0 ? b2`<div class="empty">${t3("no_tasks", L2) || "No tasks yet."}</div>` : b2`
                      <div class="task-list">
                        ${tasks.map((task) => b2`
                          <div class="task-row" @click=${() => this._onTaskClick(task.id)}>
                            <span class="status-dot" style="background: ${STATUS_COLORS[task.status] || "#ccc"}"></span>
                            <span class="task-name">${task.name}</span>
                            <span class="task-status">${t3(task.status || "ok", L2)}</span>
                          </div>
                        `)}
                      </div>
                    `}
              </div>

              ${obj.notes ? b2`
                    <div class="notes-section">
                      <strong>${t3("object_notes_label", L2)}</strong>
                      <div class="notes-body">${obj.notes}</div>
                    </div>
                  ` : A}

              ${isAdmin ? b2`
                    <div class="actions">
                      <button class="btn primary" @click=${this._onAddTask} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:plus"></ha-icon>
                        ${t3("add_task", L2) || "Add task"}
                      </button>
                      <button class="btn" @click=${this._onEditObject} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:pencil"></ha-icon>
                        ${t3("edit", L2) || "Edit"}
                      </button>
                      <button class="btn" @click=${this._onArchiveObject} ?disabled=${this._busy}>
                        <ha-icon icon="${obj.archived ? "mdi:archive-arrow-up-outline" : "mdi:archive-outline"}"></ha-icon>
                        ${obj.archived ? t3("unarchive_object", L2) || "Unarchive object" : t3("archive_object", L2) || "Archive object"}
                      </button>
                      <button class="btn danger" @click=${this._onDelete} ?disabled=${this._busy}>
                        <ha-icon icon="mdi:delete"></ha-icon>
                        ${t3("delete", L2) || "Delete"}
                      </button>
                    </div>
                  ` : A}
            ` : b2`<div class="loading">${t3("loading", L2) || "Loading\u2026"}</div>`}
      </div>
    `;
      }
      _renderMetaRow(obj) {
        const L2 = this._lang;
        const items = [];
        if (obj.area_id) items.push([t3("area", L2), obj.area_id]);
        if (obj.manufacturer) items.push([t3("manufacturer", L2), obj.manufacturer]);
        if (obj.model) items.push([t3("model", L2), obj.model]);
        if (obj.serial_number) items.push([t3("serial_number_label", L2), obj.serial_number]);
        if (obj.installation_date) items.push([t3("installed", L2), obj.installation_date]);
        if (obj.warranty_expiry) items.push([t3("warranty", L2), obj.warranty_expiry]);
        if (obj.documentation_url) items.push([t3("documentation_url_label", L2), obj.documentation_url]);
        if (items.length === 0) return A;
        return b2`
      <div class="meta">
        ${items.map(
          ([label, value]) => b2`
            <div class="meta-item">
              <span class="meta-label">${label}</span>
              <span class="meta-value">${// Only render http(s) values as links (never javascript:/data:);
          // value-based so it works in every UI language, not just English.
          isSafeHttpUrl(value) ? b2`<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>` : value}</span>
            </div>
          `
        )}
      </div>
    `;
      }
    };
    MaintenanceObjectQuickActionsDialog.styles = i`
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
  `;
    __decorateClass([
      n4({ attribute: false })
    ], MaintenanceObjectQuickActionsDialog.prototype, "hass", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectQuickActionsDialog.prototype, "_open", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectQuickActionsDialog.prototype, "_entryId", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectQuickActionsDialog.prototype, "_data", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectQuickActionsDialog.prototype, "_busy", 2);
    __decorateClass([
      r5()
    ], MaintenanceObjectQuickActionsDialog.prototype, "_error", 2);
    if (!customElements.get("maintenance-object-quick-actions-dialog")) {
      customElements.define(
        "maintenance-object-quick-actions-dialog",
        MaintenanceObjectQuickActionsDialog
      );
    }
  }
});

// dialog-mount.ts
var dialog_mount_exports = {};
__export(dialog_mount_exports, {
  openCompleteDialog: () => openCompleteDialog,
  openCreateObjectDialog: () => openCreateObjectDialog,
  openCreateTaskDialog: () => openCreateTaskDialog,
  openEditObjectDialog: () => openEditObjectDialog,
  openEditTaskDialog: () => openEditTaskDialog,
  openHistoryEditDialog: () => openHistoryEditDialog,
  openObjectQuickActions: () => openObjectQuickActions,
  openQrDialog: () => openQrDialog,
  openTaskQuickActions: () => openTaskQuickActions
});
function getHass() {
  const root = document.querySelector("home-assistant");
  return root?.hass;
}
function dialogHost() {
  return document.querySelector("home-assistant")?.shadowRoot ?? document.body;
}
function getOrCreate(tag) {
  const host = dialogHost();
  let el = host.querySelector(tag) ?? document.body.querySelector(tag);
  if (!el) {
    el = document.createElement(tag);
    host.appendChild(el);
  } else if (el.parentNode !== host) {
    host.appendChild(el);
  }
  return el;
}
function syncHass(el) {
  const hass = getHass();
  if (!hass) return false;
  el.hass = hass;
  const lang = langOf(hass);
  if (!isLocaleLoaded(lang)) {
    void ensureLocale(lang).then(() => {
      el.requestUpdate?.();
    });
  }
  return true;
}
function fetchSettingsOnce(hass) {
  if (_cachedSettings) return _cachedSettings;
  _cachedSettings = hass.connection.sendMessagePromise({ type: "maintenance_supporter/settings" }).then((r6) => ({
    features: r6.features ?? FALLBACK_SETTINGS.features,
    defaultWarningDays: r6.general?.default_warning_days ?? 7
  })).catch(() => FALLBACK_SETTINGS);
  return _cachedSettings;
}
function openCreateObjectDialog() {
  const dlg = getOrCreate(OBJECT_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  dlg.openCreate();
  return true;
}
function openEditObjectDialog(entryId, obj) {
  const dlg = getOrCreate(OBJECT_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  dlg.openEdit(entryId, obj);
  return true;
}
function openCreateTaskDialog(entryId = "", objects) {
  const dlg = getOrCreate(TASK_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  const hass = getHass();
  if (!hass) return false;
  void (async () => {
    const settings = await fetchSettingsOnce(hass);
    const dlgFull = dlg;
    dlgFull.checklistsEnabled = settings.features.checklists;
    dlgFull.scheduleTimeEnabled = settings.features.schedule_time;
    dlgFull.completionActionsEnabled = settings.features.completion_actions;
    dlgFull.defaultWarningDays = settings.defaultWarningDays;
    dlgFull.openCreate(entryId, objects);
  })();
  return true;
}
function openEditTaskDialog(entryId, taskId) {
  const dlg = getOrCreate(TASK_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  const hass = getHass();
  if (!hass) return false;
  void (async () => {
    try {
      const [r6, settings] = await Promise.all([
        hass.connection.sendMessagePromise({ type: "maintenance_supporter/object", entry_id: entryId }),
        fetchSettingsOnce(hass)
      ]);
      const fullTask = (r6.tasks || []).find((t5) => t5.id === taskId);
      if (!fullTask) {
        console.warn(`openEditTaskDialog: task ${taskId} not found in entry ${entryId}`);
        return;
      }
      const dlgFull = dlg;
      dlgFull.checklistsEnabled = settings.features.checklists;
      dlgFull.scheduleTimeEnabled = settings.features.schedule_time;
      dlgFull.completionActionsEnabled = settings.features.completion_actions;
      dlgFull.defaultWarningDays = settings.defaultWarningDays;
      await dlgFull.openEdit(entryId, fullTask);
    } catch (e7) {
      console.warn("openEditTaskDialog: failed to load task/features", e7);
    }
  })();
  return true;
}
function openHistoryEditDialog(draft) {
  const dlg = getOrCreate(HISTORY_EDIT_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  dlg.openEdit(draft);
  return true;
}
function openCompleteDialog(args) {
  const dlg = getOrCreate(COMPLETE_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  dlg.entryId = args.entry_id;
  dlg.taskId = args.task_id;
  dlg.taskName = args.task_name;
  dlg.checklist = args.checklist ?? [];
  dlg.adaptiveEnabled = !!args.adaptive_enabled;
  dlg.requiredFields = args.required_completion_fields ?? [];
  dlg.taskType = args.task_type ?? "";
  dlg.readingUnit = args.reading_unit ?? "";
  dlg.parts = args.parts ?? [];
  dlg.consumesParts = args.consumes_parts ?? [];
  dlg.lang = getHass()?.language || "en";
  dlg.open();
  return true;
}
function openQrDialog(args) {
  const dlg = getOrCreate(QR_DIALOG_TAG);
  if (!syncHass(dlg)) return false;
  dlg.openForTask(args.entry_id, args.task_id, args.object_name, args.task_name);
  return true;
}
function openTaskQuickActions(entryId, taskId) {
  const dlg = getOrCreate(
    QUICK_ACTIONS_DIALOG_TAG
  );
  if (!syncHass(dlg)) return false;
  void dlg.openFor(entryId, taskId);
  return true;
}
function openObjectQuickActions(entryId) {
  const dlg = getOrCreate(
    OBJECT_QUICK_ACTIONS_DIALOG_TAG
  );
  if (!syncHass(dlg)) return false;
  void dlg.openFor(entryId);
  return true;
}
var OBJECT_DIALOG_TAG, TASK_DIALOG_TAG, HISTORY_EDIT_DIALOG_TAG, COMPLETE_DIALOG_TAG, QR_DIALOG_TAG, QUICK_ACTIONS_DIALOG_TAG, OBJECT_QUICK_ACTIONS_DIALOG_TAG, FALLBACK_SETTINGS, _cachedSettings;
var init_dialog_mount = __esm({
  "dialog-mount.ts"() {
    "use strict";
    init_object_dialog();
    init_task_dialog();
    init_complete_dialog();
    init_history_edit_dialog();
    init_qr_dialog();
    init_task_quick_actions_dialog();
    init_object_quick_actions_dialog();
    init_styles();
    OBJECT_DIALOG_TAG = "maintenance-object-dialog";
    TASK_DIALOG_TAG = "maintenance-task-dialog";
    HISTORY_EDIT_DIALOG_TAG = "maintenance-history-edit-dialog";
    COMPLETE_DIALOG_TAG = "maintenance-complete-dialog";
    QR_DIALOG_TAG = "maintenance-qr-dialog";
    QUICK_ACTIONS_DIALOG_TAG = "maintenance-task-quick-actions-dialog";
    OBJECT_QUICK_ACTIONS_DIALOG_TAG = "maintenance-object-quick-actions-dialog";
    FALLBACK_SETTINGS = {
      features: {
        adaptive: false,
        predictions: false,
        seasonal: false,
        environmental: false,
        budget: false,
        groups: false,
        checklists: false,
        schedule_time: false,
        completion_actions: false
      },
      defaultWarningDays: 7
    };
    _cachedSettings = null;
  }
});

// ds-host-stubs.ts
init_lit();

// node_modules/@mdi/js/mdi.js
var mdiAccount = "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z";
var mdiAccountOutline = "M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,6A2,2 0 0,0 10,8A2,2 0 0,0 12,10A2,2 0 0,0 14,8A2,2 0 0,0 12,6M12,13C14.67,13 20,14.33 20,17V20H4V17C4,14.33 9.33,13 12,13M12,14.9C9.03,14.9 5.9,16.36 5.9,17V18.1H18.1V17C18.1,16.36 14.97,14.9 12,14.9Z";
var mdiAlertCircle = "M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
var mdiAlertCircleCheckOutline = "M18.75 22.16L16 19.16L17.16 18L18.75 19.59L22.34 16L23.5 17.41L18.75 22.16M11 15H13V17H11V15M11 7H13V13H11V7M12 2C17.5 2 22 6.5 22 12L21.92 13.31C21.31 13.11 20.67 13 19.94 13L20 12C20 7.58 16.42 4 12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C12.71 20 13.39 19.91 14.05 19.74C14.13 20.42 14.33 21.06 14.62 21.65C13.78 21.88 12.9 22 12 22C6.47 22 2 17.5 2 12C2 6.5 6.47 2 12 2Z";
var mdiAlertOctagon = "M13 13H11V7H13M11 15H13V17H11M15.73 3H8.27L3 8.27V15.73L8.27 21H15.73L21 15.73V8.27L15.73 3Z";
var mdiArchiveArrowUpOutline = "M20 21H4V10H6V19H18V10H20V21M3 3H21V9H3V3M5 5V7H19V5M10.5 17V14H8L12 10L16 14H13.5V17";
var mdiArchiveOutline = "M20 21H4V10H6V19H18V10H20V21M3 3H21V9H3V3M9.5 11H14.5C14.78 11 15 11.22 15 11.5V13H9V11.5C9 11.22 9.22 11 9.5 11M5 5V7H19V5H5Z";
var mdiArrowLeft = "M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z";
var mdiAutoFix = "M7.5,5.6L5,7L6.4,4.5L5,2L7.5,3.4L10,2L8.6,4.5L10,7L7.5,5.6M19.5,15.4L22,14L20.6,16.5L22,19L19.5,17.6L17,19L18.4,16.5L17,14L19.5,15.4M22,2L20.6,4.5L22,7L19.5,5.6L17,7L18.4,4.5L17,2L19.5,3.4L22,2M13.34,12.78L15.78,10.34L13.66,8.22L11.22,10.66L13.34,12.78M14.37,7.29L16.71,9.63C17.1,10 17.1,10.65 16.71,11.04L5.04,22.71C4.65,23.1 4,23.1 3.63,22.71L1.29,20.37C0.9,20 0.9,19.35 1.29,18.96L12.96,7.29C13.35,6.9 14,6.9 14.37,7.29Z";
var mdiBatteryAlert = "M13 14H11V8H13M13 18H11V16H13M16.7 4H15V2H9V4H7.3C6.6 4 6 4.6 6 5.3V20.6C6 21.4 6.6 22 7.3 22H16.6C17.3 22 17.9 21.4 17.9 20.7V5.3C18 4.6 17.4 4 16.7 4Z";
var mdiBatteryChargingOutline = "M23.05,11H20.05V4L15.05,14H18.05V22M12,20H4L4.05,6H12.05M12.72,4H11.05V2H5.05V4H3.38A1.33,1.33 0 0,0 2.05,5.33V20.67C2.05,21.4 2.65,22 3.38,22H12.72C13.45,22 14.05,21.4 14.05,20.67V5.33A1.33,1.33 0 0,0 12.72,4Z";
var mdiBatterySync = "M13.54 22H7.33C6.6 22 6 21.4 6 20.67V5.33C6 4.6 6.6 4 7.33 4H9V2H15V4H16.67C17.4 4 18 4.6 18 5.33V12C14.69 12 12 14.69 12 18C12 19.54 12.58 20.94 13.54 22M18 13L20.25 15.25L18 17.5V16C16.15 16 14.94 17.96 15.76 19.62L14.67 20.71C12.91 18.05 14.81 14.5 18 14.5V13M18 24L15.75 21.75L18 19.5V21C19.85 21 21.06 19.04 20.24 17.38L21.33 16.29C23.09 18.95 21.19 22.5 18 22.5V24";
var mdiBellAlert = "M23 7V13H21V7M21 15H23V17H21M12 2A2 2 0 0 0 10 4A2 2 0 0 0 10 4.29C7.12 5.14 5 7.82 5 11V17L3 19V20H21V19L19 17V11C19 7.82 16.88 5.14 14 4.29A2 2 0 0 0 14 4A2 2 0 0 0 12 2M10 21A2 2 0 0 0 12 23A2 2 0 0 0 14 21Z";
var mdiBookOpenVariant = "M12 21.5C10.65 20.65 8.2 20 6.5 20C4.85 20 3.15 20.3 1.75 21.05C1.65 21.1 1.6 21.1 1.5 21.1C1.25 21.1 1 20.85 1 20.6V6C1.6 5.55 2.25 5.25 3 5C4.11 4.65 5.33 4.5 6.5 4.5C8.45 4.5 10.55 4.9 12 6C13.45 4.9 15.55 4.5 17.5 4.5C18.67 4.5 19.89 4.65 21 5C21.75 5.25 22.4 5.55 23 6V20.6C23 20.85 22.75 21.1 22.5 21.1C22.4 21.1 22.35 21.1 22.25 21.05C20.85 20.3 19.15 20 17.5 20C15.8 20 13.35 20.65 12 21.5M12 8V19.5C13.35 18.65 15.8 18 17.5 18C18.7 18 19.9 18.15 21 18.5V7C19.9 6.65 18.7 6.5 17.5 6.5C15.8 6.5 13.35 7.15 12 8M13 11.5C14.11 10.82 15.6 10.5 17.5 10.5C18.41 10.5 19.26 10.59 20 10.78V9.23C19.13 9.08 18.29 9 17.5 9C15.73 9 14.23 9.28 13 9.84V11.5M17.5 11.67C15.79 11.67 14.29 11.93 13 12.46V14.15C14.11 13.5 15.6 13.16 17.5 13.16C18.54 13.16 19.38 13.24 20 13.4V11.9C19.13 11.74 18.29 11.67 17.5 11.67M20 14.57C19.13 14.41 18.29 14.33 17.5 14.33C15.67 14.33 14.17 14.6 13 15.13V16.82C14.11 16.16 15.6 15.83 17.5 15.83C18.54 15.83 19.38 15.91 20 16.07V14.57Z";
var mdiCalendarAlert = "M6 1V3H5C3.89 3 3 3.89 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3H18V1H16V3H8V1H6M5 8H19V19H5V8M11 9V14H13V9H11M11 16V18H13V16H11Z";
var mdiCalendarArrowRight = "M19 3H18V1H16V3H8V1H6V3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.89 20.1 3 19 3M19 19H5V8H19V19M12 17V15H8V12H12V10L16 13.5L12 17Z";
var mdiCalendarClock = "M15,13H16.5V15.82L18.94,17.23L18.19,18.53L15,16.69V13M19,8H5V19H9.67C9.24,18.09 9,17.07 9,16A7,7 0 0,1 16,9C17.07,9 18.09,9.24 19,9.67V8M5,21C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3H6V1H8V3H16V1H18V3H19A2,2 0 0,1 21,5V11.1C22.24,12.36 23,14.09 23,16A7,7 0 0,1 16,23C14.09,23 12.36,22.24 11.1,21H5M16,11.15A4.85,4.85 0 0,0 11.15,16C11.15,18.68 13.32,20.85 16,20.85A4.85,4.85 0 0,0 20.85,16C20.85,13.32 18.68,11.15 16,11.15Z";
var mdiCalendarMonth = "M9,10V12H7V10H9M13,10V12H11V10H13M17,10V12H15V10H17M19,3A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H6V1H8V3H16V1H18V3H19M19,19V8H5V19H19M9,14V16H7V14H9M13,14V16H11V14H13M17,14V16H15V14H17Z";
var mdiCalendarRemove = "M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M9.31,17L11.75,14.56L14.19,17L15.25,15.94L12.81,13.5L15.25,11.06L14.19,10L11.75,12.44L9.31,10L8.25,11.06L10.69,13.5L8.25,15.94L9.31,17Z";
var mdiCalendarSync = "M18,11V12.5C21.19,12.5 23.09,16.05 21.33,18.71L20.24,17.62C21.06,15.96 19.85,14 18,14V15.5L15.75,13.25L18,11M18,22V20.5C14.81,20.5 12.91,16.95 14.67,14.29L15.76,15.38C14.94,17.04 16.15,19 18,19V17.5L20.25,19.75L18,22M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H14C13.36,20.45 12.86,19.77 12.5,19H5V8H19V10.59C19.71,10.7 20.39,10.94 21,11.31V5A2,2 0 0,0 19,3Z";
var mdiCalendarToday = "M7,10H12V15H7M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z";
var mdiCalendarWeek = "M6 1H8V3H16V1H18V3H19C20.11 3 21 3.9 21 5V19C21 20.11 20.11 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.89 3.89 3 5 3H6V1M5 8V19H19V8H5M7 10H17V12H7V10Z";
var mdiCalendarWeekBegin = "M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M9,10H7V17H9V10Z";
var mdiCamera = "M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z";
var mdiCartArrowDown = "M10 0V4H8L12 8L16 4H14V0M1 2V4H3L6.6 11.6L5.2 14C5.1 14.3 5 14.6 5 15C5 16.1 5.9 17 7 17H19V15H7.4C7.3 15 7.2 14.9 7.2 14.8V14.7L8.1 13H15.5C16.2 13 16.9 12.6 17.2 12L21.1 5L19.4 4L15.5 11H8.5L4.3 2M7 18C5.9 18 5 18.9 5 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18M17 18C15.9 18 15 18.9 15 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z";
var mdiChartLine = "M16,11.78L20.24,4.45L21.97,5.45L16.74,14.5L10.23,10.75L5.46,19H22V21H2V3H4V17.54L9.5,8L16,11.78Z";
var mdiChartLineVariant = "M3.5,18.5L9.5,12.5L13.5,16.5L22,6.92L20.59,5.5L13.5,13.5L9.5,9.5L2,17L3.5,18.5Z";
var mdiCheck = "M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z";
var mdiCheckCircle = "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z";
var mdiCheckCircleOutline = "M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M12 20C7.59 20 4 16.41 4 12S7.59 4 12 4 20 7.59 20 12 16.41 20 12 20M16.59 7.58L10 14.17L7.41 11.59L6 13L10 17L18 9L16.59 7.58Z";
var mdiCheckboxMultipleMarkedOutline = "M20,16V10H22V16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H16V4H8V16H20M10.91,7.08L14,10.17L20.59,3.58L22,5L14,13L9.5,8.5L10.91,7.08M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16Z";
var mdiChevronDoubleDown = "M16.59,5.59L18,7L12,13L6,7L7.41,5.59L12,10.17L16.59,5.59M16.59,11.59L18,13L12,19L6,13L7.41,11.59L12,16.17L16.59,11.59Z";
var mdiChevronDoubleUp = "M7.41,18.41L6,17L12,11L18,17L16.59,18.41L12,13.83L7.41,18.41M7.41,12.41L6,11L12,5L18,11L16.59,12.41L12,7.83L7.41,12.41Z";
var mdiChevronDown = "M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z";
var mdiChevronRight = "M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z";
var mdiChevronUp = "M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z";
var mdiCircle = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z";
var mdiCircleMedium = "M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z";
var mdiClipboardCheckOutline = "M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M7,7H17V5H19V19H5V5H7V7M7.5,13.5L9,12L11,14L15.5,9.5L17,11L11,17L7.5,13.5Z";
var mdiClipboardPlusOutline = "M19 3H14.82C14.4 1.84 13.3 1 12 1S9.6 1.84 9.18 3H5C3.9 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3M12 3C12.55 3 13 3.45 13 4S12.55 5 12 5 11 4.55 11 4 11.45 3 12 3M7 7H17V5H19V19H5V5H7V7M13 12H16V14H13V17H11V14H8V12H11V9H13V12Z";
var mdiClockOutline = "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z";
var mdiClockTimeFourOutline = "M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M17 13.9L16.3 15.2L11 12.3V7H12.5V11.4L17 13.9Z";
var mdiClose = "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z";
var mdiCogOutline = "M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10M11.25,4L10.88,6.61C9.68,6.86 8.62,7.5 7.85,8.39L5.44,7.35L4.69,8.65L6.8,10.2C6.4,11.37 6.4,12.64 6.8,13.8L4.68,15.36L5.43,16.66L7.86,15.62C8.63,16.5 9.68,17.14 10.87,17.38L11.24,20H12.76L13.13,17.39C14.32,17.14 15.37,16.5 16.14,15.62L18.57,16.66L19.32,15.36L17.2,13.81C17.6,12.64 17.6,11.37 17.2,10.2L19.31,8.65L18.56,7.35L16.15,8.39C15.38,7.5 14.32,6.86 13.12,6.62L12.75,4H11.25Z";
var mdiContentSave = "M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z";
var mdiDelete = "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z";
var mdiDeleteOutline = "M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19M8,9H16V19H8V9M15.5,4L14.5,3H9.5L8.5,4H5V6H19V4H15.5Z";
var mdiDevices = "M3 6H21V4H3C1.9 4 1 4.9 1 6V18C1 19.1 1.9 20 3 20H7V18H3V6M13 12H9V13.78C8.39 14.33 8 15.11 8 16C8 16.89 8.39 17.67 9 18.22V20H13V18.22C13.61 17.67 14 16.88 14 16S13.61 14.33 13 13.78V12M11 17.5C10.17 17.5 9.5 16.83 9.5 16S10.17 14.5 11 14.5 12.5 15.17 12.5 16 11.83 17.5 11 17.5M22 8H16C15.5 8 15 8.5 15 9V19C15 19.5 15.5 20 16 20H22C22.5 20 23 19.5 23 19V9C23 8.5 22.5 8 22 8M21 18H17V10H21V18Z";
var mdiDownload = "M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z";
var mdiEyeOffOutline = "M2,5.27L3.28,4L20,20.72L18.73,22L15.65,18.92C14.5,19.3 13.28,19.5 12,19.5C7,19.5 2.73,16.39 1,12C1.69,10.24 2.79,8.69 4.19,7.46L2,5.27M12,9A3,3 0 0,1 15,12C15,12.35 14.94,12.69 14.83,13L11,9.17C11.31,9.06 11.65,9 12,9M12,4.5C17,4.5 21.27,7.61 23,12C22.18,14.08 20.79,15.88 19,17.19L17.58,15.76C18.94,14.82 20.06,13.54 20.82,12C19.17,8.64 15.76,6.5 12,6.5C10.91,6.5 9.84,6.68 8.84,7L7.3,5.47C8.74,4.85 10.33,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C12.69,17.5 13.37,17.43 14,17.29L11.72,15C10.29,14.85 9.15,13.71 9,12.28L5.6,8.87C4.61,9.72 3.78,10.78 3.18,12Z";
var mdiEyeOutline = "M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9M12,4.5C17,4.5 21.27,7.61 23,12C21.27,16.39 17,19.5 12,19.5C7,19.5 2.73,16.39 1,12C2.73,7.61 7,4.5 12,4.5M3.18,12C4.83,15.36 8.24,17.5 12,17.5C15.76,17.5 19.17,15.36 20.82,12C19.17,8.64 15.76,6.5 12,6.5C8.24,6.5 4.83,8.64 3.18,12Z";
var mdiFileDelimitedOutline = "M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2M18 20H6V4H13V9H18V20M10 19L12 15H9V10H15V15L13 19H10";
var mdiFileDocumentOutline = "M6,2A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2H6M6,4H13V9H18V20H6V4M8,12V14H16V12H8M8,16V18H13V16H8Z";
var mdiFilterVariant = "M6,13H18V11H6M3,6V8H21V6M10,18H14V16H10V18Z";
var mdiFloorPlan = "M10,5V10H9V5H5V13H9V12H10V17H9V14H5V19H12V17H13V19H19V17H21V21H3V3H21V15H19V10H13V15H12V9H19V5H10Z";
var mdiFolderOutline = "M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z";
var mdiFormatListChecks = "M3,5H9V11H3V5M5,7V9H7V7H5M11,7H21V9H11V7M11,15H21V17H11V15M5,20L1.5,16.5L2.91,15.09L5,17.17L9.59,12.59L11,14L5,20Z";
var mdiHelpCircleOutline = "M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,10H10A2,2 0 0,1 12,8A2,2 0 0,1 14,10C14,12 11,11.75 11,15H13C13,12.75 16,12.5 16,10A4,4 0 0,0 12,6Z";
var mdiHomeFloor1 = "M12,3L2,12H5V20H19V12H22L12,3M10,8H14V18H12V10H10V8Z";
var mdiImageOutline = "M19,19H5V5H19M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.96,12.29L11.21,15.83L9.25,13.47L6.5,17H17.5L13.96,12.29Z";
var mdiInformationOutline = "M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z";
var mdiLinkVariant = "M10.59,13.41C11,13.8 11,14.44 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C7.22,12.88 7.22,9.71 9.17,7.76V7.76L12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.59,9.17C9.41,10.34 9.41,12.24 10.59,13.41M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.78,11.12 16.78,14.29 14.83,16.24V16.24L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L13.41,14.83C14.59,13.66 14.59,11.76 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z";
var mdiLinkVariantOff = "M2,5.27L3.28,4L20,20.72L18.73,22L13.9,17.17L11.29,19.78C9.34,21.73 6.17,21.73 4.22,19.78C2.27,17.83 2.27,14.66 4.22,12.71L5.71,11.22C5.7,12.04 5.83,12.86 6.11,13.65L5.64,14.12C4.46,15.29 4.46,17.19 5.64,18.36C6.81,19.54 8.71,19.54 9.88,18.36L12.5,15.76L10.88,14.15C10.87,14.39 10.77,14.64 10.59,14.83C10.2,15.22 9.56,15.22 9.17,14.83C8.12,13.77 7.63,12.37 7.72,11L2,5.27M12.71,4.22C14.66,2.27 17.83,2.27 19.78,4.22C21.73,6.17 21.73,9.34 19.78,11.29L18.29,12.78C18.3,11.96 18.17,11.14 17.89,10.36L18.36,9.88C19.54,8.71 19.54,6.81 18.36,5.64C17.19,4.46 15.29,4.46 14.12,5.64L10.79,8.97L9.38,7.55L12.71,4.22M13.41,9.17C13.8,8.78 14.44,8.78 14.83,9.17C16.2,10.54 16.61,12.5 16.06,14.23L14.28,12.46C14.23,11.78 13.94,11.11 13.41,10.59C13,10.2 13,9.56 13.41,9.17Z";
var mdiLinkVariantPlus = "M10.6 13.4A1 1 0 0 1 9.2 14.8A4.8 4.8 0 0 1 9.2 7.8L12.7 4.2A5.1 5.1 0 0 1 19.8 4.2A5.1 5.1 0 0 1 19.8 11.3L18.3 12.8A6.4 6.4 0 0 0 17.9 10.4L18.4 9.9A3.2 3.2 0 0 0 18.4 5.6A3.2 3.2 0 0 0 14.1 5.6L10.6 9.2A2.9 2.9 0 0 0 10.6 13.4M23 18V20H20V23H18V20H15V18H18V15H20V18M16.2 13.7A4.8 4.8 0 0 0 14.8 9.2A1 1 0 0 0 13.4 10.6A2.9 2.9 0 0 1 13.4 14.8L9.9 18.4A3.2 3.2 0 0 1 5.6 18.4A3.2 3.2 0 0 1 5.6 14.1L6.1 13.7A7.3 7.3 0 0 1 5.7 11.2L4.2 12.7A5.1 5.1 0 0 0 4.2 19.8A5.1 5.1 0 0 0 11.3 19.8L13.1 18A6 6 0 0 1 16.2 13.7Z";
var mdiMagnify = "M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z";
var mdiMapMarkerOutline = "M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z";
var mdiMenuDown = "M7,10L12,15L17,10H7Z";
var mdiNfcVariant = "M18,6H13A2,2 0 0,0 11,8V10.28C10.41,10.62 10,11.26 10,12A2,2 0 0,0 12,14C13.11,14 14,13.1 14,12C14,11.26 13.6,10.62 13,10.28V8H16V16H8V8H10V6H8L6,6V18H18M20,20H4V4H20M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20C21.11,22 22,21.1 22,20V4C22,2.89 21.11,2 20,2Z";
var mdiNoteTextOutline = "M15 3H5A2 2 0 0 0 3 5V19A2 2 0 0 0 5 21H19A2 2 0 0 0 21 19V9L15 3M19 19H5V5H14V10H19M17 14H7V12H17M14 17H7V15H14";
var mdiOpenInNew = "M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z";
var mdiPackageVariant = "M2,10.96C1.5,10.68 1.35,10.07 1.63,9.59L3.13,7C3.24,6.8 3.41,6.66 3.6,6.58L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.66,6.72 20.82,6.88 20.91,7.08L22.36,9.6C22.64,10.08 22.47,10.69 22,10.96L21,11.54V16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V10.96C2.7,11.13 2.32,11.14 2,10.96M12,4.15V4.15L12,10.85V10.85L17.96,7.5L12,4.15M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V12.69L14,15.59C13.67,15.77 13.3,15.76 13,15.6V19.29L19,15.91M13.85,13.36L20.13,9.73L19.55,8.72L13.27,12.35L13.85,13.36Z";
var mdiPackageVariantClosed = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5M12,4.15L10.11,5.22L16,8.61L17.96,7.5L12,4.15M6.04,7.5L12,10.85L13.96,9.75L8.08,6.35L6.04,7.5M5,15.91L11,19.29V12.58L5,9.21V15.91M19,15.91V9.21L13,12.58V19.29L19,15.91Z";
var mdiPackageVariantClosedPlus = "M13 19.3V12.6L19 9.2V13C19.7 13 20.4 13.1 21 13.4V7.5C21 7.1 20.8 6.8 20.5 6.6L12.6 2.2C12.4 2.1 12.2 2 12 2S11.6 2.1 11.4 2.2L3.5 6.6C3.2 6.8 3 7.1 3 7.5V16.5C3 16.9 3.2 17.2 3.5 17.4L11.4 21.8C11.6 21.9 11.8 22 12 22S12.4 21.9 12.6 21.8L13.5 21.3C13.2 20.7 13.1 20 13 19.3M12 4.2L18 7.5L16 8.6L10.1 5.2L12 4.2M11 19.3L5 15.9V9.2L11 12.6V19.3M12 10.8L6 7.5L8 6.3L14 9.8L12 10.8M20 15V18H23V20H20V23H18V20H15V18H18V15H20Z";
var mdiPaperclip = "M16.5,6V17.5A4,4 0 0,1 12.5,21.5A4,4 0 0,1 8.5,17.5V5A2.5,2.5 0 0,1 11,2.5A2.5,2.5 0 0,1 13.5,5V15.5A1,1 0 0,1 12.5,16.5A1,1 0 0,1 11.5,15.5V6H10V15.5A2.5,2.5 0 0,0 12.5,18A2.5,2.5 0 0,0 15,15.5V5A4,4 0 0,0 11,1A4,4 0 0,0 7,5V17.5A5.5,5.5 0 0,0 12.5,23A5.5,5.5 0 0,0 18,17.5V6H16.5Z";
var mdiPauseCircleOutline = "M13,16V8H15V16H13M9,16V8H11V16H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z";
var mdiPencil = "M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z";
var mdiPlaylistPlus = "M3 16H10V14H3M18 14V10H16V14H12V16H16V20H18V16H22V14M14 6H3V8H14M14 10H3V12H14V10Z";
var mdiPlus = "M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z";
var mdiPlusBox = "M17,13H13V17H11V13H7V11H11V7H13V11H17M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z";
var mdiPlusMinusVariant = "M3 7H6V4H8V7H11V9H8V12H6V9H3V7M13 15H21V17H13V15M16.04 3H18.35L7.96 21H5.65L16.04 3Z";
var mdiPulse = "M3,13H5.79L10.1,4.79L11.28,13.75L14.5,9.66L17.83,13H21V15H17L14.67,12.67L9.92,18.73L8.94,11.31L7,15H3V13Z";
var mdiQrcode = "M3,11H5V13H3V11M11,5H13V9H11V5M9,11H13V15H11V13H9V11M15,11H17V13H19V11H21V13H19V15H21V19H19V21H17V19H13V21H11V17H15V15H17V13H15V11M19,19V15H17V19H19M15,3H21V9H15V3M17,5V7H19V5H17M3,3H9V9H3V3M5,5V7H7V5H5M3,15H9V21H3V15M5,17V19H7V17H5Z";
var mdiReceiptTextOutline = "M19.5 3.5L18 2L16.5 3.5L15 2L13.5 3.5L12 2L10.5 3.5L9 2L7.5 3.5L6 2L4.5 3.5L3 2V22L4.5 20.5L6 22L7.5 20.5L9 22L10.5 20.5L12 22L13.5 20.5L15 22L16.5 20.5L18 22L19.5 20.5L21 22V2L19.5 3.5M19 19H5V5H19V19M6 15H18V17H6M6 11H18V13H6M6 7H18V9H6V7Z";
var mdiRefresh = "M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z";
var mdiRestart = "M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z";
var mdiShieldCheck = "M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1Z";
var mdiSkipNext = "M16,18H18V6H16M6,18L14.5,12L6,6V18Z";
var mdiTable = "M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z";
var mdiTagOutline = "M21.41 11.58L12.41 2.58A2 2 0 0 0 11 2H4A2 2 0 0 0 2 4V11A2 2 0 0 0 2.59 12.42L11.59 21.42A2 2 0 0 0 13 22A2 2 0 0 0 14.41 21.41L21.41 14.41A2 2 0 0 0 22 13A2 2 0 0 0 21.41 11.58M13 20L4 11V4H11L20 13M6.5 5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 6.5 5Z";
var mdiTrayArrowDown = "M2 12H4V17H20V12H22V17C22 18.11 21.11 19 20 19H4C2.9 19 2 18.11 2 17V12M12 15L17.55 9.54L16.13 8.13L13 11.25V2H11V11.25L7.88 8.13L6.46 9.55L12 15Z";
var mdiTrendingUp = "M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z";
var mdiUpdate = "M21,10.12H14.22L16.96,7.3C14.23,4.6 9.81,4.5 7.08,7.2C4.35,9.91 4.35,14.28 7.08,17C9.81,19.7 14.23,19.7 16.96,17C18.32,15.65 19,14.08 19,12.1H21C21,14.08 20.12,16.65 18.36,18.39C14.85,21.87 9.15,21.87 5.64,18.39C2.14,14.92 2.11,9.28 5.62,5.81C9.13,2.34 14.76,2.34 18.27,5.81L21,3V10.12M12.5,8V12.25L16,14.33L15.28,15.54L11,13V8H12.5Z";
var mdiUpload = "M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z";
var mdiViewGridOutline = "M3 11H11V3H3M5 5H9V9H5M13 21H21V13H13M15 15H19V19H15M3 21H11V13H3M5 15H9V19H5M13 3V11H21V3M19 9H15V5H19Z";
var mdiViewGridPlusOutline = "M3 21H11V13H3M5 15H9V19H5M3 11H11V3H3M5 5H9V9H5M13 3V11H21V3M19 9H15V5H19M18 16H21V18H18V21H16V18H13V16H16V13H18Z";
var mdiWrench = "M22.7,19L13.6,9.9C14.5,7.6 14,4.9 12.1,3C10.1,1 7.1,0.6 4.7,1.7L9,6L6,9L1.6,4.7C0.4,7.1 0.9,10.1 2.9,12.1C4.8,14 7.5,14.5 9.8,13.6L18.9,22.7C19.3,23.1 19.9,23.1 20.3,22.7L22.6,20.4C23.1,20 23.1,19.3 22.7,19Z";
var mdiWrenchClock = "M10 6.2C10 4.3 8.8 2.6 7 2V5.7H4V2C2.2 2.6 1 4.3 1 6.2C1 8.1 2.2 9.8 4 10.4V21.4C4 21.8 4.2 22 4.5 22H6.5C6.8 22 7 21.8 7 21.5V10.5C8.8 9.9 10 8.2 10 6.2M16 8C16 8 15.9 8 16 8C12.1 8.1 9 11.2 9 15C9 18.9 12.1 22 16 22S23 18.9 23 15 19.9 8 16 8M16 20C13.2 20 11 17.8 11 15S13.2 10 16 10 21 12.2 21 15 18.8 20 16 20M15 11V16L18.6 18.2L19.4 17L16.5 15.3V11H15Z";

// ds-mdi-map.ts
var DS_MDI_PATHS = {
  "mdi:account": mdiAccount,
  "mdi:account-outline": mdiAccountOutline,
  "mdi:alert-circle": mdiAlertCircle,
  "mdi:alert-circle-check-outline": mdiAlertCircleCheckOutline,
  "mdi:alert-octagon": mdiAlertOctagon,
  "mdi:archive-arrow-up-outline": mdiArchiveArrowUpOutline,
  "mdi:archive-outline": mdiArchiveOutline,
  "mdi:arrow-left": mdiArrowLeft,
  "mdi:auto-fix": mdiAutoFix,
  "mdi:battery-alert": mdiBatteryAlert,
  "mdi:battery-charging-outline": mdiBatteryChargingOutline,
  "mdi:battery-sync": mdiBatterySync,
  "mdi:bell-alert": mdiBellAlert,
  "mdi:book-open-variant": mdiBookOpenVariant,
  "mdi:calendar-alert": mdiCalendarAlert,
  "mdi:calendar-arrow-right": mdiCalendarArrowRight,
  "mdi:calendar-clock": mdiCalendarClock,
  "mdi:calendar-month": mdiCalendarMonth,
  "mdi:calendar-remove": mdiCalendarRemove,
  "mdi:calendar-sync": mdiCalendarSync,
  "mdi:calendar-today": mdiCalendarToday,
  "mdi:calendar-week": mdiCalendarWeek,
  "mdi:calendar-week-begin": mdiCalendarWeekBegin,
  "mdi:camera": mdiCamera,
  "mdi:cart-arrow-down": mdiCartArrowDown,
  "mdi:chart-line": mdiChartLine,
  "mdi:chart-line-variant": mdiChartLineVariant,
  "mdi:check": mdiCheck,
  "mdi:check-circle": mdiCheckCircle,
  "mdi:check-circle-outline": mdiCheckCircleOutline,
  "mdi:checkbox-multiple-marked-outline": mdiCheckboxMultipleMarkedOutline,
  "mdi:chevron-double-down": mdiChevronDoubleDown,
  "mdi:chevron-double-up": mdiChevronDoubleUp,
  "mdi:chevron-down": mdiChevronDown,
  "mdi:chevron-right": mdiChevronRight,
  "mdi:chevron-up": mdiChevronUp,
  "mdi:circle": mdiCircle,
  "mdi:circle-medium": mdiCircleMedium,
  "mdi:clipboard-check-outline": mdiClipboardCheckOutline,
  "mdi:clipboard-plus-outline": mdiClipboardPlusOutline,
  "mdi:clock-outline": mdiClockOutline,
  "mdi:clock-time-four-outline": mdiClockTimeFourOutline,
  "mdi:close": mdiClose,
  "mdi:cog-outline": mdiCogOutline,
  "mdi:content-save": mdiContentSave,
  "mdi:delete": mdiDelete,
  "mdi:delete-outline": mdiDeleteOutline,
  "mdi:devices": mdiDevices,
  "mdi:download": mdiDownload,
  "mdi:eye-off-outline": mdiEyeOffOutline,
  "mdi:eye-outline": mdiEyeOutline,
  "mdi:file-delimited-outline": mdiFileDelimitedOutline,
  "mdi:file-document-outline": mdiFileDocumentOutline,
  "mdi:filter-variant": mdiFilterVariant,
  "mdi:floor-plan": mdiFloorPlan,
  "mdi:folder-outline": mdiFolderOutline,
  "mdi:format-list-checks": mdiFormatListChecks,
  "mdi:help-circle-outline": mdiHelpCircleOutline,
  "mdi:home-floor-1": mdiHomeFloor1,
  "mdi:image-outline": mdiImageOutline,
  "mdi:information-outline": mdiInformationOutline,
  "mdi:link-variant": mdiLinkVariant,
  "mdi:link-variant-off": mdiLinkVariantOff,
  "mdi:link-variant-plus": mdiLinkVariantPlus,
  "mdi:magnify": mdiMagnify,
  "mdi:map-marker-outline": mdiMapMarkerOutline,
  "mdi:menu-down": mdiMenuDown,
  "mdi:nfc-variant": mdiNfcVariant,
  "mdi:note-text-outline": mdiNoteTextOutline,
  "mdi:open-in-new": mdiOpenInNew,
  "mdi:package-variant": mdiPackageVariant,
  "mdi:package-variant-closed": mdiPackageVariantClosed,
  "mdi:package-variant-closed-plus": mdiPackageVariantClosedPlus,
  "mdi:paperclip": mdiPaperclip,
  "mdi:pause-circle-outline": mdiPauseCircleOutline,
  "mdi:pencil": mdiPencil,
  "mdi:playlist-plus": mdiPlaylistPlus,
  "mdi:plus": mdiPlus,
  "mdi:plus-box": mdiPlusBox,
  "mdi:plus-minus-variant": mdiPlusMinusVariant,
  "mdi:pulse": mdiPulse,
  "mdi:qrcode": mdiQrcode,
  "mdi:receipt-text-outline": mdiReceiptTextOutline,
  "mdi:refresh": mdiRefresh,
  "mdi:restart": mdiRestart,
  "mdi:shield-check": mdiShieldCheck,
  "mdi:skip-next": mdiSkipNext,
  "mdi:table": mdiTable,
  "mdi:tag-outline": mdiTagOutline,
  "mdi:tray-arrow-down": mdiTrayArrowDown,
  "mdi:trending-up": mdiTrendingUp,
  "mdi:update": mdiUpdate,
  "mdi:upload": mdiUpload,
  "mdi:view-grid-outline": mdiViewGridOutline,
  "mdi:view-grid-plus-outline": mdiViewGridPlusOutline,
  "mdi:wrench": mdiWrench,
  "mdi:wrench-clock": mdiWrenchClock
};

// ds-host-stubs.ts
var define = (tag, cls) => {
  if (!customElements.get(tag)) customElements.define(tag, cls);
};
var svgIcon = (path, size = "100%") => {
  const d3 = path || DS_MDI_PATHS["mdi:circle-medium"];
  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("viewBox", "0 0 24 24");
  el.style.width = size;
  el.style.height = size;
  el.style.fill = "currentColor";
  const p3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p3.setAttribute("d", d3);
  el.appendChild(p3);
  return el;
};
var DsHaIcon = class extends i4 {
  render() {
    return svgIcon(this.icon ? DS_MDI_PATHS[this.icon] : void 0);
  }
};
DsHaIcon.properties = { icon: { type: String } };
DsHaIcon.styles = i`
    :host { display: inline-flex; width: var(--mdc-icon-size, 24px); height: var(--mdc-icon-size, 24px); vertical-align: middle; }
  `;
define("ha-icon", DsHaIcon);
var DsHaSvgIcon = class extends i4 {
  render() {
    return svgIcon(this.path);
  }
};
DsHaSvgIcon.properties = { path: { type: String } };
DsHaSvgIcon.styles = i`
    :host { display: inline-flex; width: var(--mdc-icon-size, 24px); height: var(--mdc-icon-size, 24px); vertical-align: middle; }
  `;
define("ha-svg-icon", DsHaSvgIcon);
var DsHaCard = class extends i4 {
  render() {
    return b2`${this.header ? b2`<h1 class="hdr">${this.header}</h1>` : A}<slot></slot>`;
  }
};
DsHaCard.properties = { header: { type: String } };
DsHaCard.styles = i`
    :host {
      display: block;
      background: var(--card-background-color, var(--ha-card-background, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      box-shadow: var(--ha-card-box-shadow, none);
      color: var(--primary-text-color, #212121);
      overflow: hidden;
    }
    .hdr { padding: 12px 16px 0; font-size: 22px; font-weight: 400; line-height: 28px; }
  `;
define("ha-card", DsHaCard);
var DsHaButton = class extends i4 {
  render() {
    return b2`<button ?disabled=${this.disabled}><slot></slot></button>`;
  }
};
DsHaButton.properties = { appearance: { type: String }, disabled: { type: Boolean } };
DsHaButton.styles = i`
    :host { display: inline-block; }
    button {
      font: 500 14px/36px Roboto, system-ui, sans-serif;
      letter-spacing: 0.5px;
      padding: 0 16px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      /* Honor the mwc theme override first — HA's .danger idiom recolors
         buttons via --mdc-theme-primary (wave-1 finding). */
      background: var(--mdc-theme-primary, var(--primary-color, #03a9f4));
      color: var(--text-primary-color, #fff);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    :host([appearance="plain"]) button,
    :host([appearance="outlined"]) button {
      background: transparent;
      color: var(--mdc-theme-primary, var(--primary-color, #03a9f4));
    }
    :host([appearance="outlined"]) button { border: 1px solid var(--mdc-theme-primary, var(--primary-color, #03a9f4)); }
    button[disabled] { opacity: 0.45; cursor: default; }
  `;
define("ha-button", DsHaButton);
var DsIconButton = class extends i4 {
  render() {
    return b2`<button ?disabled=${this.disabled} aria-label=${this.label ?? ""}>
      ${this.path ? svgIcon(this.path) : b2`<slot></slot>`}
    </button>`;
  }
};
DsIconButton.properties = { path: { type: String }, disabled: { type: Boolean }, label: { type: String } };
DsIconButton.styles = i`
    :host { display: inline-flex; }
    button {
      width: 40px; height: 40px;
      border: none; border-radius: 50%;
      background: transparent; color: inherit;
      cursor: pointer;
      display: inline-flex; align-items: center; justify-content: center;
      padding: 8px;
    }
    button:hover { background: rgba(127, 127, 127, 0.12); }
    button[disabled] { opacity: 0.45; cursor: default; }
  `;
define("ha-icon-button", DsIconButton);
define("mwc-icon-button", class extends DsIconButton {
});
var DsHaTextfield = class extends i4 {
  render() {
    return b2`
      ${this.label ? b2`<label>${this.label}</label>` : A}
      <input
        .value=${this.value ?? ""}
        type=${this.type ?? "text"}
        ?disabled=${this.disabled}
        @input=${(e7) => {
      this.value = e7.target.value;
    }}
      />
    `;
  }
};
DsHaTextfield.properties = { label: { type: String }, value: { type: String }, type: { type: String }, disabled: { type: Boolean } };
DsHaTextfield.styles = i`
    :host { display: inline-block; min-width: 140px; }
    label { display: block; font-size: 12px; color: var(--secondary-text-color, #727272); margin-bottom: 2px; }
    input {
      width: 100%; box-sizing: border-box;
      font: 400 16px Roboto, system-ui, sans-serif;
      padding: 10px 12px;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.24));
      border-radius: 4px;
      background: transparent;
      color: var(--primary-text-color, #212121);
    }
  `;
define("ha-textfield", DsHaTextfield);
var DsHaDialog = class extends i4 {
  render() {
    if (!this.open) return A;
    return b2`
      <div class="scrim" @click=${() => this.dispatchEvent(new CustomEvent("closed"))}></div>
      <div class="panel">
        ${this.heading ? b2`<div class="heading">${this.heading}</div>` : A}
        <slot></slot>
      </div>
    `;
  }
};
DsHaDialog.properties = { open: { type: Boolean }, heading: { type: String } };
DsHaDialog.styles = i`
    :host { display: contents; }
    .scrim { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.38); z-index: 200; }
    .panel {
      /* Top-anchored, not vertically centered: a dialog taller than the
         viewport must clip at the BOTTOM (scrollable), never lose its head. */
      position: fixed; left: 50%; top: 16px; transform: translateX(-50%);
      z-index: 201;
      min-width: 320px; max-width: min(92vw, 580px); max-height: calc(100vh - 32px); overflow: auto;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #212121);
      border-radius: 12px;
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
      padding: 20px;
    }
    .heading { font-size: 20px; font-weight: 500; margin-bottom: 12px; }
  `;
define("ha-dialog", DsHaDialog);
var DsHaSwitch = class extends i4 {
  render() {
    return b2`<div class="track"><div class="thumb"></div></div>`;
  }
};
// reflect — the styles key off :host([checked]); without reflection every
// switch rendered off (wave-1 finding).
DsHaSwitch.properties = { checked: { type: Boolean, reflect: true }, disabled: { type: Boolean, reflect: true } };
DsHaSwitch.styles = i`
    :host { display: inline-flex; cursor: pointer; }
    .track {
      width: 36px; height: 14px; border-radius: 7px;
      background: var(--divider-color, rgba(0, 0, 0, 0.24));
      position: relative; margin: 5px 2px; transition: background 0.15s;
    }
    .thumb {
      position: absolute; top: -3px; left: 0;
      width: 20px; height: 20px; border-radius: 50%;
      background: #fafafa;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
      transition: left 0.15s, background 0.15s;
    }
    :host([checked]) .track { background: color-mix(in srgb, var(--primary-color, #03a9f4) 50%, transparent); }
    :host([checked]) .thumb { left: 16px; background: var(--primary-color, #03a9f4); }
    :host([disabled]) { opacity: 0.45; cursor: default; }
  `;
define("ha-switch", DsHaSwitch);
var DsHaFormfield = class extends i4 {
  render() {
    return b2`<slot></slot><span>${this.label ?? ""}</span>`;
  }
};
DsHaFormfield.properties = { label: { type: String } };
DsHaFormfield.styles = i`
    :host { display: inline-flex; align-items: center; gap: 10px; font: 400 14px Roboto, system-ui, sans-serif; }
  `;
define("ha-formfield", DsHaFormfield);
var DsPickerField = class extends i4 {
  render() {
    return b2`<div class="field">${svgIcon(DS_MDI_PATHS["mdi:magnify"], "20px")} ${this.label || this.tagName.toLowerCase().replace(/^ha-/, "").replace(/-/g, " ")}</div>`;
  }
};
DsPickerField.properties = { label: { type: String } };
DsPickerField.styles = i`
    :host { display: block; }
    .field {
      border: 1px dashed var(--divider-color, rgba(0, 0, 0, 0.3));
      border-radius: 4px;
      padding: 10px 12px;
      color: var(--secondary-text-color, #727272);
      font: 400 14px Roboto, system-ui, sans-serif;
      display: flex; align-items: center; gap: 8px;
    }
    /* svgIcon() emits width/height 100% — unconstrained it fills the whole
       field with a giant magnifier (wave-1 finding). */
    .field svg { width: 20px; height: 20px; flex: none; }
  `;
for (const tag of ["ha-form", "ha-selector", "ha-entities-picker", "ha-area-picker", "ha-service-picker", "ha-icon-picker"]) {
  define(tag, class extends DsPickerField {
  });
}

// maintenance-card.ts
init_lit();

// helpers/hydrate-objects.ts
var TASK_LIST_KEYS = [
  "assignee_pool",
  "required_completion_fields",
  "checklist",
  "labels",
  "history"
];
var TASK_DICT_KEYS = ["checklist_progress"];
var RESPONSE_LIST_KEYS = ["tasks", "parts"];
var OBJECT_LIST_KEYS = ["manual_docs", "battery_fleet_excluded"];
function fill(target, listKeys, dictKeys = []) {
  for (const k2 of listKeys) if (target[k2] === void 0) target[k2] = [];
  for (const k2 of dictKeys) if (target[k2] === void 0) target[k2] = {};
}
function hydrateObjectResponse(resp) {
  const r6 = resp;
  fill(r6, RESPONSE_LIST_KEYS);
  if (r6.object && typeof r6.object === "object") {
    fill(r6.object, OBJECT_LIST_KEYS);
  }
  for (const t5 of r6.tasks) fill(t5, TASK_LIST_KEYS, TASK_DICT_KEYS);
  return resp;
}
function hydrateObjects(objects) {
  for (const o7 of objects) hydrateObjectResponse(o7);
  return objects;
}

// helpers/subscription-merge.ts
function mergeSubscriptionEvent(current, event) {
  if (event.objects) return event.objects;
  const delta = event.delta || [];
  const removed = event.removed || [];
  if (!delta.length && !removed.length) return null;
  const byId = new Map(current.map((o7) => [o7.entry_id, o7]));
  for (const d3 of delta) byId.set(d3.entry_id, d3);
  for (const r6 of removed) byId.delete(r6);
  return [...byId.values()];
}
function applySubscriptionEvent(current, event) {
  if (event.objects) hydrateObjects(event.objects);
  if (event.delta) hydrateObjects(event.delta);
  return mergeSubscriptionEvent(current, event);
}

// maintenance-card.ts
init_decorators();
init_styles();

// helpers/document-url.ts
init_download();
async function signApiPath(hass, path, expires = 300) {
  const signed = await hass.connection.sendMessagePromise({
    type: "auth/sign_path",
    path,
    expires
  });
  return signed.path;
}
async function signDocumentPath(hass, docId, expires = 300) {
  return signApiPath(hass, `/api/maintenance_supporter/document/${docId}`, expires);
}
async function openSignedDocument(hass, docId, fragment = "") {
  const win = window.open("about:blank", "_blank");
  try {
    const path = await signDocumentPath(hass, docId);
    if (win) win.location.href = new URL(path + fragment, window.location.origin).href;
  } catch (e7) {
    if (win) win.close();
    throw e7;
  }
}
async function downloadSignedDocument(hass, docId, filename) {
  downloadUrl(await signDocumentPath(hass, docId, 30), filename);
}

// maintenance-card.ts
init_url();

// helpers/register-card.ts
function registerCustomCard(entry) {
  const w2 = window;
  w2.customCards = w2.customCards || [];
  if (!w2.customCards.some((c4) => c4.type === entry.type)) {
    w2.customCards.push(entry);
  }
}

// maintenance-card.ts
init_user_service();
init_shared_parts();

// maintenance-card-editor.ts
init_lit();
init_decorators();
init_styles();
var STATUS_KEYS = ["overdue", "triggered", "due_soon", "ok"];
var MaintenanceSupporterCardEditor = class extends i4 {
  constructor() {
    super(...arguments);
    this._config = { type: "custom:maintenance-supporter-card" };
    this._objects = [];
    this._loadingObjects = true;
    this._loadError = false;
    this._views = [];
    this._objectsLoaded = false;
    this._onEntitiesChanged = (e7) => {
      this._valueChanged("entity_ids", e7.detail.value || []);
    };
  }
  get _lang() {
    return langOf(this.hass);
  }
  setConfig(config) {
    this._config = { ...config };
  }
  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass && !this._objectsLoaded) {
      this._objectsLoaded = true;
      this._loadObjects();
    }
  }
  async _loadObjects() {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/objects"
      });
      this._objects = result.objects || [];
      this._loadError = false;
    } catch {
      this._objects = [];
      this._loadError = true;
    }
    this._loadingObjects = false;
    try {
      const res = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/views/list"
      });
      this._views = res.views || [];
    } catch {
      this._views = [];
    }
  }
  _valueChanged(key, value) {
    const newConfig = { ...this._config, [key]: value };
    if (Array.isArray(value) && value.length === 0 || value === "") {
      delete newConfig[key];
    }
    this._config = newConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: newConfig } })
    );
  }
  _toggleStatus(status, on) {
    const current = new Set(this._config.filter_status || []);
    if (on) current.add(status);
    else current.delete(status);
    this._valueChanged("filter_status", [...current]);
  }
  _toggleObject(name, on) {
    const current = new Set(this._config.filter_objects || []);
    if (on) current.add(name);
    else current.delete(name);
    this._valueChanged("filter_objects", [...current]);
  }
  _toggleLabel(label, on) {
    const current = new Set(this._config.filter_labels || []);
    if (on) current.add(label);
    else current.delete(label);
    this._valueChanged("filter_labels", [...current]);
  }
  _toggleArea(areaId, on) {
    const current = new Set(this._config.filter_areas || []);
    if (on) current.add(areaId);
    else current.delete(areaId);
    this._valueChanged("filter_areas", [...current]);
  }
  _togglePriority(priority, on) {
    const current = new Set(this._config.filter_priority || []);
    if (on) current.add(priority);
    else current.delete(priority);
    this._valueChanged("filter_priority", [...current]);
  }
  render() {
    const L2 = this._lang;
    const selectedStatuses = new Set(this._config.filter_status || []);
    const selectedObjects = new Set(this._config.filter_objects || []);
    const objectNames = [...this._objects].map((o7) => o7.object.name).sort((a3, b3) => a3.localeCompare(b3));
    const selectedAreas = new Set(this._config.filter_areas || []);
    const areaIds = [
      ...new Set(
        this._objects.map((o7) => o7.object.area_id).filter((a3) => !!a3).concat([...selectedAreas])
      )
    ];
    const areaName = (id) => this.hass?.areas?.[id]?.name || id;
    const areas = areaIds.map((id) => ({ id, name: areaName(id) })).sort((a3, b3) => a3.name.localeCompare(b3.name));
    const selectedLabels = new Set(this._config.filter_labels || []);
    const selectedPriorities = new Set(this._config.filter_priority || []);
    const labelNames = [
      ...new Set(this._objects.flatMap((o7) => o7.tasks.flatMap((tk) => tk.labels || [])))
    ].sort((a3, b3) => a3.localeCompare(b3));
    const ourEntities = [];
    for (const o7 of this._objects) {
      for (const t5 of o7.tasks) {
        if (t5.sensor_entity_id) ourEntities.push(t5.sensor_entity_id);
        if (t5.binary_sensor_entity_id) ourEntities.push(t5.binary_sensor_entity_id);
      }
    }
    return b2`
      <div class="editor">
        <ha-textfield
          label="${t3("card_title", L2)}"
          .value=${this._config.title || ""}
          @input=${(e7) => this._valueChanged("title", e7.target.value)}
        ></ha-textfield>

        <!-- Status filter (chip row) -->
        <div class="field">
          <div class="field-label">${t3("card_filter_status", L2)}</div>
          <div class="chip-row">
            ${STATUS_KEYS.map((s4) => b2`
              <label class="chip ${selectedStatuses.has(s4) ? "active" : ""}">
                <input type="checkbox"
                  .checked=${selectedStatuses.has(s4)}
                  @change=${(e7) => this._toggleStatus(s4, e7.target.checked)} />
                ${t3(s4, L2)}
              </label>
            `)}
          </div>
          <div class="field-help">${t3("card_filter_status_help", L2)}</div>
        </div>

        <!-- Object filter (multi-checkbox) -->
        <div class="field">
          <div class="field-label">${t3("card_filter_objects", L2)}</div>
          ${this._loadingObjects ? b2`<div class="field-help">${t3("card_loading_objects", L2)}</div>` : this._loadError ? b2`<div class="field-help error-text">${t3("card_load_error", L2)}</div>` : objectNames.length === 0 ? b2`<div class="field-help">${t3("no_objects", L2)}</div>` : b2`
                <div class="object-list">
                  ${objectNames.map((name) => b2`
                    <label class="object-row">
                      <input type="checkbox"
                        .checked=${selectedObjects.has(name)}
                        @change=${(e7) => this._toggleObject(name, e7.target.checked)} />
                      <span>${name}</span>
                    </label>
                  `)}
                </div>
                <div class="field-help">${t3("card_filter_objects_help", L2)}</div>
              `}
        </div>
        <!-- Area filter (C8): selects whole objects by the room they sit in.
             Hidden while no object has an area — the section would be an
             empty box otherwise. -->
        ${areas.length ? b2`
        <div class="field">
          <div class="field-label">${t3("card_filter_areas", L2)}</div>
          <div class="object-list">
            ${areas.map((a3) => b2`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${selectedAreas.has(a3.id)}
                  @change=${(e7) => this._toggleArea(a3.id, e7.target.checked)} />
                <span>${a3.name}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${t3("card_filter_areas_help", L2)}</div>
        </div>` : A}
        ${labelNames.length ? b2`
        <div class="field">
          <div class="field-label">${t3("labels", L2)}</div>
          <div class="object-list">
            ${labelNames.map((name) => b2`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${selectedLabels.has(name)}
                  @change=${(e7) => this._toggleLabel(name, e7.target.checked)} />
                <span>${name}</span>
              </label>
            `)}
          </div>
        </div>` : A}
        <div class="field">
          <div class="field-label">${t3("priority", L2)}</div>
          <div class="object-list">
            ${["high", "normal", "low"].map((pr) => b2`
              <label class="object-row">
                <input type="checkbox"
                  .checked=${selectedPriorities.has(pr)}
                  @change=${(e7) => this._togglePriority(pr, e7.target.checked)} />
                <span>${t3(`priority_${pr}`, L2)}</span>
              </label>
            `)}
          </div>
          <div class="field-help">${t3("card_filter_priority_help", L2)}</div>
        </div>

        <!-- Entity-id filter (HA-native pattern). Limited to our integration's
             sensor + binary_sensor entities via includeEntities so the picker
             stays usable on installs with thousands of entities. -->
        <div class="field">
          <div class="field-label">${t3("card_filter_entities", L2)}</div>
          <ha-entities-picker
            .hass=${this.hass}
            .value=${this._config.entity_ids || []}
            .includeDomains=${["sensor", "binary_sensor"]}
            .includeEntities=${ourEntities}
            @value-changed=${this._onEntitiesChanged}
          ></ha-entities-picker>
          <div class="field-help">${t3("card_filter_entities_help", L2)}</div>
        </div>

        <!-- Saved-view scope (v2.26): applies the view's status/user/label
             filters on top of everything above. Hidden while no views exist —
             views are created in the panel toolbar, not here. -->
        ${this._views.length > 0 ? b2`
              <div class="field">
                <div class="field-label">${t3("card_saved_view", L2)}</div>
                <select
                  class="view-select"
                  .value=${this._config.view_id || ""}
                  @change=${(e7) => this._valueChanged("view_id", e7.target.value)}
                >
                  <option value="" ?selected=${!this._config.view_id}>
                    ${t3("card_saved_view_none", L2)}
                  </option>
                  ${this._views.map(
      (v2) => b2`<option value=${v2.id} ?selected=${this._config.view_id === v2.id}>
                      ${v2.name}
                    </option>`
    )}
                </select>
                <div class="field-help">${t3("card_saved_view_help", L2)}</div>
              </div>
            ` : A}

        <ha-formfield label="${t3("card_show_header", L2)}">
          <ha-switch
            .checked=${this._config.show_header !== false}
            @change=${(e7) => this._valueChanged("show_header", e7.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${t3("card_show_actions", L2)}">
          <ha-switch
            .checked=${this._config.show_actions !== false}
            @change=${(e7) => this._valueChanged("show_actions", e7.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${t3("responsible_user", L2)}">
          <ha-switch
            .checked=${this._config.show_assignee !== false}
            @change=${(e7) => this._valueChanged("show_assignee", e7.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${t3("documents", L2)}">
          <ha-switch
            .checked=${this._config.show_documents !== false}
            @change=${(e7) => this._valueChanged("show_documents", e7.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-formfield label="${t3("card_compact", L2)}">
          <ha-switch
            .checked=${this._config.compact || false}
            @change=${(e7) => this._valueChanged("compact", e7.target.checked)}
          ></ha-switch>
        </ha-formfield>

        <ha-textfield
          label="${t3("card_max_items", L2)}"
          type="number"
          .value=${String(this._config.max_items || 0)}
          @input=${(e7) => this._valueChanged("max_items", parseInt(e7.target.value, 10) || 0)}
        ></ha-textfield>
        ${A}
      </div>
    `;
  }
};
MaintenanceSupporterCardEditor.styles = i`
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
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceSupporterCardEditor.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCardEditor.prototype, "_config", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCardEditor.prototype, "_objects", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCardEditor.prototype, "_loadingObjects", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCardEditor.prototype, "_loadError", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCardEditor.prototype, "_views", 2);
if (!customElements.get("maintenance-supporter-card-editor")) {
  customElements.define(
    "maintenance-supporter-card-editor",
    MaintenanceSupporterCardEditor
  );
}

// maintenance-card.ts
init_complete_dialog();

// components/battery-fleet-card.ts
init_lit();
init_decorators();

// components/battery-fleet-section.ts
init_lit();
init_decorators();
init_styles();

// helpers/storage-keys.ts
var LS_KEYS = {
  overviewTab: "msp-overview-tab",
  collapsedSections: "msp-collapsed-sections",
  chartRange: "msp-chart-range",
  chartHideOutliers: "msp-chart-hide-outliers",
  taskSort: "maintenance_supporter_sort",
  objectSort: "maintenance_supporter_object_sort",
  groupBy: "maintenance_supporter_groupby",
  objectView: "maintenance_supporter_object_view",
  objectsCache: "msp-objects-cache",
  gettingStartedDismissed: "msp-gs-dismissed",
  batteryRosterSort: "ms_bf_roster_sort"
};
function lsGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function lsSet(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
  }
}

// components/battery-fleet-section.ts
init_ws_errors();
var _MaintenanceBatteryFleetSection = class _MaintenanceBatteryFleetSection extends i4 {
  constructor() {
    super(...arguments);
    this.flat = false;
    this._ov = null;
    this._loading = false;
    this._marking = false;
    this._error = "";
    this._history = null;
    this._rosterSort = _MaintenanceBatteryFleetSection._storedSort();
    this._typeFilter = null;
    this._recorded = [];
    this._historyRequested = false;
    this._localeReady = false;
    this._markAll = async () => {
      await this._mark(void 0);
    };
    // Re-runs the idempotent setup, which restores the fleet task's trigger
    // when a user edit wiped it (issue #106) or recreates a deleted task.
    this._repair = async () => {
      if (this._marking) return;
      this._marking = true;
      this._error = "";
      try {
        await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/battery_fleet/setup",
          language: this._lang
        });
        await this._load();
      } catch (e7) {
        this._error = describeWsError(e7, this._lang);
      } finally {
        this._marking = false;
      }
    };
    /** Lazy: the recorder-backed history is fetched once, when the roster is
     *  first expanded — most panel visits never open it. */
    this._loadHistory = async (e7) => {
      if (!e7.target.open || this._historyRequested) return;
      this._historyRequested = true;
      try {
        const res = await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/battery_fleet/overview_history"
        });
        this._history = res.series;
      } catch {
        this._history = null;
      }
    };
  }
  get _lang() {
    return langOf(this.hass);
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.hass) this._load();
  }
  updated(changed) {
    if (changed.has("hass") && this.hass && !this._localeReady) {
      this._localeReady = true;
      ensureLocale(this._lang).then(() => this.requestUpdate());
      if (this._ov === null && !this._loading) this._load();
    }
  }
  async _load() {
    this._loading = true;
    this._error = "";
    try {
      this._ov = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/overview"
      });
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._loading = false;
    }
  }
  async _mark(entityIds) {
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/mark_replaced",
        ...entityIds ? { entity_ids: entityIds } : {}
      });
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._marking = false;
    }
  }
  // Manual exclude/include (#107): a rechargeable device the heuristics
  // missed (or any battery the user never wants tracked) leaves the fleet;
  // the restore list below the section brings it back.
  async _setExcluded(entityId, excluded) {
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/set_excluded",
        entity_id: entityId,
        excluded
      });
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._marking = false;
    }
  }
  // #135: manually ADD a battery the discovery heuristics missed. The
  // include bypasses the name/% heuristic and the self-charging filter
  // server-side; picking an entity acts immediately (no extra button).
  async _addBattery(e7) {
    const entityId = e7.detail?.value;
    if (!entityId || this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/set_included",
        entity_id: entityId,
        included: true
      });
      await this._load();
    } catch (e22) {
      this._error = describeWsError(e22, this._lang);
    } finally {
      this._marking = false;
    }
  }
  // #135 follow-up: fleet-wide opt-in that keeps self-charging devices
  // (phones, vacuums, smart rings) in the roster as rechargeables.
  async _setTrackSelf(e7) {
    const enabled = e7.target.checked;
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/battery_fleet/set_track_self_charging",
        enabled
      });
      await this._load();
    } catch (e22) {
      this._error = describeWsError(e22, this._lang);
    } finally {
      this._marking = false;
    }
  }
  /** Inline-SVG sparkline: 30 d level line, a faint threshold line, and —
   *  where the ~date comes from the discharge trend — a dotted projection
   *  from the last reading down to the threshold, so the date is visible
   *  instead of merely stated. */
  _sparkline(b3) {
    const h3 = this._history?.[b3.entity_id];
    if (!h3 || h3.points.length < 2) return A;
    const W = 110, H3 = 24, P2 = 2;
    const t0 = h3.points[0][0];
    const tLast = h3.points[h3.points.length - 1][0];
    const nowSec = Date.now() / 1e3;
    const projEnd = b3.status !== "low" && b3.predicted_source === "trend" && b3.days_until != null ? nowSec + b3.days_until * 86400 : null;
    const tMax = Math.max(tLast, projEnd ?? tLast);
    const x2 = (t5) => tMax === t0 ? P2 : P2 + (t5 - t0) / (tMax - t0) * (W - 2 * P2);
    const y3 = (v2) => P2 + (1 - Math.min(100, Math.max(0, v2)) / 100) * (H3 - 2 * P2);
    const line = h3.points.map(([t5, v2]) => `${x2(t5).toFixed(1)},${y3(v2).toFixed(1)}`).join(" ");
    const vLast = h3.points[h3.points.length - 1][1];
    const yTh = y3(h3.threshold).toFixed(1);
    return b2`<svg
      class="bf-spark"
      viewBox="0 0 ${W} ${H3}"
      role="img"
      aria-label=${t3("battery_fleet_sparkline_hint", this._lang)}
    >
      <title>${t3("battery_fleet_sparkline_hint", this._lang)}</title>
      <line class="bf-spark-th" x1="0" y1=${yTh} x2=${W} y2=${yTh}></line>
      <polyline class="bf-spark-line" points=${line}></polyline>
      ${projEnd !== null ? b2`<line
            class="bf-spark-proj"
            x1=${x2(tLast).toFixed(1)}
            y1=${y3(vLast).toFixed(1)}
            x2=${x2(projEnd).toFixed(1)}
            y2=${yTh}
          ></line>` : A}
    </svg>`;
  }
  static _storedSort() {
    return lsGet(LS_KEYS.batteryRosterSort) === "name" ? "name" : "urgency";
  }
  _setSort(mode) {
    this._rosterSort = mode;
    lsSet(LS_KEYS.batteryRosterSort, mode);
  }
  /** Urgency (the default, issue #123): low rows first — emptiest first —
   *  then the soonest forecast, dateless rows last. Name mode keeps the
   *  alphabetical lookup list. */
  _sortedRoster(rows) {
    const filtered = this._typeFilter === null ? rows : rows.filter((r6) => r6.battery_type === this._typeFilter);
    if (this._rosterSort === "name") return filtered;
    const rank = (r6) => r6.status === "low" ? -1e3 + (r6.level ?? 101) / 101 : r6.days_until ?? Infinity;
    return [...filtered].sort(
      (a3, b3) => rank(a3) - rank(b3) || a3.device_name.localeCompare(b3.device_name)
    );
  }
  /** The forecast as a date a person can plan with, not a day count.
   *  `days_until` comes from last-replaced + typical lifetime, so it is an
   *  estimate — the tilde in the template says so. Negative values (past the
   *  typical lifetime but not reported low yet) render as past dates, which
   *  is honest: the battery is living on borrowed time. */
  _predictedDate(daysUntil) {
    return this._fmtDate(Date.now() + daysUntil * 864e5);
  }
  _fmtDate(epochMs) {
    return new Intl.DateTimeFormat(this._lang, { day: "numeric", month: "numeric", year: "numeric" }).format(new Date(epochMs));
  }
  /** The grouped shopping quantities as CLICKABLE chips: a type filters the
   *  roster to the devices that need it — "which devices need those 4× AAA?"
   *  without scanning. Clicking the active chip clears the filter. */
  _shoppingLine(needs) {
    return Object.entries(needs).map(
      ([type, qty]) => b2`<button
        class="bf-type-chip ${this._typeFilter === type ? "bf-type-chip-active" : ""}"
        title=${t3("battery_fleet_filter_type", this._lang)}
        @click=${() => this._toggleTypeFilter(type)}
      >
        ${qty}× ${type}
      </button>`
    );
  }
  _toggleTypeFilter(type) {
    this._typeFilter = this._typeFilter === type ? null : type;
    if (this._typeFilter !== null) {
      const details = this.shadowRoot?.querySelector("details.bf-roster");
      if (details && !details.open) details.open = true;
    }
  }
  /** One-click fix for a detected-but-unrecorded swap: record the DETECTED
   *  jump time in Battery Notes, so the forecast re-anchors on the real
   *  replacement instead of the dead battery's date. */
  async _recordJump(entityId, jump) {
    if (this._marking) return;
    this._marking = true;
    this._error = "";
    try {
      await this.hass.callService("battery_notes", "set_battery_replaced", {
        device_id: jump.device_id,
        datetime_replaced: new Date(jump.at * 1e3).toISOString()
      });
      this._recorded = [...this._recorded, entityId];
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._marking = false;
    }
  }
  /** Purely visual level bar next to the number — scannable at a glance.
   *  Colored against the battery's OWN low threshold: red at/below it,
   *  amber inside a 20-point approach band, green above. */
  _levelBar(b3) {
    const level = b3.level;
    if (level == null) return A;
    const t5 = b3.low_threshold ?? 20;
    const cls = level <= t5 ? "bad" : level <= t5 + 20 ? "warn" : "good";
    return b2`<span class="bf-bar" aria-hidden="true"
      ><span class="bf-bar-fill bf-bar-${cls}" style="width: ${Math.min(100, Math.max(0, level))}%"></span
    ></span>`;
  }
  render() {
    const L2 = this._lang;
    if (this._loading && this._ov === null) return b2`<div class="bf-card"><div class="bf-loading">…</div></div>`;
    const ov = this._ov;
    if (!ov) {
      return this._error ? b2`<div class="bf-card"><div class="bf-error">${this._error}</div></div>` : A;
    }
    const lowCount = ov.low.length;
    return b2`
      <div class="bf-card">
        <div class="bf-head">
          <ha-icon icon="mdi:battery-alert"></ha-icon>
          <span class="bf-title">${t3("battery_fleet_title", L2)}</span>
          <span class="bf-count ${lowCount ? "bad" : "ok"}">${lowCount}</span>
        </div>
        ${this._error ? b2`<div class="bf-error">${this._error}</div>` : A}

        ${ov.configured && ov.task_ok === false ? b2`
              <div class="bf-repair">
                <span>${t3("battery_fleet_trigger_lost", L2)}</span>
                <ha-button .disabled=${this._marking} @click=${this._repair}>
                  ${t3("battery_fleet_repair", L2)}
                </ha-button>
              </div>
            ` : A}

        ${lowCount === 0 ? b2`<div class="bf-empty">${t3("battery_fleet_none_low", L2)}</div>` : b2`
              <div class="bf-shopping">
                <span class="bf-label">${t3("battery_fleet_buy_now", L2)}</span>
                <span class="bf-list">${this._shoppingLine(ov.needs_now)}</span>
              </div>
              <div class="bf-rows">
                ${ov.low.map(
      (b3) => b2`
                    <div class="bf-row">
                      <span class="bf-dev">${b3.device_name}</span>
                      ${b3.available === false ? b2`<span class="bf-offline">${t3("battery_fleet_offline", L2)}</span>` : A}
                      <span class="bf-type">${b3.quantity}× ${b3.battery_type}</span>
                      ${b3.rechargeable ? b2`<span class="bf-recharge" title=${t3("battery_fleet_rechargeable", L2)}
                            ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
                          ></span>` : A}
                      ${this._levelBar(b3)}
                      ${b3.level != null ? b2`<span class="bf-level">${b3.level}%</span>` : A}
                      <button
                        class="bf-mark"
                        title=${b3.rechargeable ? t3("battery_fleet_mark_recharged", L2) : t3("battery_fleet_mark_one", L2)}
                        .disabled=${this._marking}
                        @click=${() => this._mark([b3.entity_id])}
                      >
                        <ha-icon icon="mdi:battery-sync"></ha-icon>
                      </button>
                      <button
                        class="bf-mark bf-exclude"
                        title=${t3("battery_fleet_exclude", L2)}
                        .disabled=${this._marking}
                        @click=${() => this._setExcluded(b3.entity_id, true)}
                      >
                        <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                      </button>
                    </div>
                  `
    )}
              </div>
              <div class="bf-actions">
                <ha-button .disabled=${this._marking} @click=${this._markAll}>
                  <ha-icon icon="mdi:battery-sync"></ha-icon> ${t3("battery_fleet_mark_all", L2)}
                </ha-button>
              </div>
            `}

        ${ov.soon.length ? b2`
              <div class="bf-soon">
                <span class="bf-label">${t3("battery_fleet_soon", L2)}</span>
                <span class="bf-list">${this._shoppingLine(ov.needs_soon)}</span>
                <div class="bf-soon-hint">${t3("battery_fleet_soon_hint", L2)}</div>
              </div>
            ` : A}
        ${ov.all?.length ? b2`
              <details class="bf-roster" @toggle=${this._loadHistory}>
                <summary>${t3("battery_fleet_all", L2)} (${ov.all.length})</summary>
                <div class="bf-roster-tools">
                  <button
                    class="bf-sort ${this._rosterSort === "urgency" ? "bf-sort-active" : ""}"
                    @click=${() => this._setSort("urgency")}
                  >
                    ${t3("battery_fleet_sort_urgency", L2)}
                  </button>
                  <button
                    class="bf-sort ${this._rosterSort === "name" ? "bf-sort-active" : ""}"
                    @click=${() => this._setSort("name")}
                  >
                    ${t3("battery_fleet_sort_name", L2)}
                  </button>
                </div>
                <div class="bf-rows">
                  ${this._sortedRoster(ov.all).map(
      (b3) => b2`
                      <div class="bf-row">
                        <span class="bf-dev">${b3.device_name}</span>
                        <span class="bf-status bf-${b3.status}">${t3("battery_fleet_status_" + b3.status, L2)}</span>
                        <span class="bf-type">${b3.quantity}× ${b3.battery_type}</span>
                        ${b3.rechargeable ? b2`<span class="bf-recharge" title=${t3("battery_fleet_rechargeable", L2)}
                              ><ha-icon icon="mdi:battery-charging-outline"></ha-icon
                            ></span>` : A}
                        ${this._sparkline(b3)}
                        ${this._levelBar(b3)}
                        ${b3.level != null ? b2`<span class="bf-level">${b3.level}%</span>` : A}
                        ${(() => {
        const jump = this._history?.[b3.entity_id]?.jump;
        if (!jump || this._recorded.includes(b3.entity_id)) return A;
        return b2`<button
                            class="bf-mark bf-jump"
                            title=${t3("battery_fleet_record_replacement", L2).replace("{date}", this._fmtDate(jump.at * 1e3))}
                            .disabled=${this._marking}
                            @click=${() => this._recordJump(b3.entity_id, jump)}
                          >
                            <ha-icon icon="mdi:calendar-sync"></ha-icon>
                          </button>`;
      })()}
                        ${b3.days_until != null ? b2`<span
                              class="bf-predicted ${b3.predicted_source === "trend" ? "bf-trend" : ""} ${b3.forecast_overdue ? "bf-overdue" : ""}"
                              title=${b3.forecast_overdue ? t3("battery_fleet_forecast_overdue", L2) : b3.predicted_source === "trend" ? t3("battery_fleet_predicted_trend", L2).replace("{date}", this._predictedDate(b3.days_until)).replace("{confidence}", t3("cal_confidence_" + (b3.prediction_confidence || "medium"), L2)) : t3("battery_fleet_predicted_on", L2).replace("{date}", this._predictedDate(b3.days_until))}
                              >${b3.forecast_overdue ? b2`<ha-icon icon="mdi:calendar-alert"></ha-icon>` : A}~${this._predictedDate(b3.days_until)}</span
                            >` : A}
                        <button
                          class="bf-mark bf-exclude"
                          title=${t3("battery_fleet_exclude", L2)}
                          .disabled=${this._marking}
                          @click=${() => this._setExcluded(b3.entity_id, true)}
                        >
                          <ha-icon icon="mdi:eye-off-outline"></ha-icon>
                        </button>
                      </div>
                    `
    )}
                </div>
                <div class="bf-roster-hint">${t3("battery_fleet_all_hint", L2)}</div>
                <div class="bf-add">
                  <span class="bf-label">${t3("battery_fleet_add", L2)}</span>
                  <ha-selector
                    .hass=${this.hass}
                    .selector=${{ entity: { domain: ["sensor", "binary_sensor"] } }}
                    .value=${""}
                    @value-changed=${this._addBattery}
                  ></ha-selector>
                  <div class="bf-roster-hint">${t3("battery_fleet_add_hint", L2)}</div>
                </div>
                <label class="bf-track-self">
                  <input
                    type="checkbox"
                    .checked=${!!ov.track_self_charging}
                    .disabled=${this._marking}
                    @change=${this._setTrackSelf}
                  />
                  ${t3("battery_fleet_track_self", L2)}
                </label>
                <div class="bf-roster-hint">${t3("battery_fleet_track_self_hint", L2)}</div>
              </details>
            ` : A}
        ${ov.excluded?.length ? b2`
              <div class="bf-excluded">
                <span class="bf-label">${t3("battery_fleet_excluded", L2)}</span>
                ${ov.excluded.map(
      (x2) => b2`
                    <span class="bf-excluded-chip">
                      ${x2.device_name}
                      <button
                        class="bf-mark"
                        title=${t3("battery_fleet_include", L2)}
                        .disabled=${this._marking}
                        @click=${() => this._setExcluded(x2.entity_id, false)}
                      >
                        <ha-icon icon="mdi:eye-outline"></ha-icon>
                      </button>
                    </span>
                  `
    )}
              </div>
            ` : A}
        <div class="bf-total">${t3("battery_fleet_total", L2).replace("{n}", String(ov.total))}</div>
      </div>
    `;
  }
};
_MaintenanceBatteryFleetSection.styles = i`
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
  `;
__decorateClass([
  n4({ attribute: false })
], _MaintenanceBatteryFleetSection.prototype, "hass", 2);
__decorateClass([
  n4({ type: Boolean })
], _MaintenanceBatteryFleetSection.prototype, "flat", 2);
__decorateClass([
  r5()
], _MaintenanceBatteryFleetSection.prototype, "_ov", 2);
__decorateClass([
  r5()
], _MaintenanceBatteryFleetSection.prototype, "_loading", 2);
__decorateClass([
  r5()
], _MaintenanceBatteryFleetSection.prototype, "_marking", 2);
__decorateClass([
  r5()
], _MaintenanceBatteryFleetSection.prototype, "_error", 2);
__decorateClass([
  r5()
], _MaintenanceBatteryFleetSection.prototype, "_history", 2);
__decorateClass([
  r5()
], _MaintenanceBatteryFleetSection.prototype, "_rosterSort", 2);
__decorateClass([
  r5()
], _MaintenanceBatteryFleetSection.prototype, "_typeFilter", 2);
__decorateClass([
  r5()
], _MaintenanceBatteryFleetSection.prototype, "_recorded", 2);
var MaintenanceBatteryFleetSection = _MaintenanceBatteryFleetSection;
if (!customElements.get("maintenance-battery-fleet-section")) {
  customElements.define("maintenance-battery-fleet-section", MaintenanceBatteryFleetSection);
}

// components/battery-fleet-card.ts
var MaintenanceBatteryFleetCard = class extends i4 {
  constructor() {
    super(...arguments);
    this._config = { type: "custom:maintenance-battery-fleet-card" };
  }
  static getStubConfig() {
    return { type: "custom:maintenance-battery-fleet-card" };
  }
  setConfig(config) {
    this._config = config;
  }
  getCardSize() {
    return 6;
  }
  render() {
    if (!this.hass) return A;
    return b2`
      <ha-card .header=${this._config.title || void 0}>
        <div class="content">
          <maintenance-battery-fleet-section flat .hass=${this.hass}></maintenance-battery-fleet-section>
        </div>
      </ha-card>
    `;
  }
};
MaintenanceBatteryFleetCard.styles = i`
    ha-card {
      overflow: hidden;
    }
    .content {
      padding: 12px 16px 14px;
    }
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceBatteryFleetCard.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceBatteryFleetCard.prototype, "_config", 2);
if (!customElements.get("maintenance-battery-fleet-card")) {
  customElements.define("maintenance-battery-fleet-card", MaintenanceBatteryFleetCard);
}
registerCustomCard({
  type: "maintenance-battery-fleet-card",
  name: "Battery Fleet",
  description: "All tracked batteries: what is low now, what runs out soon, and what to buy.",
  preview: false
});

// maintenance-card.ts
init_dialog_mount();
var MaintenanceSupporterCard = class extends i4 {
  constructor() {
    super(...arguments);
    this._config = { type: "custom:maintenance-supporter-card" };
    this._objects = [];
    this._stats = null;
    this._unsub = null;
    this._viewFilters = null;
    this._userNames = {};
    this._userService = null;
    this._userNamesLoaded = false;
    this._taskDocs = {};
    this._docsLoadedFor = /* @__PURE__ */ new Set();
    this._dataLoaded = false;
    this._lastConnection = null;
    this._onCompleted = async () => {
      await this._loadData();
    };
  }
  get _lang() {
    return langOf(this.hass);
  }
  static getConfigElement() {
    return document.createElement("maintenance-supporter-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:maintenance-supporter-card",
      show_header: true,
      show_actions: true,
      filter_status: ["overdue", "triggered", "due_soon"],
      max_items: 10
    };
  }
  setConfig(config) {
    const viewChanged = config.view_id !== this._config.view_id;
    this._config = config;
    if (viewChanged && this._dataLoaded && this.hass) {
      this._loadViewFilters();
    }
  }
  getCardSize() {
    return 3;
  }
  connectedCallback() {
    super.connectedCallback();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsub) {
      this._unsub();
      this._unsub = null;
    }
    this._dataLoaded = false;
    this._lastConnection = null;
  }
  updated(changedProps) {
    super.updated(changedProps);
    syncLocaleFromHass(this, changedProps);
    if (this.hass && !this._userNamesLoaded && this._config.show_assignee !== false && this._objects.some((o7) => o7.tasks.some((tk) => tk.responsible_user_id))) {
      this._loadUserNames();
    }
    if (this.hass && this._config.show_documents !== false) {
      for (const obj of this._objects) {
        if (this._docsLoadedFor.has(obj.entry_id)) continue;
        if (!obj.tasks.some((tk) => (tk.document_count ?? 0) > 0)) continue;
        this._loadDocuments(obj.entry_id);
      }
    }
    if (changedProps.has("hass") && this.hass) {
      if (!this._dataLoaded) {
        this._dataLoaded = true;
        this._lastConnection = this.hass.connection;
        this._loadData();
        this._subscribe();
      } else if (this.hass.connection !== this._lastConnection) {
        this._lastConnection = this.hass.connection;
        if (this._unsub) {
          try {
            this._unsub();
          } catch {
          }
          this._unsub = null;
        }
        this._subscribe();
        this._loadData();
      }
    }
  }
  async _loadData() {
    try {
      const [objResult, statsResult] = await Promise.all([
        this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects", compact: true }),
        this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/statistics" })
      ]);
      this._objects = hydrateObjects(objResult.objects);
      this._stats = statsResult;
    } catch {
    }
    await this._loadViewFilters();
  }
  /** Display name of the task's responsible user, or "" when the badge must
   *  stay hidden (feature off, nobody assigned, or the name not resolved).
   *  With a rotation this is whoever is up next — the pointer the engine
   *  advances on every completion. */
  _assigneeName(task) {
    if (this._config.show_assignee === false) return "";
    const id = task.responsible_user_id;
    if (!id) return "";
    return this._userNames[id] || "";
  }
  /** Resolve display names for the assignee badge (best-effort).
   *
   *  `users/list` is a READ-tier command, so the household members this card
   *  is built for can call it without admin rights. A failure (or a task
   *  whose user was deleted) leaves the name unresolved and the badge simply
   *  does not render — never a raw user id. */
  async _loadUserNames() {
    this._userNamesLoaded = true;
    if (!this._userService) this._userService = new UserService(this.hass);
    else this._userService.updateHass(this.hass);
    try {
      const users = await this._userService.getUsers();
      this._userNames = Object.fromEntries(users.map((u3) => [u3.id, u3.name]));
    } catch {
    }
  }
  /** Fetch one object's documents and index them by task.
   *
   *  `documents/list` is READ tier, like `users/list` — the household members
   *  this card is for may call it. A failure leaves the row without chips
   *  rather than breaking the card. */
  async _loadDocuments(entryId) {
    this._docsLoadedFor.add(entryId);
    try {
      const res = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/list",
        entry_id: entryId
      });
      const byTask = {};
      for (const doc of res.documents || []) {
        for (const taskId of doc.task_ids || []) {
          (byTask[taskId] ||= []).push({ id: doc.id, title: doc.title, kind: doc.kind, url: doc.url });
        }
      }
      this._taskDocs = { ...this._taskDocs, [entryId]: byTask };
    } catch {
    }
  }
  /** Chips to render on a row: linked documents plus the task's own manual
   *  link, which is the same "the manual is one tap away" affordance. */
  _docsFor(entryId, task) {
    if (this._config.show_documents === false) return [];
    const linked = this._taskDocs[entryId]?.[task.id] || [];
    const out = [...linked];
    if (task.documentation_url) {
      out.push({ id: `url:${task.id}`, title: t3("documentation_label", this._lang), kind: "weblink", url: task.documentation_url });
    }
    return out;
  }
  /** Open a chip: a web link directly, a stored file through a signed path
   *  (the same route the panel uses, so it works in the Companion app). */
  async _openDoc(doc) {
    if (doc.kind === "weblink" && doc.url) {
      if (isSafeHttpUrl(doc.url)) window.open(doc.url, "_blank", "noopener");
      return;
    }
    try {
      await openSignedDocument(this.hass, doc.id);
    } catch {
    }
  }
  /** Resolve the configured saved view's filters (best-effort). A missing or
   *  deleted view degrades to "no view filter" — same fallback semantics as
   *  the backend's notification routing, never an inexplicably empty card. */
  async _loadViewFilters() {
    if (!this._config.view_id) {
      this._viewFilters = null;
      return;
    }
    try {
      const res = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/views/list"
      });
      const view = (res.views || []).find((v2) => v2.id === this._config.view_id);
      this._viewFilters = view ? view.filters : null;
    } catch {
      this._viewFilters = null;
    }
  }
  async _subscribe() {
    try {
      const unsub = await this.hass.connection.subscribeMessage(
        (msg) => {
          const next = applySubscriptionEvent(
            this._objects,
            msg
          );
          if (next !== null) this._objects = next;
        },
        // deltas: only changed entries arrive — see helpers/subscription-merge.
        // compact: empty keys stripped server-side, hydrated above.
        { type: "maintenance_supporter/subscribe", deltas: true, compact: true }
      );
      if (!this.isConnected) {
        unsub();
        return;
      }
      this._unsub = unsub;
    } catch {
    }
  }
  get _flatTasks() {
    const tasks = [];
    const {
      filter_status,
      filter_objects,
      entity_ids,
      filter_due_min_days,
      filter_due_max_days,
      filter_labels,
      filter_priority,
      filter_areas,
      max_items
    } = this._config;
    const entityFilter = entity_ids?.length ? new Set(entity_ids) : null;
    const hasDueRange = filter_due_min_days !== void 0 || filter_due_max_days !== void 0;
    const vf = this._viewFilters;
    const viewUser = vf?.user_id === "current_user" ? this.hass.user?.id ?? null : vf?.user_id ?? null;
    for (const obj of this._objects) {
      if (filter_objects?.length && !filter_objects.includes(obj.object.name)) continue;
      if (filter_areas?.length) {
        const areaId = obj.object.area_id;
        if (!areaId || !filter_areas.includes(areaId)) continue;
      }
      for (const task of obj.tasks) {
        if (task.is_done) continue;
        if (task.archived || obj.object.archived) continue;
        if (filter_status?.length && !filter_status.includes(task.status)) continue;
        if (filter_labels?.length && !(task.labels || []).some((lb) => filter_labels.includes(lb))) continue;
        if (filter_priority?.length && !filter_priority.includes(task.priority || "normal")) continue;
        if (entityFilter) {
          const matches = task.sensor_entity_id && entityFilter.has(task.sensor_entity_id) || task.binary_sensor_entity_id && entityFilter.has(task.binary_sensor_entity_id);
          if (!matches) continue;
        }
        if (hasDueRange) {
          const days = task.days_until_due;
          if (days === null || days === void 0) continue;
          if (filter_due_min_days !== void 0 && days < filter_due_min_days) continue;
          if (filter_due_max_days !== void 0 && days > filter_due_max_days) continue;
        }
        if (vf) {
          if (vf.status && task.status !== vf.status) continue;
          if (vf.label && !(task.labels || []).includes(vf.label)) continue;
          if (vf.priority && (task.priority || "normal") !== vf.priority) continue;
          if (viewUser && task.responsible_user_id !== viewUser) continue;
        }
        tasks.push({ entry_id: obj.entry_id, object_name: obj.object.name, task });
      }
    }
    const order = { overdue: 0, triggered: 1, due_soon: 2, ok: 3 };
    tasks.sort((a3, b3) => {
      const byStatus = (order[a3.task.status] ?? 9) - (order[b3.task.status] ?? 9);
      if (byStatus !== 0) return byStatus;
      return (a3.task.days_until_due ?? Infinity) - (b3.task.days_until_due ?? Infinity);
    });
    if (max_items && max_items > 0) {
      return tasks.slice(0, max_items);
    }
    return tasks;
  }
  /** Open the per-task quick-actions dialog (Complete / Skip / Reset / Edit /
   *  QR / Delete) — full per-task panel parity. Mounted on document.body via
   *  the shared dialog-mount helper, so the card works on any dashboard
   *  without depending on the strategy bundle's ll-custom handler. */
  _openTaskDetail(entryId, taskId) {
    openTaskQuickActions(entryId, taskId);
  }
  render() {
    const L2 = this._lang;
    const title = this._config.title || t3("maintenance", L2);
    const showHeader = this._config.show_header !== false;
    const showActions = this._config.show_actions !== false;
    const compact = this._config.compact || false;
    const tasks = this._flatTasks;
    const s4 = this._stats;
    return b2`
      <ha-card>
        <div class="card-header">
          <h1>${title}</h1>
          <div class="header-right">
            ${showHeader && s4 ? b2`
                  <div class="header-stats">
                    ${s4.overdue > 0 ? b2`<span class="badge overdue">${s4.overdue}</span>` : A}
                    ${s4.due_soon > 0 ? b2`<span class="badge due_soon">${s4.due_soon}</span>` : A}
                    ${s4.triggered > 0 ? b2`<span class="badge triggered">${s4.triggered}</span>` : A}
                  </div>
                ` : A}
            ${showActions ? b2`
                  <mwc-icon-button
                    class="hdr-add"
                    title="${t3("new_object", L2)}"
                    @click=${() => openCreateObjectDialog()}
                  >
                    <ha-icon icon="mdi:plus-box"></ha-icon>
                  </mwc-icon-button>
                  <mwc-icon-button
                    class="hdr-add"
                    title="${t3("add_task", L2)}"
                    @click=${() => openCreateTaskDialog("", this._objects)}
                  >
                    <ha-icon icon="mdi:playlist-plus"></ha-icon>
                  </mwc-icon-button>
                ` : A}
          </div>
        </div>
        ${tasks.length === 0 ? this._objects.some((o7) => o7.tasks.length > 0) ? b2`<div class="empty-card">
                <!-- (#86) tasks exist but none match the filter (default:
                     actionable-only) — "all caught up", NOT "no tasks yet". -->
                <div class="all-caught-up">✓ ${t3("card_all_caught_up", L2)}</div>
              </div>` : b2`<div class="empty-card">
                <div>${t3("card_no_tasks_title", L2)}</div>
                <a class="empty-link" href="/maintenance-supporter">${t3("card_no_tasks_cta", L2)}</a>
              </div>` : b2`
              <div class="task-list ${compact ? "compact" : ""}">
                ${tasks.map(
      ({ entry_id, object_name, task }) => b2`
                    <div class="task-item clickable"
                         @click=${() => this._openTaskDetail(entry_id, task.id)}
                         title="${t3("open_task", L2) || "Open task"}">
                      <div class="status-dot" style="background: ${STATUS_COLORS[task.status] || "#ccc"}"></div>
                      <div class="task-info">
                        <div class="task-name">
                          ${task.name}
                          ${task.due_override ? b2`<ha-icon
                                class="postponed-icon"
                                icon="mdi:calendar-clock"
                                title="${t3("postponed", L2) || "Postponed"}"
                              ></ha-icon>` : A}
                        </div>
                        ${!compact ? b2`<div class="task-meta">
                              ${object_name} · ${t3(task.type, L2)}${this._assigneeName(task) ? b2` · <span class="assignee"
                                    ><ha-icon icon="mdi:account"></ha-icon>${this._assigneeName(task)}</span
                                  >` : A}
                            </div>` : this._assigneeName(task) ? b2`<div class="task-meta compact-assignee" title="${this._assigneeName(task)}">
                                <ha-icon icon="mdi:account"></ha-icon>${this._assigneeName(task)}
                              </div>` : A}
                      </div>
                      ${this._docsFor(entry_id, task).length ? b2`<div class="doc-chips">
                            ${this._docsFor(entry_id, task).map((doc) => b2`
                              <button
                                type="button"
                                class="doc-chip"
                                title="${doc.title}"
                                @click=${(e7) => {
        e7.stopPropagation();
        void this._openDoc(doc);
      }}
                              >
                                <ha-icon icon=${doc.kind === "weblink" ? "mdi:link-variant" : "mdi:file-document-outline"}></ha-icon>
                                <span>${doc.title}</span>
                              </button>
                            `)}
                          </div>` : A}
                      <div class="task-due">
                        ${task.days_until_due !== null && task.days_until_due !== void 0 ? task.days_until_due < 0 ? b2`<span class="overdue-text">${formatDueDays(task.days_until_due, L2)}</span>` : formatDueDays(task.days_until_due, L2) : task.trigger_active ? "\u26A1" : "\u2014"}
                      </div>
                      ${showActions ? b2`
                            <mwc-icon-button
                              class="complete-btn"
                              title="${t3("complete", L2)}"
                              @click=${(e7) => {
        e7.stopPropagation();
        const dlg = this.shadowRoot.querySelector("maintenance-complete-dialog");
        dlg.entryId = entry_id;
        dlg.taskId = task.id;
        dlg.taskName = task.name;
        dlg.checklist = task.checklist || [];
        dlg.adaptiveEnabled = !!task.adaptive_config?.enabled;
        dlg.taskType = task.type || "";
        dlg.readingUnit = task.reading_unit || "";
        dlg.requiredFields = task.required_completion_fields || [];
        dlg.lang = L2;
        const isBuy = !!task.part_ref;
        dlg.parts = isBuy ? [] : partsForCompletion(task, entry_id, this._objects, L2);
        dlg.consumesParts = isBuy ? [] : task.consumes_parts || [];
        dlg.open();
      }}
                            >
                              <ha-icon icon="mdi:check"></ha-icon>
                            </mwc-icon-button>
                          ` : A}
                    </div>
                  `
    )}
              </div>
            `}
      </ha-card>
      <maintenance-complete-dialog
        .hass=${this.hass}
        @task-completed=${this._onCompleted}
      ></maintenance-complete-dialog>
    `;
  }
};
MaintenanceSupporterCard.styles = [
  sharedStyles,
  i`
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
    `
];
__decorateClass([
  n4({ attribute: false })
], MaintenanceSupporterCard.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCard.prototype, "_config", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCard.prototype, "_objects", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCard.prototype, "_stats", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCard.prototype, "_unsub", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCard.prototype, "_viewFilters", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCard.prototype, "_userNames", 2);
__decorateClass([
  r5()
], MaintenanceSupporterCard.prototype, "_taskDocs", 2);
if (!customElements.get("maintenance-supporter-card")) {
  customElements.define("maintenance-supporter-card", MaintenanceSupporterCard);
}
registerCustomCard({
  type: "maintenance-supporter-card",
  name: "Maintenance Supporter",
  description: "Overview of your maintenance tasks with quick actions.",
  preview: true
});

// maintenance-calendar-card.ts
init_lit();
init_decorators();
init_calendar_bucket();

// calendar-styles.ts
init_lit();
var calendarStyles = i`
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
  /* Dark text — white on green is only 2.8:1 (below the 3:1 UI floor). */
  .cal-status-ok        { background: var(--success-color, #4caf50); color: #000; }

  @media (max-width: 600px) {
    .cal-controls { padding: 10px 12px; }
    .cal-rolling { padding: 6px 12px 24px; }
    .cal-day-pill { width: 48px; height: 48px; }
    .cal-pill-day { font-size: 17px; }
    .cal-user-filter { margin-left: 0; width: 100%; }
  }
`;

// maintenance-calendar-card.ts
init_styles();
init_dialog_mount();
var MaintenanceCalendarCard = class extends i4 {
  constructor() {
    super(...arguments);
    this._config = {
      type: "custom:maintenance-supporter-calendar-card"
    };
    this._objects = [];
    this._stats = null;
    this._windowDays = 30;
    this._pastDays = 0;
    this._userFilter = "";
    this._objectFilter = "";
    // 2+ configured object_filter values — restricts the card to this set.
    this._configuredObjects = [];
    this._unsub = null;
    this._dataLoaded = false;
    this._lastConnection = null;
  }
  static getConfigElement() {
    return document.createElement("maintenance-supporter-calendar-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:maintenance-supporter-calendar-card",
      window_days: 30,
      show_window_chips: true,
      show_user_filter: true
    };
  }
  setConfig(config) {
    this._config = { ...config };
    if (config.past_days && [30, 90].includes(config.past_days)) {
      this._pastDays = config.past_days;
    } else if (config.window_days && [7, 14, 30, 365].includes(config.window_days)) {
      this._windowDays = config.window_days;
      this._pastDays = 0;
    }
    if (typeof config.user_filter === "string") {
      this._userFilter = config.user_filter;
    }
    if (typeof config.object_filter === "string") {
      this._objectFilter = config.object_filter;
      this._configuredObjects = [];
    } else if (Array.isArray(config.object_filter)) {
      const values = config.object_filter.filter((v2) => typeof v2 === "string" && v2 !== "");
      this._objectFilter = values.length === 1 ? values[0] : "";
      this._configuredObjects = values.length > 1 ? values : [];
    }
  }
  getCardSize() {
    return 6;
  }
  get _lang() {
    return langOf(this.hass);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._unsub) {
      try {
        this._unsub();
      } catch {
      }
      this._unsub = null;
    }
    this._dataLoaded = false;
    this._lastConnection = null;
  }
  updated(changedProps) {
    super.updated(changedProps);
    syncLocaleFromHass(this, changedProps);
    if (changedProps.has("hass") && this.hass) {
      if (!this._dataLoaded) {
        this._dataLoaded = true;
        this._lastConnection = this.hass.connection;
        this._loadData();
        this._subscribe();
      } else if (this.hass.connection !== this._lastConnection) {
        this._lastConnection = this.hass.connection;
        if (this._unsub) {
          try {
            this._unsub();
          } catch {
          }
          this._unsub = null;
        }
        this._subscribe();
        this._loadData();
      }
    }
  }
  async _loadData() {
    try {
      const [objResult, statsResult] = await Promise.all([
        this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/objects"
        }),
        this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/statistics"
        })
      ]);
      this._objects = objResult.objects;
      this._stats = statsResult;
    } catch {
    }
  }
  async _subscribe() {
    try {
      const unsub = await this.hass.connection.subscribeMessage(
        (msg) => {
          const data = msg;
          this._objects = data.objects;
        },
        { type: "maintenance_supporter/subscribe" }
      );
      if (!this.isConnected) {
        unsub();
        return;
      }
      this._unsub = unsub;
    } catch {
    }
  }
  _onEventClick(ev) {
    if (ev.history_timestamp) {
      void this._openHistoryEntry(ev);
      return;
    }
    if (openTaskQuickActions(ev.entry_id, ev.task_id)) return;
    this.dispatchEvent(
      new CustomEvent("ll-custom", {
        detail: {
          type: "maintenance-supporter:open-task",
          entry_id: ev.entry_id,
          task_id: ev.task_id
        },
        bubbles: true,
        composed: true
      })
    );
  }
  /** Fetch the recorded entry and open the history-edit dialog directly
   *  (mirrors the strategy shim's ll-custom "edit-history" path). */
  async _openHistoryEntry(ev) {
    try {
      const resp = await this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/object", entry_id: ev.entry_id });
      const entry = resp.tasks?.find((tk) => tk.id === ev.task_id)?.history?.find((h3) => h3.timestamp === ev.history_timestamp);
      if (!entry) return;
      const opened = openHistoryEditDialog({
        entry_id: ev.entry_id,
        task_id: ev.task_id,
        original_timestamp: ev.history_timestamp,
        type: entry.type || "completed",
        timestamp: entry.timestamp || ev.history_timestamp,
        notes: entry.notes ?? null,
        cost: entry.cost ?? null,
        duration: entry.duration ?? null,
        completed_by: entry.completed_by ?? null,
        used_parts: entry.used_parts ?? null
      });
      if (opened) return;
    } catch {
    }
    this.dispatchEvent(
      new CustomEvent("ll-custom", {
        detail: {
          type: "maintenance-supporter:edit-history",
          entry_id: ev.entry_id,
          task_id: ev.task_id,
          original_timestamp: ev.history_timestamp
        },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    if (!this.hass) return A;
    const L2 = this._lang;
    const showChips = this._config.show_window_chips !== false;
    const showUserFilter = this._config.show_user_filter !== false;
    const title = this._config.title;
    let userFilter = null;
    if (this._userFilter) {
      userFilter = this._userFilter === "current_user" ? this.hass?.user?.id ?? null : this._userFilter;
    }
    const resolve = (value) => {
      const needle = value.toLowerCase();
      const match = this._objects.find(
        (o7) => o7.entry_id === value || o7.object.name.toLowerCase() === needle
      );
      return match?.entry_id ?? null;
    };
    const configuredIds = new Set(
      this._configuredObjects.map(resolve).filter((id) => id !== null)
    );
    const base = configuredIds.size ? this._objects.filter((o7) => configuredIds.has(o7.entry_id)) : this._objects;
    const showObjectFilter = this._config.show_object_filter !== false && base.length > 1;
    const filterEntryId = this._objectFilter ? resolve(this._objectFilter) : null;
    const objects = filterEntryId && base.some((o7) => o7.entry_id === filterEntryId) ? base.filter((o7) => o7.entry_id === filterEntryId) : base;
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const isPast = this._pastDays > 0;
    const buckets = isPast ? buildPastBuckets(objects, today, this._pastDays, userFilter) : buildCalendarBuckets(objects, today, this._windowDays, userFilter);
    const todayIso = isoDateLocal(today);
    const hideEmptyDays = this._windowDays === 365 || isPast;
    const visibleBuckets = hideEmptyDays ? buckets.filter((b3) => b3.events.length > 0) : buckets;
    const renderEvent = (ev) => {
      const statusClass = `cal-status-${ev.status}`;
      const projClass = ev.projected ? "cal-event-projected" : "";
      const overdueLabel = ev.status === "overdue" && ev.days_until_due != null ? ` (${formatDueDays(ev.days_until_due, L2)})` : "";
      const recurEvery = ev.projected && ev.interval_days ? b2`<span class="cal-event-recur">${ev.interval_unit && ev.interval_unit !== "days" ? `${ev.interval_days} ${t3("unit_" + ev.interval_unit, L2)}` : t3("cal_every_n_days", L2).replace("{n}", String(ev.interval_days))}</span>` : A;
      const isSensor = ev.schedule_type === "sensor_based";
      const sourceIcon = isSensor ? b2`<ha-icon class="cal-event-icon cal-source-sensor"
                title="${t3("cal_source_sensor", L2)}" icon="mdi:trending-up"></ha-icon>` : b2`<ha-icon class="cal-event-icon cal-source-time"
                title="${ev.adaptive_enabled ? t3("cal_source_time_adaptive", L2) : t3("cal_source_time", L2)}"
                icon="${ev.adaptive_enabled ? "mdi:clock-time-four-outline" : "mdi:clock-outline"}"></ha-icon>`;
      const predictionSubtitle = isSensor && ev.prediction_confidence && ev.status !== "triggered" && !ev.projected ? b2`<span class="cal-event-prediction cal-conf-${ev.prediction_confidence}">
            ${t3("cal_predicted", L2)} · ${t3(`cal_confidence_${ev.prediction_confidence}`, L2)}
          </span>` : A;
      const currencySymbol = this._stats?.budget?.currency_symbol || DEFAULT_CURRENCY_SYMBOL;
      const badgeLabel = ev.history_type ? t3(ev.history_type, L2) : t3(ev.status, L2);
      return b2`
        <div class="cal-event ${projClass}"
          @click=${() => this._onEventClick(ev)}>
          ${sourceIcon}
          <span class="cal-status-pill ${statusClass}">${badgeLabel}</span>
          <div class="cal-event-body">
            <div class="cal-event-title">${ev.object_name} · ${ev.task_name}${overdueLabel}</div>
            ${predictionSubtitle}
            ${recurEvery}
          </div>
          ${ev.avg_cost != null && ev.avg_cost > 0 ? b2`<span class="cal-event-cost">${ev.avg_cost.toFixed(0)} ${currencySymbol}</span>` : A}
        </div>
      `;
    };
    const renderDayRow = (bucket) => {
      const [y3, m2, d3] = bucket.date.split("-").map(Number);
      const date = new Date(y3, m2 - 1, d3);
      const isToday = bucket.date === todayIso;
      const weekday = date.toLocaleDateString(L2, { weekday: "short" });
      const monthLabel = date.toLocaleDateString(L2, { month: "long" });
      return b2`
        <div class="cal-day-row">
          <div class="cal-day-pill ${isToday ? "cal-today" : ""}">
            <span class="cal-pill-weekday">${weekday}</span>
            <span class="cal-pill-day">${date.getDate()}</span>
          </div>
          <div class="cal-day-content">
            <div class="cal-day-header">
              <span class="cal-day-month">${monthLabel}</span>
              ${isToday ? b2`<span class="cal-day-today-badge">${t3("today", L2)}</span>` : A}
            </div>
            ${bucket.events.length === 0 ? b2`<div class="cal-empty">${t3("cal_no_events", L2)}</div>` : bucket.events.map(renderEvent)}
          </div>
        </div>
      `;
    };
    return b2`
      <ha-card .header=${title}>
        ${showChips || showUserFilter ? b2`
              <div class="cal-controls">
                ${showChips ? b2`
                      <div class="cal-window-chips cal-past-chips" title="${t3("cal_past_windows", L2) || "Past windows"}">
                        ${[30, 90].map((p3) => b2`
                          <button class="cal-window-chip cal-past-chip ${this._pastDays === p3 ? "active" : ""}"
                            @click=${() => {
      this._pastDays = p3;
    }}>
                            −${p3}d
                          </button>
                        `)}
                      </div>
                      <span class="cal-chip-separator" aria-hidden="true">●</span>
                      <div class="cal-window-chips" title="${t3("cal_forward_windows", L2) || "Forward windows"}">
                        ${[7, 14, 30, 365].map((w2) => b2`
                          <button class="cal-window-chip ${this._pastDays === 0 && this._windowDays === w2 ? "active" : ""}"
                            @click=${() => {
      this._windowDays = w2;
      this._pastDays = 0;
    }}>
                            ${w2 === 365 ? "+1y" : `+${w2}d`}
                          </button>
                        `)}
                      </div>
                    ` : A}
                ${showUserFilter ? b2`
                      <select class="cal-user-filter"
                        .value=${this._userFilter}
                        @change=${(e7) => {
      this._userFilter = e7.target.value;
    }}>
                        <option value="">${t3("all_users", L2)}</option>
                        <option value="current_user">${t3("my_tasks", L2)}</option>
                      </select>
                    ` : A}
                ${showObjectFilter ? b2`
                      <select class="cal-user-filter"
                        .value=${filterEntryId ?? ""}
                        @change=${(e7) => {
      this._objectFilter = e7.target.value;
    }}>
                        <option value="">${t3("all_objects", L2)}</option>
                        ${[...base].sort((a3, b3) => a3.object.name.localeCompare(b3.object.name)).map(
      (o7) => b2`<option value=${o7.entry_id} ?selected=${o7.entry_id === filterEntryId}>${o7.object.name}</option>`
    )}
                      </select>
                    ` : A}
              </div>
            ` : A}
        <div class="cal-rolling">
          ${visibleBuckets.length === 0 && hideEmptyDays ? b2`<div class="cal-empty">${t3("cal_no_events", L2)}</div>` : visibleBuckets.map(renderDayRow)}
        </div>
      </ha-card>
    `;
  }
};
MaintenanceCalendarCard.styles = [
  sharedStyles,
  calendarStyles,
  i`
      :host { display: block; }
      ha-card { padding: 0; overflow: hidden; }
    `
];
__decorateClass([
  n4({ attribute: false })
], MaintenanceCalendarCard.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceCalendarCard.prototype, "_config", 2);
__decorateClass([
  r5()
], MaintenanceCalendarCard.prototype, "_objects", 2);
__decorateClass([
  r5()
], MaintenanceCalendarCard.prototype, "_stats", 2);
__decorateClass([
  r5()
], MaintenanceCalendarCard.prototype, "_windowDays", 2);
__decorateClass([
  r5()
], MaintenanceCalendarCard.prototype, "_pastDays", 2);
__decorateClass([
  r5()
], MaintenanceCalendarCard.prototype, "_userFilter", 2);
__decorateClass([
  r5()
], MaintenanceCalendarCard.prototype, "_objectFilter", 2);
__decorateClass([
  r5()
], MaintenanceCalendarCard.prototype, "_unsub", 2);
var WINDOW_DAY_KEYS = [
  { value: 7, key: "cal_editor_window_week" },
  { value: 14, key: "cal_editor_window_fortnight" },
  { value: 30, key: "cal_editor_window_month" },
  { value: 365, key: "cal_editor_window_year" }
];
var MaintenanceCalendarCardEditor = class extends i4 {
  constructor() {
    super(...arguments);
    this._config = {
      type: "custom:maintenance-supporter-calendar-card"
    };
  }
  get _lang() {
    return langOf(this.hass);
  }
  setConfig(config) {
    this._config = { ...config };
  }
  /** The editor renders before the locale JSON is fetched — re-render once
   *  it lands so the labels localize (same pattern as the card itself). */
  updated() {
    const lang = this._lang;
    if (lang && !isLocaleLoaded(lang)) void ensureLocale(lang).then(() => this.requestUpdate());
  }
  _valueChanged(key, value) {
    const newConfig = { ...this._config, [key]: value };
    if (key === "show_window_chips" && value === true) {
      delete newConfig.show_window_chips;
    }
    if (key === "show_user_filter" && value === true) {
      delete newConfig.show_user_filter;
    }
    if (key === "show_object_filter" && value === true) {
      delete newConfig.show_object_filter;
    }
    if (key === "title" && (!value || typeof value === "string" && value.trim() === "")) {
      delete newConfig.title;
    }
    if (key === "user_filter" && value === "") {
      delete newConfig.user_filter;
    }
    this._config = newConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true
      })
    );
  }
  render() {
    const L2 = this._lang;
    const currentWindow = this._config.window_days ?? 30;
    const showChips = this._config.show_window_chips !== false;
    const showUserFilter = this._config.show_user_filter !== false;
    const userFilter = this._config.user_filter ?? "";
    const title = this._config.title ?? "";
    return b2`
      <div class="editor">
        <div class="row">
          <label for="title">${t3("card_title", L2)}</label>
          <input
            id="title"
            type="text"
            .value=${title}
            @input=${(e7) => this._valueChanged("title", e7.target.value)}
          />
        </div>
        <div class="row">
          <label for="window">${t3("cal_editor_window", L2)}</label>
          <select
            id="window"
            @change=${(e7) => this._valueChanged(
      "window_days",
      Number(e7.target.value)
    )}
          >
            ${WINDOW_DAY_KEYS.map(
      (o7) => b2`<option value="${o7.value}" ?selected=${o7.value === currentWindow}>${t3(o7.key, L2)}</option>`
    )}
          </select>
        </div>
        <div class="row toggle">
          <label for="chips">${t3("cal_editor_show_chips", L2)}</label>
          <input
            id="chips"
            type="checkbox"
            .checked=${showChips}
            @change=${(e7) => this._valueChanged(
      "show_window_chips",
      e7.target.checked
    )}
          />
        </div>
        <div class="hint">${t3("cal_editor_chips_hint", L2)}</div>
        <div class="row toggle">
          <label for="userf">${t3("cal_editor_show_user_filter", L2)}</label>
          <input
            id="userf"
            type="checkbox"
            .checked=${showUserFilter}
            @change=${(e7) => this._valueChanged(
      "show_user_filter",
      e7.target.checked
    )}
          />
        </div>
        <div class="row">
          <label for="userv">${t3("cal_editor_default_user", L2)}</label>
          <select
            id="userv"
            @change=${(e7) => this._valueChanged(
      "user_filter",
      e7.target.value
    )}
          >
            <option value="" ?selected=${userFilter === ""}>${t3("all_users", L2)}</option>
            <option value="current_user" ?selected=${userFilter === "current_user"}>
              ${t3("cal_editor_my_tasks", L2)}
            </option>
          </select>
        </div>
        <div class="row toggle">
          <label for="objf">${t3("cal_editor_show_object_filter", L2)}</label>
          <input
            id="objf"
            type="checkbox"
            .checked=${this._config.show_object_filter !== false}
            @change=${(e7) => this._valueChanged(
      "show_object_filter",
      e7.target.checked
    )}
          />
        </div>
        <div class="hint">${t3("cal_editor_object_hint", L2)}</div>
      </div>
    `;
  }
};
MaintenanceCalendarCardEditor.styles = i`
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
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceCalendarCardEditor.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceCalendarCardEditor.prototype, "_config", 2);
if (!customElements.get("maintenance-supporter-calendar-card")) {
  customElements.define(
    "maintenance-supporter-calendar-card",
    MaintenanceCalendarCard
  );
}
if (!customElements.get("maintenance-supporter-calendar-card-editor")) {
  customElements.define(
    "maintenance-supporter-calendar-card-editor",
    MaintenanceCalendarCardEditor
  );
}
registerCustomCard({
  type: "maintenance-supporter-calendar-card",
  name: "Maintenance Supporter \u2014 Calendar",
  description: "Rolling calendar of maintenance tasks with 7/14/30/365 day windows, source icons, and prediction-confidence pills.",
  preview: true
});

// components/budget-section-card.ts
init_lit();
init_decorators();
init_styles();
init_ws_errors();

// components/section-card-shared-styles.ts
init_lit();
var sectionCardSharedStyles = i`
  ha-card { overflow: hidden; }
  .card-content {
    padding: 16px;
    display: flex; flex-direction: column;
    gap: 12px;
  }
  .header {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px;
  }
  .title {
    display: flex; align-items: center; gap: 8px;
    font-size: 16px; font-weight: 500;
  }
  .emoji { font-size: 20px; }

  /* Button family — primary action / muted-saved-state / link / icon-with-text */
  .btn {
    padding: 6px 12px; font-size: 13px;
    border-radius: 6px; cursor: pointer;
    border: 1px solid var(--divider-color);
    background: var(--secondary-background-color, transparent);
    color: var(--primary-text-color);
    font-weight: 500;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .btn:hover { background: var(--state-icon-color, rgba(255,255,255,0.06)); }
  .btn[disabled] { opacity: 0.5; cursor: not-allowed; }
  .btn.primary {
    background: var(--primary-color);
    color: var(--text-primary-color, white);
    border-color: var(--primary-color);
  }
  .btn.primary[disabled] { opacity: 0.6; }
  .btn.muted {
    background: transparent;
    color: var(--secondary-text-color);
    border-style: dashed;
  }
  .btn.muted[disabled] { opacity: 1; cursor: default; }
  .btn.muted ha-icon, .btn.primary ha-icon { --mdc-icon-size: 14px; }
  .btn.link {
    background: transparent; border: none; padding: 6px 4px;
    color: var(--primary-color); margin-left: auto;
  }
  .btn.link:hover { background: transparent; text-decoration: underline; }

  /* Error + loading states */
  .error {
    padding: 8px; border-radius: 6px;
    background: rgba(211, 47, 47, 0.1);
    color: var(--error-color, #d32f2f); font-size: 13px;
  }
  .loading {
    padding: 24px; text-align: center;
    color: var(--secondary-text-color);
  }
`;

// components/budget-section-card.ts
var DEFAULT_ALERT_THRESHOLD_PCT = 80;
var MaintenanceBudgetSectionCard = class extends i4 {
  constructor() {
    super(...arguments);
    this._config = { type: "" };
    this._status = null;
    this._busy = false;
    this._error = "";
    this._localMonthly = "";
    this._localYearly = "";
    this._dirty = false;
    this._loaded = false;
  }
  setConfig(config) {
    this._config = config;
  }
  getCardSize() {
    return 2;
  }
  get _lang() {
    return langOf(this.hass);
  }
  get _isAdmin() {
    return this.hass?.user?.is_admin ?? true;
  }
  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass && !this._loaded) {
      this._loaded = true;
      void this._load();
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }
  async _load() {
    try {
      const r6 = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/budget_status"
      });
      this._status = r6;
      this._localMonthly = r6.monthly_budget ? String(r6.monthly_budget) : "";
      this._localYearly = r6.yearly_budget ? String(r6.yearly_budget) : "";
      this._dirty = false;
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    }
  }
  async _save() {
    if (!this._isAdmin) return;
    this._busy = true;
    this._error = "";
    try {
      const m2 = this._localMonthly.trim() === "" ? 0 : parseFloat(this._localMonthly);
      const y3 = this._localYearly.trim() === "" ? 0 : parseFloat(this._localYearly);
      const settings = {};
      if (!isNaN(m2) && m2 >= 0) settings.budget_monthly = m2;
      if (!isNaN(y3) && y3 >= 0) settings.budget_yearly = y3;
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/global/update",
        settings
      });
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  _onDeepLink() {
    const path = "/maintenance-supporter?ms_action=open_budget";
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }
  render() {
    const L2 = this._lang;
    const s4 = this._status;
    if (!s4) {
      return b2`<ha-card><div class="loading">${t3("loading", L2) || "Loading\u2026"}</div></ha-card>`;
    }
    const sym = s4.currency_symbol || DEFAULT_CURRENCY_SYMBOL;
    const threshold = s4.alert_threshold_pct ?? DEFAULT_ALERT_THRESHOLD_PCT;
    const tracks = [
      {
        label: t3("budget_monthly", L2) || "Monthly",
        spent: s4.monthly_spent || 0,
        budget: s4.monthly_budget || 0
      },
      {
        label: t3("budget_yearly", L2) || "Yearly",
        spent: s4.yearly_spent || 0,
        budget: s4.yearly_budget || 0
      }
    ];
    return b2`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">💰</span>
              <span>${this._config.title || t3("settings_budget", L2) || "Budget"}</span>
            </div>
            <span class="currency">${sym}</span>
          </div>

          ${this._error ? b2`<div class="error">${this._error}</div>` : A}

          ${tracks.map((track) => {
      if (!(track.budget > 0)) {
        return b2`
                <div class="track spent-only">
                  <div class="track-label-row">
                    <label>${track.label}</label>
                    <span class="track-numbers ok">${track.spent.toFixed(0)} ${sym}</span>
                  </div>
                </div>
              `;
      }
      const pct = Math.min(100, Math.max(0, track.spent / track.budget * 100));
      const warn = pct >= 100 ? "danger" : pct >= threshold ? "warning" : "ok";
      return b2`
              <div class="track">
                <div class="track-label-row">
                  <label>${track.label}</label>
                  <span class="track-numbers ${warn}">
                    ${track.spent.toFixed(0)} / ${track.budget.toFixed(0)} ${sym}
                  </span>
                </div>
                <div class="bar"><div class="bar-fill ${warn}" style="width:${pct}%"></div></div>
              </div>
            `;
    })}

          ${this._isAdmin ? b2`
                <div class="inputs-row">
                  <div class="input-field">
                    <label>${t3("budget_monthly_set", L2) || "Set monthly"}</label>
                    <div class="input-wrap">
                      <input type="number" min="0" step="1"
                        .value=${this._localMonthly}
                        ?disabled=${this._busy}
                        @input=${(e7) => {
      this._localMonthly = e7.target.value;
      this._dirty = true;
    }} />
                      <span class="input-suffix">${sym}</span>
                    </div>
                  </div>
                  <div class="input-field">
                    <label>${t3("budget_yearly_set", L2) || "Set yearly"}</label>
                    <div class="input-wrap">
                      <input type="number" min="0" step="1"
                        .value=${this._localYearly}
                        ?disabled=${this._busy}
                        @input=${(e7) => {
      this._localYearly = e7.target.value;
      this._dirty = true;
    }} />
                      <span class="input-suffix">${sym}</span>
                    </div>
                  </div>
                </div>
                <div class="actions">
                  <button class="btn ${this._dirty ? "primary" : "muted"}"
                    @click=${this._save}
                    ?disabled=${this._busy || !this._dirty}>
                    <ha-icon icon="${this._dirty ? "mdi:content-save" : "mdi:check"}"></ha-icon>
                    ${this._dirty ? t3("save", L2) || "Save" : t3("saved", L2) || "Saved"}
                  </button>
                  <button class="btn link" @click=${this._onDeepLink}>
                    ${t3("budget_advanced", L2) || "Currency, alerts\u2026"}
                  </button>
                </div>
              ` : b2`
                <button class="btn link" @click=${this._onDeepLink}>
                  ${t3("budget_open_panel", L2) || "Open in panel"}
                </button>
              `}
        </div>
      </ha-card>
    `;
  }
};
MaintenanceBudgetSectionCard.styles = [sectionCardSharedStyles, i`
    .currency {
      font-size: 14px; font-weight: 600;
      color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      padding: 2px 10px; border-radius: 999px;
    }
    .track { display: flex; flex-direction: column; gap: 4px; }
    .track-label-row {
      display: flex; align-items: center; justify-content: space-between;
    }
    .track-label-row label {
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .track-numbers { font-size: 13px; font-weight: 600; }
    .track-numbers.ok { color: var(--primary-text-color); }
    .track-numbers.warning { color: #ff9800; }
    .track-numbers.danger { color: var(--error-color, #f44336); }
    .bar {
      height: 6px; background: var(--secondary-background-color);
      border-radius: 3px; overflow: hidden;
    }
    .bar-fill { height: 100%; transition: width 0.3s; border-radius: 3px; }
    .bar-fill.ok { background: var(--primary-color); }
    .bar-fill.warning { background: #ff9800; }
    .bar-fill.danger { background: var(--error-color, #f44336); }
    .inputs-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px;
      padding-top: 4px; border-top: 1px solid var(--divider-color);
    }
    .input-field { display: flex; flex-direction: column; gap: 4px; }
    .input-field label {
      font-size: 11px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .input-wrap { position: relative; display: flex; align-items: center; }
    .input-wrap input {
      flex: 1; padding: 6px 32px 6px 8px; font-size: 13px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      font-family: inherit;
    }
    .input-suffix {
      position: absolute; right: 8px;
      color: var(--secondary-text-color); font-size: 13px;
      pointer-events: none;
    }
    .actions { display: flex; gap: 8px; align-items: center; }
  `];
__decorateClass([
  n4({ attribute: false })
], MaintenanceBudgetSectionCard.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceBudgetSectionCard.prototype, "_config", 2);
__decorateClass([
  r5()
], MaintenanceBudgetSectionCard.prototype, "_status", 2);
__decorateClass([
  r5()
], MaintenanceBudgetSectionCard.prototype, "_busy", 2);
__decorateClass([
  r5()
], MaintenanceBudgetSectionCard.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenanceBudgetSectionCard.prototype, "_localMonthly", 2);
__decorateClass([
  r5()
], MaintenanceBudgetSectionCard.prototype, "_localYearly", 2);
__decorateClass([
  r5()
], MaintenanceBudgetSectionCard.prototype, "_dirty", 2);
if (!customElements.get("maintenance-budget-section-card")) {
  customElements.define(
    "maintenance-budget-section-card",
    MaintenanceBudgetSectionCard
  );
}
registerCustomCard({
  type: "maintenance-budget-section-card",
  name: "Maintenance Supporter \u2014 Budget",
  description: "Inline monthly + yearly budget editor",
  preview: false
});

// components/groups-section-card.ts
init_lit();
init_decorators();
init_styles();
init_ws_errors();
var MaintenanceGroupsSectionCard = class extends i4 {
  constructor() {
    super(...arguments);
    this._config = { type: "" };
    this._groups = {};
    this._loaded = false;
    this._busy = false;
    this._error = "";
    this._newName = "";
    this._editingId = null;
    this._editingName = "";
    this._hasInitiallyLoaded = false;
  }
  setConfig(config) {
    this._config = config;
  }
  getCardSize() {
    return 2;
  }
  get _lang() {
    return langOf(this.hass);
  }
  get _isAdmin() {
    return this.hass?.user?.is_admin ?? true;
  }
  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass && !this._hasInitiallyLoaded) {
      this._hasInitiallyLoaded = true;
      void this._load();
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }
  async _load() {
    try {
      const r6 = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/groups"
      });
      this._groups = r6.groups || {};
      this._loaded = true;
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    }
  }
  async _addGroup() {
    if (!this._isAdmin) return;
    const name = this._newName.trim();
    if (!name) return;
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/group/create",
        name
      });
      this._newName = "";
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  _startEdit(id) {
    this._editingId = id;
    this._editingName = this._groups[id]?.name || "";
  }
  async _saveEdit() {
    if (!this._isAdmin || !this._editingId) return;
    const name = this._editingName.trim();
    if (!name) return;
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/group/update",
        group_id: this._editingId,
        name
      });
      this._editingId = null;
      this._editingName = "";
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  async _deleteGroup(id, name) {
    if (!this._isAdmin) return;
    const confirmText = (t3("group_delete_confirm", this._lang) || 'Delete group "{name}"?').replace("{name}", name);
    if (!window.confirm(confirmText)) return;
    this._busy = true;
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/group/delete",
        group_id: id
      });
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  _onDeepLink() {
    const path = "/maintenance-supporter?ms_action=open_groups";
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }
  _onKeyDown(e7, action) {
    if (e7.key === "Enter") {
      e7.preventDefault();
      action();
    } else if (e7.key === "Escape") {
      e7.preventDefault();
      this._editingId = null;
      this._editingName = "";
    }
  }
  render() {
    const L2 = this._lang;
    if (!this._loaded) {
      return b2`<ha-card><div class="loading">${t3("loading", L2) || "Loading\u2026"}</div></ha-card>`;
    }
    const ids = Object.keys(this._groups);
    return b2`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏷️</span>
              <span>${this._config.title || (t3("groups", L2) || "Groups")}</span>
              <span class="count">${ids.length}</span>
            </div>
          </div>

          ${this._error ? b2`<div class="error">${this._error}</div>` : A}

          ${ids.length === 0 ? b2`<div class="empty">${t3("groups_empty", L2) || "No groups yet."}</div>` : b2`
                <div class="group-list">
                  ${ids.map((id) => {
      const g2 = this._groups[id];
      const taskCount = g2.task_refs?.length ?? 0;
      const isEditing = this._editingId === id;
      return b2`
                      <div class="group-row">
                        ${isEditing ? b2`
                              <input class="edit-input" type="text"
                                .value=${this._editingName}
                                ?disabled=${this._busy}
                                @input=${(e7) => {
        this._editingName = e7.target.value;
      }}
                                @keydown=${(e7) => this._onKeyDown(e7, this._saveEdit.bind(this))} />
                              <button class="btn small primary"
                                @click=${this._saveEdit}
                                ?disabled=${this._busy || !this._editingName.trim()}>
                                ${t3("save", L2) || "Save"}
                              </button>
                              <button class="btn small"
                                @click=${() => {
        this._editingId = null;
      }}>
                                ${t3("cancel", L2) || "Cancel"}
                              </button>
                            ` : b2`
                              <span class="group-name">${g2.name || "Unnamed"}</span>
                              <span class="task-count">${taskCount}</span>
                              ${this._isAdmin ? b2`
                                    <button class="icon-btn"
                                      title="${t3("edit", L2) || "Edit"}"
                                      @click=${() => this._startEdit(id)}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:pencil"></ha-icon>
                                    </button>
                                    <button class="icon-btn danger"
                                      title="${t3("delete", L2) || "Delete"}"
                                      @click=${() => this._deleteGroup(id, g2.name || "Unnamed")}
                                      ?disabled=${this._busy}>
                                      <ha-icon icon="mdi:delete"></ha-icon>
                                    </button>
                                  ` : A}
                            `}
                      </div>
                    `;
    })}
                </div>
              `}

          ${this._isAdmin ? b2`
                <div class="add-row">
                  <input type="text"
                    placeholder="${t3("group_new_placeholder", L2) || "Add group\u2026"}"
                    .value=${this._newName}
                    ?disabled=${this._busy}
                    @input=${(e7) => {
      this._newName = e7.target.value;
    }}
                    @keydown=${(e7) => this._onKeyDown(e7, this._addGroup.bind(this))} />
                  <button class="btn primary"
                    @click=${this._addGroup}
                    ?disabled=${this._busy || !this._newName.trim()}>
                    <ha-icon icon="mdi:plus"></ha-icon>
                    ${t3("add", L2) || "Add"}
                  </button>
                </div>
                <button class="btn link" @click=${this._onDeepLink}>
                  ${t3("groups_manage_tasks", L2) || "Manage task assignments\u2026"}
                </button>
              ` : b2`
                <button class="btn link" @click=${this._onDeepLink}>
                  ${t3("groups_open_panel", L2) || "Open in panel"}
                </button>
              `}
        </div>
      </ha-card>
    `;
  }
};
MaintenanceGroupsSectionCard.styles = [sectionCardSharedStyles, i`
    .count {
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--secondary-background-color);
      padding: 2px 8px; border-radius: 999px;
    }
    .empty {
      padding: 16px; text-align: center;
      color: var(--secondary-text-color); font-style: italic;
    }
    .group-list { display: flex; flex-direction: column; gap: 4px; }
    .group-row {
      display: flex; align-items: center; gap: 8px;
      padding: 6px 8px; border-radius: 6px;
      background: var(--secondary-background-color, rgba(255,255,255,0.03));
    }
    .group-name { flex: 1; font-size: 14px; }
    .task-count {
      font-size: 11px; color: var(--secondary-text-color);
      background: var(--card-background-color, rgba(0,0,0,0.2));
      padding: 1px 8px; border-radius: 999px;
      font-weight: 500;
    }
    .edit-input {
      flex: 1; padding: 4px 8px; font-size: 14px;
      background: var(--card-background-color, #1c1c1c);
      color: var(--primary-text-color);
      border: 1px solid var(--primary-color); border-radius: 4px;
      font-family: inherit;
    }
    .icon-btn {
      background: transparent; border: none; cursor: pointer;
      color: var(--secondary-text-color); padding: 4px;
      border-radius: 4px;
    }
    .icon-btn:hover {
      background: var(--state-icon-color, rgba(255,255,255,0.06));
      color: var(--primary-text-color);
    }
    .icon-btn.danger:hover { color: var(--error-color); }
    .icon-btn ha-icon { --mdc-icon-size: 18px; }
    .add-row {
      display: flex; gap: 6px;
      padding-top: 8px; border-top: 1px solid var(--divider-color);
    }
    .add-row input {
      flex: 1; padding: 6px 8px; font-size: 13px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      font-family: inherit;
    }
    /* Card-specific overrides on the shared .btn */
    .btn.small { padding: 4px 8px; font-size: 12px; }
    .btn ha-icon { --mdc-icon-size: 16px; }
  `];
__decorateClass([
  n4({ attribute: false })
], MaintenanceGroupsSectionCard.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceGroupsSectionCard.prototype, "_config", 2);
__decorateClass([
  r5()
], MaintenanceGroupsSectionCard.prototype, "_groups", 2);
__decorateClass([
  r5()
], MaintenanceGroupsSectionCard.prototype, "_loaded", 2);
__decorateClass([
  r5()
], MaintenanceGroupsSectionCard.prototype, "_busy", 2);
__decorateClass([
  r5()
], MaintenanceGroupsSectionCard.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenanceGroupsSectionCard.prototype, "_newName", 2);
__decorateClass([
  r5()
], MaintenanceGroupsSectionCard.prototype, "_editingId", 2);
__decorateClass([
  r5()
], MaintenanceGroupsSectionCard.prototype, "_editingName", 2);
if (!customElements.get("maintenance-groups-section-card")) {
  customElements.define(
    "maintenance-groups-section-card",
    MaintenanceGroupsSectionCard
  );
}
registerCustomCard({
  type: "maintenance-groups-section-card",
  name: "Maintenance Supporter \u2014 Groups",
  description: "Inline group CRUD",
  preview: false
});

// components/vacation-section-card.ts
init_lit();
init_decorators();
init_styles();
init_ws_errors();
var MaintenanceVacationSectionCard = class extends i4 {
  constructor() {
    super(...arguments);
    this._config = { type: "" };
    this._state = null;
    this._busy = false;
    this._error = "";
    this._localStart = "";
    this._localEnd = "";
    this._localBuffer = 7;
    this._dirty = false;
    this._loaded = false;
  }
  setConfig(config) {
    this._config = config;
  }
  getCardSize() {
    return 2;
  }
  get _lang() {
    return langOf(this.hass);
  }
  get _isAdmin() {
    return this.hass?.user?.is_admin ?? true;
  }
  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass && !this._loaded) {
      this._loaded = true;
      void this._load();
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }
  async _load() {
    try {
      const r6 = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/vacation/state"
      });
      this._state = r6;
      this._localStart = r6.start || "";
      this._localEnd = r6.end || "";
      this._localBuffer = r6.buffer_days ?? 7;
      this._dirty = false;
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    }
  }
  async _toggleEnabled(on) {
    this._busy = true;
    this._error = "";
    try {
      const r6 = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/vacation/update",
        enabled: on
      });
      this._state = r6;
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  async _save() {
    if (!this._isAdmin) return;
    this._busy = true;
    this._error = "";
    try {
      const r6 = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/vacation/update",
        start: this._localStart || null,
        end: this._localEnd || null,
        buffer_days: this._localBuffer
      });
      this._state = r6;
      this._dirty = false;
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  async _endNow() {
    if (!this._isAdmin) return;
    if (!window.confirm(t3("vacation_end_now_confirm", this._lang) || "End vacation immediately?")) return;
    this._busy = true;
    try {
      const r6 = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/vacation/end_now"
      });
      this._state = r6;
      this._localStart = r6.start || "";
      this._localEnd = r6.end || "";
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  _onDeepLink() {
    const path = "/maintenance-supporter?ms_action=open_vacation";
    history.pushState(null, "", path);
    window.dispatchEvent(new CustomEvent("location-changed"));
  }
  render() {
    const L2 = this._lang;
    const s4 = this._state;
    if (!s4) {
      return b2`<ha-card><div class="loading">${t3("loading", L2) || "Loading\u2026"}</div></ha-card>`;
    }
    const active = s4.is_active === true;
    const enabled = s4.enabled === true;
    const exemptCount = s4.exempt_task_ids?.length ?? 0;
    const statusLabel = active ? t3("vacation_status_active", L2) || "Active now" : enabled ? t3("vacation_status_scheduled", L2) || "Scheduled" : t3("vacation_status_inactive", L2) || "Inactive";
    const statusClass = active ? "active" : enabled ? "scheduled" : "inactive";
    return b2`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <div class="title">
              <span class="emoji">🏖️</span>
              <span>${this._config.title || (t3("vacation_mode", L2) || "Vacation mode")}</span>
            </div>
            <span class="status-pill ${statusClass}">${statusLabel}</span>
          </div>

          ${this._error ? b2`<div class="error">${this._error}</div>` : A}

          ${this._isAdmin ? b2`
                <div class="row toggle-row">
                  <label>${t3("enable", L2) || "Enable"}</label>
                  <ha-switch
                    .checked=${enabled}
                    .disabled=${this._busy}
                    @change=${(e7) => this._toggleEnabled(e7.target.checked)}
                  ></ha-switch>
                </div>

                <div class="dates-row">
                  <div class="date-field">
                    <label>${t3("vacation_start", L2) || "Start"}</label>
                    <input type="date" .value=${this._localStart}
                      ?disabled=${this._busy}
                      @input=${(e7) => {
      this._localStart = e7.target.value;
      this._dirty = true;
    }} />
                  </div>
                  <div class="date-field">
                    <label>${t3("vacation_end", L2) || "End"}</label>
                    <input type="date" .value=${this._localEnd}
                      ?disabled=${this._busy}
                      @input=${(e7) => {
      this._localEnd = e7.target.value;
      this._dirty = true;
    }} />
                  </div>
                  <div class="date-field buffer">
                    <label>${t3("vacation_buffer", L2) || "Buffer days"}</label>
                    <input type="number" min="0" max="14"
                      .value=${String(this._localBuffer)}
                      ?disabled=${this._busy}
                      @input=${(e7) => {
      this._localBuffer = parseInt(
        e7.target.value,
        10
      ) || 0;
      this._dirty = true;
    }} />
                  </div>
                </div>

                <div class="actions">
                  <button class="btn ${this._dirty ? "primary" : "muted"}"
                    @click=${this._save}
                    ?disabled=${this._busy || !this._dirty}>
                    <ha-icon icon="${this._dirty ? "mdi:content-save" : "mdi:check"}"></ha-icon>
                    ${this._dirty ? t3("save", L2) || "Save" : t3("saved", L2) || "Saved"}
                  </button>
                  ${active ? b2`<button class="btn"
                        @click=${this._endNow}
                        ?disabled=${this._busy}>
                        ${t3("vacation_end_now", L2) || "End now"}
                      </button>` : A}
                  ${exemptCount > 0 ? b2`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${exemptCount} ${t3("vacation_exempt_count", L2) || "exempt"}…
                      </button>` : b2`<button class="btn link"
                        @click=${this._onDeepLink}>
                        ${t3("vacation_advanced", L2) || "Advanced\u2026"}
                      </button>`}
                </div>
              ` : b2`
                <div class="readonly">
                  ${enabled && s4.start && s4.end ? b2`<div>${s4.start} → ${s4.end}</div>` : A}
                  <button class="btn link" @click=${this._onDeepLink}>
                    ${t3("vacation_open_panel", L2) || "Open in panel"}
                  </button>
                </div>
              `}
        </div>
      </ha-card>
    `;
  }
};
MaintenanceVacationSectionCard.styles = [sectionCardSharedStyles, i`
    .status-pill {
      font-size: 11px; font-weight: 600;
      padding: 3px 8px; border-radius: 999px;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .status-pill.active {
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50;
    }
    .status-pill.scheduled {
      background: rgba(255, 152, 0, 0.15);
      color: #ff9800;
    }
    .status-pill.inactive {
      background: rgba(158, 158, 158, 0.15);
      color: var(--secondary-text-color);
    }
    .row.toggle-row {
      display: flex; align-items: center; justify-content: space-between;
    }
    .row.toggle-row label {
      font-size: 14px; color: var(--primary-text-color);
    }
    .dates-row {
      display: grid; grid-template-columns: 1fr 1fr 100px; gap: 10px;
    }
    .date-field.buffer label { white-space: nowrap; }
    .date-field { display: flex; flex-direction: column; gap: 4px; }
    .date-field label {
      font-size: 11px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.3px;
    }
    .date-field input {
      padding: 6px 8px; font-size: 13px;
      background: var(--secondary-background-color, #2c2c2c);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color); border-radius: 6px;
      font-family: inherit;
    }
    .date-field input:disabled { opacity: 0.5; cursor: not-allowed; }
    .actions {
      display: flex; gap: 8px; align-items: center; flex-wrap: wrap;
    }
    .readonly { display: flex; flex-direction: column; gap: 8px; }
  `];
__decorateClass([
  n4({ attribute: false })
], MaintenanceVacationSectionCard.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceVacationSectionCard.prototype, "_config", 2);
__decorateClass([
  r5()
], MaintenanceVacationSectionCard.prototype, "_state", 2);
__decorateClass([
  r5()
], MaintenanceVacationSectionCard.prototype, "_busy", 2);
__decorateClass([
  r5()
], MaintenanceVacationSectionCard.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenanceVacationSectionCard.prototype, "_localStart", 2);
__decorateClass([
  r5()
], MaintenanceVacationSectionCard.prototype, "_localEnd", 2);
__decorateClass([
  r5()
], MaintenanceVacationSectionCard.prototype, "_localBuffer", 2);
__decorateClass([
  r5()
], MaintenanceVacationSectionCard.prototype, "_dirty", 2);
if (!customElements.get("maintenance-vacation-section-card")) {
  customElements.define(
    "maintenance-vacation-section-card",
    MaintenanceVacationSectionCard
  );
}
registerCustomCard({
  type: "maintenance-vacation-section-card",
  name: "Maintenance Supporter \u2014 Vacation",
  description: "Inline vacation mode toggle + dates",
  preview: false
});

// components/storage-section-card.ts
init_lit();

// helpers/document-categories.ts
var CATEGORIES = ["manual", "warranty", "invoice", "spare_parts", "photo", "other"];
var CATEGORY_ICONS = {
  manual: "mdi:book-open-variant",
  warranty: "mdi:shield-check",
  invoice: "mdi:receipt-text-outline",
  spare_parts: "mdi:cog-outline",
  photo: "mdi:image-outline",
  other: "mdi:file-document-outline"
};
function docDisplayName(doc) {
  return doc.title || doc.filename || doc.url || "";
}

// components/storage-section-card.ts
init_decorators();
init_styles();
init_ws_errors();
init_url();

// helpers/format-bytes.ts
function formatBytes(bytes) {
  const b3 = bytes ?? 0;
  if (b3 < 1024) return `${b3} B`;
  if (b3 < 1024 * 1024) return `${(b3 / 1024).toFixed(1)} KB`;
  return `${(b3 / (1024 * 1024)).toFixed(1)} MB`;
}

// components/storage-section-card.ts
var MaintenanceStorageSectionCard = class extends i4 {
  constructor() {
    super(...arguments);
    this.objects = [];
    this._summary = null;
    this._loaded = false;
    this._busy = false;
    this._error = "";
    this._query = "";
    this._results = [];
    this._expanded = false;
    this._initiallyLoaded = false;
    this._searchTimer = 0;
  }
  get _lang() {
    return langOf(this.hass);
  }
  updated(changed) {
    super.updated(changed);
    if (changed.has("hass") && this.hass && !this._initiallyLoaded) {
      this._initiallyLoaded = true;
      void this._load();
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }
  async _load() {
    this._busy = true;
    try {
      this._summary = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/storage"
      });
      this._error = "";
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._loaded = true;
      this._busy = false;
    }
  }
  _nameFor(objectId) {
    const o7 = this.objects.find((x2) => x2.object?.id === objectId);
    return o7?.object?.name || objectId.slice(0, 8);
  }
  _entryFor(objectId) {
    return this.objects.find((x2) => x2.object?.id === objectId)?.entry_id;
  }
  _toggle() {
    this._expanded = !this._expanded;
  }
  /** Ask the panel (which owns navigation) to open an object's detail view. */
  _openObject(entryId) {
    this.dispatchEvent(
      new CustomEvent("open-object", {
        detail: { entry_id: entryId },
        bubbles: true,
        composed: true
      })
    );
  }
  _onSearch(e7) {
    this._query = e7.target.value;
    clearTimeout(this._searchTimer);
    this._searchTimer = window.setTimeout(() => void this._doSearch(), 250);
  }
  async _doSearch() {
    const q = this._query.trim();
    if (!q) {
      this._results = [];
      return;
    }
    try {
      const r6 = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/search",
        query: q
      });
      this._results = r6.results || [];
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
      this._results = [];
    }
  }
  async _openResult(doc) {
    if (doc.kind === "weblink") {
      if (isSafeHttpUrl(doc.url)) window.open(doc.url, "_blank", "noopener");
      return;
    }
    try {
      await openSignedDocument(this.hass, doc.id);
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    }
  }
  _renderResult(doc, L2) {
    return b2`
      <div class="obj-row result-row" title=${t3("doc_open", L2)} @click=${() => this._openResult(doc)}>
        <ha-icon icon=${doc.kind === "weblink" ? "mdi:link-variant" : "mdi:file-document-outline"}></ha-icon>
        <div class="result-info">
          <div class="result-title">${docDisplayName(doc)}</div>
          <div class="result-obj">${doc.object_name}</div>
        </div>
        <ha-icon class="result-open" icon=${doc.kind === "weblink" ? "mdi:open-in-new" : "mdi:eye-outline"}></ha-icon>
      </div>
    `;
  }
  render() {
    if (!this._loaded || !this._summary) return A;
    const s4 = this._summary;
    if (s4.document_count === 0) return A;
    const L2 = this._lang;
    const rows = Object.entries(s4.by_object).filter(([, v2]) => v2.files > 0 || v2.links > 0).map(([id, v2]) => ({ id, name: this._nameFor(id), entry: this._entryFor(id), ...v2 })).sort((a3, b3) => b3.bytes - a3.bytes);
    return b2`
      <ha-card>
        <div class="card-content">
          <div class="header">
            <button
              class="toggle"
              @click=${this._toggle}
              aria-expanded=${this._expanded ? "true" : "false"}
              aria-label=${t3("doc_storage_title", L2)}
            >
              <ha-icon class="chevron" icon=${this._expanded ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
              <span class="emoji">🗄️</span>
              <span class="title-text">${t3("doc_storage_title", L2)}</span>
              <span class="header-summary">
                ${formatBytes(s4.total_bytes)}
                ${s4.dedup_savings_bytes > 0 ? b2`<span class="saved">−${formatBytes(s4.dedup_savings_bytes)}</span>` : A}
              </span>
            </button>
            <button
              class="icon-btn"
              title=${t3("doc_storage_refresh", L2)}
              ?disabled=${this._busy}
              @click=${this._load}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
            </button>
          </div>

          ${this._expanded ? b2`
                <div class="body">
                  <div class="totals">
                    <div class="stat">
                      <div class="stat-value">${formatBytes(s4.total_bytes)}</div>
                      <div class="stat-label">
                        <ha-icon icon="mdi:file-document-outline"></ha-icon> ${s4.file_count}
                        <ha-icon icon="mdi:link-variant"></ha-icon> ${s4.link_count}
                      </div>
                    </div>
                    ${s4.dedup_savings_bytes > 0 ? b2`<div class="stat">
                          <div class="stat-value saved">−${formatBytes(s4.dedup_savings_bytes)}</div>
                          <div class="stat-label">${t3("doc_storage_saved", L2)}</div>
                        </div>` : A}
                  </div>

                  <div class="doc-search">
                    <ha-icon icon="mdi:magnify"></ha-icon>
                    <input
                      type="search"
                      aria-label=${t3("doc_search", L2)}
                      placeholder=${t3("doc_search", L2)}
                      .value=${this._query}
                      @input=${this._onSearch}
                    />
                  </div>

                  ${this._error ? b2`<div class="error">${this._error}</div>` : A}

                  ${this._query.trim() ? this._results.length ? b2`<div class="obj-list">${this._results.map((d3) => this._renderResult(d3, L2))}</div>` : b2`<div class="search-empty">${t3("doc_search_none", L2)}</div>` : rows.length ? b2`<div class="obj-list">${rows.map((r6) => this._renderObjRow(r6, L2))}</div>` : A}
                </div>
              ` : A}
        </div>
      </ha-card>
    `;
  }
  _renderObjRow(r6, L2) {
    const eid = r6.entry;
    return b2`
      <div
        class="obj-row ${eid ? "clickable" : ""}"
        role=${eid ? "button" : A}
        tabindex=${eid ? "0" : A}
        aria-label=${eid ? r6.name : A}
        @click=${eid ? () => this._openObject(eid) : void 0}
        @keydown=${eid ? (e7) => {
      if (e7.key === "Enter" || e7.key === " ") {
        e7.preventDefault();
        this._openObject(eid);
      }
    } : void 0}
      >
        <span class="obj-name">${r6.name}</span>
        <span class="obj-meta">
          ${r6.files > 0 ? b2`<ha-icon icon="mdi:file-document-outline"></ha-icon>${r6.files}` : A}
          ${r6.links > 0 ? b2`<ha-icon icon="mdi:link-variant"></ha-icon>${r6.links}` : A}
        </span>
        <span class="obj-size">${formatBytes(r6.bytes)}</span>
        ${eid ? b2`<ha-icon class="obj-go" icon="mdi:chevron-right"></ha-icon>` : A}
      </div>
    `;
  }
};
MaintenanceStorageSectionCard.styles = i`
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
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceStorageSectionCard.prototype, "hass", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceStorageSectionCard.prototype, "objects", 2);
__decorateClass([
  r5()
], MaintenanceStorageSectionCard.prototype, "_summary", 2);
__decorateClass([
  r5()
], MaintenanceStorageSectionCard.prototype, "_loaded", 2);
__decorateClass([
  r5()
], MaintenanceStorageSectionCard.prototype, "_busy", 2);
__decorateClass([
  r5()
], MaintenanceStorageSectionCard.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenanceStorageSectionCard.prototype, "_query", 2);
__decorateClass([
  r5()
], MaintenanceStorageSectionCard.prototype, "_results", 2);
__decorateClass([
  r5()
], MaintenanceStorageSectionCard.prototype, "_expanded", 2);
if (!customElements.get("maintenance-storage-section-card")) {
  customElements.define("maintenance-storage-section-card", MaintenanceStorageSectionCard);
}

// ds-entry.ts
init_task_dialog();
init_object_dialog();
init_complete_dialog();

// components/confirm-dialog.ts
init_lit();
init_decorators();
init_styles();
var MaintenanceConfirmDialog = class extends i4 {
  constructor() {
    super(...arguments);
    this._open = false;
    this._title = "";
    this._message = "";
    this._confirmText = "";
    this._danger = false;
    this._inputLabel = "";
    this._inputType = "";
    this._inputValue = "";
    this._resolve = null;
    this._promptResolve = null;
  }
  confirm(opts) {
    this._title = opts.title;
    this._message = opts.message;
    this._confirmText = opts.confirmText || "OK";
    this._danger = opts.danger || false;
    this._inputLabel = "";
    this._inputType = "";
    this._inputValue = "";
    this._open = true;
    return new Promise((resolve) => {
      this._resolve = resolve;
      this._promptResolve = null;
    });
  }
  prompt(opts) {
    this._title = opts.title;
    this._message = opts.message;
    this._confirmText = opts.confirmText || "OK";
    this._danger = opts.danger || false;
    this._inputLabel = opts.inputLabel || "";
    this._inputType = opts.inputType || "text";
    this._inputValue = opts.inputValue || "";
    this._open = true;
    return new Promise((resolve) => {
      this._promptResolve = resolve;
      this._resolve = null;
    });
  }
  _cancel() {
    this._open = false;
    if (this._promptResolve) {
      this._promptResolve({ confirmed: false, value: "" });
      this._promptResolve = null;
    }
    this._resolve?.(false);
    this._resolve = null;
  }
  _confirmAction() {
    this._open = false;
    if (this._promptResolve) {
      this._promptResolve({ confirmed: true, value: this._inputValue });
      this._promptResolve = null;
    }
    this._resolve?.(true);
    this._resolve = null;
  }
  render() {
    if (!this._open) return A;
    const lang = langOf(this.hass);
    return b2`
      <ha-dialog open @closed=${this._cancel}>
        <div class="dialog-title">${this._title}</div>
        <div class="content">
          ${this._message}
          ${this._inputLabel ? b2`
            <!-- Native <input> rather than <ha-textfield>: HA loads
                 ha-textfield lazily for its own panels, so inside this custom
                 panel it can be unregistered and render with zero height —
                 the prompt then shows no field at all (caught live testing
                 the pause/replace prompts; same fix as complete-dialog). -->
            <label class="field">
              <span class="field-label">${this._inputLabel}</span>
              <input class="field-input"
                type="${this._inputType || "text"}"
                .value=${this._inputValue}
                @input=${(e7) => this._inputValue = e7.target.value} />
            </label>
          ` : A}
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._cancel}>
            ${t3("cancel", lang)}
          </ha-button>
          <ha-button
            class="${this._danger ? "danger" : ""}"
            @click=${this._confirmAction}
          >
            ${this._confirmText}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }
};
MaintenanceConfirmDialog.styles = [nativeFieldStyles, i`
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
  `];
__decorateClass([
  n4({ attribute: false })
], MaintenanceConfirmDialog.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceConfirmDialog.prototype, "_open", 2);
__decorateClass([
  r5()
], MaintenanceConfirmDialog.prototype, "_title", 2);
__decorateClass([
  r5()
], MaintenanceConfirmDialog.prototype, "_message", 2);
__decorateClass([
  r5()
], MaintenanceConfirmDialog.prototype, "_confirmText", 2);
__decorateClass([
  r5()
], MaintenanceConfirmDialog.prototype, "_danger", 2);
__decorateClass([
  r5()
], MaintenanceConfirmDialog.prototype, "_inputLabel", 2);
__decorateClass([
  r5()
], MaintenanceConfirmDialog.prototype, "_inputType", 2);
__decorateClass([
  r5()
], MaintenanceConfirmDialog.prototype, "_inputValue", 2);
if (!customElements.get("maintenance-confirm-dialog")) {
  customElements.define("maintenance-confirm-dialog", MaintenanceConfirmDialog);
}

// components/group-dialog.ts
init_lit();
init_decorators();
init_styles();
init_ws_errors();
init_ms_textfield();
var MaintenanceGroupDialog = class extends i4 {
  constructor() {
    super(...arguments);
    this.objects = [];
    this._open = false;
    this._loading = false;
    this._error = "";
    this._groupId = null;
    this._name = "";
    this._description = "";
    this._selected = /* @__PURE__ */ new Set();
    this._toggleTask = (entryId, taskId) => {
      const key = `${entryId}:${taskId}`;
      const next = new Set(this._selected);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      this._selected = next;
    };
    this._save = async () => {
      const name = this._name.trim();
      if (!name) {
        this._error = t3("group_name_required", this._lang);
        return;
      }
      this._loading = true;
      this._error = "";
      try {
        const task_refs = this._buildTaskRefs();
        if (this._groupId) {
          await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/group/update",
            group_id: this._groupId,
            name,
            description: this._description,
            task_refs
          });
        } else {
          await this.hass.connection.sendMessagePromise({
            type: "maintenance_supporter/group/create",
            name,
            description: this._description,
            task_refs
          });
        }
        this._open = false;
        this.dispatchEvent(new CustomEvent("group-saved"));
      } catch (e7) {
        this._error = describeWsError(e7, this._lang, t3("save_error", this._lang));
      } finally {
        this._loading = false;
      }
    };
  }
  // "entry_id:task_id"
  get _lang() {
    return langOf(this.hass);
  }
  openCreate() {
    this._reset();
    this._open = true;
  }
  openEdit(groupId, group) {
    this._reset();
    this._groupId = groupId;
    this._name = group.name;
    this._description = group.description || "";
    this._selected = new Set(group.task_refs.map((r6) => `${r6.entry_id}:${r6.task_id}`));
    this._open = true;
  }
  _reset() {
    this._groupId = null;
    this._name = "";
    this._description = "";
    this._selected = /* @__PURE__ */ new Set();
    this._error = "";
  }
  _close() {
    this._open = false;
  }
  _buildTaskRefs() {
    return [...this._selected].map((k2) => {
      const [entry_id, task_id] = k2.split(":", 2);
      return { entry_id, task_id };
    });
  }
  render() {
    if (!this._open) return b2``;
    const L2 = this._lang;
    const title = this._groupId ? t3("edit_group", L2) : t3("new_group", L2);
    return b2`
      <ha-dialog open @closed=${this._close} heading="${title}">
        <div class="content">
          ${this._error ? b2`<div class="error">${this._error}</div>` : A}
          <ms-textfield
            label="${t3("name", L2)}"
            required
            .value=${this._name}
            @input=${(e7) => this._name = e7.target.value}
          ></ms-textfield>
          <ms-textfield
            label="${t3("description_optional", L2)}"
            .value=${this._description}
            @input=${(e7) => this._description = e7.target.value}
          ></ms-textfield>

          <div class="section-title">${t3("group_select_tasks", L2)}</div>
          ${this.objects.length === 0 ? b2`<div class="hint">${t3("no_objects", L2)}</div>` : b2`
              <div class="objects">
                ${[...this.objects].sort((a3, b3) => a3.object.name.localeCompare(b3.object.name)).map((obj) => b2`
                  <div class="object-block">
                    <div class="object-name">${obj.object.name}</div>
                    ${obj.tasks.length === 0 ? b2`<div class="hint small">${t3("no_tasks_short", L2)}</div>` : [...obj.tasks].sort((a3, b3) => a3.name.localeCompare(b3.name)).map((task) => {
      const key = `${obj.entry_id}:${task.id}`;
      const checked = this._selected.has(key);
      return b2`
                          <label class="task-row">
                            <input type="checkbox"
                              .checked=${checked}
                              @change=${() => this._toggleTask(obj.entry_id, task.id)} />
                            <span>${task.name}</span>
                          </label>
                        `;
    })}
                  </div>
                `)}
              </div>
            `}
          <div class="selected-count">
            ${t3("selected", L2)}: ${this._selected.size}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._close}>
            ${t3("cancel", L2)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading || !this._name.trim()}>
            ${this._loading ? t3("saving", L2) : t3("save", L2)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }
};
MaintenanceGroupDialog.styles = i`
    .content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: min(360px, calc(100vw - 24px));
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
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceGroupDialog.prototype, "hass", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceGroupDialog.prototype, "objects", 2);
__decorateClass([
  r5()
], MaintenanceGroupDialog.prototype, "_open", 2);
__decorateClass([
  r5()
], MaintenanceGroupDialog.prototype, "_loading", 2);
__decorateClass([
  r5()
], MaintenanceGroupDialog.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenanceGroupDialog.prototype, "_groupId", 2);
__decorateClass([
  r5()
], MaintenanceGroupDialog.prototype, "_name", 2);
__decorateClass([
  r5()
], MaintenanceGroupDialog.prototype, "_description", 2);
__decorateClass([
  r5()
], MaintenanceGroupDialog.prototype, "_selected", 2);
if (!customElements.get("maintenance-group-dialog")) {
  customElements.define("maintenance-group-dialog", MaintenanceGroupDialog);
}

// ds-entry.ts
init_qr_dialog();
init_history_edit_dialog();

// components/saved-views-dialog.ts
init_lit();
init_decorators();
init_styles();
init_ws_errors();
var MaintenanceSavedViewsDialog = class extends i4 {
  constructor() {
    super(...arguments);
    this._open = false;
    this._busy = false;
    this._error = "";
    this._name = "";
    this._views = [];
    this._filters = null;
    this._localeReady = false;
    this._save = async () => {
      const name = this._name.trim();
      if (!name || this._busy || !this._filters) return;
      this._busy = true;
      this._error = "";
      try {
        const res = await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/views/save",
          name,
          filters: this._filters
        });
        this._name = "";
        this._emitChanged(res.views || []);
      } catch (e7) {
        this._error = describeWsError(e7, this._lang);
      } finally {
        this._busy = false;
      }
    };
    this._delete = async (viewId) => {
      if (this._busy) return;
      this._busy = true;
      this._error = "";
      try {
        const res = await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/views/delete",
          view_id: viewId
        });
        this._emitChanged(res.views || []);
      } catch (e7) {
        this._error = describeWsError(e7, this._lang);
      } finally {
        this._busy = false;
      }
    };
  }
  get _lang() {
    return langOf(this.hass);
  }
  updated(changed) {
    if (changed.has("hass") && this.hass && !this._localeReady) {
      this._localeReady = true;
      ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }
  async open(currentFilters, views) {
    this._open = true;
    this._error = "";
    this._name = "";
    this._filters = currentFilters;
    this._views = views;
  }
  _close() {
    this._open = false;
  }
  _emitChanged(views) {
    this._views = views;
    this.dispatchEvent(
      new CustomEvent("saved-views-changed", { bubbles: true, composed: true, detail: { views } })
    );
  }
  render() {
    if (!this._open) return b2``;
    const L2 = this._lang;
    return b2`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${(e7) => e7.stopPropagation()}>
          <div class="title">${t3("views_dialog_title", L2)}</div>
          <div class="hint">${t3("views_dialog_hint", L2)}</div>
          ${this._error ? b2`<div class="error">${this._error}</div>` : A}

          <div class="save-row">
            <input
              class="name-input"
              type="text"
              .value=${this._name}
              placeholder=${t3("views_name_placeholder", L2)}
              maxlength="60"
              @input=${(e7) => this._name = e7.target.value}
              @keydown=${(e7) => {
      if (e7.key === "Enter") this._save();
    }}
            />
            <ha-button @click=${this._save} .disabled=${!this._name.trim() || this._busy}>
              ${t3("views_save_current", L2)}
            </ha-button>
          </div>

          ${this._views.length === 0 ? b2`<div class="empty">${t3("views_none_yet", L2)}</div>` : b2`
                <div class="list">
                  ${this._views.map(
      (v2) => b2`
                      <div class="row">
                        <span class="row-name">${v2.name}</span>
                        <ha-icon-button
                          .path=${"M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"}
                          .label=${t3("delete", L2)}
                          @click=${() => this._delete(v2.id)}
                        ></ha-icon-button>
                      </div>
                    `
    )}
                </div>
              `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>${t3("close", L2)}</ha-button>
          </div>
        </div>
      </div>
    `;
  }
};
MaintenanceSavedViewsDialog.styles = i`
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
      min-width: min(360px, calc(100vw - 24px));
      max-width: 480px;
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
    .save-row {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    .name-input {
      flex: 1;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 14px;
    }
    .empty {
      color: var(--secondary-text-color);
      font-size: 14px;
      padding: 8px 0;
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
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
    }
    .row-name {
      font-size: 14px;
      font-weight: 500;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 8px;
    }
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceSavedViewsDialog.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceSavedViewsDialog.prototype, "_open", 2);
__decorateClass([
  r5()
], MaintenanceSavedViewsDialog.prototype, "_busy", 2);
__decorateClass([
  r5()
], MaintenanceSavedViewsDialog.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenanceSavedViewsDialog.prototype, "_name", 2);
__decorateClass([
  r5()
], MaintenanceSavedViewsDialog.prototype, "_views", 2);
if (!customElements.get("maintenance-saved-views-dialog")) {
  customElements.define("maintenance-saved-views-dialog", MaintenanceSavedViewsDialog);
}

// components/seasonal-overrides-dialog.ts
init_lit();
init_decorators();
init_styles();
init_ws_errors();
var MONTH_KEYS2 = [
  "month_jan",
  "month_feb",
  "month_mar",
  "month_apr",
  "month_may",
  "month_jun",
  "month_jul",
  "month_aug",
  "month_sep",
  "month_oct",
  "month_nov",
  "month_dec"
];
var SeasonalOverridesDialog = class extends i4 {
  constructor() {
    super(...arguments);
    this._open = false;
    this._loading = false;
    this._error = "";
    this._entryId = "";
    this._taskId = "";
    this._values = new Array(12).fill("");
    this._save = async () => {
      const overrides = this._buildOverrides();
      if (overrides === null) return;
      this._loading = true;
      this._error = "";
      try {
        await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/task/seasonal_overrides",
          entry_id: this._entryId,
          task_id: this._taskId,
          overrides
        });
        this._open = false;
        this.dispatchEvent(new CustomEvent("overrides-saved"));
      } catch (e7) {
        this._error = describeWsError(e7, this._lang, t3("save_error", this._lang));
      } finally {
        this._loading = false;
      }
    };
    this._clearAll = async () => {
      this._loading = true;
      this._error = "";
      try {
        await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/task/seasonal_overrides",
          entry_id: this._entryId,
          task_id: this._taskId,
          overrides: {}
        });
        this._values = new Array(12).fill("");
        this._open = false;
        this.dispatchEvent(new CustomEvent("overrides-saved"));
      } catch (e7) {
        this._error = describeWsError(e7, this._lang, t3("save_error", this._lang));
      } finally {
        this._loading = false;
      }
    };
  }
  get _lang() {
    return langOf(this.hass);
  }
  open(entryId, taskId, currentOverrides) {
    this._entryId = entryId;
    this._taskId = taskId;
    this._values = new Array(12).fill("");
    if (currentOverrides) {
      for (const [k2, v2] of Object.entries(currentOverrides)) {
        const m2 = parseInt(k2, 10);
        if (m2 >= 1 && m2 <= 12 && typeof v2 === "number") {
          this._values[m2 - 1] = v2.toString();
        }
      }
    }
    this._error = "";
    this._open = true;
  }
  _close() {
    this._open = false;
  }
  _buildOverrides() {
    const out = {};
    for (let i6 = 0; i6 < 12; i6++) {
      const raw = this._values[i6].trim();
      if (!raw) continue;
      const num = parseFloat(raw);
      if (Number.isNaN(num)) {
        this._error = `${t3("month_" + ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"][i6], this._lang)}: ${t3("seasonal_override_invalid", this._lang)}`;
        return null;
      }
      if (num < 0.1 || num > 5) {
        this._error = t3("seasonal_override_range", this._lang);
        return null;
      }
      out[i6 + 1] = num;
    }
    return out;
  }
  render() {
    if (!this._open) return b2``;
    const L2 = this._lang;
    return b2`
      <ha-dialog open @closed=${this._close} heading="${t3("seasonal_overrides_title", L2)}">
        <div class="content">
          <p class="hint">${t3("seasonal_overrides_hint", L2)}</p>
          ${this._error ? b2`<div class="error">${this._error}</div>` : A}
          <div class="months">
            ${MONTH_KEYS2.map((key, i6) => b2`
              <label class="month">
                <span class="mn">${t3(key, L2)}</span>
                <input type="number" step="0.1" min="0.1" max="5.0"
                  placeholder="1.0"
                  .value=${this._values[i6]}
                  @input=${(e7) => {
      const v2 = [...this._values];
      v2[i6] = e7.target.value;
      this._values = v2;
    }} />
              </label>
            `)}
          </div>
        </div>
        <div class="dialog-actions">
          <ha-button appearance="plain" @click=${this._clearAll} .disabled=${this._loading}>
            ${t3("clear_all", L2)}
          </ha-button>
          <div class="spacer"></div>
          <ha-button appearance="plain" @click=${this._close}>
            ${t3("cancel", L2)}
          </ha-button>
          <ha-button @click=${this._save} .disabled=${this._loading}>
            ${this._loading ? t3("saving", L2) : t3("save", L2)}
          </ha-button>
        </div>
      </ha-dialog>
    `;
  }
};
SeasonalOverridesDialog.styles = i`
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
  `;
__decorateClass([
  n4({ attribute: false })
], SeasonalOverridesDialog.prototype, "hass", 2);
__decorateClass([
  r5()
], SeasonalOverridesDialog.prototype, "_open", 2);
__decorateClass([
  r5()
], SeasonalOverridesDialog.prototype, "_loading", 2);
__decorateClass([
  r5()
], SeasonalOverridesDialog.prototype, "_error", 2);
__decorateClass([
  r5()
], SeasonalOverridesDialog.prototype, "_entryId", 2);
__decorateClass([
  r5()
], SeasonalOverridesDialog.prototype, "_taskId", 2);
__decorateClass([
  r5()
], SeasonalOverridesDialog.prototype, "_values", 2);
if (!customElements.get("maintenance-seasonal-overrides-dialog")) {
  customElements.define("maintenance-seasonal-overrides-dialog", SeasonalOverridesDialog);
}

// ds-entry.ts
init_task_quick_actions_dialog();
init_object_quick_actions_dialog();

// components/adopt-problem-sensors-dialog.ts
init_lit();
init_decorators();
init_styles();
init_ws_errors();
init_user_service();
var MaintenanceAdoptProblemSensorsDialog = class extends i4 {
  constructor() {
    super(...arguments);
    this._open = false;
    this._loading = false;
    this._adopting = false;
    this._error = "";
    this._sensors = [];
    this._selected = /* @__PURE__ */ new Set();
    this._users = [];
    this._responsible = "";
    this._forMinutes = "0";
    this._localeReady = false;
    this._userService = null;
    this._toggle = (entityId) => {
      const next = new Set(this._selected);
      if (next.has(entityId)) next.delete(entityId);
      else next.add(entityId);
      this._selected = next;
    };
    this._toggleAll = () => {
      if (this._selected.size === this._sensors.length) {
        this._selected = /* @__PURE__ */ new Set();
      } else {
        this._selected = new Set(this._sensors.map((s4) => s4.entity_id));
      }
    };
    this._adopt = async () => {
      if (this._selected.size === 0 || this._adopting) return;
      this._adopting = true;
      this._error = "";
      try {
        const selections = this._sensors.filter((s4) => this._selected.has(s4.entity_id)).map((s4) => ({
          entity_id: s4.entity_id,
          name: s4.name,
          entry_id: s4.suggested_entry_id ?? void 0,
          object_name: s4.suggested_object_name,
          device_id: s4.device_id ?? void 0,
          part_id: s4.suggested_part_id ?? void 0,
          responsible_user_id: this._responsible || void 0,
          for_minutes: parseInt(this._forMinutes, 10) > 0 ? parseInt(this._forMinutes, 10) : void 0
        }));
        const result = await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/problem_sensors/adopt",
          selections
        });
        this.dispatchEvent(
          new CustomEvent("problem-sensors-adopted", {
            bubbles: true,
            composed: true,
            detail: result
          })
        );
        this._open = false;
      } catch (e7) {
        this._error = describeWsError(e7, this._lang);
      } finally {
        this._adopting = false;
      }
    };
  }
  get _lang() {
    return langOf(this.hass);
  }
  updated(changed) {
    if (changed.has("hass") && this.hass && !this._localeReady) {
      this._localeReady = true;
      ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }
  async open() {
    this._open = true;
    this._loading = true;
    this._error = "";
    this._sensors = [];
    this._selected = /* @__PURE__ */ new Set();
    this._responsible = "";
    this._forMinutes = "0";
    try {
      if (!this._userService) this._userService = new UserService(this.hass);
      else this._userService.updateHass(this.hass);
      const [resp, users] = await Promise.all([
        this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/problem_sensors/discover"
        }),
        // Best-effort: adoption works fine without the user list.
        this._userService.getUsers().catch(() => [])
      ]);
      this._sensors = resp.sensors || [];
      this._selected = new Set(this._sensors.map((s4) => s4.entity_id));
      this._users = users;
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._loading = false;
    }
  }
  _close() {
    this._open = false;
  }
  render() {
    if (!this._open) return b2``;
    const L2 = this._lang;
    const allSelected = this._sensors.length > 0 && this._selected.size === this._sensors.length;
    return b2`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${(e7) => e7.stopPropagation()}>
          <div class="title">${t3("adopt_problem_title", L2)}</div>
          <div class="hint">${t3("adopt_problem_hint", L2)}</div>
          ${this._error ? b2`<div class="error">${this._error}</div>` : A}

          ${this._loading ? b2`<div class="loading">…</div>` : this._sensors.length === 0 ? b2`<div class="empty">${t3("adopt_problem_none", L2)}</div>` : b2`
                  <label class="select-all">
                    <input
                      type="checkbox"
                      .checked=${allSelected}
                      @change=${this._toggleAll}
                    />
                    <span>${t3("selected", L2)}: ${this._selected.size} / ${this._sensors.length}</span>
                  </label>
                  <div class="list">
                    ${this._sensors.map((s4) => {
      const checked = this._selected.has(s4.entity_id);
      const active = s4.state === "on";
      const sub = [s4.device_name, s4.area_name].filter(Boolean).join(" \xB7 ");
      return b2`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${checked}
                            @change=${() => this._toggle(s4.entity_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${s4.name}</span>
                              <span class="chip ${active ? "chip-active" : "chip-ok"}">
                                ${active ? t3("adopt_problem_active", L2) : t3("adopt_problem_ok", L2)}
                              </span>
                            </div>
                            ${sub ? b2`<div class="row-sub">${sub}</div>` : A}
                            <div class="row-target">
                              → ${s4.suggested_object_name}${s4.suggested_entry_id ? A : b2` <span class="new-tag">${t3("adopt_problem_new_object", L2)}</span>`}
                            </div>
                            ${s4.suggested_part_name ? b2`<div class="row-part">
                                  <ha-icon icon="mdi:package-variant-closed"></ha-icon>
                                  ${t3("adopt_problem_part", L2).replace("{name}", s4.suggested_part_name)}
                                </div>` : A}
                          </div>
                        </label>
                      `;
    })}
                  </div>
                `}

          ${!this._loading && this._sensors.length > 0 ? b2`
                <label class="responsible">
                  <span>${t3("for_at_least_minutes", L2)}</span>
                  <input
                    class="for-input"
                    type="number"
                    min="0"
                    max="1440"
                    .value=${this._forMinutes}
                    @input=${(e7) => this._forMinutes = e7.target.value}
                  />
                </label>
                <div class="for-hint">${t3("adopt_for_minutes_hint", L2)}</div>
              ` : A}

          ${!this._loading && this._sensors.length > 0 && this._users.length > 0 ? b2`
                <label class="responsible">
                  <span>${t3("adopt_problem_responsible", L2)}</span>
                  <select
                    .value=${this._responsible}
                    @change=${(e7) => {
      this._responsible = e7.target.value;
    }}
                  >
                    <option value="" ?selected=${!this._responsible}>${t3("no_user_assigned", L2)}</option>
                    ${this._users.map(
      (u3) => b2`<option value=${u3.id} ?selected=${u3.id === this._responsible}>${u3.name}</option>`
    )}
                  </select>
                </label>
              ` : A}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${t3("cancel", L2)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size === 0 || this._adopting}
            >
              ${t3("adopt_problem_adopt", L2)}
            </ha-button>
          </div>
        </div>
      </div>
    `;
  }
};
MaintenanceAdoptProblemSensorsDialog.styles = i`
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
      min-width: min(360px, calc(100vw - 24px));
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
    .row-part {
      color: var(--secondary-text-color);
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .row-part ha-icon {
      --mdc-icon-size: 14px;
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
    .responsible {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: var(--secondary-text-color);
      flex-wrap: wrap;
    }
    .for-input {
      width: 70px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      padding: 4px 6px;
    }
    .for-hint {
      font-size: 11px;
      color: var(--secondary-text-color);
      margin: -4px 0 2px;
    }
    .responsible select {
      flex: 1;
      min-width: 140px;
      padding: 4px 6px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      font-size: 13px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding-top: 8px;
    }
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceAdoptProblemSensorsDialog.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceAdoptProblemSensorsDialog.prototype, "_open", 2);
__decorateClass([
  r5()
], MaintenanceAdoptProblemSensorsDialog.prototype, "_loading", 2);
__decorateClass([
  r5()
], MaintenanceAdoptProblemSensorsDialog.prototype, "_adopting", 2);
__decorateClass([
  r5()
], MaintenanceAdoptProblemSensorsDialog.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenanceAdoptProblemSensorsDialog.prototype, "_sensors", 2);
__decorateClass([
  r5()
], MaintenanceAdoptProblemSensorsDialog.prototype, "_selected", 2);
__decorateClass([
  r5()
], MaintenanceAdoptProblemSensorsDialog.prototype, "_users", 2);
__decorateClass([
  r5()
], MaintenanceAdoptProblemSensorsDialog.prototype, "_responsible", 2);
__decorateClass([
  r5()
], MaintenanceAdoptProblemSensorsDialog.prototype, "_forMinutes", 2);
if (!customElements.get("maintenance-adopt-problem-sensors-dialog")) {
  customElements.define(
    "maintenance-adopt-problem-sensors-dialog",
    MaintenanceAdoptProblemSensorsDialog
  );
}

// components/suggested-setups-dialog.ts
init_lit();
init_decorators();
init_styles();
init_ws_errors();
var MaintenanceSuggestedSetupsDialog = class extends i4 {
  constructor() {
    super(...arguments);
    this._open = false;
    this._loading = false;
    this._adopting = false;
    this._error = "";
    this._setups = [];
    this._selected = /* @__PURE__ */ new Set();
    this._baselines = /* @__PURE__ */ new Map();
    this._targets = /* @__PURE__ */ new Map();
    this._objects = [];
    this._localeReady = false;
    this._toggle = (deviceId) => {
      const next = new Set(this._selected);
      if (next.has(deviceId)) next.delete(deviceId);
      else next.add(deviceId);
      this._selected = next;
    };
    this._adopt = async () => {
      if (this._selected.size === 0 || this._adopting) return;
      this._adopting = true;
      this._error = "";
      try {
        const result = await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/integration_setups/adopt",
          selections: [...this._selected].map((device_id) => {
            const sel = {
              device_id
            };
            const target = this._targets.get(device_id);
            if (target) sel.entry_id = target;
            const setup = this._setups.find((s4) => s4.device_id === device_id);
            for (const task of setup?.tasks ?? []) {
              const raw = this._baselines.get(`${device_id} ${task.task_name}`);
              const b3 = raw ? parseFloat(raw) : NaN;
              if (!isNaN(b3) && b3 >= 0) (sel.baselines ??= {})[task.task_name] = b3;
            }
            return sel;
          })
        });
        this.dispatchEvent(
          new CustomEvent("integration-setups-adopted", {
            bubbles: true,
            composed: true,
            detail: result
          })
        );
        this._open = false;
      } catch (e7) {
        this._error = describeWsError(e7, this._lang);
      } finally {
        this._adopting = false;
      }
    };
  }
  get _lang() {
    return langOf(this.hass);
  }
  updated(changed) {
    if (changed.has("hass") && this.hass && !this._localeReady) {
      this._localeReady = true;
      ensureLocale(this._lang).then(() => this.requestUpdate());
    }
  }
  async open() {
    this._open = true;
    this._loading = true;
    this._error = "";
    this._setups = [];
    this._selected = /* @__PURE__ */ new Set();
    try {
      const resp = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/integration_setups/discover"
      });
      this._setups = resp.setups || [];
      this._selected = new Set(this._setups.map((s4) => s4.device_id));
      this._baselines = /* @__PURE__ */ new Map();
      this._targets = /* @__PURE__ */ new Map();
      try {
        const objs = await this.hass.connection.sendMessagePromise({ type: "maintenance_supporter/objects" });
        this._objects = (objs.objects || []).map((o7) => ({ entry_id: o7.entry_id, name: o7.object?.name || o7.entry_id })).sort((a3, b3) => a3.name.localeCompare(b3.name));
      } catch {
        this._objects = [];
      }
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._loading = false;
    }
  }
  _close() {
    this._open = false;
  }
  render() {
    if (!this._open) return b2``;
    const L2 = this._lang;
    return b2`
      <div class="overlay" @click=${this._close}>
        <div class="card" @click=${(e7) => e7.stopPropagation()}>
          <div class="title">${t3("setups_title", L2)}</div>
          <div class="hint">${t3("setups_hint", L2)}</div>
          ${this._error ? b2`<div class="error">${this._error}</div>` : A}

          ${this._loading ? b2`<div class="loading">…</div>` : this._setups.length === 0 ? b2`<div class="empty">${t3("setups_none", L2)}</div>` : b2`
                  <div class="list">
                    ${this._setups.map((s4) => {
      const checked = this._selected.has(s4.device_id);
      const sub = [s4.integration_name, s4.area_name].filter(Boolean).join(" \xB7 ");
      return b2`
                        <label class="row">
                          <input
                            type="checkbox"
                            .checked=${checked}
                            @change=${() => this._toggle(s4.device_id)}
                          />
                          <div class="row-main">
                            <div class="row-top">
                              <span class="row-name">${s4.device_name}</span>
                            </div>
                            <div class="row-sub">${sub}</div>
                            <div class="row-target" @click=${(e7) => e7.preventDefault()}>
                              →
                              ${checked && this._objects.length > 0 ? b2`
                                    <select
                                      class="target-select"
                                      @change=${(e7) => {
        const next = new Map(this._targets);
        const v2 = e7.target.value;
        if (v2) next.set(s4.device_id, v2);
        else next.delete(s4.device_id);
        this._targets = next;
      }}
                                    >
                                      <option value="" ?selected=${!this._targets.get(s4.device_id)}>
                                        ${s4.suggested_entry_id ? s4.suggested_object_name : t3("setups_target_new", L2).replace("{name}", s4.suggested_object_name)}
                                      </option>
                                      ${this._objects.filter((o7) => o7.entry_id !== s4.suggested_entry_id).map(
        (o7) => b2`<option
                                            value=${o7.entry_id}
                                            ?selected=${this._targets.get(s4.device_id) === o7.entry_id}
                                          >
                                            ${o7.name}
                                          </option>`
      )}
                                    </select>
                                  ` : b2`${s4.suggested_object_name}${s4.suggested_entry_id ? A : b2` <span class="new-tag">${t3("adopt_problem_new_object", L2)}</span>`}`}
                            </div>
                            <div class="row-tasks">
                              ${s4.tasks.map(
        (task) => b2`<span class="chip" title=${task.entity_ids.join(", ")}>
                                  <ha-icon icon="mdi:link-variant"></ha-icon>${task.task_name_localized || task.task_name}
                                </span>`
      )}
                            </div>
                            ${checked ? s4.tasks.filter((task) => task.direction === "usage_delta").map((task) => {
        const key = `${s4.device_id} ${task.task_name}`;
        return b2`
                                      <div class="baseline-field" @click=${(e7) => e7.preventDefault()}>
                                        <span class="baseline-label"
                                          >${task.task_name_localized || task.task_name} —
                                          ${t3("setups_baseline_hint", L2)}</span
                                        >
                                        <input
                                          type="number"
                                          step="any"
                                          min="0"
                                          .value=${this._baselines.get(key) ?? ""}
                                          @click=${(e7) => e7.preventDefault()}
                                          @input=${(e7) => {
          const next = new Map(this._baselines);
          next.set(key, e7.target.value);
          this._baselines = next;
        }}
                                        />
                                      </div>
                                    `;
      }) : A}
                          </div>
                        </label>
                      `;
    })}
                  </div>
                `}

          <div class="actions">
            <ha-button appearance="plain" @click=${this._close}>
              ${t3("cancel", L2)}
            </ha-button>
            <ha-button
              @click=${this._adopt}
              .disabled=${this._selected.size === 0 || this._adopting}
            >
              ${t3("setups_adopt", L2)}
            </ha-button>
          </div>
        </div>
      </div>
    `;
  }
};
MaintenanceSuggestedSetupsDialog.styles = i`
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
      min-width: min(360px, calc(100vw - 24px));
      max-width: 560px;
      width: 90vw;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    .title { font-size: 18px; font-weight: 500; }
    .hint { color: var(--secondary-text-color); font-size: 13px; }
    .error { color: var(--error-color, #f44336); font-size: 13px; }
    .loading, .empty { color: var(--secondary-text-color); font-size: 14px; padding: 12px 0; }
    .list { display: flex; flex-direction: column; gap: 6px; overflow-y: auto; max-height: 50vh; }
    .row {
      display: flex; align-items: flex-start; gap: 10px; padding: 8px;
      border: 1px solid var(--divider-color); border-radius: 6px; cursor: pointer;
    }
    .row input { margin-top: 2px; cursor: pointer; }
    .row-main { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
    .row-name { font-weight: 500; font-size: 13px; }
    .row-sub, .row-target { color: var(--secondary-text-color); font-size: 12px; }
    .new-tag { font-style: italic; }
    .row-tasks { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 2px; }
    .chip {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; padding: 2px 8px; border-radius: 10px;
      background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      color: var(--primary-text-color); white-space: nowrap;
    }
    .chip ha-icon { --mdc-icon-size: 12px; color: var(--primary-color); }
    .target-select {
      font-size: 12px; padding: 2px 4px; max-width: 100%;
      border: 1px solid var(--divider-color); border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .baseline-field {
      display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
      margin-top: 4px; font-size: 12px; color: var(--secondary-text-color);
    }
    .baseline-field input {
      width: 110px; padding: 3px 6px; font-size: 12px;
      border: 1px solid var(--divider-color); border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
    }
    .actions { display: flex; justify-content: flex-end; gap: 8px; padding-top: 8px; }
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceSuggestedSetupsDialog.prototype, "hass", 2);
__decorateClass([
  r5()
], MaintenanceSuggestedSetupsDialog.prototype, "_open", 2);
__decorateClass([
  r5()
], MaintenanceSuggestedSetupsDialog.prototype, "_loading", 2);
__decorateClass([
  r5()
], MaintenanceSuggestedSetupsDialog.prototype, "_adopting", 2);
__decorateClass([
  r5()
], MaintenanceSuggestedSetupsDialog.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenanceSuggestedSetupsDialog.prototype, "_setups", 2);
__decorateClass([
  r5()
], MaintenanceSuggestedSetupsDialog.prototype, "_selected", 2);
__decorateClass([
  r5()
], MaintenanceSuggestedSetupsDialog.prototype, "_baselines", 2);
__decorateClass([
  r5()
], MaintenanceSuggestedSetupsDialog.prototype, "_targets", 2);
__decorateClass([
  r5()
], MaintenanceSuggestedSetupsDialog.prototype, "_objects", 2);
if (!customElements.get("maintenance-suggested-setups-dialog")) {
  customElements.define(
    "maintenance-suggested-setups-dialog",
    MaintenanceSuggestedSetupsDialog
  );
}

// components/documents-section.ts
init_lit();
init_url();
init_decorators();
init_styles();
init_ws_errors();
var MaintenanceDocumentsSection = class extends i4 {
  constructor() {
    super(...arguments);
    this.canWrite = false;
    this._docs = [];
    this._loaded = false;
    this._busy = false;
    this._error = "";
    this._hint = "";
    this._addingLink = false;
    this._linkUrl = "";
    this._linkTitle = "";
    this._category = "manual";
    this._thumbs = {};
    this._lightboxUrl = "";
    this._editingId = "";
    this._editTitle = "";
    this._editCategory = "manual";
    this._dragOver = false;
    this._loadedFor = null;
    this._localeReady = false;
  }
  _isImage(doc) {
    return doc.kind === "file" && (doc.mime || "").startsWith("image/");
  }
  async _sign(doc) {
    return signDocumentPath(this.hass, doc.id);
  }
  get _lang() {
    return langOf(this.hass);
  }
  updated(changed) {
    super.updated(changed);
    if (this.hass && !this._localeReady) {
      this._localeReady = true;
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
    if (this.hass && this.entryId && this._loadedFor !== this.entryId) {
      this._loadedFor = this.entryId;
      void this._load();
    }
  }
  async _load() {
    try {
      const r6 = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/list",
        entry_id: this.entryId
      });
      this._docs = r6.documents || [];
      this._loaded = true;
      this._error = "";
      this._thumbs = {};
      void this._loadThumbs();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
      this._loaded = true;
    }
  }
  /** Pre-sign a serve URL for each image doc so it can render as a thumbnail. */
  async _loadThumbs() {
    await Promise.all(
      this._docs.filter((d3) => this._isImage(d3)).map(async (d3) => {
        try {
          const url = await this._sign(d3);
          this._thumbs = { ...this._thumbs, [d3.id]: url };
        } catch {
        }
      })
    );
  }
  _category_of(doc) {
    const tag = (doc.tags || []).find((x2) => CATEGORIES.includes(x2));
    return tag || "other";
  }
  /** Keyboard support for the file-picker <label>s (Enter/Space → open). */
  _labelKeydown(e7) {
    if (e7.key === "Enter" || e7.key === " ") {
      e7.preventDefault();
      e7.currentTarget.querySelector("input")?.click();
    }
  }
  _onFileInput(e7) {
    const input = e7.target;
    const files = Array.from(input.files ?? []);
    if (files.length) void this._uploadFiles(files);
    input.value = "";
  }
  _onCameraInput(e7) {
    const input = e7.target;
    const files = Array.from(input.files ?? []);
    if (files.length) void this._uploadFiles(files, "photo");
    input.value = "";
  }
  _onDrop(e7) {
    e7.preventDefault();
    this._dragOver = false;
    if (!this.canWrite || this._busy) return;
    const files = Array.from(e7.dataTransfer?.files ?? []);
    if (files.length) void this._uploadFiles(files);
  }
  _onDragOver(e7) {
    if (!this.canWrite) return;
    e7.preventDefault();
    this._dragOver = true;
  }
  _onDragLeave(e7) {
    const rt = e7.relatedTarget;
    if (!rt || !e7.currentTarget.contains(rt)) this._dragOver = false;
  }
  async _uploadFiles(files, category) {
    const cat = category ?? this._category;
    this._busy = true;
    this._error = "";
    this._hint = "";
    let deduped = 0;
    let dupInObject = 0;
    try {
      for (const file of files) {
        const form = new FormData();
        form.append("entry_id", this.entryId);
        form.append("tags", cat);
        form.append("file", file, file.name);
        const resp = await fetch("/api/maintenance_supporter/document/upload", {
          method: "POST",
          headers: { Authorization: `Bearer ${this.hass.auth?.data?.access_token ?? ""}` },
          body: form
        });
        if (!resp.ok) {
          this._error = resp.status === 413 ? t3("doc_too_large", this._lang) : t3("doc_upload_failed", this._lang);
          continue;
        }
        const doc = await resp.json();
        if (doc.duplicate_in_object) dupInObject++;
        else if (doc.deduped) deduped++;
      }
      if (dupInObject) this._hint = t3("doc_dup_in_object", this._lang);
      else if (deduped) this._hint = t3("doc_deduped", this._lang);
      await this._load();
    } catch {
      this._error = t3("doc_upload_failed", this._lang);
    } finally {
      this._busy = false;
    }
  }
  async _download(doc) {
    try {
      await downloadSignedDocument(this.hass, doc.id, doc.filename || doc.title || "document");
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    }
  }
  /** Open a document for viewing: images in an in-app lightbox, everything else
   *  inline in a new tab (the serve view sends Content-Disposition: inline). */
  async _preview(doc) {
    if (this._isImage(doc)) {
      this._lightboxUrl = this._thumbs[doc.id] || await this._sign(doc);
      return;
    }
    try {
      await openSignedDocument(this.hass, doc.id);
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    }
  }
  /** Open a document from a title/row click (not just the small icons): preview
   *  a file, open a web-link in a new tab. */
  _openDoc(doc) {
    if (doc.kind === "file") void this._preview(doc);
    else if (isSafeHttpUrl(doc.url)) window.open(doc.url, "_blank", "noopener");
  }
  _startEdit(doc) {
    this._editingId = doc.id;
    this._editTitle = doc.title || "";
    this._editCategory = this._category_of(doc);
    this._addingLink = false;
    this._error = "";
  }
  _cancelEdit() {
    this._editingId = "";
  }
  async _saveEdit(doc) {
    const freeTags = (doc.tags || []).filter(
      (x2) => !CATEGORIES.includes(x2)
    );
    const tags = doc.kind === "file" ? [this._editCategory, ...freeTags] : doc.tags ?? [];
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/update",
        doc_id: doc.id,
        title: this._editTitle.trim() || doc.filename || doc.url || "",
        tags
      });
      this._editingId = "";
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  async _delete(doc) {
    const name = docDisplayName(doc);
    if (!window.confirm(t3("doc_delete_confirm", this._lang).replace("{name}", name))) return;
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/delete",
        doc_id: doc.id
      });
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  async _addLink() {
    const url = this._linkUrl.trim();
    if (!url) return;
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/add_link",
        entry_id: this.entryId,
        url,
        title: this._linkTitle.trim() || null
      });
      this._linkUrl = "";
      this._linkTitle = "";
      this._addingLink = false;
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang, t3("doc_link_invalid", this._lang));
    } finally {
      this._busy = false;
    }
  }
  render() {
    const L2 = this._lang;
    return b2`
      <div
        class="doc-zone ${this._dragOver ? "drag-over" : ""}"
        @dragover=${this._onDragOver}
        @dragleave=${this._onDragLeave}
        @drop=${this._onDrop}
      >
        ${this._dragOver && this.canWrite ? b2`<div class="drop-overlay">
              <ha-icon icon="mdi:tray-arrow-down"></ha-icon> ${t3("doc_drop_hint", L2)}
            </div>` : A}
      <div class="doc-header">
        <h3>${t3("documents", L2)} (${this._docs.length})</h3>
        ${this.canWrite ? b2`
              <div class="doc-actions">
                <select
                  class="cat-select"
                  .value=${this._category}
                  ?disabled=${this._busy}
                  @change=${(e7) => this._category = e7.target.value}
                >
                  ${CATEGORIES.map((c4) => b2`<option value=${c4}>${t3(`doc_cat_${c4}`, L2)}</option>`)}
                </select>
                <label
                  class="btn primary ${this._busy ? "disabled" : ""}"
                  role="button"
                  tabindex="0"
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:upload"></ha-icon>
                  ${this._busy ? t3("doc_uploading", L2) : t3("doc_upload", L2)}
                  <input type="file" multiple hidden ?disabled=${this._busy} @change=${this._onFileInput} />
                </label>
                <label
                  class="btn camera-btn ${this._busy ? "disabled" : ""}"
                  role="button"
                  tabindex="0"
                  aria-label=${t3("doc_camera", L2)}
                  title=${t3("doc_camera", L2)}
                  @keydown=${this._labelKeydown}
                >
                  <ha-icon icon="mdi:camera"></ha-icon>
                  <input type="file" accept="image/*" capture="environment" hidden ?disabled=${this._busy} @change=${this._onCameraInput} />
                </label>
                <button class="btn" ?disabled=${this._busy} @click=${() => this._addingLink = !this._addingLink}>
                  <ha-icon icon="mdi:link-variant"></ha-icon> ${t3("doc_add_link", L2)}
                </button>
              </div>
            ` : A}
      </div>

      ${this._error ? b2`<div class="doc-msg error">${this._error}</div>` : A}
      ${this._hint ? b2`<div class="doc-msg hint">${this._hint}</div>` : A}

      ${this._addingLink && this.canWrite ? b2`
            <div class="link-form">
              <input
                type="url"
                placeholder=${t3("doc_link_url", L2)}
                .value=${this._linkUrl}
                ?disabled=${this._busy}
                @input=${(e7) => this._linkUrl = e7.target.value}
              />
              <input
                type="text"
                placeholder=${t3("doc_link_title", L2)}
                .value=${this._linkTitle}
                ?disabled=${this._busy}
                @input=${(e7) => this._linkTitle = e7.target.value}
              />
              <button class="btn primary" ?disabled=${this._busy || !this._linkUrl.trim()} @click=${this._addLink}>
                ${t3("add", L2)}
              </button>
              <button class="btn" ?disabled=${this._busy} @click=${() => this._addingLink = false}>
                ${t3("cancel", L2)}
              </button>
            </div>
          ` : A}

      ${!this._loaded ? b2`<div class="doc-empty">${t3("loading", L2)}</div>` : this._docs.length === 0 ? b2`<div class="doc-empty">${t3("documents_empty", L2)}</div>` : b2`
              <div class="doc-list">
                ${this._docs.map((doc) => this._renderDoc(doc, L2))}
              </div>
            `}

      ${this._lightboxUrl ? b2`<div class="lightbox" @click=${() => this._lightboxUrl = ""}>
            <img class="lightbox-img" src=${this._lightboxUrl} @click=${(e7) => e7.stopPropagation()} />
            <button class="lightbox-close" title=${t3("doc_close", L2)} @click=${() => this._lightboxUrl = ""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>` : A}
      </div>
    `;
  }
  _renderDoc(doc, L2) {
    if (this._editingId === doc.id) return this._renderEdit(doc, L2);
    const isFile = doc.kind === "file";
    const cat = this._category_of(doc);
    const meta = isFile ? `${t3(`doc_cat_${cat}`, L2)} \xB7 ${formatBytes(doc.size)}` : t3("doc_link_badge", L2);
    const thumb = this._thumbs[doc.id];
    return b2`
      <div class="doc-row">
        ${isFile && thumb ? b2`<img
              class="doc-thumb"
              src=${thumb}
              alt=${doc.title || ""}
              title=${t3("doc_open", L2)}
              @click=${() => this._preview(doc)}
            />` : b2`<ha-icon
              class="doc-icon ${isFile ? "clickable" : ""}"
              icon=${isFile ? CATEGORY_ICONS[cat] : "mdi:link-variant"}
              @click=${() => isFile && this._preview(doc)}
            ></ha-icon>`}
        <div
          class="doc-info"
          role="button"
          tabindex="0"
          title=${t3("doc_open", L2)}
          @click=${() => this._openDoc(doc)}
          @keydown=${(e7) => {
      if (e7.key === "Enter" || e7.key === " ") {
        e7.preventDefault();
        this._openDoc(doc);
      }
    }}
        >
          <div class="doc-title">${docDisplayName(doc)}</div>
          <div class="doc-meta">${meta}</div>
        </div>
        <div class="doc-row-actions">
          ${isFile ? b2`
                <button class="icon-btn" title=${t3("doc_open", L2)} @click=${() => this._preview(doc)}>
                  <ha-icon icon="mdi:eye-outline"></ha-icon>
                </button>
                <button class="icon-btn" title=${t3("doc_download", L2)} @click=${() => this._download(doc)}>
                  <ha-icon icon="mdi:download"></ha-icon>
                </button>` : b2`<a
                class="icon-btn"
                href=${isSafeHttpUrl(doc.url) ? doc.url : "#"}
                target="_blank"
                rel="noopener noreferrer"
                title=${t3("doc_open", L2)}
              ><ha-icon icon="mdi:open-in-new"></ha-icon></a>`}
          ${this.canWrite ? b2`
                <button class="icon-btn" title=${t3("edit", L2)} ?disabled=${this._busy} @click=${() => this._startEdit(doc)}>
                  <ha-icon icon="mdi:pencil"></ha-icon>
                </button>
                <button class="icon-btn danger" title=${t3("delete", L2)} ?disabled=${this._busy} @click=${() => this._delete(doc)}>
                  <ha-icon icon="mdi:delete"></ha-icon>
                </button>` : A}
        </div>
      </div>
    `;
  }
  _renderEdit(doc, L2) {
    const isFile = doc.kind === "file";
    return b2`
      <div class="doc-row editing">
        <input
          class="edit-title"
          type="text"
          placeholder=${t3("doc_link_title", L2)}
          .value=${this._editTitle}
          ?disabled=${this._busy}
          @input=${(e7) => this._editTitle = e7.target.value}
        />
        ${isFile ? b2`<select
              class="cat-select"
              ?disabled=${this._busy}
              @change=${(e7) => this._editCategory = e7.target.value}
            >
              ${CATEGORIES.map(
      (c4) => b2`<option value=${c4} ?selected=${c4 === this._editCategory}>${t3(`doc_cat_${c4}`, L2)}</option>`
    )}
            </select>` : A}
        <button class="icon-btn" title=${t3("save", L2)} ?disabled=${this._busy || !this._editTitle.trim()} @click=${() => this._saveEdit(doc)}>
          <ha-icon icon="mdi:check"></ha-icon>
        </button>
        <button class="icon-btn" title=${t3("cancel", L2)} ?disabled=${this._busy} @click=${this._cancelEdit}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </div>
    `;
  }
};
MaintenanceDocumentsSection.styles = i`
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
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceDocumentsSection.prototype, "hass", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceDocumentsSection.prototype, "entryId", 2);
__decorateClass([
  n4({ type: Boolean })
], MaintenanceDocumentsSection.prototype, "canWrite", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_docs", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_loaded", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_busy", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_hint", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_addingLink", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_linkUrl", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_linkTitle", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_category", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_thumbs", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_lightboxUrl", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_editingId", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_editTitle", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_editCategory", 2);
__decorateClass([
  r5()
], MaintenanceDocumentsSection.prototype, "_dragOver", 2);
if (!customElements.get("maintenance-documents-section")) {
  customElements.define("maintenance-documents-section", MaintenanceDocumentsSection);
}

// components/parts-section.ts
init_lit();
init_url();
init_decorators();
init_styles();
init_ws_errors();

// components/task-documents.ts
init_lit();
init_decorators();
init_styles();
init_ws_errors();
init_url();
var MaintenanceTaskDocuments = class extends i4 {
  constructor() {
    super(...arguments);
    this.canWrite = false;
    this._docs = [];
    this._loaded = false;
    this._busy = false;
    this._error = "";
    this._attachId = "";
    this._loadedKey = "";
    this._localeReady = false;
  }
  get _lang() {
    return langOf(this.hass);
  }
  /** The id linked docs reference — a task id or (part mode) a part id. */
  get _refId() {
    return this.partId || this.taskId || "";
  }
  /** The doc metadata field the link lives in. */
  get _linkField() {
    return this.partId ? "part_ids" : "task_ids";
  }
  updated(changed) {
    super.updated(changed);
    if (this.hass && !this._localeReady) {
      this._localeReady = true;
      void ensureLocale(this._lang).then(() => this.requestUpdate());
    }
    const key = `${this.entryId}|${this._refId}`;
    if (this.hass && this.entryId && this._refId && this._loadedKey !== key) {
      this._loadedKey = key;
      void this._load();
    }
  }
  async _load() {
    try {
      const r6 = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/list",
        entry_id: this.entryId
      });
      this._docs = r6.documents || [];
      this._loaded = true;
      this._error = "";
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
      this._loaded = true;
    }
  }
  _links(doc) {
    return doc[this._linkField] || [];
  }
  _linked() {
    return this._docs.filter((d3) => this._links(d3).includes(this._refId));
  }
  _available() {
    return this._docs.filter((d3) => !this._links(d3).includes(this._refId));
  }
  async _setLinks(doc, ids) {
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/update",
        doc_id: doc.id,
        [this._linkField]: ids
      });
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  _link() {
    const doc = this._docs.find((d3) => d3.id === this._attachId);
    if (!doc) return;
    this._attachId = "";
    void this._setLinks(doc, [...this._links(doc), this._refId]);
  }
  _unlink(doc) {
    void this._setLinks(doc, this._links(doc).filter((x2) => x2 !== this._refId));
  }
  _isPdf(doc) {
    return doc.mime === "application/pdf" || (doc.filename || "").toLowerCase().endsWith(".pdf");
  }
  /** The page this doc should open at for the current task, if set (PDFs only;
   *  page hints are a task-mode concept — none in part mode). */
  _pageFor(doc) {
    return this._isPdf(doc) && this.taskId ? doc.task_pages?.[this.taskId] : void 0;
  }
  async _open(doc) {
    if (doc.kind === "weblink") {
      if (isSafeHttpUrl(doc.url)) window.open(doc.url, "_blank", "noopener");
      return;
    }
    const page = this._pageFor(doc);
    try {
      await openSignedDocument(this.hass, doc.id, page ? `#page=${page}` : "");
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    }
  }
  /** Set (page >= 1) or clear (0) the jump-to page for this doc's task link. */
  async _setPage(doc, page) {
    if (!this.taskId) return;
    this._busy = true;
    this._error = "";
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/documents/update",
        doc_id: doc.id,
        task_pages: { [this.taskId]: page }
      });
      await this._load();
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    } finally {
      this._busy = false;
    }
  }
  async _download(doc) {
    try {
      await downloadSignedDocument(this.hass, doc.id, doc.filename || doc.title || "document");
    } catch (e7) {
      this._error = describeWsError(e7, this._lang);
    }
  }
  render() {
    if (!this._loaded || this._docs.length === 0) return A;
    const L2 = this._lang;
    const linked = this._linked();
    const available = this._available();
    return b2`
      <div class="task-docs">
        <h3><ha-icon icon="mdi:paperclip"></ha-icon> ${t3("documents", L2)} (${linked.length})</h3>
        ${this._error ? b2`<div class="tdoc-error">${this._error}</div>` : A}
        ${linked.length === 0 ? b2`<div class="tdoc-empty">${t3(this.partId ? "doc_part_none" : "doc_task_none", L2)}</div>` : b2`<div class="tdoc-list">${linked.map((d3) => this._renderRow(d3, L2))}</div>`}
        ${this.canWrite && available.length ? b2`<div class="tdoc-attach">
              <select
                class="tdoc-select"
                ?disabled=${this._busy}
                @change=${(e7) => this._attachId = e7.target.value}
              >
                <option value="" ?selected=${!this._attachId}>${t3("doc_link_existing", L2)}</option>
                ${available.map(
      (d3) => b2`<option value=${d3.id} ?selected=${d3.id === this._attachId}>${docDisplayName(d3)}</option>`
    )}
              </select>
              <button class="tdoc-btn" ?disabled=${this._busy || !this._attachId} @click=${this._link}>
                <ha-icon icon="mdi:link-variant-plus"></ha-icon> ${t3("doc_attach", L2)}
              </button>
            </div>` : A}
      </div>
    `;
  }
  _renderRow(doc, L2) {
    const isFile = doc.kind === "file";
    const isPdf = this._isPdf(doc);
    const page = this._pageFor(doc);
    const cat = (doc.tags || []).find((x2) => CATEGORIES.includes(x2)) || "other";
    const meta = isFile ? formatBytes(doc.size) : t3("doc_link_badge", L2);
    return b2`
      <div class="tdoc-row">
        <ha-icon class="tdoc-icon" icon=${isFile ? CATEGORY_ICONS[cat] : "mdi:link-variant"}></ha-icon>
        <div
          class="tdoc-info"
          role="button"
          tabindex="0"
          title=${page ? `${t3("doc_open", L2)} \xB7 ${t3("doc_page", L2)} ${page}` : t3("doc_open", L2)}
          @click=${() => this._open(doc)}
          @keydown=${(e7) => {
      if (e7.key === "Enter" || e7.key === " ") {
        e7.preventDefault();
        void this._open(doc);
      }
    }}
        >
          <div class="tdoc-title">${docDisplayName(doc)}</div>
          <div class="tdoc-meta">
            ${meta}${page ? b2` · <span class="tdoc-pagetag">${t3("doc_page", L2)} ${page}</span>` : A}
          </div>
        </div>
        ${this.canWrite && isPdf && this.taskId ? b2`<input
              class="tdoc-page"
              type="number"
              min="1"
              inputmode="numeric"
              aria-label=${t3("doc_page", L2)}
              title=${t3("doc_page", L2)}
              placeholder=${t3("doc_page", L2)}
              .value=${page ? String(page) : ""}
              ?disabled=${this._busy}
              @change=${(e7) => {
      const v2 = parseInt(e7.target.value, 10);
      void this._setPage(doc, Number.isFinite(v2) && v2 >= 1 ? v2 : 0);
    }}
            />` : A}
        <button class="icon-btn" title=${t3("doc_open", L2)} @click=${() => this._open(doc)}>
          <ha-icon icon=${isFile ? "mdi:eye-outline" : "mdi:open-in-new"}></ha-icon>
        </button>
        ${isFile ? b2`<button class="icon-btn" title=${t3("doc_download", L2)} @click=${() => this._download(doc)}>
              <ha-icon icon="mdi:download"></ha-icon>
            </button>` : A}
        ${this.canWrite ? b2`<button class="icon-btn" title=${t3("doc_unlink", L2)} ?disabled=${this._busy} @click=${() => this._unlink(doc)}>
              <ha-icon icon="mdi:link-variant-off"></ha-icon>
            </button>` : A}
      </div>
    `;
  }
};
MaintenanceTaskDocuments.styles = i`
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
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceTaskDocuments.prototype, "hass", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceTaskDocuments.prototype, "entryId", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceTaskDocuments.prototype, "taskId", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceTaskDocuments.prototype, "partId", 2);
__decorateClass([
  n4({ type: Boolean })
], MaintenanceTaskDocuments.prototype, "canWrite", 2);
__decorateClass([
  r5()
], MaintenanceTaskDocuments.prototype, "_docs", 2);
__decorateClass([
  r5()
], MaintenanceTaskDocuments.prototype, "_loaded", 2);
__decorateClass([
  r5()
], MaintenanceTaskDocuments.prototype, "_busy", 2);
__decorateClass([
  r5()
], MaintenanceTaskDocuments.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenanceTaskDocuments.prototype, "_attachId", 2);
if (!customElements.get("maintenance-task-documents")) {
  customElements.define("maintenance-task-documents", MaintenanceTaskDocuments);
}

// components/parts-section.ts
var EMPTY_FORM = {
  name: "",
  vendor: "",
  mpn: "",
  gtin: "",
  storage_location: "",
  product_url: "",
  unit: "",
  cost: "",
  stock: "",
  reorder_threshold: "",
  restock_quantity: "",
  auto_buy_task: true,
  notes: ""
};
var MaintenancePartsSection = class extends i4 {
  constructor() {
    super(...arguments);
    this.parts = [];
    this.canWrite = false;
    this.currencySymbol = "\u20AC";
    this._editing = null;
    this._busy = false;
    this._error = "";
    this._restockFor = null;
    this._restockQty = "";
    this._restockInvalid = false;
    this._docsFor = null;
  }
  get _lang() {
    return langOf(this.hass);
  }
  connectedCallback() {
    super.connectedCallback();
    void ensureLocale(this._lang).then(() => this.requestUpdate());
  }
  _notifyChanged() {
    this.dispatchEvent(new CustomEvent("parts-changed", { bubbles: true, composed: true }));
  }
  async _send(msg) {
    this._busy = true;
    this._error = "";
    try {
      return await this.hass.connection.sendMessagePromise(msg);
    } catch (err) {
      this._error = describeWsError(err, this._lang);
      return null;
    } finally {
      this._busy = false;
    }
  }
  _openAdd() {
    this._editing = { ...EMPTY_FORM };
  }
  _openEdit(part) {
    this._editing = {
      id: part.id,
      name: part.name,
      vendor: part.vendor || "",
      mpn: part.mpn || "",
      gtin: part.gtin || "",
      storage_location: part.storage_location || "",
      product_url: part.product_url || "",
      unit: part.unit || "",
      cost: part.cost != null ? String(part.cost) : "",
      stock: part.stock != null ? String(part.stock) : "",
      reorder_threshold: part.reorder_threshold != null ? String(part.reorder_threshold) : "",
      restock_quantity: part.restock_quantity != null ? String(part.restock_quantity) : "",
      auto_buy_task: !!part.auto_buy_task,
      notes: part.notes || ""
    };
  }
  _formValue(f3) {
    const num = (s4) => s4.trim() === "" ? null : Number(s4);
    return {
      entry_id: this.entryId,
      name: f3.name.trim(),
      vendor: f3.vendor.trim() || null,
      mpn: f3.mpn.trim() || null,
      gtin: f3.gtin.trim() || null,
      storage_location: f3.storage_location.trim() || null,
      product_url: f3.product_url.trim() || null,
      unit: f3.unit.trim() || null,
      cost: num(f3.cost),
      stock: num(f3.stock),
      reorder_threshold: num(f3.reorder_threshold),
      restock_quantity: num(f3.restock_quantity),
      auto_buy_task: f3.auto_buy_task,
      notes: f3.notes.trim() || null
    };
  }
  async _save() {
    const f3 = this._editing;
    if (!f3 || !f3.name.trim()) return;
    const payload = this._formValue(f3);
    const type = f3.id ? "maintenance_supporter/part/update" : "maintenance_supporter/part/create";
    const result = await this._send(f3.id ? { type, part_id: f3.id, ...payload } : { type, ...payload });
    if (result !== null) {
      this._editing = null;
      this._notifyChanged();
    }
  }
  async _delete(part) {
    if (!window.confirm(t3("part_delete_confirm", this._lang).replace("{name}", part.name))) return;
    const result = await this._send({
      type: "maintenance_supporter/part/delete",
      entry_id: this.entryId,
      part_id: part.id
    });
    if (result !== null) this._notifyChanged();
  }
  async _restock(part) {
    const qty = parseFloat(this._restockQty);
    if (!Number.isFinite(qty) || qty === 0) {
      this._restockInvalid = true;
      return;
    }
    this._restockInvalid = false;
    const result = await this._send({
      type: "maintenance_supporter/part/restock",
      entry_id: this.entryId,
      part_id: part.id,
      delta: qty
    });
    this._restockFor = null;
    if (result !== null) {
      part.stock = result.stock;
      this.requestUpdate();
      this._notifyChanged();
    }
  }
  _identLine(part) {
    return [part.vendor, part.mpn ? `MPN: ${part.mpn}` : "", part.gtin ? `GTIN: ${part.gtin}` : ""].filter(Boolean).join(" \xB7 ");
  }
  _renderRow(part) {
    const L2 = this._lang;
    const tracked = part.stock !== null && part.stock !== void 0;
    const ident = this._identLine(part);
    const docsOpen = this._docsFor === part.id;
    return b2`
      <div class="part-row ${part.is_low ? "low" : ""}">
        <ha-icon class="part-icon" icon=${part.is_low ? "mdi:cart-arrow-down" : "mdi:package-variant-closed"}></ha-icon>
        <div class="part-main">
          <div class="part-name">
            ${isSafeHttpUrl(part.shopping_url) ? b2`<a href=${part.shopping_url} target="_blank" rel="noopener noreferrer">${part.name}</a>` : part.name}
            ${tracked ? b2`<span class="stock-badge ${part.is_low ? "low" : ""}"
                  >${part.stock}${part.unit ? ` ${part.unit}` : ""}${part.reorder_threshold != null ? b2`<span class="threshold">/${part.reorder_threshold}</span>` : A}</span
                >` : A}
          </div>
          <div class="part-meta">
            ${ident ? b2`<span>${ident}</span>` : A}
            ${part.storage_location ? b2`<span class="loc"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${part.storage_location}</span>` : A}
          </div>
        </div>
        <ha-icon-button
          title=${t3("documents", L2)}
          class=${docsOpen ? "docs-open" : ""}
          @click=${() => this._docsFor = docsOpen ? null : part.id}
          ><ha-icon icon="mdi:paperclip"></ha-icon
        ></ha-icon-button>
        ${this.canWrite ? b2`
              ${this._restockFor === part.id ? b2`
                    <input
                      class="restock-input${this._restockInvalid ? " invalid" : ""}"
                      type="number"
                      .value=${this._restockQty}
                      placeholder="+1"
                      @input=${(e7) => this._restockQty = e7.target.value}
                      @keydown=${(e7) => {
      if (e7.key === "Enter") this._restock(part);
      if (e7.key === "Escape") this._restockFor = null;
    }}
                    />
                    <ha-icon-button title=${t3("save", L2)} @click=${() => this._restock(part)}
                      ><ha-icon icon="mdi:check"></ha-icon
                    ></ha-icon-button>
                  ` : b2`
                    <ha-icon-button
                      title=${t3("part_restock", L2)}
                      .disabled=${this._busy}
                      @click=${() => {
      this._restockFor = part.id;
      this._restockInvalid = false;
      this._restockQty = String(part.restock_quantity || 1);
    }}
                      ><ha-icon icon="mdi:plus-minus-variant"></ha-icon
                    ></ha-icon-button>
                  `}
              <ha-icon-button title=${t3("edit", L2)} .disabled=${this._busy} @click=${() => this._openEdit(part)}
                ><ha-icon icon="mdi:pencil"></ha-icon
              ></ha-icon-button>
              <ha-icon-button title=${t3("delete", L2)} .disabled=${this._busy} @click=${() => this._delete(part)}
                ><ha-icon icon="mdi:delete-outline"></ha-icon
              ></ha-icon-button>
            ` : A}
      </div>
      ${docsOpen ? b2`<div class="part-docs">
            <maintenance-task-documents
              .hass=${this.hass}
              .entryId=${this.entryId}
              .partId=${part.id}
              .canWrite=${this.canWrite}
            ></maintenance-task-documents>
          </div>` : A}
    `;
  }
  _field(label, key, opts = {}) {
    const f3 = this._editing;
    return b2`
      <label class="form-field">
        <span>${label}</span>
        <input
          type=${opts.type || "text"}
          .value=${String(f3[key] ?? "")}
          placeholder=${opts.placeholder || ""}
          @input=${(e7) => {
      this._editing[key] = e7.target.value;
      this.requestUpdate();
    }}
        />
      </label>
    `;
  }
  _renderForm() {
    const L2 = this._lang;
    const f3 = this._editing;
    return b2`
      <div class="part-form">
        <div class="form-grid">
          ${this._field(t3("part_name", L2), "name")}
          ${this._field(t3("part_vendor", L2), "vendor")}
          ${this._field("MPN", "mpn")}
          ${this._field("GTIN / EAN", "gtin", { placeholder: "4006381333931" })}
          ${this._field(t3("part_storage_location", L2), "storage_location")}
          ${this._field(t3("part_product_url", L2), "product_url", { placeholder: "https://\u2026" })}
          ${this._field(t3("part_unit", L2), "unit")}
          ${this._field(t3("part_cost", L2), "cost", { type: "number" })}
          ${this._field(t3("part_stock", L2), "stock", { type: "number" })}
          ${this._field(t3("part_reorder_threshold", L2), "reorder_threshold", { type: "number" })}
          ${this._field(t3("part_restock_quantity", L2), "restock_quantity", { type: "number" })}
          <label class="form-field checkbox">
            <input
              type="checkbox"
              .checked=${f3.auto_buy_task}
              @change=${(e7) => {
      this._editing = { ...f3, auto_buy_task: e7.target.checked };
    }}
            />
            <span>${t3("part_auto_buy", L2)}</span>
          </label>
        </div>
        <div class="form-actions">
          <ha-button appearance="plain" @click=${() => this._editing = null}>${t3("cancel", L2)}</ha-button>
          <ha-button .disabled=${this._busy || !f3.name.trim()} @click=${() => this._save()}
            >${t3("save", L2)}</ha-button
          >
        </div>
      </div>
    `;
  }
  /** Inventory value = Σ unit cost × tracked stock (#104). Parts without a
   *  price or without tracked stock contribute nothing; null = no part has
   *  both, so the chip stays hidden rather than showing a misleading 0. */
  _inventoryValue() {
    let sum = 0, any = false;
    for (const p3 of this.parts) {
      const cost = typeof p3.cost === "number" ? p3.cost : null;
      const stock = typeof p3.stock === "number" ? p3.stock : null;
      if (cost !== null && stock !== null) {
        sum += cost * stock;
        any = true;
      }
    }
    return any ? sum : null;
  }
  render() {
    const L2 = this._lang;
    if (!this.parts.length && !this.canWrite) return A;
    return b2`
      <div class="section-head">
        <h3>
          <ha-icon icon="mdi:package-variant"></ha-icon>
          ${t3("parts_section", L2)} (${this.parts.length})
          ${this._inventoryValue() !== null ? b2`<span class="inventory-value" title=${t3("parts_inventory_value", L2)}
                >${t3("parts_inventory_value", L2)}:
                ${this._inventoryValue().toFixed(2)}&nbsp;${this.currencySymbol}</span>` : A}
        </h3>
        ${this.canWrite && !this._editing ? b2`<ha-button appearance="plain" @click=${() => this._openAdd()}>
              <ha-icon icon="mdi:plus"></ha-icon> ${t3("part_add", L2)}
            </ha-button>` : A}
      </div>
      ${this._error ? b2`<div class="error">${this._error}</div>` : A}
      ${this._editing ? this._renderForm() : A}
      ${this.parts.map((part) => this._renderRow(part))}
    `;
  }
};
MaintenancePartsSection.styles = i`
    :host {
      display: block;
      margin: 12px 0;
    }
    .inventory-value {
      margin-left: 8px;
      font-size: 0.75em;
      font-weight: 400;
      color: var(--secondary-text-color);
      white-space: nowrap;
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
    .docs-open {
      color: var(--primary-color);
    }
    .part-docs {
      padding: 0 4px 8px 34px;
      border-bottom: 1px solid var(--divider-color);
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
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenancePartsSection.prototype, "hass", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenancePartsSection.prototype, "entryId", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenancePartsSection.prototype, "parts", 2);
__decorateClass([
  n4({ type: Boolean })
], MaintenancePartsSection.prototype, "canWrite", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenancePartsSection.prototype, "currencySymbol", 2);
__decorateClass([
  r5()
], MaintenancePartsSection.prototype, "_editing", 2);
__decorateClass([
  r5()
], MaintenancePartsSection.prototype, "_busy", 2);
__decorateClass([
  r5()
], MaintenancePartsSection.prototype, "_error", 2);
__decorateClass([
  r5()
], MaintenancePartsSection.prototype, "_restockFor", 2);
__decorateClass([
  r5()
], MaintenancePartsSection.prototype, "_restockQty", 2);
__decorateClass([
  r5()
], MaintenancePartsSection.prototype, "_restockInvalid", 2);
__decorateClass([
  r5()
], MaintenancePartsSection.prototype, "_docsFor", 2);
customElements.define("maintenance-parts-section", MaintenancePartsSection);

// components/task-detail-view.ts
init_lit();
init_decorators();

// renderers/task-detail.ts
init_lit();
init_url();
init_styles();

// renderers/sparkline.ts
init_lit();
init_styles();

// renderers/chart-utils.ts
function niceTicks(min, max, targetCount = 4) {
  if (!isFinite(min) || !isFinite(max)) return { ticks: [], niceMin: 0, niceMax: 1 };
  if (min === max) {
    const pad = Math.abs(min) * 0.1 || 1;
    min -= pad;
    max += pad;
  }
  const span = max - min;
  const step0 = Math.pow(10, Math.floor(Math.log10(span / Math.max(1, targetCount))));
  let step = step0;
  for (const m2 of [1, 2, 5, 10]) {
    step = step0 * m2;
    if (span / step <= targetCount + 0.5) break;
  }
  const niceMin = Math.floor(min / step) * step;
  const niceMax = Math.ceil(max / step) * step;
  const ticks = [];
  for (let v2 = niceMin; v2 <= niceMax + step * 1e-6; v2 += step) {
    ticks.push(Math.abs(v2) < step * 1e-9 ? 0 : v2);
  }
  return { ticks, niceMin, niceMax };
}
function fmtNum(v2) {
  const a3 = Math.abs(v2);
  if (a3 >= 1e6) return trimZero((v2 / 1e6).toFixed(a3 >= 1e7 ? 0 : 1)) + "M";
  if (a3 >= 1e4) return trimZero((v2 / 1e3).toFixed(0)) + "k";
  if (a3 >= 1e3) return trimZero((v2 / 1e3).toFixed(1)) + "k";
  if (a3 >= 100) return v2.toFixed(0);
  if (a3 >= 10) return trimZero(v2.toFixed(1));
  if (a3 >= 1) return trimZero(v2.toFixed(1));
  if (a3 === 0) return "0";
  return trimZero(v2.toFixed(2));
}
function trimZero(s4) {
  return s4.replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}
function fmtVal(v2, unit, lang) {
  const s4 = v2.toLocaleString(lang, { maximumFractionDigits: Math.abs(v2) >= 100 ? 0 : 1 });
  return unit ? `${s4} ${unit}` : s4;
}
function fmtDateTick(ts, lang, withYear) {
  const d3 = new Date(ts);
  const opts = withYear ? { month: "short", day: "numeric", year: "2-digit" } : { month: "short", day: "numeric" };
  return d3.toLocaleDateString(lang, opts);
}
function fmtDateTime(ts, lang) {
  return new Date(ts).toLocaleDateString(lang, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function needsYear(tsMin, tsMax) {
  return new Date(tsMin).getFullYear() !== new Date(tsMax).getFullYear();
}
function timeTicks(tsMin, tsMax, count) {
  if (count < 2 || tsMax <= tsMin) return [tsMin, tsMax];
  const out = [];
  for (let i6 = 0; i6 < count; i6++) out.push(tsMin + (tsMax - tsMin) * i6 / (count - 1));
  return out;
}

// components/trigger-chart.ts
init_lit();
init_decorators();
init_styles();
var H2 = 210;
var PAD_L = 46;
var PAD_R = 14;
var PAD_T = 12;
var LANE_H = 14;
var PAD_B = 20 + LANE_H;
var RANGES = [
  { days: 7, key: "chart_range_7d" },
  { days: 30, key: "chart_range_30d" },
  { days: 90, key: "chart_range_90d" },
  { days: 365, key: "chart_range_1y" }
];
var MaintenanceTriggerChart = class extends i4 {
  constructor() {
    super(...arguments);
    this.points = [];
    this.events = [];
    this.unit = "";
    this.lang = "en";
    this.thresholdAbove = null;
    this.thresholdBelow = null;
    this.targetValue = null;
    this.forceZero = false;
    this.projection = null;
    this.rangeDays = 30;
    this.showRange = true;
    this.busy = false;
    this.hideOutliers = false;
    this.showOutlierToggle = true;
    this._width = 0;
    this._hover = null;
    this._ro = null;
  }
  connectedCallback() {
    super.connectedCallback();
    this._ro = new ResizeObserver((entries) => {
      const w2 = Math.floor(entries[0]?.contentRect?.width || 0);
      if (w2 && Math.abs(w2 - this._width) > 2) this._width = w2;
    });
    this._ro.observe(this);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this._ro = null;
  }
  _emitRange(days) {
    if (days === this.rangeDays) return;
    this.dispatchEvent(new CustomEvent("range-change", { detail: { days }, bubbles: true, composed: true }));
  }
  _toggleOutliers() {
    this.dispatchEvent(new CustomEvent("outlier-toggle", {
      detail: { hide: !this.hideOutliers },
      bubbles: true,
      composed: true
    }));
  }
  render() {
    const W = this._width || 320;
    const pts = [...this.points].sort((a3, b3) => a3.ts - b3.ts);
    const L2 = this.lang;
    return b2`
      <div class="chart-wrap">
        ${this.showRange ? b2`<div class="range-chips" role="group">
              ${this.showOutlierToggle ? b2`<button
                    class="range-chip outlier-chip ${this.hideOutliers ? "active" : ""}"
                    ?disabled=${this.busy}
                    title=${t3("hide_outliers", L2)}
                    @click=${() => this._toggleOutliers()}
                  ><ha-icon icon="mdi:filter-variant"></ha-icon></button>` : A}
              ${RANGES.map(
      (r6) => b2`<button
                  class="range-chip ${this.rangeDays === r6.days ? "active" : ""}"
                  ?disabled=${this.busy}
                  @click=${() => this._emitRange(r6.days)}
                >${t3(r6.key, L2)}</button>`
    )}
            </div>` : A}
        ${pts.length < 2 ? b2`<div class="chart-empty">
              <ha-icon icon="mdi:chart-line"></ha-icon> ${t3("loading_chart", L2)}
            </div>` : this._renderSvg(W, pts)}
      </div>
    `;
  }
  _renderSvg(W, pts) {
    const L2 = this.lang;
    const plotW = W - PAD_L - PAD_R;
    const plotB = H2 - PAD_B;
    const plotH = plotB - PAD_T;
    let lo = Infinity;
    let hi = -Infinity;
    for (const p3 of pts) {
      lo = Math.min(lo, p3.min ?? p3.val);
      hi = Math.max(hi, p3.max ?? p3.val);
    }
    if (this.thresholdAbove != null) {
      lo = Math.min(lo, this.thresholdAbove);
      hi = Math.max(hi, this.thresholdAbove);
    }
    if (this.thresholdBelow != null) {
      lo = Math.min(lo, this.thresholdBelow);
      hi = Math.max(hi, this.thresholdBelow);
    }
    if (this.targetValue != null) {
      lo = Math.min(lo, this.targetValue);
      hi = Math.max(hi, this.targetValue);
    }
    if (this.forceZero) lo = Math.min(lo, 0);
    const pad = (hi - lo || 1) * 0.06;
    const loPadded = this.forceZero && lo >= 0 ? 0 : lo - pad;
    let { ticks, niceMin, niceMax } = niceTicks(loPadded, hi + pad, 4);
    if (this.forceZero && lo >= 0 && niceMin < 0) {
      niceMin = 0;
      ticks = ticks.filter((v2) => v2 >= 0);
    }
    const tsMin = pts[0].ts;
    const projEnd = this.projection && this.projection.length === 2 ? this.projection[1].ts : null;
    const tsMax = projEnd != null ? Math.max(pts[pts.length - 1].ts, projEnd) : pts[pts.length - 1].ts;
    const tsSpan = tsMax - tsMin || 1;
    const withYear = needsYear(tsMin, tsMax);
    const toX = (ts) => PAD_L + (ts - tsMin) / tsSpan * plotW;
    const toY = (v2) => PAD_T + (1 - (v2 - niceMin) / (niceMax - niceMin || 1)) * plotH;
    const linePts = pts.map((p3) => `${toX(p3.ts).toFixed(1)},${toY(p3.val).toFixed(1)}`).join(" ");
    const areaPath = `M${toX(pts[0].ts).toFixed(1)},${plotB} ` + pts.map((p3) => `L${toX(p3.ts).toFixed(1)},${toY(p3.val).toFixed(1)}`).join(" ") + ` L${toX(pts[pts.length - 1].ts).toFixed(1)},${plotB} Z`;
    let bandPath = "";
    const band = pts.filter((p3) => p3.min != null && p3.max != null);
    if (band.length >= 2) {
      const up = band.map((p3) => `${toX(p3.ts).toFixed(1)},${toY(p3.max).toFixed(1)}`);
      const dn = [...band].reverse().map((p3) => `${toX(p3.ts).toFixed(1)},${toY(p3.min).toFixed(1)}`);
      bandPath = `M${up[0]} ` + up.slice(1).map((x2) => `L${x2}`).join(" ") + ` L${dn.join(" L")} Z`;
    }
    const zones = [];
    if (this.thresholdBelow != null) {
      const zy = toY(this.thresholdBelow);
      zones.push({ y: zy, h: Math.max(0, plotB - zy), lineY: zy, label: `\u25BC ${fmtNum(this.thresholdBelow)}`, labelY: Math.min(plotB - 4, zy + 13) });
    }
    if (this.thresholdAbove != null) {
      const zy = toY(this.thresholdAbove);
      zones.push({ y: PAD_T, h: Math.max(0, zy - PAD_T), lineY: zy, label: `\u25B2 ${fmtNum(this.thresholdAbove)}`, labelY: Math.max(PAD_T + 11, zy - 5) });
    }
    const lastP = pts[pts.length - 1];
    const events = (this.events || []).filter((e7) => e7.ts >= tsMin && e7.ts <= tsMax);
    const xTicks = timeTicks(tsMin, tsMax, Math.max(2, Math.min(5, Math.floor(plotW / 110) + 1)));
    const hover = this._hover;
    return b2`
      <div class="svg-holder">
        <svg
          class="chart-svg"
          viewBox="0 0 ${W} ${H2}"
          width=${W}
          height=${H2}
          role="img"
          aria-label=${t3("chart_sparkline", L2)}
          @pointermove=${(e7) => this._onPointer(e7, pts, toX, toY, W)}
          @pointerdown=${(e7) => this._onPointer(e7, pts, toX, toY, W)}
          @pointerleave=${() => this._hover = null}
        >
          <defs>
            <clipPath id="plot"><rect x="${PAD_L}" y="${PAD_T}" width="${plotW}" height="${plotH}" /></clipPath>
            ${zones.length ? w`<clipPath id="danger">${zones.map((z2) => w`<rect x="${PAD_L}" y="${z2.y.toFixed(1)}" width="${plotW}" height="${z2.h.toFixed(1)}" />`)}</clipPath>` : A}
            <!-- Diagonal hatch so the danger zone reads without relying on the
                 red tint alone (dark-theme contrast + colour-blind support). -->
            <pattern id="dangerHatch" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)">
              <rect width="7" height="7" fill="var(--error-color, #f44336)" opacity="0.10" />
              <line x1="0" y1="0" x2="0" y2="7" stroke="var(--error-color, #f44336)" stroke-width="1.4" opacity="0.5" />
            </pattern>
          </defs>

          ${ticks.map((v2) => {
      const y3 = toY(v2);
      if (y3 < PAD_T - 1 || y3 > plotB + 1) return A;
      return w`
              <line x1="${PAD_L}" y1="${y3.toFixed(1)}" x2="${W - PAD_R}" y2="${y3.toFixed(1)}"
                stroke="var(--divider-color)" stroke-width="1" opacity="0.6" />
              <text x="${PAD_L - 7}" y="${(y3 + 3.5).toFixed(1)}" text-anchor="end" class="tick-label">${fmtNum(v2)}</text>`;
    })}

          ${zones.map(
      (z2) => w`<rect x="${PAD_L}" y="${z2.y.toFixed(1)}" width="${plotW}" height="${z2.h.toFixed(1)}"
              fill="url(#dangerHatch)" />`
    )}

          ${bandPath ? w`<path d="${bandPath}" fill="var(--primary-color)" opacity="0.08" clip-path="url(#plot)" />` : A}
          <path d="${areaPath}" fill="var(--primary-color)" opacity="0.10" clip-path="url(#plot)" />
          <polyline points="${linePts}" fill="none" stroke="var(--primary-color)" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round" clip-path="url(#plot)" />
          ${zones.length ? w`<polyline points="${linePts}" fill="none" stroke="var(--error-color, #f44336)" stroke-width="2"
                stroke-linejoin="round" stroke-linecap="round" clip-path="url(#danger)" />` : A}

          ${zones.map(
      (z2) => w`
              <line x1="${PAD_L}" y1="${z2.lineY.toFixed(1)}" x2="${W - PAD_R}" y2="${z2.lineY.toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${W - PAD_R - 4}" y="${z2.labelY.toFixed(1)}" text-anchor="end" class="zone-label">${z2.label}</text>`
    )}

          ${this.targetValue != null ? w`<line x1="${PAD_L}" y1="${toY(this.targetValue).toFixed(1)}" x2="${W - PAD_R}" y2="${toY(this.targetValue).toFixed(1)}"
                stroke="var(--error-color, #f44336)" stroke-width="1.5" stroke-dasharray="6,4" />
              <text x="${W - PAD_R - 4}" y="${(toY(this.targetValue) - 5).toFixed(1)}" text-anchor="end" class="zone-label">◆ ${fmtNum(this.targetValue)} ${this.unit}</text>` : A}

          ${this.projection && this.projection.length === 2 ? w`<line x1="${toX(this.projection[0].ts).toFixed(1)}" y1="${toY(this.projection[0].val).toFixed(1)}"
                x2="${Math.min(toX(this.projection[1].ts), W - PAD_R).toFixed(1)}" y2="${toY(Math.max(niceMin, Math.min(niceMax, this.projection[1].val))).toFixed(1)}"
                stroke="var(--warning-color, #ff9800)" stroke-width="1.5" stroke-dasharray="4,3" opacity="0.8" />` : A}

          ${xTicks.map((ts, i6) => {
      const x2 = toX(ts);
      const anchor = i6 === 0 ? "start" : i6 === xTicks.length - 1 ? "end" : "middle";
      return w`<text x="${x2.toFixed(1)}" y="${H2 - 5}" text-anchor="${anchor}" class="tick-label">${fmtDateTick(ts, L2, withYear)}</text>`;
    })}

          <line x1="${PAD_L}" y1="${plotB}" x2="${W - PAD_R}" y2="${plotB}" stroke="var(--divider-color)" stroke-width="1" />

          ${events.map((e7) => {
      const x2 = toX(e7.ts);
      const color = e7.type === "completed" ? "var(--success-color, #4caf50)" : e7.type === "skipped" ? "var(--warning-color, #ff9800)" : "var(--info-color, #2196f3)";
      return w`
              <line x1="${x2.toFixed(1)}" y1="${PAD_T}" x2="${x2.toFixed(1)}" y2="${plotB}" stroke="${color}" stroke-width="1" opacity="0.14" />
              <rect x="${(x2 - 1.5).toFixed(1)}" y="${plotB + 3}" width="3" height="${LANE_H - 6}" rx="1.5" fill="${color}">
                <title>${fmtDateTime(e7.ts, L2)}</title>
              </rect>`;
    })}

          ${hover ? w`
                <line x1="${hover.x.toFixed(1)}" y1="${PAD_T}" x2="${hover.x.toFixed(1)}" y2="${plotB}"
                  stroke="var(--secondary-text-color)" stroke-width="1" stroke-dasharray="3,3" opacity="0.7" />
                <circle cx="${hover.x.toFixed(1)}" cy="${hover.y.toFixed(1)}" r="4.5" fill="var(--primary-color)"
                  stroke="var(--card-background-color, #fff)" stroke-width="2" />` : w`<circle cx="${toX(lastP.ts).toFixed(1)}" cy="${toY(lastP.val).toFixed(1)}" r="4" fill="var(--primary-color)"
                stroke="var(--card-background-color, #fff)" stroke-width="1.5" />`}
        </svg>
        ${hover ? b2`<div
              class="hover-chip"
              style="left:${Math.min(Math.max(hover.x, 70), W - 70)}px"
            >
              <div class="hover-date">${fmtDateTime(hover.p.ts, L2)}</div>
              <div class="hover-val">
                ${fmtVal(hover.p.val, this.unit, L2)}
                ${hover.p.min != null && hover.p.max != null ? b2`<span class="hover-range">(${fmtNum(hover.p.min)}–${fmtNum(hover.p.max)})</span>` : A}
              </div>
            </div>` : A}
      </div>
    `;
  }
  _onPointer(e7, pts, toX, toY, W) {
    const svgEl = e7.currentTarget;
    const rect = svgEl.getBoundingClientRect();
    const px = (e7.clientX - rect.left) / rect.width * W;
    if (px < PAD_L - 8 || px > W - PAD_R + 8) {
      this._hover = null;
      return;
    }
    let best = pts[0];
    let bestD = Infinity;
    for (const p3 of pts) {
      const d3 = Math.abs(toX(p3.ts) - px);
      if (d3 < bestD) {
        bestD = d3;
        best = p3;
      }
    }
    this._hover = { x: toX(best.ts), y: toY(best.val), p: best };
  }
};
MaintenanceTriggerChart.styles = i`
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
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceTriggerChart.prototype, "points", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceTriggerChart.prototype, "events", 2);
__decorateClass([
  n4()
], MaintenanceTriggerChart.prototype, "unit", 2);
__decorateClass([
  n4()
], MaintenanceTriggerChart.prototype, "lang", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceTriggerChart.prototype, "thresholdAbove", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceTriggerChart.prototype, "thresholdBelow", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceTriggerChart.prototype, "targetValue", 2);
__decorateClass([
  n4({ type: Boolean })
], MaintenanceTriggerChart.prototype, "forceZero", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceTriggerChart.prototype, "projection", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceTriggerChart.prototype, "rangeDays", 2);
__decorateClass([
  n4({ type: Boolean })
], MaintenanceTriggerChart.prototype, "showRange", 2);
__decorateClass([
  n4({ type: Boolean })
], MaintenanceTriggerChart.prototype, "busy", 2);
__decorateClass([
  n4({ type: Boolean })
], MaintenanceTriggerChart.prototype, "hideOutliers", 2);
__decorateClass([
  n4({ type: Boolean })
], MaintenanceTriggerChart.prototype, "showOutlierToggle", 2);
__decorateClass([
  r5()
], MaintenanceTriggerChart.prototype, "_width", 2);
__decorateClass([
  r5()
], MaintenanceTriggerChart.prototype, "_hover", 2);
if (!customElements.get("maintenance-trigger-chart")) {
  customElements.define("maintenance-trigger-chart", MaintenanceTriggerChart);
}

// renderers/sparkline.ts
function filterOutliers(points) {
  if (points.length < 4) return points;
  const vals = points.map((p3) => p3.val).sort((a3, b3) => a3 - b3);
  const q = (frac) => {
    const idx = (vals.length - 1) * frac;
    const lo = Math.floor(idx), hi = Math.ceil(idx);
    return vals[lo] + (vals[hi] - vals[lo]) * (idx - lo);
  };
  const q1 = q(0.25), q3 = q(0.75), iqr = q3 - q1;
  if (iqr === 0) return points;
  const lower = q1 - 1.5 * iqr, upper = q3 + 1.5 * iqr;
  const kept = points.filter((p3) => p3.val >= lower && p3.val <= upper);
  return kept.length >= 2 ? kept : points;
}
function renderTriggerSection(task, ctx) {
  const tc = task.trigger_config;
  if (!tc) return A;
  const L2 = ctx.lang;
  const info = task.trigger_entity_info;
  const infos = task.trigger_entity_infos;
  const friendlyName = info?.friendly_name || tc.entity_id || "\u2014";
  const entityId = tc.entity_id || "";
  const entityIds = tc.entity_ids || (entityId ? [entityId] : []);
  const unit = info?.unit_of_measurement || "";
  const currentVal = task.trigger_current_value;
  const triggerType = tc.type || "threshold";
  const isMultiEntity = entityIds.length > 1;
  const spec = progressSpec(task, unit, ctx);
  return b2`
    <h3>${t3("trigger", L2)}</h3>
    <div class="trigger-card">
      <div class="trigger-header">
        <ha-icon icon="mdi:pulse" style="color: var(--primary-color); --mdc-icon-size: 20px;"></ha-icon>
        <div>
          ${isMultiEntity ? b2`
            <div class="trigger-entity-name">${entityIds.length} ${t3("entities", L2)} (${tc.entity_logic || "any"})</div>
            <div class="trigger-entity-id">${entityIds.map((eid, i6) => b2`${i6 > 0 ? ", " : ""}<span class="entity-link" @click=${(ev) => fireMoreInfo(ev, eid)}>${eid}</span>`)}${tc.attribute ? ` \u2192 ${tc.attribute}` : ""}</div>
          ` : b2`
            <div class="trigger-entity-name">${friendlyName}</div>
            <div class="trigger-entity-id">${entityId ? b2`<span class="entity-link" @click=${(ev) => fireMoreInfo(ev, entityId)}>${entityId}</span>` : ""}${tc.attribute ? ` \u2192 ${tc.attribute}` : ""}</div>
          `}
        </div>
        <span class="status-badge ${task.trigger_active ? "triggered" : "ok"}" style="margin-left: auto;">
          ${task.trigger_active ? t3("triggered", L2) : t3("ok", L2)}
        </span>
      </div>

      ${spec ? renderProgress(spec, L2) : currentVal !== null && currentVal !== void 0 ? b2`
              <div class="trigger-value-row">
                <span class="trigger-current ${task.trigger_active ? "active" : ""}">${typeof currentVal === "number" ? fmtVal(currentVal, "", L2) : currentVal}</span>
                ${unit ? b2`<span class="trigger-unit">${unit}</span>` : A}
              </div>
            ` : A}

      <div class="trigger-limits">
        ${triggerType === "threshold" ? b2`
          ${tc.trigger_above != null ? b2`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t3("threshold_above", L2)}: ${tc.trigger_above} ${unit}</span>` : A}
          ${tc.trigger_below != null ? b2`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t3("threshold_below", L2)}: ${tc.trigger_below} ${unit}</span>` : A}
          ${tc.trigger_equals != null ? b2`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> = ${tc.trigger_equals} ${unit}</span>` : A}
          ${tc.trigger_not_equals != null ? b2`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ≠ ${tc.trigger_not_equals} ${unit}</span>` : A}
          ${tc.trigger_for_minutes ? b2`<span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${t3("for_minutes", L2)}: ${tc.trigger_for_minutes}</span>` : A}
        ` : A}
        ${triggerType === "state_change" ? b2`
          ${tc.trigger_target_changes != null ? b2`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t3("target_changes", L2)}: ${tc.trigger_target_changes}</span>` : A}
        ` : A}
        ${triggerType === "runtime" ? b2`
          ${tc.trigger_runtime_hours != null ? b2`<span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t3("runtime_hours", L2)}: ${tc.trigger_runtime_hours}h</span>` : A}
        ` : A}
        ${triggerType === "compound" ? b2`
          <span class="trigger-limit-item"><span class="dot warn" aria-hidden="true"></span> ${t3("compound_logic", L2)}: ${tc.compound_logic || tc.operator || "AND"}</span>
          ${(tc.conditions || []).map((cond, i6) => b2`
            <span class="trigger-limit-item"><span class="dot range" aria-hidden="true"></span> ${i6 + 1}. ${t3(cond.type || "unknown", L2)}: ${cond.entity_id ? b2`<span class="entity-link" @click=${(ev) => fireMoreInfo(ev, cond.entity_id)}>${cond.entity_id}</span>` : ""}</span>
          `)}
        ` : A}
      </div>

      ${infos && infos.length > 1 ? b2`
        <div class="trigger-entity-list">
          ${infos.map((info2) => b2`
            <span class="trigger-entity-id">${info2.friendly_name} (<span class="entity-link" @click=${(ev) => fireMoreInfo(ev, info2.entity_id)}>${info2.entity_id}</span>)</span>
          `)}
        </div>
      ` : A}

      ${renderChart(task, unit, ctx)}
    </div>
  `;
}
function progressSpec(task, unit, ctx) {
  const tc = task.trigger_config;
  const cur = task.trigger_current_value;
  if (!tc || cur == null) return null;
  switch (tc.type || "threshold") {
    case "counter": {
      const target = tc.trigger_target_value;
      if (target == null || target <= 0) return null;
      if (!tc.trigger_delta_mode) {
        return { progress: Math.max(0, cur), target, unit, meter: null };
      }
      const base = counterBaseline(task, rawStatsPoints(task, ctx));
      return { progress: Math.max(0, cur - (base?.value ?? cur)), target, unit, meter: cur };
    }
    case "state_change": {
      const target = tc.trigger_target_changes;
      if (target == null || target <= 0) return null;
      return { progress: Math.max(0, cur), target, unit: "", meter: null };
    }
    case "runtime": {
      const target = tc.trigger_runtime_hours;
      if (target == null || target <= 0) return null;
      return { progress: Math.max(0, cur), target, unit: "h", meter: null };
    }
  }
  return null;
}
function counterBaseline(task, rawPoints) {
  if (task.trigger_baseline_value != null) {
    return { value: task.trigger_baseline_value, ts: lastServiceTs(task) };
  }
  if (!rawPoints.length) return null;
  const ts = lastServiceTs(task);
  if (ts == null) return { value: rawPoints[0].val, ts: null };
  let best = rawPoints[0];
  let bestD = Math.abs(rawPoints[0].ts - ts);
  for (const p3 of rawPoints) {
    const d3 = Math.abs(p3.ts - ts);
    if (d3 < bestD) {
      best = p3;
      bestD = d3;
    }
  }
  return { value: best.val, ts };
}
function lastServiceTs(task) {
  const e7 = [...task.history].filter((h3) => h3.type === "completed" || h3.type === "reset").sort((a3, b3) => new Date(b3.timestamp).getTime() - new Date(a3.timestamp).getTime())[0];
  return e7 ? new Date(e7.timestamp).getTime() : null;
}
function renderProgress(spec, L2) {
  const pct = Math.min(999, Math.round(spec.progress / spec.target * 100));
  const level = pct >= 100 ? "over" : pct >= 75 ? "near" : "ok";
  return b2`
    <div class="counter-progress">
      <div class="counter-progress-nums">
        <span class="counter-progress-main">${fmtVal(spec.progress, "", L2)}<span class="counter-progress-target"> / ${fmtVal(spec.target, spec.unit, L2)}</span></span>
        <span class="counter-progress-pct ${level}">${pct} %</span>
      </div>
      <div class="counter-progress-bar" role="progressbar" aria-valuenow=${pct} aria-valuemin="0" aria-valuemax="100">
        <div class="counter-progress-fill ${level}" style="width:${Math.min(100, pct)}%"></div>
      </div>
      <div class="counter-progress-caption">
        ${t3("chart_since_service", L2)}${spec.meter != null ? b2` · ${t3("current", L2)}: ${fmtVal(spec.meter, spec.unit, L2)}` : A}
      </div>
    </div>
  `;
}
function rawStatsPoints(task, ctx) {
  const tc = task.trigger_config;
  if (!tc) return [];
  const triggerType = tc.type || "threshold";
  const entityId = tc.entity_id || "";
  const statsPoints = triggerType === "runtime" ? [] : ctx.detailStatsData.get(entityId) || [];
  const isCounter = ctx.isCounterEntity(tc);
  const points = [];
  if (statsPoints.length >= 2) {
    for (const sp of statsPoints) {
      const pt = { ts: sp.ts, val: sp.val };
      if (!isCounter && sp.min != null && sp.max != null) {
        pt.min = sp.min;
        pt.max = sp.max;
      }
      points.push(pt);
    }
  } else {
    for (const h3 of task.history) {
      if (h3.trigger_value != null) {
        points.push({ ts: new Date(h3.timestamp).getTime(), val: h3.trigger_value });
      }
    }
  }
  if (task.trigger_current_value != null) {
    points.push({ ts: Date.now(), val: task.trigger_current_value });
  }
  points.sort((a3, b3) => a3.ts - b3.ts);
  return points;
}
function renderChart(task, unit, ctx) {
  const tc = task.trigger_config;
  if (!tc) return A;
  const triggerType = tc.type || "threshold";
  const entityId = tc.entity_id || "";
  let points = rawStatsPoints(task, ctx);
  if (triggerType === "runtime" && tc.trigger_runtime_hours && task.trigger_current_value != null) {
    const cycleStart = lastServiceTs(task) ?? points[0]?.ts ?? Date.now() - 864e5;
    points = [
      { ts: cycleStart, val: 0 },
      { ts: Date.now(), val: Math.max(0, task.trigger_current_value) }
    ];
  }
  if (ctx.hideOutliers) points = filterOutliers(points);
  const loading = points.length < 2 && !!entityId && ctx.hasStatsService && !ctx.detailStatsData.has(entityId);
  if (points.length < 2 && !loading) return A;
  const statsFetchedEmpty = !!entityId && ctx.detailStatsData.has(entityId) && (ctx.detailStatsData.get(entityId)?.length ?? 0) < 2;
  const cutoff = Date.now() - ctx.rangeDays * 864e5;
  const inRange = points.filter((p3) => p3.ts >= cutoff);
  if (inRange.length >= 2) points = inRange;
  let targetValue = null;
  let forceZero = false;
  if (triggerType === "counter" && tc.trigger_target_value != null && points.length) {
    if (tc.trigger_delta_mode) {
      const base = counterBaseline(task, points);
      if (base) {
        if (base.ts != null) {
          const kept = points.filter((p3) => p3.ts >= base.ts);
          if (kept.length >= 2) points = kept;
        }
        points = points.map((p3) => ({ ...p3, val: Math.max(0, p3.val - base.value) }));
      }
    }
    targetValue = tc.trigger_target_value;
    forceZero = true;
  } else if (triggerType === "state_change" && tc.trigger_target_changes) {
    targetValue = tc.trigger_target_changes;
    forceZero = true;
  } else if (triggerType === "runtime" && tc.trigger_runtime_hours) {
    targetValue = tc.trigger_runtime_hours;
    forceZero = true;
  }
  let projection = null;
  if (targetValue == null && task.degradation_rate != null && (task.degradation_trend !== "stable" || task.days_until_threshold != null) && task.degradation_trend !== "insufficient_data" && points.length >= 2) {
    const lp = points[points.length - 1];
    projection = [lp, { ts: lp.ts + 30 * 864e5, val: lp.val + task.degradation_rate * 30 }];
  }
  const events = task.history.filter((h3) => ["completed", "skipped", "reset"].includes(h3.type)).map((h3) => ({ ts: new Date(h3.timestamp).getTime(), type: h3.type }));
  return b2`
    <maintenance-trigger-chart
      .points=${loading ? [] : points}
      .events=${events}
      .unit=${unit}
      .lang=${ctx.lang}
      .thresholdAbove=${triggerType === "threshold" ? tc.trigger_above ?? null : null}
      .thresholdBelow=${triggerType === "threshold" ? tc.trigger_below ?? null : null}
      .targetValue=${targetValue}
      .forceZero=${forceZero}
      .projection=${projection}
      .rangeDays=${ctx.rangeDays}
      .hideOutliers=${ctx.hideOutliers}
      .busy=${loading}
      @range-change=${(e7) => ctx.setRangeDays(e7.detail.days)}
      @outlier-toggle=${(e7) => ctx.setHideOutliers(e7.detail.hide)}
    ></maintenance-trigger-chart>
    ${statsFetchedEmpty && !loading ? b2`<div class="chart-note">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          ${t3("chart_no_stats", ctx.lang)}
        </div>` : A}
  `;
}

// renderers/task-detail.ts
init_prediction();
init_weibull();
init_recommendation();
init_seasonal();

// renderers/charts.ts
init_lit();
init_styles();
var COST_CHART_H = 200;
var PAD_T2 = 10;
var PAD_B2 = 22;
function renderCostDurationCard(task, lang, toggle, setToggle) {
  const completedEntries = task.history.filter((h3) => h3.type === "completed" && (h3.cost != null || h3.duration != null));
  if (completedEntries.length < 2) return A;
  const anyCost = completedEntries.some((h3) => (h3.cost ?? 0) > 0);
  const anyDuration = completedEntries.some((h3) => (h3.duration ?? 0) > 0);
  if (!anyCost && !anyDuration) return A;
  return b2`
    <div class="cost-duration-card">
      <div class="card-header">
        <h3>${t3("cost_duration_chart", lang)}</h3>
        <div class="toggle-buttons">
          ${anyCost ? b2`<button
            class="toggle-btn ${toggle === "cost" ? "active" : ""}"
            @click=${() => setToggle("cost")}>
            ${t3("cost", lang)}
          </button>` : A}
          ${anyCost && anyDuration ? b2`<button
            class="toggle-btn ${toggle === "both" ? "active" : ""}"
            @click=${() => setToggle("both")}>
            ${t3("both", lang)}
          </button>` : A}
          ${anyDuration ? b2`<button
            class="toggle-btn ${toggle === "duration" ? "active" : ""}"
            @click=${() => setToggle("duration")}>
            ${t3("duration", lang)}
          </button>` : A}
        </div>
      </div>
      ${renderHistoryChart(task, lang, toggle)}
    </div>
  `;
}
function renderHistoryChart(task, lang, toggle) {
  const entries = task.history.filter((h3) => h3.type === "completed" && (h3.cost != null || h3.duration != null)).map((h3) => ({ ts: new Date(h3.timestamp).getTime(), cost: h3.cost ?? 0, duration: h3.duration ?? 0 })).sort((a3, b3) => a3.ts - b3.ts);
  if (entries.length < 2) return A;
  const dataCost = entries.some((e7) => e7.cost > 0);
  const dataDuration = entries.some((e7) => e7.duration > 0);
  if (!dataCost && !dataDuration) return A;
  const hasCost = toggle !== "duration" && dataCost;
  const hasDuration = toggle !== "cost" && dataDuration;
  const showCost = hasCost || !hasDuration && dataCost;
  const showDuration = hasDuration || !hasCost && dataDuration;
  const W = 640;
  const H3 = COST_CHART_H;
  const PAD_L2 = showCost ? 44 : 12;
  const PAD_R2 = showDuration ? 44 : 12;
  const plotW = W - PAD_L2 - PAD_R2;
  const plotB = H3 - PAD_B2;
  const plotH = plotB - PAD_T2;
  const tsMin = entries[0].ts;
  const tsMax = entries[entries.length - 1].ts;
  const tsPad = (tsMax - tsMin || 864e5) * 0.05;
  const t0 = tsMin - tsPad;
  const t1 = tsMax + tsPad;
  const withYear = needsYear(tsMin, tsMax);
  const toX = (ts) => PAD_L2 + (ts - t0) / (t1 - t0) * plotW;
  const costAxis = niceTicks(0, Math.max(...entries.map((e7) => e7.cost)) || 1, 3);
  const durAxis = niceTicks(0, Math.max(...entries.map((e7) => e7.duration)) || 1, 3);
  const costY = (v2) => PAD_T2 + (1 - v2 / (costAxis.niceMax || 1)) * plotH;
  const durY = (v2) => PAD_T2 + (1 - v2 / (durAxis.niceMax || 1)) * plotH;
  const minGap = entries.length > 1 ? Math.min(...entries.slice(1).map((e7, i6) => toX(e7.ts) - toX(entries[i6].ts))) : plotW;
  const barW = Math.max(6, Math.min(22, minGap * 0.55));
  const xTicks = timeTicks(tsMin, tsMax, Math.max(2, Math.min(4, entries.length)));
  return b2`
    <div class="sparkline-container">
      <svg class="history-chart" viewBox="0 0 ${W} ${H3}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${t3("chart_history", lang)}">
        ${showCost ? costAxis.ticks.map((v2) => {
    const y3 = costY(v2);
    if (y3 < PAD_T2 - 1 || y3 > plotB + 1) return A;
    return w`
            <line x1="${PAD_L2}" y1="${y3.toFixed(1)}" x2="${W - PAD_R2}" y2="${y3.toFixed(1)}" stroke="var(--divider-color)" stroke-width="1" opacity="0.55" />
            <text x="${PAD_L2 - 6}" y="${(y3 + 3.5).toFixed(1)}" text-anchor="end" fill="var(--primary-color)" font-size="10.5">${fmtNum(v2)}€</text>`;
  }) : A}
        ${showDuration ? durAxis.ticks.map((v2) => {
    const y3 = durY(v2);
    if (y3 < PAD_T2 - 1 || y3 > plotB + 1) return A;
    return w`<text x="${W - PAD_R2 + 6}" y="${(y3 + 3.5).toFixed(1)}" text-anchor="start" fill="var(--accent-color, #ff9800)" font-size="10.5">${fmtNum(v2)}m</text>`;
  }) : A}

        ${showCost ? entries.filter((e7) => e7.cost > 0).map((e7) => w`
          <rect x="${(toX(e7.ts) - barW / 2).toFixed(1)}" y="${costY(e7.cost).toFixed(1)}" width="${barW.toFixed(1)}" height="${(plotB - costY(e7.cost)).toFixed(1)}"
            fill="var(--primary-color)" opacity="0.6" rx="2">
            <title>${fmtDateTick(e7.ts, lang, true)}: ${e7.cost.toLocaleString(lang)}€${e7.duration ? ` \xB7 ${e7.duration}m` : ""}</title>
          </rect>
        `) : A}
        ${showDuration ? w`
          <polyline points="${entries.map((e7) => `${toX(e7.ts).toFixed(1)},${durY(e7.duration).toFixed(1)}`).join(" ")}"
            fill="none" stroke="var(--accent-color, #ff9800)" stroke-width="2" stroke-linejoin="round" />
          ${entries.map((e7) => w`
            <circle cx="${toX(e7.ts).toFixed(1)}" cy="${durY(e7.duration).toFixed(1)}" r="3.5" fill="var(--accent-color, #ff9800)">
              <title>${fmtDateTick(e7.ts, lang, true)}: ${e7.duration}m${e7.cost ? ` \xB7 ${e7.cost.toLocaleString(lang)}\u20AC` : ""}</title>
            </circle>
          `)}
        ` : A}

        <line x1="${PAD_L2}" y1="${plotB}" x2="${W - PAD_R2}" y2="${plotB}" stroke="var(--divider-color)" stroke-width="1" />
        ${xTicks.map((ts, i6) => {
    const anchor = i6 === 0 ? "start" : i6 === xTicks.length - 1 ? "end" : "middle";
    return w`<text x="${toX(ts).toFixed(1)}" y="${H3 - 6}" text-anchor="${anchor}" fill="var(--secondary-text-color)" font-size="10">${fmtDateTick(ts, lang, withYear)}</text>`;
  })}
      </svg>
    </div>
    <div class="chart-legend">
      ${showCost ? b2`<span class="legend-item"><span class="legend-swatch" style="background:var(--primary-color);opacity:0.6"></span>${t3("cost", lang)}</span>` : A}
      ${showDuration ? b2`<span class="legend-item"><span class="legend-swatch" style="background:var(--accent-color, #ff9800)"></span>${t3("duration", lang)}</span>` : A}
    </div>
  `;
}

// renderers/progress.ts
init_lit();
init_styles();
init_interval();
function renderDaysProgress(task, lang) {
  const L2 = lang;
  if (task.days_until_due == null || !task.interval_days || task.interval_days <= 0) return A;
  const { pct, overflow: daysOverflow } = daysProgress(
    task.interval_days,
    task.days_until_due,
    task.interval_unit
  );
  let barColor = "var(--success-color, #4caf50)";
  if (task.status === "overdue") barColor = "var(--error-color, #f44336)";
  else if (task.status === "due_soon") barColor = "var(--warning-color, #ff9800)";
  return b2`
    <div class="days-progress">
      <div class="days-progress-labels">
        <span>${task.last_performed ? `${t3("last_performed", L2)}: ${formatDate(task.last_performed, L2)}` : ""}</span>
        <span>${task.next_due ? `${t3("next_due", L2)}: ${formatDate(task.next_due, L2)}` : ""}</span>
      </div>
      <div class="days-progress-bar" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100" aria-label="${t3("days_progress", L2)}">
        <div class="days-progress-fill${daysOverflow ? " overflow" : ""}" style="width:${pct}%;background:${barColor}"></div>
      </div>
      <div class="days-progress-text">${formatDueDays(task.days_until_due, L2)}</div>
    </div>
  `;
}

// renderers/history.ts
init_lit();
init_styles();

// components/history-photo.ts
init_lit();
init_decorators();
var MaintenanceHistoryPhoto = class extends i4 {
  constructor() {
    super(...arguments);
    this.docId = "";
    this._url = "";
    this._failed = false;
    this._signedFor = "";
  }
  updated() {
    if (this.hass && this.docId && this._signedFor !== this.docId) {
      this._signedFor = this.docId;
      this._url = "";
      this._failed = false;
      void this._sign();
    }
  }
  async _sign() {
    try {
      this._url = await signDocumentPath(this.hass, this.docId);
    } catch {
      this._failed = true;
    }
  }
  render() {
    if (this._failed || !this.docId) return A;
    if (!this._url) return b2`<div class="ph"></div>`;
    return b2`
      <a href=${this._url} target="_blank" rel="noopener" class="wrap">
        <img src=${this._url} alt="" loading="lazy"
          @error=${() => this._failed = true} />
      </a>`;
  }
};
MaintenanceHistoryPhoto.styles = i`
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
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceHistoryPhoto.prototype, "hass", 2);
__decorateClass([
  n4()
], MaintenanceHistoryPhoto.prototype, "docId", 2);
__decorateClass([
  r5()
], MaintenanceHistoryPhoto.prototype, "_url", 2);
__decorateClass([
  r5()
], MaintenanceHistoryPhoto.prototype, "_failed", 2);
if (!customElements.get("maintenance-history-photo")) {
  customElements.define("maintenance-history-photo", MaintenanceHistoryPhoto);
}

// renderers/history.ts
var _FILTER_TYPES = ["completed", "skipped", "missed", "reset", "triggered", "trigger_replaced", "trigger_removed"];
function renderHistoryFilters(task, ctx) {
  const L2 = ctx.lang;
  return b2`
    <div class="history-filters-new">
      <div class="filter-chips">
        ${_FILTER_TYPES.map((type) => {
    const count = task.history.filter((h3) => h3.type === type).length;
    if (count === 0) return A;
    return b2`
            <span class="filter-chip ${ctx.filter === type ? "active" : ""}"
              @click=${() => ctx.setFilter(ctx.filter === type ? null : type)}>
              ${t3(type, L2)} (${count})
            </span>
          `;
  })}
        ${ctx.filter ? b2`<span class="filter-chip clear" @click=${() => ctx.setFilter(null)}>${t3("show_all", L2)}</span>` : A}
      </div>
      <div class="filter-controls">
        <input type="text" class="search-input" placeholder="${t3("search_notes", L2)}..." .value=${ctx.search} @input=${(e7) => ctx.setSearch(e7.target.value)} />
      </div>
    </div>
  `;
}
function renderHistoryList(task, ctx) {
  const L2 = ctx.lang;
  let filtered = ctx.filter ? task.history.filter((h3) => h3.type === ctx.filter) : task.history;
  if (ctx.search) {
    const search = ctx.search.toLowerCase();
    filtered = filtered.filter((h3) => h3.notes?.toLowerCase().includes(search));
  }
  if (filtered.length === 0) {
    return b2`<p class="empty">${t3("no_history", L2)}</p>`;
  }
  return b2`
    <div class="history-timeline">
      ${[...filtered].reverse().map((entry) => renderHistoryEntry(entry, ctx))}
    </div>
  `;
}
function renderHistoryEntry(entry, ctx) {
  const L2 = ctx.lang;
  const editable = ["completed", "reset", "skipped"].includes(entry.type);
  return b2`
    <div class="history-entry">
      <div class="history-icon ${entry.type}">
        <ha-icon .icon=${STATUS_ICONS[entry.type] || "mdi:circle"}></ha-icon>
      </div>
      <div class="history-content">
        <div class="history-row">
          <strong>${t3(entry.type, L2)}</strong>
          ${entry.auto ? b2`<span class="history-auto-badge">${t3("history_auto", L2)}</span>` : A}
          ${editable ? b2`<button class="history-edit-btn"
                     title=${t3("history_edit_button", L2) || "Edit entry"}
                     @click=${() => ctx.openEdit(entry)}>
                <ha-icon icon="mdi:pencil"></ha-icon>
              </button>` : A}
        </div>
        <div class="history-date">${formatDateTime(entry.timestamp, L2)}</div>
        ${entry.notes ? b2`<div>${entry.notes}</div>` : A}
        ${entry.photo_doc_id ? b2`<maintenance-history-photo .hass=${ctx.hass} .docId=${entry.photo_doc_id}></maintenance-history-photo>` : A}
        <div class="history-details">
          ${entry.cost != null ? b2`<span>${t3("cost", L2)}: ${entry.cost.toFixed(2)} ${ctx.currencySymbol}</span>` : A}
          ${entry.duration != null ? b2`<span>${t3("duration", L2)}: ${entry.duration} min</span>` : A}
          ${entry.trigger_value != null ? b2`<span>${t3("trigger_val", L2)}: ${entry.trigger_value}</span>` : A}
          ${entry.reading_value != null ? b2`<span>${t3("reading_label", L2)}: ${entry.reading_value}${ctx.readingUnit ? ` ${ctx.readingUnit}` : ""}${(() => {
    const d3 = ctx.readingDelta?.(entry);
    return d3 == null ? "" : ` (${d3 >= 0 ? "+" : ""}${Number(d3.toFixed(3))})`;
  })()}</span>` : A}
        </div>
      </div>
    </div>
  `;
}

// renderers/task-detail.ts
function renderUserBadge(task, getUserName) {
  if (!task.responsible_user_id) return A;
  const userName = getUserName(task.responsible_user_id);
  if (!userName) return A;
  return b2`
    <span class="user-badge">
      <ha-icon icon="mdi:account"></ha-icon>
      ${userName}
    </span>
  `;
}
function renderTaskHeader(task, ctx) {
  const L2 = ctx.lang;
  const isOperator = ctx.isOperator;
  const statusClass = task.archived ? "archived" : task.is_done ? "done" : task.status === "due_soon" ? "warning" : task.status || "ok";
  const statusText = task.archived ? t3("archived", L2) : task.is_done ? t3("completed", L2) : t3(task.status || "ok", L2);
  return b2`
    <div class="task-header">
      <div class="task-header-title">
        <span class="task-name-breadcrumb" @click=${() => ctx.showTaskView()}>${task.name}</span>
        <span class="breadcrumb-separator">·</span>
        <span class="object-name-breadcrumb" @click=${() => ctx.showObject()}>${ctx.objectName}</span>
        <span class="status-chip ${statusClass}">${statusText}</span>
        ${task.due_override ? b2`<span class="postponed-badge" title="${t3("postponed_to", L2)}">
          <ha-icon icon="mdi:calendar-arrow-right"></ha-icon>${formatDate(task.due_override, L2)}
        </span>` : A}
        ${renderUserBadge(task, ctx.getUserName)}
        ${task.nfc_tag_id ? b2`<span class="nfc-badge" title="${t3("nfc_tag_id", L2)}: ${task.nfc_tag_id}"><ha-icon icon="mdi:nfc-variant"></ha-icon> NFC</span>` : !isOperator ? b2`<span class="nfc-badge unlinked" title="${t3("nfc_link_hint", L2)}"
              @click=${() => ctx.openEdit(task)}>
              <ha-icon icon="mdi:nfc-variant"></ha-icon>
            </span>` : A}
      </div>
      <div class="task-header-actions">
        <ha-button appearance="filled" @click=${() => ctx.openComplete(task)}>${t3("complete", L2)}</ha-button>
        <ha-button appearance="plain" .disabled=${ctx.actionLoading} @click=${() => ctx.promptSkip()}>${t3("skip", L2)}</ha-button>
        <div class="more-menu-wrapper">
          <ha-icon-button .disabled=${ctx.actionLoading} .path=${"M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z"} @click=${() => ctx.toggleMoreMenu()}></ha-icon-button>
          ${ctx.moreMenuOpen ? b2`
            <div class="popup-menu" @click=${(e7) => e7.stopPropagation()}>
              ${!isOperator ? b2`
                <div class="popup-menu-item" @click=${() => {
    ctx.closeMoreMenu();
    ctx.openEdit(task);
  }}>${t3("edit", L2)}</div>
              ` : A}
              <div class="popup-menu-item" @click=${() => {
    ctx.closeMoreMenu();
    ctx.openQr(task.name);
  }}>${t3("qr_code", L2)}</div>
              <div class="popup-menu-item" @click=${() => {
    ctx.closeMoreMenu();
    ctx.printWorksheet();
  }}>${t3("worksheet", L2)}</div>
              ${!isOperator ? b2`
                <div class="popup-menu-item" @click=${() => ctx.duplicateTask()}>${t3("duplicate", L2)}</div>
                <div class="popup-menu-item" @click=${() => {
    ctx.closeMoreMenu();
    ctx.promptReset();
  }}>${t3("reset", L2)}</div>
                <div class="popup-menu-item" @click=${() => {
    ctx.closeMoreMenu();
    ctx.promptPostpone();
  }}>${t3("postpone", L2)}…</div>
                <div class="popup-menu-item" @click=${() => {
    ctx.closeMoreMenu();
    ctx.snoozeTask();
  }}>${t3("snooze", L2)}</div>
                <div class="popup-menu-item" @click=${() => {
    ctx.closeMoreMenu();
    ctx.toggleArchive(!!task.archived);
  }}>${task.archived ? t3("unarchive", L2) : t3("archive", L2)}</div>
                <div class="popup-menu-divider"></div>
                <div class="popup-menu-item danger" @click=${() => {
    ctx.closeMoreMenu();
    ctx.deleteTask();
  }}>${t3("delete", L2)}</div>
              ` : A}
            </div>
          ` : A}
        </div>
      </div>
    </div>
  `;
}
function renderTabBar(ctx) {
  const L2 = ctx.lang;
  return b2`
    <div class="tab-bar">
      <div class="tab ${ctx.activeTab === "overview" ? "active" : ""}" @click=${() => ctx.setActiveTab("overview")}>
        ${t3("overview", L2)}
      </div>
      <div class="tab ${ctx.activeTab === "history" ? "active" : ""}" @click=${() => ctx.setActiveTab("history")}>
        ${t3("history", L2)}
      </div>
    </div>
  `;
}
function collapsible(key, titleKey, body, ctx) {
  const collapsed = ctx.collapsedSections.has(key);
  return b2`
    <div class="collapsible ${collapsed ? "collapsed" : ""}">
      <button class="collapsible-head" @click=${() => ctx.toggleSection(key)}
        aria-expanded=${collapsed ? "false" : "true"}>
        <ha-icon icon="${collapsed ? "mdi:chevron-right" : "mdi:chevron-down"}"></ha-icon>
        <span>${t3(titleKey, ctx.lang)}</span>
      </button>
      ${collapsed ? A : b2`<div class="collapsible-body">${body}</div>`}
    </div>
  `;
}
function renderChecklistCard(task, ctx) {
  if (!ctx.features.checklists) return A;
  const items = task.checklist || [];
  if (items.length === 0) return A;
  const L2 = ctx.lang;
  const progress = task.checklist_progress || {};
  const done = items.filter((item) => progress[item]).length;
  return b2`
    <div class="checklist-preview-card">
      <div class="checklist-preview-header">
        <ha-icon icon="mdi:format-list-checks"></ha-icon>
        <span>${t3("checklist", L2)} (${done}/${items.length})</span>
      </div>
      <ol class="checklist-preview-list">
        ${items.map((item) => b2`
          <li class=${progress[item] ? "checked" : ""}>
            <label>
              <input
                type="checkbox"
                .checked=${!!progress[item]}
                @change=${(e7) => ctx.setChecklistItem(item, e7.target.checked)}
              />
              <span>${item}</span>
            </label>
          </li>
        `)}
      </ol>
    </div>
  `;
}
function renderTaskMeta(task, ctx) {
  const safeTaskUrl = isSafeHttpUrl(task.documentation_url) ? task.documentation_url : null;
  const safeObjUrl = isSafeHttpUrl(ctx.objectDocUrl) ? ctx.objectDocUrl : null;
  const manualDoc = safeObjUrl ? null : (ctx.objectManualDocs || [])[0];
  if (!task.notes && !safeTaskUrl && !safeObjUrl && !manualDoc) return A;
  const L2 = ctx.lang;
  return b2`
    <div class="task-meta-card">
      ${task.notes ? b2`
        <div class="task-meta-row">
          <ha-icon icon="mdi:note-text-outline"></ha-icon>
          <span class="task-meta-notes">${task.notes}</span>
        </div>
      ` : A}
      ${safeTaskUrl ? b2`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:open-in-new"></ha-icon>
          <a href="${safeTaskUrl}" target="_blank" rel="noopener noreferrer">${t3("documentation_label", L2)}</a>
        </div>
      ` : A}
      ${safeObjUrl ? b2`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="${safeObjUrl}" target="_blank" rel="noopener noreferrer">${t3("documentation_url_label", L2)} (${ctx.objectName})</a>
        </div>
      ` : manualDoc ? b2`
        <div class="task-meta-row task-meta-link">
          <ha-icon icon="mdi:book-open-variant"></ha-icon>
          <a href="#" title=${manualDoc.title}
            @click=${(e7) => {
    e7.preventDefault();
    ctx.openManualDoc(manualDoc);
  }}
            >${t3("documentation_url_label", L2)} (${ctx.objectName})</a>
        </div>
      ` : A}
    </div>
  `;
}
function renderKPIBar(task, ctx) {
  const L2 = ctx.lang;
  const avgCost = task.times_performed > 0 ? task.total_cost / task.times_performed : 0;
  const daysClass = task.days_until_due !== null && task.days_until_due !== void 0 ? task.days_until_due < 0 ? "overdue" : task.days_until_due <= task.warning_days ? "warning" : "" : "";
  return b2`
    <div class="kpi-bar">
      <div class="kpi-card">
        <div class="kpi-label">${t3("next_due", L2)}</div>
        <div class="kpi-value">${task.next_due ? formatDate(task.next_due, L2) : "\u2014"}</div>
        ${ctx.features.schedule_time && task.schedule_time ? b2`<div class="kpi-subtext">${t3("at_time", L2)} ${task.schedule_time}</div>` : A}
      </div>
      <div class="kpi-card ${daysClass}">
        <div class="kpi-label">${t3("days_until_due", L2)}</div>
        <div class="kpi-value-large">${task.days_until_due !== null && task.days_until_due !== void 0 ? task.days_until_due : "\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t3("interval", L2)}</div>
        <div class="kpi-value">${formatRecurrence(task, L2)}</div>
        ${ctx.features.adaptive && task.suggested_interval && task.suggested_interval !== task.interval_days ? b2`
          <div class="kpi-subtext">${t3("recommended", L2)}: ${task.suggested_interval}${task.interval_analysis?.confidence_interval_low != null ? ` (${task.interval_analysis.confidence_interval_low}\u2013${task.interval_analysis.confidence_interval_high})` : ""}</div>
        ` : A}
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t3("warning", L2)}</div>
        <div class="kpi-value">${task.warning_days} ${t3("days", L2)}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t3("last_performed", L2)}</div>
        <div class="kpi-value">${task.last_performed ? formatDate(task.last_performed, L2) : "\u2014"}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t3("avg_cost", L2)}</div>
        <div class="kpi-value">${avgCost.toFixed(0)} ${ctx.currencySymbol}</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">${t3("avg_duration", L2)}</div>
        <div class="kpi-value">${task.average_duration ? task.average_duration.toFixed(0) : "\u2014"} min</div>
      </div>
    </div>
  `;
}
function renderRecommendationCard(task, ctx) {
  const L2 = ctx.lang;
  if (!ctx.features.adaptive || !task.suggested_interval || task.suggested_interval === task.interval_days) {
    return A;
  }
  if (ctx.suggestionDismissed) return A;
  const suggested = task.suggested_interval;
  return b2`
    <div class="recommendation-card">
      <h4>${t3("suggested_interval", L2)}</h4>
      ${renderRecommendationBars(
    task.interval_days,
    suggested,
    task.interval_confidence || "medium",
    L2
  )}
      <div class="recommendation-actions">
        <ha-button appearance="filled"
          @click=${() => ctx.applySuggestion(suggested)}>
          ${t3("apply_suggestion", L2)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${() => ctx.reanalyze()}>
          ${t3("reanalyze", L2)}
        </ha-button>
        <ha-button appearance="plain"
          @click=${() => ctx.dismissSuggestion()}>
          ${t3("dismiss_suggestion", L2)}
        </ha-button>
      </div>
    </div>
  `;
}
function renderRecentActivities(task, ctx) {
  const L2 = ctx.lang;
  const recent = task.history.slice(-3).reverse();
  if (recent.length === 0) {
    return A;
  }
  const getIcon = (type) => {
    switch (type) {
      case "completed":
        return "\u2713";
      case "triggered":
        return "\u2297";
      case "skipped":
        return "\u21B7";
      case "reset":
        return "\u21BA";
      default:
        return "\xB7";
    }
  };
  return b2`
    <div class="recent-activities">
      <h3>${t3("recent_activities", L2)}</h3>
      ${recent.map((entry) => b2`
        <div class="activity-item">
          <span class="activity-icon">${getIcon(entry.type)}</span>
          <span class="activity-date">${formatDateTime(entry.timestamp, L2)}</span>
          <span class="activity-note">${entry.notes || "\u2014"}</span>
          ${entry.cost ? b2`<span class="activity-badge">${entry.cost.toFixed(0)}${ctx.currencySymbol}</span>` : A}
          ${entry.duration ? b2`<span class="activity-badge">${entry.duration}min</span>` : A}
        </div>
      `)}
      <div class="activity-show-all">
        <ha-button appearance="plain" @click=${() => ctx.setActiveTab("history")}>${t3("show_all", L2)} →</ha-button>
      </div>
    </div>
  `;
}
function renderOverviewTab(task, ctx) {
  const L2 = ctx.lang;
  const hasRecommendation = ctx.features.adaptive && task.suggested_interval && task.suggested_interval !== task.interval_days;
  const hasSeasonal = ctx.features.seasonal && task.seasonal_factor && task.seasonal_factor !== 1;
  const hasLeftColumn = hasRecommendation || hasSeasonal;
  const hasWeibullData = ctx.features.adaptive && task.interval_analysis?.weibull_beta != null && task.interval_analysis?.weibull_eta != null;
  const hasSeasonalData = ctx.features.seasonal && (task.seasonal_factors?.length === 12 || task.interval_analysis?.seasonal_factors?.length === 12);
  return b2`
    <div class="tab-content overview-tab">
      ${task.battery_fleet_task ? b2`<maintenance-battery-fleet-section .hass=${ctx.hass}></maintenance-battery-fleet-section>` : A}
      ${renderKPIBar(task, ctx)}
      ${renderTaskMeta(task, ctx)}
      ${task.battery_fleet_task ? A : b2`
            ${renderDaysProgress(task, ctx.lang)}
            ${renderTriggerSection(task, ctx.sparkline)}
            ${renderPredictionSection(task, L2, ctx.features)}
          `}
      <div class="two-column-layout ${hasLeftColumn ? "" : "single-column"}">
        ${hasLeftColumn ? b2`
          <div class="left-column">
            ${renderRecommendationCard(task, ctx)}
            ${renderSeasonalCardCompact(task, L2, ctx.features)}
          </div>
        ` : A}
        <div class="right-column">
          ${renderCostDurationCard(task, L2, ctx.costDurationToggle, (v2) => ctx.setCostDurationToggle(v2))}
        </div>
      </div>
      ${hasWeibullData ? collapsible("weibull", "weibull_reliability_curve", renderWeibullSection(task, L2), ctx) : A}
      ${hasSeasonalData ? collapsible("seasonal", "seasonal_chart_title", b2`
            ${renderSeasonalCardExpanded(task, L2)}
            <div class="seasonal-actions">
              <ha-button appearance="plain" @click=${() => ctx.openSeasonalOverrides(task)}>
                ${t3("edit_seasonal_overrides", L2)}
              </ha-button>
            </div>
          `, ctx) : A}
      ${renderChecklistCard(task, ctx)}
      ${renderRecentActivities(task, ctx)}
    </div>
  `;
}
function renderHistoryTab(task, ctx) {
  return b2`
    <div class="tab-content history-tab">
      ${renderHistoryFilters(task, ctx.history)}
      ${renderHistoryList(task, ctx.history)}
    </div>
  `;
}
function renderTabContent(task, ctx) {
  switch (ctx.activeTab) {
    case "overview":
      return renderOverviewTab(task, ctx);
    case "history":
      return renderHistoryTab(task, ctx);
    default:
      return A;
  }
}
function renderTaskDetail(task, ctx) {
  return b2`
    <div class="detail-section">
      ${renderTaskHeader(task, ctx)}
      ${renderTabBar(ctx)}
      ${renderTabContent(task, ctx)}
      <maintenance-task-documents
        .hass=${ctx.hass}
        .entryId=${ctx.entryId}
        .taskId=${ctx.taskId}
        .canWrite=${!ctx.isOperator}
      ></maintenance-task-documents>
    </div>
  `;
}

// components/task-detail-view.ts
var MaintenanceTaskDetailView = class extends i4 {
  createRenderRoot() {
    return this;
  }
  render() {
    if (!this.task || !this.ctx) return A;
    return b2`${renderTaskDetail(this.task, this.ctx)}`;
  }
};
__decorateClass([
  n4({ attribute: false })
], MaintenanceTaskDetailView.prototype, "task", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceTaskDetailView.prototype, "ctx", 2);
if (!customElements.get("maintenance-task-detail-view")) {
  customElements.define("maintenance-task-detail-view", MaintenanceTaskDetailView);
}

// components/settings-view.ts
init_lit();
init_decorators();

// node_modules/lit-html/directives/unsafe-html.js
init_lit_html();

// node_modules/lit-html/directive.js
var t4 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e5 = (t5) => (...e7) => ({ _$litDirective$: t5, values: e7 });
var i5 = class {
  constructor(t5) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t5, e7, i6) {
    this._$Ct = t5, this._$AM = e7, this._$Ci = i6;
  }
  _$AS(t5, e7) {
    return this.update(t5, e7);
  }
  update(t5, e7) {
    return this.render(...e7);
  }
};

// node_modules/lit-html/directives/unsafe-html.js
var e6 = class extends i5 {
  constructor(i6) {
    if (super(i6), this.it = A, i6.type !== t4.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r6) {
    if (r6 === A || null == r6) return this._t = void 0, this.it = r6;
    if (r6 === E) return r6;
    if ("string" != typeof r6) throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r6 === this.it) return this._t;
    this.it = r6;
    const s4 = [r6];
    return s4.raw = s4, this._t = { _$litType$: this.constructor.resultType, strings: s4, values: [] };
  }
};
e6.directiveName = "unsafeHTML", e6.resultType = 1;
var o6 = e5(e6);

// components/settings-view.ts
init_styles();
init_download();
init_user_service();

// helpers/object-columns.ts
var OBJECT_COLUMNS = [
  { key: "name", labelKey: "name", required: true },
  { key: "manufacturer", labelKey: "manufacturer" },
  { key: "model", labelKey: "model" },
  { key: "serial_number", labelKey: "serial_number_label" },
  { key: "installation_date", labelKey: "installed" },
  { key: "warranty_expiry", labelKey: "warranty" },
  { key: "area_id", labelKey: "area" },
  { key: "documentation_url", labelKey: "documentation_url_label" },
  { key: "notes", labelKey: "object_notes_label" },
  { key: "task_count", labelKey: "tasks" },
  { key: "actions", labelKey: "actions" }
];
var KNOWN_OBJECT_COLUMNS = OBJECT_COLUMNS.map((c4) => c4.key);
var DEFAULT_OBJECTS_TABLE_COLUMNS = [
  "name",
  "manufacturer",
  "model",
  "serial_number",
  "installation_date",
  "warranty_expiry",
  "area_id",
  "task_count",
  "actions"
];
function sanitizeColumns(cols) {
  if (!Array.isArray(cols)) return [...DEFAULT_OBJECTS_TABLE_COLUMNS];
  const seen = /* @__PURE__ */ new Set();
  const out = [];
  for (const c4 of cols) {
    if (typeof c4 === "string" && KNOWN_OBJECT_COLUMNS.includes(c4) && !seen.has(c4)) {
      seen.add(c4);
      out.push(c4);
    }
  }
  if (!out.length) return [...DEFAULT_OBJECTS_TABLE_COLUMNS];
  if (!out.includes("name")) out.unshift("name");
  return out;
}

// components/settings-view.ts
init_download();
var CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "JPY",
  "CHF",
  "CAD",
  "AUD",
  "NZD",
  "CNY",
  "INR",
  "BRL",
  "CZK",
  "PLN",
  "RUB",
  "SEK",
  "NOK",
  "DKK",
  "UAH"
];
var MaintenanceSettingsView = class extends i4 {
  constructor() {
    super(...arguments);
    this.budget = null;
    this._settings = null;
    this._loading = true;
    this._importCsv = "";
    this._importLoading = false;
    this._includeHistory = true;
    this._toast = "";
    this._testingNotification = false;
    this._personTargets = [];
    this._testingUser = "";
    this._users = [];
    this._savedViews = [];
    this._vacEnabled = false;
    this._vacStart = "";
    this._vacEnd = "";
    this._vacBuffer = 3;
    this._vacExempt = /* @__PURE__ */ new Set();
    this._vacIsActive = false;
    this._vacWindowEnd = null;
    this._vacAllTasks = [];
    this._vacPreview = [];
    this._vacPreviewLoading = false;
    this._vacSaving = false;
    this._qrObjects = [];
    this._qrSelectedEntries = /* @__PURE__ */ new Set();
    this._qrActions = /* @__PURE__ */ new Set(["view"]);
    this._qrUrlMode = "companion";
    this._qrBatchLoading = false;
    this._qrBatchResults = [];
    this._qrObjectsLoaded = false;
    this._exportObjects = [];
    this._exportSelectedEntries = /* @__PURE__ */ new Set();
    this._exportObjectsLoaded = false;
    this._docArchiveLoading = false;
    this._loaded = false;
    this._userService = null;
    this._sendTestNotification = async (userId) => {
      if (userId) this._testingUser = userId;
      else this._testingNotification = true;
      try {
        const res = await this.hass.connection.sendMessagePromise({
          type: "maintenance_supporter/global/test_notification",
          ...userId ? { user_id: userId } : {}
        });
        const msg = res.message || (res.success ? t3("test_notification_success", this._lang) : t3("test_notification_failed", this._lang));
        this._showToast(msg);
      } catch {
        this._showToast(t3("test_notification_failed", this._lang));
      } finally {
        if (userId) this._testingUser = "";
        else this._testingNotification = false;
      }
    };
    this._allTemplates = [];
    this._templateCategories = {};
    this._tplOpenGroups = /* @__PURE__ */ new Set();
    // One-shot request guard: keyed on a plain flag, NOT on the result being
    // non-empty — an empty catalog answer would otherwise re-trigger the load
    // from render() forever (Lit update loop; caught by the settings tests).
    this._templatesRequested = false;
  }
  get _lang() {
    return langOf(this.hass);
  }
  updated(changedProps) {
    super.updated(changedProps);
    if (changedProps.has("hass") && this.hass && !this._loaded) {
      this._loaded = true;
      this._userService = new UserService(this.hass);
      this._loadSettings();
      this._loadUsers();
    } else if (changedProps.has("hass") && this.hass && this._userService) {
      this._userService.updateHass(this.hass);
    }
  }
  async _loadUsers() {
    if (!this._userService) return;
    try {
      this._users = await this._userService.getUsers();
    } catch {
      this._users = [];
    }
    this._loadNotifyTargets();
  }
  /** Which notify services each household member resolves to.
   *
   *  Resolved by the backend through the same helper the reminder path uses,
   *  so the list shown here is the list that will actually be used.
   */
  async _loadNotifyTargets() {
    try {
      const res = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/notify/user_targets"
      });
      this._personTargets = res.targets || [];
    } catch {
      this._personTargets = [];
    }
  }
  async _loadSettings() {
    this._loading = true;
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/settings"
      });
      this._settings = result;
      this._hydrateVacationFromSettings();
    } catch {
    }
    try {
      const v2 = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/views/list"
      });
      this._savedViews = v2.views || [];
    } catch {
    }
    this._loading = false;
  }
  _hydrateVacationFromSettings() {
    const v2 = this._settings?.vacation;
    if (!v2) return;
    this._vacEnabled = v2.enabled;
    this._vacStart = v2.start || "";
    this._vacEnd = v2.end || "";
    this._vacBuffer = v2.buffer_days;
    this._vacExempt = new Set(v2.exempt_task_ids || []);
    this._vacIsActive = v2.is_active;
    this._vacWindowEnd = v2.window_end;
  }
  async _updateSetting(key, value) {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/global/update",
        settings: { [key]: value }
      });
      this._settings = result;
      this._showToast(t3("settings_saved", this._lang));
      this.dispatchEvent(new CustomEvent("settings-changed"));
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  _showToast(msg) {
    this._toast = msg;
    setTimeout(() => {
      this._toast = "";
    }, 3e3);
  }
  _downloadFile(content, filename, mime) {
    downloadTextFile(content, filename, mime);
  }
  // --- Render ---
  render() {
    const L2 = this._lang;
    if (this._loading || !this._settings) {
      return b2`<div class="settings-loading">Loading…</div>`;
    }
    return b2`
      ${this._renderFeatures(L2)}
      ${this._renderPanelAccess(L2)}
      ${this._renderGeneral(L2)}
      ${this._renderObjectsColumns(L2)}
      ${this._settings.general.notifications_enabled ? this._renderNotifications(L2) : A}
      ${this.features.budget ? this._renderBudget(L2) : A}
      ${this._renderArchive(L2)}
      ${this._renderVacation(L2)}
      ${this._renderPrintQr(L2)}
      ${this._renderImportExport(L2)}
      ${this._renderTemplateToggles(L2)}
      ${this._toast ? b2`<div class="settings-toast">${this._toast}</div>` : A}
    `;
  }
  /** v2.3.0 Phase 6: deep-link target. Called by the panel after a section
   *  strategy banner click navigates here with ms_action=open_<key>.
   *  Scrolls the requested settings section into view; no-op if not found. */
  scrollToSection(target) {
    requestAnimationFrame(() => {
      const sr = this.shadowRoot;
      if (!sr) return;
      const el = sr.querySelector(`[data-section="${target}"]`) ?? sr.querySelector(`[data-section-alt="${target}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  // --- Section: Panel Access (1.0.44+) ---
  _renderPanelAccess(L2) {
    const selected = new Set(this._settings.admin_panel_user_ids || []);
    const nonAdmins = this._users.filter((u3) => !u3.is_admin);
    const writeEnabled = this._settings.operator_write_enabled ?? false;
    const toggle = (uid, on) => {
      const next = new Set(selected);
      if (on) next.add(uid);
      else next.delete(uid);
      this._updateSetting("admin_panel_user_ids", [...next]);
    };
    return b2`
      <div class="settings-section">
        <h3>${t3("settings_panel_access", L2)} ${writeEnabled && selected.size > 0 ? b2`<span class="section-badge">${selected.size}</span>` : A}</h3>
        <p class="section-desc">${t3("settings_panel_access_desc", L2)}</p>
        <label class="setting-row">
          <span>
            <span class="setting-label">${t3("settings_operator_write", L2)}</span>
            <span class="setting-desc">${t3("settings_operator_write_desc", L2)}</span>
          </span>
          <input type="checkbox"
            .checked=${writeEnabled}
            @change=${(e7) => this._updateSetting("operator_write_enabled", e7.target.checked)} />
        </label>
        ${!writeEnabled ? A : nonAdmins.length === 0 ? b2`<div class="setting-row hint">${t3("no_non_admin_users", L2)}</div>` : nonAdmins.map((u3) => b2`
              <label class="setting-row">
                <span>
                  <span class="setting-label">${u3.name || u3.id.slice(0, 8)}</span>
                  <span class="setting-desc">${u3.is_owner ? t3("owner_label", L2) : ""}</span>
                </span>
                <input type="checkbox"
                  .checked=${selected.has(u3.id)}
                  @change=${(e7) => toggle(u3.id, e7.target.checked)} />
              </label>
            `)}
      </div>
    `;
  }
  // --- Section: Features ---
  _renderFeatures(L2) {
    const f3 = this._settings.features;
    const items = [
      { key: "adaptive", settingKey: "advanced_adaptive_visible", label: t3("feat_adaptive", L2), desc: t3("feat_adaptive_desc", L2) },
      { key: "predictions", settingKey: "advanced_predictions_visible", label: t3("feat_predictions", L2), desc: t3("feat_predictions_desc", L2) },
      { key: "seasonal", settingKey: "advanced_seasonal_visible", label: t3("feat_seasonal", L2), desc: t3("feat_seasonal_desc", L2) },
      { key: "environmental", settingKey: "advanced_environmental_visible", label: t3("feat_environmental", L2), desc: t3("feat_environmental_desc", L2) },
      { key: "budget", settingKey: "advanced_budget_visible", label: t3("feat_budget", L2), desc: t3("feat_budget_desc", L2) },
      { key: "groups", settingKey: "advanced_groups_visible", label: t3("feat_groups", L2), desc: t3("feat_groups_desc", L2) },
      { key: "checklists", settingKey: "advanced_checklists_visible", label: t3("feat_checklists", L2), desc: t3("feat_checklists_desc", L2) },
      { key: "schedule_time", settingKey: "advanced_schedule_time_visible", label: t3("feat_schedule_time", L2), desc: t3("feat_schedule_time_desc", L2) },
      { key: "completion_actions", settingKey: "advanced_completion_actions_visible", label: t3("feat_completion_actions", L2), desc: t3("feat_completion_actions_desc", L2) }
    ];
    return b2`
      <div class="settings-section" data-section="settings" data-section-alt="groups">
        <h3>${t3("settings_features", L2)}</h3>
        <p class="section-desc">${t3("settings_features_desc", L2)}</p>
        ${items.map((item) => b2`
          <label class="setting-row">
            <span>
              <span class="setting-label">${item.label}</span>
              <span class="setting-desc">${item.desc}</span>
            </span>
            <input type="checkbox" .checked=${f3[item.key]}
              @change=${(e7) => this._updateSetting(item.settingKey, e7.target.checked)} />
          </label>
        `)}
      </div>
    `;
  }
  async _loadTemplates() {
    if (this._templatesRequested) return;
    this._templatesRequested = true;
    try {
      const res = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/templates",
        language: this._lang
      });
      this._allTemplates = res.templates || [];
      this._templateCategories = res.categories || {};
    } catch {
    }
  }
  _renderTemplateToggles(L2) {
    this._loadTemplates();
    const hidden = new Set(this._settings.disabled_template_ids || []);
    const byCat = /* @__PURE__ */ new Map();
    for (const catId of Object.keys(this._templateCategories)) byCat.set(catId, []);
    for (const tpl of this._allTemplates) {
      if (!byCat.has(tpl.category)) byCat.set(tpl.category, []);
      byCat.get(tpl.category).push(tpl);
    }
    const catName = (catId) => this._templateCategories[catId]?.["name_" + L2] || this._templateCategories[catId]?.name_en || catId;
    return b2`
      <div class="settings-section" data-section="templates">
        <h3>${t3("settings_templates_label", L2)}</h3>
        <p class="section-desc">${t3("settings_templates_hint", L2)}</p>
        ${[...byCat.entries()].filter(([, tpls]) => tpls.length > 0).map(([catId, tpls]) => {
      const enabled = tpls.filter((tpl) => !hidden.has(tpl.id)).length;
      const open = this._tplOpenGroups.has(catId);
      return b2`
            <div class="tpl-group">
              <div
                class="tpl-group-head"
                role="button"
                tabindex="0"
                @click=${() => this._toggleTplGroupOpen(catId)}
                @keydown=${(e7) => {
        if (e7.key === "Enter" || e7.key === " ") {
          e7.preventDefault();
          this._toggleTplGroupOpen(catId);
        }
      }}
              >
                <ha-icon class="tpl-chevron" icon=${open ? "mdi:chevron-down" : "mdi:chevron-right"}></ha-icon>
                <ha-icon icon=${this._templateCategories[catId]?.icon || "mdi:folder-outline"}></ha-icon>
                <span class="tpl-group-name">${catName(catId)}</span>
                <span class="tpl-group-count">${enabled}/${tpls.length}</span>
                <input
                  type="checkbox"
                  title=${t3("settings_templates_toggle_group", L2)}
                  .checked=${enabled === tpls.length}
                  @click=${(e7) => e7.stopPropagation()}
                  @change=${(e7) => this._toggleTemplateGroup(tpls.map((tpl) => tpl.id), e7.target.checked)}
                />
              </div>
              ${open ? tpls.map((tpl) => b2`
                    <label class="setting-row tpl-row">
                      <span class="setting-label">${tpl.name}</span>
                      <input
                        type="checkbox"
                        .checked=${!hidden.has(tpl.id)}
                        @change=${(e7) => this._toggleTemplate(tpl.id, e7.target.checked)}
                      />
                    </label>
                  `) : A}
            </div>
          `;
    })}
      </div>
    `;
  }
  _toggleTemplate(id, visible) {
    const hidden = new Set(this._settings.disabled_template_ids || []);
    if (visible) hidden.delete(id);
    else hidden.add(id);
    this._updateSetting("disabled_template_ids", [...hidden]);
  }
  /** Expand/collapse one gallery group (collapsed by default). */
  _toggleTplGroupOpen(catId) {
    const next = new Set(this._tplOpenGroups);
    if (next.has(catId)) next.delete(catId);
    else next.add(catId);
    this._tplOpenGroups = next;
  }
  /** Toggle-all for one category group in the template gallery. */
  _toggleTemplateGroup(ids, visible) {
    const hidden = new Set(this._settings.disabled_template_ids || []);
    for (const id of ids) {
      if (visible) hidden.delete(id);
      else hidden.add(id);
    }
    this._updateSetting("disabled_template_ids", [...hidden]);
  }
  _renderObjectsColumns(L2) {
    const selected = sanitizeColumns(this._settings.objects_table_columns);
    return b2`
      <div class="settings-section" data-section="objects_table_columns">
        <h3>${t3("objects_table_columns_label", L2)}</h3>
        <p class="section-desc">${t3("objects_table_columns_hint", L2)}</p>
        ${OBJECT_COLUMNS.map((col) => b2`
          <label class="setting-row">
            <span class="setting-label">${t3(col.labelKey, L2)}</span>
            <input
              type="checkbox"
              .checked=${selected.includes(col.key)}
              ?disabled=${!!col.required}
              @change=${(e7) => this._toggleColumn(col.key, e7.target.checked)}
            />
          </label>
        `)}
      </div>
    `;
  }
  _toggleColumn(key, on) {
    const current = new Set(sanitizeColumns(this._settings.objects_table_columns));
    if (on) current.add(key);
    else current.delete(key);
    const next = OBJECT_COLUMNS.filter((c4) => c4.required || current.has(c4.key)).map((c4) => c4.key);
    this._updateSetting("objects_table_columns", next);
  }
  // --- Section: General ---
  _renderGeneral(L2) {
    const g2 = this._settings.general;
    const notifyServices = g2.notify_targets ?? [];
    const b3 = this._settings.budget;
    return b2`
      <div class="settings-section">
        <h3>${t3("settings_general", L2)}</h3>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_default_warning", L2)}</span>
          <input type="number" min="1" max="365" .value=${String(g2.default_warning_days)}
            @change=${(e7) => {
      const v2 = parseInt(e7.target.value, 10);
      if (v2 >= 1 && v2 <= 365) this._updateSetting("default_warning_days", v2);
    }} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_currency", L2)}</span>
          <select @change=${(e7) => this._updateSetting("budget_currency", e7.target.value)}>
            ${CURRENCIES.map((c4) => b2`<option value=${c4} ?selected=${b3.currency === c4}>${c4}</option>`)}
          </select>
        </label>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_panel_enabled", L2)}</span>
          <input type="checkbox" .checked=${g2.panel_enabled}
            @change=${(e7) => this._updateSetting("panel_enabled", e7.target.checked)} />
        </label>
        ${g2.panel_enabled ? b2`
          <label class="setting-row">
            <span class="setting-label">${t3("settings_panel_title", L2)}</span>
            <input type="text" .value=${g2.panel_title ?? ""}
              placeholder="Maintenance"
              maxlength="50"
              @change=${(e7) => this._updateSetting("panel_title", e7.target.value.trim())} />
          </label>
        ` : ""}
        <label class="setting-row">
          <span class="setting-label">${t3("settings_install_assist_sentences", L2)}</span>
          <input type="checkbox" .checked=${g2.install_assist_sentences ?? false}
            @change=${(e7) => this._updateSetting("install_assist_sentences", e7.target.checked)} />
        </label>
        <div class="setting-hint">${t3("settings_install_assist_sentences_hint", L2)}</div>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_notifications", L2)}</span>
          <input type="checkbox" .checked=${g2.notifications_enabled}
            @change=${(e7) => this._updateSetting("notifications_enabled", e7.target.checked)} />
        </label>
        ${g2.notifications_enabled ? b2`
          <label class="setting-row">
            <span class="setting-label">${t3("settings_notify_service", L2)}</span>
            <input type="text" list="ms-notify-services" .value=${g2.notify_service}
              @change=${(e7) => this._updateSetting("notify_service", e7.target.value.trim())} />
            <datalist id="ms-notify-services">
              ${notifyServices.map((s4) => b2`<option value=${s4}></option>`)}
            </datalist>
          </label>
          <div class="setting-row">
            <span class="setting-label">${t3("test_notification", L2)}</span>
            <button class="ha-button secondary"
              ?disabled=${!g2.notify_service || this._testingNotification}
              @click=${() => this._sendTestNotification()}>
              ${this._testingNotification ? t3("testing", L2) : t3("send_test", L2)}
            </button>
          </div>
          ${this._personTargets.length ? b2`
            <div class="notify-per-person">
              <span class="setting-label">${t3("notify_per_person", L2)}</span>
              ${this._personTargets.map((target) => b2`
                <div class="notify-person-row">
                  <span class="notify-person-name">${target.name}</span>
                  <span class="notify-person-target ${target.services.length ? "" : "muted"}">
                    ${target.services.length ? target.services.join(", ") : t3("notify_no_own_device", L2)}
                  </span>
                  <button class="ha-button secondary"
                    ?disabled=${!target.services.length || this._testingUser === target.user_id}
                    @click=${() => this._sendTestNotification(target.user_id)}>
                    ${this._testingUser === target.user_id ? t3("testing", L2) : t3("send_test", L2)}
                  </button>
                </div>
              `)}
            </div>
          ` : A}
        ` : A}
      </div>
    `;
  }
  // --- Section: Notifications ---
  _renderNotifications(L2) {
    const n5 = this._settings.notifications;
    const a3 = this._settings.actions;
    return b2`
      <div class="settings-section">
        <h3>${t3("settings_notifications", L2)}</h3>

        <label class="setting-row">
          <span>
            <span class="setting-label">${t3("settings_notify_due_soon", L2)}</span>
          </span>
          <input type="checkbox" .checked=${n5.due_soon_enabled}
            @change=${(e7) => this._updateSetting("notify_due_soon_enabled", e7.target.checked)} />
        </label>
        ${n5.due_soon_enabled ? b2`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t3("settings_interval_hours", L2)}</span>
            <input type="number" min="0" max="720" .value=${String(n5.due_soon_interval_hours)}
              @change=${(e7) => this._updateSetting("notify_due_soon_interval_hours", parseInt(e7.target.value, 10) || 0)} />
          </label>
        ` : A}

        <label class="setting-row">
          <span>
            <span class="setting-label">${t3("settings_notify_overdue", L2)}</span>
          </span>
          <input type="checkbox" .checked=${n5.overdue_enabled}
            @change=${(e7) => this._updateSetting("notify_overdue_enabled", e7.target.checked)} />
        </label>
        ${n5.overdue_enabled ? b2`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t3("settings_interval_hours", L2)}</span>
            <input type="number" min="0" max="720" .value=${String(n5.overdue_interval_hours)}
              @change=${(e7) => this._updateSetting("notify_overdue_interval_hours", parseInt(e7.target.value, 10) || 0)} />
          </label>
        ` : A}

        <label class="setting-row">
          <span>
            <span class="setting-label">${t3("settings_notify_triggered", L2)}</span>
          </span>
          <input type="checkbox" .checked=${n5.triggered_enabled}
            @change=${(e7) => this._updateSetting("notify_triggered_enabled", e7.target.checked)} />
        </label>
        ${n5.triggered_enabled ? b2`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t3("settings_interval_hours", L2)}</span>
            <input type="number" min="0" max="720" .value=${String(n5.triggered_interval_hours)}
              @change=${(e7) => this._updateSetting("notify_triggered_interval_hours", parseInt(e7.target.value, 10) || 0)} />
          </label>
        ` : A}

        <label class="setting-row">
          <span class="setting-label">${t3("settings_quiet_hours", L2)}</span>
          <input type="checkbox" .checked=${n5.quiet_hours_enabled}
            @change=${(e7) => this._updateSetting("quiet_hours_enabled", e7.target.checked)} />
        </label>
        ${n5.quiet_hours_enabled ? b2`
          <div class="setting-row sub-row">
            <span class="setting-desc">${t3("settings_quiet_start", L2)}</span>
            <input type="time" .value=${n5.quiet_hours_start}
              @change=${(e7) => this._updateSetting("quiet_hours_start", e7.target.value)} />
          </div>
          <div class="setting-row sub-row">
            <span class="setting-desc">${t3("settings_quiet_end", L2)}</span>
            <input type="time" .value=${n5.quiet_hours_end}
              @change=${(e7) => this._updateSetting("quiet_hours_end", e7.target.value)} />
          </div>
        ` : A}

        <label class="setting-row">
          <span class="setting-label">${t3("settings_max_per_day", L2)}</span>
          <input type="number" min="0" max="100" .value=${String(n5.max_per_day)}
            @change=${(e7) => this._updateSetting("max_notifications_per_day", parseInt(e7.target.value, 10) || 0)} />
        </label>

        <label class="setting-row">
          <span class="setting-label">${t3("settings_bundling", L2)}</span>
          <input type="checkbox" .checked=${n5.bundling_enabled}
            @change=${(e7) => this._updateSetting("notification_bundling_enabled", e7.target.checked)} />
        </label>
        ${n5.bundling_enabled ? b2`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t3("settings_bundle_threshold", L2)}</span>
            <input type="number" min="2" max="20" .value=${String(n5.bundle_threshold)}
              @change=${(e7) => this._updateSetting("notification_bundle_threshold", parseInt(e7.target.value, 10) || 2)} />
          </label>
        ` : A}
        <label class="setting-row">
          <span class="setting-label">${t3("settings_reminder_leads", L2)}</span>
          <input type="text" placeholder="14, 3, 0"
            .value=${(n5.reminder_lead_days || []).join(", ")}
            @change=${(e7) => {
      const leads = e7.target.value.split(",").map((s4) => parseInt(s4.trim(), 10)).filter((v2) => Number.isInteger(v2) && v2 >= 0 && v2 <= 365);
      this._updateSetting("reminder_lead_days", [...new Set(leads)]);
    }} />
        </label>
        <div class="setting-hint">${t3("settings_reminder_leads_hint", L2)}</div>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_notify_scope", L2)}</span>
          <select
            .value=${n5.scope_view_id || ""}
            @change=${(e7) => this._updateSetting("notify_scope_view_id", e7.target.value)}
          >
            <option value="" ?selected=${!n5.scope_view_id}>${t3("settings_notify_scope_all", L2)}</option>
            ${this._savedViews.map(
      (v2) => b2`<option value=${v2.id} ?selected=${n5.scope_view_id === v2.id}>${v2.name}</option>`
    )}
          </select>
        </label>
        <div class="setting-hint">${t3("settings_notify_scope_hint", L2)}</div>

        <h4 style="margin: 16px 0 8px; font-size: 14px;">${t3("settings_actions", L2)}</h4>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_action_complete", L2)}</span>
          <input type="checkbox" .checked=${a3.complete_enabled}
            @change=${(e7) => this._updateSetting("action_complete_enabled", e7.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_action_skip", L2)}</span>
          <input type="checkbox" .checked=${a3.skip_enabled}
            @change=${(e7) => this._updateSetting("action_skip_enabled", e7.target.checked)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_action_snooze", L2)}</span>
          <input type="checkbox" .checked=${a3.snooze_enabled}
            @change=${(e7) => this._updateSetting("action_snooze_enabled", e7.target.checked)} />
        </label>
        ${a3.snooze_enabled ? b2`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t3("settings_snooze_hours", L2)}</span>
            <input type="number" min="1" max="168" .value=${String(a3.snooze_duration_hours)}
              @change=${(e7) => this._updateSetting("snooze_duration_hours", parseInt(e7.target.value, 10) || 4)} />
          </label>
        ` : A}
        <label class="setting-row">
          <span class="setting-label">${t3("settings_weekly_digest", L2)}</span>
          <input type="checkbox" .checked=${a3.weekly_digest_enabled}
            @change=${(e7) => this._updateSetting("weekly_digest_enabled", e7.target.checked)} />
        </label>
        <div class="setting-hint">${t3("settings_weekly_digest_hint", L2)}</div>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_warranty_reminder", L2)}</span>
          <input type="checkbox" .checked=${a3.warranty_reminder_enabled}
            @change=${(e7) => this._updateSetting("warranty_reminder_enabled", e7.target.checked)} />
        </label>
        ${a3.warranty_reminder_enabled ? b2`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t3("settings_warranty_reminder_days", L2)}</span>
            <input type="number" min="1" max="365" .value=${String(a3.warranty_reminder_days)}
              @change=${(e7) => this._updateSetting("warranty_reminder_days", parseInt(e7.target.value, 10) || 30)} />
          </label>
        ` : A}
        <div class="setting-hint">${t3("settings_warranty_reminder_hint", L2)}</div>
      </div>
    `;
  }
  // --- Section: Budget ---
  _renderBudget(L2) {
    const b3 = this._settings.budget;
    return b2`
      <div class="settings-section" data-section="budget">
        <h3>${t3("settings_budget", L2)}</h3>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_budget_monthly", L2)}</span>
          <input type="number" min="0" step="0.01" .value=${String(b3.monthly)}
            @change=${(e7) => this._updateSetting("budget_monthly", parseFloat(e7.target.value) || 0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_budget_yearly", L2)}</span>
          <input type="number" min="0" step="0.01" .value=${String(b3.yearly)}
            @change=${(e7) => this._updateSetting("budget_yearly", parseFloat(e7.target.value) || 0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_budget_alerts", L2)}</span>
          <input type="checkbox" .checked=${b3.alerts_enabled}
            @change=${(e7) => this._updateSetting("budget_alerts_enabled", e7.target.checked)} />
        </label>
        ${b3.alerts_enabled ? b2`
          <label class="setting-row sub-row">
            <span class="setting-desc">${t3("settings_budget_threshold", L2)}</span>
            <input type="number" min="1" max="100" .value=${String(b3.alert_threshold_pct)}
              @change=${(e7) => this._updateSetting("budget_alert_threshold", parseInt(e7.target.value, 10) || 80)} />
          </label>
        ` : A}
      </div>
    `;
  }
  // --- Section: Archive & retention (v2.10.0) ---
  _renderArchive(L2) {
    const a3 = this._settings.archive ?? { oneoff_days: 14, delete_archived_oneoff_days: 0 };
    return b2`
      <div class="settings-section" data-section="archive">
        <h3>${t3("settings_archive", L2)}</h3>
        <p class="section-desc">${t3("settings_archive_desc", L2)}</p>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_archive_oneoff_days", L2)}</span>
          <input type="number" min="0" max="3650" step="1" .value=${String(a3.oneoff_days)}
            @change=${(e7) => this._updateSetting("archive_oneoff_days", parseInt(e7.target.value, 10) || 0)} />
        </label>
        <label class="setting-row">
          <span class="setting-label">${t3("settings_delete_archived_oneoff_days", L2)}</span>
          <input type="number" min="0" max="3650" step="1" .value=${String(a3.delete_archived_oneoff_days)}
            @change=${(e7) => this._updateSetting("delete_archived_oneoff_days", parseInt(e7.target.value, 10) || 0)} />
        </label>
      </div>
    `;
  }
  // --- Section: Import/Export ---
  // --- Section: Vacation mode (v1.2.0) ---
  _renderVacation(L2) {
    const isStale = this._vacEnabled && !this._vacIsActive && this._vacWindowEnd && new Date(this._vacWindowEnd) < /* @__PURE__ */ new Date();
    const exemptCount = this._vacExempt.size;
    return b2`
      <div class="settings-section vacation-section" data-section="vacation">
        <h3>
          ${t3("vacation_title", L2)}
          ${this._vacIsActive ? b2`<span class="vac-badge active">${t3("vacation_active", L2)}</span>` : A}
          ${isStale ? b2`<span class="vac-badge stale">${t3("vacation_ended", L2)}</span>` : A}
        </h3>
        <p class="section-desc">${t3("vacation_desc", L2)}</p>

        <label class="vac-toggle">
          <input type="checkbox" .checked=${this._vacEnabled}
            @change=${(e7) => this._toggleVacationEnabled(e7.target.checked)} />
          ${t3("vacation_enable", L2)}
        </label>

        <div class="vac-grid">
          <label class="vac-field">
            <span class="filter-label">${t3("vacation_start", L2)}</span>
            <input type="date" .value=${this._vacStart}
              @change=${(e7) => this._setVacationDate("start", e7.target.value)} />
          </label>
          <label class="vac-field">
            <span class="filter-label">${t3("vacation_end", L2)}</span>
            <input type="date" .value=${this._vacEnd}
              @change=${(e7) => this._setVacationDate("end", e7.target.value)} />
          </label>
          <label class="vac-field">
            <span class="filter-label">${t3("vacation_buffer", L2)}</span>
            <input type="number" min="0" max="14" .value=${String(this._vacBuffer)}
              @change=${(e7) => this._setVacationBuffer(parseInt(e7.target.value, 10) || 0)} />
          </label>
        </div>

        <details class="vac-exempt-panel">
          <summary>
            ${t3("vacation_exempt_title", L2)}
            ${exemptCount > 0 ? b2`<span class="section-badge">${exemptCount}</span>` : A}
          </summary>
          <p class="section-desc">${t3("vacation_exempt_desc", L2)}</p>
          ${this._vacAllTasks.length === 0 ? b2`<button @click=${this._loadAllTasksForVacation}>${t3("vacation_load_tasks", L2)}</button>` : b2`
              <div class="vac-task-list">
                ${this._renderVacationTaskList(L2)}
              </div>
            `}
        </details>

        ${this._vacStart && this._vacEnd ? b2`
          <div class="vac-preview-toolbar">
            <button @click=${this._loadVacationPreview} ?disabled=${this._vacPreviewLoading}>
              ${this._vacPreviewLoading ? "\u2026" : t3("vacation_preview_btn", L2)}
            </button>
            ${this._vacPreview.length > 0 ? b2`<span class="vac-preview-count">${this._vacPreview.length} ${t3("vacation_preview_affected", L2)}</span>` : A}
          </div>
          ${this._vacPreview.length > 0 ? this._renderVacationPreview(L2) : A}
        ` : A}

        ${this._vacIsActive || isStale ? b2`<button class="vac-end-now" @click=${this._endVacationNow}>
              ${t3("vacation_end_now", L2)}
            </button>` : A}
      </div>
    `;
  }
  _renderVacationTaskList(L2) {
    const byObj = /* @__PURE__ */ new Map();
    for (const t5 of this._vacAllTasks) {
      const arr = byObj.get(t5.object_name) || [];
      arr.push(t5);
      byObj.set(t5.object_name, arr);
    }
    const sortedObjs = [...byObj.entries()].sort(([a3], [b3]) => a3.localeCompare(b3));
    return sortedObjs.map(([objName, tasks]) => b2`
      <div class="vac-task-group">
        <div class="vac-task-group-name">${objName || t3("no_objects", L2)}</div>
        ${tasks.sort((a3, b3) => a3.task_name.localeCompare(b3.task_name)).map((task) => b2`
            <label class="vac-task-row">
              <input type="checkbox"
                .checked=${this._vacExempt.has(task.task_id)}
                @change=${(e7) => this._toggleVacationExempt(task.task_id, e7.target.checked)} />
              <span>${task.task_name}</span>
            </label>
          `)}
      </div>
    `);
  }
  _renderVacationPreview(L2) {
    return b2`
      <div class="vac-preview-list">
        ${this._vacPreview.map((row) => {
      const eventLabel = row.events.map((e7) => {
        const statusKey = `vacation_event_${e7.status}`;
        return `${e7.date} (${t3(statusKey, L2)})`;
      }).join(" \xB7 ");
      const isExempt = !row.will_suppress;
      return b2`
            <div class="vac-preview-row ${isExempt ? "exempt" : ""}">
              <div class="vac-preview-info">
                <div class="vac-preview-name">
                  <strong>${row.object_name}</strong> · ${row.task_name}
                  ${row.kind === "sensor_based" ? b2`<span class="vac-preview-kind">${t3("vacation_sensor_based", L2)}</span>` : A}
                </div>
                <div class="vac-preview-events">${eventLabel}</div>
              </div>
              <div class="vac-preview-actions">
                <button @click=${() => this._previewActionComplete(row)}>${t3("qr_action_complete", L2)}</button>
                ${row.kind === "time_based" ? b2`<button @click=${() => this._previewActionSkip(row)}>${t3("qr_action_skip", L2)}</button>` : A}
                <button class=${isExempt ? "vac-notify-on" : ""}
                  @click=${() => this._toggleVacationExempt(row.task_id, !isExempt)}>
                  ${isExempt ? t3("vacation_action_unsilence", L2) : t3("vacation_action_notify", L2)}
                </button>
              </div>
            </div>
          `;
    })}
      </div>
    `;
  }
  // --- Vacation actions ---
  async _loadAllTasksForVacation() {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/objects"
      });
      const flat = [];
      for (const obj of result.objects || []) {
        for (const t5 of obj.tasks || []) {
          flat.push({
            entry_id: obj.entry_id,
            object_name: obj.object.name || "",
            task_id: t5.id,
            task_name: t5.name || ""
          });
        }
      }
      this._vacAllTasks = flat;
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  async _saveVacation(patch) {
    if (this._vacSaving) return;
    this._vacSaving = true;
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/vacation/update",
        ...patch
      });
      this._vacEnabled = result.enabled;
      this._vacStart = result.start || "";
      this._vacEnd = result.end || "";
      this._vacBuffer = result.buffer_days;
      this._vacExempt = new Set(result.exempt_task_ids || []);
      this._vacIsActive = result.is_active;
      this._vacWindowEnd = result.window_end;
      this.dispatchEvent(new CustomEvent("settings-changed"));
    } catch (e7) {
      const msg = e7?.message || t3("action_error", this._lang);
      this._showToast(msg);
    } finally {
      this._vacSaving = false;
    }
  }
  _toggleVacationEnabled(on) {
    this._saveVacation({ enabled: on });
  }
  _setVacationDate(which, value) {
    const patch = {};
    patch[which] = value || null;
    this._saveVacation(patch);
  }
  _setVacationBuffer(value) {
    if (value < 0 || value > 14) return;
    this._saveVacation({ buffer_days: value });
  }
  _toggleVacationExempt(taskId, on) {
    const next = new Set(this._vacExempt);
    if (on) next.add(taskId);
    else next.delete(taskId);
    this._saveVacation({ exempt_task_ids: [...next] });
  }
  async _loadVacationPreview() {
    this._vacPreviewLoading = true;
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/vacation/preview"
      });
      this._vacPreview = result.rows || [];
    } catch {
      this._showToast(t3("action_error", this._lang));
    } finally {
      this._vacPreviewLoading = false;
    }
  }
  async _previewActionComplete(row) {
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/complete",
        entry_id: row.entry_id,
        task_id: row.task_id
      });
      this._showToast(t3("vacation_marked_complete", this._lang));
      await this._loadVacationPreview();
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  async _previewActionSkip(row) {
    try {
      await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/task/skip",
        entry_id: row.entry_id,
        task_id: row.task_id,
        reason: "Skipped before vacation"
      });
      this._showToast(t3("vacation_marked_skip", this._lang));
      await this._loadVacationPreview();
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  async _endVacationNow() {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/vacation/end_now"
      });
      this._vacEnabled = result.enabled;
      this._vacEnd = result.end || "";
      this._vacIsActive = result.is_active;
      this._vacWindowEnd = result.window_end;
      this.dispatchEvent(new CustomEvent("settings-changed"));
      this._showToast(t3("vacation_ended", this._lang));
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  // --- Section: Print QR codes (v1.1.0) ---
  _renderPrintQr(L2) {
    const selectedCount = this._qrSelectedEntries.size || this._qrObjects.length;
    const actionCount = this._qrActions.size;
    const estimatedQrs = selectedCount * actionCount;
    const overLimit = estimatedQrs > 200;
    return b2`
      <div class="settings-section qr-print-section">
        <h3>${t3("qr_print_title", L2)}</h3>
        <p class="section-desc">${t3("qr_print_desc", L2)}</p>

        ${!this._qrObjectsLoaded ? b2`<button @click=${this._loadQrObjects}>${t3("qr_print_load", L2)}</button>` : b2`
            <details open class="qr-filter-panel">
              <summary>${t3("qr_print_filter", L2)}</summary>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${t3("qr_print_objects", L2)}</div>
                <div class="qr-object-list">
                  ${this._qrObjects.length === 0 ? b2`<div class="hint">${t3("no_objects", L2)}</div>` : this._qrObjects.map((obj) => b2`
                      <label class="qr-object-row">
                        <input type="checkbox"
                          .checked=${this._qrSelectedEntries.size === 0 || this._qrSelectedEntries.has(obj.entry_id)}
                          @change=${(e7) => this._toggleQrObject(obj.entry_id, e7.target.checked)} />
                        <span>${obj.name}</span>
                        <span class="qr-task-count">${obj.task_count}</span>
                      </label>
                    `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${t3("qr_print_actions", L2)}</div>
                <div class="qr-action-chips">
                  ${["view", "complete", "skip"].map((a3) => b2`
                    <label class="qr-action-chip ${this._qrActions.has(a3) ? "active" : ""}">
                      <input type="checkbox"
                        .checked=${this._qrActions.has(a3)}
                        @change=${(e7) => this._toggleQrAction(a3, e7.target.checked)} />
                      ${t3("qr_action_" + a3, L2)}
                    </label>
                  `)}
                </div>
              </div>

              <div class="qr-filter-group">
                <div class="qr-filter-label">${t3("qr_print_url_mode", L2)}</div>
                <select .value=${this._qrUrlMode}
                  @change=${(e7) => {
      this._qrUrlMode = e7.target.value;
    }}>
                  <option value="companion">${t3("qr_mode_companion", L2)}</option>
                  <option value="local">${t3("qr_mode_local", L2)}</option>
                  <option value="server">${t3("qr_mode_server", L2)}</option>
                </select>
              </div>

              <div class="qr-filter-group qr-filter-actions">
                <div class="qr-estimate ${overLimit ? "error" : ""}">
                  ${t3("qr_print_estimate", L2)}: <strong>${estimatedQrs}</strong>
                  ${overLimit ? b2` — ${t3("qr_print_over_limit", L2)}` : A}
                </div>
                <button
                  ?disabled=${this._qrBatchLoading || overLimit || actionCount === 0}
                  @click=${this._generateBatch}>
                  ${this._qrBatchLoading ? t3("qr_print_generating", L2) : t3("qr_print_generate", L2)}
                </button>
              </div>
            </details>

            ${this._qrBatchResults.length > 0 ? b2`
                <div class="qr-results-toolbar">
                  <span>${this._qrBatchResults.length} ${t3("qr_print_ready", L2)}</span>
                  <button @click=${this._printQrs}>${t3("qr_print_print_button", L2)}</button>
                </div>
                <div class="qr-print-grid">
                  ${this._qrBatchResults.map((q) => b2`
                    <div class="qr-print-cell">
                      <div class="qr-svg">${o6(q.svg)}</div>
                      <div class="qr-label">
                        <div class="qr-label-obj">${q.object_name}</div>
                        <div class="qr-label-task">${q.task_name}</div>
                        <div class="qr-label-action">${t3("qr_action_" + q.action, L2)}</div>
                      </div>
                    </div>
                  `)}
                </div>
              ` : A}
          `}
      </div>
    `;
  }
  async _loadQrObjects() {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/objects"
      });
      this._qrObjects = (result.objects || []).map((o7) => ({
        entry_id: o7.entry_id,
        name: o7.object.name,
        task_count: (o7.tasks || []).length
      })).sort((a3, b3) => a3.name.localeCompare(b3.name));
      this._qrObjectsLoaded = true;
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  _toggleQrObject(entryId, on) {
    const next = new Set(this._qrSelectedEntries);
    if (next.size === 0) {
      for (const o7 of this._qrObjects) next.add(o7.entry_id);
    }
    if (on) next.add(entryId);
    else next.delete(entryId);
    if (next.size === this._qrObjects.length) next.clear();
    this._qrSelectedEntries = next;
  }
  _toggleQrAction(action, on) {
    const next = new Set(this._qrActions);
    if (on) next.add(action);
    else next.delete(action);
    this._qrActions = next;
  }
  async _generateBatch() {
    this._qrBatchLoading = true;
    this._qrBatchResults = [];
    try {
      const msg = {
        type: "maintenance_supporter/qr/batch_generate",
        actions: [...this._qrActions],
        url_mode: this._qrUrlMode
      };
      if (this._qrSelectedEntries.size > 0) {
        msg.entry_ids = [...this._qrSelectedEntries];
      }
      const result = await this.hass.connection.sendMessagePromise(msg);
      this._qrBatchResults = result.qrs || [];
      if (this._qrBatchResults.length === 0) {
        this._showToast(t3("qr_print_empty", this._lang));
      }
    } catch (e7) {
      const msg = e7?.message || t3("action_error", this._lang);
      this._showToast(msg);
    } finally {
      this._qrBatchLoading = false;
    }
  }
  _printQrs() {
    if (this._qrBatchResults.length === 0) return;
    const L2 = this._lang;
    const cells = this._qrBatchResults.map((q) => {
      const actionLabel = t3("qr_action_" + q.action, L2);
      return `
        <div class="cell">
          <div class="qr">${q.svg}</div>
          <div class="label">
            <div class="obj">${this._escapeHtml(q.object_name)}</div>
            <div class="task">${this._escapeHtml(q.task_name)}</div>
            <div class="action">${this._escapeHtml(actionLabel)}</div>
          </div>
        </div>`;
    }).join("");
    const title = t3("qr_print_title", L2);
    const html = `<!DOCTYPE html>
<html lang="${this._escapeHtml(L2)}">
<head>
  <meta charset="utf-8" />
  <title>${this._escapeHtml(title)}</title>
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
    <h1>${this._escapeHtml(title)} \u2014 ${this._qrBatchResults.length}</h1>
    <button onclick="window.print()">${this._escapeHtml(t3("qr_print_print_button", L2))}</button>
  </div>
  <div class="grid">${cells}</div>
  <script>window.addEventListener("load", function () { setTimeout(function () { window.print(); }, 250); });<\/script>
</body>
</html>`;
    const win = window.open("", "_blank", "width=900,height=1100");
    if (!win) {
      window.print();
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
  _escapeHtml(s4) {
    return s4.replace(/[&<>"']/g, (c4) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[c4]);
  }
  _renderImportExport(L2) {
    return b2`
      <div class="settings-section">
        <h3>${t3("settings_import_export", L2)}</h3>
        <div class="settings-actions">
          <label class="export-history-toggle">
            <input type="checkbox" .checked=${this._includeHistory}
              @change=${(e7) => {
      this._includeHistory = e7.target.checked;
    }} />
            ${t3("settings_include_history", L2)}
          </label>
        </div>
        <div class="settings-actions">
          ${!this._exportObjectsLoaded ? b2`<button @click=${this._loadExportObjects}>${t3("settings_export_selection", L2)}</button>` : b2`
              <details class="qr-filter-panel">
                <summary>${t3("settings_export_selection", L2)}</summary>
                <div class="qr-object-list">
                  ${this._exportObjects.length === 0 ? b2`<div class="hint">${t3("no_objects", L2)}</div>` : this._exportObjects.map((obj) => b2`
                      <label class="qr-object-row">
                        <input type="checkbox"
                          .checked=${this._exportSelectedEntries.size === 0 || this._exportSelectedEntries.has(obj.entry_id)}
                          @change=${(e7) => this._toggleExportObject(obj.entry_id, e7.target.checked)} />
                        <span>${obj.name}</span>
                        <span class="qr-task-count">${obj.task_count}</span>
                      </label>
                    `)}
                </div>
              </details>
            `}
        </div>
        <div class="settings-actions">
          <button @click=${this._exportJson}>${t3("settings_export_json", L2)}</button>
          <button @click=${this._exportYaml}>${t3("settings_export_yaml", L2)}</button>
          <button @click=${this._exportCsv}>${t3("settings_export_csv", L2)}</button>
          <button @click=${this._exportSettings}>${t3("settings_export_settings", L2)}</button>
        </div>
        <div class="settings-actions docs-archive-block">
          <h4>${t3("settings_docs_archive", L2)}</h4>
          <p class="section-desc">${t3("settings_docs_archive_hint", L2)}</p>
          <div class="settings-actions">
            <button ?disabled=${this._docArchiveLoading} @click=${this._exportDocsArchive}>
              ${t3("settings_docs_export_btn", L2)}
            </button>
            <button ?disabled=${this._docArchiveLoading} @click=${this._triggerDocsArchiveImport}>
              ${this._docArchiveLoading ? "\u2026" : t3("settings_docs_import_btn", L2)}
            </button>
            <input class="docs-archive-file" type="file" accept=".zip" hidden
              @change=${this._importDocsArchive} />
          </div>
        </div>
        <div class="import-section">
          <textarea class="import-area" .value=${this._importCsv}
            placeholder=${t3("settings_import_placeholder", L2)}
            @input=${(e7) => {
      this._importCsv = e7.target.value;
    }}
          ></textarea>
          <div class="settings-actions">
            <button ?disabled=${!this._importCsv.trim() || this._importLoading}
              @click=${this._importCsvAction}>
              ${this._importLoading ? "\u2026" : t3("settings_import_btn", L2)}
            </button>
          </div>
        </div>
      </div>
    `;
  }
  // --- Export / Import actions ---
  get _selectedEntryIds() {
    return this._exportSelectedEntries.size ? [...this._exportSelectedEntries] : void 0;
  }
  async _loadExportObjects() {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/objects"
      });
      this._exportObjects = (result.objects || []).map((o7) => ({
        entry_id: o7.entry_id,
        name: o7.object.name,
        task_count: (o7.tasks || []).length
      })).sort((a3, b3) => a3.name.localeCompare(b3.name));
      this._exportObjectsLoaded = true;
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  _toggleExportObject(entryId, on) {
    const next = new Set(this._exportSelectedEntries);
    if (next.size === 0) {
      for (const o7 of this._exportObjects) next.add(o7.entry_id);
    }
    if (on) next.add(entryId);
    else next.delete(entryId);
    if (next.size === this._exportObjects.length) next.clear();
    this._exportSelectedEntries = next;
  }
  async _exportJson() {
    try {
      const ids = this._selectedEntryIds;
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/export",
        format: "json",
        include_history: this._includeHistory,
        ...ids ? { entry_ids: ids } : {}
      });
      const ts = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      this._downloadFile(result.data, `maintenance_export_${ts}.json`, "application/json");
      this._showToast(t3("settings_export_success", this._lang));
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  /** The SECOND export: the global entry's settings (groups, saved views,
   *  vacation, notification/budget settings, feature toggles) — the objects
   *  export deliberately excludes them. Re-import via the regular import. */
  async _exportSettings() {
    try {
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/settings/export"
      });
      const ts = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      this._downloadFile(result.data, `maintenance_settings_${ts}.json`, "application/json");
      this._showToast(t3("settings_export_success", this._lang));
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  async _exportYaml() {
    try {
      const ids = this._selectedEntryIds;
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/export",
        format: "yaml",
        include_history: this._includeHistory,
        ...ids ? { entry_ids: ids } : {}
      });
      const ts = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      this._downloadFile(result.data, `maintenance_export_${ts}.yaml`, "application/yaml");
      this._showToast(t3("settings_export_success", this._lang));
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  async _exportCsv() {
    try {
      const ids = this._selectedEntryIds;
      const result = await this.hass.connection.sendMessagePromise({
        type: "maintenance_supporter/csv/export",
        ...ids ? { entry_ids: ids } : {}
      });
      const ts = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      this._downloadFile(result.csv, `maintenance_export_${ts}.csv`, "text/csv");
      this._showToast(t3("settings_export_success", this._lang));
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
  }
  async _importCsvAction() {
    const content = this._importCsv.trim();
    if (!content) return;
    this._importLoading = true;
    try {
      const isCsv = content.startsWith("object_name");
      const result = await this.hass.connection.sendMessagePromise(
        isCsv ? { type: "maintenance_supporter/csv/import", csv_content: content } : { type: "maintenance_supporter/json/import", json_content: content }
      );
      const count = result.created ?? 0;
      this._showToast(t3("settings_import_success", this._lang).replace("{count}", String(count)));
      this._importCsv = "";
      this.dispatchEvent(new CustomEvent("settings-changed"));
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
    this._importLoading = false;
  }
  // --- Documents archive (ZIP with file contents) ---
  async _exportDocsArchive() {
    this._docArchiveLoading = true;
    try {
      const raw = this._selectedEntryIds;
      const q = raw ? `?entry_ids=${encodeURIComponent(raw.join(","))}` : "";
      const signed = await signApiPath(this.hass, `/api/maintenance_supporter/documents/archive${q}`);
      downloadUrl(signed, "maintenance-documents.zip");
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
    this._docArchiveLoading = false;
  }
  _triggerDocsArchiveImport() {
    const input = this.renderRoot.querySelector(".docs-archive-file");
    input?.click();
  }
  async _importDocsArchive(e7) {
    const input = e7.target;
    const file = input.files?.[0];
    if (!file) return;
    this._docArchiveLoading = true;
    try {
      const form = new FormData();
      form.append("file", file, file.name);
      const resp = await fetch("/api/maintenance_supporter/documents/archive", {
        method: "POST",
        headers: { Authorization: `Bearer ${this.hass.auth?.data?.access_token ?? ""}` },
        body: form
      });
      if (!resp.ok) {
        this._showToast(t3("action_error", this._lang));
      } else {
        const result = await resp.json();
        this._showToast(
          t3("settings_docs_import_success", this._lang).replace("{blobs}", String(result.blobs_written ?? 0)).replace("{docs}", String(result.documents_created ?? 0))
        );
        this.dispatchEvent(new CustomEvent("settings-changed"));
      }
    } catch {
      this._showToast(t3("action_error", this._lang));
    }
    input.value = "";
    this._docArchiveLoading = false;
  }
};
// --- Styles ---
MaintenanceSettingsView.styles = i`
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
    .notify-per-person {
      padding: 10px 0;
      border-bottom: 1px solid var(--divider-color, #e0e0e0);
    }
    .notify-person-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 0 0;
      flex-wrap: wrap;
    }
    .notify-person-name {
      font-weight: 500;
      min-width: 120px;
    }
    .notify-person-target {
      flex: 1;
      min-width: 160px;
      font-size: 0.9em;
      word-break: break-word;
      color: var(--secondary-text-color, #727272);
    }
    .notify-person-target.muted {
      font-style: italic;
    }
    /* v2.27: template gallery clustered by category */
    .tpl-group { margin-top: 14px; }
    .tpl-group-head {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0 6px;
      border-bottom: 2px solid var(--divider-color, #e0e0e0);
      cursor: pointer;
      font-weight: 600;
    }
    .tpl-group-head ha-icon { --mdc-icon-size: 18px; color: var(--primary-color); }
    .tpl-group-head .tpl-chevron { color: var(--secondary-text-color); }
    .tpl-group-head:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .tpl-group-name { flex: 1; }
    .tpl-group-count {
      font-size: 12px;
      color: var(--secondary-text-color);
      font-weight: 400;
    }
    .tpl-row { padding-left: 26px; }
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
  `;
__decorateClass([
  n4({ attribute: false })
], MaintenanceSettingsView.prototype, "hass", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceSettingsView.prototype, "features", 2);
__decorateClass([
  n4({ attribute: false })
], MaintenanceSettingsView.prototype, "budget", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_settings", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_loading", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_importCsv", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_importLoading", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_includeHistory", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_toast", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_testingNotification", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_personTargets", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_testingUser", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_users", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_savedViews", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacEnabled", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacStart", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacEnd", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacBuffer", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacExempt", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacIsActive", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacWindowEnd", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacAllTasks", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacPreview", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacPreviewLoading", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_vacSaving", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_qrObjects", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_qrSelectedEntries", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_qrActions", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_qrUrlMode", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_qrBatchLoading", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_qrBatchResults", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_qrObjectsLoaded", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_exportObjects", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_exportSelectedEntries", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_exportObjectsLoaded", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_docArchiveLoading", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_allTemplates", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_templateCategories", 2);
__decorateClass([
  r5()
], MaintenanceSettingsView.prototype, "_tplOpenGroups", 2);
customElements.define("maintenance-settings-view", MaintenanceSettingsView);

// ds-entry.ts
init_ms_textfield();

// ds-preview-kit.ts
var T2 = (over) => ({
  type: "custom",
  schedule_type: "time_based",
  interval_days: 30,
  interval_unit: "days",
  warning_days: 7,
  status: "ok",
  days_until_due: 12,
  next_due: "2026-09-05",
  last_performed: "2026-08-06",
  trigger_active: false,
  trigger_current_value: null,
  trigger_config: null,
  times_performed: 4,
  total_cost: 0,
  average_duration: null,
  history: [],
  checklist: [],
  labels: [],
  priority: "normal",
  enabled: true,
  archived: false,
  is_done: false,
  responsible_user_id: null,
  nfc_tag_id: null,
  entity_slug: null,
  ...over
});
var HISTORY = [
  { timestamp: "2026-08-06T09:12:00+00:00", type: "completed", notes: "Rinsed and dried the filter", cost: 0, duration: 15, completed_by: "admin-1" },
  { timestamp: "2026-07-05T16:40:00+00:00", type: "completed", cost: 24.9, duration: 20 },
  { timestamp: "2026-06-07T10:05:00+00:00", type: "skipped", notes: "On vacation" },
  { timestamp: "2026-05-04T08:30:00+00:00", type: "completed", duration: 15 }
];
var OBJECTS = [
  {
    entry_id: "demo_hvac",
    object_id: "obj_demo_hvac",
    object: { id: "obj_demo_hvac", name: "HVAC Unit", area_id: "living_room", manufacturer: "Daikin", model: "FTXM35", serial_number: "DK-2231-88", task_ids: [] },
    document_count: 2,
    tasks: [
      T2({ id: "t_filter", name: "Clean air filter", status: "overdue", days_until_due: -6, next_due: "2026-08-18", history: HISTORY, times_performed: 12, total_cost: 74.7, average_duration: 17, checklist: ["Remove front cover", "Vacuum filter", "Rinse and dry", "Reinsert"], labels: ["filters"], priority: "high" }),
      T2({ id: "t_coils", name: "Inspect condenser coils", status: "due_soon", days_until_due: 3, next_due: "2026-08-27", interval_days: 180 }),
      T2({ id: "t_refrigerant", name: "Professional service", status: "ok", days_until_due: 122, next_due: "2026-12-24", interval_days: 365, priority: "low" })
    ]
  },
  {
    entry_id: "demo_vacuum",
    object_id: "obj_demo_vacuum",
    object: { id: "obj_demo_vacuum", name: "Robot Vacuum", area_id: "hallway", manufacturer: "Roborock", model: "S8 Pro", serial_number: null, task_ids: [] },
    document_count: 1,
    tasks: [
      T2({
        id: "t_brush",
        name: "Replace main brush",
        status: "triggered",
        trigger_active: true,
        trigger_current_value: 312.4,
        schedule_type: "sensor_based",
        interval_days: null,
        days_until_due: null,
        next_due: null,
        trigger_config: { type: "runtime", entity_id: "sensor.vacuum_brush_hours", trigger_runtime_hours: 300 }
      }),
      T2({ id: "t_dustbin", name: "Empty dust bin", status: "ok", days_until_due: 2, next_due: "2026-08-26", interval_days: 3, warning_days: 1, times_performed: 89 }),
      T2({ id: "t_sensor_wipe", name: "Wipe cliff sensors", status: "due_soon", days_until_due: 1, next_due: "2026-08-25", interval_days: 14 })
    ]
  },
  {
    entry_id: "demo_pool",
    object_id: "obj_demo_pool",
    object: { id: "obj_demo_pool", name: "Pool Pump", area_id: "garden", manufacturer: "Intex", model: "SX2100", serial_number: "IX-9034", task_ids: [] },
    document_count: 0,
    tasks: [
      T2({ id: "t_backwash", name: "Backwash sand filter", status: "ok", days_until_due: 9, next_due: "2026-09-02", interval_days: 21, responsible_user_id: "user-2" }),
      T2({ id: "t_ph", name: "Test water chemistry", status: "overdue", days_until_due: -2, next_due: "2026-08-22", interval_days: 7, type: "reading", priority: "high" }),
      T2({ id: "t_winterize", name: "Winterize pump", status: "ok", schedule_type: "one_time", interval_days: null, days_until_due: 68, next_due: "2026-10-31" })
    ]
  }
];
var PARTS = [
  { id: "p_filter", name: "HEPA filter", stock: 2, min_stock: 1, unit: "pcs", storage_location: "Utility shelf", cost: 12.5 },
  { id: "p_brush", name: "Main brush", stock: 0, min_stock: 1, unit: "pcs", storage_location: "Utility shelf", cost: 18.9 },
  { id: "p_chlorine", name: "Chlorine tabs", stock: 14, min_stock: 5, unit: "tabs", storage_location: "Garden shed", cost: 0.8 }
];
var USERS = [
  { id: "admin-1", name: "Alex", is_admin: true },
  { id: "user-2", name: "Sam", is_admin: false }
];
var BATTERY_ROSTER = [
  { device_id: "bat_smoke", name: "Smoke Detector Hall", battery_type: "9V", level: 12, status: "due", source: "battery_notes", predicted_date: "2026-08-30", last_replaced: "2025-11-02" },
  { device_id: "bat_door", name: "Front Door Sensor", battery_type: "CR2032", level: 34, status: "soon", source: "battery_notes", predicted_date: "2026-10-12", last_replaced: "2026-01-15" },
  { device_id: "bat_remote", name: "Bedroom Remote", battery_type: "AAA", level: 81, status: "ok", source: "native", predicted_date: null, last_replaced: null },
  { device_id: "bat_ring", name: "Fitness Ring", battery_type: "Rechargeable", level: 64, status: "ok", source: "battery_notes", self_charging: true, predicted_date: null, last_replaced: null }
];
var SETTINGS = {
  features: {
    adaptive: true,
    predictions: true,
    seasonal: true,
    environmental: false,
    budget: true,
    groups: true,
    checklists: true,
    schedule_time: true,
    completion_actions: true
  },
  admin_panel_user_ids: [],
  operator_write_enabled: false,
  general: { default_warning_days: 7, notifications_enabled: true, notify_service: "notify.mobile_app_demo", notify_targets: [], panel_enabled: true },
  notifications: {
    due_soon_enabled: true,
    due_soon_interval_hours: 24,
    overdue_enabled: true,
    overdue_interval_hours: 12,
    triggered_enabled: true,
    triggered_interval_hours: 0,
    quiet_hours_enabled: true,
    quiet_hours_start: "22:00",
    quiet_hours_end: "08:00",
    max_per_day: 0,
    bundling_enabled: false,
    bundle_threshold: 2,
    title_style: "default"
  },
  actions: { complete_enabled: true, skip_enabled: true, snooze_enabled: false, snooze_duration_hours: 4 },
  budget: { monthly: 150, yearly: 1500, alerts_enabled: true, alert_threshold_pct: 80, currency: "EUR", currency_symbol: "\u20AC" },
  vacation: { enabled: false, start: null, end: null, buffer_days: 3, exempt_task_ids: [], is_active: false, window_end: null }
};
var READS = {
  "maintenance_supporter/objects": () => ({ objects: OBJECTS }),
  "maintenance_supporter/object": (msg) => OBJECTS.find((o7) => o7.entry_id === msg.entry_id) ?? OBJECTS[0],
  "maintenance_supporter/statistics": () => ({
    total_objects: 3,
    total_tasks: 9,
    overdue: 2,
    due_soon: 2,
    triggered: 1,
    ok: 4,
    total_cost: 214.6,
    completions_this_month: 5
  }),
  "maintenance_supporter/budget_status": () => ({
    monthly_budget: 150,
    monthly_spent: 37.4,
    yearly_budget: 1500,
    yearly_spent: 812.55,
    alert_threshold_pct: 80,
    currency_symbol: "\u20AC"
  }),
  "maintenance_supporter/settings": () => SETTINGS,
  "maintenance_supporter/users/list": () => ({ users: USERS }),
  "maintenance_supporter/tags/list": () => ({ tags: ["filters", "outdoor", "safety"] }),
  "maintenance_supporter/groups": () => ({
    groups: {
      g_seasonal: { name: "Seasonal", task_refs: [{ entry_id: "demo_pool", task_id: "t_winterize" }], color: "#43a047" },
      g_weekly: { name: "Weekly routine", task_refs: [{ entry_id: "demo_vacuum", task_id: "t_dustbin" }, { entry_id: "demo_pool", task_id: "t_ph" }], color: "#03a9f4" }
    }
  }),
  "maintenance_supporter/documents/list": () => ({
    documents: [
      { id: "doc_manual", title: "FTXM35 owner's manual", kind: "file", file_name: "ftxm35-manual.pdf", mime: "application/pdf", size: 24e5, task_ids: ["t_filter"], part_ids: [] },
      { id: "doc_link", title: "Filter cleaning guide", kind: "weblink", url: "https://example.com/filter-guide", task_ids: ["t_filter"], part_ids: ["p_filter"] }
    ]
  }),
  "maintenance_supporter/documents/storage": () => ({ used_bytes: 51e5, max_bytes: 52428800, document_count: 3 }),
  "maintenance_supporter/views/list": () => ({ views: [{ id: "v_mine", name: "My tasks", filters: { responsible: "admin-1" } }] }),
  "maintenance_supporter/vacation/state": () => ({ enabled: false, is_active: false, start: null, end: null, buffer_days: 3, exempt_task_ids: [] }),
  "maintenance_supporter/parts/overview": () => ({ parts: PARTS.map((p3) => ({ ...p3, object_name: "HVAC Unit", entry_id: "demo_hvac" })) }),
  "maintenance_supporter/task/history": () => ({ history: HISTORY }),
  "maintenance_supporter/battery_fleet/status": () => ({ configured: true, entry_id: "demo_hvac", task_id: "t_batteries" }),
  "maintenance_supporter/battery_fleet/overview": () => ({
    batteries: BATTERY_ROSTER,
    due: 1,
    soon: 1,
    total: 4,
    shopping: [{ battery_type: "9V", count: 1 }, { battery_type: "CR2032", count: 1 }]
  }),
  "maintenance_supporter/battery_fleet/overview_history": () => ({
    history: [
      { timestamp: "2026-07-30T10:00:00+00:00", type: "completed", notes: "Replaced: Smoke Detector Hall (9V)" },
      { timestamp: "2026-05-14T18:20:00+00:00", type: "completed", notes: "Replaced: Front Door Sensor (CR2032)" }
    ]
  }),
  "maintenance_supporter/templates": () => ({ templates: [] }),
  "maintenance_supporter/version": () => ({ version: "2.63.1" }),
  "maintenance_supporter/notify/user_targets": () => ({ targets: [] }),
  "maintenance_supporter/entity/attributes": () => ({ attributes: {} }),
  "maintenance_supporter/schedule/preview": () => ({ occurrences: ["2026-09-05", "2026-10-05", "2026-11-05"], series_ended: false }),
  "maintenance_supporter/task/seasonal_overrides": () => ({ overrides: [] })
};
function dsDemoHass(opts = {}) {
  const sendMessagePromise = async (msg) => {
    const t5 = String(msg.type ?? "");
    const h3 = opts.handlers?.[t5] ?? READS[t5];
    if (h3) return h3(msg);
    return { success: true };
  };
  return {
    language: opts.language ?? "en",
    user: { id: "admin-1", name: "Alex", is_admin: true },
    areas: { living_room: { name: "Living Room" }, hallway: { name: "Hallway" }, garden: { name: "Garden" } },
    states: {},
    services: {},
    connection: {
      sendMessagePromise,
      subscribeMessage: async () => () => void 0
    },
    callService: async () => void 0
  };
}
function dsProps(props) {
  return (el) => {
    if (el) Object.assign(el, props);
  };
}
var DS_DEMO = { OBJECTS, PARTS, USERS, HISTORY, BATTERY_ROSTER, SETTINGS };
export {
  DS_DEMO,
  DS_MDI_PATHS,
  MaintenanceAdoptProblemSensorsDialog,
  MaintenanceBatteryFleetCard,
  MaintenanceBatteryFleetSection,
  MaintenanceBudgetSectionCard,
  MaintenanceCalendarCard,
  MaintenanceCompleteDialog,
  MaintenanceConfirmDialog,
  MaintenanceDocumentsSection,
  MaintenanceGroupDialog,
  MaintenanceGroupsSectionCard,
  MaintenanceHistoryEditDialog,
  MaintenanceHistoryPhoto,
  MaintenanceObjectDialog,
  MaintenanceObjectQuickActionsDialog,
  MaintenancePartsSection,
  MaintenanceQrDialog,
  MaintenanceSavedViewsDialog,
  MaintenanceSettingsView,
  MaintenanceStorageSectionCard,
  MaintenanceSuggestedSetupsDialog,
  MaintenanceSupporterCard,
  MaintenanceTaskDetailView,
  MaintenanceTaskDialog,
  MaintenanceTaskDocuments,
  MaintenanceTaskQuickActionsDialog,
  MaintenanceTriggerChart,
  MaintenanceVacationSectionCard,
  MsTextfield,
  SeasonalOverridesDialog,
  dsDemoHass,
  dsProps
};
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
