/*! maintenance_supporter frontend 2.121.0 */
function c(o,t,d){let l=new Blob([o],{type:d}),n=URL.createObjectURL(l),e=document.createElement("a");e.href=n,e.download=t,e.target="_blank",e.rel="noopener",e.style.display="none",document.body.appendChild(e),e.dispatchEvent(new MouseEvent("click")),document.body.removeChild(e),setTimeout(()=>URL.revokeObjectURL(n),6e4)}export{c as a};
