// ---------- badges: earned from your skills, never bought. Bronze, Silver, Gold, Platinum ----------
// sk: skills averaged into the badge rating (an inner list = the best of those), h: size range in inches, fx: boost per tier
const BT=[74,82,89,95],BTN=['','Bronze','Silver','Gold','Platinum'];
const BADGES=[
  {id:'rain',n:'Rainmaker',f:'Shooting',sk:['three'],fx:{tp:.6,pts:.3}},
  {id:'cash',n:'Catch & Cash',f:'Shooting',sk:['three','offb'],fx:{tp:.4,pts:.25}},
  {id:'elbow',n:'Elbow Operator',f:'Shooting',sk:['mid'],fx:{fg:.5,pts:.3}},
  {id:'silk',n:'Silk Fade',f:'Shooting',sk:['fade','mid'],fx:{pts:.4,fg:.3}},
  {id:'sky',n:'Skyline Shooter',f:'Shooting',sk:['three','mid'],h:[81,99],fx:{tp:.4,team:.2}},
  {id:'money',n:'Free Money',f:'Shooting',sk:['ft'],fx:{ft:1.5,pts:.2}},
  {id:'contort',n:'Contortionist',f:'Finishing',sk:['layup'],fx:{fg:.5,pts:.2}},
  {id:'air',n:'Air Raid',f:'Finishing',sk:['dunk','vert'],fx:{fg:.4,as:.3}},
  {id:'foul',n:'Foul Magnet',f:'Finishing',sk:[['layup','post'],'str'],fx:{pts:.4}},
  {id:'hook',n:'Hook, Line & Sinker',f:'Finishing',sk:['hook'],fx:{fg:.5,pts:.3}},
  {id:'surgeon',n:'Low-Post Surgeon',f:'Finishing',sk:['post',['hook','fade']],fx:{pts:.4,ast:.04}},
  {id:'second',n:'Second Helping',f:'Finishing',sk:['oreb',['dunk','close']],fx:{reb:.03,pts:.3}},
  {id:'coast',n:'Coast to Coast',f:'Finishing',sk:['speed',['dunk','layup']],fx:{pts:.35}},
  {id:'table',n:'Table Setter',f:'Playmaking',sk:['pass','iq'],fx:{ast:.05}},
  {id:'yoyo',n:'Yo-Yo',f:'Playmaking',sk:['handle'],fx:{tov:.05,pts:.2}},
  {id:'grab',n:'Grab-and-Go',f:'Playmaking',sk:['dreb','handle','pass'],fx:{ast:.04,reb:.02}},
  {id:'extra',n:'Extra Pass',f:'Playmaking',sk:['pass','offb'],fx:{ast:.03,team:.15}},
  {id:'velcro',n:'Velcro',f:'Defense',sk:['perD','lat'],fx:{dp:.5,stl:.03,team:.15}},
  {id:'pirate',n:'Lane Pirate',f:'Defense',sk:['stl','iq'],fx:{stl:.035}},
  {id:'swat',n:'Swat Team',f:'Defense',sk:['blk','vert'],fx:{blk:.035}},
  {id:'nofly',n:'No Fly Zone',f:'Defense',sk:['blk','intD'],h:[81,99],fx:{blk:.03,dp:.6,team:.15}},
  {id:'bouncer',n:'Bouncer',f:'Defense',sk:['intD','str'],fx:{dp:.4,reb:.02,team:.1}},
  {id:'switch',n:'Switchblade',f:'Defense',sk:['perD','intD','lat'],h:[77,82],fx:{dp:.6,team:.2}},
  {id:'vacuum',n:'Vacuum',f:'Rebounding',sk:['dreb','str'],fx:{reb:.035}},
  {id:'mgoat',n:'Mountain Goat',f:'Rebounding',sk:['vert',['oreb','dreb']],fx:{reb:.03}},
  {id:'tank',n:'Bottomless Tank',f:'Body & mind',sk:['stam'],fx:{min:.5}},
  {id:'metro',n:'Metronome',f:'Body & mind',sk:['cons'],fx:{var:.15}},
  {id:'film',n:'Film Junkie',f:'Body & mind',sk:['iq'],fx:{tov:.03,team:.15}},
  {id:'bandit',n:'Backdoor Bandit',f:'Body & mind',sk:['offb','layup'],fx:{pts:.3,fg:.3}}];
