function nextQ(){while(S.queue&&S.queue.length){const x=S.queue.shift(),p=x.lazy?eventPend():x.talk?talkPend():x.trade?tradePend():x.evo?evoPend():x.fa?(()=>{const f=faPend();S.lastFa=S.nba.length;return f;})():x.ret?retirePend():x.sum?summerNBA():x;if(p)return p;}return null;}

function choose(i){const p=S.pend;if(!p)return;const nx0={...(S.next||{})},tm0=S.team,tag0=(p.opts[i]&&p.opts[i].desc)||'';S.lastResult=null;const yr=S.nba.length+1,bk0=S.bank,msg=p.opts[i].fn();
  // NABL offseason: a summer choice that works out pays bonus points, more for riskier calls (safe 1, coin flips about 5)
  if(p.kind==='summer'&&S.lastResult)S.sumRes=S.lastResult;if(p.kind==='summer'&&S.lastResult&&S.lastResult.ok){const o=p.opts[i],base=o.p0!=null?Math.max(1,Math.round((1-o.p0)*(o.p0<.5?14:10))):1,b=Math.max(1,Math.round((/High/.test(tag0)?5:/Medium/.test(tag0)?3:1)*nablAgeF(S.age)));S.bank+=b;{const tot=S.bank-bk0;S.lastResult.text=ptsText(S.lastResult.text).replace(/\s*[·.,]?\s*\+\d+ pts?\b/g,'').replace(/[\s·.,:]+$/,'')+`. +${tot} pt${tot===1?'':'s'}`;}}if(msg&&!S.lastResult)S.lastResult={ok:true,text:msg,n:1};if(msg)(S.log=S.log||[]).push(`Year ${yr}: ${msg}`);
  if(msg&&S.stage==='nba'&&p.kind==='mid')S.midNote=msg;else if(msg&&S.stage==='nba'&&!['summer','clutch'].includes(p.kind))(S.offLog=S.offLog||[]).push(msg);if(S.stage==='nba'&&S.team!==tm0&&p.kind!=='mid'&&typeof makeGoals==='function'){if(p.kind==='trade')S.tradeAskAt=S.nba.length;makeGoals();if(S.goals)S.goals.moved=tShort(S.team);}
  if(S.goals&&S.rival&&S.rival.team===S.team)S.goals.list=S.goals.list.filter(g=>g.k!=='rvppg');
  if(S.pend===p)S.pend=S.stage==='nba'?nextQ():null;
  if(p.kind==='clutch'&&!S.cur&&['nba','end'].includes(S.stage))startSeq();
  if(S.stage==='nba'&&!['clutch','mid'].includes(p.kind))S.offStops=(S.offStops||0)+1;
  if(p.kind==='mid'&&S.midNote){const a1=S.next||{},a0=nx0||{},d=k=>(a1[k]||0)-(a0[k]||0),fx=[];if(d('usage')>0)fx.push('more shots for you');if(d('usage')<0)fx.push('fewer shots for you');if(d('team')>0)fx.push('team chemistry up');if(d('team')<0)fx.push('team chemistry down');if(d('inj')>0)fx.push('more injury risk');if(d('inj')<0)fx.push('less injury risk');if(d('gp')>0)fx.push(`you sit ${d('gp')} games`);if(d('mins')<0)fx.push('fewer minutes');if(d('declAdj')<0)fx.push('slower aging');if(d('declAdj')>0)fx.push('faster aging');if(d('rv')>0)fx.push('a fired-up rivalry');if(fx.length)S.midNote+=` (${fx.join(', ')})`;}
  if(p.kind==='mid'&&!S.pend&&S.stage==='nba')playSeason(simNBA);}
function talkPend(){const last=S.nba[S.nba.length-1];if(last.team!==S.team||last.wins>=41)return null;return{kind:'moment',title:'📞 Ask Out?',text:`The ${S.team} won ${last.wins} games. Your agent says a few teams would trade for you right now.`,opts:[
    {label:'📤 Ask for a trade',desc:'Pick from the teams that call. Your contract comes with you.',fn:()=>{S.queue.unshift({trade:1});return 'You asked for a trade. Teams are calling';}},
    {label:'🧱 Stay and build',desc:'The front office promises help. The fans love you for it.',fn:()=>{addNext({team:2});S.hype+=2;return 'You stayed to help rebuild';}}]};}
