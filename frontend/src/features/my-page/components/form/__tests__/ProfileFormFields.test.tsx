import type { UserType } from '@/types';
import { render, screen } from '@testing-library/react';
import type { UseFormReturn } from 'react-hook-form';
import type { ProfileEditFormData } from '../../../types';
import { ProfileFormFields } from '../ProfileFormFields';

// 必要なコンポーネントのモック
jest.mock('@/components/elements/form/FloatingLabelInputFormField', () => ({
  __esModule: true,
  default: ({ label, name }: { label: string; name: string }) => (
    <div data-testid={`input-field-${name}`}>
      <label>{label}</label>
    </div>
  ),
}));

jest.mock('@/components/elements/form/FloatingLabelSelectFormField', () => ({
  __esModule: true,
  default: ({ label, name }: { label: string; name: string }) => (
    <div data-testid={`select-field-${name}`}>
      <label>{label}</label>
    </div>
  ),
}));

jest.mock('../ProfileImageFormField', () => ({
  __esModule: true,
  default: ({ profileImage, onDelete }: { profileImage?: string; onDelete?: () => void }) => (
    <div data-testid="profile-image-field">
      {profileImage && <span data-testid="has-image">Has Image</span>}
      {onDelete && <button data-testid="delete-image-button">Delete Image</button>}
    </div>
  ),
}));

jest.mock('../BirthDateFields', () => ({
  BirthDateFields: ({ onDelete }: { onDelete?: () => void }) => (
    <div data-testid="birth-date-fields">
      {onDelete && <button data-testid="delete-birth-date-button">Delete Birth Date</button>}
    </div>
  ),
}));

describe('ProfileFormFields', () => {
  const mockForm = {
    control: {},
    register: jest.fn(),
    formState: { errors: {} },
  } as unknown as UseFormReturn<ProfileEditFormData>;

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

  // フォームフィールド全体のレンダリング確認
  it('renders all form fields', () => {
    render(
      <ProfileFormFields
        form={mockForm}
        userDetail={mockUserDetail}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    // 必須のフィールドが存在することを確認
    expect(screen.getByTestId('profile-image-field')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-username')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-name')).toBeInTheDocument();
    expect(screen.getByTestId('birth-date-fields')).toBeInTheDocument();
    expect(screen.getByTestId('select-field-gender')).toBeInTheDocument();
    expect(screen.getByTestId('input-field-height')).toBeInTheDocument();
  });

  // プロフィール画像が存在する場合に削除ボタンが表示されることを確認
  it('shows image delete button when profile image exists', () => {
    render(
      <ProfileFormFields
        form={mockForm}
        userDetail={mockUserDetail}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    expect(screen.getByTestId('delete-image-button')).toBeInTheDocument();
  });

  // プロフィール画像が存在しない場合に削除ボタンが非表示になることを確認
  it('hides image delete button when no profile image exists', () => {
    render(
      <ProfileFormFields
        form={mockForm}
        userDetail={{ ...mockUserDetail, profile_image: undefined }}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    expect(screen.queryByTestId('delete-image-button')).not.toBeInTheDocument();
  });

  // 生年月日が存在する場合に削除ボタンが表示されることを確認
  it('shows birth date delete button when birth date exists', () => {
    render(
      <ProfileFormFields
        form={mockForm}
        userDetail={mockUserDetail}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    expect(screen.getByTestId('delete-birth-date-button')).toBeInTheDocument();
  });

  // 生年月日が存在しない場合に削除ボタンが非表示になることを確認
  it('hides birth date delete button when no birth date exists', () => {
    render(
      <ProfileFormFields
        form={mockForm}
        userDetail={{ ...mockUserDetail, birth_date: undefined }}
        onImageDelete={mockOnImageDelete}
        onBirthDateDelete={mockOnBirthDateDelete}
      />,
    );

    expect(screen.queryByTestId('delete-birth-date-button')).not.toBeInTheDocument();
  });

  // グリッドレイアウトクラスが正しく適用されていることを確認
  it('applies correct grid layout classes', () => {
    const { container } = render(
      <ProfileFormFields
        form={mockForm}
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