const BADGE=Object.fromEntries(BADGES.map(b=>[b.id,b]));
// three badges that fit each role, shown on the projection card and the profile
const ARCH_SIG={floor:['table','yoyo','film'],creator:['elbow','yoyo','silk'],sniper:['rain','cash','money'],slasher:['contort','air','foul'],lock:['velcro','pirate','tank'],
  threeD:['cash','velcro','switch'],twoway:['switch','bandit','extra'],pointF:['grab','table','silk'],runner:['air','coast','second'],stretch:['sky','silk','vacuum'],
  post:['surgeon','hook','foul'],glass:['vacuum','second','mgoat'],rim:['nofly','swat','bouncer']};
// a badge's rating: the average of its skills as shown on screen (height and frame included); null when you are outside its size range
// a pair or trio badge can't ride on one maxed skill: its rating is at most 6 above its weakest part
function badgeRating(b){if(b.h&&(S.height<b.h[0]||S.height>b.h[1]))return null;const v=b.sk.map(k=>Array.isArray(k)?Math.max(...k.map(x=>Math.round(es(x)))):Math.round(es(k)));return Math.min(v.reduce((a,x)=>a+x,0)/v.length,Math.min(...v)+6);}
const tierFor=r=>r==null?0:BT.filter(x=>r>=x).length;
// tiers open up as the career does: high school up to Silver, college Gold, the NABL Platinum
const bCap=()=>{const st=S.stage;return st==='nba'||st==='end'?4:st==='college'||st==='draft'?3:2;};
// Gold needs a 70 OVR player and Platinum an 80, so badges never run far ahead of your rating
const ovrCap=()=>{const o=OV();return o>=80?4:o>=70?3:2;};
const badgeQual=()=>{const c=Math.min(bCap(),ovrCap()),q={};for(const b of BADGES)q[b.id]=Math.min(c,tierFor(badgeRating(b)));return q;};
// the only place badges change: career start/spending ('up': upgrades only), season end ('season': upgrades, and a badge drops one tier
// when its rating falls 3 below that tier's line), loading an old save ('load': silent). Pure: no dice, never called from drawing
function updBadges(mode){const q=badgeQual(),ch=[];S.bdg=S.bdg||{};S.bdgBest=S.bdgBest||{};
  for(const b of BADGES){const id=b.id,h=S.bdg[id]||0,qt=q[id];
    if(qt>h){S.bdg[id]=qt;ch.push([id,h,qt]);}
    else if(mode==='season'&&h>0&&qt<h){const r=badgeRating(b);if(r==null||r<BT[h-1]-3){S.bdg[id]=h-1;ch.push([id,h,h-1]);}}}
  for(const id in S.bdg)if(!S.bdg[id])delete S.bdg[id];for(const id in S.bdg)S.bdgBest[id]=Math.max(S.bdgBest[id]||0,S.bdg[id]);
  S.bdgMax=Math.max(S.bdgMax||0,Object.keys(S.bdg).length);if(Object.values(S.bdg).some(t=>t>=4))S.bdgPlat=1;bookSave();
  return mode==='load'?[]:ch;}
