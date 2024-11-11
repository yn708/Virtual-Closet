import { useImage } from '@/context/ImageContext';
import { useToast } from '@/hooks/use-toast';
import * as userApi from '@/lib/api/userApi';
import type { UserType } from '@/types/user';
import { act, renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useProfileForm } from '../useProfileForm';

// モックの設定
jest.mock('@/lib/api/userApi', () => ({
  updateUserProfileAPI: jest.fn(),
}));

jest.mock('@/context/ImageContext');
jest.mock('@/hooks/use-toast');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useProfileForm', () => {
  // テスト用の初期値
  const defaultUserDetail: Partial<UserType> = {
    username: 'testuser',
    name: 'Test User',
    birth_date: '1990-01-01',
    gender: 'male',
    height: '170',
  };

  // モックの初期化
  const mockClearImage = jest.fn();
  const mockToast = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    (useImage as jest.Mock).mockReturnValue({
      image: null,
      clearImage: mockClearImage,
    });

    (useToast as jest.Mock).mockReturnValue({
      toast: mockToast,
    });

    (useRouter as jest.Mock).mockReturnValue({
      refresh: mockRefresh,
    });
  });
  // フォームが正しい初期値で初期化されること
  it('should initialize form with correct default values', () => {
    const { result } = renderHook(() => useProfileForm(defaultUserDetail));

    expect(result.current.form.getValues()).toEqual({
      username: 'testuser',
      name: 'Test User',
      birth_year: '1990',
      birth_month: '01',
      birth_day: '01',
      gender: 'male',
      height: '170',
    });
  });
  // 変更がない場合はAPIが呼ばれずトースト表示のみ行われること
  it('should display toast without API call when no changes are made', async () => {
    const { result } = renderHook(() => useProfileForm(defaultUserDetail));

    await act(async () => {
      await result.current.onSubmit(result.current.form.getValues());
    });

    expect(userApi.updateUserProfileAPI).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: '変更がありません',
    });
  });
  // プロフィール更新が成功した場合、適切な処理が実行されること
  it('should process form submission successfully when changes are made', async () => {
    const onSuccess = jest.fn();
    const { result } = renderHook(() => useProfileForm(defaultUserDetail, onSuccess));

    (userApi.updateUserProfileAPI as jest.Mock).mockResolvedValueOnce({});

    await act(async () => {
      result.current.form.setValue('username', 'newusername');
      await result.current.onSubmit(result.current.form.getValues());
    });

    expect(userApi.updateUserProfileAPI).toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: 'プロフィールが更新されました',
    });
    expect(onSuccess).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
  });
  // 画像の削除が正しく処理されること
  it('should process image deletion correctly', () => {
    const { result } = renderHook(() => useProfileForm(defaultUserDetail));

    act(() => {
      result.current.handleImageDelete();
    });

    expect(mockClearImage).toHaveBeenCalled();
  });
  // 生年月日の削除が正しく処理されること
  it('should process birth date deletion correctly', () => {
    const { result } = renderHook(() => useProfileForm(defaultUserDetail));

    act(() => {
      result.current.handleBirthDateDelete();
    });

    expect(result.current.form.getValues('birth_year')).toBeNull();
    expect(result.current.form.getValues('birth_month')).toBeNull();
    expect(result.current.form.getValues('birth_day')).toBeNull();
  });
  // APIエラー時にフォームエラーが適切に設定されること
  it('should set form error correctly when API returns an error', async () => {
    const errorDetail = { detail: 'Username already exists' };
    (userApi.updateUserProfileAPI as jest.Mock).mockRejectedValueOnce(
      new Error(JSON.stringify(errorDetail)),
    );

    const { result } = renderHook(() => useProfileForm(defaultUserDetail));

    await act(async () => {
      result.current.form.setValue('username', 'existinguser');
      await result.current.onSubmit(result.current.form.getValues());
    });

    expect(result.current.form.getFieldState('username').error?.message).toBe(errorDetail.detail);
  });
  // 画像アップロードが正しく処理されること
  it('should process image upload correctly', async () => {
    const mockFile = new File(['test'], 'test.png', { type: 'image/png' });
    (useImage as jest.Mock).mockReturnValue({
      image: mockFile,
      clearImage: mockClearImage,
    });

    const { result } = renderHook(() => useProfileForm(defaultUserDetail));

    await act(async () => {
      await result.current.onSubmit(result.current.form.getValues());
    });

    expect(userApi.updateUserProfileAPI).toHaveBeenCalledWith(expect.any(FormData));
  });
});
