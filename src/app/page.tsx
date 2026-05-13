import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const products = await (prisma as any).product.findMany().catch(() => (prisma as any).article.findMany() || []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white shadow-md p-4 flex justify-between items-center px-8">
        <h1 className="text-2xl font-bold text-blue-800">Berndos Flohmarkt</h1>
        <div className="space-x-6">
          <Link href="/cart" className="hover:text-blue-600">Warenkorb</Link>
          <Link href="/admin" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Admin</Link>
        </div>
      </nav>

      <header className="py-16 px-4 text-center bg-white border-b">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Stöbern, Finden, Freuen!</h2>
        <p className="text-lg text-gray-600">Entdecke tolle Schätze auf unserem Online-Flohmarkt.</p>
      </header>

      <main className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((p: any) => (
          <div key={p.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold mb-2">{p.name || p.title}</h3>
            <p className="text-blue-600 font-bold text-2xl mb-4">{p.price} €</p>
            <Link href={`/articles/${p.id}`} className="text-blue-500 hover:underline">Details anzeigen →</Link>
          </div>
        ))}
      </main>
    </div>
  );
}