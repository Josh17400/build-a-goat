// ---------- the intro: what the game is and how to play ----------
const INTRO=[['ball','This is Build a GOAT','Create a basketball player from scratch and live their whole career: high school, college, the draft and the NBA. Your goal is to retire as the Greatest Of All Time.'],
  ['user','Build your player','Pick your height and frame, spend your skill points and lock in two traits. The game tells you what kind of player you are becoming. Every choice has a tradeoff, and there is no perfect build.'],
  ['calendar','Play your career','Play it season by season. Make summer decisions, choose a college, decide when to declare, pick teams in free agency and take the last shot in Game 7. Spend your bonus points as you grow.'],
  ['goat','Becoming THE GOAT','Rings, MVPs, All-Star picks and big numbers build your GOAT score. Reach 350 and be #1 all-time to be crowned. Every GOAT you make becomes a legend the next one has to beat.'],
  ['refresh','If your first build doesn’t make it, don’t fear!','Almost nobody becomes the GOAT on the first try. Every Pro or Hall of Fame career earns GTP for one-time perks on your next player, and gems for permanent equipment (Rookie is for practice and earns neither). Every run makes the next one stronger.']];
function introHTML(){const i=UI().intro,[ic,t,d]=INTRO[i],last=i===INTRO.length-1;
  return`<div class="intro"><div class="row" style="justify-content:space-between"><div class="dots">${INTRO.map((x,j)=>`<i class="${j===i?'on':j<i?'done':''}"></i>`).join('')}</div>${last?'':'<button class="ghost sm" onclick="endIntro()">Skip</button>'}</div>
  <div class="introbig">${icon(ic)}</div><h1 style="text-align:center">${t}</h1><div class="sub" style="text-align:center;font-size:1rem">${d}</div></div>`+dock(`${i?'<div class="two"><button class="ghost" onclick="UI().intro--;render()">Back</button>':''}<button onclick="${last?'endIntro()':'UI().intro++;render()'}">${last?(S.stage==='build'?'Let’s build':'Back to your career'):'Next'}</button>${i?'</div>':''}`);}
const introSeen=()=>!!Store.get('bag_intro'),markIntroSeen=()=>Store.set('bag_intro','1');
function endIntro(){markIntroSeen();UI().intro=null;render();scrollTo(0,0);}
