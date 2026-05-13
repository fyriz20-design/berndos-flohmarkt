import ContactForm from './ContactForm';

export const metadata = {
  title: 'Kontakt - Berndos Flohmarkt',
};

export default function KontaktPage() {
  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '600px' }}>
      <div className="card card-content">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Schreib mir!</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Hast du Fragen zu einem Artikel oder sonstige Anliegen? Nutze einfach das Kontaktformular. Ich melde mich so schnell wie möglich bei dir.
        </p>
        
        <ContactForm />
      </div>
    </div>
  );
}