// the total boost from every badge you hold, capped so a player with a dozen badges is better, not broken
const BCAP={pts:2,fg:2,tp:2.5,ft:6,reb:.1,ast:.15,stl:.15,blk:.15,tov:.15,min:2,dp:4,as:2,team:1.5,var:.6};
function badgeFx(){const o={};for(const k in BCAP)o[k]=0;const B=S.bdg||{};for(const b of BADGES){const t=B[b.id];if(t)for(const k in b.fx)o[k]+=b.fx[k]*t;}for(const k in BCAP)o[k]=Math.min(o[k],BCAP[k]);return o;}
const FXL={pts:['PPG',1],fg:['FG%',1],tp:['3P%',1],ft:['FT%',1],reb:['Rebounds',2],ast:['Assists',2],stl:['Steals',2],blk:['Blocks',2],tov:['Turnovers',3],min:['Minutes',1],dp:['DPOY votes',0],as:['All-Star votes',0],team:['Team strength',0],var:['Steadier seasons',4]};
function fxText(fx,t){return Object.entries(fx).map(([k,v])=>{const[l,m]=FXL[k],x=v*t;return m===1?`${l} +${f1(x)}`:m===2?`${l} +${Math.round(x*100)}%`:m===3?`${l} −${Math.round(x*100)}%`:m===4?`${l}`:`${l} up`;}).join(' · ');}
function badgeLines(ch){return ch.map(([id,h,t])=>{const n=BADGE[id].n;return t>h?(h?`🏅 ${n} upgraded to ${BTN[t]}`:`🏅 New badge: ${BTN[t]} ${n}`):`📉 ${S.stage==='nba'&&S.age>=30?'Age is catching up: ':''}${t?`${n} drops from ${BTN[h]} to ${BTN[t]}`:`${n} fades away`}`;});}
// spending can cross a line: the badge comes right away, with a toast (never during a replay or a headless run)
function spendBadges(){if(!seasonsPlayed())return;const ch=updBadges('up');if(ch.length&&!REPLAY&&typeof document!=='undefined'&&document.body&&!document.documentElement.classList.contains('wt')&&typeof platToast==='function')platToast(badgeLines(ch).join(' · '));}
// the Badge Book: the best tier you have ever reached on each badge, across careers (shown on every difficulty, pays nothing)
function bookGet(){return Store.obj('bag_bbook');}
function bookSave(){if(!Store.ok())return;const k=bookGet();let c=0;for(const id in S.bdg||{})if((k[id]||0)<S.bdg[id]){k[id]=S.bdg[id];c=1;}if(c)Store.setJson('bag_bbook',k);}
const bookCount=()=>Object.keys(bookGet()).length;
const bMed=t=>`<span class="bmed t${t}" title="${BTN[t]}">${icon('medal')}</span>`;
const skNames=b=>b.sk.map(k=>Array.isArray(k)?k.map(x=>SKN[x]).join(' or '):SKN[k]).join(' + ')+(b.h?` · ${b.h[1]>=99?ht(b.h[0])+' and up':ht(b.h[0])+' to '+ht(b.h[1])}`:'');
// next badge line for one skill: the closest tier this skill feeds (shown on skill rows when it is within reach)
// a pair badge rates at most 6 above its weaker skill: name that skill when it is the one holding the badge back
function badgeWeak(b){const v=b.sk.map(k=>Array.isArray(k)?k.reduce((m,x)=>es(x)>es(m)?x:m):k),av=v.reduce((s,k)=>s+Math.round(es(k)),0)/v.length,w=v.reduce((m,k)=>es(k)<es(m)?k:m);return Math.round(es(w))+6<av?w:null;}
function badgeHint(k){let best=null;const c=S.stage==='build'?2:bCap(),B=S.bdg||{};
  for(const b of BADGES){if(!b.sk.some(x=>Array.isArray(x)?x.includes(k):x===k))continue;const r=badgeRating(b);if(r==null)continue;const t=Math.max(B[b.id]||0,tierFor(r));if(t>=c)continue;const gap=BT[t]-r;if(gap<=6&&(!best||gap<best[1]))best=[b,gap,t+1];}
  return best?`<small class="bh">${bMed(best[2])}<span><b>${BTN[best[2]]} ${best[0].n}</b> at ${BT[best[2]-1]}${best[0].sk.length>1?' avg':''} · ${Math.max(1,Math.ceil(best[1]))} to go${(()=>{const w=badgeWeak(best[0]);return w&&w!==k?(atCap(w)?` · ${SKN[w]} is maxed`:` · raise ${SKN[w]}`):'';})()}${best[2]>=3&&best[2]>ovrCap()?` · needs ${best[2]>=4?80:70} OVR`:''}</span></small>`:'';}
