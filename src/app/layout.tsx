import './globals.css'; import Link from 'next/link';
export default function Root({ children }:{ children: React.ReactNode }){
  return (<html lang="fr"><body className="bg-gray-50 text-gray-900">
    <header className="bg-white border-b"><div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center"><Link href="/" className="font-semibold">Studio v6.2</Link><nav className="flex gap-3"><Link className="badge" href="/book">Réserver</Link><Link className="badge" href="/admin">Admin</Link></nav></div></header>
    <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
  </body></html>);
}
