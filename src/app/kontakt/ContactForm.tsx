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
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })

      if (res.ok) {
        setStatus('SUCCESS')
        formRef.current?.reset()
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unbekannter Fehler' }))
        setErrorMessage(errorData.error || 'Fehler beim Senden.')
        setStatus('ERROR')
      }
    } catch (error) {
      console.error('Contact form error:', error)
      setErrorMessage('Verbindungsfehler. Bitte versuche es später erneut.')
      setStatus('ERROR')
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
      {status === 'SUCCESS' && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--color-success)', color: 'white', borderRadius: 'var(--radius-md)' }}>
          Vielen Dank für deine Nachricht! Sie wurde erfolgreich versendet.
        </div>
      )}
      
      {status === 'ERROR' && (
        <div style={{ padding: '1rem', backgroundColor: 'var(--color-error)', color: 'white', borderRadius: 'var(--radius-md)' }}>
          {errorMessage}
        </div>
      )}

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Dein Name</label>
        <input type="text" name="name" className="input" required disabled={status === 'LOADING'} />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Deine E-Mail Adresse</label>
        <input type="email" name="email" className="input" required disabled={status === 'LOADING'} />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Deine Nachricht</label>
        <textarea name="message" className="input" rows={6} required disabled={status === 'LOADING'}></textarea>
      </div>

      <button type="submit" className="btn btn-primary" disabled={status === 'LOADING'}>
        {status === 'LOADING' ? 'Wird gesendet...' : 'Nachricht senden'}
      </button>
    </form>
  )
}
