import {store,keys} from './storage.js';
import {h} from './ui.js';
import {makeSeance} from './schema.js';

const activitiesEl = document.getElementById('activities');
const form = document.getElementById('form');
const fields = document.getElementById('fields');
const actTitle = document.getElementById('actTitle');
const notes = document.getElementById('notes');
const btnSave = document.getElementById('save');

const eleve = store.get(keys.eleve,null);
if(!eleve || !eleve.nom || !eleve.prenom || !eleve.classe || !eleve.sexe){
  alert('Renseigne ton identité d\'abord.');
  location.href='identite.html';
}

const ACTIVITES = [
  {id:'Course', fields:[
    {k:'date', label:'Date', type:'date'},
    {k:'duree_min', label:'Durée (min)', type:'number', step:'1'},
    {k:'distance_km', label:'Distance (km)', type:'number', step:'0.01'},
    {k:'allure_sec_km', label:'Allure (sec/km)', type:'number', step:'1'},
    {k:'rpe', label:'RPE (1-10)', type:'number', min:'1', max:'10', step:'1'}
  ]},
  {id:'Musculation', fields:[
    {k:'date', label:'Date', type:'date'},
    {k:'exercice', label:'Exercice', type:'text'},
    {k:'series', label:'Séries', type:'number', step:'1'},
    {k:'reps', label:'Répétitions', type:'number', step:'1'},
    {k:'charge_kg', label:'Charge (kg)', type:'number', step:'0.5'},
    {k:'rpe', label:'RPE (1-10)', type:'number', min:'1', max:'10', step:'1'}
  ]},
  {id:'Natation', fields:[
    {k:'date', label:'Date', type:'date'},
    {k:'nage', label:'Nage', type:'text'},
    {k:'distance_m', label:'Distance (m)', type:'number', step:'1'},
    {k:'temps_sec', label:'Temps (sec)', type:'number', step:'1'},
    {k:'rpe', label:'RPE (1-10)', type:'number', min:'1', max:'10', step:'1'}
  ]},
  {id:'Sports collectifs', fields:[
    {k:'date', label:'Date', type:'date'},
    {k:'sport', label:'Sport', type:'text'},
    {k:'role', label:'Rôle', type:'text'},
    {k:'temps_jeu_min', label:'Temps de jeu (min)', type:'number', step:'1'},
    {k:'intensite', label:'Intensité (1-10)', type:'number', min:'1', max:'10', step:'1'}
  ]},
  {id:'Autre', fields:[
    {k:'date', label:'Date', type:'date'},
    {k:'intitule', label:'Intitulé', type:'text'},
    {k:'duree_min', label:'Durée (min)', type:'number', step:'1'},
    {k:'details', label:'Détails', type:'text'}
  ]}
];

ACTIVITES.forEach(a=>{
  const tile = h('button',{class:'tile', type:'button', onClick:()=>openForm(a)},[
    h('div',{class:'name'},a.id), h('div',{class:'sub'},'Saisir une séance')
  ]);
  activitiesEl.appendChild(tile);
});

let current=null;
function openForm(act){
  current=act; actTitle.textContent=act.id; fields.innerHTML='';
  act.fields.forEach(f=>{
    const wrap = h('div',{},[h('div',{class:'label'},f.label)]);
    const input = h('input',{class:'input', id:f.k, type:f.type||'text'});
    if(f.step) input.step=f.step; if(f.min) input.min=f.min; if(f.max) input.max=f.max;
    if(f.type==='date' && !input.value) input.valueAsDate=new Date();
    wrap.appendChild(input); fields.appendChild(wrap);
  });
  notes.value=''; form.style.display='block'; window.scrollTo({top:document.body.scrollHeight,behavior:'smooth'});
}

btnSave.addEventListener('click', ()=>{
  if(!current){ alert('Choisis une activité.'); return; }
  const champs={};
  current.fields.forEach(f=>{ const el=document.getElementById(f.k); if(!el) return; const v=el.value; if(v!==''&&v!==undefined) champs[f.k] = (f.type==='number'? Number(v):v); });
  const s = makeSeance(eleve, current.id, champs, notes.value||'');
  store.set(keys.derniereSeance, s);
  const all = store.get(keys.seances, []); all.push(s); store.set(keys.seances, all);
  alert('✅ Séance enregistrée.');
});
