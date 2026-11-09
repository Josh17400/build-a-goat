// ---------- events ----------
function hsEvents(){const t=S.traits;return[
  {w:/mixtape|highlight tape/i.test((S.summerNote||[])[1]||'')?0:8+t.star*2,f:()=>{S.hype+=8;addBank(2);return[1,onlineEra()?'📹 Your highlight reel goes viral, 4 million views overnight. +12 pts':'📹 Your dunk leads every sports show in the country for a week. +12 pts']}},
  {tag:'perf',w:9,f:()=>{S.hype+=5;addBank(3);return[1,'📈 Breakout season — coaches across the state take notice. +18 pts']}},
  {w:S.summerNote?0:4+t.work*2,f:()=>{addBank(2);S.ceiling+=1;return[1,'💪 You live in the gym all summer. +12 pts, ceiling up']}},
  {w:6,f:()=>{S.hype+=7;addBank(1);return[1,'⭐ You torch an elite national camp. +6 pts, big hype']}},
  {w:7,f:()=>{const g=ri(1,3);S.height+=g;let m=`📏 Growth spurt! You shoot up ${g}" (now ${ht(S.height)})`;if(R()<.5){S.attrs.handle=Math.max(MIN_A,S.attrs.handle-4);S.attrs.three=Math.max(MIN_A,S.attrs.three-3);up('oreb',2);up('blk',2);m+=' — but your handle and jumper get clunky';return[0,m];}return[1,m+' and keep your coordination']}},
  {w:9-t.dur,f:()=>injuryHS()},
  {w:4,f:()=>{S.hype-=6;addBank(-1);return[-1,'📚 Your grades slip and you sit out three games. -3 pts']}},
  {w:3+(5-t.coach),f:()=>{S.hype-=3;addBank(-1);return[-1,'😤 You clash with your coach, and your minutes get cut. -3 pts']}},
  {tag:'perf',w:8,f:()=>{addBank(1);return[0,'🏀 Quiet, steady year. +6 pts']}},
  {tag:'perf',w:4,f:()=>{if(ovr()+S.hype*.2>58){S.hype+=6;addBank(2);return[1,'🏆 You lead your school to a state championship! +12 pts']}addBank(1);return[0,'🏀 Your team falls short in the playoffs. +6 pts']}},
  {tag:'perf',w:ovr()>=55?5:0,f:()=>{S.hype+=6;addBank(2);return[1,'🔥 You drop 50 in the rivalry game. The whole town is talking. +12 pts']}},
  {w:S.summerNote?0:6-t.work,f:()=>{addBank(-1);return[-1,'🎮 You spend the whole summer playing video games. -3 pts']}},
  {w:4,f:()=>{if(R()<.5){S.hype+=5;addBank(1);return[1,'🏫 You transfer to a hoops powerhouse and start right away. +6 pts']}S.hype-=2;return[0,'🏫 You transfer to a powerhouse and split time with a senior star']}},
  {w:ovr()>58?4:1,f:()=>{S.hype+=9;addBank(2);return[1,'🌎 You make the U17 national team and win gold. +12 pts']}},
  {w:5,f:()=>{up('iq',2);addBank(1);return[1,'👨‍👦 Your dad rebounds for you every morning at 5 AM. +2 IQ, +6 pts']}},
  {tag:'perf',w:S.hs.length===1?7:0,f:()=>{S.hype-=4;return[-1,'📉 A sophomore slump. The hype train slows down']}},
  {w:3,f:()=>{S.ceiling+=1.5;S.hype+=2;return[1,'👟 Your shoe size jumps three sizes. Doctors expect more growth. Ceiling up']}},
  {w:4,f:()=>{S.hype-=3;return[-1,onlineEra()?'📹 You get posterized in a clip with 10 million views. Brutal':'📹 You get posterized, and it runs on every highlight show for a month. Brutal']}},
  {w:S.summerNote?0:5,f:()=>{S.hype+=5;addBank(1);return[1,'🏆 You win the summer AAU circuit. +6 pts']}},
  {w:4,f:()=>{if(R()<.5){up('three',4);return[1,'🧪 You rebuild your jump shot form, and it works! +4 Three-Point']}S.attrs.three=Math.max(MIN_A,S.attrs.three-3);return[-1,'🧪 You try a new jump shot form. It is a disaster. -3 Three-Point']}},
  {w:3,f:()=>{S.hype+=4;return[1,'📰 You land on the cover of a national high school magazine']}},
  {w:3,f:()=>{up('str',3);S.attrs.speed=Math.max(MIN_A,S.attrs.speed-1);return[0,'🏈 You play football in the fall. +3 Strength, -1 Speed']}},
  {tag:'perf',w:4,f:()=>{S.hype+=5;addBank(1);return[1,'🚨 You hit a buzzer-beater to win the regional final. +6 pts']}},
  {w:3,f:()=>{addBank(-1);S.hype-=2;return[-1,'🤒 Mono knocks you out for six weeks. -3 pts']}},
  {w:3,f:()=>{up('iq',3);return[1,'🧠 A retired college coach starts mentoring you. +3 IQ']}},
  {w:3,f:()=>{addBank(-1);return[-1,'🏫 Your school cuts the basketball budget. No trainer, no film. -3 pts']}},
  {w:ovr()>=60?4:0,f:()=>{S.hype+=8;return[1,'🌟 You get invited to the national high school all-star game']}},
  {tag:'perf',w:3,f:()=>{S.hype-=4;S.attrs.cons=Math.max(MIN_A,S.attrs.cons-1);return[-1,'😬 You get ejected from the state semifinal for taunting. -1 Consistency']}},
  {w:4,f:()=>{up('str',3);return[1,'🏋️ You bench 225 for the first time. +3 Strength']}},
  {w:3,f:()=>{S.hype-=1;addBank(1);return[0,'🏠 Your family moves across the country. New school, fresh start. +6 pts']}},
  {w:2+(5-t.work),f:()=>{S.hype-=2;addBank(-1);return[-1,'📵 You get benched for skipping practice. -3 pts']}},
  {w:3,f:()=>{S.hype+=4;return[1,'🎤 The local news runs a feature on you']}},
  {w:3,f:()=>{S.attrs.speed=Math.max(MIN_A,S.attrs.speed-2);return[-1,'🦵 You get shin splints from overtraining. -2 Speed']}},
  {tag:'perf',w:4,f:()=>{S.hype+=2;addBank(1);return[1,'🤝 You team up with a future D1 point guard. Easy buckets all year. +6 pts']}},
  {w:es('three')>=55?4:1,f:()=>{up('three',3);S.hype+=2;return[1,'🎯 You win the state 3-point contest. +3 Three-Point']}},
];}
function injuryHS(){const r=R()*(1+(3-S.traits.dur)*.15);
  if(r>.92){S.injuryProne=true;S.ceiling-=3;S.attrs.speed=Math.max(MIN_A,S.attrs.speed-5);S.attrs.vert=Math.max(MIN_A,S.attrs.vert-5);S.hype-=8;S.hurt=1;addBank(-2);return[-1,`🚑 ${capF(pick(INJ.major))} — you miss most of the season. Your ceiling drops, -6 pts`];}
  S.hype-=3;addBank(-1);return[-1,`🤕 ${capF(pick(INJ.minor))} costs you a few weeks. -3 pts`];}
