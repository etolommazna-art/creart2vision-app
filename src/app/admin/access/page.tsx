'use client'; import { useEffect, useState } from 'react';
export default function Access(){ const [items,setItems]=useState<any[]>([]);
  async function load(){ const r=await fetch('/api/admin/galleries'); const j=await r.json(); setItems(j.items||[]); }
  useEffect(()=>{ load() },[]);
  async function save(id:string, body:any){ const r=await fetch('/api/admin/galleries/'+id+'/access',{ method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) }); const j=await r.json(); if(!r.ok) alert(j.error||'Erreur'); else alert('Mis à jour'); load(); }
  async function sendPin(id:string, who:'client'|'guest'){ const r=await fetch('/api/admin/galleries/'+id+'/send-pin?who='+who,{ method:'POST' }); const j=await r.json(); if(!r.ok) alert(j.error||'Erreur'); else alert('PIN envoyé'); }
  return (<div className="grid gap-4"><div className="flex items-center justify-between"><h1>Contrôle d’accès</h1></div>
    <div className="card">{items.length===0?<p>Aucune galerie.</p>:<table className="w-full"><thead><tr><th className="text-left">Titre</th><th>Client</th><th>PIN client</th><th>Invités</th><th>PIN invités</th><th></th></tr></thead><tbody>{items.map(g=>(<tr key={g.id}><td>{g.title}</td><td>{g.clientRequireCode?'Code':''}</td><td><input defaultValue={g.clientAccessCode||''} onBlur={(e)=>save(g.id,{ clientAccessCode:e.currentTarget.value })} /></td><td>{g.guestRequireCode?'Code':''}</td><td><input defaultValue={g.guestAccessCode||''} onBlur={(e)=>save(g.id,{ guestAccessCode:e.currentTarget.value })} /></td><td className="text-right"><button className="badge" onClick={()=>sendPin(g.id,'client')}>Envoyer PIN client</button> <button className="badge" onClick={()=>sendPin(g.id,'guest')}>Envoyer PIN invités</button></td></tr>))}</tbody></table>}</div>
  </div>);
}
