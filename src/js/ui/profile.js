// ---------- player profile: everything about your player, one tap from the career screen ----------
const PROF_T=[['over','Overview'],['skills','Skills'],['badges','Badges'],['stats','Stats'],['time','Timeline'],['traits','Traits']];
function openProfile(t){document.activeElement?.blur?.();if(UI().menu)UI().menu=null;if(!UI().prof)UI().spMsg=null;if(UI().prof!==t)UI().open=null;UI().prof=t||'over';render();scrollTo(0,0);}
function armMax(k){if(impactMap()[k]==='lo'&&UI().maxArm!==k){const[c]=maxCost(k);UI().maxArm=k;UI().spMsg={k,t:`${SKN[k]||k} adds little to your OVR. Tap the gold button to spend ${c} pts on it anyway`};render();return;}spend(k,99);}
function closeProfile(){UI().spMsg=null;clearUndo();UI().maxArm=null;UI().prof=null;render();scrollTo(0,0);}
// shown only, never chosen: from height, the frame's name, Strength and age (rounded to 5 lb). Reads no hidden frame effects
function weightLb(){const bmi={Lean:23,Balanced:24.7,Strong:26.8}[S.frame]||24.7,b=bmi+(S.attrs.str-60)*.03-Math.max(0,21-S.age)*.45;return Math.round(b*S.height*S.height/703/5)*5;}
// high school and college seasons keep their numbers in st; older saves only have the text line, read back here
const lvlRows=a=>a.map(x=>x.st||(()=>{const m=(x.line.match(/[\d.]+(?= [PRASB]PG)/g)||[]).map(Number);return m.length>=5?{ppg:m[0],rpg:m[1],apg:m[2],spg:m[3],bpg:m[4]}:null;})()).filter(Boolean);
function lvlAvg(rows){if(!rows.length)return null;const o={};for(const k of['ppg','rpg','apg','spg','bpg'])o[k]=rows.reduce((s,r)=>s+r[k],0)/rows.length;return o;}
function profOver(){const a=archetype(),c=S.nba.length?career():null,st=S.stage,pro=st==='nba'||st==='end';
  const info=[['Height',ht(S.height)],['Weight',weightLb()+' lb'],['Frame',S.frame],['Age',S.age],['Listed',S.pos],['Era',era().name.replace(EMO_RE,'').trim()],
    [pro?'Team':'School',pro?(S.team||'-'):(S.school||'High school')],...(S.pick?[['Drafted',pickTxt(S.pick)]]:[]),...(st==='hs'||st==='offers'?[['Recruit',stars()+'-star']]:[]),
    ...(!pro?[['Hype',Math.max(0,Math.round(S.hype))]]:[]),...(S.rival?[['Rival',S.rival.name]]:[]),...(c?[['NABL seasons',c.seasons]]:[])];
  return`<div class="card"><div class="sh">${icon('user','ici')} <span class="grow">You play like</span><b>OVR ${OV()}</b></div><div class="pn">${a.name}</div>${a.fits[0][0]!==a.id?`<div class="note" style="margin:2px 0 6px">Leaning toward ${ARCHS[a.fits[0][0]].n}: it takes a clear edge to switch styles</div>`:''}${a.fits.slice(0,3).map(([id,v])=>`<div class="fit"><span>${ARCHS[id].n}</span><div class="bar"><i style="width:${clamp(dsp(v),0,99)}%"></i></div><b>${dsp(v)}</b></div>`).join('')}</div>
  <div class="card"><div class="pgrid">${info.map(([k,v])=>`<div><small>${k}</small><b>${esc(String(v))}</b></div>`).join('')}</div></div>`;}
function profSkills(){const can=S.bank>0;
  return`${can?`<div class="bankbar"><div class="grow"><b>${S.bank} bonus point${S.bank>1?'s':''} to spend</b><div class="sub">Tap + on any skill. Points carry over your whole career.</div></div></div>`:''}${projCard()}<div class="sub">Tap a group to open it. Numbers include your height and frame.</div>${skillAcc(can?'bank':'view')}`;}
