'use client'; import { useState } from 'react';
function getViewerToken(prefix:string){ const k='viewer_'+prefix; let v=localStorage.getItem(k); if(!v){ v=crypto.randomUUID(); localStorage.setItem(k, v); } return v; }
export default function GuestView({ token }:{ token:string }){
  const [email,setEmail]=useState(''); const [code,setCode]=useState(''); const [ok,setOk]=useState(false); const [items,setItems]=useState<any[]>([]);
  const viewerToken=getViewerToken('guest_'+token);
  async function auth(){ const r=await fetch(`/api/public/galleries/${token}/auth`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ who:'guest', email, code }) }); const j=await r.json(); if(r.ok&&j.ok){ setOk(true); const x=await fetch(`/api/public/galleries/${token}/assets?mode=guest`); const jj=await x.json(); setItems(jj.items||[]); } else alert(j.error||'Accès refusé'); }
  async function markView(id:string){ await fetch(`/api/public/galleries/${token}/view`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ assetId:id, who:'guest', viewerToken }) }); }
  if(!ok) return (<div className="max-w-sm mx-auto card grid gap-3"><h1>Accès invités</h1><label>Email (optionnel)</label><input value={email} onChange={e=>setEmail(e.target.value)} /><label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} /><button className="btn" onClick={auth}>Entrer</button></div>);
  return (<div className="grid gap-3"><h1 className="text-xl">Galerie (invités)</h1><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{items.map((it:any)=>(<div key={it.id} className="card p-2"><img src={it.sd} className="w-full h-40 object-cover cursor-pointer" onClick={()=>markView(it.id)} /><div className="text-xs mt-1">{it.filename}</div></div>))}</div></div>);
}
