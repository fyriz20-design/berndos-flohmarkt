'use client'
import { useState, useRef } from 'react'

export default function ContactForm() {
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE')
  const [errorMessage, setErrorMessage] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('LOADING')
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message')
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      })

      if (res.ok) {
        setStatus('SUCCESS')
        formRef.current?.reset()
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unbekannter Fehler' }))
        setErrorMessage(errorData.error || 'Fehler beim Senden.')
        setStatus('ERROR')
      }
    } catch {
      setErrorMessage('Verbindungsfehler. Bitte versuche es später erneut.')
      setStatus('ERROR')
    }
  }

  if (status === 'SUCCESS') {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{
          width: '80px', height: '80px',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.5rem',
          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
        }}>✓</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.75rem' }}>
          Nachricht gesendet! 🎉
        </h3>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          Vielen Dank! Ich melde mich so schnell wie möglich bei dir.
        </p>
        <button
          onClick={() => setStatus('IDLE')}
          style={{ padding: '0.75rem 1.5rem', background: '#f5f0ff', color: '#7c3aed', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9375rem' }}
        >
          Weitere Nachricht senden
        </button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h2 style={{ margin: '0 0 0.5rem', fontWeight: 800, color: '#1e1b4b', fontSize: '1.375rem' }}>
        Kontaktformular
      </h2>

      {status === 'ERROR' && (
        <div style={{ padding: '1rem 1.25rem', background: '#fef2f2', color: '#dc2626', borderRadius: '12px', border: '1px solid #fecaca', fontSize: '0.9375rem' }}>
          ❌ {errorMessage}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={labelStyle}>Dein Name *</label>
          <input type="text" name="name" required disabled={status === 'LOADING'} placeholder="Max Mustermann" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>E-Mail Adresse *</label>
          <input type="email" name="email" required disabled={status === 'LOADING'} placeholder="max@email.de" style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Deine Nachricht *</label>
        <textarea
          name="message"
          rows={6}
          required
          disabled={status === 'LOADING'}
          placeholder="Ich hätte Interesse an dem Artikel... / Ich habe eine Frage zu..."
          style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' } as React.CSSProperties}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'LOADING'}
        style={{
          padding: '0.875rem 2rem',
          background: status === 'LOADING' ? '#d1d5db' : 'linear-gradient(135deg, #7c3aed, #ec4899)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 700,
          fontSize: '1rem',
          cursor: status === 'LOADING' ? 'not-allowed' : 'pointer',
          boxShadow: status === 'LOADING' ? 'none' : '0 4px 15px rgba(124, 58, 237, 0.3)',
          transition: 'all 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
        }}
      >
        {status === 'LOADING' ? (
          <>⏳ Wird gesendet...</>
        ) : (
          <>✉️ Nachricht senden</>
        )}
      </button>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.375rem',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: '#374151',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem 1rem',
  borderRadius: '10px',
  border: '1.5px solid #e9d5ff',
  fontSize: '0.9375rem',
  fontFamily: 'inherit',
  color: '#1e1b4b',
  outline: 'none',
  boxSizing: 'border-box',
  background: '#faf5ff',
  transition: 'border-color 0.2s',
}
