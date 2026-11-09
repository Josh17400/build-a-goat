// ---------- growth: development turns into points you place; decline takes skills away ----------
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