// a trade: like free agency, but your contract comes with you and there is no re-signing
function tradePend(){const f=faPend(),left=Math.max(1,(S.faAt||0)-S.nba.length);f.kind='trade';f.title='📞 Trade Request';
  f.text=`Teams are calling about you. Pick your new home. Your contract comes with you (${left} season${left===1?'':'s'} left).`;
  f.opts=f.opts.filter(o=>!/^🤝|Ring chase|Team up|Retire now/.test(o.label)).slice(0,3).map(o=>({...o,desc:(o.desc||'').replace('Max money, featured role','Featured role').replace('Bench role, minimum deal','Bench role'),why:o.why?{pro:o.why.pro,con:o.why.con.map(x=>x.replace('Contenders are picky about who they sign','Contenders give up less to get you'))}:o.why,label:o.label.replace(/^🏀/,'📞'),fn:()=>(o.fn()||'').replace('You signed with','You were traded to')}));
  f.opts.push({label:'🙅 Stay where you are',desc:'Pull back the request. The locker room is awkward for a while.',fn:()=>{addNext({team:-2});return 'You pulled back your trade request';}});return f;}
const otherTeam=()=>pick(TEAMS.filter(x=>x!==S.team&&x!==S.rival?.team));
function faPend(){const last=S.nba[S.nba.length-1],rv=S.rival&&!S.rival.retired&&S.rival.team!==S.team?S.rival:null,o=ovr(),want=eraWants();
  const base=o+(last.ppg-14)*.3+clamp(eraValue()*1.5,-4,4)-(S.injuryProne?3:0)-Math.max(0,S.age-30)*1.5;
  const offer=(team,str,stay)=>{const lw=stay?last.wins:null;const need=R()<.45?want:pick(ATTRS)[0],fz=(gStr(need)-o)/8,fit=fz>=.6?'Great':fz>=-.4?'Good':'Poor';
    const sc=base+fz*2+gauss()*2.5-(str>=62?4:0)+(stay?3:0),lvl=sc>=76?'High':sc>=66?'Medium':'Low';
    const kind=lw!=null?(lw>=54?'Contender':lw>=40?(last.path&&last.path.length?'Playoff team':'Bubble team'):'Rebuilding'):str>=62?'Contender':str>=50?'Playoff team':'Rebuilding';
    // your role depends on where you would rank on that roster (your production counts, not just OVR)
    const pv=o+(S.perks&&S.perks.agent?3:0)+clamp((last.ppg-14)*.45+Math.max(0,last.rpg-8)*.35+Math.max(0,last.apg-6)*.35,-3,7),rk=S.L?roster(S.L,team).filter(p=>p.ovr>pv).length:(kind==='Contender'?2:0);
    let u=rk===0?(kind==='Rebuilding'?5:3):rk===1?1:rk<=4?(kind==='Contender'?-2:-1):-1.5,m=rk===0?(kind==='Rebuilding'?4:2):rk===1?0:rk<=4?-1:-2;
    u+=fit==='Great'?1.5:fit==='Poor'?-1.5:0;m+=(fit==='Poor'?-2:0)+(lvl==='High'?1:lvl==='Low'?-3:0);
    const em=clamp(minBase(o,14.5+(o-55)*1.2)+m,4,38),role=em<17?(lvl==='Low'?'Bench role, minimum deal':'Bench role'):rk===0?(lvl==='High'?'Max money, featured role':'Featured role'):rk===1?'Co-star role':rk<=4||em>=28||(stay&&last&&last.mins>=28)?'Starter role':'Rotation role';
    const pro=[],con=[],ev=eraValue();
    if(o>=80)pro.push(`You are a star (${OV()} OVR)`);else if(o>=72)pro.push(`You are a proven starter (${OV()} OVR)`);else if(o<64)con.push(`Your ${OV()} OVR is below what they want`);
    if(last.ppg>=20)pro.push(`You scored ${f1(last.ppg)} a game last year`);else if(last.ppg<8)con.push(`Only ${f1(last.ppg)} points a game last year`);
    if(ev>=.4&&gStr(want)>=o+2&&eff(want)>=o-3)pro.push(`This era pays for ${catName(want)}, and that is your game`);else if(ev<=-.4&&gStr(want)<=o-4)con.push(`Teams right now want ${catName(want)}, not your strength`);
    if(fit==='Great'&&eff(need)>=o-4)pro.push(`You fill their biggest need: ${catName(need)}`);else if(fit==='Great')pro.push(`They need ${catName(need)}, and your best ${catName(need).toLowerCase()} skills help`);else if(fit==='Poor'&&eff(need)<o-6)con.push(`They need ${catName(need)}, and yours trails the rest of your game`);
    if(S.age<=26)pro.push(`At ${S.age}, your prime is ahead of you`);else if(S.age>=31)con.push(`At ${S.age}, they worry about decline`);
    if(S.injuryProne)con.push('Your injury history worries them');
    if(stay)pro.push(lvl==='Low'?'Familiar: you know the system and the city':'Loyalty: they know you and want to keep you');
    if(str>=62&&!stay)con.push('Contenders are picky about who they sign');
    if(kind==='Rebuilding'&&/Featured|Co-star|Starter/.test(role))pro.push('A rebuilding team can hand you a big role');
    return{why:{pro,con},label:`${stay?'🤝':'🏀'} ${stay?'Re-sign with the ':''}${team}`,desc:`${kind}${lw!=null?` (${lw}-${82-lw} last season)`:''} · Interest: ${lvl} · ${fit} fit (they need ${catName(need)}) · ${role}`,
      fn:()=>{S.team=team;S.teamStr=str;S.usage=u;S.minAdj=m;S.roleMax=0;S.roleMin=/Featured|Max money/.test(role)?32:/Co-star/.test(role)?30:/Starter/.test(role)?28:/Rotation/.test(role)?18:0;return stay?`You re-signed with the ${team}`:`You signed with the ${team}`;}};};
  const used=new Set([S.team,S.rival?.team]),nt=()=>{let t,g=0;do t=pick(TEAMS);while(used.has(t)&&g++<50);used.add(t);return t;};
  const opts=[offer(S.team,S.teamStr,true),...['top','mid','bot'].map(k=>{const tm=lgTeam(k,used);return offer(tm,teamStrOf(tm));})];
  if(S.age>=30&&S.L){const tm=TEAMS.filter(x=>!used.has(x)).sort((x,y)=>(S.L.z[y]||0)-(S.L.z[x]||0))[0];if(tm){used.add(tm);opts.push({why:{pro:['They are the title favorite','Contenders want veterans who can still play'],con:['You come off the bench','Fewer shots and smaller numbers']},label:`💍 Ring chase: the ${tm}`,desc:'Contender · Interest: High · Bench role (about 20-26 minutes), minimum deal · your best shot at a ring, smaller numbers',fn:()=>{S.team=tm;S.teamStr=teamStrOf(tm);S.usage=-4;S.minAdj=-6;S.roleMin=0;S.roleMax=26;return `You took less money to chase a ring with the ${tm}`;}});}}
  if(rv&&rv.ovr>=76)opts.push({why:{pro:['Instant contender','You play next to an All-Star'],con:['It is his team: fewer shots for you','Fans say you took the easy way','Every ring you win together counts for his legacy too']},label:`⚔️ Team up with ${rv.name}`,desc:'If you can’t beat him, join him. A better team, but it’s his team.',fn:()=>{S.team=rv.team;S.teamStr=teamStrOf(rv.team);S.usage=-5;S.minAdj=-3;S.roleMin=0;S.roleMax=0;S.hype-=6;return `You joined rival ${rv.name} on the ${S.team}`;}});
  if(S.age>=34&&!S.farewell)opts.push({label:'🏁 Retire now',desc:'Walk away on your own terms instead of signing.'+mileNote()+(S.bank>0?` Your ${S.bank} unspent points are lost.`:'')+(()=>{const c=career(),sc=goatScore(c),nx=[[60,'Perennial All-Star'],[85,'Hall of Famer'],[145,'Top 10 All-Time'],[350,'THE GOAT']].find(x=>sc<x[0]);return nx?` Legacy score ${sc}: ${nx[0]-sc} short of ${nx[1]}${nx[0]-sc<=25?' (one more season could do it)':''}.`:` Legacy score ${sc}.`;})(),fn:()=>{S.retired='Retires';S.queue=[];finish();return null;}});
  return{kind:'fa',title:'✍️ Free Agency!',text:`Your contract is up after ${S.nba.length-(S.lastFa||0)} season${S.nba.length-(S.lastFa||0)===1?'':'s'}${(()=>{let k=0;for(let i=S.nba.length-1;i>=0&&S.nba[i].team===S.team;i--)k++;return k<S.nba.length-(S.lastFa||0)?` (the last ${k} with the ${S.team} after your move)`:'';})()}. The ${S.team} won ${last.wins} games last year. Teams in ${era().name.replace(/^\S+\s/,'')} pay extra for ${catName(want)}. Pick your next team.${S.farewell?' This is your farewell season: a one-year deal.':S.faLen?` The new deal runs ${S.faLen} season${S.faLen===1?'':'s'}.`:''}`,opts};}
