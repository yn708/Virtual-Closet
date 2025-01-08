import MyPageTabs from '@/features/my-page/common/components/tabs/MyPageTabs';
import UserProfileDetailContent from '@/features/my-page/profile/components/content/UserProfileDetailContent';

export default async function UserProfile() {
  return (
    <div className="w-full mx-auto">
      <UserProfileDetailContent />
      <MyPageTabs />
    </div>
  );
}
