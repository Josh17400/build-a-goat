// the playoffs: the real bracket with your series game by game. Game 7s and the last games of the Finals stop for your call,
// then the bracket is replayed from the same dice with your result locked in, so nothing else changes
function seasonPlayoffs(){const c=S.cur,t=S.traits,L=S.L,z=L.z,{n,a,prevO,o,gp,mins,ppg,rpg,apg,spg,bpg,fg,tp,ft,tov,wins,inj,rv,h2h}=c,prev=n?S.nba[n-1]:null;
  const rival=S.rival&&!S.rival.retired?S.rival:null,sameTeam=rival&&rival.team===S.team,notes=c.notes.slice();
  let po='Missed playoffs',rounds=-1,beatRival=-1,lostRival=-1,ci=0;const path=[],RN=['1st Round','2nd Round','Conf Finals','NBA Finals'];
  const mySeries={team:S.team,play:(oppT,rd,home)=>{if(rounds<0)rounds=0;const vsR=rival&&!sameTeam&&oppT===rival.team;
    const q=clamp(.5+(z[S.team]-z[oppT])*.11+(home?.03:-.03)+(t.clutch-3)*.015+(t.lead-3)*.008+(o>=85&&gp>60?.02:0)+(bsm()?.02:0),.12,.88);
    let w=0,l=0;const tags=[];
    while(w<4&&l<4){if(((w===3&&l===3)||(rd===3&&w+l===5))&&(c.mins>=26||c.ppg>=14)&&!/🚑/.test(c.inj||'')&&(rd===3||R()<.55)){const k=ci++,pre=c.clutch[k];if(!pre)throw{pause:1,ctx:{k,rd,opp:oppT,w,l,q,vsR}};
        if(pre.won)w++;else l++;tags.push(pre.won?(pre.shot?` · 🎯 your game-winner in Game ${w+l}`:` · 🛡️ your stop won Game ${w+l}`):` · 💔 lost Game ${w+l} on the final play`);}
      else if(R()<q)w++;else l++;}
    path.push(`${RN[rd]}: ${w===4?'beat':'lost to'} ${vsR?`${rival.name} and the ${oppT}`:`the ${oppT}`} ${w}-${l}${tags.join('')}`);
    if(w<4){if(vsR){lostRival=rd;notes.push(`😤 ${rival.name} ends your season`);}return false;}if(vsR)beatRival=rd;rounds=rd+1;return true;}};
  if(c.rs0!=null&&R.set)R.set(c.rs0);
  let br;try{br=lgBracket(L,mySeries);}catch(e){if(!e||!e.pause)throw e;S.pend=clutchPend(e.ctx);return;}
  S.cur=null;const champ=br.champ===S.team;if(rounds>=0)po=['Lost 1st Round','Lost 2nd Round','Lost Conf Finals','Lost NBA Finals','🏆 NBA CHAMPION'][rounds];
  for(const p of roster(L,br.champ))p.rings++;
  if(rival&&!sameTeam&&br.champ===rival.team)notes.push(`💍 ${rival.name} and the ${rival.team} win the title`);else if(!champ)notes.push(`🏆 The ${br.champ} win the title`);
  if(beatRival>=0)notes.push(`⚔️ You knocked ${rival.name} out in the ${RN[beatRival]}. Changing of the guard`);
  const gwN=c.clutch.filter(x=>x.won&&x.shot).length,fN=c.clutch.filter(x=>x.won&&x.shot&&x.fin).length;if(gwN){S.gw=(S.gw||0)+gwN;S.fgw=(S.fgw||0)+fN;S.hype+=4*gwN;}
  // awards: voted against every real player in the league
  const C=active(L).filter(p=>p.gp>0).map(p=>({p,name:p.name,team:p.team,ovr:p.ovr,gp:p.gp,ppg:p.ppg,rpg:p.rpg,apg:p.apg,spg:p.spg,bpg:p.bpg,tov:p.tov,fg:p.fg,wins:p.wins,star:p.star,d:p.d,dw:(p.aw&&p.aw.DPOY)||0,rook:p.yrs===0}));
  const ME={me:1,name:S.name,team:S.team,ovr:o,gp,ppg,rpg,apg,spg,bpg,tov,fg,wins,star:(t.star-3)*1.5+badgeFx().as,d:clamp(o*.85+6+(['PF','C'].includes(S.pos)?4:0)+clamp((Math.max(eff('def'),(es('intD')+es('blk'))/2,(es('perD')+es('stl'))/2-2)-o)*1.1,0,18)+(t.lock-3)*2+badgeFx().dp,35,99),dw:S.nba.filter(x=>x.aw.includes('DPOY')).length,rook:n===0};C.push(ME);
  for(const c of C){c.pr=prodScore(c);c.mv=c.ovr*.6+c.pr*.5+(c.wins-41)*.25+gauss()*1.2;c.as=c.ovr*.6+c.star+c.pr*.7+c.ppg*.25+(c.wins-41)*.05+gauss()*1.5;c.dp=c.d-Math.min(4,c.dw||0)*1.6+gauss()*2;c.ry=c.pr*.6+c.ppg*.4+gauss()*1.5;}
  const top=(k,f,g)=>C.filter(g).sort((x,y)=>y[k]-x[k]).slice(0,f),aw=[],W={},give=(c,x)=>{if(c.me)aw.push(x);else c.p.aw[x]=(c.p.aw[x]||0)+1;(W[x]=W[x]||[]).push(c);};
  const an=top('mv',15,c=>c.gp>=65);an.forEach((c,i)=>give(c,i<5?'All-NBA 1st':i<10?'All-NBA 2nd':'All-NBA 3rd'));
  const mvp=an[0];if(mvp){give(mvp,'MVP');if(!mvp.me)mvp.p.mvps++;}
  const dp=top('dp',1,c=>c.gp>=65)[0];const asg=new Set([...top('as',24,c=>c.gp>=35),...an,...top('pr',6,c=>c.gp>=50),...top('ppg',5,c=>c.gp>=50),...(dp&&dp.ppg>=10?[dp]:[])]);asg.forEach(c=>give(c,'All-Star'));const asRank=ME.gp>=35?1+C.filter(c=>c!==ME&&c.gp>=35&&c.as>ME.as).length:0,dpRank=ME.gp>=65?1+C.filter(c=>c!==ME&&c.gp>=65&&c.dp>ME.dp).length:0,dpWin=dp&&!dp.me?dp.name:'';
  if(dp)give(dp,'DPOY');const ry=top('ry',1,c=>c.gp>=65&&c.rook)[0];if(ry)give(ry,'ROY');
  const sc=top('ppg',1,c=>c.gp>=65)[0];if(sc)give(sc,'Scoring Title');
  const fm=C.filter(c=>c.team===br.champ&&c.gp>=20).sort((x,y)=>(y.pr+y.ovr*.25)-(x.pr+x.ovr*.25))[0];
  let mvpRank=null;if(gp>=58)mvpRank=1+C.filter(c=>!c.me&&c.gp>=58&&c.mv>ME.mv).length;
  const scRank=ppg>=12?1+C.filter(c=>!c.me&&c.gp>=65&&c.ppg>ppg).length:null;
  if(rival&&mvp&&mvp.p===rival)notes.push(`👑 ${rival.name} wins MVP`);
  L.hist.push({yr:n+1,champ:br.champ,mvp:mvp?.name,roy:ry?.name,dpoy:dp?.name,sc:sc?`${sc.name} (${f1(sc.ppg)})`:'',fmvp:fm?.name});
  if(gp>=65&&mins<26&&ppg>=13&&R()<.5)aw.push('6MOY');
  if(prev&&gp>=65&&o-prevO>=4&&R()<.45)aw.push('MIP');
  if(champ){aw.push('Champion');if(fm&&fm.me)aw.push('Finals MVP');}
  if(fm&&!fm.me)fm.p.aw['Finals MVP']=(fm.p.aw['Finals MVP']||0)+1;
  // the MVP is always 1st Team All-NBA, and every All-NBA player is an All-Star
  if(aw.includes('MVP')){for(const x of['All-NBA 2nd','All-NBA 3rd']){const i=aw.indexOf(x);if(i>=0)aw.splice(i,1);}if(!aw.includes('All-NBA 1st'))aw.push('All-NBA 1st');}
  if(aw.some(x=>x.startsWith('All-NBA'))&&!aw.includes('All-Star'))aw.push('All-Star');
  if(S.comeback&&S.comeback.yr===n&&gp>=65&&ppg>=Math.max(8,S.comeback.ppg*.75)){aw.push('Comeback Player');notes.push('💪 Comeback Player of the Year. You are all the way back');}if(S.comeback&&S.comeback.yr<=n)S.comeback=null;
  const c0=career();
  const fl=R()<.65?flavor({ppg,rpg,apg,bpg,tp,path}):null;if(fl)notes.unshift(fl);
  // your signature game of the season
  let best=null;if(gp>=10){const pts=Math.max(Math.round(ppg+5),Math.round(ppg*(1.45+R()*.7)+gauss()*2)),opp=pick(TEAMS.filter(x=>x!==S.team));
    best={pts,reb:Math.max(0,Math.round(rpg*1.5+R()*4)),ast:Math.max(0,Math.round(apg*1.5+R()*3)),opp,ch:false};
    // a big night from the season's stories is the season high
    const fm=fl&&fl.match(/(?:drop|score) (\d+)/);if(fm&&+fm[1]>best.pts){best.pts=+fm[1];const o2=fl.match(/on the (.+)$/);if(o2)best.opp=o2[1];}
    {const fa=fl&&fl.match(/(\d+)-assist/),fr=fl&&fl.match(/(\d+)-rebound/);if(fa)best.ast=Math.max(best.ast,+fa[1]);if(fr)best.reb=Math.max(best.reb,+fr[1]);}best.ch=best.pts>(S.careerHigh||0);if(best.ch)S.careerHigh=best.pts;
    if(!fm||+fm[1]<pts){if(pts>=60)notes.push(`💯 You drop ${pts} on the ${opp}. A night nobody will forget`);else if(pts>=50)notes.push(`🔥 You score ${pts} against the ${opp}`);}}
  if(S.farewell===n+1){notes.push('👋 Farewell tour: standing ovations in every arena');if(champ){S.lastDance=1;notes.push('🏆 You go out a champion. The Last Dance');}}
  let gs=0;for(const x of aw)gs+=GTP_AW[x]||0;if(mins>=28&&gp>=40)gs+=1;let gtp=earnGtp(gs,`Year ${n+1}`);
  const bpParts=[],bpAdd=(l,v)=>{if(v>0)bpParts.push([l,v]);};let aw0=0;for(const x of aw)aw0+=BANK_AW[x]||0;bpAdd(aw.filter(x=>BANK_AW[x]).map(x=>x==='Champion'?'title':x).join(', '),aw0);
  if(mins>=28&&gp>=40)bpAdd('starter',3);if(rounds>=0)bpAdd('playoffs',1+rounds);
  if(gp>=50)bpAdd(ppg>=20||rpg>=10||apg>=8?'big season':'defensive stats',(ppg>=25?4:ppg>=20?2:0)+(rpg>=10?2:0)+(apg>=8?2:0)+(spg+bpg>=3?2:0));
  if(best)bpAdd('signature game',best.pts>=60?4:best.pts>=50?2:0);
  if(a<=24&&gp>=40)bpAdd('young player development',2);
  if(n===0&&gp>=40)bpAdd('rookie season',3);
  if(Math.round(o)-Math.round(prevO)>=3)bpAdd('breakout year',3);
  if(gp>=80)bpAdd('iron man',2);
  bpAdd('team success',wins>=60?2:wins>=50?1:0);
  if(gp>=50&&ppg>=10&&rpg>=10&&apg>=10)bpAdd('triple-double season',5);
  else if(gp>=50&&ppg>=10&&(rpg>=10||apg>=10))bpAdd('double-double season',2);
  if(gp>=50&&ppg>=10&&tp>=.40)bpAdd('sharpshooting',2);
  if(beatRival>=0)bpAdd('beat your rival',3);else if(h2h&&h2h[0]>h2h[1])bpAdd('won the rivalry games',1);
  const msHit=[5000,10000,15000,20000,25000,30000].filter(m=>c0.pts<m&&c0.pts+ppg*gp>=m);
  if(msHit.length){bpAdd('milestone',5*msHit.length);notes.push(`🏅 Career milestone: ${msHit.map(m=>m.toLocaleString()).join(' and ')} points`);}
  const ageF=nablAgeF(a);
  let bp=Math.round(bpParts.reduce((x,q)=>x+q[1],0)*(diff().nbaPts??1)*ageF);
  // season goals pay out bonus points and GTP
  const gl=S.goals&&S.goals.yr===n+1?S.goals.list:[],gst={ppg,rpg,apg,tp,gp,wins,rounds,champ,aw,mvpRank,rvppg:rival&&!sameTeam?rival.ppg:null,ptsAfter:c0.pts+ppg*gp};
  const gres=gl.map(g=>{const ok=goalOk(g,gst),r=goalReward(g);return{text:g.text,tier:g.tier,ok,pts:ok?r.pts:0,gtp:ok?r.gtp:0};});
  const gP=gres.reduce((x,g)=>x+g.pts,0),gG=gres.reduce((x,g)=>x+g.gtp,0);
  if(gP)bp+=Math.round(gP*ageF);if(gG){gtp+=gG;S.gtpRun=(S.gtpRun||0)+gG;(S.gtpLog=S.gtpLog||[]).push([`Goals Year ${n+1}`,gG]);}
  if(gres.length)notes.push(`🎯 Season goals: ${gres.filter(g=>g.ok).length} of ${gres.length}${gP?` (+${gP} pt${gP===1?"":"s"}${gG?`, +${gG} GTP`:''})`:''}`);
  if(bp>0){S.bank+=bp;notes.push(`💰 +${bp} bonus pts to spend (${[...bpParts.map(q=>q[0]),...(gP?['goals']:[])].join(', ')}${ageF<1?`; age ${a}: ${Math.round(ageF*100)}% as you get older`:''})`);}
  S.nba.push({asRank,dpRank,dpWin,bdg:c.bdg||[],gtp,yr:n+1,age:a,team:S.team,bench:S.bench===1,ovrIn:Math.round(dsp(prevO)),gp,mins,ppg,rpg,apg,spg,bpg,fg,tp,ft,tov,wins,po,aw,inj,ovr:Math.round(o),mvpRank,scRank,path,notes,rv,best,goals:gres,h2h,news:c.news,clutch:c.clutch});
  // history: milestones, the all-time lists, the GOAT debate, your rival and your protégé
  const c1=career(),hist=[];
  for(const m of[10000,20000,30000,40000])if(c0.pts<m&&c1.pts>=m)hist.push(`🎉 You pass ${m.toLocaleString()} career points`);
  if(L.leg){const pl=allTime('pts'),rk=pl.findIndex(x=>x.me)+1,pv=S.atPrev,rk0=pv?pv.rk:1+pl.filter(x=>!x.me&&x.pts>c0.pts).length,ab=pv?new Set(pv.ab):null;
    // compare with where you stood last season: other players' totals grow too, so only real passes count
    const ps=pl.slice(rk).filter(x=>ab?ab.has(x.name):x.pts>c0.pts&&x.pts<=c1.pts);S.atPrev={rk,ab:pl.slice(0,rk-1).map(x=>x.name)};
    if(rk<rk0&&rk<=60)hist.push(`📜 You climb to ${ord(rk)} on the all-time scoring list${ps.length?`, passing ${ps.slice(0,2).map(x=>x.name).join(' and ')}${ps.length>2?` and ${ps.length-2} more`:''}`:''}`);
    const sl=allTime('score'),g1=sl.findIndex(x=>x.me)+1,s0=goatScore(c0),g0=S.gPrev||1+sl.filter(x=>!x.me&&x.score>s0).length;S.gPrev=g1;
    for(const th of[1,3,5,10,25,50])if(g1<=th&&g0>th&&!(S.gdSeen||[]).includes(th)){(S.gdSeen=S.gdSeen||[]).push(th);hist.push(th===1?'🐐 You are #1 in the all-time GOAT debate':`🏛️ You crack the all-time top ${th} in the GOAT debate (${ord(g1)})`);break;}
    const std=S.daily?null:goatStd(),s1=goatScore(c1);if(std&&s0<std.score&&s1>=std.score)hist.push(`🐐 You pass the GOAT standard (${std.score} by ${std.name}). Retire as the GOAT and the record is yours`);}
  if(rival){const lead=c1.pts>rival.car.pts;if(S.rvLead!=null&&lead!==S.rvLead)hist.push(lead?`⚔️ You passed ${rival.name} in career points`:`⚔️ ${rival.name} passed you in career points`);S.rvLead=lead;}
  if(h2h||beatRival>=0||lostRival>=0){const H=S.rvH2H=S.rvH2H||{w:0,l:0,pw:0,pl:0};if(h2h){H.w+=h2h[0];H.l+=h2h[1];}if(beatRival>=0)H.pw++;if(lostRival>=0)H.pl++;}
  if(S.rival&&S.rival.retired&&!S.rvDone){S.rvDone=1;const H=S.rvH2H||{w:0,l:0,pw:0,pl:0},old=S.rival;(S.oldRivals=S.oldRivals||[]).push({name:old.name,rings:old.rings||0,mvps:old.mvps||0,pts:old.car?old.car.pts:0});
    hist.push(pick([`🧓 ${old.name} hangs it up. Your rivalry ends ${H.w}-${H.l} in the regular season and ${H.pw}-${H.pl} in playoff series`,`🧓 ${old.name} retires. ${H.w>=H.l?'You got the better of him':'He got the better of you'} head to head (${H.w}-${H.l})`]));
    const nr=active(L).filter(p=>!p.retired&&p.team!==S.team&&p!==old&&p.name.split(' ').slice(-1)[0]!==(S.name||'').split(' ').slice(-1)[0]&&Math.abs((p.age||S.age)-S.age)<=3&&p.ovr>=ovr()-6).sort((x,y)=>y.ovr-x.ovr)[0];
    if(nr&&S.age<=33){nr.rival=true;S.rival=nr;S.rvH2H=null;S.rvLead=null;S.rvDone=0;hist.push(pick([`⚔️ A new rival rises: ${nr.name} of the ${tShort(nr.team)} says the league belongs to him now`,`⚔️ ${nr.name} (${tShort(nr.team)}) calls you out on a podcast. You have a new rival`,`⚔️ Fans have a new debate: you or ${nr.name} of the ${tShort(nr.team)}?`]));}}
  {const seen=S.clsSeen=S.clsSeen||[],was=S.clsAw=S.clsAw||{},mates=new Set((S.cls||[]).map(c=>c.name));let said=S.clsNewsAt!=null&&S.nba.length-S.clsNewsAt<2?1:0;for(const p of L.P){if(p.dyr!==L.myClassYr||!p.pick||p===S.rival||!mates.has(p.name)||(S.oldRivals||[]).some(r=>r.name===p.name))continue;
    for(const[k,v,txt]of[['MVP',p.aw['MVP']||0,x=>pick([`🎓 Your old classmate ${x} wins MVP. You remember guarding him at 15`,`🎓 ${x}, from your high school class, is the league MVP`])],['Champion',p.rings||0,x=>pick([`🎓 Classmate ${x} wins his first ring`,`🎓 ${x} from your class is a champion now`,(S.nba.some(s=>s.aw.includes('Champion'))?`🎓 ${x}, who you battled in high school, wins a ring too`:`🎓 ${x}, who you battled in high school, has a ring before you`),`🎓 Your old AAU teammate ${x} lifts the trophy`])],['All-Star',p.aw['All-Star']||0,x=>pick([`🎓 Classmate ${x} makes his first All-Star team`,`🎓 ${x}, who you grew up playing against, is an All-Star now`,`🎓 ${x} from your recruiting class gets the All-Star call`,`🎓 The kid you guarded at a summer camp, ${x}, is an All-Star`])]]){const key=p.id+k,pv=was[key]||0;was[key]=v;if(!said&&pv===0&&v>=1&&p.team!==S.team&&!seen.includes(key)){seen.push(key);hist.push(txt(p.name));said=1;S.clsNewsAt=S.nba.length;}}
    if(!said&&p.retired&&!seen.includes(p.id+'ret')&&(p.car&&p.car.pts>8000)){seen.push(p.id+'ret');hist.push(pick([`🎓 ${p.name}, from your high school class, retires after ${Math.round(p.car.pts).toLocaleString()} points`,`🎓 Your old classmate ${p.name} calls it a career`]));said=1;S.clsNewsAt=S.nba.length;}}}
  if(S.mentee){const p=L.P.find(x=>x.id===S.mentee),as=p?p.aw['All-Star']||0:0;if(p&&as>(S.menteeAS||0)){hist.push(`🧑‍🏫 Your protégé ${p.name} made ${as===1?'his first':'another'} All-Star team`);S.menteeAS=as;}}
  S.nba[S.nba.length-1].hist=hist;if(OV()>=(S.pkO||0)){S.pkO=OV();S.pkArch=archName();}
  // what happens this offseason
  const sea=S.nba.length,oo=ovr();S.queue=[];
  if(S.farewell&&S.farewell<=sea){S.retired='Retires';S.endWhy='The farewell tour is over. Every arena stood for you one last time.';S.pend=null;finish();return;}
  if(!S.farewell&&(a===40||sea===20)){S.farewell=sea+1;(S.offLog=S.offLog||[]).push(a===40?'At 40, next season will be your last':'Twenty seasons in, next season will be your last');}
  if(a>=41||sea>=21||(sea>=2&&oo<55)||(sea>=2&&oo<61&&R()<.3)){S.retired=oo<61&&a<31?'Out of the league':'Retires';S.endWhy=a>=41?`At ${a}, your body makes the call. Time to hang them up.`:sea>=21?`${sea} seasons. Nobody plays forever.`:oo<61?`No team offered a contract at ${Math.round(dsp(oo))} OVR. The phone stops ringing.`:'You call it a career.';S.pend=null;finish();return;}
  if(S.comeback&&S.comeback.yr===n+1)S.queue.push(rehabPend());
  if((a>=33&&oo<66&&R()<.5)||(a>=36&&R()<.3))S.queue.push({ret:1});
  else if(a>=34&&!S.farewell&&!S.fwAsked&&R()<.5){S.fwAsked=1;S.queue.push(farewellPend());}
  if(S.faAt==null)S.faAt=S.pick<=30?4:S.pick<=60?2:1;if(sea===S.faAt){const nx=sea+(a>=33?1:a>=30?2:a>=27?3:ri(3,5));S.faLen=nx-sea;S.queue.push({fa:1});S.faAt=nx;}if(S.evoPend)S.queue.push({evo:1});if(oo>=64&&a>=23&&S.nba[sea-1].wins<41&&sea!==S.faAt&&(S.faAt||0)>sea&&!S.farewell&&sea-(S.talkAt??-9)>=3&&!S.queue.some(q=>q.fa)&&R()<.45){S.queue.push({talk:1});S.talkAt=sea;}S.queue.push({sum:1});
  if(R()<.35)S.queue.push({lazy:1});
  makeGoals();
  S.pend=nextQ();}
