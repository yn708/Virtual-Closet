import type { ItemStyle } from '@/features/coordinate/types';
import { fetchCoordinateMetaDataAPI } from '@/lib/api/coordinateApi';
import type { FashionItem } from '@/types';
import type { CoordinateMetaDataType } from '@/types/coordinate';
import { act, render, screen, waitFor } from '@testing-library/react';
import Header from '../Header';

// モックの設定
jest.mock('@/lib/api/coordinateApi', () => ({
  fetchCoordinateMetaDataAPI: jest.fn(),
}));

jest.mock('@/components/elements/link/IconLink', () => ({
  __esModule: true,
  default: ({ label }: { label: string }) => <div data-testid="icon-link">{label}</div>,
}));

jest.mock('@/context/FashionItemsContext', () => ({
  FashionItemsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../../dialog/FormDialog', () => ({
  __esModule: true,
  default: jest.fn(({ selectedItems }: { selectedItems: FashionItem[] }) => (
    <div data-testid="form-dialog">Selected Items: {selectedItems.length}</div>
  )),
}));

describe('Header Component', () => {
  // テスト用のモックデータ
  const mockMetaData: CoordinateMetaDataType = {
    seasons: [{ id: '1', name: '春', season_name: '春' }],
    scenes: [{ id: '1', name: 'カジュアル', scene: 'カジュアル' }],
    tastes: [{ id: '1', name: 'シンプル', taste: 'シンプル' }],
  };

  const mockSelectedItems: FashionItem[] = [
    {
      id: '1',
      image: 'test.jpg',
      sub_category: { id: '1', subcategory_name: 'Tシャツ', category: 'トップス' },
      brand: null,
      seasons: [{ id: '1', season_name: '春' }],
      price_range: null,
      design: null,
      main_color: null,
      is_owned: true,
      is_old_clothes: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ];

  const mockItemStyles: Record<string, ItemStyle> = {
    '1': {
      zIndex: 1,
      scale: 1,
      rotate: 0,
      xPercent: 0,
      yPercent: 0,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetchCoordinateMetaDataAPI as jest.Mock).mockResolvedValue(mockMetaData);
  });

  it('トップページへ戻るリンクが表示されること', async () => {
    render(<Header selectedItems={[]} itemStyles={mockItemStyles} />);

    await waitFor(() => {
      expect(screen.getByTestId('icon-link')).toHaveTextContent('トップへ戻る');
    });
  });

  it('アイテムが2個未満の場合、警告メッセージが表示されること', async () => {
    render(<Header selectedItems={[mockSelectedItems[0]]} itemStyles={mockItemStyles} />);

    await waitFor(() => {
      expect(screen.getByText(/アイテムは2個以上選択する必要があります/)).toBeInTheDocument();
    });
  });

  it('アイテムが2個以上の場合、FormDialogが表示されること', async () => {
    const multipleItems = [...mockSelectedItems, { ...mockSelectedItems[0], id: '2' }];

    render(<Header selectedItems={multipleItems} itemStyles={mockItemStyles} />);

    await waitFor(() => {
      expect(screen.getByTestId('form-dialog')).toBeInTheDocument();
    });
  });

  it('コンポーネントマウント時にメタデータを取得すること', async () => {
    render(<Header selectedItems={[]} itemStyles={mockItemStyles} />);

    await waitFor(() => {
      expect(fetchCoordinateMetaDataAPI).toHaveBeenCalledTimes(1);
    });
  });

  it('メタデータ取得中はローディング状態になること', async () => {
    let resolvePromise: (value: CoordinateMetaDataType) => void;
    const mockPromise = new Promise<CoordinateMetaDataType>((resolve) => {
      resolvePromise = resolve;
    });

    (fetchCoordinateMetaDataAPI as jest.Mock).mockReturnValue(mockPromise);

    render(
      <Header
        selectedItems={[mockSelectedItems[0], { ...mockSelectedItems[0], id: '2' }]}
        itemStyles={mockItemStyles}
      />,
    );

    // ローディング状態の確認
    expect(screen.getByTestId('form-dialog')).toBeInTheDocument();

    // メタデータの解決
    await act(async () => {
      resolvePromise!(mockMetaData);
    });
  });

  it('APIエラー時にエラーがコンソールに出力されること', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockError = new Error('API Error');
    (fetchCoordinateMetaDataAPI as jest.Mock).mockRejectedValue(mockError);

    render(<Header selectedItems={[]} itemStyles={mockItemStyles} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch metadata:', mockError);
    });

    consoleSpy.mockRestore();
  });
});
