// how a team uses you follows your archetype: scorers get shots, playmakers run the offense, bigs own the glass
const ROLE_F={play:{p:.94,a:1.15},shoot:{p:1.06},fin:{p:1.05,r:1.03},perD:{p:.92,s:1.2,b:1.05},int:{p:.9,r:1.15,b:1.15},all:{}};
function simNBA(){syncPos();if(!R.get)R=makeRng((Math.random()*4294967296)>>>0);const n=S.nba.length,prev=n?S.nba[n-1]:null;
  // a midseason moment can stop the season before it is played: your call shapes the year
  if(S.midAt!==n&&!S.pend){S.midAt=n;const m=midPend(n);if(m){S.pend=m;S.lastResult=null;return;}}
  if(n)S.age++;S.offStops=0;
  const t=S.traits,a=S.age,X=S.next||{};S.next={};const prevO=ovr(),notes=[],news=[];{const sr=S.sumRes||(S.lastResult&&!S.lastResult.n?S.lastResult:null);if(sr)notes.push((sr.ok?'✅ Summer: ':'❌ Summer: ')+sr.text);S.sumRes=null;}S.lastResult=null;for(const m of S.offLog||[])notes.push('✍️ Offseason: '+m.replace(EMO_RE,'').trim());S.offLog=[];if(S.midNote){notes.push('🏀 Midseason: '+S.midNote.replace(EMO_RE,'').trim());S.midNote=null;}
  if(n)eraShift(n,news,notes);
  if(X.boost)growPts(ovr()+X.boost);
  if(a<=27+(t.late>=4?2:0)){const bad=(prev&&/🚑/.test(prev.inj||''))||(X.gp||0)>=25;develop(clamp((.22+(FRAMES[S.frame].dev||0)+(t.work-3)*.03)*(a<=23?1-(t.late-3)*.15:.8+(t.late-3)*.08),.05,.4)*(a<=29?1:Math.max(.15,1-(a-29)*.15)),bad||a>25?0:(a<=23?NBA_FL:NBA_FL*.7)*(1+(t.work-3)*.1));}
  else if(a>=30){const d=(S.perks&&S.perks.iron?.8:1)*(a-29)*.55*(1+(3-t.dur)*.12)*(1-(t.work-3)*.08)*(a>=34?1.8:1)*(1+(X.declAdj||0)+(FRAMES[S.frame].decl||0))+gauss()*.4;declineTo(ovr()-Math.max(0,d));}
  growPts(ovr()+clamp(gauss()*.8,-1,a>=30?.4:1.5));
  S.teamStr=clamp(S.teamStr+gauss()*4+(n<4&&S.pick<=10?2:0)+(50-S.teamStr)*.12+(X.team||0),20,85);
  // injury
  const rest=ri(0,4);let lost=rest+(X.gp||0),inj=null;if(X.gp)notes.push(X.load?`🛋️ You sit ${Math.round(X.gp)} games by plan (load management)`:X.midrest&&X.gp<=6?`🛌 You sit ${Math.round(X.gp)} games to rest a nagging injury`:`🩹 You miss ${Math.round(X.gp)} games recovering from the offseason`);const pI=Math.max(.05,.11+(S.height-80)*.012+(3-t.dur)*.04+Math.max(0,a-30)*.015+FRAMES[S.frame].inj+(S.injuryProne?.06:0)+(X.inj||0));
  if(R()<pI){const r=R(),majP=clamp(.1*(1+(3-t.dur)*.3),.03,.2),modP=.3;
    if(r>=majP+modP){const g=ri(4,15);lost+=g;inj=`${capF(pick(INJ.minor))} (${g} games)`;}
    else if(r>=majP){const g=ri(18,40);lost+=g;inj=`${capF(pick(INJ.mod))} (${g} games)`;}
    else if(S.armor){S.armor=false;const g=ri(18,40);lost+=g;inj=`🛡️ Injury insurance! A major injury was downgraded (${g} games)`;}else{const g=ri(45,82);lost+=g;inj=`🚑 ${capF(pick(INJ.major))} (${g} games)`;S.injuryProne=true;S.comeback={yr:n+1,ppg:prev?prev.ppg:0};{const cut=Math.min(S.bank,Math.round((S.devPts||0)/2));S.bank-=cut;S.devPts=(S.devPts||0)-cut;}S.attrs.speed=Math.max(MIN_A,S.attrs.speed-ri(4,8));S.attrs.vert=Math.max(MIN_A,S.attrs.vert-ri(4,8));S.ceiling-=ri(2,5);}}
  if(rest&&(inj||X.gp)&&lost<82)notes.push(`🧊 Plus ${rest} game${rest>1?'s':''} of rest and small knocks`);
  const gp=clamp(82-lost,0,82);const o=ovr(),bch=updBadges('season'),bfx=badgeFx();notes.push(growWhy(dsp(prevO),'nba',{hurt:!!inj&&gp<70})[1]);for(const x of badgeLines(bch))notes.push(x);
  let opp=0;if(n<2)opp=S.pick<=5?5:S.pick<=14?3:S.pick<=30?0:S.pick<=60?-4:-6;
  let mins=clamp(minBase(o,14.5+(o-55)*1.2+opp+(FRAMES[S.frame].mins||0)+(es('stam')-60)*.08+(t.motor-3)*.6+bfx.min)+(S.minAdj||0)+(X.mins||0),4,36);if(S.roleMin&&!X.mins)mins=Math.max(mins,Math.min(36,S.roleMin));if(S.roleMax)mins=Math.min(mins,S.roleMax);if(o<52)mins=Math.min(mins,8);
  const mf=mins/36,nf=()=>1+gauss()*.075*(1.25-(es('cons')-40)/120)*(1-bfx.var);
  const RF=ROLE_F[(ARCHS[roleArch().id]||{}).fam]||{},ppg=(RF.p||1)*Math.max(mins/36*3,.86*(8+(o-55)*.45+(topScr()-72)*0.12+(eff('sho')+eff('fin')-120)*.1+(S.usage||0)+(X.usage||0)+(FRAMES[S.frame].ppg||0)+(es('offb')-50)*.03+bfx.pts/.86+(t.killer-3)*.9)*mf*nf()*era().pace),
    rpg=(RF.r||1)*Math.max(0,.64*(3.2+Math.max(-6,es('dreb')-40)*.14+Math.max(-6,es('oreb')-40)*.07+Math.max(0,S.height-74)*.3)*mf*nf()*(1+(t.motor-3)*.05)*(1+bfx.reb)),apg=(RF.a||1)*Math.max(0,.6*(1.3+(es('pass')-40)*.13+(es('handle')-40)*.05)*mf*nf()*(1-(t.killer-3)*.04)*(1+bfx.ast)),
    spg=(RF.s||1)*Math.max(.18*mf,(.45+(es('stl')-40)*.028+(es('speed')-50)*.006+(es('lat')-50)*.004)*mf*nf()*(1+(t.motor-3)*.05+(t.lock-3)*.05)*(1+bfx.stl)),bpg=(RF.b||1)*Math.max(.12*mf,(.12+(es('blk')-40)*.04+(es('vert')-50)*.005)*mf*nf()*(1+(t.lock-3)*.05)*(1+bfx.blk)),
    fg=clamp(.40+(fin3()-50)*.0017+(es('offb')-50)*.0004+bfx.fg/100+(S.height-78)*.003+(t.touch-3)*.004+gauss()*.012,.36,.68),tp=clamp(.26+(es('three')-40)*.0029+(t.touch-3)*.008+era().tp+bfx.tp/100+gauss()*.015,.18,.48),ft=clamp(.52+(Math.max(es('ft'),es('ft')*.6+es('three')*.4)-40)*.0068+(t.touch-3)*.015+bfx.ft/100+gauss()*.02,.4,.95),
    tov=Math.max(.2,(.5+ppg*.075+apg*.22)*(1-(es('handle')-60)/250-(es('iq')-60)/350)*(1-bfx.tov)*nf());
  {const ar=roleArch(),rk=ar.id+S.team+(mins<26?'b':'');if(S.roleSeen!==rk){S.roleSeen=rk;notes.push(`📋 Role: ${mins<26?'off the bench, ':ppg<10?'as a low-usage starter, ':''}the ${tShort(S.team)} use you as a ${ar.n}`+(mins<26||ppg<10?'':{play:': the offense runs through you',shoot:': you get the shots',fin:': you attack the rim',perD:': you guard their best player',int:': you own the paint and the glass'}[(ARCHS[ar.id]||{}).fam]||''));}}
  const L=S.L;if(n){lgOffseason(L);leagueNews(n,news,notes);}
  lgPlay(L,{team:S.team,ovr:o,gp,extra:(t.lead-3)*1.5*(gp/82)+(X.team||0)*.9+bfx.team*(gp/82)});const z=L.z,wins=L.lastWins[S.team];S.teamStr=50+z[S.team]*14;if(X.seed){const cs=TEAMS.filter(t2=>CONF(t2)===CONF(S.team)).sort((x,y)=>L.lastWins[y]-L.lastWins[x]);notes.push(`🏁 You finished as the #${cs.indexOf(S.team)+1} seed in the ${CONF(S.team)}`);}
  const rival=S.rival&&!S.rival.retired?S.rival:null,sameTeam=rival&&rival.team===S.team;if(rival)rival.teamStr=50+z[rival.team]*14;
  const rv=rival?{name:rival.name,ppg:rival.ppg,wins:rival.wins,team:rival.team}:null;
  // regular-season head-to-head with your rival
  let h2h=null;if(rival&&!sameTeam){const ng=CONF(rival.team)===CONF(S.team)?4:2,qh=clamp(.5+(z[S.team]-z[rival.team])*.11+(o-rival.ovr)*.004+(X.rv||0)*.08,.15,.85);h2h=[0,0];let tv=null;for(let i=0;i<ng;i++){const w=R()<qh;if(tv==null)tv=w;h2h[w?0:1]++;}if(X.rv)notes.push(`⚔️ Rivalry night: you ${tv?'won':'lost'} the TV game, and went ${h2h[0]}-${h2h[1]} against ${rival.name} this season`);}
  // the playoffs can stop for a clutch moment, so everything the rest of the season needs is kept with the run
  S.cur={bdg:bch,n,a,prevO,o,gp,mins:gp?mins:0,ppg:gp?ppg:0,rpg:gp?rpg:0,apg:gp?apg:0,spg:gp?spg:0,bpg:gp?bpg:0,fg,tp,ft,tov:gp?tov:0,wins,inj,notes,news,rv,h2h,rs0:R.get(),clutch:[]};
  seasonPlayoffs();}
