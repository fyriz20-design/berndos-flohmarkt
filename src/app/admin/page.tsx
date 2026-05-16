import { prisma } from '@/lib/prisma';
import Dashboard from './Dashboard';
import LoginForm from './LoginForm';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

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
    const prismaAny = prisma as any;
    articles = await prismaAny.article?.findMany({ orderBy: { createdAt: 'desc' } }) || [];
    orders = await prismaAny.order?.findMany({ orderBy: { createdAt: 'desc' } }) || [];
    settings = await prismaAny.setting?.findUnique({ where: { id: 'global' } }) || null;
    console.log('Admin geladen - Settings:', settings);
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