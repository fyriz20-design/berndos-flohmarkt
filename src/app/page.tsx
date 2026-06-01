'use client'
import { useState, useEffect } from 'react'
import ProductList from './ProductList'

export default function HomePage() {
  const [articles, setArticles] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setArticles(data) })
      .catch(console.error)
    
    fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: '/' }) }).catch(() => {})
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(160deg, #fef9ef 0%, #f5f0ff 55%, #fdf4ff 100%)', paddingTop: 'clamp(3rem, 10vw, 6rem)', paddingBottom: 'clamp(5rem, 12vw, 8rem)' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', overflow: 'hidden', lineHeight: 0, zIndex: 1 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: '100%', height: 'clamp(40px, 6vw, 80px)', display: 'block' }}>
            <defs><linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" /><stop offset="25%" stopColor="#f59e0b" stopOpacity="0.7" /><stop offset="50%" stopColor="#10b981" stopOpacity="0.7" /><stop offset="75%" stopColor="#6366f1" stopOpacity="0.7" /><stop offset="100%" stopColor="#a855f7" stopOpacity="0.7" /></linearGradient></defs>
            <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" fill="url(#waveGrad)" />
          </svg>
        </div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1100px', margin: '0 auto', padding: '0 1.25rem', textAlign: 'center' }}>
          
          {/* SEO Optimierte H1 Überschrift */}
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(2rem, 7vw, 4.5rem)', fontWeight: 900, color: '#1c1917', lineHeight: 1.1, marginBottom: '1.375rem' }}>
            Flohmarkt in Freudenstadt: <br />
            <span style={{ background: 'linear-gradient(135deg, #6d28d9, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontStyle: 'italic' }}>Berndos Fundgrube</span>
          </h1>
          
          <p style={{ maxWidth: '600px', margin: '0 auto 2rem', color: '#78716c', fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', lineHeight: 1.75, fontFamily: 'DM Sans, sans-serif' }}>
            Entdecke einzigartige Schätze und Schnäppchen beim Flohmarkt in Freudenstadt. Stoebere durch unsere Einzelstuecke – bequem online reservieren und sicher bezahlen.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(1.5rem, 4vw, 3rem)', flexWrap: 'wrap' }}>
            {[{ icon: '🏷️', label: 'Einzelstuecke', sub: 'Besondere Funde' }, { icon: '💳', label: 'Sicher zahlen', sub: 'PayPal & Ueberweisung' }, { icon: '📍', label: 'Freudenstadt', sub: 'Regional & Nah' }].map((item) => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', marginBottom: '0.25rem' }}>{item.icon}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: '0.9375rem', color: '#1c1917' }}>{item.label}</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '0.8125rem', color: '#a8a29e' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <main style={{ maxWidth: '1200px', margin: '-2rem auto 0', padding: '0 0.75rem 5rem', position: 'relative', zIndex: 10 }}>
        <h2 style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '1.5rem', color: '#444' }}>Aktuelle Flohmarkt-Angebote in Freudenstadt</h2>
        <div style={{ background: 'rgba(255,253,248,0.9)', backdropFilter: 'blur(20px)', borderRadius: 'clamp(16px, 3vw, 28px)', padding: 'clamp(1.25rem, 4vw, 2.25rem)', boxShadow: '0 20px 60px rgba(120,80,20,0.08)', border: '1px solid rgba(231,224,213,0.6)' }}>
          <ProductList initialArticles={articles} />
        </div>
      </main>
    </div>
  )
}