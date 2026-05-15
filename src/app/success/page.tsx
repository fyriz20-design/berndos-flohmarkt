import ContactForm from './ContactForm';

export const metadata = {
  title: 'Kontakt - Berndos Flohmarkt',
  description: 'Kontaktiere uns bei Fragen zu Artikeln oder Bestellungen.',
};

export default function KontaktPage() {
  return (
    <div style={{
      minHeight: '80vh',
      background: 'linear-gradient(135deg, #f5f3ff 0%, #fdf2f8 50%, #faf5ff 100%)',
      padding: '4rem 1.5rem',
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '72px',
            height: '72px',
            background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
            borderRadius: '20px',
            fontSize: '2rem',
            marginBottom: '1.25rem',
            boxShadow: '0 8px 25px rgba(124, 58, 237, 0.25)',
          }}>
            ✉️
          </div>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900,
            color: '#1e1b4b',
            letterSpacing: '-0.03em',
            marginBottom: '0.75rem',
          }}>
            Schreib mir!
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto' }}>
            Hast du Fragen zu einem Artikel oder sonstige Anliegen? Ich melde mich so schnell wie möglich bei dir.
          </p>
        </div>

        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { icon: '⚡', title: 'Schnelle Antwort', text: 'In der Regel innerhalb von 24h' },
            { icon: '📦', title: 'Artikelfragen', text: 'Zustand, Details, Fotos' },
            { icon: '🤝', title: 'Verhandlung', text: 'Preise sind verhandelbar' },
          ].map((card) => (
            <div key={card.title} style={{
              background: 'white',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #f3e8ff',
              boxShadow: '0 2px 8px rgba(124, 58, 237, 0.06)',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{card.icon}</div>
              <div style={{ fontWeight: 700, color: '#1e1b4b', fontSize: '0.9375rem', marginBottom: '0.25rem' }}>{card.title}</div>
              <div style={{ color: '#6b7280', fontSize: '0.8125rem' }}>{card.text}</div>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div style={{
          background: 'white',
          borderRadius: '24px',
          padding: '2.5rem',
          border: '1px solid #e9d5ff',
          boxShadow: '0 8px 40px rgba(124, 58, 237, 0.08)',
        }}>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
