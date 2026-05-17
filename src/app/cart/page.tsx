export const dynamic = 'force-dynamic'
import CartClient from './CartClient';

// Diese Seite lÃ¤dt nur den Client
export default function CartPage() {
  return (
    <main>
      <CartClient />
    </main>
  );
}
