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
// the Badge Book: the best tier you have ever reached on each badge, across careers (shown on every difficulty, pays nothing)
function bookGet(){return Store.obj('bag_bbook');}
function bookSave(){if(!Store.ok())return;const k=bookGet();let c=0;for(const id in S.bdg||{})if((k[id]||0)<S.bdg[id]){k[id]=S.bdg[id];c=1;}if(c)Store.setJson('bag_bbook',k);}
const bookCount=()=>Object.keys(bookGet()).length;



