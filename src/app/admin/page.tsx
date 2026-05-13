import { prisma } from '@/lib/prisma';
import Dashboard from './Dashboard';

// Zwingt Next.js, die Seite immer live zu laden (verhindert Build-Fehler)
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let articles = [];
  let orders = [];

  try {
    // Sicherheits-Check für die verschiedenen Datenbank-Model-Namen
    if (prisma) {
      const prismaAny = prisma as any;
      
      // Versuche erst 'article', dann 'product'
      articles = await (prismaAny.article?.findMany() || prismaAny.product?.findMany() || []);
      orders = await (prismaAny.order?.findMany() || []);
    }
  } catch (error) {
    console.error("Datenbank-Fehler im Admin:", error);
  }

  return (
    <div style={{ padding: '20px' }}>
      <Dashboard articles={articles} orders={orders} />
    </div>
  );
}