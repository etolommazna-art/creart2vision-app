'use client'; import { useEffect, useState } from 'react';
function Line({ data, width=700, height=180 }:{ data:number[], width?:number, height?:number }){ const max=Math.max(1,...data); const stepX=width/(data.length-1||1); const pts=data.map((v,i)=>`${i*stepX},${height-(v/max)*height}`).join(' '); return (<svg width={width} height={height} className="w-full h-48"><polyline fill="none" stroke="black" strokeWidth="2" points={pts}/></svg>); }
export default function Stats(){ const [months,setMonths]=useState<string[]>([]); const [revenue,setRevenue]=useState<number[]>([]); const [byType,setByType]=useState<any>({});
  useEffect(()=>{ (async()=>{ const r=await fetch('/api/admin/stats/monthly'); const j=await r.json(); setMonths(j.months||[]); setRevenue(j.revenueMonthly||[]); const t=await fetch('/api/admin/stats/by-type'); setByType(await t.json()); })(); },[]);
  const euro=(c:number)=> (c/100).toFixed(2)+' €';
  return (<div className="grid gap-4"><div className="flex items-center justify-between"><h1>Statistiques</h1><a className="btn" href="/api/admin/stats/views.csv">Export CSV (vues)</a></div>
    <div className="card"><h3 className="mb-2">Revenus mensuels (Stripe & factures) — 12 mois</h3><Line data={revenue} /></div>
    <div className="card grid grid-cols-2 md:grid-cols-4 gap-3"><div><div className="text-sm text-gray-500">Mariage</div><div className="text-2xl">{byType.MARIAGE||0}</div></div><div><div className="text-sm text-gray-500">Grossesse</div><div className="text-2xl">{byType.GROSSESSE||0}</div></div><div><div className="text-sm text-gray-500">Corporate</div><div className="text-2xl">{byType.CORPORATE||0}</div></div><div><div className="text-sm text-gray-500">Autre</div><div className="text-2xl">{byType.AUTRE||0}</div></div></div>
  </div>);
}
