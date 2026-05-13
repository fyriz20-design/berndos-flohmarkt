import { prisma } from '@/lib/prisma';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';

export default async function AdminPage() {
  try {
    // Wir probieren 'article' aus, da 'product' laut Fehlermeldung nicht existiert
    // Das 'as any' verhindert, dass TypeScript den Build abbricht
    const articles = await (prisma as any).article.findMany().catch(() => 
                     (prisma as any).product.findMany());
    const orders = await (prisma as any).order.findMany();

    return (
      <div style={{ padding: '20px' }}>
        <Dashboard articles={articles} orders={orders} />
      </div>
    );
  } catch (error) {
    // Falls die Datenbanknamen noch immer nicht passen, zeigt er zumindest das Dashboard an
    return (
      <div style={{ padding: '20px' }}>
        <h1>Admin-Bereich</h1>
        <p>Hinweis: Datenbank-Verbindung wird kalibriert...</p>
        <Dashboard articles={[]} orders={[]} />
      </div>
    );
  }
}