import type { InitialItems } from '@/features/my-page/coordinate/types';
import { generatePreviewImage } from '@/utils/imageUtils';
import { act, renderHook } from '@testing-library/react';
import type { CoordinateEditTypes, ItemStyle } from '../../types';
import { usePreviewGeneration } from '../usePreviewGeneration';

// モックの設定
jest.mock('@/utils/imageUtils', () => ({
  generatePreviewImage: jest.fn(),
}));

describe('usePreviewGeneration', () => {
  // テスト用のモックデータ
  const mockItemsData = {
    items: [
      {
        item: '1',
        position_data: {
          zIndex: 1,
          scale: 1,
          rotate: 0,
          xPercent: 0,
          yPercent: 0,
        } as ItemStyle,
      },
    ],
    background: 'white',
  };

  const mockInitialItems: InitialItems = {
    items: [
      {
        item_id: '1',
        image: 'test.jpg',
        position_data: {
          zIndex: 1,
          scale: 1,
          rotate: 0,
          xPercent: 0,
          yPercent: 0,
        },
      },
    ],
    background: 'white',
  };

  const mockInitialData: CoordinateEditTypes['initialData'] = {
    id: '1',
    image: 'test.jpg',
    seasons: [{ id: '1', season_name: 'summer' }],
    scenes: [{ id: '1', scene: 'casual' }],
    tastes: [{ id: '1', taste: 'modern' }],
  };

  // DOM要素のモック
  beforeEach(() => {
    // Canvas要素のモック
    document.body.innerHTML = `
      <div class="coordinate-canvas"></div>
      <input type="file" />
    `;
    jest.clearAllMocks();
    // generatePreviewImageのモックをリセット
    (generatePreviewImage as jest.Mock).mockResolvedValue(undefined);
  });

  it('初期レンダリング時の状態遷移が正しいこと', async () => {
    const { result } = renderHook(() => usePreviewGeneration(mockItemsData));

    // 初期レンダリング時はプレビュー生成が始まるためisProcessingはtrue
    expect(result.current.isProcessing).toBe(true);

    // プレビュー生成の完了を待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // プレビュー生成完了後はisProcessingがfalseになる
    expect(result.current.isProcessing).toBe(false);
  });

  it('itemsDataが変更された時にプレビュー生成が実行されること', async () => {
    const { rerender } = renderHook(
      ({ itemsData }) => usePreviewGeneration(itemsData, mockInitialItems, mockInitialData),
      {
        initialProps: { itemsData: mockItemsData },
      },
    );

    // 初期レンダリングの処理を待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    // generatePreviewImageのモックをリセット
    (generatePreviewImage as jest.Mock).mockClear();

    // itemsDataを変更
    const updatedItemsData = {
      ...mockItemsData,
      items: [
        {
          ...mockItemsData.items[0],
          position_data: {
            ...mockItemsData.items[0].position_data,
            scale: 2,
          },
        },
      ],
    };

    await act(async () => {
      rerender({ itemsData: updatedItemsData });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(generatePreviewImage).toHaveBeenCalled();
  });

  it('変更がない場合、プレビュー生成が実行されないこと', async () => {
    (generatePreviewImage as jest.Mock).mockClear();

    renderHook(() => usePreviewGeneration(mockItemsData, mockInitialItems, mockInitialData));

    // 初期レンダリングの処理を待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(generatePreviewImage).not.toHaveBeenCalled();
  });

  it('初期画像がある場合、file inputがクリアされること', async () => {
    renderHook(() => usePreviewGeneration(mockItemsData, mockInitialItems, mockInitialData));

    // 初期レンダリングの処理を待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(fileInput.value).toBe('');
  });

  it('エラーが発生した場合でもisProcessingがfalseに戻ること', async () => {
    (generatePreviewImage as jest.Mock).mockRejectedValueOnce(new Error('Generate preview failed'));
    console.error = jest.fn(); // エラーログのモック

    const { result } = renderHook(() =>
      usePreviewGeneration(
        { ...mockItemsData, background: 'black' },
        mockInitialItems,
        mockInitialData,
      ),
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.isProcessing).toBe(false);
    expect(console.error).toHaveBeenCalledWith('Failed to generate preview:', expect.any(Error));
  });

  it('背景が変更された時に変更フラグが更新されること', async () => {
    const { rerender } = renderHook(
      ({ itemsData }) => usePreviewGeneration(itemsData, mockInitialItems),
      {
        initialProps: { itemsData: mockItemsData },
      },
    );

    // 初期レンダリングの処理を待つ
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    (generatePreviewImage as jest.Mock).mockClear();

    const updatedItemsData = {
      ...mockItemsData,
      background: 'black',
    };

    await act(async () => {
      rerender({ itemsData: updatedItemsData });
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(generatePreviewImage).toHaveBeenCalled();
  });
});
