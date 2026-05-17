'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SuccessPage() {
  const [show, setShow] = useState(false)
  useEffect(() => { setTimeout(() => setShow(true), 100) }, [])

  const steps = [
    { icon: 'ðŸ“§', text: 'Du erhÃ¤ltst eine BestÃ¤tigungs-E-Mail' },
    { icon: 'ðŸ’³', text: 'Bitte Ã¼berweise den Betrag mit deinem Namen als Verwendungszweck' },
    { icon: 'ðŸ“¦', text: 'Nach Zahlungseingang versenden wir deinen Artikel' },
    { icon: 'ðŸšš', text: 'Du erhÃ¤ltst die Sendungsverfolgung per E-Mail' },
  ]

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #faf5ff 100%)' }}>
      <div style={{ textAlign: 'center', maxWidth: '520px', opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(30px)', transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)' }}>
        <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '2.5rem', boxShadow: '0 20px 40px rgba(124, 58, 237, 0.3)', color: 'white', fontWeight: 900 }}>
          âœ“
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 900, color: '#1e1b4b', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Vielen Dank! ðŸŽ‰
        </h1>
        <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem' }}>
          Deine Bestellung ist bei uns eingegangen. Wir melden uns so schnell wie mÃ¶glich bei dir.
        </p>
        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e9d5ff', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.08)', textAlign: 'left' }}>
          <h3 style={{ color: '#7c3aed', fontWeight: 700, fontSize: '1rem', margin: '0 0 1rem' }}>NÃ¤chste Schritte:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem', color: '#374151' }}>
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{step.icon}</span>
                <span>{step.text}</span>
              </div>
            ))}
          </div>
        </div>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.875rem 2rem', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', color: 'white', borderRadius: '999px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.3)' }}>
          ðŸª ZurÃ¼ck zum Shop
        </Link>
      </div>
    </div>
  )
}
