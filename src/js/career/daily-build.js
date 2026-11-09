// ---------- daily build (same dice for everyone today) ----------
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
// the same dice as mulberry, but the state can be read and restored (saves, replays, playoff moments)
function makeRng(a){a>>>=0;const f=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};f.get=()=>a>>>0;f.set=v=>{a=v>>>0;};return f;}
const todayKey=()=>new Date().toISOString().slice(0,10);
function seedFrom(s){let h=1779033703;for(const c of s){h=Math.imul(h^c.charCodeAt(0),3432918353);h=h<<13|h>>>19;}return h>>>0;}
function flipDaily(){S.daily=!S.daily;if(!S.daily&&S.perksHeld){S.perks=S.perksHeld;S.perksHeld=null;if(S.perks.spin)S.spins+=2;trimToBudget();}if(S.daily){S.diff='pro';S.perksHeld=Object.keys(S.perks||{}).length?{...S.perks}:null;if(S.perks&&S.perks.spin)S.spins=Math.max(0,S.spins-2);S.perks={};trimToBudget();S.era=ERAS[seedFrom('era'+todayKey())%ERAS.length].id;}}
const dailyBest=()=>{const d=Store.obj('bag_daily');return d.date===todayKey()?d.runs||[]:[];};

