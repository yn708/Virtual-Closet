import WelcomeAlert from '@/features/auth/components/elements/alert/WelcomeAlert';
import MyPageTabs from '@/features/my-page/common/components/tabs/MyPageTabs';
import UserProfileDetailContent from '@/features/my-page/profile/components/content/UserProfileDetailContent';
import { authOptions } from '@/lib/next-auth';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: 'マイクローゼット',
};

export default async function MyClosetPage() {
  const session = await getServerSession(authOptions);
  const isNewUser = session?.user.isNewUser;

  return (
    <div className="w-full mx-auto">
      {isNewUser && <WelcomeAlert />}
      <UserProfileDetailContent />
      <MyPageTabs />
    </div>
  );
}
