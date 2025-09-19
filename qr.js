import {store,keys} from './storage.js';
const qrBox=document.getElementById('qrBox');
const btnC=document.getElementById('contrast');
const btnF=document.getElementById('full');
const btnP=document.getElementById('png');

const last = store.get(keys.derniereSeance,null);
if(!last){ qrBox.innerHTML='<div class="sub">Aucune séance enregistrée.</div>'; }
else{
  try{
    const el=document.getElementById('qrcode'); el.innerHTML='';
    const data = JSON.stringify(last);
    const qr=new window.QRCode(el,{text:data,width:320,height:320,correctLevel: window.QRCode.CorrectLevel.M});
    window.__qrCanvas = el.querySelector('canvas');
  }catch(e){
    qrBox.innerHTML='<div class="sub">QR indisponible. Vérifie que la librairie CDN est accessible.</div>';
  }
}

btnC?.addEventListener('click',()=> document.body.classList.toggle('contrast-dark'));
btnF?.addEventListener('click',()=>{ if(qrBox.requestFullscreen) qrBox.requestFullscreen(); });
btnP?.addEventListener('click',()=>{
  const c=window.__qrCanvas; if(!c) return alert('QR non disponible.');
  const a=document.createElement('a'); a.download='qr.png'; a.href=c.toDataURL('image/png'); a.click();
});
