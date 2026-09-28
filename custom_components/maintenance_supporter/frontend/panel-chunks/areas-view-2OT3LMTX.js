/*! maintenance_supporter frontend 2.94.0 */
import{a as C}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-VTXXUWPU.js";import{q as A,r as j,s as E,t as L,u as R}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-55SQKJLW.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-LDHTR7LC.js";import{a as _,b as w,c as S}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-3Q6XADUF.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-NOLHZVO4.js";import{B as g,C as v,F as k,a as l,c as a,f as m,h as y,l as p,m as b,s as r,u as $,y as f}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-X4HZDRQN.js";var O=[{key:"name",label:"area",num:!1},{key:"objects",label:"objects",num:!0},{key:"tasks",label:"tasks",num:!0},{key:"overdue",label:"overdue",num:!0},{key:"due_soon",label:"due_soon",num:!0},{key:"cost_year",label:"area_cost_year",num:!0},{key:"cost_total",label:"total_cost",num:!0},{key:"last",label:"last_performed",num:!1}],i=class extends y{constructor(){super(...arguments);this.objects=[];this.showArchived=!1;this.currencySymbol="";this._query="";this._sort=j(w(_.areaSort));this._histories=new C(this);this._localeReady=!1;this._memo=null}createRenderRoot(){return this}get _lang(){return f(this.hass)}willUpdate(e){if(super.willUpdate(e),e.has("objects")||e.has("showArchived")||e.has("hass")&&e.get("hass")===void 0){let o=this.objects.filter(s=>this.showArchived||!s.object.archived).flatMap(s=>s.tasks.map(n=>({entryId:s.entry_id,task:n})));this._histories.sync(this.hass,o)}}updated(e){super.updated(e),!this._localeReady&&this.hass&&(this._localeReady=!0,$(this._lang).then(()=>this.requestUpdate()))}_rows(e){let o=this._lang,s=[this.objects,this.showArchived,this._histories.version,this.hass?.areas,o,e];if(this._memo&&this._memo.deps.every((c,h)=>c===s[h]))return this._memo.rows;let n=A(this.objects,{showArchived:this.showArchived,areas:this.hass?.areas,noAreaLabel:r("no_area",o),year:e,historyOf:(c,h)=>this._histories.historyOf(c,h)});return this._memo={deps:s,rows:n},n}_setSort(e){this._sort=E(this._sort,e),S(_.areaSort,`${this._sort.key}:${this._sort.dir}`)}_open(e){this.dispatchEvent(new CustomEvent("open-area",{detail:{areaKey:e},bubbles:!0,composed:!0}))}_toggleArchived(){this.dispatchEvent(new CustomEvent("archived-toggle",{bubbles:!0,composed:!0}))}_headerLabel(e,o,s){return e==="area_cost_year"?r("area_cost_year",s).replace("{year}",String(o)):r(e,s)}render(){if(!this.hass)return m;let e=this._lang,o=new Date().getFullYear(),s=this.currencySymbol,n=this._rows(o),c=L(R(n,this._query),this._sort),h=this.objects.filter(t=>t.object.archived).length,d=t=>g(t,e);return a`
      <div class="filter-bar area-filter-bar">
        <input
          type="search"
          class="search-input"
          aria-label=${r("areas_filter",e)}
          placeholder=${r("areas_filter",e)}
          .value=${this._query}
          @input=${t=>{this._query=t.target.value}}
        />
        ${this._histories.loading?a`<span class="area-loading">${r("loading",e)}</span>`:m}
        ${h>0?a`<ha-button class="archived-toggle ${this.showArchived?"active":""}" @click=${()=>this._toggleArchived()}>
              <ha-icon icon="mdi:archive-outline"></ha-icon>
              ${this.showArchived?r("hide_archived",e):`${r("show_archived",e)} (${h})`}
            </ha-button>`:m}
      </div>
      ${n.length===0?a`<div class="empty-state">${r("no_objects",e)}</div>`:c.length===0?a`<div class="empty-state">${r("areas_filter_none",e)}</div>`:a`
          <div class="objects-table-wrap">
            <table class="objects-table areas-table">
              <thead>
                <tr>
                  ${O.map(t=>{let u=this._sort.key===t.key;return a`<th class=${t.num?"num":""}
                      aria-sort=${u?this._sort.dir==="asc"?"ascending":"descending":"none"}>
                      <button class="area-sort ${u?"active":""}" title=${r("sort_label",e)} @click=${()=>this._setSort(t.key)}>
                        ${this._headerLabel(t.label,o,e)}
                        ${u?a`<ha-icon icon=${this._sort.dir==="asc"?"mdi:arrow-up":"mdi:arrow-down"}></ha-icon>`:m}
                      </button>
                    </th>`})}
                </tr>
              </thead>
              <tbody>
                ${c.map(t=>a`
                  <tr class="objects-table-row" tabindex="0"
                    @click=${()=>this._open(t.key)}
                    @keydown=${u=>{u.key==="Enter"&&this._open(t.key)}}>
                    <td>
                      <ha-icon class="area-row-icon" .icon=${t.icon}></ha-icon>
                      <span class="objects-table-name">${t.name}</span>
                    </td>
                    <td class="num">${d(t.objects)}</td>
                    <td class="num">${d(t.tasks)}</td>
                    <td class="num">${t.overdue?a`<span class="area-count overdue">${d(t.overdue)}</span>`:d(0)}</td>
                    <td class="num">${t.dueSoon?a`<span class="area-count due-soon">${d(t.dueSoon)}</span>`:d(0)}</td>
                    <td class="num">${v(t.costYear,s,e)}</td>
                    <td class="num">${v(t.costTotal,s,e)}</td>
                    <td>${t.lastCompletion?k(t.lastCompletion,e):"\u2014"}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
    `}};l([p({attribute:!1})],i.prototype,"hass",2),l([p({attribute:!1})],i.prototype,"objects",2),l([p({type:Boolean})],i.prototype,"showArchived",2),l([p()],i.prototype,"currencySymbol",2),l([b()],i.prototype,"_query",2),l([b()],i.prototype,"_sort",2);customElements.get("maintenance-areas-view")||customElements.define("maintenance-areas-view",i);export{i as MaintenanceAreasView};
