/*! maintenance_supporter frontend 2.98.0 */
import{a as X}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-WH65ZHYZ.js";import{a as o}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DY5FF6TM.js";import{f as E,g as M,h as z,i as Q,j as U,k as Y,l as q,m as G,n as R,o as A,p as W}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-S7XZBRRU.js";import{a as B}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-GGO5IKKD.js";import{e as P,f as K}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-DLWOWMV7.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-4PKMHUVO.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-NEWWPCTD.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-QKEXGIRG.js";import"/maintenance_supporter_panelfiles/panel-chunks/chunk-OUHDI2FL.js";import{B as S,H as F,K as g,L as v,O as N,P as I,T as w,V as T,a as $,c as p,f as y,h as H,l as k,m as j,n as C,q as D,s as a,u as L,y as O}from"/maintenance_supporter_panelfiles/panel-chunks/chunk-27MZ7YLE.js";function J(b,i,t,s){let l=b.entries.filter(e=>e.type==="completed").sort((e,n)=>e.ts-n.ts),d=`${b.from?t.date(b.from):"\u2026"} \u2013 ${b.to?t.date(b.to):"\u2026"}`,r=b.totals,h=[[i.completions,t.number(r.completions)],[i.totalCost,t.cost(r.totalCost)],[i.avgCost,r.avgCost!=null?t.cost(r.avgCost):i.none],[i.totalTime,r.totalDuration?t.duration(r.totalDuration):i.none]].map(([e,n])=>`<div class="kpi"><div class="k">${o(e)}</div><div class="v">${o(n)}</div></div>`).join(""),u=b.byObject.map(e=>`<tr>
      <td>${o(e.objectName)}</td>
      <td class="num">${o(t.number(e.completions))}</td>
      <td class="num">${o(t.cost(e.cost))}</td>
      <td class="num">${o(t.share(e.share))}</td>
    </tr>`).join(""),f=b.buckets.buckets.reduce((e,n)=>Math.max(e,n.cost),0),c=b.buckets.buckets.map(e=>{let n=f>0?Math.round(e.cost/f*100):0;return`<tr>
      <td class="nowrap">${o(t.bucket(e))}</td>
      <td class="num">${o(t.number(e.completions))}</td>
      <td class="bar-cell">${n>0?`<span class="bar" style="width:${n}%"></span>`:""}</td>
      <td class="num">${o(t.cost(e.cost))}</td>
    </tr>`}).join(""),m=l.map(e=>{let n=[e.notes,e.completedBy?`${i.completedBy}: ${e.completedBy}`:null].filter(Boolean).join(" \xB7 "),x=e.phaseName?`${e.taskName} \xB7 ${e.phaseName}`:e.taskName;return`<tr>
      <td class="nowrap">${o(t.date(e.timestamp))}</td>
      <td>${o(e.objectName)}</td>
      <td>${o(x)}</td>
      <td class="num">${e.cost!=null?o(t.cost(e.cost)):o(i.none)}</td>
      <td class="num">${e.duration!=null?o(t.duration(e.duration)):o(i.none)}</td>
      <td class="notes">${o(n)||o(i.none)}</td>
    </tr>`}).join(`
