export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma';
import Dashboard from './Dashboard';

// DAS IST DIE MAGISCHE ZEILE:
export const dynamic = 'force-dynamic'; 

export default async function AdminPage() {
  let articles = [];
  let orders = [];

  try {
    // Wir prüfen ganz vorsichtig, ob prisma geladen ist
    if (prisma && (prisma as any).article) {
      articles = await (prisma as any).article.findMany();
      orders = await (prisma as any).order.findMany();
    } else if (prisma && (prisma as any).product) {
      articles = await (prisma as any).product.findMany();
      orders = await (prisma as any).order.findMany();
    }
  } catch (e) {
    console.error("Prisma Build-Time Info:", e);
  }

  return (
    <div style={{ padding: '20px' }}>
      <Dashboard articles={articles} orders={orders} />
    </div>
  );
}