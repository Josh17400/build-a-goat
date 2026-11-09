// ---------- what an OVR means ----------
const ovrLabel=o=>o<50?'Not NBA level':o<60?'G League':o<70?'End of the bench':o<77?'Rotation player':o<85?'Starter':o<90?'All-Star':o<95?'All-NBA':o<99?'Hall of Fame':'GOAT';

// ---------- draft combine & draft board ----------
function runCombine(){const c={vert:+(26+(es('vert')-40)*.3+gauss()).toFixed(1),sprint:+(3.55-(es('speed')-40)*.008+gauss()*.03).toFixed(2),bench:Math.max(3,Math.round(3+(es('str')-40)*.33+gauss()*1.5)),wing:S.height+ri(0,7)};
  c.adj=+(((es('vert')+es('speed')+es('str'))/3-60)*.09+gauss()*.6).toFixed(1);return c;}
function makeBoard(p){const list=[],from=p>=61?55:Math.max(1,p-7),to=p>=61?60:p-1;
  const F=FIRST.slice(),L=LAST.filter(x=>!(S.name||'').endsWith(x)&&!S.rival?.name.endsWith(x));
  for(let n=from;n<=to;n++)list.push({n,name:(F.length?F:FIRST).splice(ri(0,F.length-1),1)[0]+' '+(L.length?L:LAST).splice(ri(0,L.length-1),1)[0],pos:pick(Object.keys(POS)),school:pick([...SCHOOLS.blue,...SCHOOLS.power,...SCHOOLS.mid,'Overseas (Spain)','Overseas (France)','G League Ignite'])});return list;}

