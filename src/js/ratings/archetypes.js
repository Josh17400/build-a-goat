// ---------- archetypes: no positions to pick. OVR rates you at the role your skills and size fit best ----------
// h = the role's reference height (height bonuses are measured from it), fam = skill family (for the two-word name),
// mod = the word used when this role is your secondary flavor, w = how much each skill counts in this role
const ARCHS={
  floor:  {n:'Floor General',fam:'play',mod:'Playmaking',h:74,w:{lat:3,offb:2,pass:12,handle:12,iq:8,cons:4,speed:7,three:6,mid:5,close:2,ft:3,layup:4,perD:5,stl:4,stam:3,vert:2,str:1,dreb:1}},
  creator:{n:'Shot Creator',fam:'shoot',mod:'Shot-Creating',h:75,w:{fade:4,offb:2,lat:2,handle:10,mid:10,three:8,close:6,layup:7,ft:5,speed:7,cons:6,iq:4,pass:4,vert:3,stam:3,perD:3,stl:2,dunk:2}},
  sniper: {n:'Sharpshooter',fam:'shoot',mod:'Sharpshooting',h:77,w:{offb:8,fade:2,three:15,mid:10,ft:6,close:6,cons:7,iq:6,speed:5,handle:4,stam:4,perD:4,layup:3,pass:3,stl:2,vert:2,str:1,dreb:1}},
  slasher:{n:'Slasher',fam:'fin',mod:'Slashing',h:77,w:{offb:5,lat:2,layup:12,dunk:10,speed:10,vert:9,handle:7,ft:5,close:5,str:4,stam:4,iq:3,cons:3,mid:3,pass:2,perD:3}},
  lock:   {n:'Lockdown Defender',fam:'perD',mod:'Lockdown',h:78,w:{lat:12,offb:2,perD:14,stl:10,speed:7,str:5,vert:5,stam:6,iq:6,cons:4,intD:4,blk:3,dreb:3,three:4,close:2,layup:3,handle:2}},
  threeD: {n:'3-and-D Wing',fam:'perD',mod:'3-and-D',h:79,w:{lat:8,offb:6,three:12,perD:11,stl:7,mid:5,close:4,ft:4,speed:6,vert:4,stam:5,iq:5,cons:5,dreb:3,str:3,layup:3,blk:2}},
  twoway: {n:'Two-Way Wing',fam:'all',mod:'',h:79,w:{lat:5,offb:4,fade:2,hook:1,three:7,mid:6,close:5,layup:6,dunk:4,handle:5,pass:5,perD:7,stl:5,intD:3,blk:3,dreb:4,oreb:2,speed:6,vert:5,str:4,stam:4,iq:6,cons:5,ft:3,post:2}},
  pointF: {n:'Point Forward',fam:'play',mod:'Playmaking',h:80,w:{fade:4,offb:3,lat:3,hook:2,pass:11,handle:9,iq:8,mid:6,three:5,close:5,layup:5,dreb:6,str:5,perD:5,speed:4,stam:4,cons:4,post:3,vert:3,ft:3,stl:2,blk:2}},
  runner: {n:'Athletic Finisher',fam:'fin',mod:'High-Flying',h:81,w:{offb:5,hook:2,lat:2,dunk:13,vert:11,layup:8,speed:8,oreb:7,stam:6,blk:6,dreb:5,str:5,close:5,intD:4,iq:3,cons:3,perD:2,ft:2}},
  stretch:{n:'Stretch Big',fam:'shoot',mod:'Floor-Spacing',h:82,w:{fade:6,offb:5,hook:2,three:14,mid:11,ft:6,close:8,dreb:6,intD:4,blk:4,str:2,oreb:2,iq:6,cons:7,post:2,stam:4,speed:4,vert:4,pass:2,layup:4,dunk:3}},
  post:   {n:'Post Scorer',fam:'fin',mod:'Post-Scoring',h:82,w:{hook:12,fade:8,offb:2,post:14,close:10,str:9,layup:6,dunk:5,ft:5,oreb:6,dreb:5,intD:5,iq:5,cons:5,mid:4,pass:3,stam:4,blk:3,vert:2}},
  glass:  {n:'Glass Cleaner',fam:'int',mod:'Rebounding',h:82,w:{hook:3,offb:2,dreb:13,oreb:12,str:9,vert:7,stam:7,intD:7,blk:6,dunk:5,close:5,layup:3,iq:4,cons:4,speed:3,post:3}},
  rim:    {n:'Rim Protector',fam:'int',mod:'Rim-Protecting',h:84,w:{hook:4,lat:1,blk:14,intD:13,dreb:9,oreb:5,str:8,vert:7,stam:5,iq:5,cons:3,dunk:5,close:4,layup:2,post:3,perD:2,speed:2}}};
