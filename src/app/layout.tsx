import { prisma } from '@/lib/prisma';
import ProductList from './ProductList'; // Wir nutzen deine vorhandene Komponente!

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];
  
  try {
    // Wir versuchen alle möglichen Namen für deine Produkte in der Datenbank
    const prismaAny = prisma as any;
    if (prismaAny) {
      products = await (prismaAny.product?.findMany() || 
                        prismaAny.article?.findMany() || 
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
        {/* Hier rufen wir deine alte ProductList auf, falls sie Daten braucht */}
        {products.length > 0 ? (
          <ProductList products={products} />
        ) : (
          <p className="text-center text-gray-500">Lade Artikel...</p>
        )}
      </main>
    </div>
  );
}