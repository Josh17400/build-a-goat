// Witness test hook (inert unless run under Witness)
// every visible text element and control, in CSS px, so phone UI checks measure the real page (not the cartoon art)
function uiList(){const out=[],vh=innerHeight,vw=innerWidth;let n=0;
  for(const el of app.querySelectorAll('button,input,h1,h2,b,span,small,div,td,th')){const r=el.getBoundingClientRect();if(!r.width||!r.height||r.bottom<0||r.top>vh||r.right<0||r.left>vw)continue;
    const btn=el.tagName==='BUTTON'||el.tagName==='INPUT',own=[...el.childNodes].some(c=>c.nodeType===3&&c.textContent.trim());
    if(!btn&&!own)continue;if(!btn&&el.closest('button'))continue;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||+cs.opacity===0)continue;
    let rr=r;if(!btn){const rg=document.createRange();let L=1e9,T=1e9,Rr=-1e9,B=-1e9;for(const c of el.childNodes)if(c.nodeType===3&&c.textContent.trim()){rg.selectNodeContents(c);for(const q of rg.getClientRects()){L=Math.min(L,q.left);T=Math.min(T,q.top);Rr=Math.max(Rr,q.right);B=Math.max(B,q.bottom);}}if(Rr>L)rr={left:L,top:T,width:Rr-L,height:B-T};}
    out.push({id:'u'+(n++),kind:btn?'button':'text',rect:[rr.left,rr.top,rr.width,rr.height],text:(btn?(el.getAttribute('aria-label')||el.innerText):[...el.childNodes].filter(c=>c.nodeType===3).map(c=>c.textContent).join(' ')).trim().slice(0,60),font:parseFloat(cs.fontSize),tap:btn});}
  return out;}
if(globalThis.__witnessApi){document.documentElement.classList.add('wt');const W=globalThis.__witnessApi;W.start({name:'Build a GOAT',fps:30,
  reset({scene}={}){markIntroSeen();['bag_hof','bag_ach','bag_daily','bag_recent','bag_gtp','bag_diff','bag_rec','bag_goats','bag_gems','bag_gear',...Object.values(SV)].forEach(k=>Store.remove(k));RUNLOG=[];R=Math.random;S=newPlayer();render();
    // test scenes: jump straight to a screen (witness --scene hs|offers|college|draft|nba|decision|end)
    const order=['build','hs','offers','college','draft','nba','decision','end'],at=order.indexOf(scene||'build');if(at<=0)return;
    S.name='Test Prospect';applyArch(2);for(const k of SUBKEYS)S.attrs[k]=Math.min(90,S.attrs[k]+14);S.picked=['work','dur'];startCareer();S.bank=Math.max(0,S.bank);const sp=()=>{if(S.bank>0)smartSpend();};if(at===1){simHS();UI().seq=null;render();return;}
    for(let i=0;i<4;i++){simHS();sp();}if(at===2){UI().seq=null;render();return;}
    chooseSchool(0);simCol();sp();if(at===3){UI().seq=null;render();return;}
    declare();if(at===4){UI().seq=null;render();return;}
    S.stage='nba';let g=0;while(g++<6){if(S.pend)choose(S.pend.kind==='summer'?S.pend.opts.length-1:0);else{sp();simNBA();}}
    if(at===6){while(!S.pend&&S.stage==='nba'&&g++<30)simNBA();UI().seq=null;render();return;}
    if(at===5){if(S.pend)choose(0);UI().seq=null;render();return;}
    simEnd();UI().seq=null;render();},
  snapshot:()=>({ui:uiList(),stage:S.stage,name:S.name,pos:S.pos,ovr:OV(),bank:S.bank,age:S.age,hype:Math.round(S.hype),pick:S.pick??null,
    hs:S.hs.length,college:S.col.length,seasons:S.nba.length,decision:S.pend?S.pend.title:null,yourTurn:true,
    choices:W.dom.tappables().map(c=>({label:c.label,id:c.id})),screenText:W.dom.text(app).slice(0,1200)}),
  calls:{autosim:{args:'n build college fa',help:'sim n careers with a strategy; returns outcome stats',run:(n,b,col,f)=>autosim(+n||200,b||'smart',col||'smart',f||'random')},tap:{args:'id',help:'tap a choice',run:id=>{const c=W.dom.tappables({elements:true}).find(x=>x.id==id||x.label==id)||W.dom.tappables({elements:true}).find(x=>x.label.startsWith(id));if(c)c.el.scrollIntoView({block:"center"});return c?W.dom.tap(c.el):{error:'no such choice '+id};}}},
  scope:()=>({S})});}
