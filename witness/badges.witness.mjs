// Badges (earned from skills, capped by career stage, fade with age), the Player Profile, taking back points before the
// freshman season, and the Whole Career button playing every season through to the career recap.
const app = "document.getElementById('app').textContent";
const start = "(applyArch(0),S.height=78,S.frame='Balanced',toggleTrait('work'),toggleTrait('dur'),startCareer(),render(),1)";
export default [
  { name: 'profile: the header opens it, it shows height and weight, and every tab draws', seed: 21, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, call: ['tap', 'Profile'], expectPage: ["UI().prof==='over'", `${app}.includes('Weight')`, `/\\d{3} lb/.test(${app})`, `${app}.includes("6'6")`] },
    { at: 0.5, call: ['tap', 'Stats'], expectPage: ["UI().prof==='stats'"] },
    { at: 0.55, call: ['tap', 'Traits'], expectPage: [`${app}.includes('Work Ethic')`] },
    { at: 0.6, call: ['tap', 'Badges'], expectPage: [`${app}.includes('Signature badges')`] },
    { at: 0.65, call: ['tap', 'Skills'], expectPage: [`${app}.includes('You project as')`] },
    { at: 0.7, call: ['tap', 'Back to your career'], expectPage: ['!UI().prof', `${app}.includes('Play Freshman Year')`] }] },
  { name: 'profile: Spend on the career screen opens the Skills tab with + buttons', seed: 22, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { x: '(S.bank=10,render(),1)' } },
    { at: 0.45, call: ['tap', 'Spend'], expectPage: ["UI().prof==='skills'"] },
    { at: 0.5, evalAs: { x: "(UI().open='sho',render(),1)" }, expectPage: ["document.querySelectorAll('button[aria-label^=\"Add a point\"]').length>0"] }] },
  { name: 'badges: earned exactly at the line, Silver at most in high school, Platinum only in the NABL', seed: 23, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: "(()=>{S.attrs.three=71;S.bdg={};updBadges('up');const a=S.bdg.rain||0;S.attrs.three=72;updBadges('up');const b=S.bdg.rain;S.attrs.three=99;updBadges('up');const c=S.bdg.rain;S.stage='college';updBadges('up');const d=S.bdg.rain;S.stage='nba';updBadges('up');return [a,b,c,d,S.bdg.rain].join(',');})()" },
      expect: ["r==='0,1,2,3,4'"] }] },
  { name: 'badges: fade one tier at season end when 3 below the line, never from spending', seed: 24, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: "(()=>{S.stage='nba';S.bdg={rain:3};S.attrs.three=85;updBadges('up');const a=S.bdg.rain;updBadges('season');const b=S.bdg.rain;S.attrs.three=83;updBadges('up');const c=S.bdg.rain;updBadges('season');const d=S.bdg.rain;updBadges('season');return [a,b,c,d,S.bdg.rain].join(',');})()" },
      expect: ["r==='3,3,3,2,2'"] }] },
  { name: 'badges: every badge at Platinum stays inside the caps, and each boost line reads', seed: 25, steps: [
    { at: 0.3, evalAs: { r: "(()=>{S.bdg=Object.fromEntries(BADGES.map(b=>[b.id,4]));const f=badgeFx();return Object.keys(BCAP).every(k=>f[k]<=BCAP[k]+1e-9&&f[k]>0)&&BADGES.every(b=>fxText(b.fx,4).length>3);})()" },
      expect: ['r===true'] }] },
  { name: 'badges: you start with the ones you qualify for, and a season awards new ones in the story, with their own window', seed: 26, steps: [
    { at: 0.3, evalAs: { x: "(applyArch(0),S.height=78,S.frame='Balanced',S.attrs.three=75,toggleTrait('work'),toggleTrait('dur'),startCareer(),S.attrs.three=85,render(),1)" } },
    { at: 0.4, call: ['tap', 'Play Freshman Year'], expectPage: ["S.hs[0].bdg.some(c=>c[0]==='rain'&&c[1]===1&&c[2]===2)", "UI().seq.k.includes('badges')"] },
    { at: 0.45, evalAs: { x: "(UI().seq.i=UI().seq.k.indexOf('badges'),render(),1)" }, expectPage: [`document.querySelector('.seqcard').textContent.includes('Rainmaker')`] }] },
  { name: 'points: before the freshman season a point can be taken back, after it cannot', seed: 27, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: "(()=>{S.bank=6;const v=S.attrs.mid,b=S.bank;spend('mid',2);const up=S.attrs.mid===v+2;unspend('mid');unspend('mid');unspend('mid');return up&&S.attrs.mid===v&&S.bank===b;})()" }, expect: ['r===true'] },
    { at: 0.45, evalAs: { x: "(openProfile('skills'),UI().open='sho',S.bank=4,spend('mid'),render(),1)" }, expectPage: ["document.querySelector('button[aria-label^=\"Take a point back\"]')!=null"] },
    { at: 0.5, evalAs: { r: "(()=>{closeProfile();simHS();if(getS().summerPend)chooseSummer(0);const v=getS().attrs.mid;unspend('mid');return getS().attrs.mid===v&&!canUndo('mid');})()" }, expect: ['r===true'] }] },
  { name: 'whole career: plays every season window by window and lands on the career recap', seed: 28, steps: [
    { at: 0.3, evalAs: { r: `(()=>{applyArch(2);for(const k of SUBKEYS)S.attrs[k]=Math.min(BUILD_MAX,S.attrs[k]+14);toggleTrait('work');toggleTrait('dur');startCareer();
        let g=0;while(getS().stage!=='nba'&&g++<40){const s=getS();if(s.summerPend)chooseSummer(0);else if(s.stage==='hs')simHS();else if(s.stage==='offers')chooseSchool(0);else if(s.stage==='college'){if(!s.col.length)simCol();else declare();}else if(s.stage==='draft')startNBA();}
        UI().seq=null;wholeCareer();let windows=0,stops=0;g=0;
        while(getS().stage==='nba'&&g++<400){if(UI().seq){windows++;seqNext();}else if(getS().pend){stops++;act(choose,0);}else break;}
        return JSON.stringify({stage:getS().stage,windows,stops,auto:UI().auto||0,seasons:getS().nba.length});})()` },
      expect: ["JSON.parse(r).stage==='end'", 'JSON.parse(r).windows>=JSON.parse(r).seasons*2', 'JSON.parse(r).auto===0'] }] },
  { name: 'saves: a 21-skill run gets the new skills, keeps its growth room and its rating, and plays on', seed: 29, steps: [
    { at: 0.3, evalAs: { r: `(()=>{applyArch(1);toggleTrait('work');toggleTrait('dur');startCareer();simHS();if(getS().summerPend)chooseSummer(0);
        if(JSON.parse(localStorage.getItem('bag_run_log')).log.length)return 'log not empty';
        const snap=JSON.parse(localStorage.getItem('bag_run'));for(const k of NEW_SK)delete snap.attrs[k];delete snap.bdg;localStorage.setItem('bag_run',JSON.stringify(snap));
        const m=JSON.parse(localStorage.getItem('bag_run_meta'));m.v='2026.11.06';localStorage.setItem('bag_run_meta',JSON.stringify(m));
        const keep=S;S=Object.assign(newPlayer(),snap);const o0=ovr21(),room0=snap.ceiling-o0;S=keep;
        resumeRun();const s=getS(),room1=s.ceiling-ovr(),dOv=Math.abs(OV()-dsp(o0));let g=0;while(getS().stage==='hs'&&g++<10){if(getS().summerPend)chooseSummer(0);else simHS();}
        return JSON.stringify({room0,room1,dOv,has:NEW_SK.every(k=>s.attrs[k]>=40),bdg:!!s.bdg,stage:getS().stage});})()` },
      expect: ['Math.abs(JSON.parse(r).room0-JSON.parse(r).room1)<0.01', 'JSON.parse(r).has', 'JSON.parse(r).dOv<=2', "JSON.parse(r).stage==='offers'"] }] },
  { name: 'spending: a Max can be undone until the next season, and only then', seed: 31, steps: [
    { at: 0.3, evalAs: { x: start } },
    { at: 0.4, evalAs: { r: "(()=>{S.bank=60;const v=S.attrs.oreb,b=S.bank;spend('oreb',99);const spent=S.bank<b&&S.attrs.oreb>v;const bar=undoBar().includes('Undo');undoSpend();return spent&&bar&&S.attrs.oreb===v&&S.bank===b&&!canUndoSpend();})()" }, expect: ['r===true'] },
    { at: 0.5, evalAs: { r: "(()=>{getS().bank=60;spend('oreb',10);simHS();if(getS().summerPend)chooseSummer(0);return !canUndoSpend();})()" }, expect: ['r===true'] }] },
  { name: 'body: − and + buttons move the height one inch inside the limits', seed: 32, steps: [
    { at: 0.3, evalAs: { x: "(goTab('body'),1)" } },
    { at: 0.4, call: ['tap', 'One inch taller'], expectPage: ['S.height===80'] },
    { at: 0.5, evalAs: { x: "(S.height=H_MIN,render(),1)" } },
    { at: 0.6, call: ['tap', 'One inch shorter'], expectPage: ['S.height===H_MIN'] }] },
];
