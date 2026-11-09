// ---------- league screens ----------
const tShort=t=>t.split(' ').slice(-1)[0];
function clsSnap(){const c=classRank();if(!c)return null;const ix=new Map(S.cls.map((p,i)=>[p,i])),sn={};let r=0;for(const p of c.all){r++;sn[ix.get(p)]=r>=c.rank?r+1:r;}sn.me=c.rank;return sn;}
function classCard(open){const c=classRank();if(!c)return'';
  // rank movement since last season: snapshot the order once per season played
  
  // the latest order seen this offseason (after any points you spend) is what next season's moves compare with
  
  const prev=S.clsStart||null,mv=(id,r)=>{if(!prev||prev[id]==null)return'';const d=prev[id]-r;return d>0?`<span class="good mvu" aria-label="up ${d}" title="up ${d}">${d}</span>`:d<0?`<span class="bad mvd" aria-label="down ${-d}" title="down ${-d}">${-d}</span>`:'<span class="muted">–</span>';};
  const st=rankStars,fp=UI().clsPos||'All',rows=[];let r=0,meDone=false;
  const meRow=()=>`<tr class="mine"><td>${c.rank}</td><td><b>${esc(S.name||'You')}</b> <span class="gold">(you)</span></td><td>${S.pos}</td><td class="stars">${'★'.repeat(S.stage==='hs'||S.stage==='offers'?stars():st(c.rank))}</td><td>${mv('me',c.rank)}</td></tr>`;
  for(const p of c.all){r++;if(!meDone&&r>=c.rank){if(fp==='All'||fp===S.pos)rows.push(meRow());meDone=true;}const rr=r>=c.rank?r+1:r;if(fp!=='All'&&p.pos!==fp)continue;
    rows.push(`<tr><td>${rr}</td><td>${p.name}</td><td>${p.pos}</td><td class="stars">${'★'.repeat(st(rr))}</td><td>${mv(S.cls.indexOf(p),rr)}</td></tr>`);}
  if(!meDone&&(fp==='All'||fp===S.pos))rows.push(meRow());
  return`<div class="card"><div class="sh">🎓 <span class="grow">National class rankings</span><b class="gold">${c.rank<=100?'#'+c.rank:'Unranked'}${prev&&prev.me?' '+mv('me',c.rank)+' <small class="muted">this season</small>':''}</b></div><div class="sub">Top of your class: ${[...c.top.slice(0,c.rank-1),...(c.rank<=3?[{name:esc(S.name||'You')+' (you)',pos:S.pos}]:[]),...c.top.slice(c.rank-1)].slice(0,3).map((p,i)=>`<b>${i+1}. ${p.name}</b> ${p.pos}`).join(' · ')}. They grow up with you, and they will be in your draft class.${S.stage==='college'&&S.col.length?' In college your rank is your projected pick: teams still decide on draft night.':''}</div>
  <details ${open||UI().clsOpen?'open':''} ontoggle="UI().clsOpen=this.open"><summary>Full rankings · ${c.all.length+1} prospects</summary>
  <div class="seg sm" style="margin-top:8px">${['All','PG','SG','SF','PF','C'].map(x=>`<button class="${fp===x?'on':''}" onclick="UI().clsPos='${x}';UI().clsOpen=true;render()">${x}</button>`).join('')}</div>
  <div class="scroll clslist"><table><tr><th>#</th><th>PLAYER</th><th>POS</th><th>STARS</th><th>MOVE</th></tr>${rows.join('')}</table></div></details></div>`;}
