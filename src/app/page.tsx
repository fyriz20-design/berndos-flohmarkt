import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  
  try {
    // Hier laden wir die echten Daten aus deiner Prisma Postgres DB
    products = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Datenbank-Fehler:", error);
    // Falls die DB noch schläft, bleibt die Liste leer statt abzustürzen
    products = [];
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center px-8 sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-800">Berndos Flohmarkt</h1>
        <div className="space-x-6 flex items-center">
          <Link href="/cart" className="hover:text-blue-600 font-medium">Warenkorb</Link>
          <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Admin</Link>
        </div>
      </nav>

      {/* Hero Bereich */}
      <header className="py-16 px-4 text-center bg-white border-b">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Stöbern, Finden, Freuen!</h2>
        <p className="text-lg text-gray-600">Entdecke tolle Schätze auf unserem Online-Flohmarkt.</p>
      </header>

      {/* Produkt-Grid */}
      <main className="max-w-6xl mx-auto p-8">
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((p) => (
              <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold mb-2">{p.name || p.title}</h3>
                <p className="text-blue-600 font-bold text-2xl mb-4">{p.price} €</p>
                <Link href={`/articles/${p.id}`} className="text-blue-500 hover:underline font-medium">
                  Details anzeigen →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-xl font-medium">Noch keine Schätze online.</p>
            <p className="text-gray-400 mt-2">Die Datenbank ist bereit. Füge im Admin-Bereich den ersten Artikel hinzu!</p>
          </div>
        )}
      </main>
    </div>
  );
}