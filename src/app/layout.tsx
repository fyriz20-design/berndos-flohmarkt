import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCart from '@/components/FloatingCart';

export const metadata: Metadata = {
  title: 'Berndos Flohmarkt – Privater Verkauf von Einzelstücken',
  description: 'Privater Flohmarkt mit schönen Einzelstücken aus zweiter Hand. Stöbere durch gebrauchte Artikel, stelle eine Kaufanfrage und bezahle bequem per PayPal oder Banküberweisung. Faire Preise, schneller Versand per DHL.',
  keywords: 'Flohmarkt, Privatverkauf, gebraucht kaufen, Second Hand, Einzelstücke, PayPal, DHL Versand',
  openGraph: {
    title: 'Berndos Flohmarkt – Privater Verkauf von Einzelstücken',
    description: 'Schöne Einzelstücke aus privatem Besitz. Faire Preise, schneller Versand.',
    url: 'https://www.berndos-flohmarkt.de',
    siteName: 'Berndos Flohmarkt',
    locale: 'de_DE',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <CartProvider>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
          <FloatingCart />
        </CartProvider>
      </body>
    </html>
  );
}
