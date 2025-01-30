import { useIsOpen } from '@/hooks/utils/useIsOpen';
import {
  fetchCoordinateMetaDataAPI,
  fetchCustomCoordinateInitialDataAPI,
} from '@/lib/api/coordinateApi';
import { fetchFashionMetaDataAPI } from '@/lib/api/fashionItemsApi';
import type { FashionItem } from '@/types';
import type { BaseCoordinate } from '@/types/coordinate';
import { render, screen, waitFor } from '@testing-library/react';
import EditItemDialog from '../EditItemDialog';

// グローバルなモックの設定
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: { user: { name: 'Test User' } },
    status: 'authenticated',
  })),
}));

// APIモックの設定
jest.mock('@/lib/api/coordinateApi', () => ({
  fetchCoordinateMetaDataAPI: jest.fn(),
  fetchCustomCoordinateInitialDataAPI: jest.fn(),
}));

jest.mock('@/lib/api/fashionItemsApi', () => ({
  fetchFashionMetaDataAPI: jest.fn(),
}));

// フックのモック
jest.mock('@/hooks/utils/useIsOpen');

// UIコンポーネントのモック
jest.mock('@/components/elements/button/IconButton', () => {
  return jest.fn(({ onClick, children }) => (
    <button data-testid="edit-button" onClick={onClick}>
      {children}
    </button>
  ));
});

jest.mock('@/components/elements/dialog/BaseDialog', () => {
  return jest.fn(({ children, isOpen, trigger }) => (
    <div data-testid="base-dialog">
      {trigger}
      {isOpen && children}
    </div>
  ));
});

// フォームコンポーネントのモック
jest.mock('@/features/fashion-items/components/form/ItemEditorForm', () => {
  return jest.fn(() => <div data-testid="item-editor-form">ItemEditorForm</div>);
});

jest.mock('@/features/coordinate/components/form/CoordinateEditorForm', () => {
  return jest.fn(() => <div data-testid="coordinate-editor-form">CoordinateEditorForm</div>);
});

jest.mock('@/features/coordinate/components/contents/CoordinateCanvasPageContent', () => {
  return jest.fn(() => <div data-testid="coordinate-canvas">CoordinateCanvasPageContent</div>);
});

describe('EditItemDialog', () => {
  // テスト用のモックデータ
  const mockFashionItem: FashionItem = {
    id: '1',
    image: 'test.jpg',
    sub_category: { id: '1', subcategory_name: 'Test Sub', category: 'Test' },
    brand: { id: '1', brand_name: 'Test Brand', brand_name_kana: 'テストブランド' },
    seasons: [{ id: '1', season_name: 'Summer' }],
    price_range: { id: '1', price_range: '1000-2000' },
    design: { id: '1', design_pattern: 'Solid' },
    main_color: { id: '1', color_name: 'Black', color_code: '#000000' },
    is_owned: true,
    is_old_clothes: false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockCoordinate: BaseCoordinate = {
    id: '1',
    image: 'test.jpg',
    seasons: [{ id: '1', season_name: 'Summer' }],
    scenes: [{ id: '1', scene: 'Casual' }],
    tastes: [{ id: '1', taste: 'Simple' }],
  };

  const mockMetaData = {
    categories: [],
    seasons: [],
    designs: [],
    colors: [],
    price_ranges: [],
    popular_brands: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // デフォルトのモック実装
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: false,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    // API モックの実装
    (fetchFashionMetaDataAPI as jest.Mock).mockResolvedValue(mockMetaData);
    (fetchCoordinateMetaDataAPI as jest.Mock).mockResolvedValue({
      seasons: [],
      scenes: [],
      tastes: [],
    });
    (fetchCustomCoordinateInitialDataAPI as jest.Mock).mockResolvedValue({
      items: [],
      background: 'white',
    });
  });

  it('ファッションアイテム編集モードでレンダリングされること', () => {
    render(<EditItemDialog type="fashion-item" item={mockFashionItem} onUpdate={jest.fn()} />);

    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('base-dialog')).toBeInTheDocument();
  });

  it('写真コーディネート編集モードでレンダリングされること', () => {
    render(
      <EditItemDialog
        type="coordinate"
        item={mockCoordinate}
        category="photo"
        onUpdate={jest.fn()}
      />,
    );

    expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    expect(screen.getByTestId('base-dialog')).toBeInTheDocument();
  });

  it('データ取得中にローディング表示がされること', async () => {
    // API呼び出しを遅延させる
    (fetchFashionMetaDataAPI as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockMetaData), 100)),
    );

    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: true,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(<EditItemDialog type="fashion-item" item={mockFashionItem} onUpdate={jest.fn()} />);

    expect(screen.getByText('データを取得中...')).toBeInTheDocument();
  });

  it('APIエラーが適切に処理されること', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (fetchFashionMetaDataAPI as jest.Mock).mockRejectedValue(new Error('API Error'));

    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: true,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(<EditItemDialog type="fashion-item" item={mockFashionItem} onUpdate={jest.fn()} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch metadata:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('カスタムコーディネートモードで初期データを取得すること', async () => {
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: true,
      onClose: jest.fn(),
      onToggle: jest.fn(),
    });

    render(
      <EditItemDialog
        type="coordinate"
        item={mockCoordinate}
        category="custom"
        onUpdate={jest.fn()}
      />,
    );

    await waitFor(() => {
      expect(fetchCustomCoordinateInitialDataAPI).toHaveBeenCalledWith(mockCoordinate.id);
    });
  });
});
