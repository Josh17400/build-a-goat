// ---------- the side menu and its pages ----------
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||typeof S==='undefined'||!S.ui)return;const u=S.ui;if(u.menu==='open')closeMenu();else if(u.menu)openMenu(null);else if(u.intro!=null)endIntro();else if(u.prof)closeProfile();});
const MENU=[['settings','sliders','Settings','Difficulty, sound and reset'],['gtp','gtp','GTP Store','Perks for your next player'],['gear','shirt','Equipment','Permanent gear for every player'],['hof','🏛️','Hall of Builds','Your best careers'],['ach','trophy','Achievements','What you have unlocked'],['bbook','medal','Badge Book','Every badge you have earned']];
// the Gem Shop item exists only while the store is on (iOS app with RevenueCat, or ?dev=1); see PLATFORM (Plat)
const MENU_GEMS=['gems','gem','Gem Shop','Buy gems and Remove Ads'];
const menuAll=()=>{const m=[...MENU];if(storeOn())m.splice(m.findIndex(x=>x[0]==='gear')+1,0,MENU_GEMS);return m;};
const menuItems=()=>{const M=menuAll();return S.stage==='build'?[...M,['how','book','How to play','']]:S.stage==='end'?M.map(m=>m[0]==='gtp'?['gtpnext','gtp','GTP Store','Perks for your next player']:m):[['prof','user','Your profile','Skills, badges, stats and timeline'],...M.filter(m=>m[0]!=='gtp'),['how','book','How to play',''],['quit','home','Main menu','']];};
function nextGtp(){R=Math.random;S=newPlayer();UI().menu='gtp';render();scrollTo(0,0);}
function openMenu(k){document.activeElement?.blur?.();const u=UI();if(k==='prof'){u.menu=null;openProfile('over');return;}if(k==='how'){u.menu=null;u.intro=0;render();scrollTo(0,0);return;}if(k==='open'){drawerAnim=true;u.wig=1;}u.menu=k;u.confirmReset=false;if(k!=='settings')u.resetDone=false;if(k!=='open')scrollTo(0,0);render();}
const hdr=t=>`<div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h1>${t}</h1>${menuBtn()}</div>`;
function menuBtn(){return`<button class="ham ${UI().wig?'':'wig'}" aria-label="Menu" onclick="openMenu('open')"><i></i><i></i><i></i></button>`;}
let drawerAnim=false;
function closeMenu(){const d=document.querySelector('.drawer');if(!d||d.classList.contains('out')){UI().menu=null;return render();}d.classList.remove('in');d.classList.add('out');d.style.pointerEvents='none';setTimeout(()=>{if(UI().menu==='open'){UI().menu=null;render();}},230);}
const BALL='<svg class="ball" viewBox="0 0 40 40" aria-hidden="true"><defs><radialGradient id="bg1" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffb05a"/><stop offset="1" stop-color="#d9580a"/></radialGradient></defs><circle cx="20" cy="20" r="18" fill="url(#bg1)"/><g fill="none" stroke="#3a1a05" stroke-width="1.6"><path d="M2 20h36M20 2v36"/><path d="M7 7c6 5 6 21 0 26M33 7c-6 5-6 21 0 26"/></g></svg>';
function drawerHTML(){const hofN=hallList().length,achN=Object.keys(achHave()).length,cls=drawerAnim?'in':'';drawerAnim=false;
  const sub={settings:diff().name.replace(/^\S+\s/,'')+' · difficulty, sound, reset',gtp:(gtpBank()-cartCost())+' GTP available · perks for this player',hof:hofN+(hofN===1?' career':' careers')+' · your best builds',ach:achN+'/'+ACH.length+' unlocked'};
  const ic={gtpnext:icon('gtp'),bbook:icon('medal'),settings:icon('sliders'),gtp:icon('gtp'),gear:icon('shirt'),gems:icon('gem'),how:icon('book'),hof:'🏛️',ach:icon('trophy'),quit:icon('home'),prof:icon('user')};sub.prof='Skills, badges, stats and timeline';sub.gear=gems()+' gems · permanent gear';sub.gems=gems()+' gems · buy gems, Remove Ads';sub.how='The basics, any time';sub.gtpnext=gtpBank()+' GTP · starts your next player (leaves this recap)';sub.bbook=bookCount()+'/'+BADGES.length+' badges discovered';sub.quit='Your run is saved. Continue it any time';if(S.stage!=='build')sub.settings='Sound and reset';
  return`<div class="drawer ${cls}" role="dialog" aria-label="Menu"><div class="bd" onclick="closeMenu()"></div><div class="pn">
  <div class="row" style="flex-wrap:nowrap"><div class="logo">${BALL}<div>BUILD A <span>GOAT</span></div></div><button class="x" aria-label="Close menu" onclick="closeMenu()"><i></i><i></i></button></div>
  <div class="curchips"><div class="gtpchip">🪙 ${gtpBank()-cartCost()} GTP${cartCost()?` · ${cartCost()} in cart`:''}</div><div class="gtpchip gemchip">${icon('gem','ici')}${gems()} gems</div></div>
  ${menuItems().map(([k,,l])=>`<button class="mi" onclick="${k==='quit'?'quitRun()':k==='gtpnext'?'nextGtp()':`openMenu('${k}')`}"><span class="bub">${ic[k]}</span><span class="grow"><span class="t">${l}</span><small>${sub[k]}</small></span><span class="chev">›</span></button>`).join('')}
  </div></div>`;}
function menuHTML(){const k=UI().menu,m=menuAll().find(x=>x[0]===k),hofN=hallList().length,achN=Object.keys(achHave()).length;
  const top=`<div class="row" style="justify-content:space-between;flex-wrap:nowrap"><h1>${m?m[2]:'Menu'}</h1><button class="ghost sm" onclick="openMenu('open')">◀ Menu</button></div>`;
  if(!m)return top+`<div class="card">${menuAll().map(([k,ic,l,d])=>`<button class="opt" onclick="openMenu('${k}')"><div class="grow"><div class="t">${/^[a-z]+$/.test(ic)?icon(ic):ic} ${l}</div><small>${k==='gtp'?gtpBank()+' GTP · ':k==='gear'||k==='gems'?gems()+' gems · ':k==='hof'?hofN+(hofN===1?' career · ':' careers · '):k==='ach'?achN+'/'+ACH.length+' · ':diff().name.replace(/^\S+\s/,'')+' · '}${d}</small></div></button>`).join('')}</div>`+dock(`<button onclick="openMenu(null)">Back to your build</button>`);
  let b='';if(k==='settings')b=settingsCard()+soundCard();
  if(k==='gtp')b=gtpCard(true)+gemTradeCard();
  if(k==='gear')b=gearCard();
  if(k==='gems')b=shopCard();
  if(k==='hof')b=hofHTML(true)||'<div class="card"><div class="sub">No careers yet. Finish a career and it lands here.</div></div>';
  if(k==='ach')b=achHTML([],true);
  if(k==='bbook')b=badgeBookHTML();
  return top+b+dock(`<button onclick="openMenu(null)">Back to your ${S.stage==='build'?'build':S.stage==='end'?'career recap':'career'}</button>`);}
