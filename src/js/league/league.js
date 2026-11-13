// ---------- NBA ----------
const FIRST=['Marcus','Dante','Tyrese','Jalen','Andre','Malik','Darius','Cameron','Isaiah','Trey','Devin','Terrance','Xavier','Elijah','Quentin','Rashad','Bryce','Damon','Keyon','Royce'];
const LAST=['Vance','Okafor','Whitfield','Stroud','Delacroix','Hargrove','Ellison','Banks','Mercer','Sutton','Kingsley','Rhodes','Achebe','Calloway','Prescott','Lockhart','Duvall','Pruitt','Nwosu','Castellano'];
const ord=n=>n+(n%100>=11&&n%100<=13?'th':['th','st','nd','rd'][n%10]||'th');
// ---------- the league: 30 real teams of simulated players who grow, peak, decline, retire and get drafted alongside you ----------
const FIRST2=['Jaylen','Marquise','Terrell','Amari','Trevon','Kendrick','Jamal','Corey','Nate','Omari','Tyler','Jordan','Miles','Caleb','Derrick','Aaron','Bakari','Cedric','Darnell','Rodney','Lamar','Anthony','Donovan','Kevin','Reuben','Desmond','Evan','Jabari','Julian','Victor','Roland','Silas','Simeon','Tariq','Wesley','Grant','Everett','Tobias','Kris','Brandon','Collin','Garrison','Fred','Gary','Herb','Ivan','Josh','Kyle','Harlan','Moses','Norman','Nolan','Percy','Quincy','Reggie','Leon','Terance','Maurice','Wendell','Yves'];
const LAST2=['Carter','Hayes','Brooks','Wallace','Freeman','Harlow','Jefferson','Bishop','Coleman','Fontaine','Grayson','Holloway','Ingram','Jennings','Kerr','Langford','Maddox','Nash','Osei','Pierce','Quarles','Reddick','Sampson','Thibodeaux','Underwood','Valentine','Whitaker','Young','Zeller','Abara','Boateng','Cissoko','Diallo','Eze','Fofana','Gueye','Hakeem','Iwundu','Jovic','Kovac','Lindqvist','Moreau','Novak','Olsen','Petrovic','Ramos','Silva','Tanaka','Udeh','Varga','Wembe','Ximenes','Yurtseven','Zubac','Ashby','Belton','Crain','Dorsey','Easley','Fitch'];
const LPOS=['PG','SG','SF','PF','C'],CONF=t=>TEAMS.indexOf(t)<15?'East':'West';
function lgName(L){let n,g=0;do n=pick(R()<.5?FIRST:FIRST2)+' '+pick(R()<.5?LAST:LAST2);while(L.used.includes(n)&&g++<40);L.used.push(n);return n;}
function npc(L,age,ovr,ceil,team){const pos=pick(LPOS),p={id:L.id++,name:lgName(L),pos,age,ovr,ceil:Math.max(ovr,ceil),team,yrs:0,
  d:clamp(ovr*.85+gauss()*8+(pos==='C'||pos==='PF'?4:0)+6,35,99),star:gauss()*1,rings:0,mvps:0,pts:0,aw:{},car:{gp:0,pts:0,reb:0,ast:0},retired:false};L.P.push(p);return p;}
const rookieCeil=(o,age)=>o+(diff().lg||0)+rnd(-2,7)+(22-age)*1+(R()<.12?rnd(5,14):0);
const rookieOvr=k=>clamp(73-(k-1)*.38+gauss()*2.5,46,80);
const active=L=>L.P.filter(p=>!p.retired);
const roster=(L,t)=>L.P.filter(p=>!p.retired&&p.team===t);
const W8=[.2,.17,.15,.13,.11,.09,.08,.07];
function teamRating(list){const s=list.slice().sort((a,b)=>b-a);let r=0;for(let i=0;i<8;i++)r+=(s[i]??45)*W8[i];return r;}
// you are not stored in the league: you are added to your team when ratings are computed
function genLeague(){const L={yr:0,P:[],hist:[],used:[],id:1,lastWins:{},z:{}};
  for(const t of TEAMS)for(let i=0;i<13;i++){const age=ri(20,33);npc(L,age,clamp(52+(diff().lg||0)+gauss()*6+(i<2?8:i<5?4:0),45,88),0,t);}
  for(let y=0;y<14;y++){lgPlay(L,null);lgOffseason(L,y<13);}
  return L;}
