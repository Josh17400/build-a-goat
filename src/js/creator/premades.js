// ---------- archetypes & randomize ----------
const ARCH=[
  ['🎯 Sharpshooter','SG',77,'Lean',{three:3,mid:2.5,ft:2,close:1,offb:1.5,speed:1,iq:1,cons:1.5}],
  ['🛡️ Rim Protector','C',84,'Strong',{blk:3.6,intD:3.4,dreb:1.3,oreb:.5,str:1.5,dunk:1,vert:1.4,hook:.8,iq:1,lat:.6}],
  ['🦾 Two-Way Wing','SF',79,'Balanced',{perD:2.5,three:2,stl:2,lat:2,speed:1.5,vert:1.5,layup:1.5,iq:1}],
  ['🧠 Floor General','PG',74,'Balanced',{pass:3,handle:3,iq:2.5,three:1.5,mid:1.5,speed:1.5,cons:1}],
  ['💥 Slasher','SG',77,'Lean',{layup:3,dunk:2.5,speed:2.5,vert:2,handle:1.5,ft:1,offb:1}],
  ['🐻 Post Bully','PF',81,'Strong',{post:3,hook:2.5,str:3,close:2,fade:1,oreb:2,dreb:2,intD:1.5}]];
function fillPoints(pk){for(const k of SUBKEYS)S.attrs[k]=MIN_A;let g=0,miss=0;
  while(g++<6000&&miss<60){const k=pk();if(S.attrs[k]>=BUILD_MAX){miss++;continue;}if(spent()+cost(S.attrs[k])>START_BUDGET){miss++;continue;}S.attrs[k]++;miss=0;}}
function applyArch(i){const[l,pos,h,fr,w]=ARCH[i],keys=Object.keys(w),tot=keys.reduce((s,k)=>s+w[k],0);S.arch=l;
  fillPoints(()=>{if(R()<.22)return pick(SUBKEYS);let r=R()*tot;for(const k of keys){r-=w[k];if(r<=0)return k;}return keys[0];});render();}
function randomBuild(){S.arch=null;fillPoints(()=>pick(SUBKEYS));
  const T=TRAITS.map(t=>t[0]);S.picked=[T.splice(ri(0,T.length-1),1)[0],T.splice(ri(0,T.length-1),1)[0]];if(!S.name)S.name=pick(FIRST)+' '+pick(LAST);render();}

