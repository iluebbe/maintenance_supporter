/*! maintenance_supporter frontend 2.116.0 */
import{d as s}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-NHZEKRKY.js";import{c as a,f as l}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-YI3BZIUB.js";function r(e,t){return s("ha-expansion-panel")?a`
      <ha-expansion-panel class=${e.cls??""} outlined .expanded=${!!e.open}
        @expanded-changed=${n=>{n.target===n.currentTarget&&e.onToggle?.(n.detail.expanded)}}>
        <div slot="header" class=${e.headerCls??"collapsible-header"}>${e.header}</div>
        ${t}
      </ha-expansion-panel>`:a`<details class=${e.cls??""} ?open=${!!e.open}
    @toggle=${e.onToggle?n=>e.onToggle(n.target.open):l}><summary class=${e.headerCls??l}>${e.header}</summary>${t}</details>`}export{r as a};
