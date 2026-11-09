// ---------- high school ----------
const YR=['Freshman','Sophomore','Junior','Senior','Super Senior'];
function autoSpend(){const pk=archPick();let n=0,g=0;while(S.bank>0&&g++<2000){const k=pk();const co=cost(S.attrs[k]);if(S.attrs[k]<99&&S.bank>=co){S.bank-=co;S.attrs[k]++;n+=co;}else if(S.bank<2)break;}if(S.bank===1){S.attrs.cons++;S.bank=0;n++;}return n;}
function hsHype(){S.hype+=(S.traits.star-3)*1.5;}
function simHS(){syncPos();if(S.summerPend)chooseSummer(safeIdx(S.summerPend));S.lastResult=null;S.clsStart=clsSnap();const r0=classRank()?.rank;hsHype();const i=S.hs.length;S.age=14+i;const o0=OV(),p0=i?S.hs[i-1].st.ppg:0;
  develop((.10+(FRAMES[S.frame].dev||0)*.4)*(1+(S.traits.work-3)*.15)*(1-(S.traits.late-3)*.18),HS_FL*(1+(S.traits.work-3)*.1));const bch=updBadges('season'),bfx=badgeFx();
  S.lastTag=null;const ev=[roll(hsEvents())];if(R()<.35)ev.push(roll(hsEvents(),S.lastTag));if(S.summerNote){ev.unshift(S.summerNote);S.summerNote=null;}
  const o=ovr(),ppg=clamp(6+(o-40)*.75+i*1.5+bfx.pts+gauss()*1.2,2,42),rpg=clamp((3+(eff('reb')-40)*.13+Math.max(0,S.height-72)*.35+i*.25)*(1+bfx.reb)+gauss()*.45,1.2,20),apg=clamp((1+(eff('pla')-40)*.12)*(1+bfx.ast)+gauss()*.6,.3,12),spg=clamp(.5+(es('stl')-40)*.035+(es('speed')-50)*.01+(S.traits.motor-3)*.08+(S.traits.lock-3)*.08+(es('lat')-50)*.004+bfx.stl*1.5+gauss()*.25,.1,5),bpg=clamp(.15+(es('blk')-40)*.045+(S.height-78)*.05+(S.traits.lock-3)*.08+bfx.blk*1.5+gauss()*.25,.1,6);
  ev.push(growWhy(o0,'hs',{hurt:S.hurt}));for(const x of badgeLines(bch))ev.push([x.startsWith('📉')?-1:1,x]);if(ppg>=18&&!S.hurt)S.hype+=Math.min(6,(ppg-16)*.45);S.hype=Math.max(0,S.hype);const hm=S.hurt?.6:1,hurtTxt=S.hurt?` · ${ri(4,9)} games (injured)`:'';S.hurt=0;
  S.hs.push({bdg:bch,st:{ppg:ppg*hm,rpg:rpg*hm,apg:apg*hm,spg:spg*hm,bpg:bpg*hm},title:`${YR[i]} Year · age ${S.age}`,line:`${f1(ppg*hm)} PPG · ${f1(rpg*hm)} RPG · ${f1(apg*hm)} APG · ${f1(spg*hm)} SPG · ${f1(bpg*hm)} BPG${hurtTxt}`,ev,stars:stars()});
  clsGuard(r0,ppg*hm,p0,hm<1);S.age=15+i;
  if(S.hs.length===4){S.stage='offers';makeOffers();}else S.summerPend=summerHS();}
// a healthy season at least as good as the last one never drops your class rank (a better one moves you up) or your stars
function clsGuard(r0,ppg,p0,hurt){if(hurt){S.starFloor=Math.max(2,(S.starFloor||2)-1);return;}const c=classRank();if(!c||r0==null)return;
  const good=ppg>=p0-.5||ppg>=20,tgt=Math.max(1,p0&&ppg>=p0+1?r0-Math.max(1,Math.round((ppg-p0)*.8)):(p0?ppg>=p0-.5:ppg>=14)?r0-1:r0);if(good){let g=0;while(classRank().rank>tgt&&g++<400)S.clsAdj=(S.clsAdj||0)+.25;S.starFloor=Math.max(S.starFloor||0,stars());}}
const bump=(ks,n)=>()=>ks.forEach(k=>up(k,n));
const PERKS0=[['🏋️ Elite strength program','+4 Strength, Speed & Vertical',bump(['str','speed','vert'],4)],['🎯 Shooting guru on staff','+4 Three-Point, Mid-Range & Free Throw',bump(['three','mid','ft'],4)],['🧱 Big-man camp','+4 Rebounding, Post Moves & Hook Shot',bump(['oreb','dreb','post','hook'],4)],['🧠 Film-room head coach','+5 Basketball IQ & Consistency',bump(['iq','cons'],5)],['🛡️ Defense-first system','+4 to every Defense rating',bump(['perD','intD','stl','blk'],4)],['🏀 Point-guard factory','+5 Passing & Ball Handle',bump(['pass','handle'],5)],['📺 Prime-time TV slot','+10 Hype',()=>S.hype+=10],['🎁 Bonus signing points','+18 bonus pts',()=>S.bank+=18]];let PERKS;
function makeOffers(){PERKS=PERKS0.slice();const st=stars();const tiers={5:['blue','blue','blue','blue','blue','power','power','power'],4:['blue','blue','power','power','power','mid'],3:['power','mid','mid'],2:['mid','mid']}[st];
  const used=new Set();S.offers=tiers.map(t=>{let n;do n=pick(SCHOOLS[t]);while(used.has(n));used.add(n);return{name:n,tier:t,perk:(PERKS.length?PERKS:(PERKS=PERKS0.slice())).splice(ri(0,PERKS.length-1),1)[0]};});}

