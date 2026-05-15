import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';
import RainbowWave from '@/components/RainbowWave';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  try {
    const prismaAny = prisma as any;
    products = await (prismaAny.article?.findMany({ take: 20, orderBy: { createdAt: 'desc' } }) ||
                      prismaAny.product?.findMany({ take: 20 }) || []);
  } catch (e) {
    console.error('Fehler beim Laden:', e);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f7ff' }}>
      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #faf5ff 100%)', paddingTop: 'clamp(2.5rem, 8vw, 5rem)', paddingBottom: 'clamp(4rem, 10vw, 7rem)' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '100%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '100%', background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
        </div>
        <RainbowWave />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(124,58,237,0.08)', color: '#7c3aed', padding: '0.375rem 1rem', borderRadius: '999px', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '1.25rem', border: '1px solid rgba(124,58,237,0.15)' }}>
            🏪 Privater Flohmarkt
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 7vw, 4.5rem)', fontWeight: 900, color: '#1e1b4b', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '1.25rem' }}>
            Berndos- Flohmarkt
          </h1>
          <p style={{ maxWidth: '520px', margin: '0 auto', color: '#6b7280', fontSize: 'clamp(0.9375rem, 2.5vw, 1.125rem)', lineHeight: 1.7 }}>
            Privater Flohmarkt mit schönen Einzelstücken. Stöbere, stelle eine Kaufanfrage und bezahle per PayPal oder Banküberweisung.
          </p>
        </div>
      </div>

      {/* Produkte */}
      <main style={{ maxWidth: '1200px', margin: '-3rem auto 0', padding: '0 0.75rem 4rem', position: 'relative', zIndex: 10 }}>
        <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderRadius: 'clamp(16px, 3vw, 28px)', padding: 'clamp(1rem, 4vw, 2rem)', boxShadow: '0 20px 60px rgba(124,58,237,0.08)', border: '1px solid rgba(255,255,255,0.8)' }}>
          <ProductList initialArticles={products} />
        </div>
      </main>
    </div>
  );
}
