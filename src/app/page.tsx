import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];
  try {
    // Holen der Daten über den Prisma Proxy
    products = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("DB-Verbindungsfehler:", error);
    products = []; // Seite stürzt nicht ab, zeigt nur "leer"
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <header className="w-full max-w-4xl flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-blue-700">Berndos Flohmarkt</h1>
        <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">Admin</Link>
      </header>

      <main className="w-full max-w-4xl bg-white shadow-xl rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4">Stöbern, Finden, Freuen!</h2>
        
        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {products.map((p: any) => (
              <div key={p.id} className="border p-4 rounded-lg bg-blue-50">
                <p className="font-bold text-lg">{p.name}</p>
                <p className="text-blue-600 font-black">{p.price} €</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-xl">Die Technik steht! ✅</p>
            <p className="mt-2 text-sm italic">Keine Artikel gefunden oder Datenbank lädt noch...</p>
          </div>
        )}
      </main>
    </div>
  );
}