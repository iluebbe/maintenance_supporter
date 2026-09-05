/*! maintenance_supporter frontend 2.74.0 */
function c(n){if(!n)return[];let t=[],s=n.photo_doc_id;typeof s=="string"&&t.push(s);let r=n.photo_doc_ids;Array.isArray(r)&&t.push(...r);let o=[];for(let e of t){if(typeof e!="string")continue;let i=e.trim();if(!(!i||o.includes(i))&&(o.push(i),o.length>=10))break}return o}export{c as a};
