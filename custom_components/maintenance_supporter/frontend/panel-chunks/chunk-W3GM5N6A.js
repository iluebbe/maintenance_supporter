/*! maintenance_supporter frontend 2.116.0 */
import{a as d,b as n}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-N6DVVJNR.js";import{d as i}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NHZEKRKY.js";import{b as l,c as r}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YI3BZIUB.js";var u=l`
  ${n}
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
`;function s(a,e){a.key!=="Escape"||a.defaultPrevented||a.composedPath().some(o=>o instanceof Element&&o.localName==="ms-camera-capture")||(a.preventDefault(),a.stopPropagation(),e())}function p(){return i("ha-adaptive-dialog")}function v(a,e,o={}){return p()?r`
      <ha-adaptive-dialog open .headerTitle=${o.title}
        @closed=${t=>{t.target===t.currentTarget&&a()}}>
        <div class="ha-shell-body">${e}</div>
      </ha-adaptive-dialog>
    `:r`
    <div class="modal-layer top-layer" popover="manual" ${d}>
      <div class="backdrop" @click=${a}></div>
      <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
        @keydown=${t=>s(t,a)}>${e}</div>
    </div>
  `}function g(a){a?.querySelector(".dialog")?.focus({preventScroll:!0})}export{u as a,p as b,v as c,g as d};
