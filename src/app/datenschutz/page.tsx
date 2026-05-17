export const dynamic = 'force-dynamic'
import React from 'react';

export const metadata = {
  title: 'DatenschutzerklÃ¤rung - Berndos Flohmarkt',
};

export default function DatenschutzPage() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <div className="card card-content">
        <h1 style={{ marginBottom: '2rem' }}>DatenschutzerklÃ¤rung</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>1. Datenschutz auf einen Blick</h2>
            <p>
              Die folgenden Hinweise geben einen einfachen Ãœberblick darÃ¼ber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persÃ¶nlich identifiziert werden kÃ¶nnen.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>2. Hosting und Datenerfassung</h2>
            <p>
              <strong>Hosting durch Vercel</strong><br />
              Unsere Website wird bei Vercel Inc. gehostet. Bei jedem Besuch dieser Website erfasst Vercel automatisch Informationen, die Ihr Browser Ã¼bermittelt (Server-Log-Files). Dies sind z.B. IP-Adresse, Browsertyp, Referrer-URL und Zeit des Abrufs. Dies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zur GewÃ¤hrleistung eines stabilen und sicheren Betriebs.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>3. Datenverarbeitung bei Bestellungen</h2>
            <p>
              Wenn Sie in unserem Flohmarkt etwas bestellen, erheben wir folgende Daten: Name, E-Mail-Adresse und Lieferanschrift. Diese Daten werden ausschlieÃŸlich zur Abwicklung Ihrer Bestellung und fÃ¼r die Kommunikation mit Ihnen verwendet (Art. 6 Abs. 1 lit. b DSGVO). Ohne diese Daten kÃ¶nnen wir den Vertrag nicht abschlieÃŸen oder ausfÃ¼hren.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>4. Zahlungsanbieter</h2>
            <p>
              <strong>PayPal:</strong> Bei Zahlung via PayPal werden Ihre Zahlungsdaten an PayPal (Europe) S.Ã .r.l. et Cie, S.C.A. Ã¼bermittelt. <br />
              <strong>BankÃ¼berweisung:</strong> Bei der Wahl der BankÃ¼berweisung verarbeiten wir keine Bankdaten von Ihnen, sondern stellen Ihnen lediglich unsere Bankverbindung zur VerfÃ¼gung. Der Zahlungseingang wird von uns manuell geprÃ¼ft.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>5. Kontaktformular</h2>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und fÃ¼r den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>6. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft Ã¼ber Herkunft, EmpfÃ¤nger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben auÃŸerdem ein Recht, die Berichtigung oder LÃ¶schung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz kÃ¶nnen Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

