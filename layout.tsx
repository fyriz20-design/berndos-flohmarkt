import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/components/CartProvider';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingCart from '@/components/FloatingCart';

export const metadata: Metadata = {
  title: 'Berndos Flohmarkt',
  description: 'Privater Flohmarkt mit schönen Einzelstücken. Stöbere, stelle eine Kaufanfrage und bezahle per PayPal oder Banküberweisung.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
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
