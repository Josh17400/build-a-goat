// ---------- your rival: head-to-head, playoff meetings and the race for legacy ----------
function rivalryCard(){const rv=S.rival;if(!rv||!S.nba.length)return'';const c=career(),g=x=>c.cnt[x]||0,h=S.rvH2H||{w:0,l:0,pw:0,pl:0};
  const meR=S.nba.filter(s=>s.aw.includes('Champion')&&s.mins>=20).length*5+g('MVP')*3+g('All-Star')*.8+c.pts/2500,rvR=rv.rings*5+rv.mvps*3+((rv.aw&&rv.aw['All-Star'])||0)*.8+rv.pts/2500,row=(lb,a2,b2,f=x=>x)=>`<tr><td>${lb}</td><td class="${a2>b2?'good':''}">${f(a2)}</td><td class="${b2>a2?'bad':''}">${f(b2)}</td></tr>`;
  return`<details class="card"><summary>⚔️ Rivalry · ${esc(rv.name)}${rv.retired?' (retired)':rv.team===S.team?' (now your teammate)':''} <span class="${meR>=rvR?'good':'bad'}">· ${meR>=rvR?'you lead':'he leads'} on legacy</span></summary>
  <table style="margin-top:8px"><tr><th></th><th>YOU</th><th>${esc(rv.name.split(' ').slice(-1)[0]).toUpperCase()}</th></tr>${row('Rings',g('Champion'),rv.rings)}${row('MVPs',g('MVP'),rv.mvps)}${row('All-Star',g('All-Star'),rv.aw['All-Star']||0)}${row('Points',Math.round(c.pts),Math.round(rv.pts),x=>x.toLocaleString())}</table>
  <div class="note">Head-to-head: ${h.w}-${h.l} in the regular season · ${h.pw}-${h.pl} in playoff series${rv.retired?'':rv.team===S.team?` · You are teammates on the ${rv.team} now`:` · He plays for the ${rv.team}`}</div></details>`;}

// ---------- the league moves around you: era shifts, superteams, your rival's moves ----------
const ERA_ORDER=['80s','90s','00s','10s','20s','30s'];
function eraShift(n,news,notes){if(n<5||(S.eraShifts||0)>=2||R()>=.1)return;if(S.eraLog&&S.eraLog.length&&n+1-S.eraLog[S.eraLog.length-1].yr<6)return;const i=ERA_ORDER.indexOf(S.era);if(i<0||i>=ERA_ORDER.length-1)return;
  if(!S.eraStart)S.eraStart=S.era;S.era=ERA_ORDER[i+1];S.eraShifts=(S.eraShifts||0)+1;(S.eraLog=S.eraLog||[]).push({yr:n+1,era:S.era});
  const m=`📺 The game is changing: welcome to ${era().name.replace(/^\S+\s/,'')}. Teams now pay extra for ${catName(eraWants())}`;news.push(m);notes.push(m);}
function leagueNews(n,news,notes){const L=S.L,rv=S.rival;
  if(rv&&rv.retired&&!S.rvRet){S.rvRet=n+1;const m=`👋 Your rival ${rv.name} retires after ${rv.yrs} season${rv.yrs===1?'':'s'}. He says you made him better`;news.push(m);notes.push(m);}
  if(rv&&!rv.retired&&S.rvTeam&&rv.team!==S.rvTeam)news.push(`📤 Your rival ${rv.name} was traded to the ${rv.team}`);if(rv)S.rvTeam=rv.team;
  if(n>=2&&R()<.12){const z=L.z||{},ts=TEAMS.filter(x=>x!==S.team&&x!==rv?.team).sort((a,b)=>(z[b]||0)-(z[a]||0)).slice(0,14),tm=pick(ts),mv=lgStack(tm,2)||[];
    if(mv.length===2)news.push(`🌟 Superteam alert: ${mv[0].name} and ${mv[1].name} join the ${tm}`);}}

