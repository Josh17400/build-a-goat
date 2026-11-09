// ---------- looks ----------
let AVN=0;
const SKINS=[['Porcelain','#f6d3b3'],['Light','#eec19a'],['Tan','#d9a27a'],['Olive','#c68a5b'],['Brown','#a86b43'],['Deep Brown','#8a5233'],['Dark','#6b3e26'],['Ebony','#4a2a1a']];
const HAIRCOL=[['Black','#161616'],['Dark Brown','#3b2416'],['Brown','#6b4226'],['Auburn','#8e3b1f'],['Blonde','#d8b26a'],['Platinum','#ece6d6'],['Red','#b8321f'],['Dyed Blue','#2c5bd8'],['Dyed Pink','#e0559b'],['Dyed Green','#2fa860']];
const HAIRS=['Buzz Cut','Low Fade','360 Waves','Fro','Big Fro','Afro Puff','High-Top Fade','Flat-top','Cornrows','Box Braids','Locs','Locs Bun','Twists','Curly Top','Mohawk','Faux-hawk','Spiky','Side Part','Slicked Back','Man Bun','Mullet','Long & Wavy','Shaved','Bald'];
const FACIAL=['Clean','Stubble','Mustache','Goatee','Chin Strap','Full Beard','Big Beard','Soul Patch'];
const FACES=['😐 Focused','😁 Goofy grin','😤 Mean mug','😎 Too cool','😏 Smirk','😡 Fired up','😉 Wink'];
const HEADW=['None','Headband','Ninja Headband','Pre-wrap','Goggles','Face Mask'];
const ARMS=['None','Shooter Sleeve','Both Sleeves','Arm Bands','Tattoo Sleeve','Ink + Sleeve'];
const JEWEL=['None','Stud Earring','Hoop Earring','Chain','Studs + Chain'];
const GUARD=['None','Clear','Black','Team Color'];
const JERSEYS=[['Orange','#ff8a1f'],['Royal','#2b6cff'],['Red','#e63946'],['Teal','#2a9d8f'],['Purple','#7b3fb0'],['Gold','#e0a815'],['Green','#1f8a4c'],['Black','#1f1f1f'],['White','#f2f2f2'],['Navy','#1d2b57']];
const TRIMS=[['White','#ffffff'],['Black','#111111'],['Gold','#f2c14e'],['Silver','#b9c2cc']];
const JSTYLE=['Tank','Throwback Stripes','Shooting Shirt','Pinstripes','Side Panels','Sash'];
// face features (2026-11). A look saved before these existed has none of them and draws as it always did:
// each defaults to its first option. They are never rolled with the dice (see randLook).
const FSHAPE=['Oval','Round','Square','Long','Heart','Strong Jaw'];
const EYES=['Round','Almond','Wide','Hooded'];
const EYECOL=[['Dark Brown','#3b2414'],['Brown','#6b4423'],['Hazel','#8a6a2f'],['Green','#3f7d4e'],['Blue','#3a6ea8'],['Gray','#6f7d8a']];
const BROWS=['Classic','Thick','Thin','Slit'];
const NOSES=['Classic','Wide','Button','Long','Round'];
const MARKS=['None','Freckles','Beauty Mark','Brow Scar','Cheek Scar','Eye Black','Nose Strip','Bandage'];
const LOOKS=[['skin','Skin',()=>SKINS.map(x=>x[0])],['hair','Hair',()=>HAIRS],['hc','Hair Color',()=>HAIRCOL.map(x=>x[0])],['fh','Facial Hair',()=>FACIAL],['face','Expression',()=>FACES],['head','Headwear',()=>HEADW],['arms','Arms',()=>ARMS],['jew','Jewelry',()=>JEWEL],['guard','Mouthguard',()=>GUARD],['jer','Jersey',()=>JERSEYS.map(x=>x[0])],['trim','Trim',()=>TRIMS.map(x=>x[0])],['js','Uniform',()=>JSTYLE],
  ['fs','Face Shape',()=>FSHAPE,1],['ey','Eyes',()=>EYES,1],['ec','Eye Color',()=>EYECOL.map(x=>x[0]),1],['br','Brows',()=>BROWS,1],['no','Nose',()=>NOSES,1],['mk','Marks',()=>MARKS,1]];
function randLook(){const L={num:ri(0,99)};for(const[k,,o,derived]of LOOKS)if(!derived)L[k]=ri(0,o().length-1);
  if(R()<.45)L.fh=ri(0,1);if(R()<.55)L.head=0;if(R()<.7)L.guard=0;if(R()<.5)L.jew=0;if(R()<.4)L.arms=0;if(R()<.75)L.hc=ri(0,3);if(R()<.6)L.js=0;if(TRIMS[L.trim][0]===JERSEYS[L.jer][0])L.trim=(L.trim+1)%TRIMS.length;return faceFeatures(L);}
// face features for a rolled look, from its own numbers (no dice). Most faces carry no mark, classic brows and dark eyes.
function faceFeatures(L){const r=makeRng(seedFrom(LOOKS.filter(x=>!x[3]).map(x=>L[x[0]]).join('.')+'#'+L.num)),n=a=>Math.floor(r()*a.length);
  L.fs=n(FSHAPE);L.ey=n(EYES);L.no=n(NOSES);L.ec=r()<.55?ri0(r,2):n(EYECOL);L.br=r()<.6?0:n(BROWS);L.mk=r()<.62?0:n(MARKS);return L;}
