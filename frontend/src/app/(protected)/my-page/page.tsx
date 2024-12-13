import UserProfileDetailContent from '@/features/my-page/profile/components/content/UserProfileDetailContent';
import MyPageTabs from '@/features/my-page/profile/components/tabs/MyPageTabs';

export default async function UserProfile() {
  return (
    <div className="w-full mx-auto">
      <UserProfileDetailContent />
      <MyPageTabs />
    </div>
  );
}