const ARCH_IDS=Object.keys(ARCHS);
const ARCH_POW=1.6;
// core rating (2026-11-08): OVR is the better of the all-around rating and a core rating that only takes over near the top,
// so any role can reach 99 by maxing its core: core 99 with the rest of your game at 72 is a 99; past that it climbs slowly. Below the top nothing changes.
const CORE_N=7,CORE_W=.8,CORE_TOP=93.6,CORE_AT=CORE_W*99+(1-CORE_W)*72,CORE_SLOPE=3.2;
for(const a of Object.values(ARCHS)){const s=Object.values(a.w).reduce((x,y)=>x+y,0),s2=Object.values(a.w).reduce((x,y)=>x+y**ARCH_POW,0);a.wn0=Object.entries(a.w).map(([k,v])=>[k,v/s]);a.wn=Object.entries(a.w).map(([k,v])=>[k,v**ARCH_POW/s2]);
  // the role's core: its 7 most important skills. Maxing them (with the rest of your game decent) is a 99 in that role
  const ks=Object.keys(a.w).sort((x,y)=>a.w[y]-a.w[x]),core=ks.slice(0,CORE_N),rest=ks.slice(CORE_N),cs=core.reduce((t,k)=>t+a.w[k],0),rs=rest.reduce((t,k)=>t+a.w[k],0)||1;
  a.core=core.map(k=>[k,a.w[k]/cs]);a.rest=rest.map(k=>[k,a.w[k]/rs]);}
// per-role calibration (equally good builds rate the same in every role) and one offset that keeps the scale where the
// league's ratings sit. Measured offline (see docs/archetype-rework-plan.md); pure constants, no dice
const ARCH_CAL={floor:-3.23,creator:1.31,sniper:-3.63,slasher:-1.76,lock:-3.26,threeD:.58,twoway:6.4,pointF:4.3,runner:.03,stretch:.97,post:1.4,glass:-1.37,rim:-3.79},ARCH_OFF=-5.1;
// raw fit in every role, pure: depends only on skills, height and frame
function archRaw(){const memo={},out={};for(const id of ARCH_IDS){const a=ARCHS[id];let m=memo[a.h];if(!m){m=memo[a.h]={};const d=S.height-a.h;for(const k of SUBKEYS)m[k]=esD(k,d);}
  let v=0;for(const[k,w]of a.wn)v+=w*m[k];
  let c=0,r=0;for(const[k,w]of a.core)c+=w*Math.min(99,m[k]);for(const[k,w]of a.rest)r+=w*Math.min(99,m[k]);
  const dd=CORE_AT-(CORE_W*c+(1-CORE_W)*r),cv=CORE_TOP-(dd>0?CORE_SLOPE*dd:.4*dd)-ARCH_CAL[id]-ARCH_OFF;
  // well off the role's size: a 6'1" can't be a rim protector, a 7'0" can't run point
  out[id]=Math.max(v,cv)-Math.max(0,a.h-S.height-2)*.9-Math.max(0,S.height-a.h-3)*.6;}return out;}
function archFits(){const r=archRaw();return ARCH_IDS.map(id=>[id,r[id]+ARCH_CAL[id]+ARCH_OFF]).sort((x,y)=>y[1]-x[1]);}
function ovr(){const r=archRaw();let b=-1e9;for(const id of ARCH_IDS){const v=r[id]+ARCH_CAL[id];if(v>b)b=v;}return b+ARCH_OFF;}
// what you play like: the best role, plus a flavor word from a different family when that role is close behind
// the plaque and the record books remember the player you were at your peak, not your last season
const roleArch=()=>{if(S.idLock){const k=Object.keys(ARCHS).find(k=>ARCHS[k].n===S.idLock);if(k)return{...archetype(),...ARCHS[k],id:k};}return archetype();};
const archName=()=>S.idLock||((S.stage==='end'||S.retired)&&S.pkArch?S.pkArch:archetype().name);
function evoPend(){const e=S.evoPend;S.evoPend=null;if(!e||!ARCHS[e.to]||!ARCHS[e.from]||e.to===e.from)return null;const to=ARCHS[e.to].n,from=ARCHS[e.from].n,up=(S.evoUp||0)<2;
  return{kind:'evo',title:'🔄 Your Game Is Changing',text:`Your skills now say ${to}, not ${from}. Lean into the new role, or fight to keep your old identity?`,opts:[
    {label:`🌟 Embrace it: become ${/^[AEIOU]/.test(to)?'an':'a'} ${to}`,desc:up?'A new role can unlock untapped potential.':'Commit to the new role.',fn:()=>{if(up){S.evoUp=(S.evoUp||0)+1;S.ceiling+=2;}S.idLock=null;S.pkArch=archetype().name;S.hype+=2;return up?`You embraced your new role as a ${to}. Scouts see untapped potential`:`You embraced your new role as a ${to}`;}},
    {label:`🛡️ Stay ${/^[AEIOU]/.test(from)?'an':'a'} ${from}`,desc:'Keep your identity. +6 pts to sharpen your old game.',fn:()=>{S.idLock=from;S.bank+=6;return `You stayed true to your game as a ${from}. +6 pts`;}}]};}
