/*! maintenance_supporter frontend 2.125.0 */
function n(e){return typeof e.responsible_user_id=="string"&&e.responsible_user_id?[e.responsible_user_id]:[...new Set((e.assignee_pool||[]).filter(s=>typeof s=="string"&&s))]}function r(e,s){return!!s&&n(e).includes(s)}export{n as a,r as b};
