export function h(tag, attrs={}, children=[]){
  const el = document.createElement(tag);
  Object.entries(attrs||{}).forEach(([k,v])=>{
    if(k==='class') el.className=v;
    else if(k.startsWith('on') && typeof v==='function') el.addEventListener(k.slice(2), v);
    else el.setAttribute(k,v);
  });
  (Array.isArray(children)?children:[children]).forEach(c=>{
    if(c==null) return;
    if(typeof c==='string') el.insertAdjacentHTML('beforeend', c);
    else el.appendChild(c);
  });
  return el;
}
