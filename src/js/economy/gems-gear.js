// ---------- settings ----------
// ---------- gems and equipment: permanent gear that every future player wears ----------
const GEAR=[['band','Headband','flame','Stay locked in',['cons','ft']],['shoes','Signature shoes','shoe','Lighter and bouncier',['speed','vert']],
  ['socks','Grip socks','pulse','Cut on a dime',['handle','layup']],['sleeve','Shooting sleeve','target','Same release every time',['three','mid']],
  ['arm','Arm band','dumbbell','Play through contact',['str','post']],['wrist','Wristbands','swirl','Quick hands',['stl','pass']],
  ['chip','Player tracking chip','bars','Data on every rep',['iq','stam']],['shirt','Compression undershirt','shirt','Win the glass',['dreb','oreb']],
  ['legs','Leg sleeves','bolt','Explode at the rim',['dunk','close']],['shorts','Compression shorts','shield','Stay low on defense',['perD','intD']]];
const GEAR_BOOST=[0,2,4,6],GEAR_COST=[20,50,100],GEAR_LV=['Bronze','Silver','Gold'],GEM_TIER={'🐐 THE GOAT':60,'Top 10 All-Time':45,'Hall of Famer':35,'Perennial All-Star':25,'All-Star':20,'Champion Role Player':18,'Solid Starter':15,'Role Player':10,'Bust':5,'Journeyman':5},GEM_MULT={rookie:0,pro:1,hof:1.5};
const gems=()=>+Store.get('bag_gems')||0;
const setGems=n=>Store.set('bag_gems',n),addGems=n=>setGems(gems()+n);
const gear=()=>Store.obj('bag_gear');
function buyGear(k){const g=gear(),lv=g[k]||0;if(lv>=3||gems()<GEAR_COST[lv])return;if(setGems(gems()-GEAR_COST[lv])){g[k]=lv+1;Store.setJson('bag_gear',g);}render();}
function gearNote(){if(S.daily)return null;const g=gear(),on=GEAR.filter(x=>g[x[0]]).map(x=>`${x[1]} +${GEAR_BOOST[g[x[0]]]} ${x[4].map(k=>SKN[k]).join(' & ')}`);return on.length?{ok:true,n:1,text:`🎽 Your equipment is on: ${on.join(' · ')}`}:null;}
function wearGear(){if(S.daily)return;const g=gear();for(const[k,,,,ks]of GEAR)for(const a of ks)S.attrs[a]=Math.min(99,S.attrs[a]+GEAR_BOOST[g[k]||0]);}
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||typeof S==='undefined'||!S.ui)return;const u=S.ui;if(u.menu==='open')closeMenu();else if(u.menu)openMenu(null);else if(u.intro!=null)endIntro();else if(u.prof)closeProfile();});
