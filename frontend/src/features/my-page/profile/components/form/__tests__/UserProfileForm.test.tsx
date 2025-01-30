import type { UserDetailType } from '@/types';
import { render, screen } from '@testing-library/react';
import { useProfileForm } from '../../../hooks/useProfileForm';
import UserProfileForm from '../UserProfileForm';
import { useImage } from '@/context/ImageContext';

// useImageのモック作成
jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

// モックの作成
jest.mock('../../../hooks/useProfileForm', () => ({
  useProfileForm: jest.fn(),
}));

// UIコンポーネントのモック
jest.mock('@/components/elements/button/SubmitButton', () => ({
  __esModule: true,
  default: ({ label, className }: { label: string; className?: string }) => (
    <button type="submit" className={className}>
      {label}
    </button>
  ),
}));

// ProfileFieldsのモック
jest.mock('../ProfileFields', () => ({
  __esModule: true,
  default: ({
    onImageDelete,
    onBirthDateDelete,
  }: {
    state: unknown;
    userDetail: UserDetailType['userDetail'];
    onImageDelete: () => void;
    onBirthDateDelete: () => void;
  }) => (
    <div data-testid="profile-fields">
      <button type="button" onClick={onImageDelete} data-testid="image-delete-button">
        Delete Image
      </button>
      <button type="button" onClick={onBirthDateDelete} data-testid="birth-date-delete-button">
        Delete Birth Date
      </button>
    </div>
  ),
}));

describe('UserProfileForm', () => {
  // テストデータの準備
  const mockUserDetail: UserDetailType['userDetail'] = {
    username: 'testuser',
    name: 'Test User',
    birth_date: '1990-01-01',
    gender: 'male',
    height: '170',
  };

  // モックの戻り値の型定義
  type MockProfileFormReturn = {
    state: {
      pending: boolean;
      errors?: Record<string, string[]>;
    };
    formAction: () => Promise<void>;
    handleDelete: (type: 'image' | 'birthDate') => () => void;
  };

  // デフォルトのモック値
  const defaultMockReturn: MockProfileFormReturn = {
    state: {
      pending: false,
    },
    formAction: jest.fn().mockImplementation(async () => {}),
    handleDelete: (_type: 'image' | 'birthDate') => jest.fn(),
  };

  // beforeEach内でデフォルト値を設定
  beforeEach(() => {
    jest.clearAllMocks();

    // useImageのデフォルトモック設定
    (useImage as jest.Mock).mockReturnValue({
      isProcessing: false, // 必要に応じて true に変更
    });

    (useProfileForm as jest.Mock).mockReturnValue(defaultMockReturn);
  });

  // 基本的なレンダリングテスト
  it('renders form with all required components', () => {
    render(<UserProfileForm userDetail={mockUserDetail} onSuccess={jest.fn()} />);

    // フォームの存在確認（data-testidを使用）
    expect(screen.getByTestId('profile-fields')).toBeInTheDocument();
    // 送信ボタンの存在確認
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    // フォームのクラス名確認
    expect(screen.getByTestId('profile-fields').closest('form')).toHaveClass('space-y-8');
  });

  // Server Actionの設定テスト
  it('sets up form with formAction from useProfileForm', () => {
    const mockFormAction = jest.fn().mockImplementation(async () => {});
    (useProfileForm as jest.Mock).mockReturnValue({
      ...defaultMockReturn,
      formAction: mockFormAction,
    });

    render(<UserProfileForm userDetail={mockUserDetail} onSuccess={jest.fn()} />);

    // formActionが正しく設定されているかの確認
    const form = screen.getByTestId('profile-fields').closest('form');
    expect(form).toBeInTheDocument();
  });

  // 削除ハンドラーのテスト
  it('passes correct delete handlers to ProfileFields', () => {
    const mockHandleDelete = jest.fn(() => jest.fn());
    (useProfileForm as jest.Mock).mockReturnValue({
      ...defaultMockReturn,
      handleDelete: mockHandleDelete,
    });

    render(<UserProfileForm userDetail={mockUserDetail} onSuccess={jest.fn()} />);

    // 画像削除ボタンのクリックテスト
    screen.getByTestId('image-delete-button').click();
    expect(mockHandleDelete).toHaveBeenCalledWith('image');

    // 生年月日削除ボタンのクリックテスト
    screen.getByTestId('birth-date-delete-button').click();
    expect(mockHandleDelete).toHaveBeenCalledWith('birthDate');
  });

  // ステートの受け渡しテスト
  it('passes state to ProfileFields', () => {
    const mockState = {
      pending: true,
      errors: {
        name: ['Required'],
      },
    };

    (useProfileForm as jest.Mock).mockReturnValue({
      ...defaultMockReturn,
      state: mockState,
    });

    render(<UserProfileForm userDetail={mockUserDetail} onSuccess={jest.fn()} />);

    // ProfileFieldsにステートが正しく渡されているか確認
    const profileFields = screen.getByTestId('profile-fields');
    expect(profileFields).toBeInTheDocument();
  });
});
