import React from 'react';

export const metadata = {
  title: 'Impressum - Berndos Flohmarkt',
};

export default function ImpressumPage() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      <div className="card card-content">
        <h1 style={{ marginBottom: '2rem' }}>Impressum</h1>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', lineHeight: '1.6' }}>
          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Angaben gemäß § 5 TMG</h2>
            <p>
              <strong>Bernd Geske</strong><br />
              Gottlob-Günther-Str. 4<br />
              72250 Freudenstadt
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Kontakt</h2>
            <p>
              <br />
              E-Mail: geske42@msn.com
            </p>
          </section>

          <section style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#1e293b' }}>Besonderer Hinweis zum Privatverkauf</h2>
            <p style={{ fontSize: '0.9375rem' }}>
              Dies ist eine private Webseite, die ausschließlich dem Verkauf von gebrauchten Artikeln aus privatem Besitz im Sinne eines Flohmarktes dient. 
              <strong> Es handelt sich um keinen gewerblichen Online-Shop.</strong>
            </p>
            <p style={{ fontSize: '0.9375rem', marginTop: '0.5rem' }}>
              Der Verkauf erfolgt unter Ausschluss jeglicher Gewährleistung, Garantie und Rücknahme. Da es sich um einen Privatverkauf handelt, kann ich keine Garantie nach neuem EU-Recht übernehmen. Der Käufer erklärt sich damit einverstanden und erkennt dies mit seinem Kauf an.
            </p>
          </section>

          <section>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Verbraucherstreitbeilegung</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
