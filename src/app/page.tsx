import { prisma } from '@/lib/prisma';
import Link from 'next/link';

// Auch hier: Live-Laden erzwingen
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];

  try {
    if (prisma) {
      const prismaAny = prisma as any;
      products = await (prismaAny.product?.findMany({ where: { isPublished: true } }) || 
                        prismaAny.article?.findMany() || []);
    }
  } catch (error) {
    console.error("Datenbank-Fehler auf Startseite:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Berndos Flohmarkt</h1>
          <div className="space-x-4">
            <Link href="/cart" className="text-gray-600 hover:text-blue-600">Warenkorb</Link>
            <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Admin</Link>
          </div>
        </div>
      </nav>

      <header className="bg-blue-600 text-white py-16 px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4">Stöbern, Finden, Freuen!</h2>
        <p className="text-xl opacity-90">Entdecke tolle Schätze auf unserem Online-Flohmarkt.</p>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((item: any) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h4 className="font-bold text-lg mb-2">{item.name || item.title}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-blue-600">{item.price} €</span>
                  <Link href={`/articles/${item.id}`} className="text-blue-500 font-medium hover:underline">Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-center text-gray-500 py-20">Keine Artikel gefunden. Schau im Admin-Bereich nach!</p>
        )}
      </main>
    </div>
  );
}