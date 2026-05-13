import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];
  
  try {
    // Direkter Abruf ohne Umwege
    products = await prisma.article.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("DB Connection lost, retrying...");
    // Fallback falls Tabelle 'product' heißt
    try {
      products = await (prisma as any).product.findMany();
    } catch (e) {
      products = [];
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation mit festen Tailwind-Klassen */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-black text-indigo-700 tracking-tighter">Berndos Flohmarkt</h1>
          <div className="flex gap-4">
            <Link href="/admin" className="bg-indigo-600 text-white px-5 py-2 rounded-full font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
              Admin Bereich
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12 px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-extrabold text-slate-900 mb-4">Stöbern, Finden, Freuen!</h2>
          <p className="text-xl text-slate-500">Die besten Schätze, direkt von Berndos Dachboden.</p>
        </div>

        {products.length > 0 ? (
          <ProductList initialArticles={products} />
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-slate-200">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-slate-800">Noch keine Schätze da</h3>
            <p className="text-slate-500 mt-2">Logge dich im Admin-Bereich ein, um Artikel anzulegen.</p>
          </div>
        )}
      </main>
    </div>
  );
}