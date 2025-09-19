import {store,keys} from './storage.js';
const canvas = document.getElementById('chart1');
const ctx = canvas.getContext('2d');

function weeklyTotals(){
  const data=store.get(keys.seances,[]);
  const map=new Map();
  data.forEach(s=>{
    if(s.seance?.activite!=='Course') return;
    const d=new Date(s.seance.date||new Date());
    const first=new Date(d); first.setDate(d.getDate()-((d.getDay()+6)%7)); // monday
    const key=first.toISOString().slice(0,10);
    const km=Number(s.seance?.champs?.distance_km||0);
    map.set(key, (map.get(key)||0)+km);
  });
  const entries=[...map.entries()].sort((a,b)=>a[0].localeCompare(b[0]));
  return {labels: entries.map(e=>e[0]), values: entries.map(e=>e[1])};
}

function draw(){
  const {labels, values} = weeklyTotals();
  // clear
  ctx.clearRect(0,0,canvas.width, canvas.height);
  // axes
  const padding=50; const w=canvas.width, h=canvas.height;
  const plotW=w-padding*2, plotH=h-padding*2;
  ctx.strokeStyle='#000'; ctx.beginPath(); ctx.moveTo(padding, padding); ctx.lineTo(padding, h-padding); ctx.lineTo(w-padding, h-padding); ctx.stroke();
  const maxV=Math.max(5, Math.max(...values,0));
  const bw = values.length? plotW/values.length*0.6 : 40;
  values.forEach((v,i)=>{
    const x=padding + (plotW/(values.length||1))*i + (plotW/(values.length||1)-bw)/2;
    const y=h-padding - (v/maxV)*plotH;
    ctx.fillRect(x, y, bw, (v/maxV)*plotH);
  });
  // labels
  ctx.font='12px system-ui'; ctx.textAlign='center';
  labels.forEach((lab,i)=>{
    const x=padding + (plotW/(labels.length||1))*i + (plotW/(labels.length||1))/2;
    ctx.fillText(lab.slice(5), x, h-padding+14);
  });
  ctx.textAlign='right'; ctx.fillText('km/sem', padding-6, padding-6);
}

document.getElementById('refresh')?.addEventListener('click', draw);
draw();
