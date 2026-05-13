import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];

  try {
    // Hier ist der "Motor": Wir holen die Daten wirklich ab!
    const prismaAny = prisma as any;
    if (prismaAny) {
      const data = await (prismaAny.article?.findMany() || prismaAny.product?.findMany());
      products = data || [];
    }
  } catch (error) {
    console.error("Datenbank-Fehler:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center px-8 sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-800">Berndos Flohmarkt</h1>
        <div className="space-x-6">
          <Link href="/cart" className="hover:text-blue-600 font-medium">Warenkorb</Link>
          <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Admin</Link>
        </div>
      </nav>

      <header className="py-16 px-4 text-center bg-white border-b text-blue-900">
        <h2 className="text-4xl font-extrabold mb-2">Stöbern, Finden, Freuen!</h2>
        <p className="text-lg opacity-75">Entdecke tolle Schätze auf unserem Online-Flohmarkt.</p>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-4">
        {products.length > 0 ? (
          /* Hier nutzen wir deine ProductList.tsx für das alte Design */
          <ProductList initialArticles={products} />
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-xl font-medium">Aktuell sind keine Artikel online.</p>
            <p className="text-gray-400 mt-2 text-sm">Schau im Admin-Bereich nach oder prüfe die Datenbank.</p>
          </div>
        )}
      </main>
    </div>
  );
}