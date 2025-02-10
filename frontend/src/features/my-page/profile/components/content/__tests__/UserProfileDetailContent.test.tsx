import { fetchUserDataAPI } from '@/lib/api/userApi';
import type { UserDetailType } from '@/types';
import { IMAGE_URL } from '@/utils/constants';
import { calculateAge } from '@/utils/profileUtils';
import { render, screen } from '@testing-library/react';
import UserProfileDetailContent from '../UserProfileDetailContent';

// モックの設定
jest.mock('@/components/elements/utils/ProfileAvatar', () => {
  return jest.fn(({ src, alt, size }: { src: string; alt: string; size: string }) => (
    <div data-testid="mock-profile-avatar" data-src={src} data-size={size}>
      {alt}
    </div>
  ));
});

jest.mock('@/components/elements/utils/ItemCounter', () => {
  return jest.fn(() => <div data-testid="mock-item-counter">Item Counter Component</div>);
});

jest.mock('../../button/ProfileEditButton', () => {
  return jest.fn(({ userDetail: _userDetail }: { userDetail: UserDetailType['userDetail'] }) => (
    <button data-testid="mock-profile-edit-button">プロフィール編集</button>
  ));
});

jest.mock('@/utils/profileUtils', () => ({
  calculateAge: jest.fn(),
}));

jest.mock('@/lib/api/userApi', () => ({
  fetchUserDataAPI: jest.fn(),
}));

describe('UserProfileDetailContent', () => {
  const mockUserData = {
    email: 'test@example.com',
    username: 'testuser',
    name: 'Test User',
    birth_date: '1990-01-01',
    profile_image: '/images/profile.jpg',
    height: '170',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (calculateAge as jest.Mock).mockReturnValue('20s');
    (fetchUserDataAPI as jest.Mock).mockResolvedValue(mockUserData);
  });

  it('renders all user details correctly', async () => {
    render(await UserProfileDetailContent());

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('@testuser')).toBeInTheDocument();
    expect(screen.getByText('170cm')).toBeInTheDocument();
    expect(screen.getByText('20s')).toBeInTheDocument();
  });

  it('renders profile avatar with correct props', async () => {
    render(await UserProfileDetailContent());

    const avatar = screen.getByTestId('mock-profile-avatar');
    expect(avatar).toHaveAttribute('data-src', `${IMAGE_URL}${mockUserData.profile_image}`);
    expect(avatar).toHaveAttribute('data-size', 'sm');
  });

  it('renders profile edit button', async () => {
    render(await UserProfileDetailContent());

    const editButton = screen.getByTestId('mock-profile-edit-button');
    expect(editButton).toBeInTheDocument();
  });

  it('renders item counter component', async () => {
    render(await UserProfileDetailContent());

    const itemCounter = screen.getByTestId('mock-item-counter');
    expect(itemCounter).toBeInTheDocument();
  });

  describe('optional fields', () => {
    it('renders without username', async () => {
      const userWithoutUsername = {
        ...mockUserData,
        username: undefined,
      };
      (fetchUserDataAPI as jest.Mock).mockResolvedValue(userWithoutUsername);

      render(await UserProfileDetailContent());
      expect(screen.queryByText(/@/)).not.toBeInTheDocument();
    });

    it('renders without height', async () => {
      const userWithoutHeight = {
        ...mockUserData,
        height: undefined,
      };
      (fetchUserDataAPI as jest.Mock).mockResolvedValue(userWithoutHeight);

      render(await UserProfileDetailContent());
      expect(screen.queryByText(/cm/)).not.toBeInTheDocument();
    });

    it('renders without age', async () => {
      (calculateAge as jest.Mock).mockReturnValue(null);
      render(await UserProfileDetailContent());
      expect(screen.queryByText(/20s/)).not.toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    (fetchUserDataAPI as jest.Mock).mockRejectedValue(new Error('Failed to fetch'));

    // Errorバウンダリでキャッチされることを想定
    expect(async () => {
      render(await UserProfileDetailContent());
    }).rejects.toThrow('Failed to fetch');
  });
});
