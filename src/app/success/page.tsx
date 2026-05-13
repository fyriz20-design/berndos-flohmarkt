export default function SuccessPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#8b5cf6' }}>Vielen Dank für deine Bestellung!</h1>
      <p>Wir haben eine Bestätigung an berndos.shop@gmail.com gesendet.</p>
      <a href="/" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#8b5cf6', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>
        Zurück zum Shop
      </a>
    </div>
  );
}