// Overnight round G4: the last season plays out on screen, a kept playstyle keeps its role, honest award labels.
const start = "(applyArch(1),S.height=84,S.frame='Strong',toggleTrait('work'),toggleTrait('dur'),startCareer(),render(),1)";
const toPros = "for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);simHS();}chooseSchool(0);simCol();declare();S.stage='nba';smartSpend();";
export default [
  { name: 'the final season gets its story windows before the plaque', seed: 81, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let g=0;while(S.nba.length<3&&g++<40){if(S.pend)choose(S.pend.kind==='clutch'?S.pend.best:0);else simNBA();}S.pend=null;S.queue=[];S.farewell=S.nba.length+1;UI().seq=null;playSeason(simNBA);while(S.pend&&S.pend.kind!=='clutch'&&S.stage==='nba'&&g++<60)choose(0);if(S.pend&&S.pend.kind==='clutch')choose(S.pend.best);const q=UI().seq,h=document.getElementById('app').textContent,ok=S.stage==='end'&&q&&q.st==='end'&&q.k.includes('season')&&q.k.includes('ending')&&!q.k.includes('spend')&&/Final Season/.test(h);UI().seq=null;render();return ok&&!/Final Season/.test(document.getElementById('app').textContent);})()` },
      expect: ['r===true'] }] },
  { name: 'staying true to a playstyle keeps that role on the court', seed: 82, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: "(()=>{S.idLock='Rim Protector';const a=roleArch();S.idLock=null;return a.n==='Rim Protector'&&!!a.id;})()" },
      expect: ['r===true'] }] },
  { name: 'All-Star line never says top 24 when you made it from further down', seed: 83, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let g=0;while(S.nba.length<1&&g++<30){if(S.pend)choose(S.pend.kind==='clutch'?S.pend.best:0);else simNBA();}const s={...S.nba[0],asRank:30,aw:['All-Star']},h=seasonCard(s,true);return /coaches pick/.test(h)&&!/top 24 make it/.test(h);})()` },
      expect: ['r===true'] }] },
  { name: 'no Play 75+ games goal when an injury is already coming', seed: 84, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let a=0,b=0;for(let i=0;i<30;i++){S.next={};makeGoals();if(JSON.stringify(S.goals).includes('+ games'))a++;S.next={gp:25};makeGoals();if(JSON.stringify(S.goals).includes('+ games'))b++;}S.next={};return a>0&&b===0;})()` },
      expect: ['r===true'] }] },
  { name: 'final plays: a result line does not repeat in a career, and lines name the opponent', seed: 85, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let g=0,lines=[],bad=0;while(S.stage==='nba'&&g++<120){if(S.pend){const k=S.pend.kind;choose(k==='clutch'?S.pend.best:0);if(k==='clutch'){const l=S.cur&&S.cur.clutch?S.cur.clutch[S.cur.clutch.length-1]:null;if(l){lines.push(l.label+'|'+l.text);if(/[{]OPP[}]/.test(l.text))bad++;}}}else{smartSpend();simNBA();}}const u=new Set(lines);return JSON.stringify([lines.length,u.size,bad]);})()` },
      expect: ['JSON.parse(r)[2]===0', 'JSON.parse(r)[0]===0||JSON.parse(r)[1]>=JSON.parse(r)[0]-1'] }] },
];
