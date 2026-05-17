export const dynamic = 'force-dynamic'
import ContactForm from './ContactForm'

export const metadata = {
  title: 'Kontakt - Berndos Flohmarkt',
  description: 'Hast du Fragen zu einem Artikel? Schreib mir!',
}

export default function KontaktPage() {
  return (
    <div style={{ minHeight: '80vh', background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #faf5ff 100%)', padding: '3rem 1.25rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '68px', height: '68px', background: 'linear-gradient(135deg, #7c3aed, #ec4899)', borderRadius: '20px', fontSize: '1.875rem', marginBottom: '1.25rem' }}>📧</div>
          <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: 'clamp(1.75rem, 5vw, 2.75rem)', fontWeight: 900, color: '#1c1917', marginBottom: '0.75rem', margin: '0 0 0.75rem' }}>Schreib mir!</h1>
          <p style={{ color: '#6b7280', fontSize: 'clamp(1rem, 2.5vw, 1.125rem)', lineHeight: 1.7, maxWidth: '460px', margin: '0 auto' }}>Fragen zu einem Artikel? Ich melde mich so schnell wie moeglich bei dir.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.875rem', marginBottom: '2rem' }}>
          {[
            { icon: 'schnell', title: 'Schnelle Antwort', text: 'In der Regel innerhalb 24h' },
            { icon: 'box', title: 'Artikelfragen', text: 'Zustand, Details, Fotos' },
            { icon: 'hand', title: 'Verhandlung', text: 'Preise sind verhandelbar' },
          ].map(card => (
            <div key={card.title} style={{ background: 'white', borderRadius: '16px', padding: '1.125rem', border: '1px solid #f3e8ff', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, color: '#1c1917', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{card.title}</div>
              <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{card.text}</div>
            </div>
          ))}
        </div>
        <div style={{ background: 'white', borderRadius: '24px', padding: 'clamp(1.5rem, 4vw, 2.5rem)', border: '1px solid #e9d5ff', boxShadow: '0 8px 40px rgba(124,58,237,0.08)' }}>
          <ContactForm />
        </div>
      </div>
    </div>
  )
}