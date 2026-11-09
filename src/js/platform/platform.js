// ================= PLATFORM (Plat) =================
// The one seam between the game and the device. The web build (GitHub Pages) has no ad network and no store, so the banner, the
// "double your rewards" ad and the gem shop are hidden there and the page behaves exactly as before. URL ?dev=1 swaps in simulated
// ads and purchases (a confirm() sheet, plus a placeholder banner strip) so every flow can be played through on the web.
// The iOS app (native/, Capacitor 8) loads native/shell.js before this script; window.Shell is the device side over the plugins
// (@capacitor-community/admob, @revenuecat/purchases-capacitor, preferences, app, splash-screen). Plat never calls a plugin itself.
// Under Witness (globalThis.__witnessApi, html.wt) Plat does nothing. See native/README.md.
//   Plat.boot()                  once at startup: restores the native copy of the progress keys if iOS purged web storage, hands
//                                PLAT_IDS to Shell.configure (ATT, consent, ad preload, RevenueCat), shows the banner unless Remove
//                                Ads is owned, re-reads owned purchases, then lifts the launch splash
//   Plat.ad() -> Promise<bool>   a rewarded video, true only when the reward was earned
//   Plat.buy(sku) -> Promise<bool>   a store purchase; cancel or error reads false. Grants: shopBuy()
//   Plat.restore() -> Promise<[sku]> owned non-consumables (Remove Ads); rejects with a message the shop can show
//   Plat.price(sku, usd)         the store's localized price once products load, else the USD label
//   Plat.banner()                shows or removes the bottom banner (removed for good once Remove Ads is owned)
// Ads: only a release build (native/build_www.py --release, the App Store candidate) uses the live units; every other build uses
// Google's public test units. Bundle id com.buildagoat.game. Store product ids are bag_-prefixed (App Store ids are unique per
// developer account, and Euchre Unleashed / The Fort already sell remove_ads, coins_*, fort_*).
const PLAT_IDS={
  admobApp:'ca-app-pub-8913077727879528~5336072139',     // AdMob app "Build a GOAT" (iOS). Must equal GADApplicationIdentifier in
                                                         //   native/ios/App/App/Info.plist (build_www.py checks)
  rewarded:'ca-app-pub-8913077727879528/5764493725',     // live rewarded unit "double rewards" (release builds only)
  banner:'ca-app-pub-8913077727879528/1045473333',       // live banner unit "bottom banner" (release builds only)
  testRewarded:'ca-app-pub-3940256099942544/1712485313', // Google's public iOS test units: every non-release build
  testBanner:'ca-app-pub-3940256099942544/2435281174',
  rcKey:'appl_XEEhYKNICJGLfrqKZHlYEOtkBeL',              // RevenueCat project "Build a GOAT", public App Store SDK key
};
// Gem packs: ids are by tier (an App Store product id can never be renamed), so amounts can be retuned without new products.
// Each tier is ~10-14% more gems per dollar than the last; the top pack stays under the 1,700 gems that max every gear item.
const SHOP_PACKS=[{sku:'bag_gems_t1',gems:40,usd:1.99},{sku:'bag_gems_t2',gems:110,usd:4.99},
  {sku:'bag_gems_t3',gems:250,usd:9.99,tag:'Popular'},{sku:'bag_gems_t4',gems:550,usd:19.99},
  {sku:'bag_gems_t5',gems:1500,usd:49.99,tag:'Best value'}];
