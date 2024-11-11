import type { UserDetailType } from '@/types';
import { BACKEND_URL } from '@/utils/constants';
import { calculateAge } from '@/utils/profileUtils';
import { render, screen } from '@testing-library/react';
import UserProfileDetailContent from '../UserProfileDetailContent';

// ProfileAvatarコンポーネントのモック
jest.mock('@/components/elements/utils/ProfileAvatar', () => {
  return jest.fn(({ src, alt, size }: { src: string; alt: string; size: string }) => (
    <div data-testid="mock-profile-avatar" data-src={src} data-size={size}>
      {alt}
    </div>
  ));
});

// ProfileEditButtonコンポーネントのモック
jest.mock('../../button/ProfileEditButton', () => {
  return jest.fn(() => <button data-testid="mock-profile-edit-button">プロフィール編集</button>);
});

// calculateAge関数のモック
jest.mock('@/utils/profileUtils', () => ({
  calculateAge: jest.fn(),
}));

describe('UserProfileDetailContent', () => {
  // テスト用のユーザーデータ
  const mockUserDetail: UserDetailType = {
    userDetail: {
      email: 'test@example.com',
      username: 'testuser',
      name: 'Test User',
      birth_date: '1990-01-01',
      profile_image: '/images/profile.jpg',
      height: '170',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (calculateAge as jest.Mock).mockReturnValue('20s');
  });

  // 基本的なレンダリングテスト
  it('renders all user details correctly', () => {
    render(<UserProfileDetailContent {...mockUserDetail} />);

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('/ 170cm')).toBeInTheDocument();
    expect(screen.getByText('/ 20s')).toBeInTheDocument();
  });

  // プロフィール画像の表示テスト
  it('renders profile avatar with correct props', () => {
    render(<UserProfileDetailContent {...mockUserDetail} />);

    const avatar = screen.getByTestId('mock-profile-avatar');
    expect(avatar).toHaveAttribute(
      'data-src',
      `${BACKEND_URL}${mockUserDetail.userDetail.profile_image}`,
    );
    expect(avatar).toHaveAttribute('data-size', 'sm');
  });

  // 編集ボタンの表示テスト
  it('renders profile edit button', () => {
    render(<UserProfileDetailContent {...mockUserDetail} />);

    const editButton = screen.getByTestId('mock-profile-edit-button');
    expect(editButton).toBeInTheDocument();
  });

  // オプショナルなフィールドのテスト
  describe('optional fields', () => {
    it('renders without username', () => {
      const userWithoutUsername: UserDetailType = {
        userDetail: {
          ...mockUserDetail.userDetail,
          username: undefined,
        },
      };

      render(<UserProfileDetailContent {...userWithoutUsername} />);
      expect(screen.queryByText(/@/)).not.toBeInTheDocument();
    });

    it('renders without height', () => {
      const userWithoutHeight: UserDetailType = {
        userDetail: {
          ...mockUserDetail.userDetail,
          height: undefined,
        },
      };

      render(<UserProfileDetailContent {...userWithoutHeight} />);
      expect(screen.queryByText(/cm/)).not.toBeInTheDocument();
    });

    it('renders without age', () => {
      (calculateAge as jest.Mock).mockReturnValue(null);
      render(<UserProfileDetailContent {...mockUserDetail} />);
      expect(screen.queryByText(/20s/)).not.toBeInTheDocument();
    });
  });
});