function badgeRow(b,t,extra){return`<div class="brow">${bMed(t||0)}<div class="grow"><b>${b.n}</b>${t?` <span class="muted">${BTN[t]}</span>`:''}<div class="sub">${skNames(b)}</div>${extra||`<div class="note">${fxText(b.fx,Math.max(1,t))}</div>`}</div></div>`;}
function badgesTab(){const B=S.bdg||{},c=bCap(),held=BADGES.filter(b=>B[b.id]).sort((x,y)=>B[y.id]-B[x.id]),rest=BADGES.filter(b=>!B[b.id]||B[b.id]<4);
  const close=rest.map(b=>{const r=badgeRating(b),t=B[b.id]||0;return{b,r,t,gap:r==null?99:BT[t]-r};}).filter(x=>x.gap<=8).sort((x,y)=>x.gap-y.gap);
  const locked=BADGES.filter(b=>!B[b.id]&&!close.some(x=>x.b===b)),sig=ARCH_SIG[archetype().id];
  return`<div class="card"><div class="sh">${icon('medal','ici')} <span class="grow">Your badges</span><b>${held.length}</b></div>${held.length?held.map(b=>badgeRow(b,B[b.id])).join(''):`<div class="sub">${seasonsPlayed()?`No badges yet. Raise a skill to ${BT[0]} for your first Bronze.`:'Badges are earned by playing: your first ones come at the end of your first season. After that, raising a skill can earn one right away.'}</div>`}
  ${(S.badges||[]).length?`<div class="sh" style="margin-top:12px">${icon('trophy','ici')} <span class="grow">Story badges</span></div>${S.badges.map(x=>`<span class="pill gold">${esc(x)}</span>`).join('')}`:''}</div>
  ${close.length?`<div class="card"><div class="sh">${icon('target','ici')} <span class="grow">Close to</span></div>${close.map(x=>badgeRow(x.b,x.t,`<div class="note">${x.gap<=0?'Rating reached for '+BTN[x.t+1]:BTN[x.t+1]+' at '+BT[x.t]}${x.b.sk.length>1?' (average)':''} · you are at ${Math.floor(x.r)}${(()=>{const w=badgeWeak(x.b);return w?` (held back by ${SKN[w]} ${Math.round(es(w))}${atCap(w)?', maxed':''}: a pair rates at most 6 above its weaker skill)`:'';})()}${x.t+1>c?` · ${BTN[x.t+1]} opens ${c<3?'in college':'in the NABL'}${x.t+1>=3?` and needs ${x.t+1>=4?80:70} OVR`:''}`:x.t+1>ovrCap()?` · ${BTN[x.t+1]} needs ${x.t+1>=4?80:70} OVR`:''}</div>`)).join('')}</div>`:''}
  <div class="card"><div class="sh">${icon('star','ici')} <span class="grow">Signature badges for a ${archetype().n}</span></div><div class="sub">${sig.map(id=>BADGE[id].n).join(' · ')}</div></div>
  ${locked.length?`<details class="card"><summary>Locked · ${locked.length}</summary>${locked.map(b=>badgeRow(b,0,`<div class="note">Bronze at ${BT[0]}${b.sk.length>1?' (average)':''}</div>`)).join('')}</details>`:''}
  <div class="note">Tiers: Bronze ${BT[0]}, Silver ${BT[1]}, Gold ${BT[2]}, Platinum ${BT[3]}. High school reaches Silver, college Gold, the NABL Platinum. Gold also needs 70 OVR and Platinum 80 OVR. A pair badge rates at most 6 above its weaker skill. At season end a badge drops one tier if it falls 3 below its line.</div>`;}
function badgeBookHTML(){const k=bookGet(),n=Object.keys(k).length;
  return`<div class="card"><div class="sh">${icon('book','ici')} <span class="grow">Badge Book</span><b>${n}/${BADGES.length}</b></div><div class="sub">The best tier you have ever reached on each badge, across all your careers.</div>
  ${['Shooting','Finishing','Playmaking','Defense','Rebounding','Body & mind'].map(f=>`<div class="sh" style="margin-top:12px"><span class="grow">${f}</span></div>${BADGES.filter(b=>b.f===f).map(b=>`<div class="brow">${bMed(k[b.id]||0)}<div class="grow"><b class="${k[b.id]?'':'muted'}">${b.n}</b>${k[b.id]?` <span class="muted">${BTN[k[b.id]]}</span>`:''}<div class="sub">${skNames(b)}</div></div></div>`).join('')}`).join('')}</div>`;}

