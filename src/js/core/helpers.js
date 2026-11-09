// ---------- helpers ----------
let R=Math.random;const rnd=(a,b)=>a+R()*(b-a), ri=(a,b)=>Math.floor(rnd(a,b+1));
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const gauss=()=>{let u=0,v=0;while(!u)u=R();while(!v)v=R();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
const pick=a=>a[Math.floor(R()*a.length)];
const f1=n=>(Math.round(n*10)/10).toFixed(1);
const ht=h=>`${Math.floor(h/12)}'${h%12}"`;

