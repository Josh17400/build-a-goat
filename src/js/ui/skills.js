// ---------- skills ----------
// a skill is maxed when another point would not show: 99 on screen, or a dunk held back by size and bounce
function atCap(k){const v=S.attrs[k];if(v>=99||Math.round(es(k))>=99)return true;const e=es(k);S.attrs[k]=v+1;const e2=es(k);S.attrs[k]=v;return e2<=e&&e>1;}
function stepN(k,n){const v0=S.attrs[k];let v=v0,c=0,i=0;while(i<n&&v<99&&c+cost(v)<=S.bank&&!atCap(k)){c+=cost(v);v++;i++;S.attrs[k]=v;}S.attrs[k]=v0;return[c,i];}
function costN(k,n){return stepN(k,n)[0];}
function skillRow(k,l,mode){const v=S.attrs[k],e=Math.round(es(k));let ctl;
  if(mode==='build'){const top=es(k)>=99,off=v>=BUILD_MAX||top||spent()+cost(v)>START_BUDGET;ctl=`<button class="ghost sm" aria-label="Remove a point from ${l}" onclick="adj('${k}',-1)" ${v<=START_A?'disabled':''}>−</button>`+(v>=BUILD_MAX||top?`<span class="capd">${top?'99: maxed':`Max ${BUILD_MAX} here`}</span>`:`<button class="sm" aria-label="Add a point to ${l}" onclick="adj('${k}',1)" ${off?'disabled':''}>+${cost(v)>1?cost(v):''}</button><button class="ghost sm" aria-label="Add 10 points to ${l}" onclick="adjN('${k}',10)" ${off?'disabled':''}>+10</button><button class="ghost sm" aria-label="Max out ${l}" onclick="adjN('${k}',99)" ${off?'disabled':''}>Max</button>`);}
  else if(mode==='view')ctl='';
  else{const cap=atCap(k),off=S.bank<cost(v)||cap;ctl=`${canUndo(k)?`<button class="ghost sm" aria-label="Take a point back from ${l}" onclick="unspend('${k}')">−</button>`:''}`+(cap?`<span class="capd">Maxed${Math.round(es(k))<99?' for your build':''}</span>`:`<button class="sm" aria-label="Add a point to ${l}" onclick="spend('${k}')" ${off?'style="opacity:.45"':''}>+${cost(v)>1?cost(v):''}</button>${(()=>{const[c10,n10]=off?[0,10]:stepN(k,10);return`<button class="ghost sm" aria-label="Raise ${l} by ${n10}" onclick="spend('${k}',10)" ${off?'disabled':''}>+${n10}${off?'':` <small>· ${c10} pt${c10===1?'':'s'}</small>`}</button>`;})()}${UI().maxArm===k?`<button class="sm" aria-label="Confirm max ${l}" onclick="spend('${k}',99)" style="background:var(--gold,#ffc84a);color:#000">Tap again: ${maxCost(k)[0]} pts → ${Math.min(99,Math.round(es(k))+maxCost(k)[1]-S.attrs[k])}</button>`:`<button class="ghost sm" aria-label="Max out ${l}" onclick="armMax('${k}')" ${off?'disabled':''}>Max</button>`}`);}
  const capT=mode!=='build'&&mode!=='view'&&atCap(k),sm=UI().spMsg&&UI().spMsg.k===k?`<small class="bh">${UI().spMsg.t}</small>`:'';
  return`<div class="attr"><span>${l}${capT?'':IMP[k]==='hi'?'<small class="imp hi">high impact</small>':IMP[k]==='lo'?'<small class="imp">low impact</small>':''}</span><div class="bar"><i style="width:${e}%"></i></div><b>${e}</b><div class="ctl">${ctl}</div>${sm}${badgeHint(k)}</div>`;}
function impactMap(){const o0=ovr(),d=SUBKEYS.map(k=>{const v=S.attrs[k];S.attrs[k]=v+1;const x=ovr()-o0;S.attrs[k]=v;return[k,x];}).sort((a,b)=>b[1]-a[1]),m={};
  d.forEach(([k,x],i)=>m[k]=i<6&&x>0?'hi':i>=d.length-6||x<=0?'lo':'');return m;}
