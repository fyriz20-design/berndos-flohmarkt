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

  return (
    <Dashboard
      articles={[]}
      orders={[]}
      settings={null}
    />
  );
}