const TRAIN=[['🦘 Plyometrics','+3 Vertical, +2 Speed',{vert:3,speed:2}],['🫁 Conditioning camp','+4 Stamina, +1 Speed',{stam:4,speed:1}],['🧤 Hands & steals','+3 Steal, +2 Perimeter D',{stl:3,perD:2}],['🧱 Rim protection school','+3 Block, +2 Interior D',{blk:3,intD:2}],['🎯 Mid-range mastery','+4 Mid-Range, +1 Close Shot',{mid:4,close:1}],['🏀 Pick-and-roll reads','+3 Passing, +2 Basketball IQ',{pass:3,iq:2}],['🎯 Extend your range','+3 Three-Point, +2 Mid-Range',{three:3,mid:2}],['🏋️ Bulk up','+4 Strength, +2 Post Moves, −1 Speed',{str:4,post:2,speed:-1}],['🛡️ Lock in on defense','+2 Perimeter D, +2 Interior D, +1 Steal, +1 Block',{perD:2,intD:2,stl:1,blk:1}],['🏀 Tighten the handle','+3 Ball Handle, +3 Passing',{handle:3,pass:3}],['💥 Finishing package','+3 Layup, +2 Dunk, +2 Close Shot',{layup:3,dunk:2,close:2}],['🧱 Glass cleaner','+3 Off. Rebound, +3 Def. Rebound',{oreb:3,dreb:3}],['🧠 Film study','+3 Basketball IQ, +2 Consistency',{iq:3,cons:2}],['🎯 Free throw grind','+5 Free Throw',{ft:5}]];
const VET=[['🧘 Recovery & longevity','You age slower next season, +2 Stamina',{stam:2},{declAdj:-.5}],['🔄 Reinvent as a shooter','+4 Three-Point, +3 Mid-Range, −2 Speed',{three:4,mid:3,speed:-2}],['👴 Old-man game','+4 Post Moves, +3 Basketball IQ',{post:4,iq:3}]];
function trainPend(){const useful=o=>Object.entries(o[2]).some(([k,v])=>v>0&&S.attrs[k]<95);const pool=TRAIN.filter(useful),opts=[];if(pool.length<3)pool.push(...TRAIN.filter(x=>!pool.includes(x)));if(S.age>=29)opts.push(pick(VET.filter(useful).length?VET.filter(useful):VET));while(opts.length<3)opts.push(pool.splice(ri(0,pool.length-1),1)[0]);
  return{kind:'train',title:'☀️ Summer Training',text:'What do you work on this offseason?',opts:opts.map(([l,d,b,x])=>({label:l,desc:d,fn:()=>{for(const k in b)up(k,b[k]);if(x)addNext(x);return `Summer: ${l.replace(/^\S+\s/,'')}`;}}))};}
