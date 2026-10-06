/*! maintenance_supporter frontend 2.100.0 */
import{a as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-W3SEDH34.js";import{q as j,r as E,s as L,t as R,u as C}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZFJHBIVS.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-U7674FZW.js";import{a as _,b as S,c as A}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-HFUWDHSL.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-Q7CGGH4O.js";import{H as g,K as k,L as v,O as w,a as l,c as a,f as m,h as y,l as p,m as b,s as r,u as $,y as f}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-ZW2EWBUR.js";var q=[{key:"name",label:"area",num:!1},{key:"objects",label:"objects",num:!0},{key:"tasks",label:"tasks",num:!0},{key:"overdue",label:"overdue",num:!0},{key:"due_soon",label:"due_soon",num:!0},{key:"cost_year",label:"area_cost_year",num:!0},{key:"cost_total",label:"total_cost",num:!0},{key:"last",label:"last_performed",num:!1}],i=class extends y{constructor(){super(...arguments);this.objects=[];this.showArchived=!1;this.currencySymbol="";this._query="";this._sort=E(S(_.areaSort));this._histories=new O(this);this._localeReady=!1;this._memo=null}createRenderRoot(){return this}get _lang(){return g(this.hass)}willUpdate(t){if(super.willUpdate(t),t.has("objects")||t.has("showArchived")||t.has("hass")&&t.get("hass")===void 0){let o=this.objects.filter(s=>this.showArchived||!s.object.archived).flatMap(s=>s.tasks.map(n=>({entryId:s.entry_id,task:n})));this._histories.sync(this.hass,o)}}updated(t){super.updated(t),!this._localeReady&&this.hass&&(this._localeReady=!0,$(this._lang).then(()=>this.requestUpdate()))}_rows(t){let o=this._lang,s=[this.objects,this.showArchived,this._histories.version,this.hass?.areas,o,t];if(this._memo&&this._memo.deps.every((c,h)=>c===s[h]))return this._memo.rows;let n=j(this.objects,{showArchived:this.showArchived,areas:this.hass?.areas,noAreaLabel:r("no_area",o),year:t,historyOf:(c,h)=>this._histories.historyOf(c,h)});return this._memo={deps:s,rows:n},n}_setSort(t){this._sort=L(this._sort,t),A(_.areaSort,`${this._sort.key}:${this._sort.dir}`)}_open(t){this.dispatchEvent(new CustomEvent("open-area",{detail:{areaKey:t},bubbles:!0,composed:!0}))}_toggleArchived(){this.dispatchEvent(new CustomEvent("archived-toggle",{bubbles:!0,composed:!0}))}_headerLabel(t,o,s){return t==="area_cost_year"?r("area_cost_year",s).replace("{year}",String(o)):r(t,s)}render(){if(!this.hass)return m;let t=this._lang,o=Number(f().slice(0,4)),s=this.currencySymbol,n=this._rows(o),c=R(C(n,this._query),this._sort),h=this.objects.filter(e=>e.object.archived).length,d=e=>k(e,t);return a`
      <div class="filter-bar area-filter-bar">
        <input
          type="search"
          class="search-input"
          aria-label=${r("areas_filter",t)}
          placeholder=${r("areas_filter",t)}
          .value=${this._query}
          @input=${e=>{this._query=e.target.value}}
        />
        ${this._histories.loading?a`<span class="area-loading">${r("loading",t)}</span>`:m}
        ${h>0?a`<ha-button class="archived-toggle ${this.showArchived?"active":""}" @click=${()=>this._toggleArchived()}>
              <ha-icon icon="mdi:archive-outline"></ha-icon>
              ${this.showArchived?r("hide_archived",t):`${r("show_archived",t)} (${h})`}
            </ha-button>`:m}
      </div>
      ${n.length===0?a`<div class="empty-state">${r("no_objects",t)}</div>`:c.length===0?a`<div class="empty-state">${r("areas_filter_none",t)}</div>`:a`
          <div class="objects-table-wrap">
            <table class="objects-table areas-table">
              <thead>
                <tr>
                  ${q.map(e=>{let u=this._sort.key===e.key;return a`<th class=${e.num?"num":""}
                      aria-sort=${u?this._sort.dir==="asc"?"ascending":"descending":"none"}>
                      <button class="area-sort ${u?"active":""}" title=${r("sort_label",t)} @click=${()=>this._setSort(e.key)}>
                        ${this._headerLabel(e.label,o,t)}
                        ${u?a`<ha-icon icon=${this._sort.dir==="asc"?"mdi:arrow-up":"mdi:arrow-down"}></ha-icon>`:m}
                      </button>
                    </th>`})}
                </tr>
              </thead>
              <tbody>
                ${c.map(e=>a`
                  <tr class="objects-table-row" tabindex="0"
                    @click=${()=>this._open(e.key)}
                    @keydown=${u=>{u.key==="Enter"&&this._open(e.key)}}>
                    <td>
                      <ha-icon class="area-row-icon" .icon=${e.icon}></ha-icon>
                      <span class="objects-table-name">${e.name}</span>
                    </td>
                    <td class="num">${d(e.objects)}</td>
                    <td class="num">${d(e.tasks)}</td>
                    <td class="num">${e.overdue?a`<span class="area-count overdue">${d(e.overdue)}</span>`:d(0)}</td>
                    <td class="num">${e.dueSoon?a`<span class="area-count due-soon">${d(e.dueSoon)}</span>`:d(0)}</td>
                    <td class="num">${v(e.costYear,s,t)}</td>
                    <td class="num">${v(e.costTotal,s,t)}</td>
                    <td>${e.lastCompletion?w(e.lastCompletion,t):"\u2014"}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
    `}};l([p({attribute:!1})],i.prototype,"hass",2),l([p({attribute:!1})],i.prototype,"objects",2),l([p({type:Boolean})],i.prototype,"showArchived",2),l([p()],i.prototype,"currencySymbol",2),l([b()],i.prototype,"_query",2),l([b()],i.prototype,"_sort",2);customElements.get("maintenance-areas-view")||customElements.define("maintenance-areas-view",i);export{i as MaintenanceAreasView};
