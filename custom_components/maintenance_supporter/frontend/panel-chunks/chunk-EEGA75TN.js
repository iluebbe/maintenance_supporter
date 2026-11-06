/*! maintenance_supporter frontend 2.120.0 */
function r(t){if(t.key!=="Enter"&&t.key!==" ")return;let e=t.target?.closest?.('[role="menuitem"], [role="button"]');!e||e.getAttribute("aria-disabled")==="true"||(t.preventDefault(),e.click())}export{r as a};
