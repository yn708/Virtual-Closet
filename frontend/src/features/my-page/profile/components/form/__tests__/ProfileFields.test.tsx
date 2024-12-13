import type { UserType } from '@/types';
import { render, screen } from '@testing-library/react';
import ProfileFields from '../ProfileFields';

// モックコンポーネントの定義
jest.mock('@/components/elements/form/input/FloatingLabelInput', () => ({
  __esModule: true,
  default: ({ label, name }: { label: string; name: string }) => (
    <div data-testid={`input-field-${name}`}>
      <label>{label}</label>
    </div>
  ),
}));

jest.mock('@/components/elements/form/select/FloatingLabelSelect', () => ({
  __esModule: true,
  default: ({ label, name }: { label: string; name: string }) => (
    <div data-testid={`select-field-${name}`}>
      <label>{label}</label>
    </div>
  ),
}));

jest.mock('../ProfileImageField', () => ({
  __esModule: true,
  default: ({ profileImage, onDelete }: { profileImage?: string; onDelete?: () => void }) => (
    <div data-testid="profile-image-field">
      {profileImage && <span data-testid="has-image">Has Image</span>}
      {onDelete && <button data-testid="delete-image-button">Delete Image</button>}
    </div>
  ),
}));

jest.mock('../BirthDateFields', () => ({
  __esModule: true,
  default: ({
    onDelete,
    defaultBirthDate,
  }: {
    onDelete?: () => void;
    defaultBirthDate?: string;
  }) => (
    <div data-testid="birth-date-fields">
      {defaultBirthDate && onDelete && (
        <button data-testid="delete-birth-date-button">Delete Birth Date</button>
      )}
    </div>
  ),
}));

describe('ProfileFields', () => {
  // FormStateの型定義を使用してモックステートを作成
  const mockState = {
    errors: {},
    message: '',
  };

  const mockUserDetail: Partial<UserType> = {
    username: 'testuser',
    name: 'Test User',
    birth_date: '1990-01-01',
    gender: 'male',
    height: '170',
    profile_image: 'test-image.jpg',
  };

  const mockOnImageDelete = jest.fn();
  const mockOnBirthDateDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 全てのフォームフィールドが正しくレンダリングされることを確認
  it('renders all form fields', () => {
    render(
      <ProfileFields
        state={mockState}
        userDetail={mockUserDetail}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    // 各フィールドの存在確認
    expect(screen.getByTestId('profile-image-field')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-username')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-name')).toBeInTheDocument();
    expect(screen.getByTestId('birth-date-fields')).toBeInTheDocument();
    expect(screen.getByTestId('select-field-gender')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-height')).toBeInTheDocument();
  });

  // プロフィール画像関連のテスト
  it('shows image delete button when profile image exists', () => {
    render(
      <ProfileFields
        state={mockState}
        userDetail={mockUserDetail}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    expect(screen.getByTestId('delete-image-button')).toBeInTheDocument();
  });

  it('hides image delete button when no profile image exists', () => {
    render(
      <ProfileFields
        state={mockState}
        userDetail={{ ...mockUserDetail, profile_image: undefined }}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    expect(screen.queryByTestId('delete-image-button')).not.toBeInTheDocument();
  });

  // 生年月日関連のテスト
  it('shows birth date delete button when birth date exists', () => {
    render(
      <ProfileFields
        state={mockState}
        userDetail={mockUserDetail}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    expect(screen.getByTestId('delete-birth-date-button')).toBeInTheDocument();
  });

  // birth_dateが存在しない場合に削除ボタンが非表示になる
  it('hides birth date delete button when no birth date exists', () => {
    render(
      <ProfileFields
        state={mockState}
        userDetail={{ ...mockUserDetail, birth_date: undefined }}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    expect(screen.queryByTestId('delete-birth-date-button')).not.toBeInTheDocument();
  });
  // グリッドレイアウトのテスト
  it('applies correct grid layout classes', () => {
    const { container } = render(
      <ProfileFields
        state={mockState}
        userDetail={mockUserDetail}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    const gridContainers = container.getElementsByClassName('grid');
    Array.from(gridContainers).forEach((grid) => {
      expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'gap-4');
    });
  });
});
