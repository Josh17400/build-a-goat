// ---------- data ----------
const ATTRS=[['sho','Shooting'],['fin','Finishing'],['pla','Playmaking'],['def','Defense'],['reb','Rebounding'],['ath','Athleticism'],['iq','Basketball IQ']];
const POS={
  PG:{h:74,w:{sho:.20,fin:.12,pla:.26,def:.12,reb:.03,ath:.17,iq:.10}},
  SG:{h:77,w:{sho:.28,fin:.15,pla:.12,def:.12,reb:.04,ath:.19,iq:.10}},
  SF:{h:79,w:{sho:.18,fin:.17,pla:.10,def:.16,reb:.07,ath:.22,iq:.10}},
  PF:{h:81,w:{sho:.12,fin:.20,pla:.07,def:.18,reb:.15,ath:.20,iq:.08}},
  C: {h:83,w:{sho:.06,fin:.22,pla:.05,def:.21,reb:.20,ath:.18,iq:.08}}};
// 25 skills. Post Fade, Hook Shot, Lateral Quickness and Off-Ball Movement were added 2026-11-06 for post players and wings/forwards
const SUBS={sho:[['close','Close Shot'],['mid','Mid-Range'],['three','Three-Point'],['ft','Free Throw'],['fade','Post Fade']],fin:[['layup','Layup'],['dunk','Dunk'],['post','Post Moves'],['hook','Hook Shot']],pla:[['pass','Passing'],['handle','Ball Handle']],def:[['perD','Perimeter D'],['intD','Interior D'],['stl','Steal'],['blk','Block'],['lat','Lateral Quickness']],reb:[['oreb','Off. Rebound'],['dreb','Def. Rebound']],ath:[['speed','Speed'],['vert','Vertical'],['str','Strength'],['stam','Stamina']],iq:[['iq','Basketball IQ'],['cons','Consistency'],['offb','Off-Ball Movement']]};
// the original 21 skills in their groups: only for the old position rating (legacyOvr)
const LEGACY_SUBS={sho:[['close','Close Shot'],['mid','Mid-Range'],['three','Three-Point'],['ft','Free Throw']],fin:[['layup','Layup'],['dunk','Dunk'],['post','Post Moves']],pla:[['pass','Passing'],['handle','Ball Handle']],def:[['perD','Perimeter D'],['intD','Interior D'],['stl','Steal'],['blk','Block']],reb:[['oreb','Off. Rebound'],['dreb','Def. Rebound']],ath:[['speed','Speed'],['vert','Vertical'],['str','Strength'],['stam','Stamina']],iq:[['iq','Basketball IQ'],['cons','Consistency']]};
const SUBKEYS=Object.values(SUBS).flat().map(x=>x[0]);
// height effect per inch vs 6'6" (78in); shorter players lose more on blocks and boards than tall players gain
const HMOD={hook:1,fade:.5,lat:-.9,oreb:2,dreb:2,intD:1.5,blk:2.4,dunk:1.8,post:1.2,str:.6,close:.8,layup:.4,perD:-.6,handle:-1.6,pass:-.4,speed:-1.3,vert:-.4,three:-.4,stl:-.4};
const FRAMES={Lean:{speed:6,vert:5,stam:5,lat:4,hook:-2,str:-9,post:-4,intD:-3,oreb:-3,dreb:-2,inj:-.03,decl:-.1,mins:1,d:'Quick, bouncy and tireless, but you get pushed around inside',hid:['Healthier','Ages slowly','Extra minutes']},
  Balanced:{cons:3,iq:2,inj:0,dev:.025,d:'No glaring weakness. Steady and easy to coach',hid:['Faster development','Steadier nights']},
  Strong:{str:9,post:5,intD:4,oreb:4,dreb:3,close:2,hook:3,speed:-5,vert:-4,stam:-3,lat:-4,inj:.04,decl:.15,ppg:1,d:'Bully ball inside, but slower and heavier on the joints',hid:['Draws contact (+points)','Ages faster','More injuries']}};
const TRAITS=[['work','Work Ethic','You develop faster and age slower'],['dur','Durability','Fewer and lighter injuries'],['clutch','Clutch Gene','You win more playoff series'],['coach','Coachability','You get more out of college'],['star','Star Power','Hype, All-Star votes, draft buzz'],['motor','Motor','You hustle every possession: more rebounds, steals and minutes'],['lead','Leadership','You make teammates better: more wins and playoff series'],['killer','Killer Instinct','Scorer’s mentality: more shots and points, fewer assists'],['late','Late Bloomer','Raw early, but a higher ceiling and a later peak (a gamble)'],['lock','Lockdown Mindset','You take defense personally: steals, blocks, DPOY votes'],['touch','Shooter’s Touch','Soft hands: better 3P%, FT% and FG%']];
const MIN_A=25, BUILD_MAX=90, H_MIN=70, H_MAX=87;
