import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];
  try {
    const prismaAny = prisma as any;
    if (prismaAny) {
      products = await (prismaAny.article?.findMany({ take: 20 }) || 
                        prismaAny.product?.findMany({ take: 20 }) || []);
    }
  } catch (e) {
    console.error("Fehler beim Laden:", e);
  }

  return (
    <div className="min-h-screen bg-[#f8f7ff]">
      {/* Obere Navigation */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-fuchsia-400 rounded-xl flex items-center justify-center text-white font-bold shadow-sm">
              B
            </div>
            <div className="leading-tight">
              <h1 className="font-bold text-slate-800">Berndos- Flohmarkt</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Privatverkauf</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <Link href="/" className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full flex items-center gap-2">
              <span>🏪</span> Markt
            </Link>
            <Link href="/cart" className="hover:text-purple-600 transition-colors">🛒 Warenkorb</Link>
            <Link href="/kontakt" className="hover:text-purple-600 transition-colors">✉️ Kontakt</Link>
            <Link href="/impressum" className="hover:text-purple-600 transition-colors">ℹ️ Impressum</Link>
            <Link href="/datenschutz" className="hover:text-purple-600 transition-colors">🔒 Datenschutz</Link>
            <Link href="/admin" className="hover:text-purple-600 transition-colors">⚙️ Admin</Link>
          </div>
        </div>
      </nav>

      {/* Hero Header mit dem lila Look */}
      <div className="relative overflow-hidden bg-white pt-16 pb-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-400 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-400 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-6xl font-black text-slate-900 tracking-tight mb-6">
            Berndos- Flohmarkt
          </h2>
          <p className="max-w-2xl mx-auto text-slate-500 text-xl leading-relaxed">
            Privater Flohmarkt mit schönen Einzelstücken. Stöbere, stelle eine Kaufanfrage und bezahle per PayPal oder Banküberweisung.
          </p>
        </div>
      </div>

      {/* Produkt-Bereich */}
      <main className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl shadow-xl shadow-purple-100/50 border border-white">
            <ProductList initialArticles={products} />
        </div>
      </main>
      
      <footer className="py-20 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} Berndos Flohmarkt
      </footer>
    </div>
  );
}