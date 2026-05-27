export const dynamic = 'force-dynamic'
export const metadata = { title: 'Datenschutz – Berndos Flohmarkt' }

const h2Style = { fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '2rem', color: '#1e1b4b' } as const
const pStyle = { marginTop: '0.625rem', lineHeight: '1.75', color: '#44403c' } as const

export default function DatenschutzPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 4rem) 1.25rem', fontFamily: 'DM Sans, sans-serif', color: '#1c1917' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 3rem)', boxShadow: '0 4px 20px rgba(120,80,20,0.08)', border: '1px solid #e7e0d5' }}>

        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '0.5rem' }}>Datenschutzerklärung</h1>
        <p style={{ color: '#78716c', fontSize: '0.9rem', marginBottom: '2rem' }}>Stand: Mai 2025</p>

        {/* 1 */}
        <h2 style={h2Style}>1. Verantwortlicher</h2>
        <p style={pStyle}>
          Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br /><br />
          <strong>Bernd Geske</strong><br />
          E-Mail: <a href="mailto:geske42@msn.com" style={{ color: '#6d28d9' }}>geske42@msn.com</a><br />
          Website: www.berndos-flohmarkt.de
        </p>
        <p style={pStyle}>
          Eine gesetzliche Pflicht zur Benennung eines Datenschutzbeauftragten besteht für diesen privaten Kleinanbieter nicht.
        </p>

        {/* 2 */}
        <h2 style={h2Style}>2. Allgemeines zur Datenverarbeitung</h2>
        <p style={pStyle}>
          Personenbezogene Daten sind alle Informationen, mit denen Sie persönlich identifiziert werden können (z.&thinsp;B. Name, E-Mail-Adresse, IP-Adresse). Wir verarbeiten Ihre Daten nur, soweit dies zur Bereitstellung einer funktionsfähigen Website sowie unserer Inhalte und Leistungen erforderlich ist.
        </p>
        <p style={pStyle}>
          Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf Grundlage folgender Rechtsgrundlagen der DSGVO:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.9', color: '#44403c' }}>
          <li><strong>Art. 6 Abs. 1 lit. b DSGVO</strong> – Vertragserfüllung (z.&thinsp;B. Bestellabwicklung)</li>
          <li><strong>Art. 6 Abs. 1 lit. c DSGVO</strong> – Rechtliche Verpflichtung (z.&thinsp;B. steuerliche Aufbewahrungspflichten)</li>
          <li><strong>Art. 6 Abs. 1 lit. f DSGVO</strong> – Berechtigte Interessen (z.&thinsp;B. Sicherheit, Missbrauchsprävention)</li>
          <li><strong>Art. 6 Abs. 1 lit. a DSGVO</strong> – Einwilligung (soweit gesondert eingeholt)</li>
        </ul>

        {/* 3 */}
        <h2 style={h2Style}>3. Hosting (Vercel)</h2>
        <p style={pStyle}>
          Diese Website wird bei <strong>Vercel Inc., 340 Pine Street, Suite 701, San Francisco, CA 94104, USA</strong> gehostet. Wenn Sie unsere Website besuchen, verarbeitet Vercel automatisch technische Verbindungsdaten (u.&thinsp;a. IP-Adresse, Browsertyp, aufgerufene Seiten, Datum und Uhrzeit des Zugriffs) in seinen Serverprotokollen.
        </p>
        <p style={pStyle}>
          Diese Verarbeitung ist auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigte Interessen: stabiler Betrieb und Sicherheit der Website) zulässig. Vercel ist gemäß EU-US Data Privacy Framework zertifiziert; die Datenweitergabe in die USA erfolgt auf Basis von Standardvertragsklauseln. Weitere Informationen: <a href="https://vercel.com/legal/privacy-policy" style={{ color: '#6d28d9' }} target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>.
        </p>

        {/* 4 */}
        <h2 style={h2Style}>4. Besucherzähler (Seitenaufruf-Statistik)</h2>
        <p style={pStyle}>
          Zur Analyse der Besucherzahlen speichern wir beim Aufruf der Startseite einen anonymen Datensatz in unserer eigenen Datenbank. Dabei werden <strong>keine personenbezogenen Daten</strong> (kein Name, keine IP-Adresse, keine Cookies) erfasst – lediglich der Zeitpunkt und die aufgerufene Seite.
        </p>
        <p style={pStyle}>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Reichweitenanalyse). Es werden keine Tracking-Tools von Drittanbietern und keine Cookies für diesen Zweck eingesetzt.
        </p>

        {/* 5 */}
        <h2 style={h2Style}>5. Bestelldaten</h2>
        <p style={pStyle}>
          Bei einer Bestellung erheben und verarbeiten wir folgende Daten:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.9', color: '#44403c' }}>
          <li>Vor- und Nachname</li>
          <li>E-Mail-Adresse</li>
          <li>Lieferadresse</li>
          <li>Bestellte Artikel und Bestellbetrag</li>
          <li>Zahlungsart</li>
        </ul>
        <p style={pStyle}>
          Diese Daten werden ausschließlich zur Abwicklung Ihrer Bestellung und der damit verbundenen Kommunikation verwendet. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
        </p>
        <p style={pStyle}>
          <strong>Aufbewahrungsdauer:</strong> Bestelldaten unterliegen den handels- und steuerrechtlichen Aufbewahrungspflichten (§ 257 HGB, § 147 AO) und werden daher bis zu 10 Jahre gespeichert. Nach Ablauf dieser Frist werden die Daten routinemäßig gelöscht.
        </p>

        {/* 6 */}
        <h2 style={h2Style}>6. E-Mail-Versand (Google/Gmail)</h2>
        <p style={pStyle}>
          Zur Versendung von Bestellbestätigungen nutzen wir den SMTP-Dienst von <strong>Google (Gmail)</strong>. Dabei werden Ihre E-Mail-Adresse sowie die Bestellinformationen an Googles Server übertragen. Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Weitere Informationen: <a href="https://policies.google.com/privacy" style={{ color: '#6d28d9' }} target="_blank" rel="noopener noreferrer">policies.google.com/privacy</a>.
        </p>
        <p style={pStyle}>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung). Die Übertragung in die USA erfolgt auf Basis von Standardvertragsklauseln.
        </p>

        {/* 7 */}
        <h2 style={h2Style}>7. Zahlungsabwicklung (PayPal)</h2>
        <p style={pStyle}>
          Wenn Sie per PayPal bezahlen möchten, werden Sie auf die Website von <strong>PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxemburg</strong> weitergeleitet. PayPal verarbeitet die für die Zahlung notwendigen Daten eigenverantwortlich. Die Datenschutzhinweise von PayPal finden Sie unter: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" style={{ color: '#6d28d9' }} target="_blank" rel="noopener noreferrer">paypal.com</a>.
        </p>
        <p style={pStyle}>
          Bei Banküberweisung (Vorkasse) werden Ihre Daten ausschließlich zur Zahlungsabgleichung intern genutzt und nicht an Dritte weitergegeben. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
        </p>

        {/* 8 */}
        <h2 style={h2Style}>8. Kontaktformular</h2>
        <p style={pStyle}>
          Wenn Sie uns über das Kontaktformular schreiben, werden Ihre angegebenen Daten (Name, E-Mail-Adresse, Nachricht) zur Bearbeitung Ihrer Anfrage gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter und löschen sie, sobald die Anfrage abschließend bearbeitet ist, spätestens nach 2 Jahren. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
        </p>

        {/* 9 */}
        <h2 style={h2Style}>9. Cookies</h2>
        <p style={pStyle}>
          Diese Website verwendet ausschließlich ein technisch notwendiges Session-Cookie für den Admin-Bereich (Login-Status). Dieses Cookie enthält keine personenbezogenen Daten und wird beim Abmelden oder Schließen des Browsers gelöscht. Es werden keine Marketing- oder Tracking-Cookies eingesetzt. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
        </p>

        {/* 10 */}
        <h2 style={h2Style}>10. Ihre Rechte</h2>
        <p style={pStyle}>Sie haben gegenüber uns folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', lineHeight: '1.9', color: '#44403c' }}>
          <li><strong>Auskunft</strong> (Art. 15 DSGVO): Welche Daten wir über Sie speichern</li>
          <li><strong>Berichtigung</strong> (Art. 16 DSGVO): Korrektur unrichtiger Daten</li>
          <li><strong>Löschung</strong> (Art. 17 DSGVO): Löschung Ihrer Daten, soweit keine gesetzlichen Aufbewahrungspflichten entgegenstehen</li>
          <li><strong>Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO)</li>
          <li><strong>Datenübertragbarkeit</strong> (Art. 20 DSGVO): Ihre Daten in einem gängigen Format erhalten</li>
          <li><strong>Widerspruch</strong> (Art. 21 DSGVO): Gegen die Verarbeitung auf Basis berechtigter Interessen</li>
          <li><strong>Widerruf einer Einwilligung</strong> (Art. 7 Abs. 3 DSGVO): Jederzeit mit Wirkung für die Zukunft</li>
        </ul>
        <p style={pStyle}>
          Zur Ausübung Ihrer Rechte wenden Sie sich bitte an: <a href="mailto:geske42@msn.com" style={{ color: '#6d28d9' }}>geske42@msn.com</a>
        </p>

        {/* 11 */}
        <h2 style={h2Style}>11. Beschwerderecht bei der Aufsichtsbehörde</h2>
        <p style={pStyle}>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren. Die zuständige Aufsichtsbehörde richtet sich nach Ihrem Wohnort. Eine Liste der Landesbehörden finden Sie beim Bundesbeauftragten für den Datenschutz und die Informationsfreiheit:
        </p>
        <p style={{ marginTop: '0.5rem' }}>
          <a href="https://www.bfdi.bund.de/DE/Infothek/Anschriften_Links/anschriften_links-node.html" style={{ color: '#6d28d9' }} target="_blank" rel="noopener noreferrer">bfdi.bund.de</a>
        </p>

        {/* 12 */}
        <h2 style={h2Style}>12. Datensicherheit</h2>
        <p style={pStyle}>
          Diese Website nutzt aus Sicherheitsgründen eine SSL/TLS-Verschlüsselung (erkennbar am „https://" in der Adresszeile). Dadurch werden Daten, die Sie an uns übertragen, vor dem Zugriff Dritter geschützt.
        </p>

        <div style={{ marginTop: '2.5rem', padding: '1rem 1.25rem', background: '#f5f0ff', borderRadius: '12px', border: '1px solid #e9d5ff', fontSize: '0.875rem', color: '#6b7280' }}>
          Diese Datenschutzerklärung wurde für einen privaten Kleinanbieter erstellt und erhebt keinen Anspruch auf rechtliche Vollständigkeit. Im Zweifelsfall empfehlen wir die Beratung durch einen Datenschutzexperten.
        </div>

      </div>
    </div>
  )
}
