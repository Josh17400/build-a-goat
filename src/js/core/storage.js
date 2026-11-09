// ---------- storage: the one place the game touches the device's saved data ----------
// Every other file asks Store, or better the owner of a saved thing (gems(), hallList(), achHave() ...).
// Store never throws: with storage switched off (private browsing, a full disk) reads come back empty
// and writes are dropped; `set` says whether the write landed. Values are strings, as on the device.
// obj / list / json parse a value and fall back to a fresh {} / [] / null when it is missing or damaged.
// onChange(fn) is told the key after every write or removal that landed (the iOS app mirrors progress from it).
const Store=(()=>{
  const dev=()=>localStorage; // looked up on every call, so tests can swap the device's storage
  const get=k=>{try{return dev().getItem(k);}catch{return null;}};
  const subs=[],changed=k=>{for(const f of subs)try{f(k);}catch(e){console.warn(e);}};
  const set=(k,v)=>{try{dev().setItem(k,v);}catch{return false;}changed(k);return true;};
  const remove=k=>{try{dev().removeItem(k);}catch{return;}changed(k);};
  const keys=()=>{const out=[];try{for(let i=0;i<dev().length;i++)out.push(dev().key(i));}catch{}return out;};
  const parse=(k,empty)=>{const s=get(k);if(!s)return empty();try{return JSON.parse(s);}catch{return empty();}};
  return{get,set,remove,keys,onChange:f=>{subs.push(f);},
    json:k=>parse(k,()=>null),
    obj:k=>{const v=parse(k,()=>({}));return v&&typeof v==='object'&&!Array.isArray(v)?v:{};},
    list:k=>{const v=parse(k,()=>[]);return Array.isArray(v)?v:[];},
    setJson:(k,v)=>set(k,JSON.stringify(v)),
    // false where the page has no storage at all, or reading it is refused
    ok:()=>{try{dev().getItem('bag_intro');return true;}catch{return false;}}};
})();

