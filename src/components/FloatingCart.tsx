'use client'
import Link from 'next/link'
import { useCart } from './CartProvider'

export default function FloatingCart() {
  const { items } = useCart()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  if (cartCount === 0) return null

  return (
    <Link href="/cart" className="floating-cart">
      <style jsx>{`
        .floating-cart {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 64px;
          height: 64px;
          background: var(--gradient-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.4);
          z-index: 99;
          text-decoration: none;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation: slideUpBounce 0.5s ease-out;
        }
        .floating-cart:hover {
          transform: scale(1.1);
        }
        .floating-cart:active {
          transform: scale(0.95);
        }
        .cart-icon {
          font-size: 1.5rem;
        }
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--color-accent);
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 800;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        @keyframes slideUpBounce {
          from { transform: translateY(100px) scale(0.5); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @media (max-width: 640px) {
          .floating-cart {
            bottom: 1.5rem;
            right: 1.5rem;
            width: 56px;
            height: 56px;
          }
        }
      `}</style>
      <span className="cart-icon">🛒</span>
      <span className="cart-badge">{cartCount}</span>
    </Link>
  )
}
