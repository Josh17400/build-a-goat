// ---------- eras ----------
const ERAS=[
  {id:'80s',name:'🕺 The 80s',d:'Run-and-gun and short shorts. Athletes and passers feast; nobody shoots threes.',w:{ath:.05,pla:.04,fin:.02,sho:-.06,def:-.03,iq:-.02},pace:1.12,tp:-.03},
  {id:'90s',name:'🥊 The 90s',d:'Hand-checks and hard fouls. Bigs, post scorers and defenders rule.',w:{fin:.04,def:.04,reb:.03,sho:-.06,ath:-.03,pla:-.02},pace:.9,tp:-.02},
  {id:'00s',name:'💿 The 2000s',d:'Iso ball. Wings who can create their own shot get buckets.',w:{fin:.03,ath:.03,sho:.01,iq:.01,reb:-.03,pla:-.02,def:-.03},pace:.94,tp:-.005},
  {id:'10s',name:'🌀 The 2010s',d:'Pace and space. Switch everything, shoot more threes.',w:{sho:.03,ath:.02,reb:-.03,def:-.02},pace:1,tp:0},
  {id:'30s',name:'🚀 The 2030s',d:'Positionless ball. Everyone handles, everyone shoots, and basketball IQ rules.',w:{iq:.05,pla:.04,sho:.03,ath:.01,fin:-.04,reb:-.05,def:-.04},pace:1.05,tp:.02},
  {id:'20s',name:'🎯 The 2020s',d:'Let it fly. Shooters are kings and slow bigs get played off the floor.',w:{sho:.07,pla:.02,fin:-.03,reb:-.04,def:-.02},pace:1.08,tp:.015}];
const era=()=>ERAS.find(e=>e.id===S.era)||ERAS[3];
const shortNm=n=>{if(!n)return'—';const w=n.split(' ');return w.length>1?w[0][0]+'. '+w.slice(-1)[0]:n;};
// a skipped summer always takes a safe option (they are listed first)
const safeIdx=p=>{const i=p.opts.findIndex(o=>/Safe/.test(o.desc||''));return i>=0?i:p.opts.length-1;};
const mileNote=()=>{const p=Math.round(career().pts||0),m=[10000,20000,30000,40000].find(x=>x>p);return m&&m-p<=3000?` You are ${(m-p).toLocaleString()} points from ${m.toLocaleString()}.`:'';};
const onlineEra=()=>['10s','20s','30s'].includes(S.era);
// era taste: what teams of this era pay for. Changes interest (draft buzz, free agency), never OVR
function eraValue(){const w=era().w,o=ovr();let v=0;for(const c in w)v+=w[c]*(eff(c)-o);return v;}
const eraWants=()=>Object.entries(era().w).sort((a,b)=>b[1]-a[1])[0][0],catName=c=>ATTRS.find(x=>x[0]===c)[1];
function rollEra(){if(S.spins<=0||S.daily)return;S.spins--;S.spunEra=true;let e;do e=pick(ERAS).id;while(e===S.era);S.era=e;return true;}

