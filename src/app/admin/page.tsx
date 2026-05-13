import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function HomePage() {
  // Wir holen die Artikel für die Kunden-Ansicht
  const articles = await (prisma as any).article.findMany({
    where: { published: true }, // Falls du ein 'published' Feld hast
  }).catch(() => (prisma as any).product.findMany());

  return (
    <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1>Berndos Flohmarkt</h1>
        <Link href="/admin" style={{ textDecoration: 'none', color: '#0070f3' }}>Admin-Login</Link>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {articles.map((item: any) => (
          <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{item.name || item.title}</h3>
            <p style={{ color: '#666' }}>{item.description}</p>
            <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{item.price} €</p>
          </div>
        ))}
      </section>
    </main>
  );
}