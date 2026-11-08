// Round 12 playtest fixes: good high school seasons never cost rank or stars, the season card shows minutes,
// Max out explains its second tap, and the career recap shows your final season.
const start = "(applyArch(0),S.height=73,S.frame='Balanced',toggleTrait('work'),toggleTrait('dur'),startCareer(),render(),1)";
const hs = "for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);const r0=classRank().rank,s0=stars(),p0=i?S.hs[i-1].st.ppg:0;S.hurt=0;simHS();const h=S.hs[i];const good=h.st.ppg>=p0-.5||h.st.ppg>=20;if(good&&!/injured/.test(h.line)){if(classRank().rank>r0)bad.push('rank '+i);if(stars()<s0)bad.push('stars '+i);}}";
export default [
  ...[51, 52, 53, 58, 59, 60].map(seed => ({ name: `high school: a healthy season as good as the last never drops rank or stars (seed ${seed})`, seed, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { b: `(()=>{const bad=[];${hs}return bad.join();})()` }, expect: ["b===''"] }] })),
  { name: 'story: school years show the class rankings before the summer pick', seed: 61, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { k: "(simHS(),startSeq(),UI().seq.k.join())" }, expect: ["k.indexOf('class')>=0", "k.indexOf('class')<k.indexOf('summer')"] }] },
  { name: 'spending: a + you cannot afford still answers with the cost', seed: 62, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { d: "(S.stage='nba',S.bank=0,openProfile('skills'),render(),[...document.querySelectorAll('button[aria-label^=\"Add a point\"]')].filter(b=>b.disabled).length)" }, expect: ['d===0'] }] },
  { name: 'scoring: elite shooting skills raise your scoring weapons', seed: 63, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { d: "(()=>{const a=topScr();S.attrs.three=99;S.attrs.mid=99;return topScr()-a;})()" }, expect: ['d>=10'] }] },
  { name: 'eras: at least 6 seasons between era shifts', seed: 64, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { e: "(()=>{S.era=ERA_ORDER[0];S.eraLog=[{yr:5,era:S.era}];S.eraShifts=1;const r0=R;R=()=>0;const was=S.era;eraShift(7,[],[]);const a=S.era===was;eraShift(11,[],[]);R=r0;return a&&S.era!==was;})()" }, expect: ['e===true'] }] },
  { name: 'spending: a skill that does not move OVR says why', seed: 65, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { t: "(()=>{S.stage='nba';S.bank=40;const k=Object.keys(IMP).find(x=>IMP[x]==='lo'&&!atCap(x));for(let i=0;i<6;i++){spend(k);if(UI().spMsg&&/OVR stays/.test(UI().spMsg.t))return UI().spMsg.t;}return '';})()" }, expect: ["/OVR stays/.test(t)"] }] },
  { name: 'summer: the result still reaches the season card after a later free agency pick, and a safe pick clears the bounce-back note', seed: 66, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { t: "(()=>{for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);simHS();}chooseSchool(0);simCol();declare();S.stage='nba';let g=0;while(S.nba.length<2&&g++<20){if(S.pend)choose(S.pend.kind==='clutch'?S.pend.best:0);else simNBA();}S.lastBust=true;S.pend={kind:'summer',opts:[safe('Shooting reps','x',()=>'You put up shots')]};choose(0);const lb=S.lastBust;S.pend={kind:'fa',opts:[{label:'x',fn:()=>'You re-signed'}]};choose(0);S.pend=null;S.queue=[];simNBA();return !lb&&(S.nba[S.nba.length-1].notes||[]).some(x=>/Summer: You put up shots/.test(x));})()" }, expect: ['t===true'] }] },
  { name: 'high school: a healthy season as good as the last moves you up', seed: 67, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { b: "(()=>{const bad=[];for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);const r0=classRank().rank,p0=i?S.hs[i-1].st.ppg:0;S.hurt=0;simHS();const h=S.hs[i];if(!/injured/.test(h.line)&&(i?h.st.ppg>=p0-.5:h.st.ppg>=14)&&r0>1&&classRank().rank>=r0)bad.push(i);}return bad.join();})()" }, expect: ["b===''"] }] },
  { name: 'free agency: the contract count is real, and from 34 you can retire instead', seed: 68, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { t: "(()=>{for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);simHS();}chooseSchool(0);simCol();declare();S.stage='nba';let g=0,txt=null;while(!txt&&g++<60&&S.stage==='nba'){if(S.pend){if(S.pend.kind==='fa'){txt=S.pend.text;break;}choose(S.pend.kind==='clutch'?S.pend.best:0);}else{smartSpend();simNBA();}}const zero=/after 0 seasons/.test(txt||'');S.age=35;S.farewell=0;const f=faPend();const r=f.opts.findIndex(o=>/Retire now/.test(o.label));S.pend=f;choose(r);return !!txt&&!zero&&r>=0&&S.stage==='end';})()" }, expect: ['t===true'] }] },
  { name: 'class rankings: rises and drops both draw an arrow', seed: 69, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { a: "(()=>{render();classCard();simHS();S.bank+=30;smartSpend();UI().seq=null;UI().clsOpen=true;render();const u=document.querySelector('.mvu'),d=document.querySelector('.mvd');const c=e=>e?getComputedStyle(e,'::before').content:'none';return [c(u),c(d)].join('|');})()" }, expect: ["!a.split('|').includes('none')"] }] },
  { name: 'high school: a guard gets real rebounds', seed: 54, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: "(()=>{for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);simHS();}return S.hs.map(h=>h.st.rpg).filter(v=>Math.abs(v-1.5)<1e-9).length;})()" },
      expect: ['r<=1'] }] },
  { name: 'pros: the season card shows minutes per game, and the career recap shows the final season', seed: 55, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { m: "(()=>{for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);simHS();}chooseSchool(0);simCol();declare();S.stage='nba';smartSpend();let g=0;while(S.nba.length<2&&g++<20){if(S.pend)choose(S.pend.kind==='clutch'?S.pend.best:0);else simNBA();}const a=/\\d+ MPG/.test(seasonCard(S.nba[0]));S.pend=null;S.retired='Retires';finish();const h=endHTML(),i=h.indexOf('Your final season'),fin=h.slice(i,i+4000);return a&&i>=0&&h.split('Your final season').length===2&&!/pts to spend/.test(fin);})()" },
      expect: ['m===true'] }] },
  { name: 'spending: one tap on Max spends', seed: 56, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { t: "(()=>{S.stage='nba';S.bank=300;const v=S.attrs.pass;armMax('pass');return S.attrs.pass>v&&S.bank<300;})()" },
      expect: ["t===true"] }] },
  { name: 'text: a summer pick shows one points total', seed: 57, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { t: "(()=>{S.stage='nba';S.nba=[{age:22}];S.age=22;S.pend={kind:'summer',opts:[safe('Shooting reps','x',()=>'You put up shots')]};choose(0);return S.lastResult.text;})()" },
      expect: ["!/risk bonus/.test(t)", "/\\+\\d+ pts?$/.test(t)"] }] },
];
