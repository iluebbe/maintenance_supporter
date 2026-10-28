/*! maintenance_supporter frontend 2.112.0 */
import{b as r,c as t}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KPLOXAO5.js";var d=r`
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
  /* Focused programmatically on open (so Escape works at once) — no ring. */
  .dialog:focus { outline: none; }
  /* The one part that shrinks and scrolls (min-height: 0); the header and the
     buttons around it keep their content's height. */
  .dialog-scroll {
    flex: 1 1 auto; min-height: 0;
    overflow-y: auto; overscroll-behavior: contain;
    display: flex; flex-direction: column; gap: var(--ms-modal-gap, 14px);
  }
`;function l(o,a){o.key!=="Escape"||o.defaultPrevented||o.composedPath().some(e=>e instanceof Element&&e.localName==="ms-camera-capture")||(o.preventDefault(),o.stopPropagation(),a())}function i(o,a){return t`
    <div class="backdrop" @click=${o}></div>
    <div class="dialog" role="dialog" aria-modal="true" tabindex="-1"
      @keydown=${e=>l(e,o)}>${a}</div>
  `}function c(o){o?.querySelector(".dialog")?.focus({preventScroll:!0})}export{d as a,i as b,c};