function heightNote(){const keys=[['oreb','Rebounding'],['blk','Block'],['dunk','Dunk'],['intD','Interior D'],['handle','Ball Handle'],['speed','Speed']];
  return keys.map(([k,l])=>{const dv=Math.round(es(k)-S.attrs[k]-(FRAMES[S.frame][k]||0));return dv?`${l} ${dv>0?'+':''}${dv}`:null;}).filter(Boolean).join(' · ')||'no height bonuses or penalties';}
const DSP=[[40,38],[62,60],[69.7,70],[73,77],[80.6,85],[82.1,90],[87.4,95],[93,99]];
function dsp(x){x-=((diff().lg||0)-2)*.6*clamp((x-40)/30,0,1);if(x<=DSP[0][0])return Math.round(clamp(x-2,1,99));for(let i=1;i<DSP.length;i++){const[a,A]=DSP[i-1],[b,B]=DSP[i];if(x<=b)return Math.round(A+(x-a)/(b-a)*(B-A));}return 99;}
const OV=()=>dsp(ovr());
function grade(n){return n>=92?'A+':n>=87?'A':n>=83?'A-':n>=79?'B+':n>=75?'B':n>=71?'B-':n>=67?'C+':n>=63?'C':n>=58?'C-':'D';}

// natural growth toward a target overall
// natural growth follows the role you play now (archetype weights), with a quarter spread over everything so your game can evolve
function archPick(){const wn=ARCHS[archetype().id].wn;return()=>{if(R()<.25)return pick(SUBKEYS);let r=R();for(const[k,w]of wn){r-=w;if(r<=0)return k;}return wn[0][0];};}
function growTo(target){const pk=archPick();let g=0;
  while(ovr()<target&&g++<400){const sk=pk();if(S.attrs[sk]<99)S.attrs[sk]++;}}
function declineTo(target){let g=0;const keys=['speed','speed','vert','vert','stam','perD','str','layup','dunk','oreb','stl','blk'];
  while(ovr()>target&&g++<400){const k=pick(keys);if(S.attrs[k]>MIN_A)S.attrs[k]--;}}
