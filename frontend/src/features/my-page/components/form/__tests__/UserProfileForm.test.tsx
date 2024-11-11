import type { UserType } from '@/types/user';
import { render, screen } from '@testing-library/react';
import { useProfileForm } from '../../../hooks/useProfileForm';
import UserProfileForm from '../UserProfileForm';

jest.mock('../../../hooks/useProfileForm', () => ({
  useProfileForm: jest.fn(),
}));

jest.mock('@/components/ui/form', () => ({
  Form: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@/components/elements/button/SubmitButton', () => ({
  __esModule: true,
  default: ({ label, loading }: { label: string; loading: boolean }) => (
    <button type="submit" disabled={loading}>
      {label}
    </button>
  ),
}));

// ProfileFormFieldsのモック
jest.mock('../ProfileFormFields', () => ({
  ProfileFormFields: () => <div data-testid="profile-form-fields" />,
}));

describe('UserProfileForm', () => {
  const mockUserDetail: Partial<UserType> = {
    username: 'testuser',
    name: 'Test User',
    birth_date: '1990-01-01',
    gender: 'male',
    height: '170',
  };

  const mockForm = {
    handleSubmit: jest.fn((fn) => fn),
    register: jest.fn(),
    control: {},
    formState: { errors: {} },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useProfileForm as jest.Mock).mockReturnValue({
      form: mockForm,
      isLoading: false,
      onSubmit: jest.fn(),
      handleImageDelete: jest.fn(),
      handleBirthDateDelete: jest.fn(),
    });
  });
  // フォームが正しくレンダリングされること
  it('renders the form with submit button', () => {
    render(<UserProfileForm userDetail={mockUserDetail} onSuccess={jest.fn()} />);

    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    expect(screen.getByTestId('profile-form-fields')).toBeInTheDocument();
  });

  // ローディング中は送信ボタンが無効化されること
  it('disables submit button while loading', () => {
    (useProfileForm as jest.Mock).mockReturnValue({
      form: mockForm,
      isLoading: true,
      onSubmit: jest.fn(),
      handleImageDelete: jest.fn(),
      handleBirthDateDelete: jest.fn(),
    });

    render(<UserProfileForm userDetail={mockUserDetail} onSuccess={jest.fn()} />);

    expect(screen.getByRole('button', { name: '保存' })).toBeDisabled();
  });

  // フォームにデフォルト値が正しく設定されること
  it('initializes useProfileForm with correct props', () => {
    const onSuccess = jest.fn();
    render(<UserProfileForm userDetail={mockUserDetail} onSuccess={onSuccess} />);

    expect(useProfileForm).toHaveBeenCalledWith(mockUserDetail, onSuccess);
  });

  // ProfileFormFieldsに正しいpropsが渡されること
  it('passes correct props to form handlers', () => {
    const mockHandleSubmit = jest.fn();
    const mockOnSubmit = jest.fn();

    (useProfileForm as jest.Mock).mockReturnValue({
      form: {
        ...mockForm,
        handleSubmit: mockHandleSubmit,
      },
      isLoading: false,
      onSubmit: mockOnSubmit,
      handleImageDelete: jest.fn(),
      handleBirthDateDelete: jest.fn(),
    });

    render(<UserProfileForm userDetail={mockUserDetail} onSuccess={jest.fn()} />);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
