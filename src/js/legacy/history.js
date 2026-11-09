// ---------- history: legends from past eras, the all-time lists and the GOAT debate ----------
// legend legacy scores sit on the same scale as your GOAT score, so climbing the list means passing real thresholds
function makeLegends(L){const out=[],mi=Math.max(0,ERA_ORDER.indexOf(S.era)),pre=['The 50s','The 60s','The 70s',...ERA_ORDER.slice(0,mi).map(id=>ERAS.find(e=>e.id===id).name.replace(/^\S+\s/,''))];
  for(let i=0;i<30;i++){const sc=i<10?345-i*22.2:144-(i-10)*3.2,pos=pick(LPOS),era0=pick(pre);
    const pts=Math.round(17000+sc*58+gauss()*2500),fr=(m,k)=>Math.round(pts*m[pos]*(.85+R()*.3));
    out.push({name:lgName(L),pos,era:era0,score:Math.round(sc),pts,reb:fr({C:.42,PF:.36,SF:.24,SG:.17,PG:.15}),ast:fr({PG:.38,SG:.22,SF:.2,PF:.14,C:.11}),
      rings:clamp(Math.round(sc/70+gauss()*1.1),0,8),mvps:clamp(Math.round((sc-140)/48+gauss()*.8),0,6),as:Math.round(clamp(sc/21+gauss()*1.5,5,19)),leg:1});}
  // your own past GOATs on this difficulty are immortal: they sit on the all-time list in every future career
  if(!S.daily)for(const g of goatsOf())out.push({...g,era:'Your GOAT',leg:1,mine:1});
  return out;}
function goatsOf(){return Store.obj('bag_goats')[S.diff]||[];}
function immortalize(c,sc){try{const all=Store.obj('bag_goats'),l=all[S.diff]=all[S.diff]||[],k=c.cnt;
  l.push({name:S.name,pos:S.pos,arch:archName(),score:sc,pts:Math.round(c.pts),reb:Math.round(c.reb),ast:Math.round(c.ast),rings:k['Champion']||0,mvps:k['MVP']||0,as:k['All-Star']||0});
  l.sort((a,b)=>b.score-a.score);all[S.diff]=l.slice(0,12);Store.setJson('bag_goats',all);}catch{}}
// production score: points, boards, dimes, stocks, minus turnovers, plus or minus for shooting efficiency
const prodScore=c=>c.ppg+1.1*c.rpg+1.4*c.apg+1.8*((c.spg||0)+(c.bpg||0))-1.5*(c.tov||0)+((c.fg||.47)-.47)*60;
function npcScore(p){const g=x=>p.aw[x]||0;return Math.round(p.rings*12+p.mvps*18+g('Finals MVP')*8+g('All-NBA 1st')*7+g('All-NBA 2nd')*4+g('All-NBA 3rd')*2+g('All-Star')*3+g('DPOY')*5+g('ROY')*2+g('Scoring Title')*3+p.car.pts/1000*2);}
function allTime(kind){const L=S.L;if(!L)return[];const c=career(),me={name:S.name,me:1,pts:c.pts,reb:c.reb,ast:c.ast,score:goatScore(c)};
  const np=L.P.filter(p=>p.car&&p.car.gp>0).map(p=>({name:p.name,pts:p.car.pts,reb:p.car.reb,ast:p.car.ast,score:npcScore(p),rv:p===S.rival,now:!p.retired}));
  return[...(L.leg||[]),...np,me].sort((x,y)=>y[kind]-x[kind]);}
const goatRank=()=>{const l=allTime('score');return l.findIndex(x=>x.me)+1||99;};
function allTimeCard(){if(!S.L||!S.L.leg||!S.nba.length)return'';const u=UI(),k=u.atK||'score',l=allTime(k),mi=l.findIndex(x=>x.me),fmt=x=>k==='score'?x.score:Math.round(x[k]).toLocaleString();
  const row=(x,i)=>`<tr class="${x.me?'mine':x.rv?'rvrow':''}"><td>${i+1}</td><td>${esc(x.name)}${x.me?' <span class="gold">(you)</span>':x.mine?` <span class="gold">🐐 ${x.era}</span>`:x.leg?` <span class="muted">${x.era}</span>`:x.now?' <span class="muted">active</span>':''}</td><td>${fmt(x)}</td></tr>`;
  const nm={score:'GOAT debate',pts:'points list',reb:'rebounds list',ast:'assists list'}[k];
  return`<details class="card" ${u.atOpen?'open':''} ontoggle="UI().atOpen=this.open"><summary>📜 All-time · you are ${ord(mi+1)} in the ${nm}</summary>
  <div class="seg sm" style="margin-top:8px">${[['score','GOAT debate'],['pts','Points'],['reb','Rebounds'],['ast','Assists']].map(([x,lb])=>`<button class="${k===x?'on':''}" onclick="UI().atK='${x}';UI().atOpen=true;render()">${lb}</button>`).join('')}</div>
  <div class="scroll clslist"><table><tr><th>#</th><th>PLAYER</th><th>${k==='score'?'LEGACY':k.toUpperCase()}</th></tr>${l.slice(0,15).map(row).join('')}${mi>=15?row(l[mi],mi):''}</table></div>
  <div class="note">Legends from past eras plus everyone who played in yours. The GOAT debate uses the same legacy score as your GOAT score.</div></details>`;}

