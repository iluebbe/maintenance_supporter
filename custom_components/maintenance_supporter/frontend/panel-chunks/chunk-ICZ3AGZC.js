/*! maintenance_supporter frontend 2.120.0 */
async function t(s,r,o){let n=await s.connection.sendMessagePromise({type:"maintenance_supporter/task/history",entry_id:r,task_id:o});return Array.isArray(n?.history)?n.history:null}export{t as a};
