export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()

    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)

    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - 6)
    startOfWeek.setHours(0, 0, 0, 0)

    const startOfMonth = new Date(now)
    startOfMonth.setDate(now.getDate() - 29)
    startOfMonth.setHours(0, 0, 0, 0)

    const [total, today, week, month, recentViews] = await Promise.all([
      (prisma as any).pageView.count(),
      (prisma as any).pageView.count({ where: { createdAt: { gte: startOfToday } } }),
      (prisma as any).pageView.count({ where: { createdAt: { gte: startOfWeek } } }),
      (prisma as any).pageView.count({ where: { createdAt: { gte: startOfMonth } } }),
      (prisma as any).pageView.findMany({
        where: { createdAt: { gte: startOfMonth } },
        select: { createdAt: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    // Tagesweise gruppieren (letzte 30 Tage)
    const dailyMap: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(now.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      dailyMap[key] = 0
    }
    for (const view of recentViews) {
      const key = new Date(view.createdAt).toISOString().slice(0, 10)
      if (dailyMap[key] !== undefined) dailyMap[key]++
    }
    const daily = Object.entries(dailyMap).map(([date, count]) => ({ date, count }))

    return NextResponse.json({ total, today, week, month, daily })
  } catch (error) {
    console.error('Analytics Fehler:', error)
    return NextResponse.json({ error: 'Fehler beim Laden' }, { status: 500 })
  }
}