const SHOP_NOADS={sku:'bag_noads',usd:3.99};
const SHOP_SKUS=()=>[...SHOP_PACKS.map(p=>p.sku),SHOP_NOADS.sku];
const noAds=()=>Store.get('bag_noads')==='1';
const Plat=(()=>{let busy=false,booted=null,mt=null;
  const sh=()=>window.Shell&&window.Shell.native?window.Shell:null;
  const wt=()=>!!globalThis.__witnessApi;
  const dev=()=>!sh()&&!wt()&&typeof location!=='undefined'&&/[?&]dev=1(&|$)/.test(location.search);
  const live=()=>{const s=sh();return!!s&&s.liveAds===true;};
  // the soundtrack pauses under a full-screen ad
  const hush=on=>{try{const m=SND.M;if(!m||!m.el)return;if(on)m.el.pause();else if(SND.P.music&&!document.hidden)m.el.play().catch(()=>{});}catch(e){}};
  const sim=what=>new Promise(r=>setTimeout(()=>r(confirm('[dev] '+what+'\nOK = it worked, Cancel = cancelled')),30));
  // native save mirror: iOS can purge a WKWebView's web storage, so the progress keys (gems, gear, GTP, achievements, Hall of Builds,
  // Remove Ads...) are copied as one JSON blob to Capacitor Preferences (Shell.store). The in-progress run snapshot is not mirrored.
  const NKEY='bag_all',MIRROR=k=>typeof k==='string'&&/^bag_/.test(k)&&!/^bag_(run|build|all)/.test(k);
  function snapshot(){const o={};for(const k of Store.keys())if(MIRROR(k))o[k]=Store.get(k);return JSON.stringify(o);}
  function mirrorNow(){clearTimeout(mt);mt=null;const s=sh();if(!s)return;const j=snapshot();Store.set(NKEY,j);s.store.put(NKEY,j);}
  const mirror=()=>{if(!mt)mt=setTimeout(mirrorNow,400);};
  // every write the game makes goes through Store, which reports it here
  function watchStorage(){Store.onChange(k=>{if(MIRROR(k))mirror();});}
  // #adStrip is the dark backing under the native banner (and the home-indicator strip below it)
  function setBanner(h){const r=document.documentElement;let el=document.getElementById('adStrip');
    if(!el){el=document.createElement('div');el.id='adStrip';el.setAttribute('aria-hidden','true');document.body.appendChild(el);}
    el.textContent=r.classList.contains('adsim')?'Banner ad (dev preview)':'';r.classList.toggle('adb',h>0);r.style.setProperty('--adH',h+'px');}
  const P={busy:()=>busy,native:()=>!!sh(),dev,
    adsOn:()=>{const s=sh();return s?s.ads.available():dev();},
    iapOn:()=>{const s=sh();return s?s.iap.available():dev();},
    price(sku,usd){const s=sh(),p=s&&s.iap.price(sku);return p||'$'+usd.toFixed(2);},
    banner(){const s=sh();if(s){if(noAds())s.ads.removeBanner();else s.ads.showBanner();return;}
      if(dev()){document.documentElement.classList.toggle('adsim',!noAds());setBanner(noAds()?0:50);}},
    boot(){if(booted)return booted;const s=sh();if(wt())return booted=Promise.resolve();if(!s){P.banner();return booted=Promise.resolve();}
      watchStorage();s.app.onState(on=>{if(!on)mirrorNow();});
      return booted=s.store.hydrate(NKEY).then(j=>{if(!j)return;let o=null;try{o=JSON.parse(j);}catch(e){}if(!o)return;
          for(const k in o)if(MIRROR(k))Store.set(k,o[k]);S=newPlayer();bootSave();render();})
        .catch(()=>{}).then(()=>{
          s.configure({rewarded:live()?PLAT_IDS.rewarded:PLAT_IDS.testRewarded,banner:live()?PLAT_IDS.banner:PLAT_IDS.testBanner,
            rcKey:PLAT_IDS.rcKey,products:SHOP_SKUS(),nonConsumables:[SHOP_NOADS.sku]});
          s.ads.onBanner(setBanner);P.banner();
          if(s.iap.available()){s.iap.owned().then(ids=>{if(ids.includes(SHOP_NOADS.sku)&&!noAds())grantNoAds();}).catch(()=>{});
            s.iap.getProducts(SHOP_SKUS()).then(()=>{if(UI().menu==='gear')render();}).catch(()=>{});}
          mirror();}).finally(()=>s.ready());},
    async ad(){if(busy||!P.adsOn())return false;busy=true;try{const s=sh();if(!s)return await sim('Rewarded ad');
        hush(true);try{const r=await s.ads.showRewarded();if(r&&r.reason==='nofill')platToast('No ad available right now. Try again in a minute.');return!!(r&&r.rewarded);}finally{hush(false);}}
      catch(e){return false;}finally{busy=false;}},
    async buy(sku){if(busy||!P.iapOn())return false;busy=true;try{const s=sh();if(!s)return await sim('Buy '+sku);
        const r=await s.iap.purchase(sku);if(r&&!r.ok&&!r.cancelled)platToast('Purchase failed · '+String(r.error||'try again later').slice(0,80));return!!(r&&r.ok);}
      catch(e){return false;}finally{busy=false;}},
    async restore(){const s=sh();if(s)return s.iap.available()?await s.iap.restore():[];return dev()&&await sim('Restore purchases')?[SHOP_NOADS.sku]:[];}};
  return P;})();
// hoisted so menu code can ask before Plat's const is initialized (render() runs once before the PLATFORM section loads)
function storeOn(){try{return Plat.iapOn();}catch(e){return false;}}
// gems -> GTP: ~0.5-0.6 GTP per gem. A Pro career pays ~23 GTP (median 19) and ~6.6 gems (600 simulated careers), so the
// $1.99 pack (40 gems) buys about one career's worth of GTP, and a full set of perks (~370 GTP) costs ~600+ gems.
const GEM_TRADES=[[20,10],[50,28],[100,60]];
function tradeGems(i){const t=GEM_TRADES[i];if(!t||gems()<t[0])return;addGems(-t[0]);setGtp(gtpBank()+t[1]);UI().tradeMsg=`+${t[1]} GTP for ${t[0]} gems`;render();}
function gemTradeCard(){const n=gems(),u=UI();
  return`<div class="card"><div class="sh">${icon('gem')} <span class="grow">Trade gems for GTP</span><b class="gold">${n} gems</b></div><div class="sub">Short on GTP for a perk? Swap some gems. GTP is spent on perks for one player; gems buy permanent gear.</div>
  ${GEM_TRADES.map(([g,p],i)=>`<div class="row" style="margin-top:12px;flex-wrap:nowrap"><span class="bub">🪙</span><div class="grow"><b>+${p} GTP</b></div><button class="sm" aria-label="Trade ${g} gems for ${p} GTP" onclick="tradeGems(${i})" ${n<g?'disabled':''}>${g} gems</button></div>`).join('')}
  ${u.tradeMsg?`<div class="ev good" style="margin-top:10px">${esc(u.tradeMsg)}</div>`:''}${storeOn()?`<button class="ghost sm" style="margin-top:12px;width:100%" onclick="openMenu('gems')">${icon('gem')} Get more gems</button>`:''}</div>`;}