const ri0=(r,k)=>Math.floor(r()*k);
function cyc(k,d){const n=LOOKS.find(x=>x[0]===k)[2]().length;S.look[k]=((S.look[k]||0)+d+n)%n;render();}
const hx6=h=>/^#[0-9a-f]{3}$/i.test(h)?'#'+[...h.slice(1)].map(c=>c+c).join(''):h; // '#fff' -> '#ffffff' so colour maths never misreads short hex
function shade(hex,f){const n=parseInt(hx6(hex).slice(1),16),c=[n>>16,n>>8&255,n&255].map(v=>Math.round(clamp(f<0?v*(1+f):v+(255-v)*f,0,255)));return'#'+c.map(v=>v.toString(16).padStart(2,'0')).join('');}
function avatar(L,age,size,bg){size=size||90;if(L.face===3&&(L.head===4||L.head===5))L={...L,face:0};if(age<17&&(L.fh||0)>1)L={...L,fh:1};const id='av'+(++AVN),g=(a,i)=>a[(i||0)%a.length];
  const sk=g(SKINS,L.skin)[1],skD=shade(sk,-.2),old=age>=38,dyed=(L.hc||0)>=7,lu=h=>{const n=parseInt(hx6(h).slice(1),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255;},gmix=(a,b,t)=>{const q=h=>[1,3,5].map(i=>parseInt(hx6(h).slice(i,i+2),16)),A=q(a),B=q(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');},gry=dyed||old?0:age>=35?.28:age>=32?.13:0,gdes=h=>{const v=Math.round(lu(h)*255).toString(16).padStart(2,'0');return gmix(h,'#'+v+v+v,Math.min(1,gry*1.7));};
  // dark natural hair on a same-tone dark skin (dark brown on Ebony etc.) is pushed towards near-black so the style still reads
  const hc0=old&&!dyed?((L.hc||0)%10===5?'#e2e2e2':'#c9c9c9'):gry?gmix(gdes(g(HAIRCOL,L.hc)[1]),gry<.3?'#8c8c8c':'#bdbdbd',Math.min(.7,gry*(lu(g(HAIRCOL,L.hc)[1])<.2?1.5:lu(g(HAIRCOL,L.hc)[1])>.45?.75:1.05))):g(HAIRCOL,L.hc)[1],hcLow=!old&&!dyed&&(L.hc||0)%10!==6&&lu(hc0)<.35&&Math.abs(lu(hc0)-lu(sk))<.1;
  const hc=hcLow?shade(hc0,-.45):hc0,hcD=shade(hc,-.32),hcL=shade(hc,.35);
  const jc=g(JERSEYS,L.jer)[1],tc=g(TRIMS,L.trim)[1],lightJ=['#f2f2f2','#e0a815','#ff8a1f'].includes(jc),st=g(HAIRS,L.hair),js=g(JSTYLE,L.js);
  const w=typeof S!=='undefined'&&S.frame==='Strong'?34:typeof S!=='undefined'&&S.frame==='Lean'?26:30,lx=60-w,rx=60+w;
  // the face: the top half is the same for everyone (every hairstyle sits on it); the jaw and chin below the ears vary.
  // Each shape is the right-hand jaw from the ear line (83,58) down to the chin, as cubic curves; the left side mirrors it.
  const fsI=(L.fs||0)%FSHAPE.length,JAW=[null,[[83.7,71.6,74.6,83.5,60,83.5]],[[83.2,67.5,82.3,77,76,80.8],[72,83.4,66,84.7,60,84.7]],[[82.7,72.4,72.2,87.3,60,87.3]],[[82.6,69.4,73,80.2,65.4,84.2],[63.4,85.4,61.6,86,60,86]],[[84,70.5,81.6,80.4,73.6,83.6],[69.4,85.3,64.4,85.5,60,85.5]]][fsI];
  const chinY=JAW?JAW[JAW.length-1][5]:84.5,jawR=JAW?JAW.map(s=>`C${s[0]} ${s[1]} ${s[2]} ${s[3]} ${s[4]} ${s[5]}`).join(' '):'',jawL=JAW?JAW.map((s,i)=>{const p=i?JAW[i-1]:[0,0,0,0,83,58];return`C${120-s[2]} ${s[3]} ${120-s[0]} ${s[1]} ${120-p[4]} ${p[5]}`;}).reverse().join(' '):'';
  const faceD=JAW?`M37 58 A23 26.5 0 0 1 83 58 ${jawR} ${jawL}Z`:'M37 58 A23 26.5 0 0 1 83 58 A23 26.5 0 0 1 37 58Z';
  const cap=(y=40.5)=>`M37.3 57 C35 34 46 27 60 27 C74 27 85 34 82.7 57 C82 46 76 ${y} 60 ${y} C44 ${y} 38 46 37.3 57Z`;
  // shared hair helpers: mr() mirrors a left-side path (x -> 120-x); mix() blends two colours opaquely;
  // skull clip (#k) keeps fades/sideburns on the head; #lf is a vertical fade from the fade colour (y45) to clear (y56)
  const mr=d=>d.replace(/(-?[\d.]+) (-?[\d.]+)/g,(m,x,y)=>`${+(120-x).toFixed(2)} ${y}`);
  const mix=(a,b,t)=>{const p=h=>[1,3,5].map(i=>parseInt(hx6(h).slice(i,i+2),16)),A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('');};
  // sideburns taper to a soft point just above the ear's middle (no squared-off helmet flaps at eye level).
  // soft=1 (buzzed / shaved / hawk sides): opaque down to y53, then fades out by y59 like real clipper-cut sideburns
  const burnD=`M34 44 L42.4 44 C41 49.5 40.5 53.5 40.3 56 Q39.9 58.2 38.2 59.2 Q36.4 59.8 34 59.6Z`;
  const fBeard=L.fh===5||L.fh===6; // full/big beard: its own sideburns run up under the cap, so the hair's burns only fade into them
  let bnN=0;const burns=(fill=hc,soft)=>{if(fBeard)soft=1;if(!soft||fill.startsWith('url'))return`<path d="${burnD} ${mr(burnD)}" fill="${fill}" clip-path="url(#${id}k)"/>`;
    const gi=id+'bn'+(++bnN);return`<linearGradient id="${gi}" gradientUnits="userSpaceOnUse" x1="0" y1="53" x2="0" y2="59"><stop offset="0" stop-color="${fill}"/><stop offset="1" stop-color="${fill}" stop-opacity=".25"/></linearGradient><path d="${burnD} ${mr(burnD)}" fill="url(#${gi})" clip-path="url(#${id}k)"/>`;};
  const fadeSk=(y0,x0)=>`<path d="M30 63 L30 ${y0} L90 ${y0} L90 63 L80.6 63 C80.3 54 79.6 ${y0+7} ${120-x0} ${y0} L${x0} ${y0} C40.4 ${y0+7} 39.7 54 39.4 63Z" fill="url(#${id}lf)" clip-path="url(#${id}k)"/>`;
  const hShadow=(...ds)=>`<g clip-path="url(#${id}k)" opacity="${(L.skin||0)>=5?.4:.28}" fill="${skD}">${ds.map(d=>`<path d="${d}" transform="translate(0 1.3)"/>`).join('')}</g>`;
  const curls=(pts,c=hcD,o=.4)=>(o=lu(hc)>.45?Math.min(o,.22):o,pts).map(([x,y],i)=>`<path d="M${x-2.6} ${y+(i%2?-.6:.6)} q2.6 ${i%2?3:-3} 5.2 0" stroke="${c}" stroke-width="1" fill="none" opacity="${o}" stroke-linecap="round"/>`).join('');
  const dots=(x0,x1,y0,y1,sp,r,c,o)=>{let s='';for(let y=y0,k=0;y<=y1;y+=sp*.8,k++)for(let x=x0+(k%2)*sp/2;x<=x1;x+=sp){const j=Math.sin(x*12.9898+y*78.233)*43758.5453%1;s+=`<circle cx="${(x+j*.9).toFixed(1)}" cy="${(y-j*.7).toFixed(1)}" r="${r}"/>`;}return`<g fill="${c}" opacity="${o}">${s}</g>`;};
  const shine=`<path d="M46 32 Q58 27 70 30" stroke="${hcL}" stroke-width="2" fill="none" opacity=".4" stroke-linecap="round"/>`;
  // texture lines: dark lines vanish on black hair, so black hair gets light lines instead
  const dk=lu(hc)<.2,txC=dk?hcL:hcD,txO=dk?.42:.6;
  // fade colour: dyed hair only colours the top crop (the clipped sides show natural dark stubble); grey/blonde/platinum sides on darker skin are muted towards the skin
  // natC: the colour the hair would be without dye (greys with age), used for brows, fade/shaved sides and beards so they all age together
  const natC=dyed?(old?'#c9c9c9':'#2a2a2a'):hc;
  const fadeC=dyed&&!old?mix(natC,sk,.35):lu(natC)-lu(sk)>.2?mix(natC,sk,.45):natC;
  // shaved-length cap: its outer edge IS the head outline, so shaved/short sides lie flat on the scalp
  const skull=`M37 58 C37 43.4 47.3 31.5 60 31.5 C72.7 31.5 83 43.4 83 58 C82 46 76 40.5 60 40.5 C44 40.5 38 46 37 58Z`;
  let pc=0;const inCap=(d,body)=>{const c=id+'p'+(++pc);return`<clipPath id="${c}"><path d="${d}"/></clipPath><g clip-path="url(#${c})">${body}</g>`;}; // keeps on-hair texture inside the hair shape
  // bump(): joins points with little arcs (curly/twisty edges); sgn -1 bulges away from (cx,cy), +1 towards it
  const bump=(pts,amp,cx,cy,sgn)=>pts.slice(1).map(([bx,by],k)=>{const[ax,ay]=pts[k],mx=(ax+bx)/2,my=(ay+by)/2,l=Math.hypot(bx-ax,by-ay);let nx=-(by-ay)/l,ny=(bx-ax)/l;if((nx*(cx-mx)+ny*(cy-my))*sgn<0){nx=-nx;ny=-ny;}return` Q${(mx+nx*amp).toFixed(2)} ${(my+ny*amp).toFixed(2)} ${bx} ${by}`;}).join('');
  const qp=(P,C,E,t)=>[0,1].map(j=>(1-t)**2*P[j]+2*t*(1-t)*C[j]+t*t*E[j]);
  // hair rows that run from the hairline up and back over the crown (cornrows / braids / locs on top)
  const rows=(xs,k,fn)=>xs.map(x=>fn([x,48],[60+(x-60)*1.04,35],[60+(x-60)*k,22],x)).join('');
  const tex=(cx,cy,r,n,cr,full)=>{let s='';for(let i=0;i<n;i++){const a=i/n*Math.PI*2,x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;if(full||y<cy+r*.6)s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${cr}" fill="${hc}"/>`;}return s;};
  // hanging hair (braids / locs / twists), drawn behind the head. flare(): hair mass behind the ears that grows out of the
  // cap below headband level; strands() hang from inside it (flat tops hidden), splay out a little and taper to a round tip.
  // xs/ends are given for the LEFT side (outer -> inner) and mirrored. kind: b = box braid, l = loc, t = twist
  const flare=xo=>{const d=`M38.2 48 C36.4 52.5 ${xo} 53 ${xo} 59 L${xo} 66 L49 66 L49 48Z`;return`<path d="${d} ${mr(d)}" fill="${hc}"/>`;};
  const beadC=Math.abs(lu(tc)-lu(jc))<.22?(lu(jc)>.5?'#1b1b1b':'#f2c14e'):tc; // beads never vanish into a same-colour jersey
  const strands=(xs,ends,wd,kind)=>[1,-1].map(sd=>xs.map((x0,i)=>{const x=sd>0?x0:120-x0,y0=57,y1=ends[i],r=wd/2,k=kind==='l'?.92:kind==='b'?.8:.62,q=r*k;
    const hw=y=>r-(r-q)*(y-y0)/(y1-q-y0); // half-width of the tapering strand at height y, so texture never pokes out
    let t='';if(kind==='b')for(let y=y0+4;y<y1-q-1;y+=3.1){const h=(hw(y)-.6).toFixed(2);t+=`M${x-h} ${y.toFixed(1)} L${x} ${(y+1.3).toFixed(1)} L${x+ +h} ${y.toFixed(1)}`;}
    else if(kind==='l')for(let y=y0+5;y<y1-q-1;y+=4.4){const h=(hw(y)-.8).toFixed(2);t+=`M${x-h} ${y.toFixed(1)} Q${x} ${(y+1.6).toFixed(1)} ${x+ +h} ${y.toFixed(1)}`;}
    else for(let y=y0+4;y<y1-q-.5;y+=3.3){const h=hw(y)-.5,e=Math.min(1.3,h*.6);t+=`M${(x-h).toFixed(2)} ${(y+e).toFixed(1)} L${(x+h).toFixed(2)} ${(y-e).toFixed(1)}`;}
    const body=`M${x-r} ${y0} L${x-q} ${y1-q} A${q} ${q} 0 0 0 ${x+q} ${y1-q} L${x+r} ${y0}Z`;
    return`<g transform="rotate(${((60-x)*.07).toFixed(2)} ${x} ${y0})"><path d="${body}" fill="${hc}"/><path d="M${x+r*.62} ${y0} L${x+q*.55} ${y1-q-.4}" stroke="${hcD}" stroke-width="${(r*.62).toFixed(2)}" opacity=".45" stroke-linecap="round"/>`
      +`<path d="${t}" stroke="${txC}" stroke-width=".75" fill="none" opacity="${txO}" stroke-linecap="round" stroke-linejoin="round"/><path d="M${x-r*.42} ${y0+2} L${x-q*.42} ${y1-q-1}" stroke="${hcL}" stroke-width=".8" opacity=".35" stroke-linecap="round"/>`
      +(kind==='b'?`<path d="M${x-q} ${y1-1.6} H${x+q}" stroke="${hcD}" stroke-width=".9"/><circle cx="${x}" cy="${y1+.6}" r="${(q+.6).toFixed(2)}" fill="${beadC}" stroke="${shade(beadC,-.45)}" stroke-width=".8"/><circle cx="${x-.7}" cy="${y1-.2}" r=".7" fill="#fff" opacity=".55"/>`:'')+'</g>';}).join('')).join('');
  const shavedC=mix(sk,hc,dyed?.66:old&&(L.skin||0)>=5?.22:.34);
  let back='',mid='',hair='';
  switch(st){
    case'Buzz Cut':case'360 Waves':{const wv=st==='360 Waves',bc=mix(hc,sk,wv?.08:.18),d=`M37.3 55 C36 36 46 30 60 30 C74 30 84 36 82.7 55 C81 46 75 42 60 42 C45 42 39 46 37.3 55Z`;
      hair=hShadow(d)+`<clipPath id="${id}t"><path d="${d}"/></clipPath><path d="${d}" fill="${bc}"/>${burns(bc,1)}`
        +(wv?[[41,45.5,36],[42.5,41.5,32.5],[45.5,37.5,29.5],[50.5,34,28]].map(([x,y,c])=>`<path d="M${x} ${y} Q60 ${c} ${120-x} ${y}" stroke="${hcL}" stroke-width="1.3" stroke-dasharray="6 2.2" stroke-linecap="round" fill="none" opacity=".55" clip-path="url(#${id}t)"/>`).join('')
          :`<g clip-path="url(#${id}t)">${dots(38,82,31.5,47,3.4,.45,hcD,.28)}</g>`);break;}
    case'Low Fade':{const d=`M39.3 47 C37.5 34 47 28.5 60 28.5 C73 28.5 82.5 34 80.7 47 C78 43 71 41 60 41 C49 41 42 43 39.3 47Z`;
      hair=hShadow(d)+fadeSk(40,46)+burns(`url(#${id}lf)`)+`<path d="${d}" fill="${hc}"/><path d="M47 32.5 Q57 29.6 67 31" stroke="${hcL}" stroke-width="1.6" fill="none" opacity=".25" stroke-linecap="round"/>`;break;}
    case'Fro':case'Big Fro':{const big=st==='Big Fro';
      // curly hairline: a run of small bumps instead of a smooth arc, so the hairline matches the curly outline
      const hp=[[82.7,57],[81,50],[78.2,45.6],[73.8,42.4],[67.6,40.8],[60,40.4],[52.4,40.8],[46.2,42.4],[41.8,45.6],[39,50],[37.3,57]];
      const d=`M37.3 57 C35 34 46 27 60 27 C74 27 85 34 82.7 57`+hp.slice(1).map(([bx,by],k)=>{const[ax,ay]=hp[k],mx=(ax+bx)/2,my=(ay+by)/2,l=Math.hypot(bx-ax,by-ay);let nx=-(by-ay)/l,ny=(bx-ax)/l;if(nx*(60-mx)+ny*(58-my)<0){nx=-nx;ny=-ny;}return` Q${(mx+nx*2.6).toFixed(2)} ${(my+ny*2.6).toFixed(2)} ${bx} ${by}`;}).join('')+'Z';
      back=big?`<circle cx="60" cy="42" r="33" fill="${hc}"/>`+tex(60,42,33,26,5.8):`<circle cx="60" cy="43" r="29" fill="${hc}"/>`+tex(60,43,29,24,5);
      hair=hShadow(d)+`<path d="${d}" fill="${hc}"/>${burns()}`+curls(big?[[46,16],[60,12],[74,16],[35,27],[85,27],[29,41],[91,41],[52,24],[68,24],[42,34],[78,34],[60,33]]:[[48,21],[60,18],[72,21],[38,30],[82,30],[33,42],[87,42],[53,28],[67,28],[60,34]]);break;}
    case'Afro Puff':{const tieC=[tc,jc,lu(hc)>.5?'#1c1c1c':'#f2f2f2'].find(c=>Math.abs(lu(c)-lu(hc))>=.25)||(lu(hc)>.5?'#1c1c1c':'#f2f2f2'),d=`M37.3 56 C35.8 35 46 29.5 60 29.5 C74 29.5 84.2 35 82.7 56 C82 46 76 41 60 41 C44 41 38 46 37.3 56Z`;
      back=`<circle cx="60" cy="16.4" r="11" fill="${hc}"/>`+tex(60,16.4,11,14,3.1)+curls([[55,10],[65,10.6],[60,16],[54,20.4],[66,20.4]]);
      hair=hShadow(d)+`<path d="${d}" fill="${hc}"/>${burns()}`+[[44.5,43.5,55.6,31.6],[51,41.2,58,32.2],[69,41.2,62,32.2],[75.5,43.5,64.4,31.6]].map(([x0,y0,x1,y1])=>`<path d="M${x0} ${y0} Q${(x0+(x1-x0)*.2).toFixed(1)} ${y1+2.5} ${x1} ${y1}" stroke="${hcD}" stroke-width="1" fill="none" opacity=".35" stroke-linecap="round"/>`).join('')
        +`<path d="M43.5 39 Q45.5 33.5 51 31.6" stroke="${hcL}" stroke-width="1.6" fill="none" opacity=".3" stroke-linecap="round"/>`
        // the ball sits up on the crown; below it the hair pinches into a short gathered neck (background shows either side) and the tie cinches it onto the cap
        +`<path d="M52.2 22.6 Q55.4 25.4 55.8 29.4 L64.2 29.4 Q64.6 25.4 67.8 22.6Z" fill="${hc}"/><path d="M57.2 27.4 Q57 25.6 55.6 24.2 M62.8 27.4 Q63 25.6 64.4 24.2" stroke="${hcD}" stroke-width=".8" fill="none" opacity=".4" stroke-linecap="round"/>`
        +`<path d="M54.8 27.2 Q60 28.9 65.2 27.2 L65.4 30.2 Q60 32 54.6 30.2Z" fill="${tieC}" stroke="${shade(tieC,lu(tieC)<.25?.4:-.35)}" stroke-width=".6" stroke-linejoin="round"/><path d="M55 30.6 Q60 32.4 65 30.6" stroke="#000" stroke-width=".8" fill="none" opacity=".22"/><path d="M56.4 28.6 Q60 29.8 63.6 28.6" stroke="#fff" stroke-width=".6" fill="none" opacity=".3" stroke-linecap="round"/>`;break;}
    case'High-Top Fade':{const d=`M41.4 44.2 C42.2 34 40.6 18 40.6 11 Q40.8 7.6 44 7.4 Q60 6.2 76 7.4 Q79.2 7.6 79.4 11 C79.4 18 77.8 34 78.6 44.2 C74 39.2 67 38 60 38 C53 38 46 39.2 41.4 44.2Z`;
      hair=hShadow(d)+fadeSk(38,44)+burns(`url(#${id}lf)`)+`<path d="${d}" fill="${hc}"/>`+[[42.6,10.2],[46.4,8.2],[50.6,7.4],[55,7],[59.4,6.8],[63.8,6.9],[68.2,7.2],[72.6,7.6],[76.6,8.6],[78.6,11.6],[41.2,13.6],[79.1,15.4],[41.1,18.6]].map(([x,y],k)=>`<circle cx="${x}" cy="${y}" r="${k%3?2.1:1.8}" fill="${hc}"/>`).join('')+curls([[48,14],[60,12.5],[72,14],[45,21.5],[54,19.5],[66,19.5],[75,21.5],[49,28],[60,26],[71,28],[46,34.5],[74,34.5]],hcD,.3)
        +`<path d="M43 11 Q60 9 77 11" stroke="${hcL}" stroke-width="1.5" fill="none" opacity=".35" stroke-linecap="round"/>`;break;}
    case'Flat-top':{const d=`M39.4 47 C38.6 40 37.8 30 37.8 23 Q37.8 19.6 41.4 19.6 L78.6 19.6 Q82.2 19.6 82.2 23 C82.2 30 81.4 40 80.6 47 C77.8 43.2 72 40.5 60 40.5 C48 40.5 42.2 43.2 39.4 47Z`;
      hair=hShadow(d)+fadeSk(44,42)+burns(`url(#${id}lf)`)+`<path d="${d}" fill="${hc}"/><path d="M38.2 21.8 Q38.6 19.6 41.4 19.6 L78.6 19.6 Q81.4 19.6 81.8 21.8 Q60 26.4 38.2 21.8Z" fill="${hcL}" opacity=".22"/><path d="M38.6 22.4 Q60 26.8 81.4 22.4" stroke="${hcL}" stroke-width="1.2" fill="none" opacity=".35" stroke-linecap="round"/>`
        +`<clipPath id="${id}t"><path d="${d}"/></clipPath><g clip-path="url(#${id}t)">${dots(39,81,25,44,3.4,.45,hcD,.22)}</g>`;break;}
    case'Cornrows':{// flat to the skull: braid rows follow the hairline up and back, with thin scalp parts between them
      const d=`M37 56 C36 38 46 30.5 60 30.5 C74 30.5 84 38 83 56 C81.5 46 75.5 41 60 41 C44.5 41 38.5 46 37 56Z`;
      hair=hShadow(d)+`<path d="${d}" fill="${hc}"/>${burns()}`+inCap(d,
        rows([36.4,43,49.6,56.6,63.4,70.4,77,83.6],.42,(P,C,E)=>`<path d="M${P} Q${C} ${E}" stroke="${sk}" stroke-width="1.1" fill="none" opacity=".6"/>`)
        +rows([39.7,46.3,53.1,60,66.9,73.7,80.3],.42,(P,C,E)=>{let s='';for(let t=.1;t<.95;t+=.085){const[a,b]=qp(P,C,E,t),[a2,b2]=qp(P,C,E,t+.01),l=Math.hypot(a2-a,b2-b),ux=(a2-a)/l,uy=(b2-b)/l,w=2.3*(1-t*.45);
          s+=`M${(a-uy*w-ux*1.2).toFixed(2)} ${(b+ux*w-uy*1.2).toFixed(2)} L${a.toFixed(2)} ${b.toFixed(2)} L${(a+uy*w-ux*1.2).toFixed(2)} ${(b-ux*w-uy*1.2).toFixed(2)}`;}
          return`<path d="${s}" stroke="${txC}" stroke-width=".7" fill="none" opacity="${txO}" stroke-linecap="round" stroke-linejoin="round"/>`;}));break;}
    case'Box Braids':case'Locs':{const lc=st==='Locs',d=cap();
      mid=flare(lc?31.6:32.7)+(lc?strands([34.7,40.2,45.6],[95,98,92],6.2,'l'):strands([34.9,39.3,43.7,48.1],[104,107,101,105],4.6,'b'));
      hair=hShadow(d)+`<path d="${d}" fill="${hc}"/>`+inCap(d,lc
        ?rows([38.5,45,51.6,58.3,65,71.7,78.3,85],.5,(P,C,E)=>`<path d="M${P} Q${C} ${E}" stroke="${hcD}" stroke-width="1.3" fill="none" opacity=".55"/>`)
          +rows([41.7,48.3,55,61.7,68.3,75],.5,(P,C,E)=>{let s='';for(let t=.12;t<.9;t+=.16){const[a,b]=qp(P,C,E,t);s+=`M${(a-2.2).toFixed(2)} ${(b+.4).toFixed(2)} Q${a.toFixed(2)} ${(b-1).toFixed(2)} ${(a+2.2).toFixed(2)} ${(b+.4).toFixed(2)}`;}return`<path d="${s}" stroke="${txC}" stroke-width=".7" fill="none" opacity="${txO*.8}" stroke-linecap="round"/>`;})
        :rows([39.5,46,52.7,60,67.3,74,80.5],.45,(P,C,E)=>`<path d="M${P} Q${C} ${E}" stroke="${hcD}" stroke-width=".9" fill="none" opacity=".6"/>`)
          +rows([42.8,49.4,56.4,63.6,70.6,77.2],.45,(P,C,E)=>{let s='';for(let t=.1;t<.92;t+=.1){const[a,b]=qp(P,C,E,t),w=1.9*(1-t*.4);s+=`M${(a-w).toFixed(2)} ${(b+1).toFixed(2)} L${a.toFixed(2)} ${b.toFixed(2)} L${(a+w).toFixed(2)} ${(b+1).toFixed(2)}`;}return`<path d="${s}" stroke="${txC}" stroke-width=".65" fill="none" opacity="${txO}" stroke-linecap="round" stroke-linejoin="round"/>`;}))
        +`<path d="M46 32 Q58 27.6 70 30" stroke="${hcL}" stroke-width="1.6" fill="none" opacity=".25" stroke-linecap="round"/>`;break;}
    case'Locs Bun':{const d=cap(),bs=[-9,-5.4,-1.8,1.8,5.4,9];
      back=`<clipPath id="${id}b"><circle cx="60" cy="19" r="12"/></clipPath><circle cx="60" cy="19" r="12" fill="${hc}"/><g clip-path="url(#${id}b)">`
        +bs.map(o=>`<path d="M${60+o} 6 Q${60+o*1.45} 19 ${60+o} 32" stroke="${txC}" stroke-width="1.3" fill="none" opacity="${txO}"/>`).join('')
        +`<circle cx="63.5" cy="21.5" r="12" fill="none" stroke="${hcD}" stroke-width="3" opacity=".3"/></g><path d="M52 15 Q54 9.5 59 8.2" stroke="${hcL}" stroke-width="1.5" fill="none" opacity=".35" stroke-linecap="round"/>`;
      hair=hShadow(d)+`<path d="${d}" fill="${hc}"/>`+inCap(d,[39,45.5,52.5,60,67.5,74.5,81].map(x=>`<path d="M${x} ${x<44||x>76?50:46} Q${60+(x-60)*.95} 34 ${60+(x-60)*.12} 27.5" stroke="${txC}" stroke-width="1.3" fill="none" opacity="${txO}"/>`).join(''))
        +`<rect x="54" y="27.4" width="12" height="2.8" rx="1.4" fill="${hcD}"/><path d="M55.5 28.2 H64.5" stroke="${hcL}" stroke-width=".6" opacity=".35"/>`;break;}
    case'Twists':{// a mass of short two-strand twists: scalloped crown + scalloped fringe, one hatched column per twist; long twists hang behind the ears
      const top=[[36.8,58],[36,47],[37.6,38.6],[41.6,31.6],[47,26.6],[53.4,23.6],[60,22.6],[66.6,23.6],[73,26.6],[78.4,31.6],[82.4,38.6],[84,47],[83.2,58]];
      const hln=[[83.2,58],[82.2,50],[79.6,44.6],[75.4,41.4],[70.2,39.8],[65,39.2],[60,39],[55,39.2],[49.8,39.8],[44.6,41.4],[40.4,44.6],[37.8,50],[36.8,58]],hr=hln.slice().reverse();
      const d=`M36.8 58`+bump(top,2.6,60,48,-1)+bump(hln,1.7,60,60,1)+'Z';
      let grv='',hat='';for(let i=1;i<top.length-1;i++){const[a,b]=hr[i],[c,e]=top[i];grv+=`M${a} ${b} Q${((a+c)/2+(a-60)*.06).toFixed(2)} ${((b+e)/2).toFixed(2)} ${c} ${e}`;}
      for(let i=0;i<top.length-1;i++){const P=[(hr[i][0]+hr[i+1][0])/2,(hr[i][1]+hr[i+1][1])/2+1],Q=[(top[i][0]+top[i+1][0])/2,(top[i][1]+top[i+1][1])/2],L2=Math.hypot(Q[0]-P[0],Q[1]-P[1]),ux=(Q[0]-P[0])/L2,uy=(Q[1]-P[1])/L2,n=Math.max(1,Math.round(L2/3.1));
        for(let k=0;k<n;k++){const f=(k+.5)/n,a=P[0]+(Q[0]-P[0])*f,b=P[1]+(Q[1]-P[1])*f,w=1.9;hat+=`M${(a+uy*w+ux*.9).toFixed(2)} ${(b-ux*w+uy*.9).toFixed(2)} L${(a-uy*w-ux*.9).toFixed(2)} ${(b+ux*w-uy*.9).toFixed(2)}`;}}
      mid=flare(30.8)+strands([33.4,39.2],[83,88],5.8,'t'); // mass shows behind the ear from the cap down, so the twists grow from the head, not the earlobe
      hair=hShadow(d)+`<path d="${d}" fill="${hc}"/>`+inCap(d,`<path d="${grv}" stroke="${hcD}" stroke-width="1.2" fill="none" opacity=".55"/><path d="${hat}" stroke="${txC}" stroke-width=".75" fill="none" opacity="${txO}" stroke-linecap="round"/>`)
        +`<path d="M45 29.6 Q51 25.4 57.6 24.6" stroke="${hcL}" stroke-width="1.5" fill="none" opacity=".3" stroke-linecap="round"/>`;break;}
    case'Curly Top':{// high fade on the sides, a crop of tight curls on top with a curly (bumpy) hairline
      const top=[[40.8,45],[39.6,38.6],[41.2,32.6],[44.8,28],[49.6,25],[54.8,23.4],[60,23],[65.2,23.4],[70.4,25],[75.2,28],[78.8,32.6],[80.4,38.6],[79.2,45]];
      const hln=[[79.2,45],[76.4,41.4],[71.6,39.2],[65.9,38.1],[60,37.8],[54.1,38.1],[48.4,39.2],[43.6,41.4],[40.8,45]];
      const d=`M40.8 45`+bump(top,2.2,60,48,-1)+bump(hln,1.5,60,60,1)+'Z';
      hair=hShadow(d)+fadeSk(40,44)+burns(`url(#${id}lf)`)+`<path d="${d}" fill="${hc}"/>`
        +curls([[46,31],[53,27.4],[60,26.6],[67,27.4],[74,31],[43.6,37.2],[50,34],[56.6,32.4],[63.4,32.4],[70,34],[76.4,37.2]],txC,txO*.75)
        +`<path d="M47 27.6 Q53 24.6 59 24.4" stroke="${hcL}" stroke-width="1.5" fill="none" opacity=".3" stroke-linecap="round"/>`;break;}
    case'Mohawk':case'Faux-hawk':{const mo=st==='Mohawk';
      // the sides lie flat on the scalp (opaque skin/hair blend, no see-through helmet); a shaved mohawk side shows natural stubble even when the crest is dyed
      const sb0=natC,sd0=mix(sk,sb0,(mo?.3:.45)*(lu(sb0)-lu(sk)>.35?.4:1)),sd=!mo&&Math.abs(lu(sd0)-lu(sk))<.07?mix(sk,sb0,.8):sd0; // both hawks: only the crest carries the dye; the faux-hawk's longer sides must still read on a same-tone skin
      const fin=mo?`M53.5 40.8 Q49 24 54 9 Q58 17 61 6 Q65 17 67 10 Q71 26 66.5 40.8 Q60 40 53.5 40.8Z`:`M49.6 41.4 Q48.6 25 56 15 Q59 22 62 13 Q67 22 70.4 41.4 Q60 39.8 49.6 41.4Z`;
      hair=`<path d="${skull}" fill="${sd}" clip-path="url(#${id}k)"/>${burns(sd,1)}`+inCap(skull,dots(38,82,31.5,50,3.2,.4,shade(sd,-.3),mo?.25:.3))+hShadow(fin)+`<path d="${fin}" fill="${hc}"/>`
        +inCap(fin,`<path d="${mo?'M57 40 Q54 25 56.5 12 M63 40 Q66 26 65 13':'M53 41 Q53 28 57.5 18 M67 41 Q66 28 63.5 16'}" stroke="${txC}" stroke-width=".9" fill="none" opacity="${txO*.8}" stroke-linecap="round"/><path d="M60 39 Q58.6 24 ${mo?'60.6 9':'60.4 17'}" stroke="${hcL}" stroke-width="1.5" fill="none" opacity=".35" stroke-linecap="round"/>`);break;}
    // solid styles get the same hcD outline as the textured ones, so the hairline still reads when hair and skin are close in colour
    case'Spiky':{const d=cap(),zz=`L34.5 31 L42.5 35 L43 21.5 L49.5 30 L53.5 17.5 L57.5 28 L60.5 19.5 L63.5 28 L67 17.5 L70.8 30 L77 21.5 L77.5 35 L85.5 31`;
      hair=hShadow(d)+`<path d="${d}" fill="${hc}" stroke="${hcD}" stroke-width=".8"/><path d="M38.5 47 ${zz} L81.5 47 C79 39 70 36 60 36 C50 36 41 39 38.5 47Z" fill="${hc}"/>`
        +`<path d="M37.6 44.5 ${zz} L82.4 44.5" stroke="${hcD}" stroke-width=".8" stroke-linejoin="round" fill="none"/><path d="M45 33 L44 25 M55 30 L54.5 22 M65.5 30 L66 22 M75 33 L76 25" stroke="${hcL}" stroke-width="1" opacity=".35" stroke-linecap="round"/>`;break;}
    case'Side Part':{const d=`M36.5 57 C33 32 48 23.5 62 24.5 C78 25.5 87 36 83.5 57 C83 46 78 40 66 39 C58 39 50 41 44 44 C40 47 38 51 36.5 57Z`;
      hair=hShadow(d)+`<path d="${d}" fill="${hc}" stroke="${hcD}" stroke-width=".8"/><path d="M69 26.5 Q70.5 32 71 39.3" stroke="${hcD}" stroke-width="1.3" stroke-linecap="round" fill="none"/>`
        +`<path d="M66 29 Q52 30 42 41 M64 33 Q54 34 46 41" stroke="${hcL}" stroke-width="1.1" fill="none" opacity=".35" stroke-linecap="round"/>`;break;}
    case'Slicked Back':{const d=cap(39.5);hair=hShadow(d)+`<path d="${d}" fill="${hc}" stroke="${hcD}" stroke-width=".8"/>`
      +`<path d="M43.5 41 Q45.5 34 51.5 30.6 M52 39.4 Q53.4 34 56.6 31 M68 39.4 Q66.6 34 63.4 31 M76.5 41 Q74.5 34 68.5 30.6" stroke="${hcL}" stroke-width="1.1" opacity=".32" fill="none" stroke-linecap="round"/><path d="M45 34 Q55 29 66 30.5" stroke="${hcL}" stroke-width="2.6" opacity=".35" fill="none" stroke-linecap="round"/>`;break;}
    case'Man Bun':{const d=cap(41);back=`<ellipse cx="60" cy="21.5" rx="8.6" ry="7.6" fill="${hc}" stroke="${hcD}" stroke-width=".8"/><path d="M54 21 Q60 15.5 66 21 M55.5 24.5 Q60.5 20.5 64.5 24" stroke="${hcD}" stroke-width="1" fill="none" opacity=".55" stroke-linecap="round"/>`;
      hair=hShadow(d)+`<path d="${d}" fill="${hc}" stroke="${hcD}" stroke-width=".8"/><path d="M41 47 Q46 33 56.5 28 M79 47 Q74 33 63.5 28 M48 41 Q51 33 57.5 28.5 M72 41 Q69 33 62.5 28.5" stroke="${hcD}" stroke-width=".9" fill="none" opacity=".45"/><rect x="54.6" y="25" width="10.8" height="3.2" rx="1.6" fill="${hcD}"/>`;break;}
    case'Mullet':{// short choppy front, long back: the back hair only shows below the ears and hangs behind the neck onto the shoulders;
      // the head casts a darker rim onto it so the jaw never melts into same-coloured hair
      const d=`M37.6 53 C36 34 46 27.5 60 27.5 C74 27.5 84 34 82.4 53 C81.5 45 75.5 41 60 41 C44.5 41 38.5 45 37.6 53Z`,mb=`M41 60 C40 68 40 76 39.6 82 C39.2 89 37.4 94 35 98.5 L39 99.2 L41.5 102.5 L45 99.6 L48.5 103 L52 100 L68 100 L71.5 103 L75 99.6 L78.5 102.5 L81 99.2 L85 98.5 C82.6 94 80.8 89 80.4 82 C80 76 80 68 79 60Z`;
      mid=`<path d="${mb}" fill="${hc}" stroke="${hcD}" stroke-width=".8" stroke-linejoin="round"/>`+inCap(mb,`<ellipse cx="60" cy="59" rx="25" ry="28.8" fill="${hcD}" opacity=".55"/>`)
        +`<path d="M41.5 82 Q41.5 91 44.5 98.5 M78.5 82 Q78.5 91 75.5 98.5" stroke="${hcD}" stroke-width=".9" fill="none" opacity=".6"/>`;
      const fr=`M44.5 43.2 L47.6 47 L50.4 42.2 L53.6 46 L56.6 41.4 L59.6 44.8 L62.4 41.2 L65.4 44.2 L67.8 41.6`;
      const mbn=`M36.4 45.6 L43.6 44.2 C42 49.4 41.3 53.6 41.3 57.2 Q41.1 59 39.4 59.6 Q38 58.2 37 56Z`;
      hair=hShadow(d,`${fr} Z`)+`<path d="${mbn} ${mr(mbn)}" fill="${hc}" stroke="${hcD}" stroke-width=".8" stroke-linejoin="round" clip-path="url(#${id}k)"/>`+`<path d="${d}" fill="${hc}" stroke="${hcD}" stroke-width=".8"/><path d="${fr} L66 39 L46 40Z" fill="${hc}"/><path d="${fr}" stroke="${hcD}" stroke-width=".8" stroke-linejoin="round" fill="none"/>`
        +`<path d="M47 32 Q55 28.5 64 29.5" stroke="${hcL}" stroke-width="1.6" fill="none" opacity=".35" stroke-linecap="round"/><path d="M41 49 Q42 42 47 37 M79 49 Q78 42 73 37" stroke="${hcD}" stroke-width=".9" fill="none" opacity=".45" stroke-linecap="round"/>`;break;}
    case'Long & Wavy':{const d=cap(),wl=`M38 43 C33 50 35.5 57 32.5 64 C29.5 71 35 77 31.5 84 C28.5 90 31 96 29.5 99 C35 102 42 99.5 44.5 94 C42.5 89 46.5 84 44.5 78 L45 58Z`;
      back=`<path d="M40 60 L80 60 L80 96 Q60 101 40 96Z" fill="${hcD}"/>`;
      mid=`<path d="${wl} ${mr(wl)}" fill="${hc}" stroke="${hcD}" stroke-width=".8" stroke-linejoin="round"/>`;
      // one mass of hair: the cap is outlined only over the crown (down to where the side hair leaves it) and along the hairline,
      // so its lower side edges never draw a second contour inside the falling side hair
      const ol=`M37.73 43.42 C40.29 31.12 49.26 27 60 27 C70.74 27 79.71 31.12 82.27 43.42 M37.3 57 C38 46 44 40.5 60 40.5 C76 40.5 82 46 82.7 57`;
      hair=hShadow(d)+`<path d="${d}" fill="${hc}"/><path d="${ol}" stroke="${hcD}" stroke-width=".8" fill="none" stroke-linecap="round"/>${shine}`;break;}
    case'Shaved':{// opaque stubble that lies exactly on the skull (same treatment as mohawk sides), not a see-through halo.
      // a dyed shave is a deliberate coloured buzz: mostly dye with darker specks, never a muddy half-tone that reads as a bruise
      const sd=shavedC;
      hair=`<path d="${skull}" fill="${sd}" clip-path="url(#${id}k)"/>${burns(sd,1)}`+inCap(skull,dots(38,82,31.5,50,3.2,.4,shade(sd,-.3),dyed?.35:.3)
        +`<path d="M60 31.5 C75 31.5 83 44 83 58 L79.5 58 C80 45 73 35 60 31.5Z" fill="#000" opacity=".07"/>`)
        +`<path d="M45 37 Q51 33.2 58 32.6" stroke="#fff" stroke-width="1.6" fill="none" opacity=".12" stroke-linecap="round"/>`;break;}
    case'Bald':hair=`<ellipse cx="50.5" cy="38" rx="7.5" ry="3.6" fill="${shade(sk,.45)}" opacity=".55" transform="rotate(-22 50.5 38)"/><ellipse cx="57.5" cy="34" rx="1.8" ry="1.1" fill="${shade(sk,.6)}" opacity=".5"/>`;break;}
  // face
  const f=(L.face||0)%FACES.length,sn=L.skin||0,hl=(n=>(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255)(parseInt(hc.slice(1),16));
  const bc0=old?shade('#c9c9c9',-.22):shade(natC,lu(natC)>.6?-.42:-.15); // light hair gets darker brows so they still read on pale skin
  const bcol=Math.abs(lu(bc0)-lu(sk))>=.12?bc0:lu(sk)>.5?shade(bc0,-.4):shade(sk,-.55); // brows never melt into a same-tone skin
  const mc=sn>=4?shade(sk,-.6):'#5a2d22'; // mouth/lid line colour that always contrasts with the skin
  const browD=[[`M45 53 Q50 51 55 53`,`M65 53 Q70 51 75 53`],[`M45 52 Q50 47.5 55 51`,`M65 51 Q70 47.5 75 52`],[`M44.5 50.5 L55 54.5`,`M75.5 50.5 L65 54.5`],[`M45 52.5 Q50 51 55 52.5`,`M65 51 Q70 49 75 51.5`],[`M45 53 Q50 51.5 55 53`,`M65 50.5 Q70 46.5 75 50`],[`M44 50 L55 55`,`M76 50 L65 55`],[`M45 54 Q50 53 55 54.5`,`M65 51.5 Q70 48.5 75 51.5`]][f];
  const brI=(L.br||0)%BROWS.length,brW=[2.8,3.9,1.9,3][brI];
  const brows=browD.map((d,i)=>`<path d="${d}" stroke="${bcol}" stroke-width="${brW}" stroke-linecap="round" fill="none"${brI===3&&i===1?' stroke-dasharray="5.6 4.4 20"':''}/>`).join('');
  const eyI=(L.ey||0)%EYES.length,[erx,ery]=[[4.4,3.3],[5.1,2.6],[4.9,4.1],[4.6,3.3]][eyI],ecol=g(EYECOL,L.ec)[1],lidC=shade(sk,sn>=4?-.45:-.3);
  // ry0 is the opening the expression asks for (3.3 open, 2.9 glaring); the eye shape scales it
  const eye=(x,ry0)=>{const ry=+(ry0>3?ery:Math.min(3.3,ery*ry0/3.3)).toFixed(2),ir=+Math.min(eyI===2?2.6:2.4,ry-.25).toFixed(2),open=ry0>3;
    return`<ellipse cx="${x}" cy="60" rx="${erx}" ry="${ry}" fill="#fff"/><circle cx="${x+.4}" cy="60.3" r="${ir}" fill="${ecol}"/><circle cx="${x+.4}" cy="60.3" r="${+(ir*.5).toFixed(2)}" fill="#0d0d0d"/><circle cx="${x+1.3}" cy="59.3" r=".8" fill="#fff"/>`
      +(eyI===3&&open?`<path d="M${x-erx-.5} ${+(59.4-ry).toFixed(2)} H${x+erx+.5} V${+(60-ry*.3).toFixed(2)} Q${x} ${+(60-ry*.78).toFixed(2)} ${x-erx-.5} ${+(60-ry*.3).toFixed(2)}Z" fill="${sk}"/><path d="M${x-erx-.3} ${+(60-ry*.3).toFixed(2)} Q${x} ${+(60-ry*.78).toFixed(2)} ${x+erx+.3} ${+(60-ry*.3).toFixed(2)}" stroke="${mc}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`
        :open?`<path d="M${+(x-erx+.2).toFixed(2)} ${+(60-ry*.45).toFixed(2)} Q${x} ${+(59.1-ry*1.42).toFixed(2)} ${+(x+erx-.2).toFixed(2)} ${+(60-ry*.45).toFixed(2)}" stroke="${lidC}" stroke-width=".9" fill="none" stroke-linecap="round" opacity=".8"/>`:'');};
  const glint=`<path d="M44 57.5 L49 57.5 M66 57.5 L71 57.5" stroke="#fff" stroke-width="1.3" opacity=".5" stroke-linecap="round"/>`;
  const sunG=[4,5].includes((L.head||0)%HEADW.length)&&f===3; // "too cool" under goggles / face mask: tint their eye windows instead of stacking sunglasses inside them
  const angry=f===2||f===5,lid=angry?`<path d="M45.2 56.6 L54.9 56.6 L54.9 59.6 L45.6 57.6Z M74.8 56.6 L65.1 56.6 L65.1 59.6 L74.4 57.6Z" fill="${sk}"/><path d="M45.6 57.6 L54.4 59.4 M74.4 57.6 L65.6 59.4" stroke="${mc}" stroke-width="1.4" stroke-linecap="round"/>`:'';
  const eyes=f===3&&!sunG?`<path d="M36.6 56.6 L43 56.4 M77 56.4 L83.4 56.6" stroke="#16181d" stroke-width="2.2"/><rect x="41" y="55" width="16" height="9.5" rx="4.5" fill="#16181d" stroke="#2b2f38" stroke-width=".8"/><rect x="63" y="55" width="16" height="9.5" rx="4.5" fill="#16181d" stroke="#2b2f38" stroke-width=".8"/><rect x="56.6" y="57" width="6.8" height="2.2" fill="#16181d"/>${glint}`
    :f===6?`<path d="M45.5 60.5 Q50 63 54.5 60.5 M45.5 60.5 l-1.4 -1" stroke="${mc}" stroke-width="2" fill="none" stroke-linecap="round"/>`+eye(70,3.3)
    :eye(50,angry?2.9:3.3)+eye(70,angry?2.9:3.3)+lid;
  const ln=(d,sw)=>`<path d="${d}" stroke="${mc}" stroke-width="${sw}" stroke-linecap="round" fill="none"/>`;
  const noseD=['M60 62 Q57.2 69 59 70.6 Q61.5 71.6 64 69.8','M55.6 68.6 Q55.4 71.4 58.2 71 Q60 72.2 61.8 71 Q64.6 71.4 64.4 68.6','M57.6 69.2 Q60 71.8 62.4 69.2','M60.6 59.5 L59.2 69.4 Q60.4 71.6 63.6 70.2','M57 68.4 Q56.2 71.4 59.2 71 Q60 71.6 60.8 71 Q63.8 71.4 63 68.4 M59 64.5 Q58.4 67 58.6 68.4'][(L.no||0)%NOSES.length];
  // marks sit on the skin, under facial hair and headwear
  const mkI=(L.mk||0)%MARKS.length,scarC=shade(sk,sn>=4?.3:-.2),dot=(x,y,r)=>`<circle cx="${x}" cy="${y}" r="${r}"/>`;
  const marks=['',
    `<g fill="${shade(sk,-.3)}" opacity=".6">${[[44.5,66.5],[47,68.2],[49.6,66.8],[46,70.4],[51.2,69.2],[43.6,69.4],[75.5,66.5],[73,68.2],[70.4,66.8],[74,70.4],[68.8,69.2],[76.4,69.4],[57.4,66.2],[62.6,66.2],[60,64.6]].map(([x,y])=>dot(x,y,.62)).join('')}</g>`,
    `<g fill="${shade(sk,-.62)}">${dot(69.6,72.2,.95)}</g>`,
    `<path d="M46.8 48.8 L48.8 56.6" stroke="${scarC}" stroke-width="1.2" stroke-linecap="round"/>`,
    `<path d="M71.6 65.6 L76.6 70.6 M73 64.9 L71.9 66.3 M75.3 67.2 L74.2 68.6 M77.4 69.4 L76.3 70.8" stroke="${scarC}" stroke-width="1.05" stroke-linecap="round" fill="none"/>`,
    `<path d="M45.2 65.3 Q50 66.9 54.8 65.3 L54.3 67.6 Q50 69 45.7 67.6Z M65.2 65.3 Q70 66.9 74.8 65.3 L74.3 67.6 Q70 69 65.7 67.6Z" fill="#15161a" opacity=".93"/>`,
    `<path d="M53.6 63 Q60 61.4 66.4 63 L66 66 Q60 64.5 54 66Z" fill="#efe6d4" stroke="${shade(sk,-.34)}" stroke-width=".6" stroke-linejoin="round"/><path d="M57.4 62.6 V65 M62.6 62.6 V65" stroke="#cbbfa8" stroke-width=".6"/>`,
    `<g transform="rotate(-24 47.5 69.5)"><rect x="43" y="67.6" width="9" height="3.8" rx="1.7" fill="#ecc9a2" stroke="${shade('#ecc9a2',-.3)}" stroke-width=".5"/><rect x="45.9" y="67.9" width="3.2" height="3.2" rx=".6" fill="#dcb184"/></g>`][mkI];
  // closed mouths get a soft shadow under the lower lip (not where a beard or mouthguard covers the chin)
  const lipShade=[0,2,3,4,6].includes(f)&&[0,1,2,4].includes((L.fh||0)%FACIAL.length)?`<path d="M57.6 ${f===2?81.6:80.4} Q60 ${f===2?82.5:81.3} 62.4 ${f===2?81.6:80.4}" stroke="${shade(sk,sn>=5?-.3:-.16)}" stroke-width="1.1" fill="none" stroke-linecap="round" opacity=".5"/>`:'';
  const grinO='M49.5 72.5 Q60 86 70.5 72.5 Q60 75 49.5 72.5Z',fireO='M53 77 A7 5.5 0 1 0 67 77 A7 5.5 0 1 0 53 77Z';
  const mouths=[ln('M54 76 Q60 77.6 66 76',2.2),
    `<clipPath id="${id}m"><path d="${grinO}"/></clipPath><path d="${grinO}" fill="#5a1e1e"/><ellipse cx="60" cy="80.4" rx="6" ry="2.6" fill="#d9636b" clip-path="url(#${id}m)"/><path d="M51 73.2 Q60 75.6 69 73.2 L68.2 75.4 Q60 77.6 51.8 75.4Z" fill="#fff"/>`,
    ln('M53 78.5 Q60 74 67 78.5',2.4),
    ln('M54 76.5 Q60 77.4 66.5 75.6',2.2),
    ln('M53 76.4 Q61 78.8 67.4 75',2.2),
    `<clipPath id="${id}m"><path d="${fireO}"/></clipPath><path d="${fireO}" fill="#4a1414"/><ellipse cx="60" cy="81.3" rx="4.2" ry="2" fill="#b8434d" clip-path="url(#${id}m)"/><path d="M52 70 H68 V75.2 Q60 74 52 75.2Z" fill="#fff" clip-path="url(#${id}m)"/>`,
    ln('M51 74 Q60 82 69 74',2.3)];
  // mouthguard: each expression keeps its own mouth opening; the guard sits inside it as the upper band
  const gcol0=['','#e8f6ff','#1a1a1a',jc][L.guard||0],gcol=L.guard>1&&lu(gcol0)<.25?shade(gcol0,.3):gcol0;
  const gO=['M52.4 74.8 Q60 72.8 67.6 74.8 Q60 82 52.4 74.8Z',grinO,'M53.2 77.8 Q60 72.8 66.8 77.8 L65.8 80 Q60 76.6 54.2 80Z','M53.6 75.2 Q60 73.8 66.8 74.4 Q60 80.6 53.6 75.2Z','M53.4 75.2 Q60.6 75.2 68.2 72.8 Q62 80.4 53.4 75.2Z',fireO,'M51 74 Q60 82.5 69 74 Q60 76.5 51 74Z'][f];
  const gb=[76.4,76.5,76.8,76.4,76,75.6,77.2][f],gBand=c=>`<path d="M47 69 H73 V${gb} Q60 ${gb+.8} 47 ${gb}Z" fill="${c}" clip-path="url(#${id}g)"/>`;
  // on the small closed-mouth openings a dark inner rim shows parted lips above and below the band, so a coloured guard never reads as lipstick
  const gRim=[0,2,3,4].includes(f)?`<path d="${gO}" fill="none" stroke="#4a1414" stroke-width="1.6" stroke-linejoin="round" clip-path="url(#${id}g)"/>`:'';
  const mouth=L.guard?`<clipPath id="${id}g"><path d="${gO}"/></clipPath><path d="${gO}" fill="#4a1414"/>${L.guard===1?gBand('#fff')+`<g opacity=".55">${gBand('#9fd8f5')}</g>`:gBand(gcol)}<g clip-path="url(#${id}g)"><path d="M47 ${gb-1.3} Q60 ${gb-.5} 73 ${gb-1.3}" stroke="#fff" stroke-width=".7" fill="none" opacity="${L.guard===1?0:.3}"/><path d="M53.2 70 V${gb-.2} M56.6 70 V${gb+.2} M60 70 V${gb+.4} M63.4 70 V${gb+.2} M66.8 70 V${gb-.2}" stroke="${L.guard===1?'#7fa9c2':shade(gcol,lu(gcol)<.2?.35:-.35)}" stroke-width=".55" opacity=".7"/></g>${gRim}<path d="${gO}" fill="none" stroke="${mc}" stroke-width="1.1" stroke-linejoin="round"/>`:mouths[f]+lipShade;
  // facial hair (fills in naturally with age). Sideburns tuck under the hair cap, which is drawn later.
  let fh=L.fh||0;const autoStub=age>=31&&fh===0;if(autoStub)fh=1;const bald=st==='Bald',mUp=f===1||f===5; // dye stays on the head: beards keep a natural colour (same family as the brows)
  // facial hair never melts into a same-tone skin (brown beard on dark skin etc.): darken it until it separates, like the brows
  let fc=dyed?(old?'#c9c9c9':'#2a2a2a'):hc===HAIRCOL[6][1]?mix(hc,'#c77a2e',.45):hc; // natural red grows a gingery beard (pure red round a mouth reads as lipstick)
  // dark hair on dark skin is darkened until it separates. Light hair (blonde / platinum / grey) on light skin keeps the hair's own colour
  // (only nudged a touch deeper) so beard, sideburns and hair stay one colour; it separates from the skin through a stronger dark edge instead
  let fcS=fc;for(let i=0;i<3&&Math.abs(lu(fcS)-lu(sk))<.12;i++)fcS=shade(fcS,-.35); // strongly separated tone: used for stubble shadow
  const fcLt=lu(fc)>.5&&Math.abs(lu(fc)-lu(sk))<.12;
  fc=fcLt?mix(fc,fc===HAIRCOL[4][1]?'#7a5530':'#8f8a80',.16):fcS;
  const fcE=shade(fc,fcLt?-.5:-.32),fcT=lu(fc)<.2?shade(fc,.4):shade(fc,-.3); // edge colour / texture-stroke colour
  // fhP(): solid facial-hair pieces drawn as one mass with a thin darker edge round their union (outline pass, then the fills on top)
  const fhP=(ps,mid='')=>`<g fill="${fcE}" stroke="${fcE}" stroke-width="${fcLt?1.7:1.2}" stroke-linejoin="round">${ps.map(([d,t])=>`<path d="${d}"${t||''}/>`).join('')}</g>${mid}<g fill="${fc}">${ps.map(([d,t])=>`<path d="${d}"${t||''}/>`).join('')}</g>`;
  // mustache: full enough to read as hair (never a second lip); it lifts with an open mouth and tilts up with the smirk
  const mustD='M49.6 73.8 Q55 67.8 60 70.2 Q65 67.8 70.4 73.8 Q65 72.2 60 73.4 Q55 72.2 49.6 73.8Z',mustP=[mustD,f===4?' transform="rotate(-4 60 71) translate(0 -.8)"':mUp?' transform="translate(0,-1.2)"':''];
  const must=fhP([mustP]);
  // sideburns hug the jaw (clipped to the face) and widen into the beard; under faded/shaved hair they fade in from the temple
  const fadeHair=['Low Fade','Shaved','Mohawk','Faux-hawk','High-Top Fade','Curly Top','Bald'].includes(st),faceClip=`<clipPath id="${id}f"><ellipse cx="60" cy="58" rx="23" ry="26.5"/></clipPath>`;
  const sbL=bald?`M40.6 57.6 Q41.2 58.4 41.3 60 L41.4 62 Q42 70.5 44 76.5 L34 76.5 L34 68 Q37.4 63 40.6 57.6Z`:`M34 44 L41 45.4 L41.4 62 Q42 70.5 44 76.5 L34 76.5Z`;
  const sb=`${faceClip}${fadeHair?`<linearGradient id="${id}s" x1="0" y1="${bald?57.5:45}" x2="0" y2="${bald?64:60}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${fc}" stop-opacity=".3"/><stop offset="1" stop-color="${fc}"/></linearGradient>`:''}<path d="${sbL} ${sbL.replace(/(-?[\d.]+) (-?[\d.]+)/g,(m,x,y)=>`${+(120-x).toFixed(2)} ${y}`)}" fill="${fadeHair?`url(#${id}s)`:fc}" clip-path="url(#${id}f)"/>`;
  const drops='M50 72.4 Q48.4 77.5 52 81.6 L54.2 80.6 Q51.8 77.4 52.4 73.6Z M70 72.4 Q71.6 77.5 68 81.6 L65.8 80.6 Q68.2 77.4 67.6 73.6Z';
  const beardD='M38 64 C39 86 50 93 60 93 C70 93 81 86 82 64 C80 74 74 81 68 81.5 Q60 78.5 52 81.5 C46 81 40 74 38 64Z';
  const bigD='M38 61 C38 64.5 38.3 66.6 38.8 68.4 C36.6 90 50 104 60 104 C70 104 83.4 90 81.2 68.4 C81.7 66.6 82 64.5 82 61 L81 61 L79.4 68 C76.5 78 72 81.5 68 82 Q60 79 52 82 C48 81.5 43.5 78 40.6 68 L39 61Z';
  const goatD='M50.3 73 Q49.9 80 53.4 82.8 Q56.4 84.9 60 84.9 Q63.6 84.9 66.6 82.8 Q70.1 80 69.7 73 L67.4 75.2 Q67.6 79.6 64.5 80.6 Q60 79.4 55.5 80.6 Q52.4 79.6 52.6 75.2Z';
  // stubble covers the jaw, chin and upper lip; its cheek edge follows the face curve and it fades in below the ear's middle (mask),
  // so there is never a hard-topped block beside the eyes or a straight stripe down the temple
  const stubD='M30 52 L40.4 52 C40.9 56 41.2 59.5 41.5 62.6 Q43.4 70.4 50.5 72.4 Q55 70.8 60 71.8 Q65 70.8 69.5 72.4 Q76.6 70.4 78.5 62.6 C78.8 59.5 79.1 56 79.6 52 L90 52 L90 96 L30 96Z';
  const stubM=`<linearGradient id="${id}sg" gradientUnits="userSpaceOnUse" x1="0" y1="56.5" x2="0" y2="64.5"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient><mask id="${id}sm" maskUnits="userSpaceOnUse" x="20" y="40" width="80" height="70"><rect x="20" y="40" width="80" height="70" fill="url(#${id}sg)"/></mask>`;
  // light stubble (grey / blonde on darker skin): a darker growth shadow plus short hairs angled down along the jaw band only
  // (between the face edge and an inner ellipse), never a grid of pale dots over the whole lower face
  const hairs=(a0,a1,stp,rowsF)=>{let d='';for(let a=a0;a<=a1;a+=stp)for(const fr of rowsF){const h=v=>Math.abs(Math.sin(v)*43758.5453%1),j=h(a*12.9898+fr*78.233),j2=h(a*39.346+fr*11.135),j3=h(a*73.156+fr*52.235);
      if(j3<.22)continue;const r=(a+(j2-.5)*stp*.9)*Math.PI/180,ix=60+19*Math.cos(r),iy=60+19.5*Math.sin(r),ox=60+23*Math.cos(r),oy=58+26.5*Math.sin(r),t=Math.min(.95,Math.max(.1,fr+(j-.5)*.3)),x=ix+(ox-ix)*t,y=iy+(oy-iy)*t,
      l=Math.hypot(ox-ix,oy-iy),vx=(ox-ix)/l*.4+(j2-.5)*.5,vy=(oy-iy)/l*.4+.6,vl=Math.hypot(vx,vy),k=.32+j3*.2,ux=vx/vl*k,uy=vy/vl*k;
    d+=`M${(x-ux).toFixed(2)} ${(y-uy).toFixed(2)} l${(ux*2).toFixed(2)} ${(uy*2).toFixed(2)}`;}return d;};
  const stub=`${faceClip}${stubM}<g clip-path="url(#${id}f)"><g mask="url(#${id}sm)">`+(lu(fc)>lu(sk)
      ?`<path d="${stubD}" fill="${shade(sk,-.3)}" opacity="${autoStub?.2:.3}"/><path d="${autoStub?hairs(62,118,6,[.35,.75]):hairs(14,166,5.5,[.25,.55,.85])}" stroke="${fc}" stroke-width=".5" stroke-linecap="round" fill="none" opacity="${autoStub?.38:.5}"/>`
      :`<path d="${stubD}" fill="${fcS}" opacity="${old?.16:.22}"/>`)+`</g></g>`;
  // chin strap: a thin band of beard along the jaw (face clip minus an inner ellipse), thin at the sides, a little wider under the chin.
  // Always opaque hair colour: a strap much lighter than the skin (grey / blonde / platinum on darker skin) is deepened a touch and starts lower,
  // tapering in by shape (the band is only ~1 unit wide just under the ear), with a darker edge on its tufted inner line so it reads as hair
  const csLight=lu(fc)-lu(sk)>.2,csC=csLight?shade(fc,-.18):fc,csF=fadeHair&&!csLight&&!fcLt,csT=csLight||fcLt?61:csF?58:56;
  const csG=csF?`<linearGradient id="${id}cs" x1="0" y1="58" x2="0" y2="66" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${csC}" stop-opacity="0"/><stop offset="1" stop-color="${csC}"/></linearGradient>`:'';
  const csP=[];for(let a=0;a<=180;a+=10){const r=a*Math.PI/180;csP.push([+(60+22.2*Math.cos(r)).toFixed(2),+(57.6+23.2*Math.sin(r)).toFixed(2)]);}
  const csE=`M${csP[0][0]} ${csP[0][1]}`+bump(csP,.55,60,57.6,1),csIn=csE+` L37.8 50 L82.2 50Z`; // lower half: tufted edge; upper half is above the strap anyway
  const strap=`${faceClip}${csG}<clipPath id="${id}ct"><rect x="30" y="${csT}" width="60" height="60"/></clipPath><g clip-path="url(#${id}f)"><g clip-path="url(#${id}ct)"><path d="M30 30 H90 V100 H30Z ${csIn}" fill-rule="evenodd" fill="${csF?`url(#${id}cs)`:csC}"/>`
    +(csF?'':`<clipPath id="${id}cz"><path d="M30 30 H90 V100 H30Z ${csIn}" clip-rule="evenodd"/></clipPath><path d="${csE}" fill="none" stroke="${shade(csC,-.35)}" stroke-width="1.1" stroke-linejoin="round" opacity=".8" clip-path="url(#${id}cz)"/>`)+`</g></g>`;
  // soul patch: a small pointed tuft that always leaves skin between it and the lowest point of the mouth (or mouthguard opening)
  const spB=(L.guard?[79,79.8,80.6,78.3,77.8,83.1,78.8]:[77.9,79.3,79.7,78,78.7,82.5,79.2])[f],spT=+(spB+(f===5?1.1:1.5)).toFixed(2),spH=Math.max(2.8,Math.min(4,86.2-spT)),spY=+(spT+spH).toFixed(2);
  const spC=lu(fc)-lu(sk)>.15?mix(fc,sk,.35):fc,sy=v=>(spT+spH*v).toFixed(2);
  const spD=`M58.2 ${spT} Q60 ${(spT-.45).toFixed(2)} 61.8 ${spT} Q61.7 ${sy(.45)} 61.1 ${sy(.78)} L60.7 ${sy(.66)} L60.3 ${spY} L59.9 ${sy(.7)} L59.4 ${sy(.9)} L59.1 ${sy(.66)} L58.8 ${sy(.78)} Q58.3 ${sy(.45)} 58.2 ${spT}Z`;
  const soul=`<path d="${spD}" fill="${spC}" stroke="${shade(spC,-.38)}" stroke-width=".55" stroke-linejoin="round"/>`
    +`<path d="M59.2 ${sy(.12)} L59.5 ${sy(.62)} M60.3 ${sy(.1)} L60.3 ${sy(.72)} M61 ${sy(.12)} L60.8 ${sy(.6)}" stroke="${shade(spC,-.3)}" stroke-width=".4" stroke-linecap="round" opacity=".7"/>`;
  const gStr=f===5?' transform="translate(0 73) scale(1 1.13) translate(0 -73)"':''; // the wide-open shout stretches the goatee so there is real beard under the mouth
  const facial=['',stub,must,
    fhP([[goatD,gStr],mustP])+`<path${gStr} d="M55.8 82.4 l.35 1.5 M58.3 83 l.12 1.5 M61.7 83 l-.12 1.5 M64.2 82.4 l-.35 1.5 M51.5 77.2 l.35 1.5 M68.5 77.2 l-.35 1.5" stroke="${fcT}" stroke-width=".45" stroke-linecap="round" opacity=".55"/>`, // a few hair strokes so a thin goatee ring never reads as lips
    strap,
    fhP([[beardD],[drops],mustP],sb),
    fhP([[bigD],[drops],mustP],sb)+`<path d="M48 92 Q60 98 72 92" stroke="${shade(fc,-.25)}" stroke-width="1" fill="none" opacity=".6"/>`,
    soul][fh];
  const wk=shade(sk,sn>=5?-.36:-.22);
  const pwLow=(L.head||0)%HEADW.length===3&&['Bald','Shaved','Buzz Cut','360 Waves','Mohawk','Faux-hawk'].includes(st),pwY=pwLow?48.5:44,pwH=pwLow?3.8:3.6;
  const wrinkles=old?`<path d="${pwLow?'M51 46.8 Q60 45 69 46.8 M52.5 49.6 Q60 48.3 67.5 49.6':'M50 45 Q60 43 70 45 M52 48.5 Q60 47 68 48.5'}" stroke="${wk}" stroke-width="1" fill="none" opacity=".6"/><path d="M44.6 57.8 l-2.3 -1.1 M44.6 60.2 l-2.6 0 M44.6 62.6 l-2.3 1.1 M75.4 57.8 l2.3 -1.1 M75.4 60.2 l2.6 0 M75.4 62.6 l2.3 1.1" stroke="${wk}" stroke-width=".9" stroke-linecap="round" opacity=".85"/><path d="M53.5 69.5 Q50.5 73 51.5 77 M66.5 69.5 Q69.5 73 68.5 77" stroke="${wk}" stroke-width=".9" fill="none" opacity=".5"/>`:'';
  // headwear
  // bands are drawn a little wide and clipped (#h) to a padded skull, so their ends wrap round the head instead of sticking out
  const hw=(L.head||0)%HEADW.length;
  const band=(y,hgt,col,edge)=>`<g clip-path="url(#${id}h)"><path d="M35 ${y} C40 ${y-6.5} 50 ${y-9} 60 ${y-9} C70 ${y-9} 80 ${y-6.5} 85 ${y} L85 ${y+hgt} C80 ${y+hgt-6} 70 ${y+hgt-8.5} 60 ${y+hgt-8.5} C50 ${y+hgt-8.5} 40 ${y+hgt-6} 35 ${y+hgt}Z" fill="${col}"${edge?` stroke="${edge}" stroke-width=".7"`:''}/>`;
  // band colours must stand out from what they sit on (hair, or skin on a bald/shaved head); bEdge gives every band a thin outline
  const hwRef=st==='Bald'?sk:st==='Shaved'?shavedC:dyed?hc:g(HAIRCOL,L.hc)[1],hwNow=st==='Bald'?sk:st==='Shaved'?shavedC:hc,pickC=(...cs)=>cs.find(c=>Math.abs(lu(c)-lu(hwRef))>=.2)||cs[cs.length-1],bEdge=c=>shade(c,lu(c)<.25?.38:-.4);
  const ninC=pickC(lightJ?'#1c1c1c':jc,jc,tc,'#e63946','#1c1c1c'),ninE=bEdge(ninC),pwC=pickC(tc,jc,lu(hwRef)>.5?'#1c1c1c':'#f2f2f2');
  const hbS=lu(jc)>.8?(lu(tc)<.8?tc:'#1d2b57'):jc; // headband stripe: jersey colour, unless the jersey is white
  // ninja tails hang from a knot at the back of the head; they're drawn behind the ears (see ninTails in the layer list)
  const ninTails=hw===2?`<path d="M82 47 C88 47.4 94 50.4 99.5 56 L97.3 58.8 C93 54.6 88 52 82 51.2Z" fill="${ninC}" stroke="${ninE}" stroke-width=".6" stroke-linejoin="round"/><path d="M82 49.6 C87 52.6 90.6 56.6 92.7 63.4 L89.6 64.2 C88 58.6 85.6 55 82 52.6Z" fill="${shade(ninC,lu(ninC)<.25?.14:-.22)}" stroke="${ninE}" stroke-width=".6" stroke-linejoin="round"/>`:'';
  // pre-wrap: thin foam wrap with a few stretch creases
  const bz=(a,b,c,d,t)=>(1-t)**3*a+3*(1-t)**2*t*b+3*(1-t)*t*t*c+t**3*d;
  const creases=(y,h)=>{let d='';for(const t of[.42,.74]){const t2=t+.06,x1=bz(35,40,50,60,t),y1=bz(y,y-6.5,y-9,y-9,t),x2=bz(35,40,50,60,t2),y2=bz(y+h,y+h-6,y+h-8.5,y+h-8.5,t2),p=`M${(x1+(x2-x1)*.18).toFixed(2)} ${(y1+(y2-y1)*.18).toFixed(2)} L${(x1+(x2-x1)*.82).toFixed(2)} ${(y1+(y2-y1)*.82).toFixed(2)}`;d+=p+' '+mr(p)+' ';}
    return d+`M60.3 ${y-8.4} L59.7 ${y+h-9.1}`;};
  const gogLens=`M43 57.6 C43 55.6 44.4 54.8 46.4 54.8 L54.2 54.8 C56.4 54.8 57.6 55.8 57.6 57.8 L57.6 61.6 C57.6 64.2 56 65.6 53.4 65.6 L46.6 65.6 C44.4 65.6 43 64.4 43 62.2Z`,
    gogFrame=`M40.4 57.4 C40.4 54.2 42.8 52.8 46 52.8 L74 52.8 C77.2 52.8 79.6 54.2 79.6 57.4 L79.6 62.4 C79.6 66 77.2 67.6 73.6 67.6 L66.4 67.6 C64 67.6 62.8 66.4 62 64.6 Q61.2 62.6 60 62.6 Q58.8 62.6 58 64.6 C57.2 66.4 56 67.6 53.6 67.6 L46.4 67.6 C42.8 67.6 40.4 66 40.4 62.4Z`,
    maskH=`M43.4 58.4 C43.4 55.2 46.4 54.3 50 54.3 C53.6 54.3 56.8 55.2 56.8 58.6 C56.8 62.9 53.8 64.9 50 64.9 C46.2 64.9 43.4 62.6 43.4 58.4Z M76.6 58.4 C76.6 55.2 73.6 54.3 70 54.3 C66.4 54.3 63.2 55.2 63.2 58.6 C63.2 62.9 66.2 64.9 70 64.9 C73.8 64.9 76.6 62.6 76.6 58.4Z`,
    // the shell stops over the nose / upper lip so it never cuts across a mouth or mustache (with a mustache its nose notch rides higher, clear of the hair)
    mskM=[2,3,5,6].includes(fh),maskD=`M40.2 54.2 C40.6 48.4 49 45.4 60 45.4 C71 45.4 79.4 48.4 79.8 54.2 L79.4 61.4 C79 66.2 76.4 68.6 72 69.2 ${mskM?'C69.4 69.4 67.4 67.6 64.6 67.3 Q60 66.9 55.4 67.3 C52.6 67.6 50.6 69.4 48':'C68.6 69.6 66 69.2 64.2 69.8 Q60 71.4 55.8 69.8 C54 69.2 51.4 69.6 48'} 69.2 C43.6 68.6 41 66.2 40.6 61.4Z ${maskH}`;
  const head=['',band(45.5,6,lu(hwRef)>.6?jc:'#ffffff',bEdge(lu(hwRef)>.6?jc:'#ffffff'))+`<path d="M35 48.6 C40 42.5 50 40 60 40 C70 40 80 42.5 85 48.6" stroke="${hbS}" stroke-width="2" fill="none"/></g>`,
    band(45.5,6,ninC,ninE)+`</g><ellipse cx="83.4" cy="49.4" rx="2.5" ry="3.1" fill="${shade(ninC,lu(ninC)<.25?.1:-.16)}" stroke="${ninE}" stroke-width=".7"/><path d="M82.6 47.6 Q83.8 49.4 82.8 51.4" stroke="${ninE}" stroke-width=".6" fill="none" opacity=".8" stroke-linecap="round"/>`,
    band(pwY,pwH,pwC,bEdge(pwC))+`<path d="${creases(pwY,pwH)}" stroke="${shade(pwC,lu(pwC)<.25?.3:-.22)}" stroke-width=".7" stroke-linecap="round" fill="none"/></g>`,
    // goggles: one moulded rubber frame with two lens windows and a nose notch, wide elastic strap running up over the ears
    `<g clip-path="url(#${id}k)"><path d="M41.4 56.6 Q39 55 36 53.6 M78.6 56.6 Q81 55 84 53.6" stroke="#22252b" stroke-width="3" fill="none"/></g>`
      +`<path d="${gogFrame} ${gogLens} ${mr(gogLens)}" fill="#22252b" fill-rule="evenodd" stroke="#111214" stroke-width=".7" stroke-linejoin="round"/><path d="${gogLens} ${mr(gogLens)}" fill="${sunG?'#141414':'#7cc8f2'}" fill-opacity="${sunG?.8:.36}"/>`
      +`<path d="M45.6 53.7 L55 53.7 M65 53.7 L74.4 53.7" stroke="#fff" stroke-opacity=".22" stroke-width=".9" stroke-linecap="round"/>`
      +(sunG?glint:`<path d="M45 56.9 L49 56.9 M65 56.9 L69 56.9" stroke="#fff" stroke-opacity=".6" stroke-width="1" stroke-linecap="round"/>`),
    // face mask: clear shell with eye cut-outs; a dark under-edge + light top edge so it reads on every skin tone
    `<g clip-path="url(#${id}k)"><path d="M40.6 52.6 L35.5 51.4 M41 66.4 L36.5 68.6 M79.4 52.6 L84.5 51.4 M79 66.4 L83.5 68.6" stroke="#1d1d1d" stroke-width="1.8" stroke-linecap="round"/></g>`
      +(sunG?`<path d="${maskH}" fill="#141414" fill-opacity=".88"/>${glint}`:'')+`<path d="${maskD}" fill="#f4fbff" fill-opacity=".1" fill-rule="evenodd" stroke="#4f6f82" stroke-opacity=".6" stroke-width="2.4" stroke-linejoin="round"/><path d="${maskD}" fill="none" stroke="#f4fbff" stroke-opacity=".9" stroke-width="1.1" stroke-linejoin="round"/>`
      +`<path d="M44.4 65.6 Q46.4 67.8 50.6 68.4 M76.4 52.2 Q78 54.4 78.2 57" stroke="#fff" stroke-opacity=".55" stroke-width="1" fill="none" stroke-linecap="round"/>`][hw];
  // ---- body & uniform: shapes are written for the LEFT side; mir() mirrors them onto the right (x -> 120-x) ----
  const mir=d=>d.replace(/(-?[\d.]+) (-?[\d.]+)/g,(m,x,y)=>`${+(120-x).toFixed(2)} ${y}`),pair=d=>d+' '+mir(d);
  const lum=h=>{const n=parseInt(hx6(h).slice(1),16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255;};
  const tcE=Math.abs(lum(tc)-lum(jc))<.15?shade(jc,lum(jc)>.5?-.5:.5):tc; // trim that always contrasts with the jersey
  const shirt=js==='Shooting Shirt',nw=+(9+(w-30)*.3).toFixed(1),n0=60-nw-1,n1=60+nw+1,sx=lx+9;
  const qx=+((sx+n0)/2).toFixed(2),qy=+(101-.17*(qx-sx)).toFixed(2),hx=+((sx+60-nw)/2).toFixed(2),hy=+(100.9-.17*(hx-sx)).toFixed(2);
  // arm = deltoid + upper arm; its inner side tucks under the jersey
  const arm=`M${lx-14} 140 C${lx-14} 121 ${lx-10} 107 ${lx+2} 103 C${lx+6} 101.6 ${lx+8} 101 ${lx+10.5} 101.2 L${lx+15} 140Z`;
  const armO=`M${lx-14.7} 140 C${lx-14.7} 120.8 ${lx-10.6} 106.3 ${lx+1.8} 102.3 C${lx+6} 100.9 ${lx+8} 100.4 ${lx+10.5} 100.6 L${lx+16} 140Z`;
  // tank: V neck -> strap -> armhole -> side seam
  const tankEdge=`Q${qx} ${qy} ${sx} 101 C${lx+8.6} 112 ${lx+5} 119 ${lx-.5} 120 L${lx-.5} 140`;
  const shirtEdge=`Q${hx} ${hy} ${sx} 100.9 C${lx+5} 105 ${lx-.4} 110 ${lx-.5} 121 L${lx-.5} 140`;
  const jersey=shirt?`M${60-nw} 99 Q60 106 ${60+nw} 99 ${mir(shirtEdge)} L${lx-.5} 140 L${lx-.5} 121 C${lx-.4} 110 ${lx+5} 105 ${sx} 100.9 Q${hx} ${hy} ${60-nw} 99Z`
    :`M${n0} 98.5 Q${n0+4} 110 60 110 Q${n1-4} 110 ${n1} 98.5 ${mir(tankEdge)} L${lx-.5} 140 L${lx-.5} 120 C${lx+5} 119 ${lx+8.6} 112 ${sx} 101 Q${qx} ${qy} ${n0} 98.5Z`;
  const trap=`M${60-nw} 86 C${60-nw} 94 ${n0-1} 97.6 ${n0-6} 101.4 L${n0} ${shirt?99.6:98.6} L${60-nw+3} ${shirt?99.6:98.6} L${60-nw+3} 86Z`;
  const vHole=`M${n0} 98.5 Q${n0+4} 110 60 110 Q${n1-4} 110 ${n1} 98.5Z`;
  const neck=shirt?`M${60-nw} 78 L${60-nw} 99.7 Q60 106.7 ${60+nw} 99.7 L${60+nw} 78Z`:`M${60-nw} 78 L${60-nw} 101 Q60 108 ${60+nw} 101 L${60+nw} 78Z`;
  // shooting-shirt sleeves (drawn under the torso, so the torso hides their inner ends)
  const sleeve=`M${lx-15} 122.6 C${lx-15.2} 116 ${lx-11.6} 106 ${lx+1.8} 102.2 C${lx+6} 100.8 ${lx+9} 100.4 ${lx+12} 100.3 L${lx+14} 120.6Z`;
  const shirtSleeves=shirt?`<path d="${pair(sleeve)}" fill="${jc}"/><path d="${pair(`M${lx-15} 121.5 L${lx+14} 119.5`)}" stroke="${tcE}" stroke-width="2.2"/>`:'';
  // trims, all clipped to the jersey (strokes are double width so the visible half has the right weight)
  const stripe=d=>`M${sx+d} 97 C${lx+8.6+d} 112 ${lx+5+d*.6} ${119+d} ${lx-.5+d} ${120+d} L${lx-.5+d} 140`;
  const trims=shirt?`<path d="M${60-nw} 99 Q60 106 ${60+nw} 99" stroke="${tcE}" stroke-width="6.2" fill="none"/><path d="${pair(`M${sx} 100.9 C${lx+5} 105 ${lx-.4} 110 ${lx-.5} 121`)}" stroke="${shade(jc,-.22)}" stroke-width="2" fill="none"/>`
    :`<path d="${pair(`M${sx} 101 C${lx+8.6} 112 ${lx+5} 119 ${lx-.5} 120`)}" stroke="${tcE}" stroke-width="4.8" fill="none"/>`
    +(js==='Throwback Stripes'?`<path d="${pair(stripe(4.6))}" stroke="${tcE}" stroke-width="2.6" fill="none" stroke-linejoin="round"/><path d="${pair(stripe(8.2))}" stroke="${shade(jc,-.35)}" stroke-width="2" fill="none" stroke-linejoin="round"/>`:'')
    +(js==='Pinstripes'?`<path d="${Array.from({length:Math.ceil((rx-lx)/4.4)+1},(_,i)=>`M${+(lx+1.2+i*4.4).toFixed(1)} 96 V140`).join(' ')}" stroke="${tcE}" stroke-width=".75" opacity=".6" fill="none"/>`:'')
    +(js==='Side Panels'?`<path d="${pair(`M${lx-1} 119 C${lx+3} 119.4 ${lx+6.4} 117.6 ${lx+8.2} 114.6 L${lx+9.4} 140 L${lx-1} 140Z`)}" fill="${tcE}"/><path d="${pair(`M${lx+10.9} 116 L${lx+12} 140`)}" stroke="${shade(jc,-.3)}" stroke-width="1" fill="none"/>`:'')
    +(js==='Sash'?`<path d="M${sx-2} 99 L${sx+9} 99 L${rx+1} 133 L${rx+1} 140 L${rx-7.5} 140Z" fill="${tcE}" opacity=".92"/><path d="M${sx+11.6} 99 L${rx+1} 129.6" stroke="${shade(jc,-.3)}" stroke-width="1.1" fill="none"/>`:'')
    +`<path d="M${n0} 98.5 Q${n0+4} 110 60 110 Q${n1-4} 110 ${n1} 98.5" stroke="${tcE}" stroke-width="4.8" fill="none"/>`;
  // arm gear (clipped to the arms). Under a shooting shirt it moves below the cuff.
  const gy=shirt?4.5:0,inkC=(L.skin||0)>=7?'#7f9cbd':(L.skin||0)>=6?'#6886aa':(L.skin||0)>=5?'#3a4b78':'#1d2433';
  const sleeveL=`<path d="M${lx-17} 140 L${lx-17} 110.5 Q${lx-6} 113 ${lx+1} 121.5 L${lx+16} 126 L${lx+16} 140Z" fill="#161616"/><path d="M${lx-17} 111.9 Q${lx-6} 114.4 ${lx+1} 122.9" stroke="#3a3a3a" stroke-width="1.3" fill="none"/>`;
  const sleeves=n=>n>1?sleeveL+mir(sleeveL):sleeveL;
  const bands=`<path d="${pair(`M${lx-16} ${122.5+gy} Q${lx-3} ${125+gy} ${lx+9} ${121+gy} L${lx+9.5} ${126.8+gy} Q${lx-3} ${130.6+gy} ${lx-16} ${128.2+gy}Z`)}" fill="${tc}"/><path d="${pair(`M${lx-16} ${127.7+gy} Q${lx-3} ${130.1+gy} ${lx+9.5} ${126.3+gy}`)}" stroke="${shade(tc,-.28)}" stroke-width=".8" fill="none"/>`;
  const star=(x,y,r)=>`M${x} ${y-r} L${x+r*.3} ${y-r*.3} L${x+r} ${y} L${x+r*.3} ${y+r*.3} L${x} ${y+r} L${x-r*.3} ${y+r*.3} L${x-r} ${y} L${x-r*.3} ${y-r*.3}Z`;
  const inkLines=shirt?`M${lx-12} 127.5 L${lx-9.5} 131.5 L${lx-7} 127.5 L${lx-4.5} 131.5 L${lx-2} 127.5`
    :`M${lx-16} 109.2 Q${lx-4} 112.6 ${lx+10} 107.6 M${lx-16} 111.6 Q${lx-4} 115 ${lx+10} 110 M${lx-8.5} 118.5 Q${lx-4} 114 ${lx+.5} 118.5 Q${lx-4} 123 ${lx-8.5} 118.5Z M${lx-12} 126 L${lx-9.5} 130 L${lx-7} 126 L${lx-4.5} 130 L${lx-2} 126`;
  const ink=((L.skin||0)>=5?`<path d="${mir(inkLines)}" stroke="#fff" stroke-width="2.8" opacity=".16" fill="none" stroke-linejoin="round"/>`:'')
    +`<path d="${mir(inkLines)}" stroke="${inkC}" stroke-width="1.5" fill="none" opacity=".9" stroke-linejoin="round"/>`
    +`<path d="${mir(star(lx-9,135.5,2.4)+' '+star(lx-3.8,137.6,1.7))}" fill="${inkC}" opacity=".9"/>`+(shirt?'':`<circle cx="${rx+4}" cy="118.5" r="1.5" fill="${inkC}" opacity=".9"/>`);
  const armGear=['',sleeves(1),sleeves(2),bands,ink,ink+sleeves(1)][L.arms||0];
  // jewellery: studs/hoops hang from the visible earlobes (both ears); the chain drapes from behind the neck with a bail + pendant
  const jew=(L.jew||0)%JEWEL.length,cc=jc==='#e0a815'||jc==='#ff8a1f'||tc==='#f2c14e'?'#dfe4ea':'#f2c14e',ccD=shade(cc,-.35),pY=fh===6?1.6:0; // under a big beard the chain hangs a little lower so its bottom still shows
  const stud=`<circle cx="35.4" cy="65.6" r="1.5" fill="#f4f8ff" stroke="#8e9aab" stroke-width=".5"/><circle cx="84.6" cy="65.6" r="1.5" fill="#f4f8ff" stroke="#8e9aab" stroke-width=".5"/><circle cx="34.9" cy="65.1" r=".45" fill="#fff"/><circle cx="84.1" cy="65.1" r=".45" fill="#fff"/>`;
  const hoop=`<g fill="none" stroke-width="1.3"><circle cx="35.3" cy="68.4" r="2.6" stroke="${ccD}" stroke-width="1.9"/><circle cx="84.7" cy="68.4" r="2.6" stroke="${ccD}" stroke-width="1.9"/><circle cx="35.3" cy="68.4" r="2.6" stroke="#f2c14e"/><circle cx="84.7" cy="68.4" r="2.6" stroke="#f2c14e"/></g>`;
  const chD=`M${60-nw+.6} 92.5 Q${60-nw+2} ${102.4+pY} 60 ${103.6+pY} Q${60+nw-2} ${102.4+pY} ${60+nw-.6} 92.5`;
  const chain=`<path d="${chD}" stroke="${ccD}" stroke-width="2.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${chD}" stroke="${cc}" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    +`<path d="M60 ${103.4+pY} V${105.2+pY}" stroke="${ccD}" stroke-width="1.2"/><circle cx="60" cy="${107+pY*.6}" r="${fh===6?1.9:2.1}" fill="${cc}" stroke="${ccD}" stroke-width=".8"/><circle cx="59.3" cy="${106.3+pY*.6}" r=".6" fill="#fff" opacity=".7"/>`;
  const jewelry=['',stud,hoop,'',stud][jew];
  const bl=lum(jc),bgSvg=bg?`<rect width="120" height="140" rx="16" fill="url(#${id})"/><rect width="120" height="140" fill="url(#${id}sp)"/><circle cx="60" cy="58" r="44" fill="none" stroke="#fff" stroke-opacity=".07" stroke-width="6"/><g opacity=".16" fill="#fff">${[[14,18],[26,11],[96,14],[107,24],[19,33],[101,37],[9,48],[111,52]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3?0.9:1.3}"/>`).join('')}</g>`:'';
  const defs=`<defs>${bg?`<radialGradient id="${id}" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="${shade(jc,bl<.22?.35:bl>.55?-.52:-.2)}"/><stop offset="1" stop-color="${shade(jc,bl<.22?-.15:-.72)}"/></radialGradient><clipPath id="${id}c"><rect width="120" height="140" rx="16"/></clipPath><radialGradient id="${id}sp" cx="50%" cy="-8%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="${id}vg" x1="0" y1="0" x2="0" y2="1"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></linearGradient>`:''}<linearGradient id="${id}jf" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".24"/><stop offset=".3" stop-color="#fff" stop-opacity=".07"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient><clipPath id="${id}a"><path d="${pair(armO)}"/></clipPath><clipPath id="${id}j"><path d="${jersey}"/></clipPath><clipPath id="${id}k"><path d="${faceD}"/></clipPath><clipPath id="${id}h"><ellipse cx="60" cy="57.5" rx="23.8" ry="27.4"/></clipPath><linearGradient id="${id}lf" gradientUnits="userSpaceOnUse" x1="0" y1="45" x2="0" y2="56"><stop offset="0" stop-color="${fadeC}"/><stop offset="1" stop-color="${fadeC}" stop-opacity="0"/></linearGradient></defs>`;
  // brows: under goggles they are lifted clear of the frame and drawn beneath it; under the clear mask they are drawn beneath the shell (tinted by it),
  // and the mouth goes under the mask too so its rim stays on top
  const browsL=hw===4?`<g transform="translate(0,${angry?-3.2:-2.2})">${brows}</g>`:hw===5&&angry?`<g transform="translate(0,-1)">${brows}</g>`:brows;
  const numF=lightJ?'#151515':'#ffffff',numS=Math.abs(lum(tcE)-lum(numF))<.25?jc:tcE;
  return`<svg viewBox="0 0 120 140" width="${size}" height="${Math.round(size*140/120)}" style="flex:none">${defs}${bgSvg}${bg?`<g clip-path="url(#${id}c)">`:''}${back}
  <path d="${pair(arm)}" fill="${sk}"/><path d="${pair(`M${lx+3.4} 106.5 C${lx-1.4} 110 ${lx-3.8} 115 ${lx-4.4} 121.5`)}" stroke="${shade(sk,-.2)}" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".6"/><g clip-path="url(#${id}a)">${armGear}</g>${shirtSleeves}
  ${shirt?'':`<path d="${vHole}" fill="${shade(sk,-.12)}" stroke="${shade(sk,-.12)}" stroke-width="1.6" stroke-linejoin="round"/>`}<path d="${pair(trap)}" fill="${sk}"/>
  <path d="${jersey}" fill="${jc}"/><g clip-path="url(#${id}j)">${trims}<rect x="0" y="70" width="120" height="70" fill="url(#${id}jf)"/></g>
  <text x="60" y="134" font-size="19" font-weight="800" text-anchor="middle" fill="${numF}" font-family="'Barlow Condensed','Bebas Neue',system-ui,sans-serif" letter-spacing=".5" stroke="${numS}" stroke-width="1.1" stroke-linejoin="round" paint-order="stroke">${L.num}</text>
  ${mid}${ninTails}<path d="${neck}" fill="${sk}"/><path d="M${60-nw} 78 L${60+nw} 78 L${60+nw} 88 Q60 96 ${60-nw} 88Z" fill="#000" opacity=".14"/>${jew>=3?chain:''}
  <ellipse cx="37" cy="61" rx="4.6" ry="7" fill="${sk}"/><ellipse cx="37.5" cy="61" rx="2.2" ry="4" fill="${skD}" opacity=".6"/><ellipse cx="83" cy="61" rx="4.6" ry="7" fill="${sk}"/><ellipse cx="82.5" cy="61" rx="2.2" ry="4" fill="${skD}" opacity=".6"/>
  <path d="${faceD}" fill="${sk}"/>
  <path d="M60 31.5 H96 V96 H60 V${chinY} C72 ${chinY-5.5} 79 69 79.5 58 C80 45 73 35 60 31.5Z" fill="#000" opacity=".07" clip-path="url(#${id}k)"/><ellipse cx="52" cy="47" rx="9" ry="6" fill="#fff" opacity="${sn>=5?.07:.1}"/><path d="M81.6 52 C82.6 58 82.2 66 79.4 72" stroke="#fff" stroke-opacity=".14" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="46" cy="70" rx="4" ry="2.4" fill="${sn>=5?'#b3263a':'#ff7a7a'}" opacity="${sn>=5?.2:.13}"/><ellipse cx="74" cy="70" rx="4" ry="2.4" fill="${sn>=5?'#b3263a':'#ff7a7a'}" opacity="${sn>=5?.2:.13}"/>
  ${wrinkles}<path d="${noseD}" stroke="${shade(sk,sn>=5?-.38:-.2)}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${marks}${facial}${st==='Mullet'&&hw>=4?browsL+hair:hair+(hw<4?head:'')+browsL}${eyes}${hw===5?mouth:''}${hw>=4?head:''}${jewelry}
  ${hw===5?'':mouth}${bg?`<rect width="120" height="140" fill="url(#${id}vg)"/></g><rect x=".5" y=".5" width="119" height="139" rx="15.5" fill="none" stroke="#fff" stroke-opacity=".1"/>`:''}</svg>`;}
