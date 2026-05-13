export default function Dashboard({ orders, stats }: any) {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Admin Dashboard
      </h2>
      
      <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <p style={{ fontSize: '18px' }}>Gesamtumsatz: <strong>{stats?.totalRevenue || 0} €</strong></p>
        <p>Anzahl Bestellungen: <strong>{orders?.length || 0}</strong></p>
      </div>

      <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>Letzte Bestellungen</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {orders && orders.length > 0 ? (
          orders.map((order: any) => (
            <li key={order.id} style={{ borderBottom: '1px solid #ccc', padding: '10px 0' }}>
              Bestellung #{order.id.slice(-5)} - {order.totalAmount} €
            </li>
          ))
        ) : (
          <p>Noch keine Bestellungen vorhanden.</p>
        )}
      </ul>
    </div>
  );
}
