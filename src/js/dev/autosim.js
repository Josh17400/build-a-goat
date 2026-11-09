// Bulk career sim for balance data (used by Witness; never called in normal play)
function autosim(n,build,college,faMode){SAVE_OFF=true;const save=S,rend=render,keep=['bag_ach','bag_daily','bag_recent','bag_gtp','bag_diff','bag_rec','bag_goats','bag_gems','bag_gear'].map(k=>[k,Store.get(k)]);render=()=>{};const tiers={},rows=[];
  const BUILDS={shooter:{sho:.5,fin:.1,pla:.15,def:.05,reb:0,ath:.1,iq:.1},big:{sho:0,fin:.3,pla:0,def:.3,reb:.3,ath:.1,iq:0},athlete:{sho:.1,fin:.2,pla:.1,def:.15,reb:.05,ath:.4,iq:0}};
  for(let i=0;i<n;i++){S=newPlayer();const aid=pick(ARCH_IDS);S.height=build==='big'?ri(81,85):build==='shooter'?ri(73,79):ARCHS[aid].h+ri(-2,2);S.frame=pick(Object.keys(FRAMES));
    // no positions: a group recipe for the named builds, otherwise a random role's recipe at about its size (or pure random)
    const w=BUILDS[build],wn=build==='random'?null:ARCHS[aid].wn;
    const pk=()=>{if(w){let r=R(),a=0;for(const[k]of ATTRS){a+=w[k];if(r<=a)return pick(SUBS[k])[0];}return'iq';}if(!wn)return pick(SUBKEYS);let r=R();for(const[k,x]of wn){r-=x;if(r<=0)return k;}return wn[0][0];};
    let g=0;while(g++<5000){const k=pk();if(S.attrs[k]>=BUILD_MAX)continue;if(spent()+cost(S.attrs[k])>START_BUDGET)break;S.attrs[k]++;}
    const T=TRAITS.map(t=>t[0]);S.picked=[T.splice(ri(0,T.length-1),1)[0],T.splice(ri(0,T.length-1),1)[0]];startCareer();
    const sp=()=>{let g=0;while(S.bank>0&&g++<300){const k=pk();if(S.bank>=cost(S.attrs[k])&&S.attrs[k]<99)spend(k);else if(S.bank<2)break;}};
    sp();for(let y=0;y<4;y++){simHS();sp();}chooseSchool(0);simCol();sp();
    while(!S.mustDeclare&&(college==='senior'||(college==='smart'&&projRange()[0]>12))&&college!=='oad'){simCol();sp();}
    declare();S.stage='nba';g=0;while(S.stage==='nba'&&g++<80){if(S.pend){const p=S.pend;choose(p.kind==='fa'&&faMode!=='random'?{loyal:0,ring:1,bag:2}[faMode]:ri(0,p.opts.length-1));}else simNBA();}
    const c=career(),sc=goatScore(c),t=tierOf(sc,c)[0];tiers[t]=(tiers[t]||0)+1;
    rows.push({pick:S.pick,peak:c.peak,ppg:c.gp?c.pts/c.gp:0,as:c.cnt['All-Star']||0,rings:c.cnt['Champion']||0,mvp:c.cnt['MVP']||0,seasons:c.seasons,inj:S.nba.filter(s=>s.inj&&s.inj.includes('🚑')).length,sc,starPick:S.pick<=10});}
  S=save;render=rend;SAVE_OFF=false;Store.remove('bag_hof');for(const[k,v]of keep)v==null?Store.remove(k):Store.set(k,v);
  const av=k=>+(rows.reduce((s,r)=>s+r[k],0)/n).toFixed(2),pct=f=>+(rows.filter(f).length/n*100).toFixed(1);
  const lot=rows.filter(r=>r.pick<=10),late=rows.filter(r=>r.pick>30);
  const res={n,build,college,fa:faMode,tiersPct:Object.fromEntries(Object.entries(tiers).map(([k,v])=>[k,+(v/n*100).toFixed(1)])),
    avgPick:av('pick'),undraftedPct:pct(r=>r.pick>=61),avgPeakOvr:av('peak'),avgCareerPPG:av('ppg'),avgAllStar:av('as'),avgRings:av('rings'),mvpPct:pct(r=>r.mvp>0),avgSeasons:av('seasons'),majorInjuryPct:pct(r=>r.inj>0),
    lotteryBustPct:lot.length?+(lot.filter(r=>r.sc<20).length/lot.length*100).toFixed(1):null,secondRoundStarPct:late.length?+(late.filter(r=>r.as>=3).length/late.length*100).toFixed(1):null};console.log("AUTOSIM "+JSON.stringify(res));return "done";}
