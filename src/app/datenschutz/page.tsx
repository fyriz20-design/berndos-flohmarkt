import React from 'react';

export const metadata = {
  title: 'Datenschutzerklärung - Berndos Flohmarkt',
};

export default function DatenschutzPage() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <div className="card card-content">
        <h1 style={{ marginBottom: '2rem' }}>Datenschutzerklärung</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>1. Datenschutz auf einen Blick</h2>
            <p>
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>2. Hosting und Datenerfassung</h2>
            <p>
              <strong>Hosting durch Vercel</strong><br />
              Unsere Website wird bei Vercel Inc. gehostet. Bei jedem Besuch dieser Website erfasst Vercel automatisch Informationen, die Ihr Browser übermittelt (Server-Log-Files). Dies sind z.B. IP-Adresse, Browsertyp, Referrer-URL und Zeit des Abrufs. Dies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO zur Gewährleistung eines stabilen und sicheren Betriebs.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>3. Datenverarbeitung bei Bestellungen</h2>
            <p>
              Wenn Sie in unserem Flohmarkt etwas bestellen, erheben wir folgende Daten: Name, E-Mail-Adresse und Lieferanschrift. Diese Daten werden ausschließlich zur Abwicklung Ihrer Bestellung und für die Kommunikation mit Ihnen verwendet (Art. 6 Abs. 1 lit. b DSGVO). Ohne diese Daten können wir den Vertrag nicht abschließen oder ausführen.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>4. Zahlungsanbieter</h2>
            <p>
              <strong>PayPal:</strong> Bei Zahlung via PayPal werden Ihre Zahlungsdaten an PayPal (Europe) S.à.r.l. et Cie, S.C.A. übermittelt. <br />
              <strong>Banküberweisung:</strong> Bei der Wahl der Banküberweisung verarbeiten wir keine Bankdaten von Ihnen, sondern stellen Ihnen lediglich unsere Bankverbindung zur Verfügung. Der Zahlungseingang wird von uns manuell geprüft.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>5. Kontaktformular</h2>
            <p>
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>6. Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
