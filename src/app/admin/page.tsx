import { prisma } from '@/lib/prisma';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';

export default async function AdminPage() {
  // Wir prüfen hier nicht den Login, damit du erst mal wieder reinkommst!
  const articles = await prisma.product.findMany();
  const orders = await prisma.order.findMany();

  return (
    <div style={{ padding: '20px' }}>
      <Dashboard articles={articles} orders={orders} />
    </div>
  );
}