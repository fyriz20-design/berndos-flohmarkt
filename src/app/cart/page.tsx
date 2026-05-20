export const dynamic = 'force-dynamic'
import CartClient from './CartClient';

// Diese Seite lädt nur den Client
export default function CartPage() {
  return (
    <main>
      <CartClient />
    </main>
  );
}
