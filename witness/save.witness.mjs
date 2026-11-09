// A saved run must come back exactly as it was: same stats, same open decision, same dice.
const drive = `(()=>{applyArch(1);toggleTrait('work');toggleTrait('dur');startCareer();const rnd=n=>Math.floor(Math.random()*n);
  const dg=()=>JSON.stringify({st:getS().stage,age:getS().age,bank:getS().bank,attrs:getS().attrs,hype:getS().hype,hs:getS().hs,col:getS().col,
    nba:getS().nba.map(s=>[s.ppg,s.rpg,s.wins,s.aw,s.team,s.notes]),pend:getS().pend&&[getS().pend.title,getS().pend.opts.map(o=>o.label+'|'+o.desc)],
    sp:getS().summerPend&&[getS().summerPend.title,getS().summerPend.opts.map(o=>o.label+'|'+o.desc)],q:(getS().queue||[]).map(x=>x.title),
    off:getS().stage==='offers'?getS().offers.map(o=>o.name):null,r:R.get(),L:getS().L&&getS().L.P.length,
    rv:getS().rival&&[getS().rival.name,Math.round(getS().rival.pts),getS().rival===getS().L.P.find(p=>p.id===getS().rival.id)]});
  const bad=[];let checks=0;
  for(let i=0;i<160&&getS().stage!=='end';i++){const st=getS().stage;
    if(st==='hs'){if(getS().summerPend)chooseSummer(rnd(getS().summerPend.opts.length));else if(getS().bank>0&&rnd(3)===0)spend(SUBKEYS[rnd(SUBKEYS.length)],rnd(3)+1);else if(getS().bank>40&&rnd(2)===0)smartSpend();else simHS();}
    else if(st==='offers')chooseSchool(rnd(getS().offers.length));
    else if(st==='college'){if(getS().summerPend)chooseSummer(rnd(getS().summerPend.opts.length));else if(!getS().col.length)simCol();else if(getS().mustDeclare||rnd(5)<2)declare();else returnSchool();}
    else if(st==='draft')startNBA();
    else if(st==='nba'){if(getS().pend)choose(rnd(getS().pend.opts.length));else if(getS().bank>0&&rnd(3)>0)smartSpend();else simNBA();}
    if(getS().stage==='end')break;
    if(i%2===0||getS().pend||getS().summerPend){const a=dg();resumeRun();const b=dg();checks++;if(a!==b){bad.push(i+':'+st);if(bad.length>3)break;}}}
  return JSON.stringify({checks,bad,stage:getS().stage,seasons:getS().nba.length});})()`;
export default [
  { name: 'save: every reload rebuilds the run exactly (stats, open decisions, dice)', seed: 17, steps: [ // played on Rookie so the career runs long whatever the balance (Pro seeds kept getting short careers)
    { at: 0.3, evalAs: { res: drive.replace('applyArch(1)',"setDiff('rookie');applyArch(1)") }, expect: ['JSON.parse(res).bad.length===0', 'JSON.parse(res).checks>20', 'JSON.parse(res).seasons>=3'] }] },
  { name: 'save: a second career with a different seed also rebuilds exactly', seed: 29, steps: [
    { at: 0.3, evalAs: { res: drive }, expect: ['JSON.parse(res).bad.length===0', 'JSON.parse(res).checks>8'] }] },
  { name: 'save: the setup screen offers Continue, and it restores the run', seed: 3, steps: [
    { at: 0.3, evalAs: { x: "(applyArch(0),toggleTrait('work'),toggleTrait('dur'),startCareer(),simHS(),1)" } },
    { at: 0.4, evalAs: { x: '(quitRun(),1)' }, expectPage: ["getS().stage==='build'", "document.getElementById('app').textContent.includes('Continue run')"] },
    { at: 0.5, call: ['tap', 'Continue run'] },
    { at: 0.55, expectPage: ["getS().stage==='hs'", 'getS().hs.length===1', '!!getS().summerPend'] },
    { at: 0.6, evalAs: { x: "(quitRun(),toggleTrait('work'),toggleTrait('dur'),goTab('traits'),1)" } },
    { at: 0.65, call: ['tap', 'Start High School'] },
    { at: 0.7, expectPage: ["getS().stage==='build'", "document.getElementById('app').textContent.includes('replaces your saved run')"] },
    { at: 0.75, call: ['tap', 'Keep my run'] },
    { at: 0.8, expectPage: ["getS().stage==='build'", 'hasRun()'] }] },
];
