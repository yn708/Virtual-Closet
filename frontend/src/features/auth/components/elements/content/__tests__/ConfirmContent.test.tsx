import { useEmailPasswordForm } from '@/features/auth/hooks/useEmailPasswordForm';
import type { EmailType, LoginFormData } from '@/features/auth/types';
import type {
  ChildrenType,
  ClassNameType,
  DescriptionType,
  SubDescriptionType,
  TitleType,
} from '@/types';
import { act, render, screen, waitFor } from '@testing-library/react';
import type { UseFormReturn } from 'react-hook-form';
import ConfirmContent from '../ConfirmContent';
interface TestAuthFormProps {
  form: UseFormReturn;
  onSubmit: (data: LoginFormData) => Promise<void>;
  submitButtonLabel: string;
}

// react-hook-formのモック
const createMockForm = () => ({
  register: jest.fn(),
  handleSubmit: jest.fn((fn) => fn),
});

// useEmailPasswordFormのモック実装
const createMockUseEmailPasswordForm = (
  onEmailVerified: (email: string) => void,
  shouldFail: boolean = false,
) => {
  const mockForm = createMockForm();

  return {
    form: mockForm,
    onSubmit: async (data: LoginFormData) => {
      if (shouldFail) {
        throw new Error('Submit failed');
      }
      await new Promise<void>((resolve) => setTimeout(resolve, 100));
      onEmailVerified(data.email);
    },
  };
};

// コンポーネントのモック
jest.mock('@/features/auth/hooks/useEmailPasswordForm', () => ({
  useEmailPasswordForm: jest.fn(),
}));

jest.mock('@/components/elements/loading/LoadingElements', () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
}));

jest.mock('@/components/layout/CenterTitleLayout', () => ({
  __esModule: true,
  default: ({
    children,
    title,
    description,
    subDescription,
  }: ChildrenType & ClassNameType & TitleType & DescriptionType & SubDescriptionType) => (
    <div data-testid="center-layout">
      <h1>{title}</h1>
      <p>{description}</p>
      <p>{subDescription}</p>
      {children}
    </div>
  ),
}));

jest.mock('../../form/AuthCodeInputForm', () => ({
  __esModule: true,
  default: ({ email }: EmailType) => (
    <div data-testid="auth-code-form">Auth Code Form for {email}</div>
  ),
}));

jest.mock('../../form/AuthForm', () => ({
  __esModule: true,
  default: ({ form, onSubmit, submitButtonLabel }: TestAuthFormProps) => (
    <form
      data-testid="auth-form"
      onSubmit={async (e) => {
        e.preventDefault();
        onSubmit({ email: 'test@example.com', password: 'password' });
      }}
    >
      <input placeholder="メールアドレス" {...form.register('email')} role="text-input" />
      <input
        placeholder="パスワード"
        {...form.register('password')}
        type="password"
        role="password-input"
      />
      <button type="submit" data-testid="submit-button">
        {submitButtonLabel}
      </button>
    </form>
  ),
}));

// sessionStorage のモック
const mockSessionStorage = (() => {
  let store: { [key: string]: string | null } = {};
  return {
    getItem: jest.fn((key) => store[key]),
    setItem: jest.fn((key, value) => {
      store[key] = value;
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });

describe('ConfirmContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.clear();
  });

  it('初期ロード時にLoadingElementsを表示する', () => {
    (useEmailPasswordForm as jest.Mock).mockImplementation((callback) =>
      createMockUseEmailPasswordForm(callback),
    );

    render(<ConfirmContent />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('sessionStorageにemailがない場合、認証フォームを表示する', async () => {
    mockSessionStorage.getItem.mockReturnValue(null);
    (useEmailPasswordForm as jest.Mock).mockImplementation((callback) =>
      createMockUseEmailPasswordForm(callback),
    );

    render(<ConfirmContent />);

    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました。')).toBeInTheDocument();
      expect(
        screen.getByText('メールアドレスとパスワードを再入力してください。'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('auth-form')).toBeInTheDocument();
    });
  });

  it('sessionStorageにemailがある場合、認証コード入力フォームを表示する', async () => {
    mockSessionStorage.getItem.mockReturnValue('test@example.com');
    (useEmailPasswordForm as jest.Mock).mockImplementation((callback) =>
      createMockUseEmailPasswordForm(callback),
    );

    render(<ConfirmContent />);

    await waitFor(() => {
      expect(screen.getByText('認証コード入力')).toBeInTheDocument();
      expect(screen.getByText('test@example.comに認証コードを送信しました。')).toBeInTheDocument();
      expect(
        screen.getByText('メールに記載された6桁の認証コードを入力してください。'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('auth-code-form')).toBeInTheDocument();
    });
  });

  it('フォーム送信後に認証コード入力フォームに切り替わる', async () => {
    mockSessionStorage.getItem.mockReturnValue(null);

    (useEmailPasswordForm as jest.Mock).mockImplementation((callback) =>
      createMockUseEmailPasswordForm(callback),
    );

    render(<ConfirmContent />);

    // フォームの送信
    await act(async () => {
      const form = screen.getByTestId('auth-form');
      form.dispatchEvent(new Event('submit', { bubbles: true }));
    });

    // 認証コード入力フォームへの切り替わりを確認
    await waitFor(() => {
      expect(screen.getByText('認証コード入力')).toBeInTheDocument();
      expect(screen.getByTestId('auth-code-form')).toBeInTheDocument();
    });
  });
});
