// src/app/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic"; // évite le cache pendant la mise en route

export default function HomePage() {
  return (
    <main className="min-h-screen grid place-items-center p-8">
      <div className="max-w-xl w-full text-center space-y-4">
        <h1 className="text-2xl font-semibold">Bienvenue sur Creart2Vision Space</h1>
        <p className="opacity-80">
          L’application est déployée. Connectez-vous à l’espace admin pour configurer vos
          prestations, galeries et paiements.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 rounded-md border border-black/10 hover:bg-black/5"
          >
            Ouvrir le Dashboard
          </Link>
          <Link
            href="/api/auth/signin"
            className="px-4 py-2 rounded-md border border-black/10 hover:bg-black/5"
          >
            Se connecter
          </Link>
        </div>

        <p className="text-sm opacity-60">
          Admin : utilisez l’email <code>ADMIN_EMAIL</code> et le mot de passe <code>ADMIN_PASSWORD</code>
          (variables Vercel).
        </p>
      </div>
    </main>
  );
}
