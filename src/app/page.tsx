import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  let debugInfo = "";

  try {
    // 1. Verbindungstest
    await (prisma as any).$connect();
    
    // 2. Daten laden (wir probieren beide Tabellennamen)
    const data = await (prisma as any).article?.findMany() || 
                 await (prisma as any).product?.findMany();
    
    products = data || [];
  } catch (error: any) {
    console.error("DB-Error:", error);
    debugInfo = error.message || "Keine Verbindung zur Datenbank möglich.";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm p-4 border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold text-blue-600">Berndos Flohmarkt</h1>
          <div className="flex gap-4">
            <Link href="/admin" className="bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200">Admin</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full py-12 px-4">
        {products.length > 0 ? (
          <ProductList initialArticles={products} />
        ) : (
          <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {debugInfo ? "Wartungsarbeiten" : "Willkommen!"}
            </h2>
            <p className="text-gray-500 mt-2">
              {debugInfo 
                ? "Wir optimieren gerade die Datenbankverbindung. Bitte in einer Minute nochmal probieren." 
                : "Aktuell sind keine Schätze online. Schau bald wieder vorbei!"}
            </p>
            {debugInfo && (
              <div className="mt-6 p-3 bg-red-50 text-red-600 text-xs rounded border border-red-100">
                Diagnose: {debugInfo.substring(0, 100)}...
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}