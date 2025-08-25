import Link from 'next/link';
export default function Admin(){ return (<div className="grid gap-4">
  <div className="flex items-center justify-between"><h1>Admin</h1><div className="flex gap-2"><Link className="btn" href="/admin/stats">Stats</Link><Link className="btn" href="/admin/access">Contrôle d’accès</Link></div></div>
  <div className="card"><p>Liens utiles : <a className="badge" href="/admin/analytics/gallery/token-demo">Top vues (exemple)</a></p></div>
</div>); }
