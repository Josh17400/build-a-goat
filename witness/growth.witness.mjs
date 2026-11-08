// Round 11 playtest fixes: young players grow every season, 80+ OVR players start, classmates keep moving in college,
// summer stories never contradict your pick, and a skill tap that does nothing says why.
const start = "(applyArch(0),S.height=78,S.frame='Balanced',toggleTrait('work'),toggleTrait('dur'),startCareer(),render(),1)";
export default [
  { name: 'growth: every high school season pays development points, even right at the hidden ceiling', seed: 41, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { n: "(()=>{S.ceiling=ovr()-5;let c=0;for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);simHS();if(S.hs[i].ev.some(e=>/Development: \\+\\d+/.test(e[1])))c++;}return c;})()" },
      expect: ['n===4'] }] },
  { name: 'growth: a pro aged 20 to 25 develops every healthy season', seed: 42, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: "(()=>{for(let i=0;i<4;i++){if(S.summerPend)chooseSummer(0);simHS();}chooseSchool(0);simCol();declare();S.stage='nba';smartSpend();S.ceiling=ovr()-5;let g=0;while(S.stage==='nba'&&S.age<25&&g++<60){if(S.pend)choose(S.pend.kind==='clutch'?S.pend.best:0);else{if(S.bank>0)smartSpend();simNBA();}}return S.nba.map((l,i)=>l.age>=20&&l.age<=25?((l.notes||[]).some(x=>/Development: \\+\\d+/.test(x))||(i&&/🚑/.test(S.nba[i-1].inj||''))?'1':'0'):'').join('');})()" },
      expect: ["r.length>=4", "!r.includes('0')"] }] },
  { name: 'minutes: an 80+ OVR player gets starter minutes on Rookie', seed: 43, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { m: "(()=>{S.diff='rookie';let o=50;while(dsp(o)<80)o+=.5;return Math.round(minBase(o,14.5+(o-55)*1.2));})()" },
      expect: ['m>=30'] }] },
  { name: 'class: college classmates keep moving in the rankings', seed: 44, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { d: "(()=>{S.stage='college';S.col=[{}];const a=classRank().all.map(p=>p.name).join();S.col=[{},{}];const b=classRank().all.map(p=>p.name).join();S.col=[];return a!==b;})()" },
      expect: ['d===true'] }] },
  { name: 'story: summer events step aside when you made a summer pick', seed: 45, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { w: "(()=>{S.summerNote=[1,'AAU'];const w=hsEvents().filter(e=>/video games|AAU circuit|all summer/.test(e.f.toString())).map(e=>e.w);S.summerNote=null;return w.join();})()" },
      expect: ["w==='0,0,0'"] }] },
  { name: 'spending: tapping a maxed or unaffordable skill says why', seed: 46, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { a: "(S.stage='nba',S.bank=900,spend('three',99),spend('three'),UI().spMsg&&UI().spMsg.t)" },
      expect: ["/maxed/.test(a)"] },
    { at: 0.5, evalAs: { b: "(S.bank=0,spend('pass'),UI().spMsg&&UI().spMsg.t)" },
      expect: ["/costs \\d+ pts and you have 0/.test(b)"] }] },
];