// growth is never applied for you: it turns into bonus points worth exactly what that growth would cost, and you place them
// development pays DEVF of the points the growth would cost (tuned with the balance sims)
const DEVF=.7,HS_FL=1.2,COL_FL=1.0,NBA_FL=1.0;
// catch-up (2026-11-08): starts are lower, so high school and college add a share of that drop each season on top of normal growth
const CATCH_HS=.17,CATCH_COL=.12;
function growPts(target){const a0={...S.attrs};growTo(target);let p=0;for(const k in S.attrs)for(let v=a0[k];v<S.attrs[k];v++)p+=cost(v);p=Math.round(p*DEVF);S.attrs=a0;if(p>0){S.bank+=p;S.devPts=(S.devPts||0)+p;}return p;}
// S.natO: where natural growth alone has taken you. Development pays the points for that growth, measured from your current
// skills, so a player who spent ahead of it keeps developing until natural growth reaches the hidden ceiling
// fl: the growth a young player gets just from getting older and playing (HS, college, pro up to 25), even past the ceiling
function develop(rate,fl){if(S.natO==null)S.natO=ovr();const o=S.natO;if(S.perks&&S.perks.dev&&S.stage!=='nba')rate*=1.4;const g=Math.min(S.stage==='nba'?(S.age>29?2:3.5):99,Math.max(o<S.ceiling?(S.ceiling-o)*rate:0,fl||0));const gg=g+(S.stage==='nba'?0:(diff().cl||0)*(S.stage==='hs'?CATCH_HS:CATCH_COL));if(gg>0){growPts(ovr()+gg);S.natO=o+gg;}}
// why the OVR moved this season, from VISIBLE causes only (age, traits, college program, injuries) plus a deliberately noisy scout
// read of the remaining room. Never names frame effects or hidden numbers; the true ceiling stays an end-screen reveal.
function scoutNoise(){return(((S.seed||7)*2654435761>>>0)%11)-5;}
function growWhy(o0,st,x){const o1=OV(),d=o1-o0,t=S.traits,age=S.age,r=[],dp=S.devPts||0;S.devPts=0;x=x||{};
  if(st==='nba')r.push(age<=23?(d<0&&x.hurt?'the injury set you back':d<0?'young: a dip before the jump':dp>0?'young and still improving':'young: the jump can still come'):age<=27?(d<0?'a setback year':dp>0?'in your prime years':'prime years, holding steady'):age<=29?(dp>8?'prime years: still adding to your game':dp>0?'prime years: small gains':'prime years: you hold steady'):dp>0&&d>=0?(age>=34?'still holding off Father Time':'still playing at your peak'):d<=-4?'age is catching up fast':'age starts to catch up');
  else r.push(st==='hs'?'high school development':`${TIER[S.tier].lbl} program`);if(st!=='nba'&&S.perks&&S.perks.dev)r.push('Elite trainer +40%');
  const late30=st==='nba'&&age>=30;if(t.work>=4&&(dp>0||late30))r.push(late30?`Work Ethic ${t.work}/5 slows the decline`:`Work Ethic ${t.work}/5 speeds you up`);else if(t.work<=2)r.push(late30?`Work Ethic ${t.work}/5 speeds the decline`:`Work Ethic ${t.work}/5 holds you back`);
  if(t.late>=4&&age<=23)r.push('Late Bloomer: your jump comes later');
  if(st==='college'&&t.coach>=4)r.push('Coachability pays off');
  if(st==='nba'&&age>=30&&t.dur<=2)r.push('low Durability speeds the decline');
  if(x.hurt)r.push('the injury cost you reps');
  if(st!=='nba'){const room=S.ceiling-(S.natO??ovr())+scoutNoise();r.push(room>8?'scouts see lots of room to grow':room>3?'scouts see some room left':st==='hs'||age<=20?'scouts say the rest is up to your work':'scouts think you are close to your peak');}
  const a=archetype();let evo='';if(S.archId&&a.id!==S.archId){const pair=S.archId+'>'+a.id,lockId=S.idLock&&Object.keys(ARCHS).find(k=>ARCHS[k].n===S.idLock);if(lockId===a.id)S.idLock=null;if(st==='nba'&&lockId!==a.id&&!S.farewell&&S.age<33&&!(S.evoDone||[]).includes(pair)&&S.nba.length-(S.evoAt??-9)>=4){(S.evoDone=S.evoDone||[]).push(pair);S.evoAt=S.nba.length;S.evoPend={from:lockId||S.archId,to:a.id};evo=` · 🔄 Your game is changing: you now play like a${/^[AEIOU]/.test(a.n)?'n':''} ${a.n}. Your call this summer`;}else evo=` · 🔄 Your game has evolved: you now play like a${/^[AEIOU]/.test(a.n)?'n':''} ${a.n}`;}S.archId=a.id;
  return[dp>0?1:d<0?-1:0,`${dp>0?`📈 Development: +${dp} pt${dp===1?'':'s'} to spend`:d<0?`📉 OVR ${o0} to ${o1} (${d})`:'➖ No growth this year'}${dp>0&&d<0?` · OVR ${o0} to ${o1} (${d})`:''}: ${r.join(' · ')}${evo}`];}
const nablAgeF=a=>a<=27?1:a===28?.9:a===29?.8:Math.max(.25,.8-(a-29)*.15);
function addBank(n){n*=3;if(n>=0)S.bank+=n*2;else{const t=S.bank+n;if(t<0){S.bank=0;S.bankShort=-t;declineTo(ovr()+t*0.15);}else S.bank=t;}}
function starNext(){const s=ovr()+S.hype*0.35,n=[58,65,72].find(x=>s<x);return n?Math.ceil(n-s):0;}
const rankStars=r=>r<=10?5:r<=35?4:r<=75?3:2;
function stars(){const s=ovr()+S.hype*0.35,c=S.stage==='hs'||S.stage==='offers'?classRank():null;return Math.max(s>=72?5:s>=65?4:s>=58?3:2,c?rankStars(c.rank):2,S.starFloor||0);}

