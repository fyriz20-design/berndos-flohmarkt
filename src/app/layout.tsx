import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];
  
  try {
    const prismaAny = prisma as any;
    if (prismaAny) {
      // Wir holen die Daten und nennen sie intern 'products'
      products = await (prismaAny.article?.findMany() || 
                        prismaAny.product?.findMany() || 
                        []);
    }
  } catch (error) {
    console.error("Datenbank-Fehler auf der Startseite:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Berndos Flohmarkt</h1>
          <div className="flex gap-4">
            <a href="/cart" className="text-gray-600 hover:text-blue-600">Warenkorb</a>
            <a href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Admin</a>
          </div>
        </div>
      </nav>

      <header className="bg-white border-b py-12 text-center">
        <h2 className="text-4xl font-extrabold text-gray-900">Stöbern, Finden, Freuen!</h2>
        <p className="mt-2 text-gray-500">Entdecke tolle Schätze auf unserem Online-Flohmarkt.</p>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4">
        {/* Wir übergeben die Daten an 'initialArticles', wie vom Code verlangt */}
        {products.length > 0 ? (
          <ProductList initialArticles={products} />
        ) : (
          <p className="text-center text-gray-500 py-20">Keine Artikel gefunden oder Datenbank lädt...</p>
        )}
      </main>
    </div>
  );
}