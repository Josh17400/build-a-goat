// ---------- difficulty & Generational Talent Points (GTP) ----------
const DIFFS={rookie:{name:'🟢 Rookie',budget:225,mult:0,lg:-8,nbaPts:.4,d:'Want a relaxed, less challenging career? Play Rookie: 225 skill points, start around 55 OVR, and great careers are common. You will not earn GTP, gems or achievements.'},
  pro:{name:'🟡 Pro',budget:205,mult:1,lg:3,nbaPts:.45,d:'The real challenge: 205 skill points, start around 50 OVR. Most careers end as role players and THE GOAT is rare. Earns GTP, gems and achievements.'},
  hof:{name:'🔴 Hall of Fame',budget:120,mult:1.5,lg:3,nbaPts:.77,d:'The biggest challenge: 120 skill points, start around 45 OVR. Many players never stick in the league and THE GOAT is a legend-level feat. Earns 1.5× GTP, gems and achievements.'}};
const diff=()=>DIFFS[S.diff]||DIFFS.pro;
Object.defineProperty(globalThis,'START_BUDGET',{configurable:true,get:()=>diff().budget+25*((S&&S.perks&&S.perks.pts)||0)});
const gtpBank=()=>Math.max(0,parseInt(Store.get('bag_gtp')||'0',10)||0);
const setGtp=n=>{Store.set('bag_gtp',String(Math.max(0,Math.round(n))));};
// what a season / college year / career is worth (before the difficulty multiplier)
// bonus points earned in the NBA, same currency as high school and college
const BANK_AW={'Comeback Player':4,'All-Star':3,'All-NBA 1st':8,'All-NBA 2nd':6,'All-NBA 3rd':5,MVP:10,'Finals MVP':4,Champion:3,DPOY:5,ROY:5,'6MOY':3,MIP:3,'Scoring Title':5};
const GTP_AW={'Comeback Player':2,'All-Star':2,'All-NBA 1st':5,'All-NBA 2nd':4,'All-NBA 3rd':3,MVP:8,'Finals MVP':4,Champion:5,DPOY:4,ROY:3,'6MOY':1,MIP:1,'Scoring Title':2};
const GTP_TIER={'Bust':0,'Journeyman':0,'Role Player':1,'Solid Starter':3,'Champion Role Player':4,'All-Star':5,'Perennial All-Star':8,'Hall of Famer':12,'Top 10 All-Time':20,'🐐 THE GOAT':35};
const capF=s=>s[0].toUpperCase()+s.slice(1);
function earnGtp(base,why){const g=Math.round(base*diff().mult*.5);if(g>0){S.gtpRun=(S.gtpRun||0)+g;(S.gtpLog=S.gtpLog||[]).push([why,g]);}return g;}
// the shop: perks bought for the NEXT player you build (applied when the career starts)
const PERKS_GTP=[
  ['pts','➕ +25 skill points','Stack up to 3 times',20,3],
  ['trait3','🧬 Third locked trait','Lock in 3 traits instead of 2',45,1],
  ['maxed','⭐ Maxed locked traits','Your locked traits start at 5/5',25,1],
  ['dna','💎 Generational DNA','Higher and far more reliable hidden potential (revealed on your career recap)',25,1],
  ['dev','🏋️ Elite trainer','40% more development points in high school and college',30,1],
  ['clutch','🧊 Cold-blooded','+1 Clutch Gene, on top of whatever you roll',20,1],
  ['agent','💼 Super agent','Teams offer you bigger roles in free agency',30,1],
  ['iron','💪 Iron body','You age slower once you hit your 30s',50,1],
  ['hype','📣 Early buzz','Start high school with +15 hype',10,1],
  ['armor','🛡️ Injury insurance','Your first major NBA injury gets downgraded',30,1],
  ['growth','📏 Growth genes','Height slider goes 3 inches taller',18,1],
  ['spin','🎰 Era re-spins','+2 era re-spins. Use them before high school: unused ones don’t carry over',5,1]];
