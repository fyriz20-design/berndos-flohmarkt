import React from 'react'
export const dynamic = 'force-dynamic'
export const metadata = { title: 'Impressum - Berndos Flohmarkt' }

export default function ImpressumPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: 'clamp(2rem, 5vw, 4rem) 1.25rem', fontFamily: 'DM Sans, sans-serif', color: '#1c1917' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: 'clamp(1.5rem, 4vw, 3rem)', boxShadow: '0 4px 20px rgba(120,80,20,0.08)', border: '1px solid #e7e0d5' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, marginBottom: '2rem', color: '#1c1917' }}>Impressum</h1>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1.5rem' }}>Angaben gemäss § 5 TMG</h2>
        <p><strong>Bernd Geske</strong><br />Gottlob-Guenther-Str. 4<br />72250 Freudenstadt</p>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1.5rem' }}>Kontakt</h2>
        <p>E-Mail: geske42@msn.com</p>

        <div style={{ background: '#f5f0ff', borderRadius: '12px', padding: '1.25rem', marginTop: '2rem', border: '1px solid #e9d5ff' }}>
          <h3 style={{ color: '#6d28d9', fontWeight: 700, marginBottom: '0.75rem' }}>Besonderer Hinweis zum Privatverkauf</h3>
          <p style={{ marginBottom: '0.75rem' }}>Dies ist eine private Webseite, die ausschliesslich dem Verkauf von gebrauchten Artikeln aus privatem Besitz im Sinne eines Flohmarktes dient. <strong>Es handelt sich um keinen gewerblichen Online-Shop.</strong></p>
          <p>Der Verkauf erfolgt unter Ausschluss jeglicher Gewaehrleistung, Garantie und Ruecknahme. Da es sich um einen Privatverkauf handelt, kann ich keine Garantie nach neuem EU-Recht uebernehmen. Der Kaeufer erklaert sich damit einverstanden und erkennt dies mit seinem Kauf an.</p>
        </div>

        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1.5rem' }}>Verbraucherstreitbeilegung</h2>
        <p>Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </div>
    </div>
  )
}