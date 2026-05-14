import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';
import RainbowWave from '@/components/RainbowWave';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  try {
    const prismaAny = prisma as any;
    if (prismaAny) {
      products = await (prismaAny.article?.findMany({ take: 20 }) ||
                        prismaAny.product?.findMany({ take: 20 }) || []);
    }
  } catch (e) {
    console.error('Fehler beim Laden:', e);
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--gradient-hero)' }}>

      {/* Hero Header */}
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #faf5ff 100%)',
        paddingTop: '4rem',
        paddingBottom: '6rem',
      }}>
        {/* Hintergrund-Blobs */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '-10%', left: '-5%',
            width: '40%', height: '80%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: '-10%', right: '-5%',
            width: '40%', height: '80%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        {/* Rainbow Wave unten */}
        <RainbowWave />

        <div style={{
          position: 'relative', zIndex: 2,
          maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem',
          textAlign: 'center',
        }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 900,
            color: 'var(--color-text)',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
          }}>
            Berndos- Flohmarkt
          </h1>
          <p style={{
            maxWidth: '560px',
            margin: '0 auto',
            color: 'var(--color-text-muted)',
            fontSize: '1.125rem',
            lineHeight: 1.7,
          }}>
            Privater Flohmarkt mit schönen Einzelstücken. Stöbere, stelle eine Kaufanfrage und bezahle per PayPal oder Banküberweisung.
          </p>
        </div>
      </div>

      {/* Produkt-Bereich */}
      <main style={{
        maxWidth: '1200px',
        margin: '-3rem auto 0',
        padding: '0 1.5rem 4rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-2xl)',
          padding: '2rem',
          boxShadow: '0 20px 60px rgba(124, 58, 237, 0.08), 0 1px 0 rgba(255,255,255,0.8) inset',
          border: '1px solid rgba(255,255,255,0.8)',
        }}>
          <ProductList initialArticles={products} />
        </div>
      </main>
    </div>
  );
}
