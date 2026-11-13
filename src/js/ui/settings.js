// ---------- the settings page ----------
function settingsCard(){const u=UI(),ach=Object.keys(achHave()).length,hof=hallList().length;
  return`${diffCard()}<div class="card"><div class="sh">🏅 <span class="grow">Your progress</span></div>
  <div class="sub">Saved on this device: <b>${gtpBank()} GTP</b> · <b>${ach}</b> achievements · <b>${hof}</b> career${hof===1?'':'s'} in your Hall of Builds.</div>
  ${u.resetDone?'<div class="ev good" style="margin-top:10px">Progress reset. Fresh start.</div>':''}
  ${!resetOn()?'':u.confirmReset?`<div class="ev bad" style="margin-top:10px">This erases your GTP, gems (including bought gems), equipment, perks, achievements, Badge Book, Hall of Builds${hasRun()?', daily results and your saved run':' and daily results'}. It can’t be undone.</div>
    <div class="two" style="margin-top:8px;gap:10px"><button class="danger" onclick="resetProgress()">Yes, erase everything</button><button class="ghost" onclick="UI().confirmReset=false;render()">Cancel</button></div>`
  :`<button class="ghost" style="margin-top:10px;width:100%;color:#ff6b6b;border-color:rgba(255,107,107,.45)" onclick="UI().confirmReset=true;UI().resetDone=false;render()">Reset all progress</button>`}</div>`;}
// Reset all progress is a testing tool: the App Store build (build_www.py --release stamps BAG_ADS="live") leaves it out
const resetOn=()=>globalThis.BAG_ADS!=='live';
function resetProgress(){if(!resetOn())return;for(const k of[...SAVE_KEYS,...Object.values(SV)])Store.remove(k);R=Math.random;S=newPlayer();S.ui={tab:'setup',open:null,spend:false,menu:'settings',resetDone:true};render();scrollTo(0,0);}