`);return`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="color-scheme" content="light">
<title>${o(i.title)} \u2014 ${o(b.areaName)}</title>
<style>
  /* Printable sheet: it opens as a blob in whatever viewer the OS supplies
     (Companion = WebView, dark phones paint a dark default canvas), so the
     document states its own light scheme and paints its background. */
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body { font: 13px/1.5 -apple-system, Segoe UI, Roboto, sans-serif; color: #1a1a1a; background: #fff; margin: 32px; }
  h1 { font-size: 22px; margin: 0 0 2px; }
  h2 { font-size: 15px; margin: 24px 0 8px; }
  .sub { color: #666; margin: 0 0 16px; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin: 0 0 8px; }
  .kpi { border: 1px solid #ddd; border-radius: 6px; padding: 8px 10px; }
  .kpi .k { color: #777; font-size: 10.5px; text-transform: uppercase; letter-spacing: .04em; }
  .kpi .v { font-size: 16px; font-weight: 600; }
  table { border-collapse: collapse; width: 100%; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; color: #666; border-bottom: 2px solid #ccc; padding: 6px 8px; }
  td { border-bottom: 1px solid #e5e5e5; padding: 6px 8px; vertical-align: top; }
  td.num, th.num { text-align: right; white-space: nowrap; }
  td.nowrap { white-space: nowrap; }
  td.notes { color: #444; white-space: pre-wrap; }
  td.bar-cell { width: 40%; vertical-align: middle; }
  .bar { display: block; height: 10px; background: #9aa7b8; border-radius: 0 3px 3px 0;
         -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  tfoot td { border-bottom: none; border-top: 2px solid #ccc; font-weight: 600; }
  tr { break-inside: avoid; }
  .cap-note { margin-top: 14px; color: #888; font-size: 11px; }
  @media print { body { margin: 12mm; } }
</style>
</head>
<body>
<h1>${o(i.title)} \u2014 ${o(b.areaName)}</h1>
<p class="sub">${o(i.period)}: ${o(d)} \xB7 ${o(i.generated)} ${o(t.date(s))}</p>
<div class="kpis">${h}</div>

<h2>${o(i.costPerObject)}</h2>
<table>
  <thead><tr>
    <th>${o(i.colObject)}</th><th class="num">${o(i.completions)}</th>
    <th class="num">${o(i.colCost)}</th><th class="num">${o(i.share)}</th>
  </tr></thead>
  <tbody>${u||`<tr><td colspan="4">${o(i.none)}</td></tr>`}</tbody>
  <tfoot><tr>
    <td>${o(i.totalCost)}</td><td class="num">${o(t.number(r.completions))}</td>
    <td class="num">${o(t.cost(r.totalCost))}</td><td></td>
  </tr></tfoot>
</table>

<h2>${o(i.costPerBucket)}</h2>
<table>
  <thead><tr>
    <th>${o(i.period)}</th><th class="num">${o(i.completions)}</th>
    <th></th><th class="num">${o(i.colCost)}</th>
  </tr></thead>
  <tbody>${c||`<tr><td colspan="4">${o(i.none)}</td></tr>`}</tbody>
</table>

<h2>${o(i.historyHeading)} (${o(t.number(l.length))})</h2>
<table>
  <thead><tr>
    <th>${o(i.colDate)}</th><th>${o(i.colObject)}</th><th>${o(i.colTask)}</th>
    <th class="num">${o(i.colCost)}</th><th class="num">${o(i.colDuration)}</th><th>${o(i.colNotes)}</th>
  </tr></thead>
  <tbody>
${m||`<tr><td colspan="6">${o(i.none)}</td></tr>`}
  </tbody>
  <tfoot><tr>
    <td colspan="3">${o(i.totalCost)}</td>
    <td class="num">${o(t.cost(r.totalCost))}</td>
    <td class="num">${r.totalDuration?o(t.duration(r.totalDuration)):""}</td><td></td>
  </tr></tfoot>
</table>
${b.capped?`<p class="cap-note">${o(i.capNote)}</p>`:""}
</body>
</html>`}var Z=25,V=5,tt={completed:C.ok,missed:C.overdue,reset:C.paused,skipped:"var(--secondary-text-color)"},_=class extends H{constructor(){super(...arguments);this.areaKey="";this.objects=[];this.showArchived=!1;this.currencySymbol="";this.userName=()=>null;this._from="";this._to="";this._entryFilter="";this._taskQuery="";this._expanded=!1;this._printing=!1;this._histories=new X(this);this._localeReady=!1;this._filtersFor=null;this._memo=null}createRenderRoot(){return this}get _lang(){return F(this.hass)}willUpdate(t){if(super.willUpdate(t),t.has("areaKey")&&this._filtersFor!==this.areaKey){this._filtersFor=this.areaKey;let s=R();this._from=s.from,this._to=s.to,this._entryFilter="",this._taskQuery="",this._expanded=!1}if(t.has("objects")||t.has("areaKey")||t.has("showArchived")||t.has("hass")&&t.get("hass")===void 0){let s=this._areaObjects().flatMap(l=>l.tasks.map(d=>({entryId:l.entry_id,task:d})));this._histories.sync(this.hass,s)}}updated(t){super.updated(t),!this._localeReady&&this.hass&&(this._localeReady=!0,L(this._lang).then(()=>this.requestUpdate()))}_areaObjects(){return z(this.objects,this.areaKey,this.showArchived).sort((t,s)=>t.object.name.localeCompare(s.object.name))}_entries(t){let s=[this.objects,this.areaKey,this.showArchived,this._histories.version];if(this._memo&&this._memo.deps.every((d,r)=>d===s[r]))return this._memo.entries;let l=Q(t,(d,r)=>this._histories.historyOf(d,r));return this._memo={deps:s,entries:l},l}_figures(){let t=this._areaObjects(),s=this._entries(t),l={from:this._from||null,to:this._to||null},d=U(s,{...l,entryId:this._entryFilter||null,taskQuery:this._taskQuery}),r=this._entryFilter?t.filter(h=>h.entry_id===this._entryFilter):t;return{objects:t,entries:s,filtered:d,totals:Y(d),buckets:G(d,l),byObject:q(d,r)}}_setRange(t){this._from=t.from,this._to=t.to,this._expanded=!1}_openObject(t){this.dispatchEvent(new CustomEvent("open-object",{detail:{entryId:t},bubbles:!0,composed:!0}))}_openTask(t,s){this.dispatchEvent(new CustomEvent("open-task",{detail:{entryId:t,taskId:s},bubbles:!0,composed:!0}))}_bucketLabel(t,s){return t.month==null?String(t.year):`${T(t.month,this._lang,s)} ${t.year}`}_countText(t,s,l){let d=this._lang;return l===1?a(s,d):a(t,d).replace("{n}",g(l,d))}async _print(){if(this._printing)return;let t=K();this._printing=!0;try{await this._histories.settled()}finally{this._printing=!1}let s=this._lang,l=this.currencySymbol,{filtered:d,totals:r,buckets:h,byObject:u}=this._figures(),f={title:a("area_report_title",s),generated:a("report_generated",s),period:a("area_report_period",s),completions:a("area_kpi_completions",s),totalCost:a("total_cost",s),avgCost:a("avg_cost",s),totalTime:a("area_kpi_total_time",s),costPerObject:a("area_cost_per_object",s),costPerBucket:h.unit==="month"?a("area_cost_per_month",s):a("area_cost_per_year",s),share:a("area_cost_share",s),historyHeading:a("area_history_section",s),colDate:a("date",s),colObject:a("object",s),colTask:a("task_name",s),colCost:a("cost",s),colDuration:a("duration",s),colNotes:a("notes_label",s),completedBy:a("completed_by",s),capNote:a("object_history_cap_note",s),none:"\u2014"},c=d.filter(n=>n.type==="completed"),m=d.map(n=>({...n,completedBy:n.completedBy?this.userName(n.completedBy):null,notes:n.notes?B(n.notes,s):null})),e=J({areaName:E(this.areaKey,this.hass?.areas,a("no_area",s)),from:this._from||S(c[c.length-1]?.timestamp)||null,to:this._to||O(),totals:r,byObject:u,buckets:h,entries:m,capped:this._histories.capped},f,{date:n=>N(n,s),cost:n=>v(n,l,s),duration:n=>w(n,s),bucket:n=>this._bucketLabel(n,"long"),share:n=>`${g(n*100,s,0)} %`,number:n=>g(n,s)},new Date().toISOString());P(e,t)}_renderRangeChips(t){let s=this._lang,l=O(),d=R(l),r=u=>this._from===u.from&&this._to===u.to,h=W(t,Number(l.slice(0,4))).slice(0,V);return p`
      <div class="filter-chips area-range-chips">
        <button class="filter-chip ${r(d)?"active":""}" @click=${()=>this._setRange(R())}>
          ${a("area_range_12m",s)}
        </button>
        ${h.map(u=>p`
          <button class="filter-chip ${r(A(u))?"active":""}" @click=${()=>this._setRange(A(u))}>${u}</button>
        `)}
        <button class="filter-chip ${!this._from&&!this._to?"active":""}" @click=${()=>this._setRange({from:"",to:""})}>
          ${a("area_range_all",s)}
        </button>
      </div>
    `}_renderChart(t){let s=this._lang,l=this.currencySymbol,d=t.reduce((c,m)=>Math.max(c,m.cost),0),r=t.reduce((c,m)=>Math.min(c,m.cost),0);if(d<=0&&r>=0)return p`<p class="area-empty">${a("area_no_costs",s)}</p>`;let h=c=>Math.round(c/(d-r)*1e3)/10,u=Math.max(1,Math.ceil(t.length/12)),f=t.map((c,m)=>({b:c,i:m})).filter(({i:c})=>c%u===0);return p`
      <div class="area-chart">
        <div class="area-chart-max">${v(d,l,s)}</div>
        <div class="area-chart-bars">
          ${r<0?p`<div class="area-chart-zero" style="bottom: ${h(-r)}%"></div>`:y}
          ${t.map(c=>{let m=`${this._bucketLabel(c,"long")}: ${v(c.cost,l,s)} \xB7 ${a("area_kpi_completions",s)}: ${g(c.completions,s)}`,e=c.cost<0?h(c.cost-r):h(-r);return p`<div class="area-bar" title=${m} aria-label=${m}>
              ${c.cost!==0?p`<div class="area-bar-fill ${c.cost<0?"credit":""}" style="height: ${h(Math.abs(c.cost))}%${e?`; bottom: ${e}%`:""}"></div>`:y}
            </div>`})}
        </div>
        ${r<0?p`<div class="area-chart-min">${v(r,l,s)}</div>`:y}
        <div class="area-chart-axis ${u>1?"grouped":""}">
          ${f.map(({b:c,i:m})=>p`<span class="area-bar-label" style="flex-grow: ${Math.min(u,t.length-m)}">${c.month==null?String(c.year):p`${T(c.month,s,"short")}${c.month===0||m===0?p`<br />${c.year}`:y}`}</span>`)}
        </div>
      </div>
    `}render(){if(!this.hass||!this.areaKey)return y;let t=this._lang,s=this.currencySymbol,{objects:l,entries:d,filtered:r,totals:h,buckets:u,byObject:f}=this._figures(),c=l.reduce((e,n)=>e+n.tasks.filter(x=>this.showArchived||!x.archived).length,0),m=this._expanded?r:r.slice(0,Z);return p`
      <div class="detail-section area-view">
        <div class="detail-header">
          <h2 class="area-title">
            <ha-icon .icon=${M(this.areaKey,this.hass.areas)}></ha-icon>
            ${E(this.areaKey,this.hass.areas,a("no_area",t))}
          </h2>
          <div class="action-buttons">
            <ha-button appearance="plain" class="area-print" .disabled=${this._printing} @click=${()=>this._print()}>
              <ha-icon icon="mdi:printer-outline"></ha-icon>
              ${this._printing?a("loading",t):a("area_report_print",t)}
            </ha-button>
          </div>
        </div>
        <p class="meta">
          ${this._countText("area_object_count","area_object_count_one",l.length)} ·
          ${this._countText("templates_task_count","templates_task_count_one",c)}
          ${this._histories.loading?p` · <span class="area-loading">${a("loading",t)}</span>`:y}
        </p>

        ${this._renderRangeChips(d)}
        <div class="filter-bar area-filters">
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            .label=${a("date_from",t)}
            .value=${this._from}
            @value-changed=${e=>{this._from=e.detail.value}}
          ></ms-date-field>
          <ms-date-field
            kind="date"
            clearable
            .hass=${this.hass}
            .lang=${t}
            .label=${a("date_to",t)}
            .value=${this._to}
            @value-changed=${e=>{this._to=e.detail.value}}
          ></ms-date-field>
          <label class="filter-field">
            <span class="filter-label">${a("object",t)}</span>
            <select class="area-object-filter" .value=${this._entryFilter}
              @change=${e=>{this._entryFilter=e.target.value}}>
              <option value="" ?selected=${!this._entryFilter}>${a("all_objects",t)}</option>
              ${l.map(e=>p`<option value=${e.entry_id} ?selected=${e.entry_id===this._entryFilter}>${e.object.name}</option>`)}
            </select>
          </label>
          <input
            type="search"
            class="search-input area-task-filter"
            aria-label=${a("area_task_filter",t)}
            placeholder=${a("area_task_filter",t)}
            .value=${this._taskQuery}
            @input=${e=>{this._taskQuery=e.target.value}}
          />
        </div>

        <div class="kpi-bar area-kpis">
          <div class="kpi-card">
            <div class="kpi-label">${a("area_kpi_completions",t)}</div>
            <div class="kpi-value-large area-kpi-completions">${g(h.completions,t)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">${a("total_cost",t)}</div>
            <div class="kpi-value-large area-kpi-cost">${v(h.totalCost,s,t)}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">${a("avg_cost",t)}</div>
            <div class="kpi-value-large">${h.avgCost!=null?v(h.avgCost,s,t):"\u2014"}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">${a("area_kpi_total_time",t)}</div>
            <div class="kpi-value-large">${h.totalDuration?w(h.totalDuration,t):"\u2014"}</div>
          </div>
        </div>

        <h3>${u.unit==="month"?a("area_cost_per_month",t):a("area_cost_per_year",t)}</h3>
        ${this._renderChart(u.buckets)}

        <h3>${a("area_cost_per_object",t)}</h3>
        <div class="objects-table-wrap">
          <table class="objects-table area-object-table">
            <thead>
              <tr>
                <th>${a("object",t)}</th>
                <th class="num">${a("area_kpi_completions",t)}</th>
                <th class="num">${a("cost",t)}</th>
                <th class="num">${a("area_cost_share",t)}</th>
              </tr>
            </thead>
            <tbody>
              ${f.map(e=>p`
                <tr class="objects-table-row" @click=${()=>this._openObject(e.entryId)}>
                  <td><span class="objects-table-name">${e.objectName}</span></td>
                  <td class="num">${g(e.completions,t)}</td>
                  <td class="num">${v(e.cost,s,t)}</td>
                  <td class="num">
                    <span class="area-share"><span class="area-share-fill" style="width: ${Math.round(e.share*100)}%"></span></span>
                    ${g(e.share*100,t,0)} %
                  </td>
                </tr>
              `)}
            </tbody>
          </table>
        </div>

        <h3>
          ${a("area_history_section",t)}
          <span class="area-count">${g(r.length,t)}</span>
        </h3>
        ${r.length===0?p`<p class="area-empty">${a("object_history_empty",t)}</p>`:p`
            <div class="objects-table-wrap">
              <table class="objects-table area-history-table">
                <thead>
                  <tr>
                    <th>${a("date",t)}</th>
                    <th></th>
                    <th>${a("object",t)}</th>
                    <th>${a("task_name",t)}</th>
                    <th class="num">${a("cost",t)}</th>
                    <th class="num">${a("duration",t)}</th>
                    <th>${a("notes_label",t)}</th>
                  </tr>
                </thead>
                <tbody>
                  ${m.map(e=>{let n=e.notes?B(e.notes,t):"";return p`
                      <tr class="objects-table-row area-history-row" @click=${()=>this._openTask(e.entryId,e.taskId)}>
                        <td title=${I(e.timestamp,t)}>${N(e.timestamp,t)}</td>
                        <td>
                          <span class="area-entry-type" style="color: ${tt[e.type]??"inherit"}">
                            <ha-icon .icon=${D[e.type]||"mdi:circle"}></ha-icon>${a(e.type,t)}
                          </span>
                        </td>
                        <td>
                          <button class="area-object-link" @click=${x=>{x.stopPropagation(),this._openObject(e.entryId)}}>
                            ${e.objectName}
                          </button>
                        </td>
                        <td><button class="area-task-link">${e.taskName}${e.phaseName?` \xB7 ${e.phaseName}`:""}</button></td>
                        <td class="num">${e.cost!=null?v(e.cost,s,t):"\u2014"}</td>
                        <td class="num">${e.duration!=null?w(e.duration,t):"\u2014"}</td>
                        <td class="oc-notes" title=${n}>${n||"\u2014"}</td>
                      </tr>
                    `})}
                </tbody>
              </table>
            </div>
            ${r.length>m.length?p`<ha-button appearance="plain" class="area-more" @click=${()=>{this._expanded=!0}}>
                  ${a("show_all",t)} (${g(r.length,t)})
                </ha-button>`:y}
          `}
        ${this._histories.capped?p`<p class="area-cap-note">${a("object_history_cap_note",t)}</p>`:y}
      </div>
    `}};$([k({attribute:!1})],_.prototype,"hass",2),$([k()],_.prototype,"areaKey",2),$([k({attribute:!1})],_.prototype,"objects",2),$([k({type:Boolean})],_.prototype,"showArchived",2),$([k()],_.prototype,"currencySymbol",2),$([k({attribute:!1})],_.prototype,"userName",2),$([j()],_.prototype,"_from",2),$([j()],_.prototype,"_to",2),$([j()],_.prototype,"_entryFilter",2),$([j()],_.prototype,"_taskQuery",2),$([j()],_.prototype,"_expanded",2),$([j()],_.prototype,"_printing",2);customElements.get("maintenance-area-view")||customElements.define("maintenance-area-view",_);export{_ as MaintenanceAreaView};
