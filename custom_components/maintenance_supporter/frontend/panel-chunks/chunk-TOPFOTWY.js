/*! maintenance_supporter frontend 2.125.0 */
import{b as i,e as l,ja as n}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-BG47Z4B6.js";function d(e){return Array.from({length:7},(a,r)=>n(r,e,"short"))}function p(e){let a=d(e.lang);return l`
    <div class="weekday-chips ${e.cls??""}" role="group" aria-label=${e.label??""}>
      ${a.map((r,o)=>{let t=e.selected.includes(o);return l`
          <button
            type="button"
            class="weekday-chip ${t?"selected":""}"
            data-day=${o}
            aria-pressed=${t?"true":"false"}
            ?disabled=${!!e.disabled?.includes(o)}
            @click=${()=>e.onToggle(o)}
          >${r}</button>`})}
    </div>`}var u=i`
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
  .weekday-chip:disabled {
    opacity: 0.45;
    cursor: default;
  }
`;function b(e,a){return e.includes(a)?e.filter(r=>r!==a):[...e,a].sort((r,o)=>r-o)}export{d as a,p as b,u as c,b as d};
