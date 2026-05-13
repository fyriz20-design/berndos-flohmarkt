import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];

  try {
    // WICHTIG: Das 'await' sorgt dafür, dass die Seite auf die Datenbank wartet
    const prismaAny = prisma as any;
    if (prismaAny) {
      const dbProducts = await prismaAny.article?.findMany();
      const dbArticles = await prismaAny.product?.findMany();
      products = dbProducts || dbArticles || [];
    }
  } catch (error) {
    console.error("Datenbank-Fehler:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center px-8">
        <h1 className="text-2xl font-bold text-blue-800">Berndos Flohmarkt</h1>
        <div className="space-x-6">
          <a href="/cart" className="hover:text-blue-600">Warenkorb</a>
          <a href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Admin</a>
        </div>
      </nav>

      <header className="py-16 px-4 text-center bg-white border-b">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Stöbern, Finden, Freuen!</h2>
        <p className="text-lg text-gray-600">Entdecke tolle Schätze auf unserem Online-Flohmarkt.</p>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4">
        {products.length > 0 ? (
          <ProductList initialArticles={products} />
        ) : (
          <p className="text-center text-gray-500 py-20">Keine Artikel gefunden. Schau im Admin-Bereich nach!</p>
        )}
      </main>
    </div>
  );
}