function eventPend(){const last=S.nba[S.nba.length-1],o=ovr(),a=S.age,rv=S.rival&&!S.rival.retired?S.rival:null,E=[];
  if(last.wins<35&&o>=72&&S.lastFa!==S.nba.length)E.push({title:'📞 Trade Demand?',text:`The ${S.team} won ${last.wins} games. Your agent says you could force your way out.`,opts:[
    {label:'🧱 Stay and grind',desc:'The front office promises upgrades. Fans love you for it.',fn:()=>{addNext({team:6});S.hype+=3;return 'You stayed loyal through the rebuild';}},
    {label:'📤 Demand a trade',desc:'Pick from the teams that call. It gets messy with the fans.',fn:()=>{S.hype-=3;S.queue.unshift({trade:1});return 'You demanded a trade. Teams are calling';}}]});
  if(a>=24&&last.wins<40&&last.team===S.team&&o>=64&&(S.faAt||0)>S.nba.length+1&&S.lastFa!==S.nba.length)E.push({title:'🔁 Trade Talks',text:`The ${S.team} are rebuilding, and the front office is taking calls about you.`,opts:[
    {label:'📞 Tell them you are open to a move',desc:'Pick from the teams that call. Your contract comes with you.',fn:()=>{S.queue.unshift({trade:1});return 'You told the front office you are open to a trade';}},
    {label:'🏠 Ask to stay',desc:'Loyalty. The fans love it, and the team adds help.',fn:()=>{addNext({team:2});S.hype+=2;return 'You asked to stay and help the rebuild';}}]});
  if(a>=24&&a<=31&&o>=65&&S.faAt===S.nba.length+1)E.push({title:'🩼 Contract Year',text:'A nagging knee is flaring up, and your contract is almost up.',opts:[
    {label:'🛌 Sit and heal',desc:'Miss some games, stay healthy long-term.',fn:()=>{addNext({gp:12});return 'You sat out to heal a nagging knee';}},
    {label:'💪 Play through it',desc:'More touches to prove you deserve the max. Higher injury risk.',fn:()=>{addNext({usage:2,inj:.15});return 'You played through a bad knee in a contract year';}}]});
  if(a>=31&&o<76&&!S.bench&&last.mins>=26&&last.ppg<18&&!last.aw.includes('Scoring Title'))E.push({title:'🪑 Coming Off the Bench?',text:'Coach wants you to lead the second unit.',opts:[
    {label:'👍 Accept the role',desc:'Fewer minutes, fresher legs, a shot at 6th Man of the Year.',fn:()=>{S.bench=1;S.minAdj=(S.minAdj||0)-6;addNext({declAdj:-.3});return 'You accepted a bench role';}},
    {label:'😤 Refuse',desc:'You are a starter. The locker room gets tense.',fn:()=>{S.bench=-1;addNext({team:-4});S.hype-=2;return 'You refused a bench role';}}]});
  if(o>=78&&S.lastFa!==S.nba.length){const st=TEAMS[(TEAMS.indexOf(S.team)+7)%TEAMS.length];if(st!==S.team&&st!==rv?.team)E.push({title:'🌟 Superteam Call',text:`Two All-Stars want to team up with you on the ${st}.`,opts:[
    {label:'🏠 Stay put',desc:'Do it your way.',fn:()=>{addNext({boost:.5});return 'You turned down a superteam';}},
    {label:'🤝 Join them',desc:'Instant contender, but you share the ball.',fn:()=>{S.team=st;lgStack(st,2);S.teamStr=teamStrOf(st);S.usage=(S.usage||0)-4;S.hype-=4;return `You formed a superteam with the ${S.team}`;}}]});}
  if(rv&&rv.team!==S.team&&o>=70)E.push({title:'🎙️ Called Out',text:`${rv.name} says on a podcast that you're "overrated."`,opts:[
    {label:'🤐 Let your game talk',desc:'+2 Consistency.',fn:()=>{up('cons',2);return `You ignored ${rv.name}'s trash talk`;}},
    {label:'🔥 Fire back',desc:'Extra motivation next season, but more pressure.',fn:()=>{addNext({boost:1.5,usage:1});S.hype+=5;return `You started a beef with ${rv.name}`;}}]});
  const rk=a>=30&&S.L?active(S.L).filter(p=>p.team===S.team&&p.yrs===0).sort((x,y)=>y.ceil-x.ceil)[0]:null;
  if(rk)E.push({title:'🧑‍🏫 Mentor the Rookie?',text:`${rk.name}, a rookie ${rk.pos}, is the future of the franchise. He wants to learn from you.`,opts:[
    {label:'🤝 Take him under your wing',desc:'+3 Basketball IQ, slightly fewer shots. He gets a lot better.',fn:()=>{up('iq',3);addNext({usage:-1.5});rk.ceil+=5;S.mentee=rk.id;S.menteeAS=rk.aw['All-Star']||0;return `You took ${rk.name} under your wing`;}},
    {label:'🙅 Not my job',desc:'Keep your touches.',fn:()=>'You ignored the rookie'}]});
  if(o>=72&&!S.shoe)E.push({title:'👟 Signature Shoe Offer',text:'A shoe company wants to build a line around you.',opts:[
    {label:'👟 Sign it',desc:(S.traits.star>=5?'Star Power is already 5/5: more hype instead':'+1 Star Power')+', but off-court demands cost focus (−2 Consistency).',fn:()=>{S.shoe=1;if(S.traits.star>=5)S.hype+=4;S.traits.star=Math.min(5,S.traits.star+1);S.attrs.cons=Math.max(MIN_A,S.attrs.cons-2);return 'You got a signature shoe';}},
    {label:'🏀 Stay focused',desc:S.traits.work>=5?'+2 Basketball IQ (Work Ethic is already 5/5).':'+2 Basketball IQ, +1 Work Ethic.',fn:()=>{S.shoe=-1;up('iq',2);S.traits.work=Math.min(5,S.traits.work+1);return 'You turned down a shoe deal to stay focused';}}]});
  if(o>=78)E.push({title:'🥇 Olympic Team Invite',text:'The national team wants you this summer.',opts:[
    {label:'🏅 Represent your country',desc:'Chase gold. Big hype, but a tired body next season.',fn:()=>{S.hype+=6;addNext({inj:.04});const gold=R()<.7;return gold?'You won Olympic gold 🥇':'You won Olympic silver 🥈';}},
    {label:'😴 Rest up',desc:'Fresh legs next season.',fn:()=>{addNext({boost:.5,inj:-.03});return 'You skipped the Olympics to rest';}}]});
  if(es('vert')>=65&&a<=27&&last.ppg>=12)E.push({title:'🛫 Dunk Contest Invite',text:'All-Star Weekend wants you in the dunk contest.',opts:[
    {label:'🙌 Enter',desc:'Could be iconic. Small injury risk.',fn:()=>{S.hype+=5;addNext({inj:.03});return R()<.4?'🏆 You won the Dunk Contest with a 360 between-the-legs':'You entered the Dunk Contest and finished 3rd';}},
    {label:'🙅 Pass',desc:'Save the legs.',fn:()=>'You passed on the Dunk Contest'}]});
  if(S.nba.length>=3)E.push({title:'🧑‍💼 New Head Coach',text:`The ${S.team} hired a new coach with a very different system.`,opts:[
    {label:'🤝 Buy in',desc:'+2 Basketball IQ, +2 Consistency.',fn:()=>{up('iq',2);up('cons',2);return 'You bought into the new coach’s system';}},
    {label:'😒 Push back',desc:'Keep doing what works. The team suffers a little.',fn:()=>{addNext({team:-3,usage:1});return 'You clashed with the new coach';}}]});
  if(last.wins<30&&a>=27&&last.team===S.team)E.push({title:'🏚️ Tank Season?',text:'Management wants to shut you down early to land a better draft pick.',opts:[
    {label:'🛋️ Sit the rest of the year',desc:'Fewer games, but a top prospect joins next year.',fn:()=>{addNext({gp:18,team:9});return 'You sat out the end of a tank season';}},
    {label:'💪 Play every game',desc:'Competitors compete.',fn:()=>{S.hype+=2;return 'You refused to tank';}}]});
  if(onlineEra())E.push({title:'📱 Social Media Storm',text:'An old clip of you resurfaces, and the internet is going crazy.',opts:[
    {label:'📵 Log off',desc:'+2 Consistency, but the clip defines you for a while.',fn:()=>{up('cons',2);S.hype-=3;return 'You logged off social media';}},
    {label:'😂 Clap back',desc:'The fans love it. Focus slips a bit.',fn:()=>{S.hype+=3;S.attrs.cons=Math.max(MIN_A,S.attrs.cons-1);return 'You clapped back online';}}]});
  const fa=o>=75&&S.L?active(S.L).filter(p=>p.team!==S.team&&p!==S.rival&&p.ovr>=76&&p.age<=32).sort((x,y)=>y.ovr-x.ovr).slice(0,5):[],star=fa.length?pick(fa):null;
  if(star)E.push({title:`📲 Recruit ${star.name}?`,text:`${star.name} (${star.pos}, ${dsp(star.ovr)} OVR) is a free agent deciding between the ${S.team} and the ${star.team}.`,opts:[
    {label:'📞 Recruit him hard',desc:'If it works, he joins your team.',fn:()=>{const ch=clamp(.35+(S.traits.star-3)*.08+(S.hype-20)/250,.15,.7);if(R()<ch){const old=star.team,sw=roster(S.L,S.team).sort((x,y)=>x.ovr-y.ovr)[0];if(sw)sw.team=old;star.team=S.team;S.teamStr=teamStrOf(S.team);return `${star.name} signs with the ${S.team}!`;}S.hype-=2;return `${star.name} stays with the ${star.team}`;}},
    {label:'🤷 Let the front office handle it',desc:'Stay out of it.',fn:()=>'You stayed out of the free agency drama'}]});
  if(a>=25&&a<=32)E.push({title:'🥋 Train With a Legend',text:'A retired legend offers to work with you this offseason.',opts:[
    {label:'🍑 Learn the post game',desc:'+4 Post Moves, +1 IQ.',fn:()=>{up('post',4);up('iq',1);return 'You learned the post game from a legend';}},
    {label:'🧘 Learn how he lasted 18 seasons',desc:'His recovery habits: you age a little slower.',fn:()=>{addNext({declAdj:-.3});return 'You learned how a legend took care of his body';}}]});
  const L=E.filter(e=>!(S.seenT||[]).includes(e.title));if(!L.length)return null;
  const e=pick(L);(S.seenT=S.seenT||[]).push(e.title);return{kind:'event',...e};}
