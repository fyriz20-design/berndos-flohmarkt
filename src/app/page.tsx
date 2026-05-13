import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';
import Link from 'next/link';

// Wir zwingen Next.js, die Seite jedes Mal neu zu laden (wichtig für Flohmärkte!)
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  let connectionError = false;

  try {
    // Wir versuchen die Daten zu holen. Prisma nutzt jetzt POSTGRES_PRISMA_URL
    const data = await (prisma as any).article.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    }).catch(async () => {
      // Fallback: Falls die Tabelle anders heißt
      return await (prisma as any).product.findMany();
    });

    if (data) products = data;
  } catch (error) {
    console.error("Datenbank-Verbindung fehlgeschlagen:", error);
    connectionError = true;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white shadow-sm p-4 border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-blue-700">Berndos Flohmarkt</h1>
          <div className="flex items-center gap-6">
            <Link href="/cart" className="text-gray-600 hover:text-blue-600 font-medium">Warenkorb</Link>
            <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm">Admin</Link>
          </div>
        </div>
      </nav>

      <header className="py-16 px-4 text-center bg-white border-b">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Stöbern, Finden, Freuen!</h2>
        <p className="text-lg text-gray-500 mt-4 max-w-2xl mx-auto">Entdecke tolle Schätze auf unserem Online-Flohmarkt.</p>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4 w-full flex-grow">
        {products.length > 0 ? (
          <ProductList initialArticles={products} />
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-inner">
            <h3 className="text-xl font-semibold text-gray-700">
              {connectionError ? "Datenbank wird aufgeweckt..." : "Aktuell keine Artikel verfügbar"}
            </h3>
            <p className="text-gray-400 mt-2 max-w-sm mx-auto">
              {connectionError 
                ? "Wir bauen die Verbindung gerade neu auf. Bitte lade die Seite in einem Moment erneut." 
                : "Schau später noch einmal vorbei oder füge als Admin neue Schätze hinzu!"}
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 text-blue-600 font-medium hover:underline flex items-center justify-center gap-2 mx-auto"
            >
              🔄 Seite aktualisieren
            </button>
          </div>
        )}
      </main>
      
      <footer className="bg-white border-t py-8 text-center text-gray-400 text-sm">
        © 2026 Berndos Flohmarkt – Alle Schätze sicher verwahrt.
      </footer>
    </div>
  );
}