// src/app/admin/analytics/gallery/[id]/page.tsx
import { PrismaClient, ViewerType } from "@prisma/client";

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

type PageProps = {
  params: { id: string };
};

export default async function TopViews({ params }: PageProps) {
  // Récupère les assets + leurs vues pour la galerie
  const assets = await prisma.asset.findMany({
    where: { galleryId: params.id },
    include: { views: true },
  });

  // Construit les lignes "Top 20" avec total et uniques par type de viewer
  const rows = assets
    .map((a) => {
      const total = a.views.length;

      const uniqueClient = new Set(
        a.views
          .filter((v) => v.viewerType === ViewerType.CLIENT)
          .map((v) => v.viewerEmail ?? v.id) // fallback si pas d'email
      ).size;

      const uniqueGuest = new Set(
        a.views
          .filter((v) => v.viewerType === ViewerType.GUEST)
          .map((v) => v.viewerEmail ?? v.id)
      ).size;

      return {
        id: a.id,
        filename: a.filename,
        total,
        uniqueClient,
        uniqueGuest,
      };
    })
    .sort((x, y) => y.total - x.total)
    .slice(0, 20);

  const sumDistinct = new Set(assets.flatMap((a) => a.views.map((v) => v.assetId))).size;
  const sumViews = assets.reduce((acc, a) => acc + a.views.length, 0);

  return (
    <div className="grid gap-4 p-6">
      <h1 className="text-xl font-semibold">Top vues (galerie)</h1>

      <div className="border rounded-lg p-4">
        <p>
          <strong>Photos distinctes vues :</strong> {sumDistinct} —{" "}
          <strong>Total de vues :</strong> {sumViews}
        </p>
      </div>

      <div className="border rounded-lg p-4">
        {rows.length === 0 ? (
          <p>Aucune vue.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b">Fichier</th>
                <th className="p-2 border-b">Total</th>
                <th className="p-2 border-b">Uniques CLIENT</th>
                <th className="p-2 border-b">Uniques INVITÉS</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="p-2 border-b">{r.filename}</td>
                  <td className="p-2 border-b text-center">{r.total}</td>
                  <td className="p-2 border-b text-center">{r.uniqueClient}</td>
                  <td className="p-2 border-b text-center">{r.uniqueGuest}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
