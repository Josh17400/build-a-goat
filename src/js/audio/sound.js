// ---------- sound: every effect is synthesized live (no files); music plays music/1.mp3, 2.mp3 ... if present ----------
const SND=(()=>{let ctx=null,master=null,last={};const pref=k=>Store.get(k)!=='0';
  const P={sfx:pref('bag_sfx'),music:pref('bag_music'),haptics:pref('bag_haptics')};
  function unlock(){if(typeof AudioContext==='undefined'&&typeof webkitAudioContext==='undefined')return;if(!ctx){ctx=new(window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=1;master.connect(ctx.destination);}if(ctx.state!=='running')ctx.resume();M.start();}
  const now=()=>ctx.currentTime;
  function env(g,t,a,peak,d){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(0.0001,t+a+d);}
  function tone(f,t,{type='sine',a=.005,d=.15,v=.3,to=null,dest=master}={}){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+a+d);env(g,t,a,v,d);o.connect(g);g.connect(dest);o.start(t);o.stop(t+a+d+.05);}
  let nb=null;function noise(t,{d=.3,v=.3,type='bandpass',f=1500,to=null,q=1,a=.01}={}){if(!nb){nb=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate);const c=nb.getChannelData(0);for(let i=0;i<c.length;i++)c[i]=Math.random()*2-1;}
    const s=ctx.createBufferSource(),fl=ctx.createBiquadFilter(),g=ctx.createGain();s.buffer=nb;fl.type=type;fl.frequency.setValueAtTime(f,t);if(to)fl.frequency.exponentialRampToValueAtTime(to,t+a+d);fl.Q.value=q;env(g,t,a,v,d);s.connect(fl);fl.connect(g);g.connect(master);s.start(t,Math.random());s.stop(t+a+d+.05);}
  const FX={
    tap:t=>tone(720,t,{d:.04,v:.07,to:980}),
    tick:t=>tone(1250,t,{type:'triangle',d:.05,v:.12,to:1500}),
    tab:t=>{tone(150,t,{d:.12,v:.35,to:60});noise(t,{d:.05,v:.08,type:'lowpass',f:500});},
    swish:t=>{noise(t,{d:.32,v:.22,f:3200,to:700,q:1.4,a:.04});tone(95,t+.3,{d:.18,v:.18,to:55});},
    good:t=>{tone(784,t,{d:.18,v:.16});tone(1175,t+.09,{d:.3,v:.16});},
    bad:t=>{tone(196,t,{type:'triangle',d:.22,v:.22,to:130});tone(147,t+.14,{type:'triangle',d:.32,v:.2,to:98});},
    coin:t=>{tone(988,t,{type:'square',d:.06,v:.07});tone(1319,t+.07,{type:'square',d:.22,v:.07});},
    buzzer:t=>{[220,223,330].forEach(f=>tone(f,t,{type:'sawtooth',a:.01,d:.7,v:.07}));},
    cheer:t=>{noise(t,{d:1.6,v:.2,f:1100,q:.6,a:.35});for(let i=0;i<14;i++)noise(t+.1+Math.random()*1.1,{d:.04,v:.12,f:2000+Math.random()*1500,q:2,a:.002});},
    fanfare:t=>{[523,659,784,1047].forEach((f,i)=>{tone(f,t+i*.11,{type:'triangle',d:i===3?.7:.16,v:.16});tone(f*2,t+i*.11,{d:i===3?.6:.12,v:.04});});},
    level:t=>{[392,523,659].forEach((f,i)=>tone(f,t+i*.07,{type:'triangle',d:.18,v:.14}));}};
  function play(...names){if(!P.sfx||!ctx||ctx.state!=='running')return;const t=now();names.forEach((n,i)=>{if(last[n]&&t-last[n]<.06)return;last[n]=t;try{FX[n](t+i*.02);}catch{}});}
  // music: tries music/1.mp3, music/2.mp3 ... in order and loops the set
  const M={el:null,n:1,count:0,none:false,start(){if(!P.music||this.none||typeof Audio==='undefined')return;if(this.el){if(this.el.paused)this.el.play().catch(()=>{});return;}this.load();},
    load(){const a=this.el||(this.el=new Audio());a.volume=.32;a.src=`music/${this.n}.mp3`;a.onended=()=>{this.n++;this.load();};
      a.onerror=()=>{if(this.n===1){this.none=true;this.el=null;render();return;}this.count=this.n-1;this.n=1;this.load();};a.onplaying=()=>{this.count=Math.max(this.count,this.n);};a.play().catch(()=>{});},
    stop(){if(this.el)this.el.pause();}};
  document.addEventListener('visibilitychange',()=>{if(document.hidden)M.stop();else if(P.music&&M.el)M.el.play().catch(()=>{});});
  document.addEventListener('pointerdown',e=>{unlock();if(e.target.closest&&e.target.closest('button,summary'))play('tap');},true);
  document.addEventListener('keydown',unlock,true);
  function set(k,v){P[k]=v;Store.set('bag_'+k,v?'1':'0');if(k==='music'){if(v){M.none=false;M.start();}else M.stop();}if(k==='sfx'&&v){unlock();play('good');}render();}
  return{play,set,P,M};})();
