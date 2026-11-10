// ---------- save & continue: a run survives closing the app ----------
// A snapshot of the whole run is stored whenever no decision is waiting, plus the few actions taken since.
// Replaying those actions with the same dice rebuilds any open decision exactly, so reloading can't reroll anything.
const GAME_V='2026.11.07';
// runs saved before archetypes (2026.11.06) rated you by a chosen position: keep their growth room when converting
const ARCH_V='2026.11.06';
// runs saved before the 25 skills (2026.11.06b) also get the four new skills, started from related ones, and their badges
const SKILL_V='2026.11.06b';
// 2026.11.07: weightier points (cheaper skills, your best skills count more); older runs keep their growth room
const POINTS_V='2026.11.07';
function convertRun(meta){const v=(meta&&meta.v)||'';if(v>=POINTS_V)return;const was=v>=SKILL_V?ovr25():v>=ARCH_V?ovr21():legacyOvr(S.pos);seedNewSkills(S.attrs,false);S.bdg=S.bdg||{};
  S.ceiling+=ovr()-was;S.archId=archetype().id;syncPos();updBadges('load');}
const SV={snap:'bag_run',meta:'bag_run_meta',log:'bag_run_log',ui:'bag_run_ui',build:'bag_build'};
let SAVE_OFF=false,REPLAY=false,LOGD=0,RUNLOG=[],RUNID=0;
const canSave=()=>!SAVE_OFF&&!REPLAY&&Store.ok()&&typeof location!=='undefined';
const runSafe=()=>!S.summerPend&&!S.pend&&!(S.queue&&S.queue.length)&&S.stage!=='offers'&&!S.cur;
function lsSet(k,v){const ok=Store.set(k,v);if(!ok)console.warn('save failed: '+k);return ok;}
function runMeta(){try{return JSON.parse(teamRename(Store.get(SV.meta))||'null');}catch{return null;}}
const hasRun=()=>!!runMeta();
function getS(){return S;} // tests read the live run through this (a reload swaps S for a new object)
function runSummary(){return{name:S.name,stage:S.stage,age:S.age,ovr:OV(),look:S.look,pos:S.pos,arch:archName(),yr:S.nba.length,hs:S.hs.length,col:S.col.length,school:S.school||null,team:S.team||null,diff:S.diff,ts:Date.now()};}
// the rival also lives in the league list, so he is stored by id and linked back on load
// sets (like recently seen events) are stored as lists and turned back into sets on load
const snapJSON=()=>JSON.stringify(S,(k,v)=>k==='ui'?undefined:v instanceof Set?{__set:[...v]}:k==='rival'&&v&&typeof v==='object'?{__ref:v.id}:v);
function writeSnap(){if(!canSave()||!R.get)return;RUNID++;if(!lsSet(SV.snap,snapJSON()))return;
  lsSet(SV.meta,JSON.stringify({v:GAME_V,id:RUNID,rs:R.get(),sum:runSummary()}));RUNLOG=[];writeLog();}
function writeLog(){if(!canSave())return;lsSet(SV.log,JSON.stringify({id:RUNID,log:RUNLOG}));if(S.stage!=='build'&&S.stage!=='end'&&RUNID){try{const m=Store.json(SV.meta);if(m&&m.id===RUNID){m.sum=runSummary();lsSet(SV.meta,JSON.stringify(m));}}catch{}}}
function clearRun(){for(const k of[SV.snap,SV.meta,SV.log,SV.ui])Store.remove(k);RUNLOG=[];}
function afterAction(n,a){if(!canSave())return;if(S.stage==='end'||S.stage==='build'){clearRun();return;}
  // spending points is a cheap log entry; anything bigger folds into a fresh snapshot once nothing is waiting
  if(runSafe()&&!['spend','smartSpend','unspend','undoSpend','clearUndo'].includes(n))writeSnap();else{RUNLOG.push([n,...a]);if(runSafe()&&RUNLOG.length>=40)writeSnap();else writeLog();}}
