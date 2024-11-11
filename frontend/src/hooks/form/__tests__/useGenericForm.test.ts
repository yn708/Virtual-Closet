import type { LoginFormData } from '@/features/auth/types';
import { loginFormSchema } from '@/utils/validations/auth-validation';
import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useGenericForm } from '../useGenericForm';

// next/navigationのモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useGenericForm', () => {
  // テストで使用する共通の変数
  const defaultValues: LoginFormData = {
    email: '',
    password: '',
  };

  const mockRouter = {
    push: jest.fn(),
  };

  beforeEach(() => {
    // 各テストの前にモックをリセット
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('初期状態が正しく設定されること', () => {
    const { result } = renderHook(() =>
      useGenericForm<LoginFormData>({
        schema: loginFormSchema,
        defaultValues,
      }),
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.form.getValues()).toEqual(defaultValues);
  });

  it('フォームのバリデーションが正しく機能すること', async () => {
    const { result } = renderHook(() =>
      useGenericForm<LoginFormData>({
        schema: loginFormSchema,
        defaultValues,
      }),
    );

    // 不正な値でバリデーション
    await act(async () => {
      const isValid = await result.current.form.trigger();
      expect(isValid).toBe(false);
    });

    // 正しい値でバリデーション
    await act(async () => {
      result.current.form.setValue('email', 'test@example.com');
      result.current.form.setValue('password', 'password123');
      const isValid = await result.current.form.trigger();
      expect(isValid).toBe(true);
    });
  });

  it('onBeforeSubmitが正しく実行されること', async () => {
    const onBeforeSubmit = jest.fn();
    const { result } = renderHook(() =>
      useGenericForm<LoginFormData>({
        schema: loginFormSchema,
        defaultValues,
        onBeforeSubmit,
      }),
    );

    const validData = {
      email: 'test@example.com',
      password: 'password123',
    };

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(onBeforeSubmit).toHaveBeenCalledWith(validData);
  });

  it('onSubmitSuccessが正しく実行されること', async () => {
    const onSubmitSuccess = jest.fn();
    const { result } = renderHook(() =>
      useGenericForm<LoginFormData>({
        schema: loginFormSchema,
        defaultValues,
        onSubmitSuccess,
      }),
    );

    const validData = {
      email: 'test@example.com',
      password: 'password123',
    };

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(onSubmitSuccess).toHaveBeenCalledWith(validData);
  });

  it('エラーが発生した場合にonSubmitErrorが呼ばれること', async () => {
    const error = new Error('Test error');
    const onBeforeSubmit = jest.fn().mockRejectedValue(error);
    const onSubmitError = jest.fn();

    const { result } = renderHook(() =>
      useGenericForm<LoginFormData>({
        schema: loginFormSchema,
        defaultValues,
        onBeforeSubmit,
        onSubmitError,
      }),
    );

    const validData = {
      email: 'test@example.com',
      password: 'password123',
    };

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(onSubmitError).toHaveBeenCalledWith(error);
  });

  // 実際の使用例に基づいたテスト
  it('実際の使用例のシナリオをテストする', async () => {
    const mockSignIn = jest.fn().mockResolvedValue({ ok: true });
    const onSubmitSuccess = jest.fn().mockImplementation(async (data) => {
      const result = await mockSignIn(data);
      if (result.ok) {
        mockRouter.push('/');
      }
    });

    const { result } = renderHook(() =>
      useGenericForm<LoginFormData>({
        schema: loginFormSchema,
        defaultValues,
        onSubmitSuccess,
      }),
    );

    const validData = {
      email: 'test@example.com',
      password: 'password123',
    };

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockSignIn).toHaveBeenCalledWith(validData);
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
});
