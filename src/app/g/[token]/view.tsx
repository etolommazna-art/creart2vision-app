'use client'; import { useEffect, useState } from 'react';
function getViewerToken(prefix:string){ const k='viewer_'+prefix; let v=localStorage.getItem(k); if(!v){ v=crypto.randomUUID(); localStorage.setItem(k, v); } return v; }
export default function ClientView({ token }:{ token:string }){
  const [email,setEmail]=useState(''); const [code,setCode]=useState(''); const [ok,setOk]=useState(false); const [items,setItems]=useState<any[]>([]);
  const viewerToken=getViewerToken('client_'+token);
  async function auth(){ const r=await fetch(`/api/public/galleries/${token}/auth`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ who:'client', email, code }) }); const j=await r.json(); if(r.ok&&j.ok){ setOk(true); load(); } else alert(j.error||'Accès refusé'); }
  async function load(){ const r=await fetch(`/api/public/galleries/${token}/assets?mode=client`); const j=await r.json(); setItems(j.items||[]); }
  async function markView(id:string){ await fetch(`/api/public/galleries/${token}/view`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ assetId:id, who:'client', viewerToken }) }); }
  if(!ok) return (<div className="max-w-sm mx-auto card grid gap-3"><h1>Accès galerie (client)</h1><label>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} /><label>Code</label><input value={code} onChange={e=>setCode(e.target.value)} /><button className="btn" onClick={auth}>Entrer</button></div>);
  return (<div className="grid gap-3"><h1 className="text-xl">Galerie (client)</h1><div className="grid grid-cols-2 md:grid-cols-4 gap-3">{items.map((it:any)=>(<div key={it.id} className="card p-2"><img src={it.sd} className="w-full h-40 object-cover cursor-pointer" onClick={()=>markView(it.id)} /><div className="text-xs mt-1">{it.filename}</div></div>))}</div></div>);
}