let IMP={};
function skillAcc(mode){const u=UI();IMP=impactMap();return ATTRS.map(([c,cl])=>{const open=u.open===c,v=Math.round(eff(c));
  return`<div class="acc ${open?'open':''}"><button class="acch" aria-label="${cl} skills" aria-expanded="${open}" onclick="UI().open=UI().open==='${c}'?null:'${c}';render()"><span>${cl}</span><div class="bar"><i style="width:${v}%"></i></div><span class="v">${v}</span><span class="chev">▶</span></button>${open?`<div class="accb">${SUBS[c].map(([k,l])=>skillRow(k,l,mode)).join('')}</div>`:''}</div>`;}).join('')+(mode==='bank'||mode==='view'?undoBar():'');}
function attrRows(mode){return skillAcc(mode);}
function adjN(k,n){const r=render;render=()=>{};try{for(let i=0;i<n;i++)adj(k,1);}finally{render=r;}render();}
function adj(k,d){if(d>0&&spent()+cost(S.attrs[k])<=START_BUDGET&&S.attrs[k]<BUILD_MAX&&es(k)<99)S.attrs[k]++;if(d<0&&S.attrs[k]>START_A)S.attrs[k]--;render();}
// auto-assign: each point goes where it raises OVR the most per point spent, leaning toward weak spots
function buildFill(){let g=0;while(g++<900){const left=START_BUDGET-spent(),o0=ovr();let best=null,bs=-1;
    for(const k of SUBKEYS){const v=S.attrs[k],c=cost(v);if(v>=BUILD_MAX||c>left)continue;S.attrs[k]=v+1;const d=ovr()-o0;S.attrs[k]=v;const sc=d/c*(1+(75-v)/150);if(sc>bs){bs=sc;best=k;}}
    if(!best)break;S.attrs[best]++;}render();}
const STEP=1,keepGain=o0=>{};
function smartSpend(){let g=0;const oS=ovr();while(S.bank>0&&g++<600){const o0=ovr();let best=null,bs=-1;
    for(const k of SUBKEYS){const v=S.attrs[k],c=cost(v);if(v>=99||c>S.bank||atCap(k))continue;S.attrs[k]=Math.min(99,v+STEP);const d=ovr()-o0;S.attrs[k]=v;const s=d/c*(1+(75-v)/150);if(s>bs){bs=s;best=k;}}
    if(!best)break;S.bank-=cost(S.attrs[best]);S.attrs[best]=Math.min(99,S.attrs[best]+STEP);}keepGain(oS);spendBadges();render();}