function retirePend(){const c=career(),sc=goatScore(c),[t]=tierOf(sc,c);
  return{kind:'retire',title:'🕰️ Is It Time?',live:1,text:`Age ${S.age}, OVR ${OV()}. Your body is telling you it might be time. Legacy right now: ${t} (GOAT Score ${sc}).${mileNote()}`,opts:[
    {label:'👋 Retire',desc:'Walk away on your own terms.',fn:()=>{S.retired='Retires';S.queue=[];finish();return null;}},
    {label:'🔁 One more year',desc:'Chase one more milestone. It could also tarnish the ending.',fn:()=>{addNext({declAdj:.3});return 'You came back for one more year';}},
    ...(S.farewell?[]:[{label:'📣 One last season: a farewell tour',desc:'Next season is your last. Ovations everywhere and a fired-up team.'+mileNote(),fn:()=>{S.farewell=S.nba.length+1;addNext({team:3});S.hype+=6;return 'You announced a farewell tour';}}])]};}
function benchList(c){const g=x=>c.cnt[x]||0,tdS=S.nba.some(s=>s.ppg>=10&&s.rpg>=10&&s.apg>=10&&s.gp>=40);
  return[['6 Ring Standard',g('Champion')>=6],['5+ MVPs',g('MVP')>=5],['30,000 Point Club',c.pts>=30000],['40,000 Points',c.pts>=40000],['10× All-NBA 1st Team',g('All-NBA 1st')>=10],['15× All-Star',g('All-Star')>=15],['Season Triple-Double Average',tdS],['Defensive Player of the Year',g('DPOY')>=1]];}
