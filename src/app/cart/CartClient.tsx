'use client';
import React, { useState, useEffect } from 'react';

export default function CartClient() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('BANK_TRANSFER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', address: '', city: '', zip: '' });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(console.error);
  }, []);

  function updateQuantity(index: number, delta: number) {
    setCartItems(prev => {
      const updated = [...prev];
      const newQty = (updated[index].quantity || 1) + delta;
      if (newQty < 1) { updated.splice(index, 1); }
      else { updated[index] = { ...updated[index], quantity: newQty }; }
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }

  function removeItem(index: number) {
    setCartItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      localStorage.setItem('cart', JSON.stringify(updated));
      return updated;
    });
  }

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);
  const shippingCost = cartItems.length > 0 ? 6.20 : 0;
  const totalAmount = subtotal + shippingCost;

  const handleOrder = async () => {
    if (!formData.name || !formData.email || !formData.address || !formData.zip || !formData.city) {
      alert('Bitte alle Felder ausfuellen.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, paymentMethod, subtotal, shippingCost, totalAmount, items: cartItems }),
      });
      if (response.ok) { localStorage.clear(); window.location.href = '/success'; }
    } catch { alert('Fehler bei der Bestellung.'); setIsSubmitting(false); }
  };

  const qtyBtnStyle: React.CSSProperties = {
    width: '38px', height: '38px', borderRadius: '50%',
    border: '2px solid #6d28d9', background: 'white', color: '#6d28d9',
    fontWeight: 800, fontSize: '1.25rem', cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block', marginBottom: '0.4rem',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
    fontSize: '0.9375rem', color: '#1c1917',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.875rem 1.125rem',
    borderRadius: '12px', border: '1.5px solid #e7e0d5',
    fontSize: 'max(16px, 1rem)', fontFamily: "'DM Sans', sans-serif",
    color: '#1c1917', outline: 'none', boxSizing: 'border-box' as 'border-box',
    background: '#fffdf8',
  };

  const methodStyle = (active: boolean): React.CSSProperties => ({
    padding: '1.25rem 1.375rem',
    borderRadius: '18px',
    border: active ? '2px solid #6d28d9' : '1.5px solid #e7e0d5',
    background: active ? 'white' : '#fdfaf5',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: active ? '0 4px 16px rgba(109,40,217,0.12)' : 'none',
  });

  return (
    <div style={{
      maxWidth: '700px', margin: '0 auto',
      padding: 'clamp(1.25rem, 4vw, 2.5rem)',
      fontFamily: "'DM Sans', sans-serif", color: '#1c1917',
    }}>
      <h1 style={{
        textAlign: 'center',
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: 'clamp(2rem, 6vw, 2.75rem)',
        fontWeight: 900, marginBottom: '2rem',
        color: '#1c1917', letterSpacing: '-0.02em',
      }}>
        Warenkorb
      </h1>

      {/* Artikel */}
      <div style={{ background: 'white', padding: 'clamp(1.25rem, 4vw, 2rem)', borderRadius: '20px', border: '1px solid #e7e0d5', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(120,80,20,0.07)' }}>
        <h2 style={{ margin: '0 0 1rem', fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700, borderBottom: '2px solid #f0ebe2', paddingBottom: '0.875rem' }}>
          Deine Artikel
        </h2>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: '#78716c' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🛒</div>
            <p style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '1rem' }}>Dein Warenkorb ist leer.</p>
            <a href="/" style={{ display: 'inline-block', padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg, #6d28d9, #ec4899)', color: 'white', borderRadius: '999px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 14px rgba(109,40,217,0.3)' }}>
              Zum Shop
            </a>
          </div>
        ) : (
          <>
            {cartItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 0', borderBottom: '1px solid #f0ebe2', flexWrap: 'wrap' }}>
                <span style={{ flex: 1, fontSize: 'clamp(1rem, 3vw, 1.125rem)', fontWeight: 600, minWidth: '120px' }}>{item.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
                  <button onClick={() => updateQuantity(i, -1)} style={qtyBtnStyle}>−</button>
                  <span style={{ fontWeight: 800, fontSize: '1.125rem', minWidth: '24px', textAlign: 'center' }}>{item.quantity || 1}</span>
                  <button onClick={() => updateQuantity(i, +1)} style={qtyBtnStyle}>+</button>
                </div>
                <span style={{ fontWeight: 700, fontSize: '1.125rem', minWidth: '80px', textAlign: 'right', flexShrink: 0 }}>
                  {(Number(item.price) * (item.quantity || 1)).toFixed(2)} €
                </span>
                <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.375rem', color: '#dc2626', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  🗑️
                </button>
              </div>
            ))}
            <div style={{ marginTop: '1.25rem', borderTop: '2px solid #6d28d9', paddingTop: '1.125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', color: '#78716c', marginBottom: '0.625rem' }}>
                <span>Versandkosten (DHL)</span>
                <span>{shippingCost.toFixed(2)} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 900 }}>
                <span>Gesamtbetrag</span>
                <span style={{ color: '#6d28d9' }}>{totalAmount.toFixed(2)} €</span>
              </div>
            </div>
          </>
        )}
      </div>

      {cartItems.length > 0 && (
        <>
          {/* Zahlungsmethode */}
          <h3 style={{ fontSize: '1.25rem', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, marginBottom: '1rem', color: '#1c1917' }}>
            Zahlungsmethode
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', marginBottom: '1.75rem' }}>

            {/* Bank */}
            <div onClick={() => setPaymentMethod('BANK_TRANSFER')} style={methodStyle(paymentMethod === 'BANK_TRANSFER')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: paymentMethod === 'BANK_TRANSFER' ? '7px solid #6d28d9' : '2px solid #d6d3d1', background: 'white', flexShrink: 0, transition: 'all 0.2s' }} />
                <strong style={{ fontSize: '1.125rem', fontFamily: "'DM Sans', sans-serif" }}>🏦 Banküberweisung / Vorkasse</strong>
              </div>
              {paymentMethod === 'BANK_TRANSFER' && settings && (
                <div style={{ marginTop: '1.125rem', padding: '1.25rem', background: '#f5f0ff', borderRadius: '14px', border: '1px dashed #a855f7', lineHeight: 1.8 }}>
                  <p style={{ fontWeight: 700, color: '#6d28d9', margin: '0 0 0.75rem', fontSize: '1.0625rem' }}>
                    Ueberweisen Sie bitte an:
                  </p>
                  <div style={{ fontSize: '1.0625rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div><strong>Inhaber:</strong> {settings.bankHolder || 'Bernd Geske'}</div>
                    <div><strong>IBAN:</strong> {settings.bankIban || 'Nicht hinterlegt'}</div>
                    <div><strong>BIC:</strong> {settings.bankBic || 'Nicht hinterlegt'}</div>
                    <div><strong>Bank:</strong> {settings.bankName || 'Norisbank Berlin'}</div>
                  </div>
                  <p style={{ marginTop: '1rem', fontSize: '1rem', fontStyle: 'italic', color: '#78716c', margin: '1rem 0 0' }}>
                    Verwendungszweck: Bitte in Echtzeitüberweisung
                  </p>
                </div>
              )}
            </div>

            {/* PayPal */}
            <div onClick={() => setPaymentMethod('PAYPAL')} style={methodStyle(paymentMethod === 'PAYPAL')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: paymentMethod === 'PAYPAL' ? '7px solid #6d28d9' : '2px solid #d6d3d1', background: 'white', flexShrink: 0, transition: 'all 0.2s' }} />
                <strong style={{ fontSize: '1.125rem', fontFamily: "'DM Sans', sans-serif" }}>💙 PayPal</strong>
              </div>
              {paymentMethod === 'PAYPAL' && (
                <div style={{ marginTop: '1.125rem', padding: '1.25rem', background: '#f0f9ff', borderRadius: '14px', border: '1px dashed #0070ba', lineHeight: 1.8 }}>
                  <p style={{ fontWeight: 700, color: '#0070ba', margin: '0 0 0.75rem', fontSize: '1.0625rem' }}>
                    PayPal Zahlung an:
                  </p>
                  <strong style={{ fontSize: '1.125rem' }}>{settings?.paypalClientId || 'berndos59@gmail.com'}</strong>
                  <p style={{ marginTop: '1rem', fontSize: '1rem', fontStyle: 'italic', color: '#78716c', margin: '1rem 0 0' }}>
                    Verwendungszweck: Bitte manuell überweisen, siehe E-Mail Adresse
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Versandadresse */}
          <div style={{ background: 'white', padding: 'clamp(1.25rem, 4vw, 2rem)', borderRadius: '20px', border: '1px solid #e7e0d5', boxShadow: '0 4px 20px rgba(120,80,20,0.07)' }}>
            <h3 style={{ margin: '0 0 1.375rem', fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.25rem', fontWeight: 700 }}>
              Versandadresse
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Vollständiger Name *</label>
                <input style={inputStyle} placeholder="Max Mustermann" onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>E-Mail Adresse *</label>
                <input type="email" style={inputStyle} placeholder="max@email.de" onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Straße und Hausnummer *</label>
                <input style={inputStyle} placeholder="Musterstraße 1" onChange={e => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '0.875rem' }}>
                <div>
                  <label style={labelStyle}>PLZ *</label>
                  <input style={inputStyle} placeholder="12345" onChange={e => setFormData({ ...formData, zip: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Stadt *</label>
                  <input style={inputStyle} placeholder="Berlin" onChange={e => setFormData({ ...formData, city: e.target.value })} />
                </div>
              </div>
              <button
                onClick={handleOrder}
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: 'clamp(1rem, 3vw, 1.25rem)',
                  background: isSubmitting ? '#d6d3d1' : 'linear-gradient(135deg, #6d28d9, #ec4899)',
                  color: 'white', border: 'none', borderRadius: '16px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 800, fontSize: 'clamp(1.0625rem, 3vw, 1.25rem)',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  marginTop: '0.5rem',
                  boxShadow: isSubmitting ? 'none' : '0 6px 20px rgba(109,40,217,0.35)',
                  minHeight: '60px',
                  transition: 'all 0.2s',
                }}
              >
                {isSubmitting ? '⏳ Wird verarbeitet...' : '✓ Kostenpflichtig bestellen'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}