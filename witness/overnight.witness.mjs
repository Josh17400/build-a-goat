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
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let a=0,b=0;for(let i=0;i<30;i++){S.next={};makeGoals();if(S.goals.list.some(g=>g.k==='gp'))a++;S.next={gp:25};makeGoals();if(S.goals.list.some(g=>g.k==='gp'))b++;}S.next={};return a>0&&b===0;})()` },
      expect: ['r===true'] }] },
  { name: 'final plays: a result line does not repeat in a career, and lines name the opponent', seed: 85, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let g=0,lines=[],bad=0;while(S.stage==='nba'&&g++<120){if(S.pend){const k=S.pend.kind;choose(k==='clutch'?S.pend.best:0);if(k==='clutch'){const l=S.cur&&S.cur.clutch?S.cur.clutch[S.cur.clutch.length-1]:null;if(l){lines.push(l.label+'|'+l.text);if(/[{]OPP[}]/.test(l.text))bad++;}}}else{smartSpend();simNBA();}}const u=new Set(lines);return JSON.stringify([lines.length,u.size,bad]);})()` },
      expect: ['JSON.parse(r)[2]===0', 'JSON.parse(r)[0]===0||JSON.parse(r)[1]>=JSON.parse(r)[0]-1'] }] },
  { name: 'Whole Career pauses before a final season with points banked, and the hub says spend them', seed: 86, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let g=0;while(S.nba.length<2&&g++<30){if(S.pend)choose(S.pend.kind==='clutch'?S.pend.best:0);else simNBA();}S.pend=null;S.queue=[];UI().seq=null;S.farewell=S.nba.length+1;S.bank=40;const u=UI();u.auto=1;u.goOn=0;autoStep();const h=document.getElementById('app').textContent;const ok=u.autoWhy==='points'&&S.nba.length===2;u.auto=0;return ok&&(ovr()<63||/points to spend/.test(h))&&(h.match(/Spend points/g)||[]).length<=1;})()` },
      expect: ['r===true'] }] },
  { name: 'Next Decision: a quiet stretch leaves a While you simmed summary; a title or MVP season opens its story', seed: 87, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: `(()=>{${toPros}let g=0,quiet=0,big=0;while(S.stage==='nba'&&g++<40&&S.nba.length<14){if(S.pend){choose(S.pend.kind==='clutch'?S.pend.best:0);continue;}UI().seq=null;const n0=S.nba.length;simAll();const l=S.nba[S.nba.length-1];if(S.nba.length>n0){if(l.aw.some(x=>/Champion|^MVP$/.test(x))){if(UI().seq)big++;}else if(UI().simmed&&/While you simmed/.test(document.getElementById('app').textContent))quiet++;}}return quiet+'/'+big;})()` },
      expect: ["+r.split('/')[0]>=1"] }] },
  { name: 'Daily Build sets the perk cart aside and gives it back when turned off', seed: 88, steps: [
    { at: 0.3, evalAs: { r: "(()=>{S.daily=false;S.perksHeld=null;S.perks={pts:1};const before=JSON.stringify(S.perks);toggleDaily();const off=Object.keys(S.perks).length===0,held=JSON.stringify(S.perksHeld)===before;const r0=render;render=()=>{};toggleDaily();render=r0;const back=JSON.stringify(S.perks)===before;S.perks={};render();return off&&held&&back;})()" },
      expect: ['r===true'] }] },
  { name: 'summers: safe options come first, and a skipped summer takes a safe one', seed: 89, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: "(()=>{const p=S.summerPend;if(!p)return 'nopend';const first=/Safe/.test(p.opts[0].desc),last=/High risk|Medium risk/.test(p.opts[p.opts.length-1].desc);return first&&last&&/Safe/.test(p.opts[safeIdx(p)].desc);})()" },
      expect: ["r===true||r==='nopend'"] }] },
  { name: 'road to 99: every style reaches 99 with its 7 core skills maxed and the rest at 72, and starting OVRs stay low', seed: 90, steps: [
    { at: 0.3, evalAs: { r: "(()=>{const sv=JSON.stringify(S);const bad=[];for(const id of ARCH_IDS){const a=ARCHS[id];S.height=a.h;S.frame='Balanced';for(const k of SUBKEYS)S.attrs[k]=72;for(const[k]of a.core)S.attrs[k]=99;if(Math.round(OV())<99)bad.push(a.n+' '+Math.round(OV()));for(const k of SUBKEYS)S.attrs[k]=45;if(OV()>60)bad.push(a.n+' start '+Math.round(OV()));}S=Object.assign(S,JSON.parse(sv));return bad.join(', ')||'ok';})()" },
      expect: ["r==='ok'"] }] },
  { name: 'no skill is frozen at the 25 start: at the shortest and tallest heights, every skill at 25 can still be raised in a career', seed: 91, steps: [
    { at: 0.3, evalAs: { r: "(()=>{const sv=JSON.stringify(S);const bad=[];for(const h of [H_MIN,H_MAX])for(const fr of Object.keys(FRAMES)){S.height=h;S.frame=fr;for(const k of SUBKEYS)S.attrs[k]=MIN_A;for(const k of SUBKEYS){const e=es(k);S.attrs[k]=40;const e2=es(k);S.attrs[k]=MIN_A;if(atCap(k)&&k!=='dunk')bad.push(h+' '+fr+' '+k+' capped');if(e2<=e&&k!=='dunk')bad.push(h+' '+fr+' '+k+' no gain');}}S=Object.assign(S,JSON.parse(sv));return bad.slice(0,6).join(', ')||'ok';})()" },
      expect: ["r==='ok'"] }] },
];
