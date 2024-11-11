import WelcomeAlert from '@/features/auth/components/elements/alert/WelcomeAlert';
import { authOptions } from '@/lib/next-auth';
import { getServerSession } from 'next-auth';

export default async function TopPage() {
  const session = await getServerSession(authOptions);
  const isNewUser = session?.user.isNewUser;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4">
      {isNewUser && <WelcomeAlert />}
      <h1 className="text-3xl font-bold">TOP PAGE</h1>
    </div>
  );
}
