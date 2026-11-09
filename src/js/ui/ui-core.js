// ---------- UI ----------
const app=document.getElementById('app');
function act(fn,...a){if((fn===choose||fn===chooseSummer)&&!document.documentElement.classList.contains('wt')&&performance.now()-(UI().seqT||0)<500)return;fn(...a);if(fn===choose&&UI().auto&&!UI().seq)autoStep();else render();}
const UI=()=>S.ui||(S.ui={tab:'setup',open:null,spend:false});
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
// every emoji in the game's text is swapped for a custom icon when a screen is drawn
const EMO_RE=/(?:\p{Extended_Pictographic}|[←-⇿⌀-⏿■-◿☀-➿⬀-⯿])(?:️|‍(?:\p{Extended_Pictographic}|[☀-➿]))*️?/gu;
function emo(m){if(typeof EMOJI_ICON==='undefined')return m;const v=EMOJI_ICON[m.replace(/️/g,'')]||EMOJI_ICON[m];if(!v)return'';const[nm,cls]=Array.isArray(v)?v:[v,''];return icon(nm,'ici '+(cls||''));}
// The league is the NABL (National American Basketball League) on screen. Internal strings keep 'NBA' (award keys like
// 'All-NBA 1st', achievement ids, function names), so saves and checks are untouched: only drawn text, aria-label and title change.
const LEAGUE_TEXT=[[/\bG League Ignite\b/g,'Minor League Select'],[/\bG League\b/g,'Minor League'],[/\bNBA\b/g,'NABL']];
const LEAGUE_RE=/\bNBA\b|\bG League\b/;
function leagueText(s){for(const[r,t]of LEAGUE_TEXT)s=s.replace(r,t);return ptsText(s);}
// skill rewards are paid as bonus points now, so "+4 Post Moves, +1 IQ" reads "+5 pts"
let PTS_RE=null;
function ptsText(s){if(s.indexOf('+')<0)return s;if(!PTS_RE){const L=[...new Set([...Object.values(SUBS).flat().map(x=>x[1]),'Basketball IQ','IQ','Rebounding','every Defense rating','Post'])].sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('|'),one=`(?:to )?(?:${L})`;
    PTS_RE=new RegExp(`\\+(\\d+) (${one}(?:(?:, | & | and )${one})*)(?![\\w-])`,'g');}
  s=s.replace(PTS_RE,(m,n,l)=>`+${+n*(l.split(/, | & | and /).length)} pts`);
  return s.replace(/\+(\d+) pts(?:, | and )\+(\d+) pts/g,(m,a,b)=>`+${+a+ +b} pts`).replace(/\+(\d+) pts(?:, | and )\+(\d+) pts/g,(m,a,b)=>`+${+a+ +b} pts`);}
function leagueize(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode()))if(LEAGUE_RE.test(n.nodeValue)||n.nodeValue.indexOf('+')>=0)n.nodeValue=leagueText(n.nodeValue);
  for(const el of root.querySelectorAll('[aria-label],[title]'))for(const a of['aria-label','title']){const v=el.getAttribute(a);if(v&&LEAGUE_RE.test(v))el.setAttribute(a,leagueText(v));}}
function iconize(root){leagueize(root);if(typeof EMOJI_ICON==='undefined')return;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),todo=[];let n;
  while((n=w.nextNode())){EMO_RE.lastIndex=0;if(EMO_RE.test(n.nodeValue))todo.push(n);}
  for(const t of todo){const s=t.nodeValue;let out='',last=0;EMO_RE.lastIndex=0;for(const m of s.matchAll(EMO_RE)){out+=esc(s.slice(last,m.index))+emo(m[0]);last=m.index+m[0].length;}out+=esc(s.slice(last));
    const tpl=document.createElement('template');tpl.innerHTML=out;t.replaceWith(tpl.content);}
  for(const ev of root.querySelectorAll('.ev')){const f=ev.firstElementChild;if(!f||f.tagName.toLowerCase()!=='svg'||ev.childNodes.length<=2||[...ev.childNodes].indexOf(f)>1)continue;const sp=document.createElement('span');while(f.nextSibling)sp.appendChild(f.nextSibling);ev.appendChild(sp);}
  for(const el of root.querySelectorAll('[aria-label],[title]'))for(const a of['aria-label','title']){const v=el.getAttribute(a);if(v){EMO_RE.lastIndex=0;if(EMO_RE.test(v))el.setAttribute(a,v.replace(EMO_RE,'').replace(/\s+/g,' ').trim());}}}
const pips=n=>`<span class="pip">${[1,2,3,4,5].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</span>`;
const starsHTML=n=>`<span class="stars" role="img" aria-label="${n} of 5 stars">${[0,1,2,3,4].map(i=>`<svg viewBox="0 0 24 24" width="13" height="13"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5L2.6 9.4l6.5-.8z" fill="${i<n?'currentColor':'none'}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`).join('')}</span>`;
function dock(inner){return inner?`<div class="dock"><div class="in">${inner}</div></div>`:'';}

