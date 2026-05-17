import { prisma } from '@/lib/prisma';
import ProductList from './ProductList';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: any[] = [];
  try {
    const prismaAny = prisma as any;
    products = await (prismaAny.article?.findMany({ take: 20, orderBy: { createdAt: 'desc' } }) || []);
  } catch (e) {
    console.error('Fehler beim Laden:', e);
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #fef9ef 0%, #f5f0ff 55%, #fdf4ff 100%)',
        paddingTop: 'clamp(3rem, 10vw, 6rem)',
        paddingBottom: 'clamp(5rem, 12vw, 8rem)',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-15%', right: '-8%', width: 'clamp(250px, 45vw, 500px)', height: 'clamp(250px, 45vw, 500px)', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 'clamp(200px, 40vw, 450px)', height: 'clamp(200px, 40vw, 450px)', background: 'radial-gradient(circle, rgba(109,40,217,0.1) 0%, transparent 70%)', borderRadius: '50%' }} />
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 1 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: '100%', height: 'clamp(40px, 6vw, 80px)', display: 'block' }}>
            <defs>
              <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
                <stop offset="25%" stopColor="#f59e0b" stopOpacity="0.7" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.7" />
                <stop offset="75%" stopColor="#6366f1" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="url(#waveGrad)" />
          </svg>
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto', padding: '0 1.25rem', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(245, 158, 11, 0.12)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            color: '#d97706',
            padding: '0.375rem 1.125rem',
            borderRadius: '999px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            fontFamily: "DM Sans, sans-serif",
          }}>
            Privater Flohmarkt - Einzelstuecke
          </div>
          <h1 style={{
            fontFamily: "Playfair Display, Georgia, serif",
            fontSize: 'clamp(2.25rem, 8vw, 5rem)',
            fontWeight: 900,
            color: '#1c1917',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginBottom: '1.375rem',
          }}>
            Berndos{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6d28d9, #a855f7, #ec4899)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontStyle: 'italic',
            }}>
              Flohmarkt
            </span>
          </h1>
          <p style={{
            maxWidth: '540px',
            margin: '0 auto 2rem',
            color: '#78716c',
            fontSize: 'clamp(1rem, 2.5vw, 1.1875rem)',
            lineHeight: 1.75,
            fontFamily: "DM Sans, sans-serif",
          }}>
            Stoebere durch schoene Einzelstuecke aus privatem Besitz. Bezahle bequem per PayPal oder Bankueberweisung.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(1.5rem, 4vw, 3rem)', flexWrap: 'wrap' }}>
            {[
              { icon: '🏷️', label: 'Einzelstuecke', sub: 'Jedes einmalig' },
              { icon: '💳', label: 'Sicher zahlen', sub: 'PayPal & Ueberweisung' },
              { icon: '📦', label: 'Schneller Versand', sub: 'Per DHL' },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.25rem' }}>{item.icon}</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontWeight: 700, fontSize: '0.9375rem', color: '#1c1917' }}>{item.label}</div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: '0.8125rem', color: '#a8a29e' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <main style={{
        maxWidth: '1200px',
        margin: '-2rem auto 0',
        padding: '0 0.75rem 5rem',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{
          background: 'rgba(255, 253, 248, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 'clamp(16px, 3vw, 28px)',
          padding: 'clamp(1.25rem, 4vw, 2.25rem)',
          boxShadow: '0 20px 60px rgba(120, 80, 20, 0.08)',
          border: '1px solid rgba(231, 224, 213, 0.6)',
        }}>
          <ProductList initialArticles={products} />
        </div>
      </main>
    </div>
  );
}
