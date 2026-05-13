'use client'
import { useState } from 'react'
import { loginAction } from './actions'

export default function LoginForm() {
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)
    if (!result.success) {
      setError(result.error || 'Fehler')
    } else {
      window.location.reload()
    }
  }

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="card card-content">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Admin Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Passwort</label>
            <input type="password" name="password" className="input" required />
          </div>
          {error && <p style={{ color: 'var(--color-error)' }}>{error}</p>}
          <button type="submit" className="btn btn-primary">Anmelden</button>
        </form>
      </div>
    </div>
  )
}
