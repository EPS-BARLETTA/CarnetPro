export function makeSeance(eleve, activite, champs={}, notes=''){
  return {
    app:'CarnetPro',
    version:'1.0',
    eleve,
    seance:{
      date: champs.date || new Date().toISOString().slice(0,10),
      activite,
      champs,
      notes
    }
  };
}
export function flattenSeance(s){
  const base = {
    Nom: s.eleve?.nom || '',
    Prénom: s.eleve?.prenom || '',
    Classe: s.eleve?.classe || '',
    Sexe: s.eleve?.sexe || '',
    Activité: s.seance?.activite || '',
    Date: s.seance?.date || '',
    Notes: s.seance?.notes || ''
  };
  for(const [k,v] of Object.entries(s.seance?.champs||{})){ base[k]=v; }
  return base;
}