function colEvents(y){const t=S.traits;return[
  {w:['10s','20s'].includes(S.era)?7+t.star:0,f:()=>{S.hype+=6;addBank(1);return[1,'💰 You land a huge NIL deal — your face is on billboards. +6 pts']}},
  {tag:'perf',w:ovr()>=62?8:0,f:()=>{S.hype+=6;addBank(3);return[1,'📈 You put up a 40-point game on national TV. +18 pts']}},
  {w:4+t.work*2,f:()=>{addBank(2);S.ceiling+=1.5;return[1,'💪 You rebuild your jumper over the summer. +12 pts, ceiling up']}},
  {w:4+t.coach,f:()=>{up('iq',4);addBank(1);return[1,'🧠 Coach turns you into a film junkie. +4 IQ, +6 pts']}},
  {w:9-t.dur,f:()=>injuryCol()},
  {w:3+(5-t.coach),f:()=>{S.hype-=4;addBank(-1);return[-1,'😤 You get benched for two games after a blowup with the staff. -3 pts']}},
  {w:y>=3?8:1,f:()=>{S.hype-=6;return[-1,'🧓 Scouts start whispering: "What more is there to develop?"']}},
  {tag:'perf',w:6,f:()=>{addBank(1);return[0,'🏀 Steady, efficient year. +6 pts']}},
  {w:4,f:()=>{S.hype+=4;return[1,'🎤 Your press conference goes viral for all the right reasons']}},
  {tag:'perf',w:5,f:()=>{S.hype+=6;up('cons',2);addBank(1);return[1,'🧊 You hit a buzzer-beater against the rival school! +2 Consistency, +6 pts']}},
  {tag:'perf',w:ovr()>=60?5:0,f:()=>{S.hype+=5;addBank(1);return[1,'🌴 You win MVP of a big holiday tournament. +6 pts']}},
  {tag:'perf',w:4,f:()=>{S.attrs.three=Math.max(MIN_A,S.attrs.three-2);S.hype-=3;return[-1,'🥶 You hit a shooting slump all of January. -2 Three-Point']}},
  {w:3,f:()=>{up('iq',2);S.hype+=1;return[1,'📚 You are named Academic All-American. +2 IQ']}},
  {w:4,f:()=>{up('str',4);S.attrs.speed=Math.max(MIN_A,S.attrs.speed-1);return[0,'🏋️ The strength coach adds 15 pounds of muscle. +4 Strength, -1 Speed']}},
  {tag:'perf',w:S.col.length>=1?4:0,f:()=>{S.hype-=3;return[-1,'🧑‍🤝‍🧑 A five-star freshman joins the team and takes your shots']}},
  {tag:'perf',w:es('three')>=60&&ovr()>=56?5:0,f:()=>{up('three',3);S.hype+=2;return[1,'🎯 You lead the conference in 3-point percentage. +3 Three-Point']}},
  {w:2,f:()=>{S.banned=true;S.hype-=4;return[-1,'🚨 NCAA sanctions hit the program. No postseason this year']}},
  {w:3,f:()=>{addBank(2);S.hype+=3;return[1,'🎥 You spend the summer working out with NBA pros. +12 pts']}},
  {w:3,f:()=>{S.hype-=2;S.attrs.cons=Math.max(MIN_A,S.attrs.cons-2);return[-1,'📱 You get into an online beef with a rival fan base. -2 Consistency']}},
  {tag:'perf',w:4,f:()=>{S.hype+=6;addBank(1);return[1,'📺 You hit a game-winner on Saturday-night national TV. +6 pts']}},
  {w:3,f:()=>{S.attrs.cons=Math.max(MIN_A,S.attrs.cons-1);return[-1,'🤕 You break your nose and play in a mask for a month. -1 Consistency']}},
  {w:4,f:()=>{up('post',3);return[1,'🧑‍🏫 An assistant coach rebuilds your footwork. +3 Post Moves']}},
  {tag:'perf',w:3,f:()=>{S.hype-=4;return[-1,'📉 You get benched for three games during conference play']}},
  {tag:'perf',w:ovr()>=60?4:0,f:()=>{S.hype+=6;addBank(1);return[1,'🏆 You are named first-team all-conference. +6 pts']}},
  {w:2+(5-t.work)*.5,f:()=>{S.hype-=3;addBank(-1);return[-1,'🎓 You land on academic probation and miss three games. -3 pts']}},
  {w:3,f:()=>{S.hype+=4;S.traits.lead=Math.min(5,S.traits.lead+1);return[1,'🎤 Your locker-room speech after a tough loss goes viral. +1 Leadership']}},
  {tag:'perf',w:3,f:()=>{S.hype-=3;S.attrs.cons=Math.max(MIN_A,S.attrs.cons-2);return[-1,'🧊 You miss two free throws that would have won the rivalry game. -2 Consistency']}},
  {w:4,f:()=>{up('vert',3);return[1,'🦘 You add two inches to your vertical in the weight room. +3 Vertical']}},
  {w:3,f:()=>{S.hype-=2;S.attrs.cons=Math.max(MIN_A,S.attrs.cons-2);return[-1,'🔄 Your head coach leaves for the NBA. New system, rough adjustment. -2 Consistency']}},
  {w:y>=2?4:0,f:()=>{S.hype+=5;addBank(1);return[1,'📋 NBA scouts pack the gym every night. Draft buzz grows. +6 pts']}},
  {w:3,f:()=>{S.hype-=2;return[-1,'😷 You get food poisoning the night before the big tournament game']}},
  {w:3,f:()=>{S.hype+=5;S.attrs.cons=Math.max(MIN_A,S.attrs.cons-1);return[0,'🎮 You become the cover athlete of a college hoops video game. Big hype, more distractions']}},
];}
function injuryCol(){const r=R()*(1+(3-S.traits.dur)*.15);
  if(r>.9){S.injuryProne=true;S.ceiling-=3;S.attrs.speed=Math.max(MIN_A,S.attrs.speed-5);S.attrs.vert=Math.max(MIN_A,S.attrs.vert-5);S.hype-=8;S.hurt=1;S.redshirt=true;return[-1,`🚑 ${capF(pick(INJ.major))} — you are out for most of the year. You get a medical redshirt (extra year of eligibility)`];}
  S.hype-=3;addBank(-1);return[-1,`🤕 ${capF(pick(INJ.mod))} — you miss a month. -3 pts`];}