function lgZ(L,me){const r={};for(const t of TEAMS){const ov=roster(L,t).map(p=>p.ovr);let v=teamRating(ov);
    if(me&&me.team===t){const w=teamRating([...ov,me.ovr]);v=v+(w-v)*(me.gp/82);}r[t]=v;}
  const vs=Object.values(r),m=vs.reduce((a,b)=>a+b,0)/vs.length,sd=Math.sqrt(vs.reduce((a,b)=>a+(b-m)**2,0)/vs.length)||1;
  for(const t in r)r[t]=(r[t]-m)/sd;return r;}
// one regular season: team records and every player's numbers
function lgPlay(L,me){const z=lgZ(L,me),W={};
  // great teams flatten out near the top instead of hitting a hard 70-win wall
  const soft=x=>x>60?60+(x-60)*.45:x<22?22-(22-x)*.45:x;
  for(const t of TEAMS)W[t]=Math.round(clamp(soft(41+z[t]*11.5+gauss()*3.2+(me&&me.team===t?me.extra:0))+gauss()*1.2,9,74));
  for(const t of TEAMS){const ro=roster(L,t),ranks=ro.map(p=>p.ovr);if(me&&me.team===t)ranks.push(me.ovr);ranks.sort((a,b)=>b-a);
    for(const p of ro){let r=ranks.indexOf(p.ovr);const mf=r<5?1:r<8?.75:r<10?.45:.2,inj=R()<.13;
      p.gp=inj?82-ri(20,65):82-ri(0,8);
      p.ppg=Math.max(.5,(2+(p.ovr-50)*.56+([4,2,1][r]||0))*mf*era().pace+gauss()*1.3);
      p.rpg=Math.max(.3,(2+(p.ovr-50)*{C:.23,PF:.19,SF:.13,SG:.09,PG:.08}[p.pos])*mf+gauss()*.5);
      p.apg=Math.max(.2,(1+(p.ovr-50)*{PG:.21,SG:.12,SF:.09,PF:.06,C:.05}[p.pos])*mf+gauss()*.4);
      p.spg=Math.max(.1,(.35+(p.d-50)*{PG:.041,SG:.038,SF:.03,PF:.02,C:.015}[p.pos])*mf);p.tov=Math.max(.2,(.5+p.ppg*.075+p.apg*.22)*(1+gauss()*.12));p.fg=clamp(.445+(p.ovr-72)*.002+({C:.06,PF:.03,SF:0,SG:-.015,PG:-.02}[p.pos])+gauss()*.02,.38,.64);p.bpg=Math.max(0,(.1+(p.d-50)*{C:.063,PF:.042,SF:.016,SG:.009,PG:.009}[p.pos])*mf);
      p.wins=W[t];p.car.gp+=p.gp;p.car.pts+=p.ppg*p.gp;p.car.reb+=p.rpg*p.gp;p.car.ast+=p.apg*p.gp;p.pts=p.car.pts;}}
  L.z=z;L.lastWins=W;return{z,W};}
// best of seven; mine=true hands the series to the detailed version that knows your traits
function bo7(q){let w=0,l=0;while(w<4&&l<4){if(R()<q)w++;else l++;}return[w,l];}
function lgBracket(L,mySeries){const W=L.lastWins,z=L.z,seeds={};
  for(const c of['East','West'])seeds[c]=TEAMS.filter(t=>CONF(t)===c).sort((a,b)=>W[b]-W[a]||z[b]-z[a]).slice(0,8);
  const play=(a,b,rd)=>{const hi=W[a]>=W[b]?a:b,lo=hi===a?b:a;if(mySeries&&(a===mySeries.team||b===mySeries.team))return mySeries.play(a===mySeries.team?b:a,rd,hi===mySeries.team)?mySeries.team:(a===mySeries.team?b:a);
    const[w]=bo7(clamp(.5+(z[hi]-z[lo])*.11+.03,.2,.85));return w===4?hi:lo;};
  const conf={};for(const c in seeds){let s=seeds[c];let r=[[s[0],s[7]],[s[3],s[4]],[s[1],s[6]],[s[2],s[5]]].map(([a,b])=>play(a,b,0));
    r=[play(r[0],r[1],1),play(r[2],r[3],1)];conf[c]=play(r[0],r[1],2);}
  return{seeds,champ:play(conf.East,conf.West,3)};}
