import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  let errorDetail = "";

  try {
    // Wir versuchen die Daten zu holen. 
    // prismaAny hilft uns, falls die Typen in Vercel noch nicht aktualisiert wurden.
    const prismaAny = prisma as any;
    
    // Versuch 1: Tabelle 'article'
    let data = await prismaAny.article?.findMany().catch(() => null);
    
    // Versuch 2: Falls 1 leer war, Tabelle 'product'
    if (!data || data.length === 0) {
      data = await prismaAny.product?.findMany().catch(() => null);
    }

    products = data || [];
  } catch (err: any) {
    errorDetail = err.message;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm p-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-blue-600 tracking-tight">Berndos Flohmarkt</h1>
          <Link href="/admin" className="text-sm font-medium text-gray-500 hover:text-blue-600">Admin</Link>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full py-12 px-4">
        {products.length > 0 ? (
          <ProductList initialArticles={products} />
        ) : (
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {errorDetail ? "Kleine technische Pause" : "Willkommen!"}
            </h2>
            <p className="text-gray-500 mt-4 max-w-md mx-auto">
              {errorDetail 
                ? "Wir verbinden gerade die Datenbank neu. Bitte lade die Seite in ein paar Sekunden noch einmal." 
                : "Aktuell haben wir keine Artikel im Angebot. Schau später wieder vorbei!"}
            </p>
            {errorDetail && (
              <div className="mt-8 p-4 bg-orange-50 text-orange-700 text-xs font-mono rounded-lg border border-orange-100">
                Log: {errorDetail.substring(0, 80)}...
              </div>
            )}
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition"
            >
              Seite neu laden
            </button>
          </div>
        )}
      </main>
    </div>
  );
}