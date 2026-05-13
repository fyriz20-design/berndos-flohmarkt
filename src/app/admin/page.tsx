import { prisma } from '../../lib/prisma'; // Pfad angepasst!
import Dashboard from './Dashboard';

export default async function AdminPage() {
  let articles = [];
  let orders = [];

  try {
    // Sicherstellen, dass prisma existiert, bevor wir findMany rufen
    if (prisma) {
      articles = await (prisma as any).article.findMany().catch(() => []);
      orders = await (prisma as any).order.findMany().catch(() => []);
    }
  } catch (e) {
    console.error("Prisma Fehler:", e);
  }

  return (
    <div style={{ padding: '20px' }}>
      <Dashboard articles={articles} orders={orders} />
    </div>
  );
}