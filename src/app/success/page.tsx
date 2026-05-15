'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function SuccessPage() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setTimeout(() => setShow(true), 100)
  }, [])

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #faf5ff 100%)',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '520px',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}>
        <div style={{
          width: '100px', height: '100px',
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 2rem',
          fontSize: '3rem',
          boxShadow: '0 20px 40px rgba(124, 58, 237, 0.3)',
        }}>✓</div>

        <h1 style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', fontWeight: 900, color: '#1e1b4b', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
          Vielen Dank! 🎉
        </h1>

        <p style={{ fontSize: '1.125rem', color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem' }}>
          Deine Bestellung ist bei uns eingegangen. Wir melden uns so schnell wie möglich bei dir.
        </p>

        <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e9d5ff', boxShadow: '0 4px 20px rgba(124, 58, 237, 0.08)', textAlign: 'left' }}>
          <h3 style={{ color: '#7c3aed', fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>📋 Nächste Schritte:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { icon: '📧', text: 'Du erhältst eine Bestätigungs-E-Mail' },