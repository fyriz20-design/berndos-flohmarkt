'use client';

import React, { useState, useEffect } from 'react';

export default function CartClient() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('BANK_TRANSFER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    address: '', 
    city: '', 
    zip: '' 
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error("Fehler beim Laden der Zahlungsdaten", err));
  }, []);

  function updateQuantity(index: number, delta: number) {
    setCartItems(prev => {
      const updated = [...prev];
      const newQty = (updated[index].quantity || 1) + delta;
      if (newQty < 1) {
        updated.splice(index, 1);
      } else {
        updated[index] = { ...updated[index], quantity: newQty };
      }
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
      alert("Bitte fülle alle Adressfelder aus.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          paymentMethod, 
          subtotal, 
          shippingCost, 
          totalAmount, 
          items: cartItems 
        }),
      });
      if (response.ok) {
        localStorage.clear();
        window.location.href = '/success';
      }
    } catch (error) {
      alert("Fehler bei der Bestellung.");
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', color: '#333' }}>
      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '30px' }}>Warenkorb</h1>

      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '20px', border: '1px solid #eee', marginBottom: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginTop: 0, fontSize: '22px', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px' }}>Deine Artikel</h2>
        {cartItems.length === 0 ? (
          <p style={{ fontSize: '18px' }}>Dein Warenkorb ist leer.</p>
        ) : (
          cartItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f9f9f9', gap: '12px' }}>
              <span style={{ fontSize: '16px', flex: 1 }}>{item.title}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <button onClick={() => updateQuantity(i, -1)} style={qtyBtnStyle}>−</button>
                <span style={{ fontSize: '16px', fontWeight: 700, minWidth: '24px', textAlign: 'center' }}>{item.quantity || 1}</span>
                <button onClick={() => updateQuantity(i, +1)} style={qtyBtnStyle}>+</button>
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '16px', minWidth: '75px', textAlign: 'right' }}>
                {(Number(item.price) * (item.quantity || 1)).toFixed(2)} €
              </span>
              <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#ef4444', flexShrink: 0, padding: '0 4px' }}>🗑️</button>
            </div>
          ))
        )}
        <div style={{ marginTop: '20px', borderTop: '3px solid #8b5cf6', paddingTop: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', color: '#666' }}>
            <span>Versandkosten (DHL):</span>
            <span>{shippingCost.toFixed(2)} €</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>
            <span>Gesamtbetrag:</span>
            <span>{totalAmount.toFixed(2)} €</span>
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '22px', marginBottom: '15px' }}>Zahlungsmethode</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
        <div onClick={() => setPaymentMethod('BANK_TRANSFER')} style={methodContainerStyle(paymentMethod === 'BANK_TRANSFER')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="radio" checked={paymentMethod === 'BANK_TRANSFER'} style={{ width: '20px', height: '20px' }} readOnly />
            <strong style={{ fontSize: '18px' }}>Banküberweisung / Vorkasse</strong>
          </div>
          {paymentMethod === 'BANK_TRANSFER' && settings && (
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f5f3ff', borderRadius: '10px', border: '1px dashed #8b5cf6', fontSize: '16px', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 8px 0', fontWeight: 'bold', color: '#8b5cf6' }}>Überweisen Sie bitte an:</p>
              <div><strong>Inhaber:</strong> {settings.bankHolder || 'Bernd Geske'}</div>
              <div><strong>IBAN:</strong> {settings.bankIban || 'Nicht hinterlegt'}</div>
              <div><strong>BIC:</strong> {settings.bankBic || 'Nicht hinterlegt'}</div>
              <div><strong>Bank:</strong> {settings.bankName || 'Norisbank Berlin'}</div>
              <p style={{ marginTop: '10px', fontSize: '14px', fontStyle: 'italic' }}>Bitte Überweisung mit Verwendungszweck: Name und Artikel</p>
            </div>
          )}
        </div>

        <div onClick={() => setPaymentMethod('PAYPAL')} style={methodContainerStyle(paymentMethod === 'PAYPAL')}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="radio" checked={paymentMethod === 'PAYPAL'} style={{ width: '20px', height: '20px' }} readOnly />
            <strong style={{ fontSize: '18px' }}>PayPal</strong>
          </div>
          {paymentMethod === 'PAYPAL' && (
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f0f9ff', borderRadius: '10px', border: '1px dashed #0070ba', fontSize: '16px', lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#0070ba' }}>PayPal Zahlung:</p>
              Senden Sie den Betrag bitte an:<br/>
              <strong>{settings?.paypalClientId || 'berndos59@gmail.com'}</strong><br/>
              <p style={{ marginTop: '10px', fontSize: '14px', fontStyle: 'italic' }}>Bitte Verwendungszweck: Name und Artikel angeben</p>
            </div>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '20px', border: '1px solid #eee', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <h3 style={{ marginTop: 0, fontSize: '22px', marginBottom: '20px' }}>Versandadresse</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input style={inputStyle} placeholder="Vollständiger Name" onChange={e => setFormData({...formData, name: e.target.value})} />
          <input style={inputStyle} placeholder="E-Mail Adresse" onChange={e => setFormData({...formData, email: e.target.value})} />
          <input style={inputStyle} placeholder="Straße und Hausnummer" onChange={e => setFormData({...formData, address: e.target.value})} />
          <div style={{ display: 'flex', gap: '12px' }}>
            <input style={{...inputStyle, width: '35%'}} placeholder="PLZ" onChange={e => setFormData({...formData, zip: e.target.value})} />
            <input style={{...inputStyle, width: '65%'}} placeholder="Stadt" onChange={e => setFormData({...formData, city: e.target.value})} />
          </div>
          <button onClick={handleOrder} disabled={isSubmitting || cartItems.length === 0} style={{...btnStyle, opacity: (isSubmitting || cartItems.length === 0) ? 0.6 : 1}}>
            {isSubmitting ? 'Wird verarbeitet...' : 'Kostenpflichtig bestellen'}
          </button>
        </div>
      </div>
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #8b5cf6',
  background: 'white', color: '#8b5cf6', fontWeight: 800, fontSize: '18px',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  lineHeight: 1, padding: 0,
};
const inputStyle = { padding: '15px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '18px', width: '100%', boxSizing: 'border-box' as 'border-box' };
const btnStyle = { backgroundColor: '#8b5cf6', color: 'white', padding: '20px', borderRadius: '15px', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '20px', marginTop: '15px', boxShadow: '0 4px 6px rgba(139, 92, 246, 0.3)', width: '100%' };
const methodContainerStyle = (active: boolean) => ({
  padding: '20px', borderRadius: '15px', border: active ? '2px solid #8b5cf6' : '1px solid #eee',
  backgroundColor: active ? '#fff' : '#fafafa', cursor: 'pointer', transition: 'all 0.2s ease',
  boxShadow: active ? '0 4px 10px rgba(139, 92, 246, 0.1)' : 'none'
});