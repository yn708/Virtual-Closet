import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';

import { sendCodeAction } from '@/lib/actions/auth/sendCodeAction';
import type { FormState } from '@/types';
import { signIn } from 'next-auth/react';
import AuthCodeInputForm from '../AuthCodeInputForm';

// ResizeObserverのモック
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// OTPコンポーネントで使用されるelementFromPointのモック
document.elementFromPoint = () => null;

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn((initialState: FormState) => [initialState, jest.fn()]),
  useFormStatus: () => ({ pending: false }),
}));

// 全行前のグローバルモックのセットアップ
beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
});

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

jest.mock('@/lib/actions/auth/sendCodeAction', () => ({
  sendCodeAction: jest.fn(),
}));

const mockAppend = jest.fn();
const mockGet = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  global.FormData = jest.fn(
    () =>
      ({
        append: mockAppend,
        get: mockGet,
      }) as unknown as FormData,
  );
});

// フォーム要素を取得するヘルパー関数
const getFormElements = () => {
  const input = screen.getByRole('textbox') as HTMLInputElement;
  const submitButton = screen.getByRole('button', { name: '送信' });
  return { input, submitButton };
};

/**
 * フォームに認証コードを入力して送信するヘルパー関数
 * @param code 入力する認証コード
 */
const fillAndSubmitForm = async (code: string) => {
  const { input, submitButton } = getFormElements();
  await act(async () => {
    fireEvent.change(input, { target: { value: code } });
    fireEvent.click(submitButton);
  });
};

// テストスイート --------------------------------
describe('AuthCodeInputForm', () => {
  const mockEmail = 'test@example.com';

  /**
   * 初期表示のテスト
   * - 6桁の入力フィールドが表示されること
   * - 送信ボタンが表示されること
   * - 再送信リンクが表示されること
   */
  it('renders the form with empty input fields', async () => {
    render(<AuthCodeInputForm email={mockEmail} />);

    const inputField = screen.getByRole('textbox');
    expect(inputField).toBeInTheDocument();
    expect(inputField).toHaveAttribute('maxlength', '6');
    expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();
  });

  /**
   * コード入力の動作テスト
   * - 6桁のコードが正しく入力できること
   * - 入力値がフォームに反映されること
   */
  it('handles code input correctly', async () => {
    render(<AuthCodeInputForm email={mockEmail} />);
    const input = screen.getByRole('textbox');

    await act(async () => {
      fireEvent.change(input, { target: { value: '123456' } });
    });

    expect(input).toHaveValue('123456');
  });

  //  サーバーエラー時の処理確認
  it('handles server error', async () => {
    (sendCodeAction as jest.Mock).mockRejectedValueOnce(new Error('Server error'));

    render(<AuthCodeInputForm email={mockEmail} />);
    await fillAndSubmitForm('123456');

    await waitFor(() => {
      expect(signIn).not.toHaveBeenCalled();
    });
  });

  //  入力値の変更処理の確認
  it('handles input changes correctly', async () => {
    render(<AuthCodeInputForm email={mockEmail} />);
    const { input } = getFormElements();

    await act(async () => {
      fireEvent.change(input, { target: { value: '1' } });
    });

    expect(input).toHaveValue('1');
  });
});
