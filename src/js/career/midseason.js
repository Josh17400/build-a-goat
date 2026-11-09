// ---------- midseason moments: one call during some seasons (no repeats until you have seen them all) ----------
function midPend(n){if(n<1||S.retired||!S.L||(S.offStops||0)>=4)return null;const hurt0=(S.next&&S.next.gp)||0;const o=ovr(),a=S.age+1,t=S.traits,rv=S.rival&&!S.rival.retired&&S.rival.team!==S.team?S.rival:null,seen=S.midSeen=S.midSeen||[],M=[];
  if(R()>=.45)return null;
  const add=(id,w,title,text,opts)=>{if(w>0&&!seen.includes(id))M.push({id,w,title,text,opts});},o2=(label,desc,fn)=>({label,desc,fn});
  add('hot',hurt0||(S.nba[n-1].ppg||0)<14?0:3,'🔥 Red-Hot Start',pick(['You open the year with 30 or more in four of your first seven games.','A month in, you are one of the hottest scorers in the league.','Defenses are already sending two players at you every night.']),[
    o2('🎯 Keep hunting your shot','More shots for you. The offense gets one-sided.',()=>{addNext({usage:2,team:-1});return 'You kept hunting your shot';}),
    o2('🤝 Get your teammates going','Fewer shots for you, a better team.',()=>{addNext({team:2});return 'You got your teammates going';})]);
  add('slump',3,'🧊 Cold Spell',pick(['You hit a cold stretch in December: nothing is falling.','Ten games in, nothing is falling. The fans are restless.','Your shot has gone missing and the talk shows noticed.']),[
    o2('🎥 Live in the film room','Find the fix. Simplify your game for a while.',()=>{addNext({usage:-.5,team:1});return 'You lived in the film room until the shot came back';}),
    o2('💪 Shoot your way out','Keep firing. It could get uglier before it gets better.',()=>{addNext({usage:1.5,team:-1});return 'You shot your way out of the slump';})]);
  if(rv)add('rival',4,'⚔️ Rivalry Night',pick([`${rv.name} and the ${tShort(rv.team)} are in town on national TV.`,`The whole league is watching you and ${rv.name} tonight.`,`${rv.name} says the matchup is not close. The arena is sold out.`]),[
    o2('🔥 Make it personal','Go right at him. Big stage, big risk.',()=>{S.hype+=4;addNext({usage:1,inj:.02,rv:1});return `You went right at ${rv.name} on national TV`;}),
    o2('🧘 Let the game come to you','Stay in the flow. Win the night your way.',()=>{addNext({team:1});return `You let the game come to you against ${rv.name}`;})]);
  if(S.teamStr<48&&o>=66)add('deadline',3,'📞 Trade Deadline',`The ${tShort(S.team)} are sinking. A contender calls about you before the deadline.`,[
    o2('📤 Ask for the trade','Join a winner now. Fewer shots on a deeper team.',()=>{const tm=TEAMS.filter(x=>x!==S.team&&x!==S.rival?.team).sort((x,y)=>(S.L.z[y]||0)-(S.L.z[x]||0))[0];if(tm){S.team=tm;S.teamStr=teamStrOf(tm);}addNext({usage:-1});return `You were traded at the deadline to the ${S.team}`;}),
    o2('🧱 Stay and fight','The fans love it. The losses keep coming.',()=>{S.hype+=3;addNext({team:1});return 'You stayed and fought through a losing year';})]);
  add('ankle',2,'🤕 Nagging Injury',pick(['Your ankle has been barking for weeks.','A sore knee is slowing you down.','Your back tightens up every time you land.']),[
    o2('🛌 Sit a couple of weeks','Miss about 6 games, come back fresh. Awards need 65 games.',()=>{addNext({gp:6,inj:-.04,midrest:1});return 'You sat out a couple of weeks to heal';}),
    o2('🩹 Play through it','Play every game. It could get worse.',()=>{addNext({inj:.06});return 'You played through the pain';})]);
  if(o>=66&&eff('def')>=60)add('stopper',2,'🛡️ The Stopper Job','Coach wants you on the other team’s best scorer every night.',[
    o2('🔒 Take the assignment','Your defense carries the team. Less energy for scoring.',()=>{addNext({usage:-1,team:2});return 'You took the toughest defensive assignment every night';}),
    o2('🏀 Save your legs for offense','Stay fresh to score.',()=>{addNext({usage:1});return 'You saved your legs for offense';})]);
  if(S.faAt===n+1&&a<=31)add('contract',4,'💰 Playing for a Payday','Your deal is up after this season. Every stat line is an audition.',[
    o2('📈 Chase the numbers','Big stats, a big payday, a worse team.',()=>{addNext({usage:2.5,team:-2});return 'You chased the numbers in your contract year';}),
    o2('🏆 Play winning basketball','Teams pay winners too.',()=>{addNext({team:2});return 'You played winning basketball in your contract year';})]);
  if(o>=72&&!(S.rival&&!S.rival.retired&&S.rival.team===S.team))add('costar',2,'🩺 Your Co-Star Goes Down','Your team’s second-best player is out for two months.',[
    o2('🏋️ Carry the load','Your shots go way up. So does the wear.',()=>{addNext({usage:2,inj:.03,team:-1});return 'You carried the load while your co-star was out';}),
    o2('🤝 Keep it steady','Share the ball and keep the team together.',()=>{addNext({team:1});return 'You kept the team steady while your co-star was out';})]);
  add('rift',2,'📣 Locker Room Rift',pick(['Two veterans nearly came to blows at practice.','A team meeting turns into a shouting match.','The locker room has split into two groups.']),[
    o2('📣 Step in as the leader','It takes energy. Done right, it pulls the team together.',()=>{addNext({team:t.lead>=3?2.5:1,usage:-.5});return 'You stepped in and settled the locker room';}),
    o2('😎 Stay out of it','Keep your focus on your own game: more shots, a shakier locker room.',()=>{addNext({usage:1,team:-1.5});return 'You stayed out of the locker room drama';})]);
  if(S.teamStr>=58&&(S.L&&S.L.lastWins?S.L.lastWins[S.team]>=50:true))add('seed',3,'🏁 Race for the Top Seed','A month to go, and the top seed is in reach.',[
    o2('🚀 Push for the top seed','Win now. A little more wear on your body.',()=>{addNext({team:2,inj:.04,seed:1});return 'You pushed hard for the top seed';}),
    o2('🧊 Rest up for the playoffs','Fresh legs in April. Maybe a lower seed.',()=>{addNext({team:-1,inj:-.04,gp:3,seed:1});return 'You rested up for the playoffs';})]);
  if(o>=78)add('cover',2,'📺 Magazine Cover','A national magazine wants you on the cover, plus a week of interviews.',[
    o2('📸 Do the media tour','Your fame grows. The team notices you are distracted.',()=>{S.hype+=6;addNext({team:-1});return 'You did the media tour and landed on the cover';}),
    o2('🏀 Keep the focus on basketball','Say no and stay locked in.',()=>{addNext({team:1});return 'You turned down the magazine cover';})]);
  if(o>=80)add('closer',2,'🎬 Closing Time','Coach wants the ball in your hands every fourth quarter.',[
    o2('🔥 Take over late','Your shots, your moments.',()=>{addNext({usage:2});S.hype+=2;return 'You took over every fourth quarter';}),
    o2('🧠 Trust the system','Make the right play, even if it is not yours.',()=>{addNext({team:1.5});return 'You trusted the system late in games';})]);
  if(a>=30)add('legs',3,'🕰️ Heavy Legs','Midseason, and your legs feel heavier than last year.',[
    o2('📉 Cut your minutes','About 4 fewer minutes a night, less wear on your body.',()=>{addNext({mins:-4,declAdj:-.3});return 'You cut your minutes to save your legs';}),
    o2('💪 Push through','The team needs you. Your body pays for it.',()=>{addNext({team:1,declAdj:.2});return 'You pushed through the heavy legs';})]);
  if(!M.length){S.midSeen=[];return null;}
  let r=R()*M.reduce((x,m)=>x+m.w,0),m=M[0];for(const q of M){r-=q.w;if(r<=0){m=q;break;}}seen.push(m.id);
  return{kind:'mid',title:m.title,text:`${m.text} Your call shapes the season.`,opts:m.opts};}
