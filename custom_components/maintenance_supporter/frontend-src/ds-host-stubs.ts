/** design-sync host-element fallbacks.
 *
 * Every component in this library composes Home Assistant host elements
 * (`ha-card`, `ha-icon`, `ha-dialog`, …) that only exist inside a running HA
 * frontend. Outside HA — design-system previews, and every design the
 * claude.ai/design agent builds with this bundle — those tags would upgrade
 * to nothing and the UI would render bare. This module registers minimal,
 * HA-look-alike fallbacks for exactly the tags this library uses.
 *
 * FIRST-WINS: each define is guarded with `customElements.get(tag)`. Inside
 * real Home Assistant the genuine elements are registered long before this
 * bundle loads, so these stubs never take effect there. They are a rendering
 * environment, not a reimplementation of any library component.
 *
 * Deliberately decorator-free (plain `static properties`) so the file
 * compiles under any TS/esbuild decorator configuration.
 */

import { LitElement, css, html, nothing } from "lit";
import { DS_MDI_PATHS } from "./ds-mdi-map";

const define = (tag: string, cls: CustomElementConstructor): void => {
  if (!customElements.get(tag)) customElements.define(tag, cls);
};

const svgIcon = (path: string | undefined, size = "100%") => {
  const d = path || DS_MDI_PATHS["mdi:circle-medium"];
  const el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  el.setAttribute("viewBox", "0 0 24 24");
  // Inline (beats any host CSS) — the picker stub passes a FIXED size, the
  // icon hosts constrain via their own box.
  el.style.width = size;
  el.style.height = size;
  el.style.fill = "currentColor";
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", d);
  el.appendChild(p);
  return el;
};

class DsHaIcon extends LitElement {
  static properties = { icon: { type: String } };
  declare icon?: string;
  static styles = css`
    :host { display: inline-flex; width: var(--mdc-icon-size, 24px); height: var(--mdc-icon-size, 24px); vertical-align: middle; }
  `;
  render() {
    return svgIcon(this.icon ? DS_MDI_PATHS[this.icon] : undefined);
  }
}
define("ha-icon", DsHaIcon);

class DsHaSvgIcon extends LitElement {
  static properties = { path: { type: String } };
  declare path?: string;
  static styles = css`
    :host { display: inline-flex; width: var(--mdc-icon-size, 24px); height: var(--mdc-icon-size, 24px); vertical-align: middle; }
  `;
  render() {
    return svgIcon(this.path);
  }
}
define("ha-svg-icon", DsHaSvgIcon);

class DsHaCard extends LitElement {
  static properties = { header: { type: String } };
  declare header?: string;
  static styles = css`
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
  render() {
    return html`${this.header ? html`<h1 class="hdr">${this.header}</h1>` : nothing}<slot></slot>`;
  }
}
define("ha-card", DsHaCard);

class DsHaButton extends LitElement {
  static properties = { appearance: { type: String }, disabled: { type: Boolean } };
  declare appearance?: string;
  declare disabled?: boolean;
  static styles = css`
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
  render() {
    return html`<button ?disabled=${this.disabled}><slot></slot></button>`;
  }
}
define("ha-button", DsHaButton);

class DsIconButton extends LitElement {
  static properties = { path: { type: String }, disabled: { type: Boolean }, label: { type: String } };
  declare path?: string;
  declare disabled?: boolean;
  declare label?: string;
  static styles = css`
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
  render() {
    return html`<button ?disabled=${this.disabled} aria-label=${this.label ?? ""}>
      ${this.path ? svgIcon(this.path) : html`<slot></slot>`}
    </button>`;
  }
}
define("ha-icon-button", DsIconButton);
// A constructor can only ever be defined ONCE per registry — the second tag
// needs its own subclass.
define("mwc-icon-button", class extends DsIconButton {});

class DsHaTextfield extends LitElement {
  static properties = { label: { type: String }, value: { type: String }, type: { type: String }, disabled: { type: Boolean } };
  declare label?: string;
  declare value?: string;
  declare type?: string;
  declare disabled?: boolean;
  static styles = css`
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
  render() {
    return html`
      ${this.label ? html`<label>${this.label}</label>` : nothing}
      <input
        .value=${this.value ?? ""}
        type=${this.type ?? "text"}
        ?disabled=${this.disabled}
        @input=${(e: Event) => { this.value = (e.target as HTMLInputElement).value; }}
      />
    `;
  }
}
define("ha-textfield", DsHaTextfield);

class DsHaDialog extends LitElement {
  static properties = { open: { type: Boolean }, heading: { type: String } };
  declare open?: boolean;
  declare heading?: string;
  static styles = css`
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
  render() {
    if (!this.open) return nothing;
    return html`
      <div class="scrim" @click=${() => this.dispatchEvent(new CustomEvent("closed"))}></div>
      <div class="panel">
        ${this.heading ? html`<div class="heading">${this.heading}</div>` : nothing}
        <slot></slot>
      </div>
    `;
  }
}
define("ha-dialog", DsHaDialog);

class DsHaSwitch extends LitElement {
  // reflect — the styles key off :host([checked]); without reflection every
  // switch rendered off (wave-1 finding).
  static properties = { checked: { type: Boolean, reflect: true }, disabled: { type: Boolean, reflect: true } };
  declare checked?: boolean;
  declare disabled?: boolean;
  static styles = css`
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
  render() {
    return html`<div class="track"><div class="thumb"></div></div>`;
  }
}
define("ha-switch", DsHaSwitch);

class DsHaFormfield extends LitElement {
  static properties = { label: { type: String } };
  declare label?: string;
  static styles = css`
    :host { display: inline-flex; align-items: center; gap: 10px; font: 400 14px Roboto, system-ui, sans-serif; }
  `;
  render() {
    return html`<slot></slot><span>${this.label ?? ""}</span>`;
  }
}
define("ha-formfield", DsHaFormfield);

/** Complex HA form machinery (entity/area/service/icon pickers, ha-form,
 * ha-selector) — outside HA these render as an honest labelled placeholder
 * field. Real pickers need HA's registry data and cannot be faked truthfully. */
class DsPickerField extends LitElement {
  static properties = { label: { type: String } };
  declare label?: string;
  static styles = css`
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
  render() {
    return html`<div class="field">${svgIcon(DS_MDI_PATHS["mdi:magnify"], "20px")} ${this.label || this.tagName.toLowerCase().replace(/^ha-/, "").replace(/-/g, " ")}</div>`;
  }
}
for (const tag of ["ha-form", "ha-selector", "ha-entities-picker", "ha-area-picker", "ha-service-picker", "ha-icon-picker"]) {
  define(tag, class extends DsPickerField {});
}

export const DS_HOST_STUBS_REGISTERED = true;