const canUndo=k=>S.stage==='hs'&&!S.hs.length&&S.attrs0&&S.attrs[k]>S.attrs0[k];
function unspend(k){UI().spMsg=null;if(!canUndo(k))return;S.attrs[k]-=STEP;S.bank+=cost(S.attrs[k]);S.bdg={};render();}
const seasonsPlayed=()=>S.hs.length+S.col.length+S.nba.length;
const canUndoSpend=()=>!!(S.spendLog&&S.spendLog.length&&S.spendLog[S.spendLog.length-1].at===seasonsPlayed());
function undoSpend(){if(!canUndoSpend())return;const u=S.spendLog.pop();S.attrs[u.k]=u.v;S.bank+=u.c;S.bdg={...u.bdg};UI().spMsg=null;render();}
function clearUndo(){if(S.spendLog&&S.spendLog.length)S.spendLog=[];}
function undoBar(){if(!canUndoSpend())return'';const u=S.spendLog[S.spendLog.length-1];return`<button class="ghost wide" style="margin:6px 0" onclick="undoSpend()">↩ Undo: ${SKN[u.k]} back to ${u.shown} (+${u.c} pt${u.c===1?'':'s'} back)${S.spendLog.length>1?` · ${S.spendLog.length} steps`:''}</button>`;}
const maxCost=k=>{const v0=S.attrs[k];let v=v0,c=0;while(v<99&&c+cost(v)<=S.bank&&!atCap(k)){c+=cost(v);v++;S.attrs[k]=v;}S.attrs[k]=v0;return[c,v];};
function spend(k,n=1){const O0=OV(),o0=ovr(),v0=S.attrs[k],b0=S.bank,sh=Math.round(es(k)),bd={...(S.bdg||{})};UI().maxArm=null;UI().spMsg=null;for(let i=0;i<n;i++){const c=cost(S.attrs[k]);if(S.bank>=c&&S.attrs[k]<99&&!atCap(k)){S.bank-=c;S.attrs[k]=Math.min(99,S.attrs[k]+STEP);}else break;}
  if(S.bank<b0)(S.spendLog=S.spendLog||[]).push({k,v:v0,c:b0-S.bank,shown:sh,bdg:bd,at:seasonsPlayed()});
  {const now=Math.round(es(k)),nm=SKN[k]||k,nc=cost(S.attrs[k]);UI().spMsg=S.bank===b0?{k,t:atCap(k)?`${nm} is maxed`:`The next ${nm} point costs ${nc} pts and you have ${S.bank}`}:n>1&&!atCap(k)&&S.bank<nc?{k,t:`Raised ${nm} as far as your points go (${sh} to ${now}). The next point costs ${nc} and you have ${S.bank}${OV()===O0?(IMP[k]==='lo'?`. OVR stays ${O0}: ${nm} adds only a little to a ${S.pos}'s OVR`:`. OVR stays ${O0} for now: it moves in fractions`):''}`}:now===sh?{k,t:`${nm} still shows ${now}: it moves up in fractions here`}:OV()===O0&&S.bank<b0&&atCap(k)?{k,t:`${nm} ${sh} to ${now} and maxed. OVR stays ${O0}: the last few points of a skill add very little`}:OV()===O0&&S.bank<b0?{k,t:IMP[k]==='hi'||(IMP[k]!=='lo'&&ovr()-o0>=.1*Math.max(1,S.attrs[k]-v0)/3)?`${nm} ${sh} to ${now}. OVR stays ${O0} for now: it moves in fractions`:`${nm} ${sh} to ${now}. OVR stays ${O0}: ${nm} adds only a little to a ${S.pos}'s OVR, but it still shows up in your stats and badges`}:null;}keepGain(o0);spendBadges();render();}
function setF(k,v){S[k]=v;render();}
function setH(d){S.height=clamp(S.height+d,H_MIN,H_MAX+(S.perks&&S.perks.growth?3:0));render();}
function toggleTrait(k){const i=S.picked.indexOf(k);if(i>=0)S.picked.splice(i,1);else if(S.picked.length<traitLimit())S.picked.push(k);render();}
function startCareer(){syncPos();S.archId=archetype().id;S.name=(S.name||'').trim()||(pick(FIRST)+' '+pick(LAST));S.cls=null;S.L=null;if(S.daily){S.diff='pro';S.perks={};}const pc=perkCost();if(pc){setGtp(gtpBank()-pc);S.perksBought={...S.perks};}S.seed=S.daily?seedFrom('goat'+todayKey()):(Math.random()*4294967296)>>>0;R=makeRng(S.seed);
  for(const[k]of TRAITS)S.traits[k]=S.picked.includes(k)?(S.perks.maxed?5:ri(4,5)):ri(1,5);
  S.bank=START_BUDGET-spent();wearGear();S.cls=makeClass();S.pkO=0;S.pkArch=null;S.idLock=null;S.evoPend=null;S.evoUp=0;S.midSeen=[];S.midAt=null;S.roleSeen=null;S.oldRivals=[];S.clLines=[];S.endWhy=null;S.clsSeen=[];S.rvDone=0;S.clsAdj=0;S.starFloor=0;S.ceiling=ovr()+7+gauss()*(S.perks.dna?3.5:8)+(S.traits.work-3)*2.5+(S.traits.late-3)*1.2;if(S.perks.dna)S.ceiling+=4;if(S.perks.clutch)S.traits.clutch=Math.min(5,S.traits.clutch+1);if(S.perks.hype)S.hype+=15;S.armor=!!S.perks.armor;S.startOvr=OV();S.attrs0={...S.attrs};S.stage='hs';S.bdg={};S.lastResult=gearNote();UI().spend=false;render();scrollTo(0,0);}