function lgOffseason(L,quick){L.yr++;
  for(const p of active(L)){p.age++;p.yrs++;
    if(p.age<=26)p.ovr+=(p.ceil-p.ovr)*.24+gauss()*.9;else if(p.age<=29)p.ovr+=gauss()*.9;else p.ovr-=Math.abs((p.age-29)*.55*(p.age>=34?1.8:1)+gauss()*.5);
    p.ovr=clamp(p.ovr,40,99);p.d=clamp(p.d+(p.age<=26?.8:p.age>=30?-.9:0)+gauss()*.6,35,99);
    if(p.age>=40||p.ovr<48||(p.age>=33&&R()<(p.age-32)*.12)||(p.ovr<54&&p.yrs>=3&&R()<.5))p.retired=true;}
  // the draft: worst record picks first
  const order=TEAMS.slice().sort((a,b)=>(L.lastWins[a]??41)-(L.lastWins[b]??41));
  for(let k=1;k<=60;k++){const age=ri(19,22),o=rookieOvr(k),p=npc(L,age,o,rookieCeil(o,age),order[(k-1)%30]);p.pick=k;p.dyr=L.yr;}
  lgBalance(L);
  // a little player movement every summer
  const mv=active(L).filter(p=>p.age>=23&&p.age<=33&&p!==S.rival);for(const p of mv)if(R()<.1){const o=pick(mv);if(o.team!==p.team){const t=p.team;p.team=o.team;o.team=t;}}}
function lgBalance(L){const pool=[];
  for(const t of TEAMS){const ro=roster(L,t).sort((a,b)=>b.ovr-a.ovr);for(const p of ro.slice(13))pool.push(p);}
  pool.sort((a,b)=>b.ovr-a.ovr);
  for(const t of TEAMS){const n=roster(L,t).length;if(n>13)continue;for(let i=n;i<13;i++){const p=pool.shift();if(p&&p.ovr>=50)p.team=t;else npc(L,ri(24,31),rnd(50,57),0,t);}}
  for(const p of pool)if(roster(L,p.team).length>13)p.retired=true;}
// set up the real league on draft night, with your draft class slotted around your pick
function leagueDraft(){const L=genLeague(),order=TEAMS.slice().sort((a,b)=>(L.lastWins[a]??41)-(L.lastWins[b]??41));
  // teams draft roughly in the order of the senior-year class rankings you followed, with some draft-night chaos
  const cls=(S.cls||[]).map(p=>({p,s:p.dov-p.g+p.hp*.35+gauss()*2.5})).sort((a,b)=>b.s-a.s).map(x=>x.p),me=S.pick,pk=[];
  for(let k=1,c=0;k<=60;k++){if(k===me)continue;const pr=cls[c++]||{name:lgName(L),pos:pick(LPOS),sch:pick(SCHOOLS.mid)},age=draftAge()+ri(-1,1),o=rookieOvr(k);
    // your classmates keep their names: a league veteran with the same name gets a new one
    if(L.used.includes(pr.name)){const ex=L.P.find(q=>q.name===pr.name);if(ex)ex.name=lgName(L);}else L.used.push(pr.name);
    const p=npc(L,age,o,rookieCeil(o,age),order[(k-1)%30]);p.name=pr.name;p.pos=pr.pos;p.sch=pr.sch;p.pick=k;p.dyr=L.yr;p.mine=1;pk.push(p);}
  lgBalance(L);L.myClassYr=L.yr;L.P=L.P.filter(p=>!p.retired);for(const p of L.P){p.car={gp:0,pts:0,reb:0,ast:0};p.pts=0;p.rings=0;p.mvps=0;p.aw={};}
  S.team=me<=60?order[(me-1)%30]:pick(TEAMS);
  // your rival: a lottery talent from your own class, on another team
  const rv=pk.filter(p=>p.pick<=10&&p.team!==S.team).sort((a,b)=>a.pick-b.pick)[0]||pk.find(p=>p.team!==S.team);
  rv.ceil=rnd(80,90);rv.ovr=Math.max(rv.ovr,rnd(68,74));rv.rival=true;rv.teamStr=50;rv.age=S.age+ri(-1,1);S.rival=rv;
  S.board=pk.filter(p=>p.pick<me&&p.pick>=me-7||(me>60&&p.pick>=55)).map(p=>({n:p.pick,name:p.name,pos:p.pos,school:p.sch||pick(SCHOOLS.power)}));
  L.leg=makeLegends(L);S.L=L;const z=lgZ(L,{team:S.team,ovr:ovr(),gp:82});S.teamStr=50+z[S.team]*14;}