// every season on one page: where you were, what you put up, the calls you made
function profTime(){const row=(age,where,ovr,line,extra,sub)=>`<div style="padding:8px 0;border-top:1px solid rgba(255,255,255,.08)"><div><b>Age ${age} · ${where}</b>${ovr!=='—'?` · <span class="muted">started at ${ovr} OVR</span>`:''}</div><div>${line} <span class="muted">PTS / REB / AST</span>${extra?` · <span class="gold">${extra}</span>`:''}</div>${sub?`<div class="muted" style="font-size:.82rem;margin-top:2px">${sub}</div>`:''}</div>`,sl=st=>`${f1(st.ppg)} / ${f1(st.rpg)} / ${f1(st.apg)}`;
  const rows=[];S.hs.forEach((h,i)=>rows.push(row(14+i,`HS ${YR[i]}`,'—',sl(h.st),h.stars?'★'.repeat(h.stars):'',(h.ev||[]).filter(e=>/Last summer/.test(e[1])).map(e=>e[1].replace(EMO_RE,'').trim().replace('Last summer:','Summer before:')).join(' · '))));
  S.col.forEach((c,i)=>rows.push(row(18+i,`${esc(S.school||'College')}`,'—',sl(c.st),(c.acc||[]).map(x=>x.replace(EMO_RE,'').trim()).join(', '),'')));
  S.nba.forEach(s=>{const aw=s.aw.filter(x=>!/All-NBA 2nd|All-NBA 3rd/.test(x));const ev=(s.notes||[]).filter(x=>/Summer:|Midseason:|Offseason:/.test(x)).map(x=>x.replace(EMO_RE,'').trim().replace(/^Summer:/,'Summer before:').replace(/^Offseason:/,'Offseason before:'));const cl=(s.clutch||[]).map(c=>`${c.won?'Won':'Lost'} the final play (${c.title})`);
    rows.push(row(s.age,tShort(s.team),s.ovrIn??Math.round(dsp(s.ovr)),sl(s),aw.join(', ')||(s.path&&s.path.length?'Playoffs':''),[...ev,...cl].join(' · ')));});
  if(!rows.length)return`<div class="card"><div class="sub">Your timeline fills in as you play.</div></div>`;
  return`<div class="card"><div class="sh">📅 <span class="grow">Career timeline</span></div>${rows.join('')}</div>`;}
