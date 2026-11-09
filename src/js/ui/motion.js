// ---------- motion: entrance on new screens, OVR bump, new-season glow, confetti for big moments ----------
let FXprev=null,FXcur=null;
let TAPGUARD=0;
document.addEventListener('click',e=>{if(performance.now()<TAPGUARD&&e.target.closest&&e.target.closest('.opt,.dock button')){e.stopPropagation();e.preventDefault();}},true);
function fxBefore(){FXcur={key:S.stage+'|'+(S.pend?S.pend.title:'')+'|'+(UI().seq?'q'+UI().seq.i:'')+'|'+(S.stage==='build'?UI().tab+'|'+(UI().menu==='open'?'':UI().menu||''):''),ovr:S.stage==='build'?null:OV(),seasons:S.hs.length+S.col.length+S.nba.length,stage:S.stage};}
function confetti(n=70){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;const c=document.createElement('div');c.className='confetti';const col=['#ff8a1f','#ffc84a','#ffffff','#5fd68a','#ffb15e','#6aa8ff'];
  for(let i=0;i<n;i++){const e=document.createElement('i');e.style.left=(Math.random()*100)+'vw';e.style.background=col[i%col.length];e.style.setProperty('--dx',(Math.random()*160-80)+'px');e.style.setProperty('--r',(Math.random()*900-450)+'deg');e.style.animationDuration=(1.6+Math.random()*1.6)+'s';e.style.animationDelay=(Math.random()*.5)+'s';if(i%3===0){e.style.width='10px';e.style.height='10px';e.style.borderRadius='50%';}c.appendChild(e);}
  document.body.appendChild(c);setTimeout(()=>c.remove(),4200);}
function fxAfter(){const p=FXprev,c=FXcur;FXprev=c;if(!p)return;const app=document.getElementById('app');
  // a new decision just appeared: ignore taps for a moment so a quick double-tap can't pick an option by accident
  if(c.key!==p.key&&S.pend&&!document.documentElement.classList.contains('wt'))TAPGUARD=performance.now()+450;
  // same screen redrawn (spending a point, opening a group): keep it still instead of replaying entrances
  app.classList.toggle('still',c.key===p.key&&c.seasons===p.seasons&&c.stage===p.stage);
  if(c.key!==p.key&&!document.documentElement.classList.contains('wt'))app.querySelectorAll('.seqcard .stat b').forEach((b,j)=>{const tx=b.textContent.trim();if(!/^[\d.,]+$/.test(tx))return;const z=+tx.replace(/,/g,''),dec=tx.includes('.'),t0=performance.now()+250+j*120,fmt=x=>dec?f1(x):Math.round(x).toLocaleString();b.textContent=fmt(0);const step=t=>{const k=Math.max(0,Math.min(1,(t-t0)/700)),e=1-Math.pow(1-k,3);b.textContent=k>=1?tx:fmt(z*e);if(k<1)requestAnimationFrame(step);};requestAnimationFrame(step);});
  if(c.key!==p.key){app.classList.remove('enter');void app.offsetWidth;app.classList.add('enter');clearTimeout(fxAfter.t);fxAfter.t=setTimeout(()=>app.classList.remove('enter'),1200);}
  if(c.seasons>p.seasons){const s=app.querySelector('.season0');if(s)s.classList.add('newseason');const last=S.nba[S.nba.length-1];if(S.stage==='nba'&&last&&last.aw.some(a=>/MVP|Champion/.test(a)))confetti(90);}
  if(c.stage!==p.stage){if(c.stage==='draft')confetti(80);if(c.stage==='end'){const cc=career(),[t]=tierOf(goatScore(cc),cc);if(/GOAT|Top 10|Hall/.test(t))confetti(/GOAT/.test(t)?160:100);}}
  if(c.ovr!=null&&p.ovr!=null&&c.ovr>p.ovr&&c.stage===p.stage&&!document.documentElement.classList.contains('wt')){const o=app.querySelector('.ovr');if(o){o.classList.add('bump');const b=o.querySelector('b');if(b){const a=p.ovr,z=c.ovr,t0=performance.now();const step=t=>{const k=Math.min(1,(t-t0)/600);b.textContent=Math.round(a+(z-a)*k);if(k<1)requestAnimationFrame(step);};requestAnimationFrame(step);}}}}
