/**
 * @jest-environment jsdom
 */
import { useToast } from '@/hooks/use-toast';
import { act, renderHook } from '@testing-library/react';
import { useContactForm } from '../useContactForm';

// モックの設定
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

// モック関数の型定義
const mockFormAction = jest.fn();
const mockState = {
  message: '',
  errors: null,
  success: false,
};

// useFormStateのモック
jest.mock('react-dom', () => {
  const actual = jest.requireActual('react-dom');
  return {
    ...actual,
    useFormState: jest.fn(() => [mockState, mockFormAction]),
  };
});

// next-authとbaseApiのモック
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/lib/api/baseApi', () => ({
  baseFetchAPI: jest.fn(),
  baseFetchAuthAPI: jest.fn(),
}));

describe('useContactForm', () => {
  let mockToast: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
  });

  it('初期状態が正しく設定されていること', () => {
    const { result } = renderHook(() => useContactForm(false));

    expect(result.current.states).toEqual({
      currentStep: 1,
      formData: {
        name: '',
        email: '',
        subject: '',
        message: '',
        privacyAgreed: false,
      },
      errors: null,
    });
  });

  it('フィールドの値が正しく更新されること', () => {
    const { result } = renderHook(() => useContactForm(false));

    act(() => {
      result.current.handler.handleFieldChange('name')('テストユーザー');
    });
    expect(result.current.states.formData.name).toBe('テストユーザー');

    act(() => {
      result.current.handler.handleFieldChange('email')('test@example.com');
    });
    expect(result.current.states.formData.email).toBe('test@example.com');
  });

  it('チェックボックスの値が正しく更新されること', () => {
    const { result } = renderHook(() => useContactForm(false));

    act(() => {
      result.current.handler.handleCheckboxChange({
        target: { checked: true },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.states.formData.privacyAgreed).toBe(true);
  });

  describe('フォームのバリデーション', () => {
    describe('非認証ユーザー', () => {
      it('必須フィールドが空の場合にエラーが表示されること', () => {
        const { result } = renderHook(() => useContactForm(false));

        act(() => {
          result.current.handler.handleNext();
        });

        expect(result.current.states.errors).toBeTruthy();
        expect(result.current.states.currentStep).toBe(1);
      });

      it('有効なデータで次のステップに進めること', () => {
        const { result } = renderHook(() => useContactForm(false));

        // フィールドを一括で更新
        act(() => {
          result.current.handler.handleFieldChange('name')('テストユーザー');
          result.current.handler.handleFieldChange('email')('test@example.com');
          result.current.handler.handleFieldChange('subject')('テスト件名');
          result.current.handler.handleFieldChange('message')(
            'これは10文字以上のテストメッセージです。',
          );
          result.current.handler.handleCheckboxChange({
            target: { checked: true },
          } as React.ChangeEvent<HTMLInputElement>);
        });

        // 次のステップへ進む
        act(() => {
          result.current.handler.handleNext();
        });

        expect(result.current.states.errors).toBeNull();
        expect(result.current.states.currentStep).toBe(2);
      });
    });

    describe('認証済みユーザー', () => {
      it('名前とメールアドレスなしで次のステップに進めること', () => {
        const { result } = renderHook(() => useContactForm(true));

        // フィールドを一括で更新
        act(() => {
          result.current.handler.handleFieldChange('subject')('テスト件名');
          result.current.handler.handleFieldChange('message')(
            'これは10文字以上のテストメッセージです。',
          );
          result.current.handler.handleCheckboxChange({
            target: { checked: true },
          } as React.ChangeEvent<HTMLInputElement>);
        });

        // 次のステップへ進む
        act(() => {
          result.current.handler.handleNext();
        });

        expect(result.current.states.errors).toBeNull();
        expect(result.current.states.currentStep).toBe(2);
      });
    });
  });
});
