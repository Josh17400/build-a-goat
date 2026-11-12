// ---------- season goals: three targets every NBA season, from likely to stretch ----------
const goalReward=g=>({pts:Math.max(1,Math.round([0,2,4,7][g.tier]*(diff().nbaPts??1))),gtp:Math.round([0,1,2,3][g.tier]*(diff().mult||0)*EARN)});
function makeGoals(){if(S.stage!=='nba')return;const n=S.nba.length,last=S.nba[n-1],o=ovr(),a=S.age,c=career(),z=S.L?S.L.z[S.team]||0:0,rv=S.rival&&!S.rival.retired&&S.rival.team!==S.team?S.rival:null,G=[];
  const lp=last?last.ppg:Math.max(5,8+(o-55)*.45),lw=last?last.wins:Math.round(41+z*11),add=(k,v,tier,text)=>G.push({k,v,tier,text}),P=x=>Math.max(4,Math.round(x));
  add('ppg',P(lp-1.5),1,`Average ${P(lp-1.5)}+ points`);add('ppg',P(lp+1.5),2,`Average ${P(lp+1.5)}+ points`);add('ppg',P(lp+4.5),3,`Average ${P(lp+4.5)}+ points`);
  if(lw>=47)add('round',1,lw>=55?1:2,'Win a playoff series');else if(lw>=36)add('playoffs',1,2,'Make the playoffs');else add('wins',Math.round(lw+6),2,`Win ${Math.round(lw+6)}+ games`);
  if(lw>=50)add('round',3,3,'Reach the NBA Finals');if(lw>=57)add('champ',1,3,'Win the title');
  if(o>=74)add('aw','All-Star',last&&last.aw.includes('All-Star')?1:3,'Make the All-Star team');
  if(o>=80)add('allnba',1,2,'Make an All-NBA team');
  if(n===0&&o>=62)add('roy',1,o>=70?2:3,'Win Rookie of the Year');
  if(last&&last.mvpRank&&last.mvpRank<=6)add('mvptop',3,3,'Finish top 3 in MVP voting');
  if(last&&last.scRank&&last.scRank<=3)add('scoring',1,3,'Win the scoring title');
  const hg=a>=31||S.injuryProne?70:75;if(!(S.next&&S.next.gp>0))add('gp',hg,a>=34?2:1,`Play ${hg}+ games`);
  if(['PF','C'].includes(S.pos)&&last&&last.rpg>=6)add('rpg',P(last.rpg+1.5),2,`Average ${P(last.rpg+1.5)}+ rebounds`);
  if(['PG','SG'].includes(S.pos)&&last&&last.apg>=4)add('apg',P(last.apg+1.5),2,`Average ${P(last.apg+1.5)}+ assists`);
  if(es('three')>=74)add('tp',.4,2,'Shoot 40% from three');
  if(rv)add('rvppg',0,2,`Outscore your rival ${rv.name}`);
  for(const m of[10000,15000,20000,25000,30000,35000,40000])if(c.pts<m&&c.pts+lp*72>=m){add('pts',m,c.pts+lp*60>=m?1:2,`Reach ${m.toLocaleString()} career points`);break;}
  const out=[],pickT=tr=>{const cs=G.filter(g=>g.tier===tr&&!out.some(x=>x.k===g.k));return cs.length?pick(cs):null;};
  for(const tr of[1,2,3]){const g=pickT(tr)||pickT(2)||pickT(1);if(g)out.push(g);}
  S.goals={yr:n+1,list:out};}
// how each kind of season goal is judged against the season you just played. To add a kind of goal:
// give it a check here and offer it in makeGoals.
const GOAL_OK={
  ppg:(g,st)=>st.ppg>=g.v,
  rpg:(g,st)=>st.rpg>=g.v,
  apg:(g,st)=>st.apg>=g.v,
  tp:(g,st)=>st.tp>=g.v&&st.gp>=50,
  gp:(g,st)=>st.gp>=g.v,
  wins:(g,st)=>st.wins>=g.v,
  playoffs:(g,st)=>st.rounds>=0,
  round:(g,st)=>st.rounds>=g.v,
  champ:(g,st)=>st.champ,
  aw:(g,st)=>st.aw.includes(g.v),
  allnba:(g,st)=>st.aw.some(x=>x.startsWith('All-NBA')),
  mvptop:(g,st)=>st.mvpRank!=null&&st.mvpRank<=g.v,
  scoring:(g,st)=>st.aw.includes('Scoring Title'),
  roy:(g,st)=>st.aw.includes('ROY'),
  rvppg:(g,st)=>st.rvppg!=null&&st.ppg>st.rvppg,
  pts:(g,st)=>st.ptsAfter>=g.v,
};
function goalOk(g,st){const ok=GOAL_OK[g.k];return ok?ok(g,st):false;}

