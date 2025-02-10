import ItemCounter from '@/components/elements/utils/ItemCounter';
import ProfileAvatar from '@/components/elements/utils/ProfileAvatar';
import { fetchUserDataAPI } from '@/lib/api/userApi';
import { IMAGE_URL } from '@/utils/constants';
import { calculateAge } from '@/utils/profileUtils';
import ProfileEditButton from '../button/ProfileEditButton';

const UserProfileDetailContent = async () => {
  const userData = await fetchUserDataAPI();

  const { username, name, birth_date, profile_image, height } = userData;
  // 年代の計算（〇〇s）s
  const age = calculateAge(birth_date);

  const profileImage = `${IMAGE_URL}${profile_image}`;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-10">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
        <div className="flex justify-center w-full sm:w-auto">
          <ProfileAvatar src={`${profileImage}`} alt="プロフィール画像" size="sm" />
        </div>
        <div className="flex flex-col items-center sm:items-start justify-center w-full space-y-2 text-center sm:text-left">
          <h2 className="text-xl md:text-2xl font-bold">{name}</h2>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs md:text-sm text-muted-foreground">
            {username && <p className="mr-2">@{username}</p>}
            {height && <span className="mx-1">|</span>}
            {height && <p className="mr-2">{height}cm</p>}
            {age && <span className="mx-1">|</span>}
            {age && <p>{age}</p>}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start gap-2 mt-6">
        <ProfileEditButton userDetail={userData} />
        <ItemCounter />
      </div>
    </div>
  );
};

export default UserProfileDetailContent;