function autosave(){if(!canSave())return;if(S.stage==='build')lsSet(SV.build,JSON.stringify(S));else if(S.stage!=='end'&&RUNID)lsSet(SV.ui,JSON.stringify(S.ui||{}));}
const LOGGED=['simHS','simCol','simNBA','chooseSummer','chooseSchool','declare','returnSchool','choose','simAll','simEnd','spend','smartSpend','startNBA','unspend','undoSpend','clearUndo'];
for(const n of LOGGED){const f=globalThis[n];if(typeof f!=='function')continue;
  globalThis[n]=function(...a){if(REPLAY||LOGD||!S.seed||S.stage==='build')return f.apply(this,a);LOGD++;let r;try{r=f.apply(this,a);}finally{LOGD--;}try{afterAction(n,a);}catch(e){console.warn(e);}return r;};}
// a started career uses up the build it came from: drop that draft, or the next launch reopens the same player in the creator
{const f=globalThis.startCareer;if(typeof f==='function')globalThis.startCareer=function(...a){const r=f.apply(this,a);if(!REPLAY&&canSave()){clearRun();Store.remove(SV.build);writeSnap();}return r;};}
function loadRun(){const meta=runMeta();let snap=null,lg=null;try{snap=JSON.parse(teamRename(Store.get(SV.snap))||'null',(k,v)=>v&&typeof v==='object'&&Array.isArray(v.__set)?new Set(v.__set):v);lg=Store.json(SV.log);}catch{}
  if(!meta||!snap){clearRun();return false;}
  REPLAY=true;
  try{S=Object.assign(newPlayer(),snap);if(S.rival&&S.rival.__ref!=null)S.rival=(S.L&&S.L.P.find(p=>p.id===S.rival.__ref))||null;
    convertRun(meta);R=makeRng(meta.rs);RUNID=meta.id;RUNLOG=[];
    if(lg&&lg.id===meta.id)for(const e of lg.log){try{globalThis[e[0]](...e.slice(1));RUNLOG.push(e);}catch(err){console.warn('replay stopped at',e[0],err);break;}}}
  finally{REPLAY=false;}
  const ui=Store.json(SV.ui);
  S.ui=Object.assign({tab:'setup',open:null,spend:false},ui||{},{menu:null,wig:1});writeLog();return true;}
// leave a run without losing it: back to a fresh build screen, with the run waiting on Continue
function leaveRun(){if(S.stage!=='build'&&S.stage!=='end'&&canSave())lsSet(SV.ui,JSON.stringify(Object.assign({},S.ui,{menu:null})));R=Math.random;S=newPlayer();S.ui={tab:'setup',open:null,spend:false,wig:1};}
// give up on a run: it is deleted (no Hall of Builds entry, no GTP), and a fresh player waits in the creator
function dropRun(){if(canSave()){clearRun();Store.remove(SV.build);}R=Math.random;S=newPlayer();S.ui={tab:'setup',open:null,spend:false,wig:1};}
// a draft saved by older versions can be the very build the saved run started from: that is not a new player, so skip it
const sameAsRun=b=>{const s=runMeta()?.sum;return!!s&&JSON.stringify(b.look)===JSON.stringify(s.look);};
// on launch: put a half-finished build back, and point to a saved run if there is one
function bootSave(){if(!canSave())return;try{const b=Store.json(SV.build);if(b&&b.stage==='build'&&sameAsRun(b))Store.remove(SV.build);else if(b&&b.stage==='build'){S=Object.assign(newPlayer(),b);seedNewSkills(S.attrs,true);S.ui=Object.assign({tab:'setup',open:null,spend:false},b.ui||{},{menu:null,replaceOk:0});}}catch{}
  if(hasRun())(S.ui=S.ui||{tab:'setup',open:null,spend:false}).tab='setup';}
const SAVE_KEYS=['bag_gtp','bag_ach','bag_hof','bag_recent','bag_daily','bag_diff','bag_rec','bag_goats','bag_gems','bag_gear','bag_intro'];
