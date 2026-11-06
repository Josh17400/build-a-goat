// Late-career systems: clutch moments, season goals, history, and saving in the middle of a playoff moment.
const toClutch = `(()=>{const G=getS;let g=0;while(G().stage==='nba'&&g++<400){const p=G().pend;if(p&&p.kind==='clutch')break;if(p)choose(p.kind==='retire'?1:0);else simNBA();}
  UI().seq=null;render();return G().pend&&G().pend.kind==='clutch'?'clutch':'none:'+G().stage+':'+G().nba.length;})()`;
export default [
  { name: 'clutch: the final play takes over the screen, your call decides the series, and the story opens on it', seed: 8, scene: 'nba', steps: [
    { at: 0.4, evalAs: { r: toClutch }, expect: ["r==='clutch'"],
      expectPage: ["document.querySelector('.clutch .board')!=null", "document.querySelectorAll('#app .opt').length===3", "getS().cur!=null", "!document.querySelector('.dock')"], shot: 'late-clutch.png' },
    { at: 0.5, evalAs: { x: "(document.querySelectorAll('#app .opt')[getS().pend.best].click(),1)" } },
    { at: 0.6, evalAs: { x: "(()=>{const G=getS;let g=0;while(G().pend&&G().pend.kind==='clutch'&&g++<5)choose(G().pend.best);render();return 1;})()" },
      expectPage: ["getS().cur==null", "getS().nba[getS().nba.length-1].clutch.length>=1", "getS().nba[getS().nba.length-1].path.some(x=>/final play|game-winner|stop won/.test(x))",
        "!UI().seq||UI().seq.k[0]==='clutch'"], shot: 'late-after.png' }] },
  { name: 'goals: three goals each NBA season, paid out after the season, shown in the story', seed: 6, scene: 'draft', steps: [
    { at: 0.3, call: ['tap', 'Start NABL Career'] },
    { at: 0.35, expectPage: ["getS().goals&&getS().goals.yr===1&&getS().goals.list.length===3", "document.getElementById('app').textContent.includes('Season 1 goals')"], shot: 'late-goals.png' },
    { at: 0.4, call: ['tap', 'Sim Season 1'] },
    { at: 0.45, evalAs: { x: "(()=>{const G=getS;let g=0;while(G().pend&&G().pend.kind==='clutch'&&g++<5)choose(G().pend.best);render();return 1;})()" },
      expectPage: ["getS().nba[0].goals.length===3", "getS().nba[0].goals.every(g=>typeof g.ok==='boolean')", "UI().seq&&UI().seq.k.includes('goals')", "getS().goals.yr===2"] }] },
  { name: 'save: reloading during a clutch moment brings back the same moment and the same result', seed: 8, scene: 'nba', steps: [
    { at: 0.4, evalAs: { r: toClutch }, expect: ["r==='clutch'"] },
    { at: 0.5, evalAs: { r: `(()=>{const G=getS,d=()=>JSON.stringify([G().pend.title,G().pend.text,G().pend.opts.map(o=>o.label+o.desc),G().nba.length,R.get()]);
        const a=d();resumeRun();const b=d();choose(1);const r1=JSON.stringify([G().nba.length,G().nba.at(-1)&&G().nba.at(-1).path,G().bank]);
        resumeRun();const r2=JSON.stringify([G().nba.length,G().nba.at(-1)&&G().nba.at(-1).path,G().bank]);return a===b&&r1===r2?'same':'diff';})()` }, expect: ["r==='same'"] }] },
];