// the best moments of a finished career
function highlights(byWeight){const out=[];let top=null;for(const s of S.nba){const yr=`age ${s.age}`;

    for(const c of s.clutch||[])if(c.won&&c.fin&&s.aw.includes('Champion'))out.push([5,`🎯 ${c.title} at ${yr}: ${c.text}`]);
    if(s.aw.includes('Scoring Title'))out.push([3,`🔥 Scoring title at ${yr} (${f1(s.ppg)} PPG)`]);if(s.aw.includes('DPOY'))out.push([3,`🛡️ Defensive Player of the Year at ${yr}`]);
    for(const c of s.clutch||[])if(c.won&&!c.fin)out.push([3,`🎯 ${c.title}: you came through at ${yr}`]);
    for(const x of s.notes||[])if(/Midseason: You were traded/.test(x))out.push([2,`📞 ${x.replace(/^.*Midseason: /,'')} at ${yr}`]);
    for(const x of s.notes||[])if(/won the Dunk Contest|international gold/i.test(x))out.push([2,`${/Dunk/.test(x)?'🏀 Dunk Contest champion':'🥇 International gold'} at ${yr}`]);
    for(const x of s.path||[])if(s.rv&&x.includes(': beat')&&S.rival&&x.includes(tShort(S.rival.team)))out.push([3,`⚔️ ${x} at ${yr}`]);
    if(s.best&&(!top||s.best.pts>top.best.pts))top=s;
    for(const h of s.hist||[])if(/🐐|top 3 |top 5 |GOAT standard|50,000|40,000|30,000/.test(h)){const t=h.replace(EMO_RE,'').trim();if(/GOAT debate/.test(t)){for(let j=out.length-1;j>=0;j--)if(/GOAT debate/.test(out[j][1]))out.splice(j,1);}out.push([4,t]);}}
  {const ch=S.nba.filter(s=>s.aw.includes('Champion')),mv=S.nba.filter(s=>s.aw.includes('MVP')),fm=S.nba.filter(s=>s.aw.includes('Finals MVP')).length;
    if(ch.length)out.push([7,ch.length===1?`🏆 Champion with the ${tShort(ch[0].team)} at age ${ch[0].age}${fm?' (Finals MVP)':''}`:`🏆 ${ch.length}× champion (ages ${ch.map(s=>s.age).join(', ')})${fm?`, ${fm}× Finals MVP`:''}`]);
    if(mv.length)out.push([6,mv.length===1?`👑 MVP at age ${mv[0].age} (${f1(mv[0].ppg)} PPG)`:`👑 ${mv.length}× MVP (ages ${mv.map(s=>s.age).join(', ')})`]);}
  {const cts=(S.col||[]).filter(c=>(c.acc||[]).includes('🏆 National Champion'));if(cts.length)out.push([4,cts.length>1?`🎓 ${cts.length}× college national champion with ${S.school}`:`🎓 College national champion with ${S.school} (${(cts[0].title.match(/age \d+/)||['age '+18])[0]})`]);}{const fa=S.nba.find(s=>s.aw.includes('All-Star'));if(fa)out.push([3,`⭐ First All-Star selection at age ${fa.age}`]);}
  if(top&&top.best.pts>=40)out.push([3,`🔥 Career high: ${top.best.pts} points vs the ${tShort(top.best.opp)} at age ${top.age}`]);
  if(S.stage==='end'&&S.nba.length){const c=career();if(tierOf(goatScore(c),c)[0].includes('GOAT')){for(let j=out.length-1;j>=0;j--)if(/GOAT debate/.test(out[j][1]))out.splice(j,1);out.push([9,'#1 in the all-time GOAT debate']);}}
  const ag=t=>{const m=t.match(/(?:age|at) (\d+)/);return m?+m[1]:99;};return[...new Map(out.map(x=>[x[1],x])).values()].sort((a,b)=>b[0]-a[0]).slice(0,9).sort((a,b)=>byWeight?0:ag(a[1])-ag(b[1])).map(x=>x[1]);}
