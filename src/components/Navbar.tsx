'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import './Navbar.css';

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
      <header className="navbar glass">
        <div className="navbar-container">
          <Link href="/" className="navbar-brand" onClick={close}>
            <div className="navbar-logo-icon">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <defs><linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fff"/><stop offset="100%" stopColor="#e9d5ff"/></linearGradient></defs>
                <path d="M14 2L3 8v12l11 6 11-6V8L14 2z" fill="url(#lg)" opacity="0.9"/>
                <path d="M10 13.5c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <div className="navbar-brand-text">
              <span className="navbar-brand-name">Berndos- Flohmarkt</span>
              <span className="navbar-brand-sub">Flohmarkt • Privatverkauf</span>
            </div>
          </Link>

          <nav className={`nav-links ${isOpen ? 'nav-links-open' : ''}`}>
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`nav-link ${isActive ? 'nav-link-active' : ''}`} onClick={close}>
                  <span className="nav-link-icon">{item.icon}</span>
                  <span className="nav-link-label-mobile">{item.label}</span>
                  {item.href === '/cart' && cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
                </Link>
              );
            })}
          </nav>

          <div className="navbar-actions">
            <Link href="/cart" className="navbar-mobile-cart" onClick={close}>
              <span>🛒</span>
              {cartCount > 0 && <span className="nav-cart-badge">{cartCount}</span>}
            </Link>
            <button className={`navbar-mobile-toggle ${isOpen ? 'navbar-mobile-toggle-active' : ''}`} onClick={() => setIsOpen(!isOpen)} aria-label="Menue">
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
      {isOpen && <div className="nav-overlay nav-overlay-visible" onClick={close} />}
    </>
  );
}
