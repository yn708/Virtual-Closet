import { IMAGE_URL } from '@/utils/constants';
import { act, renderHook } from '@testing-library/react';
import { useProfileImage } from '../useProfileImage';

// コンテキストと依存フックのモック
const clearImageMock = jest.fn();
jest.mock('@/context/ImageContext', () => ({
  useImage: () => ({
    preview: null,
    clearImage: clearImageMock,
  }),
}));

describe('useProfileImage', () => {
  const mockProps = {
    profileImage: '/test.jpg',
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('マウント時に clearImage が呼ばれる（初期化処理の確認）', () => {
    renderHook(() => useProfileImage(mockProps));
    expect(clearImageMock).toHaveBeenCalledTimes(1);
  });

  it('初期状態の確認', () => {
    const { result } = renderHook(() => useProfileImage(mockProps));

    // 初期値は profileImage がセットされている
    expect(result.current.defaultProfileImage).toBe(mockProps.profileImage);
    // preview が null のため、currentPreviewImage は IMAGE_URL + profileImage となる
    expect(result.current.currentPreviewImage).toBe(`${IMAGE_URL}${mockProps.profileImage}`);
    expect(result.current.preview).toBeNull();
  });

  it('handleDelete の実行', () => {
    const { result } = renderHook(() => useProfileImage(mockProps));

    act(() => {
      result.current.handleDelete();
    });

    // handleDelete 実行後、defaultProfileImage が undefined になる
    expect(result.current.defaultProfileImage).toBeUndefined();
    // onDelete コールバックが呼ばれることを確認
    expect(mockProps.onDelete).toHaveBeenCalled();
    // handleDelete 内で clearImage も呼ばれているはず
    expect(clearImageMock).toHaveBeenCalledTimes(2); // マウント時の1回 + handleDelete の1回
  });

  it('handleClear の実行', () => {
    const { result } = renderHook(() => useProfileImage(mockProps));

    // まずは handleDelete で状態を undefined に変更
    act(() => {
      result.current.handleDelete();
    });
    expect(result.current.defaultProfileImage).toBeUndefined();

    // handleClear で profileImage に戻す
    act(() => {
      result.current.handleClear();
    });
    expect(result.current.defaultProfileImage).toBe(mockProps.profileImage);
  });
});