function profStats(){const c=S.nba.length?career():null;
  const lv=[['High school',lvlAvg(lvlRows(S.hs))],['College',lvlAvg(lvlRows(S.col))],['NABL',c?(()=>{const g=c.gp||1;return{ppg:c.pts/g,rpg:c.reb/g,apg:c.ast/g,spg:c.stl/g,bpg:c.blk/g};})():null]].filter(x=>x[1]);
  if(!lv.length)return`<div class="card"><div class="sub">No games yet. Your averages show up here after your first season.</div></div>`;
  const aw=c?Object.entries(c.cnt).sort((x,y)=>y[1]-x[1]):[],pc=x=>x==null?'-':(x*100).toFixed(1);
  return`<div class="card"><div class="sh">${icon('bars','ici')} <span class="grow">Per-game averages</span></div><table class="ptab"><tr><th></th><th>PPG</th><th>RPG</th><th>APG</th><th>SPG</th><th>BPG</th></tr>${lv.map(([l,o])=>`<tr><td>${l}</td>${['ppg','rpg','apg','spg','bpg'].map(k=>`<td>${f1(o[k])}</td>`).join('')}</tr>`).join('')}</table></div>
  ${[['College',S.col],['High school',S.hs]].map(([t,a])=>{const rows=a.map((x,i)=>[YR[i]||'Year '+(i+1),lvlRows([x])[0]]).filter(r=>r[1]);return rows.length?`<div class="card"><div class="sh">${icon('calendar','ici')} <span class="grow">${t} seasons</span></div><div class="pscroll"><table class="ptab"><tr><th>Yr</th><th>PPG</th><th>RPG</th><th>APG</th><th>SPG</th><th>BPG</th></tr>${rows.map(([l,o])=>`<tr><td>${l}</td>${['ppg','rpg','apg','spg','bpg'].map(k=>`<td>${f1(o[k])}</td>`).join('')}</tr>`).join('')}</table></div></div>`:'';}).join('')}
  ${c?`<div class="card"><div class="sh">${icon('calendar','ici')} <span class="grow">NABL seasons</span><b>${c.gp} games</b></div><div class="pscroll"><table class="ptab"><tr><th>Yr</th><th>Age</th><th>Team</th><th>GP</th><th>PPG</th><th>RPG</th><th>APG</th><th>FG%</th><th>3P%</th><th>FT%</th></tr>${S.nba.map(y=>`<tr><td>${y.yr}</td><td>${y.age}</td><td>${esc(tShort(y.team||''))}</td><td>${y.gp}</td><td>${f1(y.ppg)}</td><td>${f1(y.rpg)}</td><td>${f1(y.apg)}</td><td>${pc(y.fg)}</td><td>${pc(y.tp)}</td><td>${pc(y.ft)}</td></tr>`).join('')}</table></div>
  <div class="pgrid" style="margin-top:10px">${[['Points',c.pts],['Rebounds',c.reb],['Assists',c.ast],['Steals',c.stl],['Blocks',c.blk]].map(([k,v])=>`<div><small>${k}</small><b>${Math.round(v).toLocaleString('en-US')}</b></div>`).join('')}</div></div>`:''}
  ${aw.length?`<div class="card"><div class="sh">${icon('trophy','ici')} <span class="grow">Awards</span></div>${aw.map(([k,n])=>`<span class="pill gold">${k}${n>1?' ×'+n:''}</span>`).join('')}</div>`:''}`;}
function profTraits(){return`<div class="card">${TRAITS.slice().sort((a,b)=>(S.traits[b[0]]||0)-(S.traits[a[0]]||0)).map(([k,l,d])=>`<div class="trow"><div class="grow"><b>${l}</b><div class="sub">${d}</div></div>${pips(S.traits[k]||0)}</div>`).join('')}</div>`;}
function profileHTML(){const t=UI().prof;let b='';
  if(t==='over')b=profOver();if(t==='skills')b=profSkills();if(t==='badges')b=typeof badgesTab==='function'?badgesTab():'';if(t==='stats')b=profStats();if(t==='time')b=profTime();if(t==='traits')b=profTraits();
  return`<div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h1>Profile</h1><button class="ghost sm" onclick="closeProfile()">◀ Back</button></div><div class="card">${hero(false)}</div>
  <div class="seg ptabs" role="tablist">${PROF_T.map(([k,l])=>`<button role="tab" aria-selected="${t===k}" class="${t===k?'on':''}" onclick="openProfile('${k}')">${l}</button>`).join('')}</div>${b}`+dock(`<button onclick="closeProfile()">Back to your ${S.stage==='end'?'career recap':'career'}</button>`);}
function evList(ev){return ev.map(([g,t])=>`<div class="ev ${g>0?'good':g<0?'bad':''}">${t}</div>`).join('');}
function seasonList(arr,latest){if(!arr.length)return'';const rev=arr.slice().reverse();
  const one=s=>`<div class="season"><b>${s.title}</b>${s.stars?starsHTML(s.stars):''}</div><div class="line">${s.line}</div>${(s.acc||[]).map(a=>`<div class="ev gold">${a}</div>`).join('')}${evList(s.ev)}`;
  if(latest)return`<div class="card season0">${one(rev[0])}</div>`;
  return`<div class="card season0">${one(rev[0])}</div>${rev.length>1?`<details class="card"><summary>Earlier seasons · ${rev.length-1}</summary>${rev.slice(1).map(s=>`<div style="margin-top:14px">${one(s)}</div>`).join('')}</details>`:''}`;}

