// ---------- college ----------
function enroll(i){const o=S.offers[i];o.perk[2]();S.school=o.name;S.tier=o.tier;S.teamStr=TIER[o.tier].str;S.stage='college';}
function draftAge(){return 18+S.col.length;}
function scoutGrade(){const ab={18:9,19:7,20:4,21:1,22:-2,23:-5,24:-7}[draftAge()]??-7;
  return ovr()+ab+(eff('ath')-60)*.08+(S.height-ARCHS[archetype().id].h)*.6+clamp(S.hype,-20,60)*.12+(S.traits.star-3)*.6+clamp(eraValue()*.15,-2,2);}
const pickFor=g=>clamp(Math.round(1+(83-g)*2.4),1,61);
function projRange(){const p=pickFor(scoutGrade());return[clamp(p-6,1,61),clamp(p+6,1,61)];}
const pickTxt=p=>p>=61?'Undrafted':p<=30?`1st Rd (#${p})`:`2nd Rd (#${p})`;
function simCol(){syncPos();S.clsStart=clsSnap();S.colNext=false;S.lastResult=null;const y=S.col.length,T=TIER[S.tier];S.age=18+y;const o0=OV();
  develop((.30+(FRAMES[S.frame].dev||0)*.6)*T.dev*(1+(S.traits.coach-3)*.1)*(1+(S.traits.work-3)*.15)*(1-(S.traits.late-3)*.16),COL_FL*(1+(S.traits.work-3)*.1));const bch=updBadges('season'),bfx=badgeFx();
  S.hype+=T.hype*(1+(S.traits.star-3)*.2);
  S.lastTag=null;const ev=[roll(colEvents(y+1))];if(R()<.3)ev.push(roll(colEvents(y+1),S.lastTag));if(S.summerNote){ev.unshift(S.summerNote);S.summerNote=null;}
  {const cp=Math.round(10*T.dev*(1+(S.traits.coach-3)*.15)*(S.hurt?.6:1));S.bank+=cp;ev.push([1,`🏫 ${T.lbl} program: +${cp} pt${cp===1?'':'s'} from practice and coaching`]);}ev.push(growWhy(o0,'college',{hurt:S.hurt}));for(const x of badgeLines(bch))ev.push([x.startsWith('📉')?-1:1,x]);const o=ovr(),mins=clamp(16+(o-50)*1.0+T.min+y*2,8,36),mf=mins/36*(S.tier==='mid'?1.12:1);
  const ppg=clamp((6+(o-50)*.6+(eff('sho')+eff('fin')-120)*.08+(es('offb')-50)*.02+bfx.pts/1.4)*mf*1.4+gauss()*1.5,1,35),rpg=clamp((2.5+(eff('reb')-40)*.17+Math.max(0,S.height-73)*.3)*mf*(1+bfx.reb)+gauss()*.6,1,16),apg=clamp((1+(eff('pla')-40)*.14)*mf*(1+bfx.ast)+gauss()*.5,.2,10),spg=clamp((.45+(es('stl')-40)*.05+(es('speed')-50)*.01)*mf*(1+(S.traits.motor-3)*.05+(S.traits.lock-3)*.05)*(1+bfx.stl)+gauss()*.2,.1,4),bpg=clamp((.1+(es('blk')-40)*.05+(S.height-80)*.03)*mf*(1+(S.traits.lock-3)*.05)*(1+bfx.blk)+gauss()*.2,.1,5);
  const wins=clamp(Math.round(17+(S.teamStr-60)*.25+(o-60)*.35+gauss()*4),6,34),losses=35-wins;
  const acc=[];const aa=o+S.hype*.12+gauss()*2+(S.tier==='mid'?-3:0);
  if(aa>=80)acc.push('🏅 National Player of the Year');if(aa>=74)acc.push('🎖️ All-American');
  let mm=S.banned?'🚫 Postseason ban':'Missed the tournament';if(!S.banned&&(wins>=23||(S.tier!=='mid'&&wins>=20))){const rd=['First Round','Round of 32','Sweet 16','Elite 8','Final Four','Title Game'];let r=0;
    while(r<6&&R()<clamp(.45+(S.teamStr-60)*.012+(o-65)*.015+(wins-24)*.025+(S.traits.clutch-3)*.03-r*.04,.06,.9))r++;
    mm=r===6?'🏆 NATIONAL CHAMPIONS':`Lost in the ${rd[r]}`;if(r===6){S.hype+=8;acc.push('🏆 National Champion');if(!S.badges.includes('Big Shot Maker')){S.badges.push('Big Shot Maker');S.traits.clutch=Math.min(5,S.traits.clutch+2);up('cons',6);up('iq',3);acc.push('🎯 You earn the BIG SHOT MAKER badge: +2 Clutch, +6 Consistency, +3 IQ. You thrive under pressure for life.');}}else if(r>=4)S.hype+=4;}
  {const cg=earnGtp((acc.includes('🏅 National Player of the Year')?3:0)+(acc.includes('🎖️ All-American')?1:0)+(acc.includes('🏆 National Champion')?4:0),'College');if(cg>0)acc.push(`🪙 +${cg} GTP`);}
  S.hype=Math.max(0,S.hype);const hm=S.hurt?.6:1,hurtTxt=S.hurt?` · ${ri(3,8)} games (injured)`:'';S.hurt=0;
  S.banned=false;S.col.push({bdg:bch,st:{ppg:ppg*hm,rpg:rpg*hm,apg:apg*hm,spg:spg*hm,bpg:bpg*hm},title:`${YR[y]} at ${S.school} · age ${S.age}`,line:`${f1(ppg*hm)} PPG · ${f1(rpg*hm)} RPG · ${f1(apg*hm)} APG · ${f1(spg*hm)} SPG · ${f1(bpg*hm)} BPG · ${wins}-${losses} · ${mm}${hurtTxt}`,ev,acc,proj:projRange()});
  const maxY=S.redshirt?5:4;if(S.col.length>=maxY)S.mustDeclare=true;}
function enterDraft(){S.lastResult=null;S.summerNote=null;S.projD=projRange();S.combine=runCombine();const miss=gauss()*2.5,g=scoutGrade()+miss+S.combine.adj;S.scoutMiss=gauss()*5;S.ceiling+=gauss()*4-S.scoutMiss*.5;S.scoutAtDraft=g;S.pick=pickFor(g);S.ovrAtDraft=OV();
  S.age=draftAge();leagueDraft();S.stage='draft';}
function turnPro(){S.stage='nba';makeGoals();}
function stayInSchool(){S.summerPend=summerCol();S.colNext=true;}

