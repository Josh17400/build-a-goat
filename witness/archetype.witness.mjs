// No positions: you pick size and frame, build skills, and OVR rates you at the role (archetype) you fit best.
const setAttrs = (o) => `(()=>{for(const k of SUBKEYS)S.attrs[k]=40;Object.assign(S.attrs,${JSON.stringify(o)});render();return 1;})()`;
const WIFE = { three: 99, mid: 99, close: 99, ft: 85, layup: 85, dunk: 85, speed: 90, vert: 90, stam: 75, iq: 65, cons: 70, pass: 45, handle: 45, str: 40, post: 45, perD: 55, intD: 50, stl: 50, blk: 55, oreb: 55, dreb: 60 };
const RIM = { three: 40, mid: 45, close: 70, ft: 55, layup: 65, dunk: 85, speed: 55, vert: 80, stam: 80, iq: 70, cons: 70, pass: 45, handle: 40, str: 95, post: 60, perD: 50, intD: 99, stl: 50, blk: 99, oreb: 90, dreb: 99 };
const app = "document.getElementById('app').textContent";
export default [
  { name: 'archetype: the Body tab has no position picker, one height slider from 5\'10" to 7\'3"', seed: 3, steps: [
    { at: 0.3, evalAs: { x: "(goTab('body'),1)" }, expectPage: [`${app}.includes('No positions to pick')`, `![...document.querySelectorAll('button')].some(b=>/^(PG|SG|SF|PF|C)$/.test(b.textContent.trim()))`,
      "document.querySelector('input[type=range]').min==='70'", "document.querySelector('input[type=range]').max==='87'"] }] },
  { name: 'archetype: the projection card names your role and follows your skills', seed: 3, steps: [
    { at: 0.3, evalAs: { x: "(S.height=82,S.frame='Lean',goTab('skills'),UI().skillsPicked=1,render(),1)" }, expectPage: [`${app}.includes('You project as')`] },
    { at: 0.4, evalAs: { x: setAttrs({ three: 80, mid: 75, close: 70, cons: 60 }) }, expectPage: ["archetype().id==='stretch'", `${app}.includes('Stretch Big')`, "S.pos==='PF'"] },
    { at: 0.5, evalAs: { x: setAttrs({ blk: 85, intD: 85, dreb: 75, str: 70 }) }, expectPage: ["['rim','glass'].includes(archetype().id)", `${app}.includes(archetype().name)`] }] },
  { name: 'archetype: a 6\'10" lean sniper with no handle or strength rates as a starter (old rating 69)', seed: 3, steps: [
    { at: 0.3, evalAs: { x: `(S.height=82,S.frame='Lean',${setAttrs(WIFE)})`, o: 'OV()', old: "dsp(legacyOvr('PF'))" },
      expectPage: ["archetype().id==='stretch'", 'OV()>=78', "OV()-dsp(legacyOvr('PF'))>=8"] }] },
  { name: 'archetype: exploits gain nothing (one skill maxed, a 6\'1" "rim protector")', seed: 3, steps: [
    { at: 0.3, evalAs: { x: `(S.height=78,S.frame='Balanced',${setAttrs({ three: 99 })})` }, expectPage: ['OV()<=46'] },
    { at: 0.4, evalAs: { x: `(S.height=84,S.frame='Strong',${setAttrs(RIM)},S.__big=OV(),1)` } },
    { at: 0.5, evalAs: { x: '(S.height=73,render(),1)' }, expectPage: ['OV()<=S.__big-15', "archetype().id!=='rim'"] }] },
  { name: 'archetype: premades fill skills only and every slot reads as its own role', seed: 5, steps: [
    { at: 0.3, evalAs: { r: "JSON.stringify(ARCH.map((a,i)=>{S.height=a[2];S.frame=a[3];applyArch(i);return archetype().id;}))" },
      expect: ["JSON.parse(r)[0]==='sniper'", "['rim','glass'].includes(JSON.parse(r)[1])", "['twoway','threeD','lock'].includes(JSON.parse(r)[2])", "JSON.parse(r)[3]==='floor'", "JSON.parse(r)[4]==='slasher'", "JSON.parse(r)[5]==='post'"] }] },
  { name: 'archetype: rating and name are pure (same skills give the same answer, no dice used)', seed: 6, steps: [
    { at: 0.3, evalAs: { r: "(()=>{applyArch(2);const r0=R.get?R.get():null,a=JSON.stringify([ovr(),archetype(),listedPos()]);for(let i=0;i<5;i++)render();const b=JSON.stringify([ovr(),archetype(),listedPos()]);return a===b&&(R.get?R.get()===r0:true);})()" }, expect: ['r===true'] }] },
  { name: 'archetype: a run saved before archetypes converts, keeps its growth room and plays on', seed: 9, steps: [
    { at: 0.3, evalAs: { r: `(()=>{applyArch(0);toggleTrait('work');toggleTrait('dur');startCareer();simHS();if(getS().summerPend)chooseSummer(0);
        // turn the fresh save into an old one: a chosen position and the old version stamp
        if(JSON.parse(localStorage.getItem('bag_run_log')).log.length)return 'log not empty';const snap=JSON.parse(localStorage.getItem('bag_run'));snap.pos='SG';delete snap.archId;localStorage.setItem('bag_run',JSON.stringify(snap));
        const m=JSON.parse(localStorage.getItem('bag_run_meta'));m.v='2026.11.05';localStorage.setItem('bag_run_meta',JSON.stringify(m));
        const room0=snap.ceiling-(()=>{const keep=S;S=Object.assign(newPlayer(),snap);const o=legacyOvr('SG');S=keep;return o;})();
        resumeRun();const room1=getS().ceiling-ovr();let g=0;while(getS().stage==='hs'&&g++<10){if(getS().summerPend)chooseSummer(0);else simHS();}
        return JSON.stringify({room0,room1,arch:getS().archId,stage:getS().stage});})()` },
      expect: ['Math.abs(JSON.parse(r).room0-JSON.parse(r).room1)<0.01', '!!JSON.parse(r).arch', "JSON.parse(r).stage==='offers'"] }] },
];
