/*! maintenance_supporter frontend 2.121.0 */
import{a as q}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-6OSQMQGD.js";import{a as _,b as A,c as j}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KUPOTAU7.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-X2LYQOVD.js";import{b as $}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WO36MG4A.js";import{s as E,t as L,u as R,v as C,w as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-KJ7SS7FT.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-KHX23RKC.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-EOQRMKO2.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-5QFBI2I6.js";import{b as m,c as b}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-LCH6QYSS.js";import{B as g,F as k,T as w,X as v,_ as S,a as l,e as a,h as u,k as y,y as f,z as r}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-74ISRDIW.js";var H=[{key:"name",label:"area",num:!1},{key:"objects",label:"objects",num:!0},{key:"tasks",label:"tasks",num:!0},{key:"overdue",label:"overdue",num:!0},{key:"due_soon",label:"due_soon",num:!0},{key:"cost_year",label:"area_cost_year",num:!0},{key:"cost_total",label:"total_cost",num:!0},{key:"last",label:"last_performed",num:!1}],i=class extends y{constructor(){super(...arguments);this.objects=[];this.showArchived=!1;this.currencySymbol="";this._query="";this._sort=L(A(_.areaSort));this._histories=new q(this);this._localeReady=!1;this._memo=null}createRenderRoot(){return this}get _lang(){return f(this.hass)}willUpdate(t){if(super.willUpdate(t),t.has("objects")||t.has("showArchived")||t.has("hass")&&t.get("hass")===void 0){let o=this.objects.filter(s=>this.showArchived||!s.object.archived).flatMap(s=>s.tasks.map(n=>({entryId:s.entry_id,task:n})));this._histories.sync(this.hass,o)}}updated(t){super.updated(t),!this._localeReady&&this.hass&&(this._localeReady=!0,g(this._lang).then(()=>this.requestUpdate()))}_rows(t){let o=this._lang,s=[this.objects,this.showArchived,this._histories.version,this.hass?.areas,o,t];if(this._memo&&this._memo.deps.every((c,h)=>c===s[h]))return this._memo.rows;let n=E(this.objects,{showArchived:this.showArchived,areas:this.hass?.areas,noAreaLabel:r("no_area",o),year:t,historyOf:(c,h)=>this._histories.historyOf(c,h)});return this._memo={deps:s,rows:n},n}_setSort(t){this._sort=R(this._sort,t),j(_.areaSort,`${this._sort.key}:${this._sort.dir}`)}_open(t){this.dispatchEvent(new CustomEvent("open-area",{detail:{areaKey:t},bubbles:!0,composed:!0}))}_toggleArchived(){this.dispatchEvent(new CustomEvent("archived-toggle",{bubbles:!0,composed:!0}))}_headerLabel(t,o,s){return t==="area_cost_year"?r("area_cost_year",s).replace("{year}",String(o)):r(t,s)}render(){if(!this.hass)return u;let t=this._lang,o=Number(k().slice(0,4)),s=this.currencySymbol,n=this._rows(o),c=C(O(n,this._query),this._sort),h=this.objects.filter(e=>e.object.archived).length,d=e=>w(e,t);return a`
      <div class="filter-bar area-filter-bar">
        <input
          type="search"
          class="search-input"
          aria-label=${r("areas_filter",t)}
          placeholder=${r("areas_filter",t)}
          .value=${this._query}
          @input=${e=>{this._query=e.target.value}}
        />
        ${this._histories.loading?a`<span class="area-loading">${r("loading",t)}</span>`:u}
        ${h>0?a`<ha-button class="archived-toggle ${this.showArchived?"active":""}" @click=${()=>this._toggleArchived()}>
              <ha-icon icon="mdi:archive-outline"></ha-icon>
              ${this.showArchived?r("hide_archived",t):`${r("show_archived",t)} (${h})`}
            </ha-button>`:u}
      </div>
      ${n.length===0?a`<div class="empty-state">${r("no_objects",t)}</div>`:c.length===0?a`<div class="empty-state">${r("areas_filter_none",t)}</div>`:a`
          <div class="objects-table-wrap">
            <table class="objects-table areas-table">
              <thead>
                <tr>
                  ${H.map(e=>{let p=this._sort.key===e.key;return a`<th class=${e.num?"num":""}
                      aria-sort=${p?this._sort.dir==="asc"?"ascending":"descending":"none"}>
                      <button class="area-sort ${p?"active":""}" title=${r("sort_label",t)} @click=${()=>this._setSort(e.key)}>
                        ${this._headerLabel(e.label,o,t)}
                        ${p?a`<ha-icon icon=${this._sort.dir==="asc"?"mdi:arrow-up":"mdi:arrow-down"}></ha-icon>`:u}
                      </button>
                    </th>`})}
                </tr>
              </thead>
              <tbody>
                ${c.map(e=>a`
                  <tr class="objects-table-row" tabindex="0"
                    @click=${()=>this._open(e.key)}
                    @keydown=${$(()=>this._open(e.key))}>
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
                    <td>${e.lastCompletion?S(e.lastCompletion,t):"\u2014"}</td>
                  </tr>
                `)}
              </tbody>
            </table>
          </div>
        `}
    `}};l([m({attribute:!1})],i.prototype,"hass",2),l([m({attribute:!1})],i.prototype,"objects",2),l([m({type:Boolean})],i.prototype,"showArchived",2),l([m()],i.prototype,"currencySymbol",2),l([b()],i.prototype,"_query",2),l([b()],i.prototype,"_sort",2);customElements.get("maintenance-areas-view")||customElements.define("maintenance-areas-view",i);export{i as MaintenanceAreasView};