function shortNote(t){if(!S.bankShort)return t;const lost=(+((t.match(/-(\d+) pts/)||[0,0])[1]))-S.bankShort;S.bankShort=0;return t+(lost>0?` (you only had ${lost} pts left, the rest came out of your skills)`:' (no bonus points left, so it cost you skill instead)');}
const RECENT=()=>{try{return JSON.parse(localStorage.getItem('bag_recent')||'[]');}catch{return[];}};
function roll(list,avoid){S.seenE=S.seenE||{};S.recent=S.recent||new Set(RECENT());const key=i=>list.length+':'+i,wt=(e,i)=>e.w<=0||S.lastEv===key(i)||(avoid&&e.tag===avoid)?0:Math.max(.5,e.w)/(S.seenE[key(i)]?60:1)/(S.recent.has(key(i))?2.5:1);
  const tot=list.reduce((s,e,i)=>s+wt(e,i),0);let r=R()*tot;for(const[i,e]of list.entries()){const w=wt(e,i);if(!w)continue;r-=w;if(r<=0){S.lastEv=key(i);S.lastTag=e.tag;S.seenE[key(i)]=(S.seenE[key(i)]||0)+1;S.bankShort=0;const out=e.f();out[1]=shortNote(out[1]);return out;}}return list[0].f();}

