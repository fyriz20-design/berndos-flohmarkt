import Link from 'next/link';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <defs>
                <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <path d="M14 2L3 8v12l11 6 11-6V8L14 2z" fill="url(#footerLogoGrad)" opacity="0.9"/>
              <path d="M14 5L6 9.5v9L14 23l8-4.5v-9L14 5z" fill="white" opacity="0.3"/>
              <path d="M10 13.5c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4-4-1.8-4-4z" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span className="footer-brand-name">Berndos- Flohmarkt</span>
        </div>

        <div className="footer-links">
          <Link href="/impressum" className="footer-link">Impressum</Link>
          <span className="footer-divider">•</span>
          <Link href="/datenschutz" className="footer-link">Datenschutz</Link>
          <span className="footer-divider">•</span>
          <Link href="/kontakt" className="footer-link">Kontakt</Link>
        </div>

        <p className="footer-copyright">
          &copy; {new Date().getFullYear()} Berndos Flohmarkt. Alle Rechte vorbehalten.
        </p>
      </div>
    </footer>
  );
}
