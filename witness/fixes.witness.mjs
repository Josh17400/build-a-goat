// Round 10 playtest fixes: the college summer shows its result before the season, maxed skills stop taking points,
// Done closes the spend panel, and class-rank moves compare with where you stood right before the season.
const app = "document.getElementById('app').textContent";
const start = "(applyArch(0),S.height=78,S.frame='Balanced',toggleTrait('work'),toggleTrait('dur'),startCareer(),render(),1)";
const toCollege = "(()=>{for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);simHS();}chooseSchool(0);simCol();render();return S.stage;})()";
export default [
  { name: 'college summer: picking shows the result and a Play button, the season waits for you', seed: 31, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { st: toCollege }, expect: ["st==='college'"] },
    { at: 0.5, evalAs: { x: '(UI().seq=null,returnSchool(),chooseSummer(0),render(),S.col.length)' },
      expect: ['x===1'], expectPage: ['S.colNext===true', '!!S.lastResult', `${app}.includes('Play Sophomore Season')`] },
    { at: 0.6, evalAs: { y: '(simCol(),S.col.length)' }, expect: ['y===2'], expectPage: ['!S.colNext'] }] },
  { name: 'maxed skill: spending stops at 99 on screen and the row says Maxed', seed: 32, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: "(()=>{S.stage='nba';S.bank=900;spend('three',99);const v=S.attrs.three;S.attrs.three=v-1;const below=es('three')<99;S.attrs.three=v;return [Math.round(es('three')),atCap('three'),below].join(',');})()" },
      expect: ["r==='99,true,true'"] },
    { at: 0.5, evalAs: { x: "(S.stage='hs',UI().prof='skills',UI().open='sho',render(),1)" },
      expectPage: [`${app}.includes('Maxed')`] }] },
  { name: 'Done after spending every point closes the panel', seed: 33, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { x: "(S.hs.push({line:'1.0 PPG',ev:[],acc:[]}),S.bank=1,UI().prof=null,UI().seq=null,render(),spend(SUBKEYS.reduce((m,k)=>S.attrs[k]<S.attrs[m]?k:m)),render(),S.bank)" },
      expect: ['x===0'], expectPage: [`${app}.includes('All bonus points spent')`] },
    { at: 0.5, call: ['tap', 'Done'], expectPage: [`!${app}.includes('All bonus points spent')`] }] },
  { name: 'class rankings: MOVE compares with your rank right before the season, points spent included', seed: 34, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r0: '(UI().seq=null,render(),classRank().rank)' } },
    { at: 0.5, evalAs: { p: '(S.summerPend&&chooseSummer(0),simHS(),UI().seq=null,render(),S.clsStart.me)' }, expect: ['p===r0'] },
    { at: 0.6, evalAs: { q: '(S.bank=200,smartSpend(),UI().seq=null,render(),S.clsStart.me)' }, expect: ['q===r0'] }] },
];