function platToast(msg){let t=document.querySelector('.platToast');if(!t){t=document.createElement('div');t.className='platToast';document.body.appendChild(t);}t.textContent=msg;clearTimeout(platToast.t);platToast.t=setTimeout(()=>t.remove(),3200);}
function grantNoAds(){Store.set('bag_noads','1');Plat.banner();}
function shopBuy(sku){if(Plat.busy())return;UI().shopMsg='';const go=Plat.buy(sku);render();go.then(ok=>{if(ok){const p=SHOP_PACKS.find(x=>x.sku===sku);
    if(p){addGems(p.gems);UI().shopMsg=`+${p.gems.toLocaleString()} gems added. Thank you!`;}
    else if(sku===SHOP_NOADS.sku){grantNoAds();UI().shopMsg='Banner ads removed. Thank you!';}}render();});}
function shopRestore(){if(Plat.busy())return;Plat.restore().then(ids=>{const had=ids.includes(SHOP_NOADS.sku);if(had)grantNoAds();UI().shopMsg=had?'Remove Ads restored.':'Nothing to restore on this Apple ID.';render();})
  .catch(e=>{UI().shopMsg=String(e&&e.message||e);render();});}
// the gem shop, under Equipment: only in the iOS app (or ?dev=1)
function shopCard(){if(!Plat.iapOn())return'';const u=UI(),b=Plat.busy()?'disabled':'';
  return`<div class="card"><div class="sh">${icon('gem')} <span class="grow">Gem shop</span><b class="gold">${gems()} gems</b></div><div class="sub">Gems buy permanent Equipment. 100 gems is one Gold item.</div>
  ${SHOP_PACKS.map(p=>`<div class="row" style="margin-top:12px;flex-wrap:nowrap"><span class="bub">${icon('sparkle')}</span><div class="grow"><b>${p.gems.toLocaleString()} gems</b>${p.tag?` <span class="gold">${p.tag}</span>`:''}</div><button class="sm" aria-label="Buy ${p.gems} gems" onclick="shopBuy('${p.sku}')" ${b}>${Plat.price(p.sku,p.usd)}</button></div>`).join('')}
  <div class="row" style="margin-top:12px;flex-wrap:nowrap"><span class="bub">${icon('ban')}</span><div class="grow"><b>Remove Ads</b><div class="sub">No more banner. The double-reward ad stays optional.</div></div>${noAds()?'<b class="gold">Owned</b>':`<button class="sm" aria-label="Buy Remove Ads" onclick="shopBuy('${SHOP_NOADS.sku}')" ${b}>${Plat.price(SHOP_NOADS.sku,SHOP_NOADS.usd)}</button>`}</div>
  ${u.shopMsg?`<div class="ev good" style="margin-top:10px">${esc(u.shopMsg)}</div>`:''}
  <button class="ghost sm" style="margin-top:12px;width:100%" onclick="shopRestore()" ${b}>Restore purchases</button></div>`;}
// end of a career: the gems card, with one rewarded ad that doubles this career's gems and GTP (never Rookie or the Daily Build)
function rewardCard(){if(!S.gemsRun)return'';const can=!S.dbl&&!S.daily&&S.diff!=='rookie'&&Plat.adsOn();
  return`<div class="card"><div class="sh">${icon('sparkle')} <span class="grow">+${S.gemsRun} gems${S.dbl?' <span class="gold">· doubled</span>':''}</span><b class="gold">${gems()} total</b></div><div class="sub">Spend them on permanent Equipment from the menu. Better careers pay more: Role Player 10 · Solid Starter 15 · All-Star 20 · Hall of Famer 35 · THE GOAT 60${S.diff==='hof'?' (×1.5 on Hall of Fame)':''}.</div>
  ${can?`<button class="wide" style="margin-top:12px" onclick="doubleRewards()" ${Plat.busy()?'disabled':''}>${icon('video')} Watch an ad: double to +${S.gemsRun*2} gems${S.gtpRun?` and +${S.gtpRun*2} GTP`:''}</button>`:''}</div>`;}
function doubleRewards(){if(S.dbl||Plat.busy()||S.stage!=='end')return;const run=S;const go=Plat.ad();render();
  go.then(ok=>{if(!ok||run!==S||S.dbl||S.stage!=='end'){render();return;}S.dbl=true;addGems(S.gemsRun);S.gemsRun*=2;
    if(S.gtpRun){setGtp(gtpBank()+S.gtpRun);(S.gtpLog=S.gtpLog||[]).push(['Ad bonus',S.gtpRun]);S.gtpRun*=2;}render();});}
Plat.boot();
