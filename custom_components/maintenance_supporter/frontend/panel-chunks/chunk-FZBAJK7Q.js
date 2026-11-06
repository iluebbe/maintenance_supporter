/*! maintenance_supporter frontend 2.120.0 */
function s(t,e){return t?.entities?.[e]?.platform==="maintenance_supporter"}function o(t){return Object.keys(t?.entities||{}).filter(e=>e.startsWith("todo.")&&s(t,e))}function r(t,e){return[...new Set(e.filter(n=>n&&!s(t,n)))].slice(0,5)}export{s as a,o as b,r as c};
