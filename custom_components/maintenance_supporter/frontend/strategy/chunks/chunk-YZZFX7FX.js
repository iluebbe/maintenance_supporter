/*! maintenance_supporter frontend 2.120.0 */
import{f as t}from"./chunk-3AZAKAJO.js";import{a as e}from"./chunk-MD5RW5PH.js";function r(o){!(o instanceof HTMLElement)||typeof o.showPopover!="function"||queueMicrotask(()=>{if(!(!o.isConnected||o.matches(":popover-open")))try{o.showPopover()}catch{}})}var p=t(r),s=e`
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
`;export{p as a,s as b};
