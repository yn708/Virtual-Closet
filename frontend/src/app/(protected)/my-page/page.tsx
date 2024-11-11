import UserProfileDetailContent from '@/features/my-page/components/content/UserProfileDetailContent';
import { fetchUserDataAPI } from '@/lib/api/userApi';

export default async function UserProfile() {
  const user = await fetchUserDataAPI();

  return <UserProfileDetailContent userDetail={user} />;
}
