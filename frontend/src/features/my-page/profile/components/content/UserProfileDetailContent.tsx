import ProfileAvatar from '@/components/elements/utils/ProfileAvatar';
import { fetchUserDataAPI } from '@/lib/api/userApi';
import { BACKEND_URL } from '@/utils/constants';
import { calculateAge } from '@/utils/profileUtils';
import ProfileEditButton from '../button/ProfileEditButton';

const UserProfileDetailContent = async () => {
  const userData = await fetchUserDataAPI();

  const { username, name, birth_date, profile_image, height } = userData;
  // 年代の計算（〇〇s）
  const age = calculateAge(birth_date);

  return (
    <div className="max-w-2xl mx-auto p-10">
      <div className="flex items-center space-x-8 my-5">
        <div>
          <ProfileAvatar src={`${BACKEND_URL}${profile_image}`} alt="プロフィール画像" size="sm" />
        </div>
        <div className="flex flex-col items-start justify-start space-y-3">
          <h2 className="text-2xl font-bold">{name}</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            {username && <p className="text-muted-foreground">@{username}</p>}
            {height && <p>/ {height}cm</p>}
            {age && <p>/ {age}</p>}
          </div>
        </div>
      </div>
      <ProfileEditButton userDetail={userData} />
    </div>
  );
};

export default UserProfileDetailContent;
