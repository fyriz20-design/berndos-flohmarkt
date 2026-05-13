export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh', 
      fontFamily: 'sans-serif',
      backgroundColor: '#f4f4f4'
    }}>
      <h1 style={{ color: '#333' }}>Berndos Flohmarkt</h1>
      <p style={{ color: '#666' }}>Willkommen auf unserer neuen Seite!</p>
      <a href="/admin" style={{ 
        marginTop: '20px', 
        padding: '10px 20px', 
        backgroundColor: '#0070f3', 
        color: 'white', 
        borderRadius: '5px', 
        textDecoration: 'none' 
      }}>
        Zum Admin-Login
      </a>
    </div>
  );
}
