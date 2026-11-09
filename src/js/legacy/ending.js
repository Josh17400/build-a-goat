// ---------- the ending: Hall of Fame, jerseys in the rafters, the GOAT debate ----------
function jerseys(){const by={};for(const x of S.nba){const b=by[x.team]=by[x.team]||{yrs:0,pts:0,as:0,rings:0};b.yrs++;b.pts+=x.ppg*x.gp;if(x.aw.includes('All-Star'))b.as++;if(x.aw.includes('Champion'))b.rings++;}
  return Object.entries(by).filter(([,b])=>(b.yrs>=5&&(b.as>=3||(b.rings>=1&&(b.as>=1||b.pts>=9000))||b.pts>=14000))||(b.yrs>=3&&b.rings>=2)||b.as>=6).map(([team,b])=>({team,...b}));}