function archetype(){const f=archFits();let id=f[0][0];if(S.stage!=='build'&&S.archId&&S.archId!==id){const cur=f.find(x=>x[0]===S.archId);if(cur&&f[0][1]-cur[1]<1.5)id=S.archId;}const a=ARCHS[id];let mod='';
  const gen=f.find(x=>x[0]==='twoway')[1];
  // the flavor role must stand out from plain all-around play, or every raw build would get a random word
  for(const[j,v]of f.slice(1)){if(f[0][1]-v>3)break;const b=ARCHS[j];if(b.fam!==a.fam&&b.fam!=='all'&&(id==='twoway'||v>gen+.5)){mod=b.mod;break;}}
  return{id,n:a.n,mod,name:(mod?mod+' ':'')+a.n,fits:f};}
// the short position tables and stories still use, derived from size and role (you never pick it)
const ARCH_LEAN={floor:-3,creator:-2,sniper:-1,slasher:-1,lock:0,threeD:0,twoway:0,pointF:0,runner:1,stretch:0,post:1.5,glass:1.5,rim:3};
function listedPos(id){const v=S.height+(ARCH_LEAN[id||archetype().id]||0);return v<76?'PG':v<78.5?'SG':v<80.5?'SF':v<82.5?'PF':'C';}
function syncPos(){if(S)S.pos=listedPos();}
// archetype rating before the four new skills (2026.11.06): only to convert runs saved with 21 skills. Same roles, weights and size
// penalties, minus the new skills, with that version's calibration
const NEW_SK=['fade','hook','lat','offb'],ARCH_CAL21={floor:-1.3,creator:-.07,sniper:-1.71,slasher:-1.86,lock:-1.08,threeD:-.49,twoway:5.19,pointF:2.49,runner:-.38,stretch:1.07,post:.79,glass:-1.05,rim:-1.61},ARCH_OFF21=-2.81;
function ovrOld(cal,off,only21){let b=-1e9;for(const id of ARCH_IDS){const a=ARCHS[id],d=S.height-a.h,w=a.wn0.filter(([k])=>!only21||!NEW_SK.includes(k)),ws=w.reduce((s,x)=>s+x[1],0);let v=0;for(const[k,x]of w)v+=x/ws*esD(k,d);
  v=v-Math.max(0,a.h-S.height-2)*.9-Math.max(0,S.height-a.h-3)*.6+cal[id];if(v>b)b=v;}return b+off;}
const ovr21=()=>ovrOld(ARCH_CAL21,ARCH_OFF21,true);
const ARCH_CAL25={floor:-1.54,creator:.17,sniper:-1.65,slasher:-1.66,lock:-1.61,threeD:-.13,twoway:4.68,pointF:2.77,runner:-.1,stretch:1.32,post:1.03,glass:-1.31,rim:-1.97},ARCH_OFF25=-1.6;
const ovr25=()=>ovrOld(ARCH_CAL25,ARCH_OFF25,false);
// runs saved before the new skills get them from related ones, so nobody's rating drops; a build in progress starts them at the minimum
const NEW_FROM={hook:['post','close'],fade:['post','mid'],offb:['iq','speed'],lat:['perD','speed']};
function seedNewSkills(a,build){for(const k of NEW_SK)if(a[k]==null)a[k]=build?MIN_A:Math.round((a[NEW_FROM[k][0]]+a[NEW_FROM[k][1]])/2);}

