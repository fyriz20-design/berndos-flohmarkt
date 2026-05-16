'use client'
import { useState } from 'react'
import { loginAction } from './actions'

export default function LoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const formData = new FormData(e.currentTarget)
      const result = await loginAction(formData)
      if (result && !result.success) {
        setError(result.error || 'Falsches Passwort')
        setLoading(false)
      }
      // Bei Erfolg macht actions.ts redirect() - kein weiterer Code nötig
    } catch (e) {
      // redirect() wirft einen Error - das ist normal, einfach ignorieren
      window.location.href = '/admin'
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f3ff, #fdf2f8)', padding: '1rem' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '2.5rem', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(124,58,237,0.12)', border: '1px solid #e9d5ff' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #7c3aed, #a855f7)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.5rem' }}>⚙️</div>
          <h2 style={{ fontWeight: 800, color: '#1e1b4b', margin: 0, fontSize: '1.5rem' }}>Admin Login</h2>
          <p style={{ color: '#6b7280', margin: '0.5rem 0 0', fontSize: '0.875rem' }}>Berndos Flohmarkt Verwaltung</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.875rem', color: '#374151' }}>Passwort</label>
            <input
              type="password"
              name="password"
              required
              style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '12px', border: '1.5px solid #e9d5ff', fontSize: '1rem', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' as 'border-box', background: '#faf5ff', color: '#1e1b4b' }}
            />
          </div>
          {error && <p style={{ color: '#dc2626', background: '#fef2f2', padding: '0.75rem', borderRadius: '10px', margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.875rem', background: loading ? '#d1d5db' : 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 4px 14px rgba(124,58,237,0.3)', marginTop: '0.5rem' }}
          >
            {loading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>
      </div>
    </div>
  )
}
