// Tester-requested features: midseason moments, trades, a choice when your game changes, a career timeline,
// highlights, and rivals that come and go.
const start = "(applyArch(0),S.height=78,S.frame='Balanced',toggleTrait('work'),toggleTrait('dur'),startCareer(),render(),1)";
const toPros = "for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);simHS();}chooseSchool(0);simCol();declare();S.stage='nba';smartSpend();";
export default [
  { name: 'midseason: some seasons stop for a call, then the season plays with a Midseason line', seed: 71, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let g=0,saw=0,noted=0;while(S.nba.length<10&&g++<120&&S.stage==='nba'){if(S.pend){const k=S.pend.kind;const n0=S.nba.length;choose(k==='clutch'?S.pend.best:0);if(k==='mid'){saw++;if(S.nba.length===n0+1||S.pend)noted+=(S.nba[S.nba.length-1].notes||[]).some(x=>/Midseason:/.test(x))?1:0;}}else{smartSpend();simNBA();}}return saw+'/'+noted;})()` },
      expect: ["+r.split('/')[0]>=1", "+r.split('/')[1]>=1"] }] },
  { name: 'trades: a trade request lists teams (no re-signing) and moves you', seed: 72, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let g=0;while(S.nba.length<2&&g++<30){if(S.pend)choose(S.pend.kind==='clutch'?S.pend.best:0);else simNBA();}S.pend=null;S.queue=[{trade:1}];const t0=S.team,p=nextQ();S.pend=p;const ok=p.kind==='trade'&&!p.opts.some(o=>/^🤝/.test(o.label))&&/contract comes with you/.test(p.text);choose(0);return ok&&S.team!==t0&&/traded to/.test(S.lastResult.text);})()` },
      expect: ['r===true'] }] },
  { name: 'your game changes: embracing it can unlock potential, staying true keeps your identity', seed: 73, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: "(()=>{S.stage='nba';S.evoPend={from:'sniper',to:'creator'};const c0=S.ceiling,p=evoPend();S.pend=p;S.queue=[];choose(0);const up=S.ceiling-c0;S.evoPend={from:'creator',to:'sniper'};S.pend=evoPend();choose(1);return up===2&&S.idLock==='Shot Creator'&&archName()==='Shot Creator';})()" },
      expect: ['r===true'] }] },
  { name: 'timeline: the profile shows every season on one page', seed: 74, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let g=0;while(S.nba.length<2&&g++<30){if(S.pend)choose(S.pend.kind==='clutch'?S.pend.best:0);else simNBA();}UI().seq=null;openProfile('time');const h=document.getElementById('app').textContent;return /Career timeline/.test(h)&&/HS Freshman/.test(h);})()` },
      expect: ['r===true'] }] },
  { name: 'rivals: when yours retires, the story says so and a new one can rise', seed: 75, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let g=0;while(S.nba.length<2&&g++<30){if(S.pend)choose(S.pend.kind==='clutch'?S.pend.best:0);else simNBA();}const old=S.rival;old.retired=true;S.pend=null;S.queue=[];g=0;const n0=S.nba.length;while(S.nba.length===n0&&g++<10){if(S.pend)choose(S.pend.kind==='clutch'?S.pend.best:0);else simNBA();}const h=(S.nba[S.nba.length-1].hist||[]).join('|');return /retire|hangs it up/.test(h)&&(S.oldRivals||[]).length===1;})()` },
      expect: ['r===true'] }] },
];
