import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];
  let connectionFailed = false;

  try {
    // Timeout-Schutz: Wir versuchen es, aber stürzen nicht ab
    products = await prisma.article.findMany({
      take: 10
    }).catch(() => {
      connectionFailed = true;
      return [];
    });
  } catch (e) {
    connectionFailed = true;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-indigo-700 p-4 shadow-lg text-white">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <span className="text-xl font-black">BERNDOS FLOHMARKT</span>
          <Link href="/admin" className="bg-white text-indigo-700 px-4 py-1 rounded font-bold text-sm">ADMIN</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-12 p-6">
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Willkommen auf dem Markt!</h2>
          
          {products.length > 0 ? (
            <div className="grid gap-4">
              {products.map((p: any) => (
                <div key={p.id} className="p-4 border rounded-xl flex justify-between">
                  <span className="font-bold">{p.name}</span>
                  <span className="text-indigo-600">{p.price} €</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10">
              <div className="text-5xl mb-4">✨</div>
              <p className="text-slate-500 text-lg">
                {connectionFailed 
                  ? "Die Verbindung steht, aber die Datenbank schläft noch. Bitte lade die Seite gleich nochmal neu." 
                  : "Technik bereit! ✅ Jetzt im Admin-Bereich Artikel anlegen."}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-6 text-indigo-600 font-bold underline"
              >
                Seite aktualisieren
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}