'use client'
import { useState, useRef } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState('IDLE')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('LOADING')
    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify({ name: formData.get('name'), email: formData.get('email'), message: formData.get('message') }),
        headers: { 'Content-Type': 'application/json' }
      })
      if (res.ok) { setStatus('SUCCESS'); if (formRef.current) formRef.current.reset() }
      else { const err = await res.json().catch(() => ({})); setErrorMessage(err.error || 'Fehler'); setStatus('ERROR') }
    } catch { setErrorMessage('Verbindungsfehler.'); setStatus('ERROR') }
  }

  const inp = { width: '100%', padding: '0.875rem 1rem', borderRadius: '10px', border: '1.5px solid #e9d5ff', fontSize: '1rem', fontFamily: 'inherit', color: '#1c1917', outline: 'none', boxSizing: 'border-box', background: '#faf5ff' }
  const lbl = { display: 'block', marginBottom: '0.375rem', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }

  if (status === 'SUCCESS') return (
    <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
      <h3 style={{ fontSize: '1.375rem', fontWeight: 800, color: '#1c1917', marginBottom: '0.5rem' }}>Nachricht gesendet!</h3>
      <p style={{ color: '#6b7280', marginBottom: '1.25rem' }}>Ich melde mich so schnell wie moeglich.</p>
      <button onClick={() => setStatus('IDLE')} style={{ padding: '0.625rem 1.25rem', background: '#f5f0ff', color: '#7c3aed', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>Weitere Nachricht</button>
    </div>
  )

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
      <h2 style={{ margin: '0 0 0.25rem', fontWeight: 800, color: '#1c1917', fontSize: '1.25rem' }}>Kontaktformular</h2>
      {status === 'ERROR' && <div style={{ padding: '0.875rem', background: '#fef2f2', color: '#dc2626', borderRadius: '10px', border: '1px solid #fecaca' }}>❌ {errorMessage}</div>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div><label style={lbl}>Dein Name *</label><input type='text' name='name' required disabled={status === 'LOADING'} placeholder='Max Mustermann' style={inp} /></div>
        <div><label style={lbl}>E-Mail *</label><input type='email' name='email' required disabled={status === 'LOADING'} placeholder='max@email.de' style={inp} /></div>
      </div>
      <div><label style={lbl}>Nachricht *</label><textarea name='message' rows={5} required disabled={status === 'LOADING'} placeholder='Ich haette Interesse an...' style={{ ...inp, resize: 'vertical', minHeight: '120px' }} /></div>
      <button type='submit' disabled={status === 'LOADING'} style={{ padding: '0.875rem', background: status === 'LOADING' ? '#d1d5db' : 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: status === 'LOADING' ? 'not-allowed' : 'pointer', minHeight: '52px' }}>
        {status === 'LOADING' ? 'Wird gesendet...' : 'Nachricht senden'}
      </button>
    </form>
  )
}
