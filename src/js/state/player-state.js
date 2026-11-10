// ---------- state ----------
let S;
function newPlayer(){return{diff:savedDiff(),perks:{},gtpRun:0,look:randLook(),era:pick(ERAS).id,spins:1,daily:false,stage:'build',name:'',pos:'SF',height:79,frame:'Balanced',attrs:Object.fromEntries(SUBKEYS.map(k=>[k,START_A])),picked:[],traits:{},bank:0,hype:0,age:14,hs:[],col:[],nba:[],ceiling:0,injuryProne:false,badges:[],bdg:{},redshirt:false,flags:{}};}

const cost=v=>v<80?1:v<90?2:3;
const costTo=v=>{let c=0;for(let x=START_A;x<v;x++)c+=cost(x);return c;};
const spent=()=>SUBKEYS.reduce((s,k)=>s+costTo(S.attrs[k]),0);
function esD(k,d){const fr=FRAMES[S.frame];let v=S.attrs[k]+(fr[k]||0)+d*(HMOD[k]||0)*(d<0&&(k==='blk'||k==='oreb'||k==='dreb')?1.25:1);
  // you can only dunk as well as your size and bounce allow: short players need real Vertical to dunk
  if(k==='dunk'){const vert=S.attrs.vert+(fr.vert||0)+(S.height-78)*HMOD.vert;v=Math.min(v+(vert-60)*.15,52+(S.height-70)*3.5+(vert-50)*.8);}
  // skills start at 25, so a size penalty can take the on-court value lower; the floor sits below any penalty so every point you add counts
  return clamp(v,1,99);}
// on-court ratings use real height
function es(k){return esD(k,S.height-78);}
const fin3=()=>{const v=['close','layup','dunk','hook'].map(es).sort((a,b)=>b-a);return(v[0]+v[1]+v[2])/3;};
// your three best ways to score (a 99 three-point shooter is a real weapon even with a weak post game)
function topScr(){return['three','mid','close','fade','layup','dunk','post','hook'].map(k=>es(k)).sort((a,b)=>b-a).slice(0,3).reduce((x,y)=>x+y,0)/3;}
function eff(c){const L=SUBS[c];return L.reduce((s,[k])=>s+es(k),0)/L.length;}
// OVR before 2026-11-06 compared you to a chosen position. Kept only to convert old saved careers (legacyOvr)
function effRel(c,pos){const L=LEGACY_SUBS[c],d=S.height-POS[pos].h;return L.reduce((s,[k])=>s+esD(k,d),0)/L.length;}
const POSCAL={PG:-.9,SG:1.5,SF:2.6,PF:1.6,C:-.7};
function legacyOvr(pos){pos=POS[pos]?pos:'SF';const b=POS[pos].w;let s=0,o=POSCAL[pos];for(const[k]of ATTRS)s+=b[k];for(const[k]of ATTRS)o+=effRel(k,pos)*b[k]/s;return o;}
