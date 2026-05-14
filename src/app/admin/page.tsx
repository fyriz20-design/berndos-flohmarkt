import { prisma } from '@/lib/prisma';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Auth prüfen
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;

  if (session !== 'true') {
    return <LoginForm />;
  }

  let articles = [];
  let orders = [];
  let settings = null;

  try {
    const prismaAny = prisma as any;
    articles = await (prismaAny.article?.findMany({
      orderBy: { createdAt: 'desc' }
    }) || []);
    orders = await (prismaAny.order?.findMany({
      orderBy: { createdAt: 'desc' }
    }) || []);
    settings = await prisma.setting.findUnique({ where: { id: 'global' } });
  } catch (error) {
    console.error('Datenbank-Fehler im Admin:', error);
  }

  return (
    <Dashboard
      articles={articles}
      orders={orders}
      settings={settings}
    />
  );
}
