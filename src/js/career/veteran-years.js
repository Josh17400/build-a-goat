// ---------- veteran years: farewell tours and comebacks ----------
function farewellPend(){return{kind:'farewell',title:'📣 Farewell Tour?',text:`You are ${S.age}. You could announce that next season is your last and let every arena say goodbye.`,opts:[
  {label:'📣 Announce the farewell tour',desc:'Next season is your last. Ovations everywhere and a fired-up team.'+mileNote(),fn:()=>{S.farewell=S.nba.length+1;addNext({team:3,declAdj:-.4});S.hype+=6;return 'You announced that next season will be your last';}},
  {label:'🏀 Keep playing',desc:'No goodbyes yet.',fn:()=>'You are not ready to say goodbye'}]};}
function rehabPend(){return{kind:'event',title:'🩹 Rehab Plan',text:'You are coming back from a major injury. How do you attack the rehab?',opts:[
  {label:'🩺 Full, patient rehab',desc:'Miss the first 10 games, get some of your burst back.',fn:()=>{addNext({gp:10});up('speed',3);up('vert',3);return 'You took the patient route. Some of your burst is back';}},
  gamble('⚡ Rush back for opening night','Play every game, or get hurt again',.55,()=>{S.hype+=4;return 'You were ready for opening night';},()=>{addNext({gp:25,inj:.08});return 'You came back too soon and got hurt again';}),
  {label:'🧠 Rebuild your game around skill',desc:'+3 IQ, +3 Mid-Range, −2 Speed.',fn:()=>{up('iq',3);up('mid',3);up('speed',-2);return 'You rebuilt your game around skill';}}]};}