const teamStrOf=t=>50+((S.L&&S.L.z[t])||0)*14;
// pick a real team for a free-agency tier: top 8, middle, bottom
function lgTeam(tier,used){const z=S.L?S.L.z:{},ts=TEAMS.filter(t=>!used.has(t)).sort((a,b)=>(z[b]||0)-(z[a]||0)),n=ts.length;
  const slice=tier==='top'?ts.slice(0,8):tier==='mid'?ts.slice(8,n-10):ts.slice(n-10);const t=pick(slice.length?slice:ts);used.add(t);return t;}
// a superteam: two All-Star level players join a team
function lgStack(team,k){if(!S.L)return;const c=active(S.L).filter(p=>p.team!==team&&p.ovr>=76&&p!==S.rival).sort((a,b)=>b.ovr-a.ovr).slice(0,12);
  const moved=[];for(let i=0;i<k&&c.length;i++){const p=c.splice(ri(0,c.length-1),1)[0],sw=roster(S.L,team).sort((a,b)=>a.ovr-b.ovr)[0];if(sw)sw.team=p.team;p.team=team;moved.push(p);}return moved;}
// your high school class: 100 prospects who grow up with you and become your draft class
const CLS_PLAT=.35,CLS_G0=1.2,CLS_G1=2.6,CLS_HP=.25;
function makeClass(){const c=[],seen=new Set([S.name]),myLast=(S.name||'').split(' ').slice(-1)[0];for(let i=0;i<100;i++){const dov=clamp(76-i*.33+gauss()*3,45,82);let nm,g=0;do nm=pick(R()<.5?FIRST:FIRST2)+' '+pick(R()<.5?LAST:LAST2);while((seen.has(nm)||nm.split(' ').slice(-1)[0]===myLast||c.some(q=>(q.name||q).toString().split(' ').slice(-1)[0]===nm.split(' ').slice(-1)[0]))&&g++<40);seen.add(nm);c.push({name:nm,pos:pick(LPOS),dov,g:R()<CLS_PLAT?rnd(.2,1):rnd(CLS_G0,CLS_G1),hp:clamp(30-i*.25+gauss()*8,0,45),sch:null});}return c;}
function classRank(){if(!S.cls)return null;const col=S.stage==='college'||S.stage==='draft',a=col?18+S.col.length*.5:Math.min(18,14+S.hs.length),me=ovr()+S.hype*.35+(S.clsAdj||0),sc=S.cls.map(p=>({p,s:p.dov-(19-a)*p.g+p.hp*CLS_HP*Math.min(5,a-13)/5})).sort((x,y)=>y.s-x.s);
  // in college your class rank is your draft stock: the class drafts in this order around your pick
  let rank=1+sc.filter(x=>x.s>me).length;if(col&&S.col.length){const pk=pickFor(scoutGrade());rank=pk<61?pk:Math.max(61,rank);}
  return{rank,top:sc.slice(0,3).map(x=>x.p),all:sc.map(x=>x.p)};}

function addNext(o){S.next=S.next||{};for(const k in o)S.next[k]=(S.next[k]||0)+o[k];}
const bsm=()=>S.badges.includes('Big Shot Maker');

// minutes before contract roles: a 75+ player starts, an 80+ player plays big minutes (Rookie's ratings read higher than the minutes math)
const minBase=(o,x)=>{const D=dsp(o);return Math.max(x,D>=85?33:D>=80?30:D>=75?28:0);};

