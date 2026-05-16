import { prisma } from '@/lib/prisma';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const db = new PrismaClient();

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;

  if (session !== 'true') {
    return <LoginForm />;
  }

  let articles: any[] = [];
  let orders: any[] = [];
  let settings = null;

  try {
    articles = await db.article.findMany({ orderBy: { createdAt: 'desc' } });
    orders = await db.order.findMany({ orderBy: { createdAt: 'desc' } });
    settings = await db.setting.findUnique({ where: { id: 'global' } });
  } catch (error) {
    console.error('Admin Fehler:', error);
  }

  return (
    <Dashboard
      articles={articles}
      orders={orders}
      settings={settings}
    />
  );
}