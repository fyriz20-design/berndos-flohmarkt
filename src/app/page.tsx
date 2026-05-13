import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';

// Das verhindert, dass Vercel versucht, die Seite statisch vorzuberechnen
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  
  try {
    // 1. Wir prüfen, ob prisma überhaupt existiert
    if (!prisma) {
      throw new Error("Prisma Client ist nicht initialisiert");
    }

    // 2. Wir versuchen die Daten zu holen (mit 'await'!)
    // Wir probieren beide Varianten, falls dein Modell 'Article' oder 'Product' heißt
    const data = await (prisma as any).article?.findMany() || 
                 await (prisma as any).product?.findMany();
    
    products = data || [];
    
  } catch (error) {
    // Wenn es einen Fehler gibt, schreiben wir ihn in die Vercel-Logs
    console.error("KRITISCHER DATENBANK-FEHLER:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-10 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-blue-600">Berndos Flohmarkt</h1>
          <div className="flex gap-4">
            <a href="/cart" className="text-gray-600 hover:text-blue-600 font-medium">Warenkorb</a>
            <a href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">Admin</a>
          </div>
        </div>
      </nav>

      <header className="bg-white py-16 text-center border-b">
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Stöbern, Finden, Freuen!</h2>
        <p className="mt-4 text-lg text-gray-500">Entdecke tolle Schätze auf unserem Online-Flohmarkt.</p>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        {products && products.length > 0 ? (
          <ProductList initialArticles={products} />
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-inner border border-dashed">
            <p className="text-gray-400 text-lg">Keine Artikel gefunden.</p>
            <p className="text-sm text-gray-300 mt-2">Bitte prüfe den Admin-Bereich oder die Datenbank-Verbindung.</p>
          </div>
        )}
      </main>
    </div>
  );
}