function leagueCard(open){const L=S.L;if(!L||!S.nba.length)return'';const last=S.nba[S.nba.length-1],W=L.lastWins,me={name:S.name+' (you)',team:last.team||S.team,ppg:last.ppg,rpg:last.rpg,apg:last.apg,ovr:OV(),me:1,gp:last.gp};
  const pl=active(L).filter(p=>p.gp>0).map(p=>({name:p.name,team:p.team,ppg:p.ppg,rpg:p.rpg,apg:p.apg,ovr:dsp(p.ovr),mvps:p.mvps,rings:p.rings,gp:p.gp,rv:p===S.rival}));pl.push(me);
  const row=(x,i,cols)=>`<tr class="${x.me?'mine':x.rv?'rvrow':''}"><td>${i+1}</td><td>${esc(x.name)}${x.rv?' ⚔️':''}</td><td>${tShort(x.team)}</td>${cols(x)}</tr>`;
  const list=(arr,head,cols,n=10)=>{const s=arr.slice(0,n),mi=arr.findIndex(x=>x.me);return`<div class="scroll"><table><tr><th>#</th><th>Player</th><th>Team</th>${head}</tr>${s.map((x,i)=>row(x,i,cols)).join('')}${mi>=n?row(arr[mi],mi,cols):''}</table></div>`;};
  const byP=pl.filter(x=>x.gp>=65).sort((a,b)=>b.ppg-a.ppg),byO=pl.slice().sort((a,b)=>b.ovr-a.ovr);
  const conf=c=>{const ts=TEAMS.filter(t=>CONF(t)===c).sort((a,b)=>W[b]-W[a]);return`<div class="scroll"><table><tr><th>#</th><th>${c}</th><th>W</th><th>L</th></tr>${ts.map((t,i)=>`<tr class="${t===(last.team||S.team)?'mine':t===S.rival?.team?'rvrow':''}${i===7?' cut':''}"><td>${i+1}</td><td>${t}</td><td>${W[t]}</td><td>${82-W[t]}</td></tr>`).join('')}</table></div>`;};
  const hs=L.hist[L.hist.length-1],cls=L.P.filter(p=>p.dyr===L.myClassYr&&p.pick).map(p=>({name:p.name,team:p.team,pick:p.pick,ovr:dsp(p.ovr),pts:p.car.pts,ret:p.retired,rv:p===S.rival}));
  cls.push({name:S.name+' (you)',team:S.team,pick:S.pick,ovr:OV(),pts:career().pts,me:1});cls.sort((a,b)=>b.pts-a.pts);
  return`<details class="card" ${open?'open':''}><summary>🏟️ The League · Year ${S.nba.length}</summary>${(last.news||[]).length?`<div style="margin-top:8px">${last.news.map(x=>`<div class="ev">${x}</div>`).join('')}</div>`:''}
  ${hs?`<div class="stat3" style="margin-top:10px">${[['CHAMPION',tShort(hs.champ)],['MVP',hs.mvp===S.name?'You':shortNm(hs.mvp)],['SCORING',hs.sc?shortNm(hs.sc.replace(/\s*\(.*$/,''))+(hs.sc.match(/\(.*\)/)||[''])[0].replace(/^/,' '):'—']].map(([l,v])=>`<div class="stat"><b>${esc(v)}</b>${l}</div>`).join('')}</div>
  <div class="sub" style="margin-top:6px">Finals MVP: ${hs.fmvp===S.name?'you':hs.fmvp||'—'} · DPOY: ${hs.dpoy===S.name?'you':hs.dpoy||'—'} · Rookie of the Year: ${hs.roy===S.name?'you':hs.roy||'—'}</div>`:''}
  <details><summary>Scoring leaders</summary><div class="sub">Players with 65+ games (the scoring title rule)</div>${list(byP,'<th>PPG</th><th>RPG</th><th>APG</th>',x=>`<td>${f1(x.ppg)}</td><td>${f1(x.rpg)}</td><td>${f1(x.apg)}</td>`)}</details>
  <details><summary>Top players (OVR)</summary>${list(byO,'<th>OVR</th><th>MVP</th><th>RINGS</th>',x=>`<td>${x.ovr}</td><td>${x.me?career().cnt.MVP||0:x.mvps}</td><td>${x.me?career().cnt.Champion||0:x.rings}</td>`)}</details>
  <details><summary>Standings</summary>${conf('East')}${conf('West')}<div class="sub">Top 8 in each conference make the playoffs.</div></details>
  <details><summary>Your draft class</summary><div class="scroll"><table><tr><th>Pick</th><th>Player</th><th>Team</th><th>OVR</th><th>PTS</th></tr>${cls.slice(0,12).map(x=>`<tr class="${x.me?'mine':x.rv?'rvrow':''}"><td>${x.pick>60?'UDFA':'#'+x.pick}</td><td>${esc(x.name)}${x.ret?' <span class="muted">(ret.)</span>':''}</td><td>${x.ret?'—':tShort(x.team)}</td><td>${x.ret?'—':x.ovr}</td><td>${Math.round(x.pts).toLocaleString()}</td></tr>`).join('')}</table></div></details>
  <details><summary>Award history</summary><div class="scroll"><table><tr><th>Yr</th><th>Champion</th><th>MVP</th><th>DPOY</th></tr>${L.hist.slice().reverse().map(x=>`<tr><td>${x.yr}</td><td>${tShort(x.champ)}</td><td>${x.mvp===S.name?'<b class="gold">You</b>':x.mvp||'—'}</td><td>${x.dpoy===S.name?'<b class="gold">You</b>':x.dpoy||'—'}</td></tr>`).join('')}</table></div></details></details>`;}
function eraCard(){const L=S.L;if(!L)return'';const c=career(),all=L.P.filter(p=>p.car.gp>0).map(p=>({name:p.name,pts:p.car.pts,mvps:p.mvps,rings:p.rings,rv:p===S.rival}));
  all.push({name:S.name+' (you)',pts:c.pts,mvps:c.cnt.MVP||0,rings:c.cnt.Champion||0,me:1});
  const by=k=>all.slice().sort((a,b)=>b[k]-a[k]||b.pts-a.pts),rk=k=>1+by(k).findIndex(x=>x.me),bp=by('pts');
  return`<details class="card" open><summary>🏟️ Your era · ${all.length} players</summary><div class="stat3" style="margin-top:10px"><div class="stat"><b>#${rk('pts')}</b>POINTS</div><div class="stat"><b>${c.cnt.MVP?'#'+rk('mvps'):'—'}</b>MVPS</div><div class="stat"><b>${c.cnt.Champion?'#'+rk('rings'):'—'}</b>RINGS</div></div>
  <div class="scroll"><table><tr><th>#</th><th>Most points in your era</th><th>PTS</th><th>MVP</th><th>💍</th></tr>${bp.slice(0,10).map((x,i)=>`<tr class="${x.me?'mine':x.rv?'rvrow':''}"><td>${i+1}</td><td>${esc(x.name)}</td><td>${Math.round(x.pts).toLocaleString()}</td><td>${x.mvps}</td><td>${x.rings}</td></tr>`).join('')}</table></div></details>`;}
