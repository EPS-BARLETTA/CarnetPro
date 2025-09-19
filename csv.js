import {store,keys} from './storage.js';
import {flattenSeance} from './schema.js';

const dl = (name, text, mime='text/plain')=>{
  const blob=new Blob([text],{type:mime+';charset=utf-8;'});
  const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; a.click(); URL.revokeObjectURL(url);
};

const csvLine = (obj)=>{
  const headers = Object.keys(obj);
  const row = headers.map(h=>{
    const v = String(obj[h]??'');
    return /[",
]/.test(v) ? '"'+v.replace(/"/g,'""')+'"' : v;
  }).join(',');
  return headers.join(',') + '\n' + row;
};

const lastCsvBtn = document.getElementById('csv-last');
const allCsvBtn = document.getElementById('csv-all');
const allJsonBtn = document.getElementById('json-all');

if(lastCsvBtn) lastCsvBtn.onclick=()=>{
  const s=store.get(keys.derniereSeance,null);
  if(!s) return alert('Aucune séance.');
  const flat=flattenSeance(s);
  dl('seance.csv', csvLine(flat), 'text/csv');
};
if(allCsvBtn) allCsvBtn.onclick=()=>{
  const arr=store.get(keys.seances,[]).map(flattenSeance);
  if(!arr.length) return alert('Aucune séance.');
  const headers=[...new Set(arr.flatMap(o=>Object.keys(o)))];
  const rows = arr.map(o=> headers.map(h=>{
    const v=String(o[h]??'');
    return /[",
]/.test(v)? '"'+v.replace(/"/g,'""')+'"' : v;
  }).join(',')).join('\n');
  dl('seances.csv', headers.join(',')+'\n'+rows, 'text/csv');
};
if(allJsonBtn) allJsonBtn.onclick=()=>{
  dl('seances.json', JSON.stringify(store.get(keys.seances,[]), null, 2), 'application/json');
};
