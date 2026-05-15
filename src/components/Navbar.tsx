'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isOpen, setIsOpen] = useState(false);
  function close() { setIsOpen(false); }

  const navItems = [
    { href: '/', label: 'Markt', icon: '🏪' },
    { href: '/cart', label: 'Warenkorb', icon: '🛒' },
    { href: '/kontakt', label: 'Kontakt', icon: '✉️' },
    { href: '/impressum', label: 'Impressum', icon: 'ℹ️' },
    { href: '/datenschutz', label: 'Datenschutz', icon: '🔒' },
    { href: '/admin', label: 'Admin', icon: '⚙️' },
  ];

  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(253,250,245,0.93)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(231,224,213,0.7)', boxShadow: '0 1px 4px rgba(120,80,20,0.06)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.625rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>

          {/* Brand */}
          <Link href="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6d28d9, #a855f7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(109,40,217,0.25)', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L3 8v12l11 6 11-6V8L14 2z" fill="white" opacity="0.9"/>
                <path d="M10 13.5c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill="white" opacity="0.5"/>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.0625rem', fontWeight: 700, color: '#1c1917' }}>Berndos- Flohmarkt</span>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.625rem', color: '#a8a29e', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Flohmarkt • Privatverkauf</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? 'nav-link-desktop nav-link-desktop--active' : 'nav-link-desktop'}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.375rem',
                    padding: '0.5rem 0.875rem',
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.8125rem',
                    color: isActive ? 'white' : '#78716c',
                    textDecoration: 'none',
                    borderRadius: '999px',
                    background: isActive ? 'linear-gradient(135deg, #6d28d9, #a855f7)' : 'transparent',
                    boxShadow: isActive ? '0 2px 8px rgba(109,40,217,0.3)' : 'none',
                    transition: 'all 250ms ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontSize: '0.875rem' }}>{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                  {item.href === '/cart' && cartCount > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '18px', height: '18px', padding: '0 4px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.625rem', fontWeight: 700, color: 'white', background: '#f43f5e', borderRadius: '999px' }}>{cartCount}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link href="/cart" onClick={close} className="mobile-only" style={{ position: 'relative', padding: '0.5rem', textDecoration: 'none', color: '#1c1917', fontSize: '1.375rem', minHeight: '44px', minWidth: '44px', display: 'none', alignItems: 'center', justifyContent: 'center' }}>
              🛒
              {cartCount > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', width: '18px', height: '18px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.625rem', fontWeight: 700, color: 'white', background: '#f43f5e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="hamburger-btn" style={{ display: 'none', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem', borderRadius: '10px', minHeight: '44px', minWidth: '44px', alignItems: 'center', justifyContent: 'center' }} aria-label="Menü">
              {[0,1,2].map(i => (
                <span key={i} style={{ width: '22px', height: '2px', background: '#1c1917', borderRadius: '2px', display: 'block', transition: 'all 250ms ease', transform: isOpen ? (i===0 ? 'translateY(7px) rotate(45deg)' : i===2 ? 'translateY(-7px) rotate(-45deg)' : 'none') : 'none', opacity: isOpen && i===1 ? 0 : 1 }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99, display: 'flex' }}>
          <div style={{ flex: 1, background: 'rgba(28,25,23,0.4)', backdropFilter: 'blur(4px)' }} onClick={close} />
          <div style={{ width: 'min(300px, 82vw)', background: '#fdfaf5', display: 'flex', flexDirection: 'column', padding: '5rem 1.5rem 2rem', gap: '0.5rem', boxShadow: '-10px 0 40px rgba(28,25,23,0.15)', overflowY: 'auto', animation: 'slideInRight 0.3s ease-out' }}>
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 1rem', borderRadius: '14px', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '1rem', color: isActive ? 'white' : '#78716c', background: isActive ? 'linear-gradient(135deg, #6d28d9, #a855f7)' : 'transparent', textDecoration: 'none', minHeight: '50px' }}>
                  <span style={{ fontSize: '1.125rem' }}>{item.icon}</span>
                  {item.label}
                  {item.href === '/cart' && cartCount > 0 && (
                    <span style={{ marginLeft: 'auto', width: '22px', height: '22px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.75rem', fontWeight: 700, color: 'white', background: '#f43f5e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <style jsx global>{`
        .nav-link-desktop:not(.nav-link-desktop--active):hover {
          background: #f5f0ff !important;
          color: #6d28d9 !important;
        }

        @media (max-width: 768px) {
          nav { display: none !important; }
          .mobile-only { display: flex !important; }
          .hamburger-btn { display: flex !important; }
        }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </>
  );
}