const cartCost=()=>S.stage==='build'?perkCost():0;
const perkCost=()=>PERKS_GTP.reduce((s,[k,,,c])=>s+c*((S.perks&&S.perks[k])||0),0);
function setPerk(k,d){if(S.daily)return;S.perks=S.perks||{};const p=PERKS_GTP.find(x=>x[0]===k),n=(S.perks[k]||0)+d;
  if(n<0||n>p[4])return;if(d>0&&perkCost()+p[3]>gtpBank())return;if(k==='spin'&&d<0&&S.spunEra)return;S.perks[k]=n;
  if(k==='spin')S.spins=Math.max(0,S.spins+2*d);
  if(k==='trait3'&&n===0&&S.picked.length>2)S.picked.length=2;
  if(k==='growth'&&n===0)S.height=Math.min(S.height,H_MAX);
  trimToBudget();return true;}
function trimToBudget(){let g=0;while(spent()>START_BUDGET&&g++<2000){const k=SUBKEYS.reduce((a,b)=>S.attrs[b]>S.attrs[a]?b:a);S.attrs[k]--;}}
const savedDiff=()=>Store.get('bag_diff')||'pro';
function chooseDiff(d){if(S.daily||S.stage!=='build')return;S.diff=d;Store.set('bag_diff',d);trimToBudget();return true;}
const traitLimit=()=>S.perks&&S.perks.trait3?3:2;
// every NBA city, with a nickname that is close to but not the real one. Order matters: CONF() puts the first 15 in the East
const TEAMS=['Atlanta Talons','Boston Clovers','Brooklyn Bridges','Charlotte Stingers','Chicago Bison','Cleveland Cavalry','Detroit Motors','Indiana Speedsters','Miami Blaze','Milwaukee Stags','New York Skyliners','Orlando Illusions','Philadelphia Founders','Toronto Dinos','Washington Warlocks','Dallas Wranglers','Denver Prospectors','Golden State Gladiators','Houston Orbiters','Los Angeles Schooners','Los Angeles Lagoons','Memphis Kodiaks','Minnesota Howlers','New Orleans Herons','Oklahoma City Twisters','Phoenix Scorch','Portland Pathfinders','Sacramento Crowns','San Antonio Rustlers','Utah Rhythm'];
// the fictional names used before 2026-11-06, index-matched to TEAMS (by position, never by meaning, so a resumed run's
// replayed dice still pick the same slots and each team keeps its conference): a run saved mid-career is renamed when it is continued
const OLD_TEAMS=['Harbor City Hawks','Ironvale Forge','Desert Mesa Suns','Lakeport Gulls','Northwood Timber','Bay Bridge Bolts','Copper Canyon Coyotes','Granite Peaks','Midtown Monarchs','Riverside Rafters','Pinecrest Pilots','Cobalt City Comets','Twin Lakes Loons','Steel Valley Smelters','Sunbelt Stingers','Capitol Statesmen','Prairie Thunder','Seabreeze Sharks','Old Mill Millers','Emerald Coast Eels','Redstone Rockets','Frostfield Wolves','Bayou Gators','High Plains Hornets','Crescent Bay Crabs','Union Square Unity','Golden Gate Grizzlies','Lone Pine Lumberjacks','Mountain Air Eagles','Neon City Knights'];
function teamRename(str){if(!str)return str;for(let i=0;i<OLD_TEAMS.length;i++)if(str.includes(OLD_TEAMS[i]))str=str.split(OLD_TEAMS[i]).join(TEAMS[i]);return str;}
const SCHOOLS={blue:['Kingsford University','Carolina Pines','Bluegrass State','Royal Oak University','Phoenix Hill University','Lakeshore State','Tobacco Road University'],power:['State Tech','Great Lakes University','Southern Methodical','Western Ridge State','Bayview University','Desert Sun State','Iron Range University'],mid:['Riverbend College','Saint Ambrose','Coastal Christian','Northern Prairie','Valley A&M']};
const TIER={blue:{lbl:'Blue Blood',str:80,dev:1.12,hype:4,min:-4,d:'National TV every night. Big development, but you fight for minutes.'},power:{lbl:'Power Conference',str:64,dev:1.0,hype:2,min:0,d:'Solid program, solid role, solid exposure.'},mid:{lbl:'Mid-Major',str:46,dev:.94,hype:0,min:6,d:'The keys are yours. Big stats, less hype.'}};
const INJ={minor:['sprained ankle','hamstring strain','sore knee','bruised hip','back spasms'],mod:['high ankle sprain','broken hand','MCL sprain','torn ligament in thumb','calf strain'],major:['torn ACL','ruptured Achilles','broken foot','torn meniscus','fractured kneecap']};

