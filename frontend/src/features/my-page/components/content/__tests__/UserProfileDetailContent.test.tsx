// import type { UserDetailType } from '@/types';
// import { BACKEND_URL } from '@/utils/constants';
// import { calculateAge } from '@/utils/profileUtils';
// import { render, screen } from '@testing-library/react';
// import UserProfileDetailContent from '../UserProfileDetailContent';

// // ProfileAvatarコンポーネントのモック
// jest.mock('@/components/elements/utils/ProfileAvatar', () => {
//   return jest.fn(({ src, alt, size }: { src: string; alt: string; size: string }) => (
//     <div data-testid="mock-profile-avatar" data-src={src} data-size={size}>
//       {alt}
//     </div>
//   ));
// });

// // ProfileEditButtonコンポーネントのモック
// jest.mock('../../button/ProfileEditButton', () => {
//   return jest.fn(({ userDetail }: UserDetailType) => (
//     <button data-testid="mock-profile-edit-button">プロフィール編集</button>
//   ));
// });

// // calculateAge関数のモック
// jest.mock('@/utils/profileUtils', () => ({
//   calculateAge: jest.fn(),
// }));

// describe('UserProfileDetailContent', () => {
//   const mockUserDetail = {
//     userDetail: {
//       username: 'test user',
//       name: 'Test User',
//       birth_date: '1990-01-01',
//       profile_image: '/images/profile.jpg',
//       height: '170',
//     },
//   };

//   beforeEach(() => {
//     jest.clearAllMocks();
//     (calculateAge as jest.Mock).mockReturnValue('20s');
//   });

//   // 基本的なレンダリングテスト
//   it('renders all user details correctly', () => {
//     render(<UserProfileDetailContent {...mockUserDetail} />);

//     expect(screen.getByText('Test User')).toBeInTheDocument();
//     expect(screen.getByText('@testuser')).toBeInTheDocument();
//     expect(screen.getByText('/ 170cm')).toBeInTheDocument();
//     expect(screen.getByText('/ 20s')).toBeInTheDocument();
//   });

//   // プロフィール画像の表示テスト
//   it('renders profile avatar with correct props', () => {
//     render(<UserProfileDetailContent {...mockUserDetail} />);

//     const avatar = screen.getByTestId('mock-profile-avatar');
//     expect(avatar).toHaveAttribute(
//       'data-src',
//       `${BACKEND_URL}${mockUserDetail.userDetail.profile_image}`,
//     );
//     expect(avatar).toHaveAttribute('data-size', 'sm');
//   });

//   // 編集ボタンの表示テスト
//   it('renders profile edit button', () => {
//     render(<UserProfileDetailContent {...mockUserDetail} />);

//     const editButton = screen.getByTestId('mock-profile-edit-button');
//     expect(editButton).toBeInTheDocument();
//   });

//   // オプショナルなフィールドのテスト
//   describe('optional fields', () => {
//     it('renders without username', () => {
//       const userWithoutUsername = {
//         userDetail: {
//           ...mockUserDetail.userDetail,
//           username: null,
//         },
//       };

//       render(<UserProfileDetailContent {...userWithoutUsername} />);
//       expect(screen.queryByText(/@/)).not.toBeInTheDocument();
//     });

//     it('renders without height', () => {
//       const userWithoutHeight = {
//         userDetail: {
//           ...mockUserDetail.userDetail,
//           height: null,
//         },
//       };

//       render(<UserProfileDetailContent {...userWithoutHeight} />);
//       expect(screen.queryByText(/cm/)).not.toBeInTheDocument();
//     });

//     it('renders without age', () => {
//       (calculateAge as jest.Mock).mockReturnValue(null);
//       render(<UserProfileDetailContent {...mockUserDetail} />);
//       expect(screen.queryByText(/20s/)).not.toBeInTheDocument();
//     });
//   });

//   // レイアウトとスタイリングのテスト
//   describe('layout and styling', () => {
//     it('has correct container classes', () => {
//       const { container } = render(<UserProfileDetailContent {...mockUserDetail} />);

//       const mainContainer = container.firstChild;
//       expect(mainContainer).toHaveClass('max-w-2xl mx-auto p-10');
//     });

//     it('has correct profile section classes', () => {
//       const { container } = render(<UserProfileDetailContent {...mockUserDetail} />);

//       const profileSection = container.querySelector('.flex.items-center.space-x-8.my-5');
//       expect(profileSection).toBeInTheDocument();
//     });

//     it('has correct heading style', () => {
//       render(<UserProfileDetailContent {...mockUserDetail} />);

//       const heading = screen.getByRole('heading');
//       expect(heading).toHaveClass('text-2xl font-bold');
//     });

//     it('has correct user info layout', () => {
//       render(<UserProfileDetailContent {...mockUserDetail} />);

//       const userInfoContainer = screen.getByText('@testuser').closest('div');
//       expect(userInfoContainer).toHaveClass(
//         'flex',
//         'items-center',
//         'justify-center',
//         'gap-2',
//         'text-sm',
//         'text-muted-foreground',
//       );
//     });
//   });

//   // アクセシビリティテスト
//   describe('accessibility', () => {
//     it('has proper heading structure', () => {
//       render(<UserProfileDetailContent {...mockUserDetail} />);

//       const heading = screen.getByRole('heading', { level: 2 });
//       expect(heading).toHaveTextContent('Test User');
//     });

//     it('maintains proper text contrast', () => {
//       render(<UserProfileDetailContent {...mockUserDetail} />);

//       const mutedText = screen.getByText('@testuser');
//       expect(mutedText).toHaveClass('text-muted-foreground');
//     });
//   });

//   // プロフィール画像のエラーハンドリングテスト
//   it('handles missing profile image gracefully', () => {
//     const userWithoutImage = {
//       userDetail: {
//         ...mockUserDetail.userDetail,
//         profile_image: null,
//       },
//     };

//     render(<UserProfileDetailContent {...userWithoutImage} />);
//     const avatar = screen.getByTestId('mock-profile-avatar');
//     expect(avatar).toBeInTheDocument();
//   });
// });

// UserProfileDetailContent.test.tsx
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
  return jest.fn(({ userDetail }: UserDetailType) => (
    <button data-testid="mock-profile-edit-button">プロフィール編集</button>
  ));
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
