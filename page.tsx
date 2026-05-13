import { prisma } from '@/lib/prisma';
import Dashboard from './Dashboard'
import LoginForm from './LoginForm'

export default async function AdminPage() {
  const cookieStore = await cookies()
  // Wir prüfen, ob der Admin eingeloggt ist (Cookie)
  const isAdmin = cookieStore.get('admin_session')?.value === 'true'

  if (isAdmin) {
    let orders = []
    let stats = { totalRevenue: 0 }

    try {
      // Wir holen die Bestellungen aus der Datenbank
      orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
      })

      // Wir berechnen den Gesamtumsatz
      const aggregate = await prisma.order.aggregate({
        _sum: { totalAmount: true },
      })
      stats.totalRevenue = aggregate._sum.totalAmount || 0
    } catch (error) {
      console.error("Fehler im Admin-Bereich beim Laden der Daten:", error)
    }

    // Wenn eingeloggt, zeige das Dashboard
    return <Dashboard orders={orders} stats={stats} />
  }

  // Wenn nicht eingeloggt, zeige das Login-Formular
  return <LoginForm />
}