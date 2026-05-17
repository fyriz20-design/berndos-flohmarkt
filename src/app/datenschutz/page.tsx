export const dynamic = 'force-dynamic'
export const metadata = { title: 'Datenschutz - Berndos Flohmarkt' }

export default function DatenschutzPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 4rem) 1.25rem', fontFamily: 'DM Sans, sans-serif', color: '#1c1917' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 3rem)', boxShadow: '0 4px 20px rgba(120,80,20,0.08)', border: '1px solid #e7e0d5' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '2rem' }}>Datenschutzerklaerung</h1>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1.5rem' }}>1. Datenschutz auf einen Blick</h2>
        <p>Die folgenden Hinweise geben einen einfachen Ueberblick darueber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persoenlich identifiziert werden koennen.</p>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1.5rem' }}>2. Datenerfassung auf dieser Website</h2>
        <p>Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten koennen Sie dem Impressum dieser Website entnehmen.</p>
        <p style={{ marginTop: '0.75rem' }}>Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen, z.B. durch Ausfuellen eines Kontaktformulars oder Aufgeben einer Bestellung.</p>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1.5rem' }}>3. Kontaktformular</h2>
        <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Formular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1.5rem' }}>4. Bestelldaten</h2>
        <p>Bei einer Bestellung speichern wir Ihren Namen, Ihre E-Mail-Adresse und Lieferadresse zur Abwicklung der Bestellung. Diese Daten werden nach vollstaendiger Abwicklung geloescht.</p>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1.5rem' }}>5. Ihre Rechte</h2>
        <p>Sie haben jederzeit das Recht, unentgeltlich Auskunft ueber Herkunft, Empfaenger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben ausserdem ein Recht, die Berichtigung oder Loeschung dieser Daten zu verlangen.</p>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1.5rem' }}>6. Kontakt</h2>
        <p>Bei Fragen zum Datenschutz: geske42@msn.com</p>
      </div>
    </div>
  )
}