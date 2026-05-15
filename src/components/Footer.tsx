import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #fdfaf5 0%, #f5f0ff 100%)',
      borderTop: '1px solid rgba(231, 224, 213, 0.8)',
      padding: 'clamp(2.5rem, 6vw, 4rem) 1.5rem clamp(1.5rem, 4vw, 2.5rem)',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Top section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem',
          paddingBottom: '2.5rem',
          borderBottom: '1px solid rgba(231, 224, 213, 0.8)',
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.875rem' }}>
              <div style={{
                width: '40px', height: '40px',
                background: 'linear-gradient(135deg, #6d28d9, #a855f7)',
                borderRadius: '12px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(109, 40, 217, 0.25)',
                flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                  <path d="M14 2L3 8v12l11 6 11-6V8L14 2z" fill="white" opacity="0.9"/>
                  <path d="M10 13.5c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill="white" opacity="0.5"/>
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: '1.0625rem', color: '#1c1917' }}>Berndos Flohmarkt</div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', color: '#a8a29e', marginTop: '1px' }}>Privater Verkauf</div>
              </div>
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', color: '#78716c', lineHeight: 1.6, maxWidth: '220px' }}>
              Schöne Einzelstücke aus privatem Besitz. Jedes Stück mit Geschichte.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.875rem', color: '#1c1917', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Navigation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { href: '/', label: '🏪 Markt' },
                { href: '/cart', label: '🛒 Warenkorb' },
                { href: '/kontakt', label: '✉️ Kontakt' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9375rem', color: '#78716c', textDecoration: 'none', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#6d28d9')}
                  onMouseOut={e => (e.currentTarget.style.color = '#78716c')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.875rem', color: '#1c1917', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Rechtliches</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                { href: '/impressum', label: 'ℹ️ Impressum' },
                { href: '/datenschutz', label: '🔒 Datenschutz' },
              ].map(link => (
                <Link key={link.href} href={link.href} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9375rem', color: '#78716c', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseOver={e => (e.currentTarget.style.color = '#6d28d9')}
                  onMouseOut={e => (e.currentTarget.style.color = '#78716c')}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: '0.875rem', color: '#1c1917', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Zahlung & Versand</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['💙 PayPal', '🏦 Banküberweisung', '📦 DHL Versand'].map(item => (
                <div key={item} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.9375rem', color: '#78716c' }}>{item}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8125rem', color: '#a8a29e', margin: 0 }}>
            © {new Date().getFullYear()} Berndos Flohmarkt · Alle Rechte vorbehalten
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.8125rem', color: '#a8a29e', margin: 0 }}>
            🏷️ Privater Verkauf · Keine Gewährleistung
          </p>
        </div>
      </div>
    </footer>
  );
}
