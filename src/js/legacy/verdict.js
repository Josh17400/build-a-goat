// ---------- verdict ----------
function career(){const c={gp:0,pts:0,reb:0,ast:0,stl:0,blk:0,min:0};const cnt={};let peak=0,peakP=0;
  for(const s of S.nba){c.gp+=s.gp;c.pts+=s.ppg*s.gp;c.reb+=s.rpg*s.gp;c.ast+=s.apg*s.gp;c.stl+=s.spg*s.gp;c.blk+=s.bpg*s.gp;c.min+=s.mins*s.gp;peak=Math.max(peak,s.ovr);peakP=Math.max(peakP,s.ppg);for(const a of s.aw)cnt[a]=(cnt[a]||0)+1;}
  return{...c,cnt,peak,peakP,seasons:S.nba.length};}
function goatScore(c){const k=c.cnt,g=x=>k[x]||0;
  return Math.round(g('Champion')*12+g('MVP')*18+g('Finals MVP')*8+g('All-NBA 1st')*7+g('All-NBA 2nd')*4+g('All-NBA 3rd')*2+g('All-Star')*3+g('DPOY')*5+g('ROY')*2+g('Scoring Title')*3+g('6MOY')+g('MIP')+g('Comeback Player')+c.pts/1000*2+Math.max(0,c.peak-80)*2+(S.gw||0)*2+(S.fgw||0)*3+(S.lastDance?8:0));}
// how strong a group really is for you: your two best skills in it, as shown on screen
const gStr=c=>{const v=SUBS[c].map(([k])=>es(k)).sort((a,b)=>b-a);return(v[0]+(v[1]??v[0]))/2;};
// where you rank in the all-time GOAT debate (1 when there is no league history yet)
// your all-time rank for the career tiers: against league legends and retired players (active careers are still being written)
const atRank=sc=>!S.L||!S.L.leg?1:allTime('score').filter(x=>!x.me&&!x.now&&x.score>sc).length+1;
function tierOf(sc,c){const avgMin=c.gp?c.min/c.gp:0,AS=c.cnt['All-Star']||0,RG=c.cnt['Champion']||0;
  if(AS===0){if(RG>=3)return['Champion Role Player',`${RG} rings as a key piece. Never the star, always on the parade float.`];sc=Math.min(sc,40);}
  if(sc>=350){const top=S.L&&S.L.leg?allTime('score')[0]:null;if(!top||top.me)return['🐐 THE GOAT','The greatest to ever do it. Nobody is arguing.'];
    if(atRank(sc)<=10)return['Top 10 All-Time',`A GOAT-level résumé, but ${top.name} still ranks ahead of you in the GOAT debate.`];}
  if(sc>=145&&AS>=4&&atRank(sc)<=10)return['Top 10 All-Time',''+(atRank(sc)<=4?'Mount Rushmore conversations. Barbershop debates forever.':'A top-10 all-time résumé. Barbershop debates forever.')];
  if(sc>=85&&AS>=5)return['Hall of Famer','First ballot. Jersey in the rafters.'];
  if(sc>=60&&AS>=4)return['Perennial All-Star','A star for a decade. Hall of Fame on the bubble.'];
  if((c.cnt['All-Star']||0)>=1)return['All-Star',(c.cnt['DPOY']||0)>=3?`${c.cnt['DPOY']}× Defensive Player of the Year. Scorers still have nightmares about you.`:RG>=3?`${RG} rings and ${(c.cnt['All-Star']||0)===1?'an All-Star nod':(c.cnt['All-Star']||0)+' All-Star nods'}. You made every team you joined better.`:'You had your moment in the sun.'];
  if(S.pick<=14&&sc<20)return['Bust','A lottery pick who never lived up to it.'];
  if(avgMin>=26&&c.seasons>=6)return['Solid Starter','You got paid, started for years and earned respect around the league.'];
  if(c.seasons>=5)return['Role Player','You carved out a career. Locker room guy.'];
  return S.pick>14?['Journeyman',S.pick>=61?'Undrafted, and the league never found a spot for you.':'You bounced around but never stuck.']:['Bust','It just never clicked.'];}
const GOAT_LINE=350;
function goatStd(){try{return JSON.parse(localStorage.getItem('bag_rec')||'{}')[S.diff]||null;}catch{return null;}}
function finish(){const c=career(),sc=goatScore(c),[t]=tierOf(sc,c);
  S.gemsRun=S.daily?0:Math.round((GEM_TIER[t]||3)*(GEM_MULT[S.diff]??1));if(S.gemsRun)try{localStorage.setItem('bag_gems',gems()+S.gemsRun);}catch{}
  if(!S.daily&&t.includes('GOAT')){immortalize(c,sc);const r=goatStd();if(!r||sc>r.score){S.newStd={prev:r};try{const all=JSON.parse(localStorage.getItem('bag_rec')||'{}');all[S.diff]={score:sc,name:S.name};localStorage.setItem('bag_rec',JSON.stringify(all));}catch{}earnGtp(r?40:20,r?'Broke the GOAT standard':'Set the GOAT standard');}}
  const hof=JSON.parse(localStorage.getItem('bag_hof')||'[]');hof.push({hl:highlights(true).slice(0,2),diff:S.diff,name:S.name,pos:S.pos,arch:archName(),bd:Object.keys(S.bdg||{}).length,score:sc,tier:t,pick:S.pick,ppg:c.gp?c.pts/c.gp:0,rings:c.cnt['Champion']||0,mvp:c.cnt['MVP']||0,date:Date.now()});
  hof.sort((a,b)=>b.score-a.score);localStorage.setItem('bag_hof',JSON.stringify(hof.slice(0,15)));S.newAch=S.diff==='rookie'?[]:checkAch(c,sc,t);earnGtp(GTP_TIER[t]||0,'Career: '+t);S.gtpRun=Math.round(S.gtpRun||0);setGtp(gtpBank()+S.gtpRun);try{const rec=[...Object.keys(S.seenE||{}),...(S.seenF||[]),...RECENT()];localStorage.setItem('bag_recent',JSON.stringify([...new Set(rec)].slice(0,70)));}catch{}
  if(S.daily){const runs=dailyBest();runs.push({name:S.name,score:sc,tier:t});runs.sort((a,b)=>b.score-a.score);localStorage.setItem('bag_daily',JSON.stringify({date:todayKey(),runs:runs.slice(0,10)}));}
  S.stage='end';}

