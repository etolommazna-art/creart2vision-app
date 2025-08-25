'use client'; import { useEffect, useState } from 'react';
type Cat={ id:string; name:string }; type Svc={ id:string; name:string }; type Plan={ id:string; name:string; durationMinutes:number; priceCents:number };
export default function Book(){ const [cats,setCats]=useState<Cat[]>([]); const [services,setServices]=useState<Svc[]>([]); const [plans,setPlans]=useState<Plan[]>([]);
  const [catId,setCatId]=useState(''); const [serviceId,setServiceId]=useState(''); const [planId,setPlanId]=useState(''); const [date,setDate]=useState(''); const [time,setTime]=useState('10:00'); const [name,setName]=useState(''); const [email,setEmail]=useState('');
  useEffect(()=>{ fetch('/api/services/categories').then(r=>r.json()).then(setCats); },[]);
  useEffect(()=>{ if(!catId){ setServices([]); return; } fetch('/api/services?categoryId='+catId).then(r=>r.json()).then(setServices); },[catId]);
  useEffect(()=>{ if(!serviceId){ setPlans([]); return; } fetch('/api/services/'+serviceId+'/plans').then(r=>r.json()).then(setPlans); },[serviceId]);
  async function submit(e:any){ e.preventDefault(); const startISO=new Date(`${date}T${time}:00`).toISOString(); const r=await fetch('/api/bookings',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ serviceId, planId, name, email, startISO }) }); const j=await r.json(); if(!r.ok) return alert(j.error||'Erreur'); alert('Réservation créée !'); }
  return (<div className="card grid gap-3 max-w-xl">
    <h1>Réserver</h1>
    <label>Catégorie</label><select value={catId} onChange={e=>setCatId(e.target.value)}><option value="">—</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
    <label>Prestation</label><select value={serviceId} onChange={e=>setServiceId(e.target.value)}><option value="">—</option>{services.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>
    <label>Formule</label><select value={planId} onChange={e=>setPlanId(e.target.value)}><option value="">—</option>{plans.map(p=><option key={p.id} value={p.id}>{p.name} — {(p.priceCents/100).toFixed(2)} €</option>)}</select>
    <div className="grid grid-cols-2 gap-3"><div><label>Date</label><input type="date" value={date} onChange={e=>setDate(e.target.value)} /></div><div><label>Heure</label><input value={time} onChange={e=>setTime(e.target.value)} /></div></div>
    <label>Nom</label><input value={name} onChange={e=>setName(e.target.value)} />
    <label>Email</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} />
    <button className="btn mt-2" onClick={submit}>Valider</button>
  </div>);
}
