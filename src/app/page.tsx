import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Wir erstellen eine leere Liste als Sicherheit
  let products: any[] = [];
  let dbError = false;

  try {
    // Der Versuch, die Datenbank zu erreichen
    const data = await (prisma as any).article.findMany({ take: 20 }).catch(() => 
                 (prisma as any).product.findMany({ take: 20 }));
    
    if (data) {
      products = data;
    }
  } catch (error) {
    // Falls die Datenbank knallt, fangen wir das hier ab
    console.error("Datenbank-Verbindung fehlgeschlagen");
    dbError = true;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white shadow-sm p-4 flex justify-between items-center px-8 border-b">
        <h1 className="text-2xl font-bold text-blue-700">Berndos Flohmarkt</h1>
        <div className="space-x-4">
          <a href="/cart" className="text-gray-600 hover:text-blue-600">Warenkorb</a>
          <a href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Admin</a>
        </div>
      </nav>

      <header className="py-12 px-4 text-center bg-white border-b">
        <h2 className="text-4xl font-extrabold text-gray-800">Stöbern, Finden, Freuen!</h2>
        <p className="text-lg text-gray-500 mt-2">Entdecke tolle Schätze auf unserem Online-Flohmarkt.</p>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4">
        {products.length > 0 ? (
          <ProductList initialArticles={products} />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <h3 className="text-xl font-semibold text-gray-600">
              {dbError ? "Verbindung wird aufgebaut..." : "Aktuell keine Artikel verfügbar"}
            </h3>
            <p className="text-gray-400 mt-2">
              {dbError ? "Bitte lade die Seite in einem Moment neu." : "Schau später noch einmal vorbei!"}
            </p>
            {/* Ein Refresh-Button hilft dem Nutzer */}
            <button 
              onClick={() => window.location.reload()} 
              className="mt-6 text-blue-600 underline text-sm"
            >
              Seite aktualisieren
            </button>
          </div>
        )}
      </main>
    </div>
  );
}