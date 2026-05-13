import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import Dashboard from './Dashboard'
import LoginForm from './LoginForm'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isAdmin = cookieStore.get('admin_session')?.value === 'true'

  if (isAdmin) {
    let orders = []
    let stats = { totalRevenue: 0 }

    try {
      // Sicherer Datenabruf mit Fehlerbehandlung
      orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
      }) || []

      const aggregate = await prisma.order.aggregate({
        _sum: { totalAmount: true },
      })
      stats.totalRevenue = aggregate._sum.totalAmount || 0

    } catch (error) {
      console.error("Datenbank-Fehler im Admin-Panel:", error)
      // Wir lassen orders leer, damit die Seite trotzdem lädt (ohne abzustürzen)
    }

    return <Dashboard orders={orders} stats={stats} />
  }

  return <LoginForm />
}