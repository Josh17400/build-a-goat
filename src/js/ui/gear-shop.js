// ---------- the equipment page ----------
function gearCard(){const g=gear(),n=gems();
  return`<div class="card"><div class="sh">${icon('sparkle')} <span class="grow">Equipment</span><b class="gold">${n} gems</b></div><div class="sub">Gear is permanent: every future player wears it (not the Daily Build). Earn gems at the end of every career on Pro and Hall of Fame.</div>
  ${GEAR.map(([k,l,ic,d,ks])=>{const lv=g[k]||0,c=GEAR_COST[lv];return`<div class="row" style="margin-top:12px;flex-wrap:nowrap"><span class="bub">${icon(ic)}</span><div class="grow"><b>${l}</b>${lv?` <span class="gold">${GEAR_LV[lv-1]}</span>`:''}<div class="sub">${d} · ${ks.map(sname).join(' & ')} ${lv?`+${GEAR_BOOST[lv]}`:`+${GEAR_BOOST[1]}`} each${lv&&lv<3?` · next level +${GEAR_BOOST[lv+1]}`:''}</div></div>
    ${lv>=3?'<b class="gold">Maxed</b>':`<button class="sm" aria-label="Buy ${l}" onclick="buyGear('${k}')" ${n<c?'disabled':''}>${c} gems</button>`}</div>`;}).join('')}
  ${storeOn()?`<button class="ghost sm" style="margin-top:14px;width:100%" onclick="openMenu('gems')">${icon('gem')} Get more gems</button>`:''}</div>`;}
