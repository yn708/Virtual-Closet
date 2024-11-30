import { useImage } from '@/context/ImageContext';
import { useToast } from '@/hooks/use-toast';
import { profileUpdateAction } from '@/lib/actions/user/profileUpdateAction';
import { renderHook } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { useProfileForm } from '../useProfileForm';

// モックの作成
jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(),
}));

jest.mock('@/lib/actions/user/profileUpdateAction', () => ({
  profileUpdateAction: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  useFormState: jest.fn((fn) => [
    { success: false, hasChanges: false, errors: {}, message: '' },
    async (formData: FormData) =>
      fn({ success: false, hasChanges: false, errors: {}, message: '' }, formData),
  ]),
}));

describe('useProfileForm', () => {
  // モックの準備
  const mockClearImage = jest.fn();
  const mockToast = jest.fn();
  const mockRefresh = jest.fn();
  const mockOnSuccess = jest.fn();

  const mockUserDetail = {
    id: '1',
    name: 'Test User',
    image: 'test.jpg',
    birthDate: '1990-01-01',
  };

  beforeEach(() => {
    // モックの設定
    (useImage as jest.Mock).mockReturnValue({ clearImage: mockClearImage });
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    (useRouter as jest.Mock).mockReturnValue({ refresh: mockRefresh });
    (profileUpdateAction as jest.Mock).mockResolvedValue({
      success: true,
      hasChanges: true,
      message: '更新しました',
    });

    // モックのリセット
    jest.clearAllMocks();
  });

  it('成功時にトーストとリフレッシュが呼ばれる', async () => {
    const { result } = renderHook(() => useProfileForm(mockUserDetail, mockOnSuccess));
    const mockFormData = new FormData();

    await result.current.formAction(mockFormData);

    expect(mockToast).toHaveBeenCalledWith({
      title: '更新しました',
      duration: 3000,
    });
    expect(mockClearImage).toHaveBeenCalled();
    expect(mockRefresh).toHaveBeenCalled();
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it('変更がない場合は画像クリアとリフレッシュが呼ばれない', async () => {
    (profileUpdateAction as jest.Mock).mockResolvedValue({
      success: true,
      hasChanges: false,
      message: '変更はありません',
    });

    const { result } = renderHook(() => useProfileForm(mockUserDetail));
    const mockFormData = new FormData();

    await result.current.formAction(mockFormData);

    expect(mockToast).toHaveBeenCalledWith({
      title: '変更はありません',
      duration: 3000,
    });
    expect(mockClearImage).not.toHaveBeenCalled();
    expect(mockRefresh).not.toHaveBeenCalled();
  });
});
