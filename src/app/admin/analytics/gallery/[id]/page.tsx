import { prisma } from '@/lib/prisma';
export default async function TopViews({ params }:{ params:{ id:string }}){
  const assets=await prisma.asset.findMany({ where:{ galleryId: params.id }, include:{ views:true } });
  const rows = assets.map(a=>({ id:a.id, filename:a.filename, total:a.views.length, uniqueClient:new Set(a.views.filter(v=>v.by==='CLIENT').map(v=>v.viewerToken||v.id)).size, uniqueGuest:new Set(a.views.filter(v=>v.by==='GUEST').map(v=>v.viewerToken||v.id)).size })).sort((x,y)=>y.total-x.total).slice(0,20);
  const sumDistinct = new Set(assets.flatMap(a=>a.views.map(v=>v.assetId))).size;
  const sumViews = assets.reduce((acc,a)=>acc+a.views.length,0);
  return (<div className="grid gap-4"><h1>Top vues (galerie)</h1><div className="card"><p><strong>Photos distinctes vues :</strong> {sumDistinct} — <strong>Total de vues :</strong> {sumViews}</p></div><div className="card">{rows.length===0?<p>Aucune vue.</p>:(<table className="w-full"><thead><tr><th className="text-left">Fichier</th><th>Total</th><th>Unique CLIENT</th><th>Unique INVITÉS</th></tr></thead><tbody>{rows.map(r=>(<tr key={r.id}><td>{r.filename}</td><td>{r.total}</td><td>{r.uniqueClient}</td><td>{r.uniqueGuest}</td></tr>))}</tbody></table>)}</div></div>);
}