// reacts to what changed since the last screen, so game logic never has to know about sound
let SNDprev=null;
// haptics on iPhone: the same beats as the sounds, never on plain taps or point ticks (no buzz storm while spending)
function sndFx(...n){try{const sh=window.Shell;if(SND.P.haptics&&sh&&sh.native&&sh.haptic&&!globalThis.__witnessApi){const k=n.includes('fanfare')?'heavy':n.includes('bad')?'error':n.includes('good')?'success':n.includes('buzzer')?'medium':/coin|level/.test(n[0])||n.includes('cheer')?'light':null;if(k)sh.haptic(k);}}catch(e){}return SND.play(...n);}
function sndReact(){if(typeof SND==='undefined')return;const u=UI(),r=S.lastResult,last=S.nba[S.nba.length-1],
  cur={cl:!!(S.pend&&S.pend.kind==='clutch'),stage:S.stage,seasons:S.hs.length+S.col.length+S.nba.length,res:r,sp:S.stage==='build'?spent():null,bank:S.bank,perks:JSON.stringify(S.perks||{}),tab:u.tab,menu:u.menu,sk:u.skillsPicked,sq:u.seq?u.seq.i:-1,pend:!!(S.pend||S.summerPend)};
  const p=SNDprev;SNDprev=cur;if(!p)return;
  if(cur.cl&&!p.cl)return sndFx('buzzer','cheer');
  if(cur.stage!==p.stage){if(cur.stage==='draft')return sndFx('buzzer','cheer');if(cur.stage==='end'){const c=career(),[t]=tierOf(goatScore(c),c);return /GOAT|Top 10|Hall/.test(t)?sndFx('fanfare','cheer'):/All-Star|Starter|Champion/.test(t)?sndFx('good','cheer'):sndFx('bad');}if(cur.stage==='nba')return sndFx('buzzer');return sndFx('swish');}
  if(cur.seasons>p.seasons){const aw=S.stage==='nba'&&last?last.aw:[];if(aw.some(a=>/MVP|Champion/.test(a)))return sndFx('swish','fanfare','cheer');if(aw.length)return sndFx('swish','cheer');return sndFx('swish');}
  if(r&&r!==p.res&&!r.n)return sndFx(r.ok?'good':'bad');
  if(cur.perks!==p.perks)return sndFx('coin');
  if(cur.sk!==p.sk&&cur.sk)return sndFx('level');
  if((cur.sp!=null&&p.sp!=null&&cur.sp!==p.sp)||(cur.bank<p.bank))return sndFx('tick');
  if(cur.tab!==p.tab||cur.menu!==p.menu||cur.sq!==p.sq)return sndFx('tab');}
function soundCard(){const P=SND.P,M=SND.M,tg=(k,l,d)=>`<div class="toggle"><div class="grow"><b>${l}</b><div class="sub">${d}</div></div><button class="${P[k]?'':'ghost'} sm" aria-label="${l} ${P[k]?'on':'off'}" onclick="SND.set('${k}',${!P[k]})">${P[k]?'On':'Off'}</button></div>`;
  return`<div class="card"><div class="sh">🎵 <span class="grow">Sound</span></div>${tg('sfx','Sound effects','Swishes, buzzers, crowd cheers')}${tg('music','Music',M.none?'No music added yet':'Game soundtrack, loops in the background')}${window.Shell&&window.Shell.native?tg('haptics','Vibration','A buzz on big moments: rings, game-winners, the draft'):''}</div>`;}
