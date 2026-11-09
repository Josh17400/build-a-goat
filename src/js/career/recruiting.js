// ---------- recruiting stars ----------
function starNext(){const s=ovr()+S.hype*0.35,n=[58,65,72].find(x=>s<x);return n?Math.ceil(n-s):0;}
const rankStars=r=>r<=10?5:r<=35?4:r<=75?3:2;
function stars(){const s=ovr()+S.hype*0.35,c=S.stage==='hs'||S.stage==='offers'?classRank():null;return Math.max(s>=72?5:s>=65?4:s>=58?3:2,c?rankStars(c.rank):2,S.starFloor||0);}
