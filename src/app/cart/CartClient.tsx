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

  const qtyBtnStyle: React.CSSProperties = { width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #7c3aed', background: 'white', color: '#7c3aed', fontWeight: 800, fontSize: '1.125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 };
  const labelStyle: React.CSSProperties = { display: 'block', marginBottom: '0.375rem', fontWeight: 600, fontSize: '0.875rem', color: '#374151' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', borderRadius: '10px', border: '1.5px solid #e9d5ff', fontSize: 'max(16px, 1rem)', fontFamily: 'inherit', color: '#1e1b4b', outline: 'none', boxSizing: 'border-box' as 'border-box', background: '#faf5ff' };
  const methodStyle = (active: boolean): React.CSSProperties => ({ padding: 'clamp(0.875rem, 3vw, 1.25rem)', borderRadius: '16px', border: active ? '2px solid #7c3aed' : '1.5px solid #e9d5ff', background: active ? 'white' : '#fafafa', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: active ? '0 4px 15px rgba(124,58,237,0.1)' : 'none' });

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)', fontFamily: 'inherit', color: '#1e1b4b' }}>
      <h1 style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 6vw, 2.25rem)', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.02em' }}>Warenkorb</h1>

      <div style={{ background: 'white', padding: 'clamp(1rem, 4vw, 1.75rem)', borderRadius: '20px', border: '1px solid #e9d5ff', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(124,58,237,0.06)' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.125rem', fontWeight: 700, borderBottom: '2px solid #f3e8ff', paddingBottom: '0.75rem' }}>Deine Artikel</h2>
        {cartItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🛒</div>
            <p style={{ fontWeight: 600, marginBottom: '1rem' }}>Dein Warenkorb ist leer.</p>
            <a href="/" style={{ display: 'inline-block', padding: '0.625rem 1.5rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', borderRadius: '999px', fontWeight: 700, textDecoration: 'none' }}>Zum Shop</a>
          </div>
        ) : (
          <>
            {cartItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem 0', borderBottom: '1px solid #f3e8ff', flexWrap: 'wrap' }}>
                <span style={{ flex: 1, fontSize: 'clamp(0.875rem, 3vw, 1rem)', fontWeight: 500, minWidth: '120px' }}>{item.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <button onClick={() => updateQuantity(i, -1)} style={qtyBtnStyle}>−</button>
                  <span style={{ fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{item.quantity || 1}</span>
                  <button onClick={() => updateQuantity(i, +1)} style={qtyBtnStyle}>+</button>
                </div>
                <span style={{ fontWeight: 700, minWidth: '70px', textAlign: 'right', flexShrink: 0 }}>{(Number(item.price) * (item.quantity || 1)).toFixed(2)} €</span>
                <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem', color: '#ef4444', minWidth: '44px', minHeight: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑️</button>
              </div>
            ))}
            <div style={{ marginTop: '1rem', borderTop: '2px solid #7c3aed', paddingTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                <span>Versandkosten (DHL)</span><span>{shippingCost.toFixed(2)} €</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(1.125rem, 4vw, 1.375rem)', fontWeight: 800 }}>
                <span>Gesamtbetrag</span><span style={{ color: '#7c3aed' }}>{totalAmount.toFixed(2)} €</span>
              </div>
            </div>
          </>
        )}
      </div>

      {cartItems.length > 0 && <>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.875rem' }}>Zahlungsmethode</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div onClick={() => setPaymentMethod('BANK_TRANSFER')} style={methodStyle(paymentMethod === 'BANK_TRANSFER')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: paymentMethod === 'BANK_TRANSFER' ? '6px solid #7c3aed' : '2px solid #d1d5db', background: 'white', flexShrink: 0 }} />
              <strong>🏦 Banküberweisung / Vorkasse</strong>
            </div>
            {paymentMethod === 'BANK_TRANSFER' && settings && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f5f0ff', borderRadius: '12px', border: '1px dashed #a855f7', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                <p style={{ fontWeight: 700, color: '#7c3aed', margin: '0 0 0.5rem' }}>Ueberweisen Sie bitte an:</p>
                <div><strong>Inhaber:</strong> {settings.bankHolder || 'Bernd Geske'}</div>
                <div><strong>IBAN:</strong> {settings.bankIban || 'Nicht hinterlegt'}</div>
                <div><strong>BIC:</strong> {settings.bankBic || 'Nicht hinterlegt'}</div>
                <div><strong>Bank:</strong> {settings.bankName || 'Norisbank Berlin'}</div>
                <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', fontStyle: 'italic', color: '#6b7280' }}>Verwendungszweck: Name + Artikel</p>
              </div>
            )}
          </div>
          <div onClick={() => setPaymentMethod('PAYPAL')} style={methodStyle(paymentMethod === 'PAYPAL')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: paymentMethod === 'PAYPAL' ? '6px solid #7c3aed' : '2px solid #d1d5db', background: 'white', flexShrink: 0 }} />
              <strong>💙 PayPal</strong>
            </div>
            {paymentMethod === 'PAYPAL' && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '12px', border: '1px dashed #0070ba', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                <p style={{ fontWeight: 700, color: '#0070ba', margin: '0 0 0.5rem' }}>PayPal Zahlung an:</p>
                <strong>{settings?.paypalClientId || 'berndos59@gmail.com'}</strong>
                <p style={{ marginTop: '0.75rem', fontSize: '0.8125rem', fontStyle: 'italic', color: '#6b7280' }}>Verwendungszweck: Name + Artikel</p>
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'white', padding: 'clamp(1rem, 4vw, 1.75rem)', borderRadius: '20px', border: '1px solid #e9d5ff', boxShadow: '0 4px 20px rgba(124,58,237,0.06)' }}>
          <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.125rem', fontWeight: 700 }}>Versandadresse</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <div><label style={labelStyle}>Vollstaendiger Name *</label><input style={inputStyle} placeholder="Max Mustermann" onChange={e => setFormData({ ...formData, name: e.target.value })} /></div>
            <div><label style={labelStyle}>E-Mail Adresse *</label><input type="email" style={inputStyle} placeholder="max@email.de" onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
            <div><label style={labelStyle}>Strasse und Hausnummer *</label><input style={inputStyle} placeholder="Musterstrasse 1" onChange={e => setFormData({ ...formData, address: e.target.value })} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '0.75rem' }}>
              <div><label style={labelStyle}>PLZ *</label><input style={inputStyle} placeholder="12345" onChange={e => setFormData({ ...formData, zip: e.target.value })} /></div>
              <div><label style={labelStyle}>Stadt *</label><input style={inputStyle} placeholder="Berlin" onChange={e => setFormData({ ...formData, city: e.target.value })} /></div>
            </div>
            <button onClick={handleOrder} disabled={isSubmitting} style={{ width: '100%', padding: 'clamp(0.875rem, 3vw, 1.125rem)', background: isSubmitting ? '#d1d5db' : 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: 'clamp(1rem, 3vw, 1.125rem)', cursor: isSubmitting ? 'not-allowed' : 'pointer', marginTop: '0.5rem', boxShadow: isSubmitting ? 'none' : '0 4px 15px rgba(124,58,237,0.3)', minHeight: '56px' }}>
              {isSubmitting ? 'Wird verarbeitet...' : 'Kostenpflichtig bestellen'}
            </button>
          </div>
        </div>
      </>}
    </div>
  );
}
