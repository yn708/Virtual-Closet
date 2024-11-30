/**
 * @jest-environment node
 */
import { updateUserProfileAPI } from '@/lib/api/userApi';
import type { FormStateWithChange, UserType } from '@/types';
import { revalidatePath } from 'next/cache';
import { profileUpdateAction } from '../profileUpdateAction';

// 外部依存のモック
jest.mock('@/lib/api/userApi', () => ({
  updateUserProfileAPI: jest.fn(),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('profileUpdateAction', () => {
  // テストごとにモックをリセット
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // FormDataの作成ヘルパー関数
  const createMockFormData = (data: { [key: string]: string | File | null }) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null) {
        formData.append(key, value);
      }
    });
    return formData;
  };

  // テスト用の初期ユーザーデータ
  const mockUserDetail: Partial<UserType> = {
    username: 'oldUsername',
    name: 'Old Name',
    birth_date: '1990-01-01',
    gender: 'male',
    height: '170',
    profile_image: 'old-image.jpg',
  };

  // 初期の削除状態
  const initialDeleteState = {
    image: false,
    birthDate: false,
  };

  it('ユーザー名のみの変更を正しく処理する', async () => {
    const mockFormData = createMockFormData({
      username: 'newUsername',
      name: mockUserDetail.name!,
      birth_year: '1990',
      birth_month: '01',
      birth_day: '01',
      gender: mockUserDetail.gender!,
      height: mockUserDetail.height!,
    });

    const result = await profileUpdateAction(
      {} as FormStateWithChange,
      mockFormData,
      mockUserDetail,
      initialDeleteState,
    );

    expect(updateUserProfileAPI).toHaveBeenCalled();
    expect(result).toEqual({
      message: '更新が完了しました',
      errors: null,
      success: true,
      hasChanges: true,
    });
    expect(revalidatePath).toHaveBeenCalledWith('/');
  });

  it('プロフィール画像の削除を正しく処理する', async () => {
    const mockFormData = createMockFormData({
      username: mockUserDetail.username!,
      name: mockUserDetail.name!,
      gender: mockUserDetail.gender!,
      height: mockUserDetail.height!,
    });

    const deleteState = { ...initialDeleteState, image: true };

    const result = await profileUpdateAction(
      {} as FormStateWithChange,
      mockFormData,
      mockUserDetail,
      deleteState,
    );

    const apiFormDataCalls = (updateUserProfileAPI as jest.Mock).mock.calls[0][0];
    expect(apiFormDataCalls.get('delete_profile_image')).toBe('true');
    expect(result.success).toBe(true);
    expect(result.hasChanges).toBe(true);
  });

  it('生年月日の削除を正しく処理する', async () => {
    const mockFormData = createMockFormData({
      username: mockUserDetail.username!,
      name: mockUserDetail.name!,
      gender: mockUserDetail.gender!,
      height: mockUserDetail.height!,
    });

    const deleteState = { ...initialDeleteState, birthDate: true };

    const result = await profileUpdateAction(
      {} as FormStateWithChange,
      mockFormData,
      mockUserDetail,
      deleteState,
    );

    const apiFormDataCalls = (updateUserProfileAPI as jest.Mock).mock.calls[0][0];
    expect(apiFormDataCalls.get('delete_birth_date')).toBe('true');
    expect(result.success).toBe(true);
    expect(result.hasChanges).toBe(true);
  });

  it('新しいプロフィール画像のアップロードを正しく処理する', async () => {
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockFormData = createMockFormData({
      username: mockUserDetail.username!,
      name: mockUserDetail.name!,
      gender: mockUserDetail.gender!,
      height: mockUserDetail.height!,
      profile_image: mockFile,
    });

    const result = await profileUpdateAction(
      {} as FormStateWithChange,
      mockFormData,
      mockUserDetail,
      initialDeleteState,
    );

    const apiFormDataCalls = (updateUserProfileAPI as jest.Mock).mock.calls[0][0];
    expect(apiFormDataCalls.get('profile_image')).toBeInstanceOf(File);
    expect(result.success).toBe(true);
    expect(result.hasChanges).toBe(true);
  });

  it('変更がない場合は API を呼び出さない', async () => {
    const mockFormData = createMockFormData({
      username: mockUserDetail.username!,
      name: mockUserDetail.name!,
      birth_year: '1990',
      birth_month: '01',
      birth_day: '01',
      gender: mockUserDetail.gender!,
      height: mockUserDetail.height!,
    });

    const result = await profileUpdateAction(
      {} as FormStateWithChange,
      mockFormData,
      mockUserDetail,
      initialDeleteState,
    );

    expect(updateUserProfileAPI).not.toHaveBeenCalled();
    expect(result).toEqual({
      message: '変更がありません',
      errors: null,
      success: false,
      hasChanges: false,
    });
  });

  it('バリデーションエラーを適切に処理する', async () => {
    const mockFormData = createMockFormData({
      username: '', // 空のユーザー名（無効）
      name: mockUserDetail.name!,
      gender: mockUserDetail.gender!,
      height: mockUserDetail.height!,
    });

    const result = await profileUpdateAction(
      {} as FormStateWithChange,
      mockFormData,
      mockUserDetail,
      initialDeleteState,
    );

    expect(result.success).toBe(false);
    expect(result.message).toBe('バリデーションエラー');
    expect(result.errors).toBeDefined();
    expect(updateUserProfileAPI).not.toHaveBeenCalled();
  });

  it('複数のフィールドの変更を正しく処理する', async () => {
    const mockFormData = createMockFormData({
      username: 'newUsername',
      name: 'New Name',
      birth_year: '1995',
      birth_month: '06',
      birth_day: '15',
      gender: 'female',
      height: '165',
    });

    const result = await profileUpdateAction(
      {} as FormStateWithChange,
      mockFormData,
      mockUserDetail,
      initialDeleteState,
    );

    const apiFormDataCalls = (updateUserProfileAPI as jest.Mock).mock.calls[0][0];
    expect(apiFormDataCalls.get('username')).toBe('newUsername');
    expect(apiFormDataCalls.get('name')).toBe('New Name');
    expect(apiFormDataCalls.get('birth_date')).toBe('1995-06-15');
    expect(apiFormDataCalls.get('gender')).toBe('female');
    expect(apiFormDataCalls.get('height')).toBe('165');
    expect(result.success).toBe(true);
    expect(result.hasChanges).toBe(true);
  });

  it('API エラーを適切に処理する', async () => {
    const mockFormData = createMockFormData({
      username: 'newUsername',
      name: 'New Name',
    });

    const errorMessage = '予期せぬエラーが発生しました';
    (updateUserProfileAPI as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const result = await profileUpdateAction(
      {} as FormStateWithChange,
      mockFormData,
      mockUserDetail,
      initialDeleteState,
    );

    expect(result).toEqual({
      message: errorMessage,
      errors: null,
      success: false,
    });
  });
});
