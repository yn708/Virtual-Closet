/**
 * @jest-environment node
 */
import UserProfile from '@/app/(protected)/my-page/page';
import { fetchUserDataAPI } from '@/lib/api/userApi';

// モックの設定
jest.mock('@/lib/api/userApi', () => ({
  fetchUserDataAPI: jest.fn(),
}));

jest.mock('@/features/my-page/components/content/UserProfileDetailContent', () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

/**
 * ユーザープロフィールページのテストスイート
 */
describe('UserProfile Page', () => {
  // モックユーザーデータ
  const mockUserData = {
    username: 'testuser123',
    name: 'テストユーザー',
    birth_year: '1990',
    birth_month: '01',
    birth_day: '01',
    gender: 'male',
    profile_image: null,
    height: '170',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('ユーザー情報を取得してコンポーネントを表示する', async () => {
    // APIモックの戻り値を設定
    (fetchUserDataAPI as jest.Mock).mockResolvedValue(mockUserData);

    // ページコンポーネントをレンダリング
    const page = await UserProfile();

    // UserProfileDetailContentに正しいpropsが渡されているか確認
    expect(page.props.userDetail).toEqual(mockUserData);
  });

  it('APIエラー時に適切に処理する', async () => {
    // APIエラーをモック
    const error = new Error('Failed to fetch user data');
    (fetchUserDataAPI as jest.Mock).mockRejectedValue(error);

    // エラーがスローされることを確認
    await expect(UserProfile()).rejects.toThrow('Failed to fetch user data');
  });
});
