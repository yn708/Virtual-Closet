import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach } from 'node:test';

import type {
  OnResetProps,
  OnSelectItemType,
  SelectBackgroundProps,
  SelectedItemsType,
} from '@/features/coordinate/types';
import type { FashionItem } from '@/types';
import Footer from '../Footer';

// モックアイテムの作成
const createMockFashionItem = (id: string): FashionItem => ({
  id,
  image: `https://example.com/images/${id}.jpg`,
  sub_category: {
    id: 'sub-1',
    subcategory_name: 'Tシャツ',
    category: 'トップス',
  },
  brand: {
    id: 'brand-1',
    brand_name: 'テストブランド',
    brand_name_kana: 'テストブランド',
  },
  seasons: [
    {
      id: 'season-1',
      season_name: '春',
    },
  ],
  price_range: {
    id: 'price-1',
    price_range: '¥1,000-¥2,000',
  },
  design: {
    id: 'design-1',
    design_pattern: 'ソリッド',
  },
  main_color: {
    id: 'color-1',
    color_name: '黒',
    color_code: '#000000',
  },
  is_owned: true,
  is_old_clothes: false,
  created_at: new Date(),
  updated_at: new Date(),
});

// モックコンポーネントの作成
jest.mock('../../dialog/ResetDialog', () => ({
  __esModule: true,
  default: ({ onReset }: OnResetProps) => (
    <button onClick={onReset} data-testid="reset-dialog">
      Reset
    </button>
  ),
}));

jest.mock('../../drawer/SelectBackgroundDrawer', () => ({
  __esModule: true,
  default: ({ onBackgroundChange, background }: SelectBackgroundProps) => (
    <button onClick={() => onBackgroundChange('new-background')} data-testid="background-drawer">
      Background {background}
    </button>
  ),
}));

jest.mock('../../drawer/AddItemsDrawer', () => ({
  __esModule: true,
  default: ({ selectedItems, onSelectItem }: SelectedItemsType & OnSelectItemType) => (
    <button
      onClick={() => onSelectItem(createMockFashionItem('new-item'))}
      data-testid="add-items-drawer"
    >
      Add Items ({selectedItems.length})
    </button>
  ),
}));

jest.mock('@/context/FashionItemsContext', () => ({
  FashionItemsProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="fashion-items-provider">{children}</div>
  ),
}));

describe('Footer', () => {
  // テスト共通のprops
  const defaultProps = {
    selectedItems: [] as FashionItem[],
    onSelectItem: jest.fn(),
    onReset: jest.fn(),
    onBackgroundChange: jest.fn(),
    background: 'default-bg',
  };

  // モックアイテムの配列
  const mockItems: FashionItem[] = [
    createMockFashionItem('item-1'),
    createMockFashionItem('item-2'),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('選択アイテムがない場合、ResetDialogを表示しないこと', () => {
    render(<Footer {...defaultProps} />);

    expect(screen.queryByTestId('reset-dialog')).not.toBeInTheDocument();
    expect(screen.getByTestId('background-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('add-items-drawer')).toBeInTheDocument();
  });

  it('選択アイテムがある場合、すべてのコンポーネントが表示されること', () => {
    const props = {
      ...defaultProps,
      selectedItems: mockItems,
    };

    render(<Footer {...props} />);

    expect(screen.getByTestId('reset-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('background-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('add-items-drawer')).toBeInTheDocument();
  });

  it('リセットボタンクリック時にonResetが呼ばれること', () => {
    const props = {
      ...defaultProps,
      selectedItems: mockItems,
    };

    render(<Footer {...props} />);

    fireEvent.click(screen.getByTestId('reset-dialog'));
    expect(props.onReset).toHaveBeenCalledTimes(1);
  });

  it('背景変更ボタンクリック時にonBackgroundChangeが正しく呼ばれること', () => {
    render(<Footer {...defaultProps} />);

    fireEvent.click(screen.getByTestId('background-drawer'));
    expect(defaultProps.onBackgroundChange).toHaveBeenCalledWith('new-background');
  });

  it('アイテム追加ボタンクリック時にonSelectItemが正しく呼ばれること', () => {
    render(<Footer {...defaultProps} />);

    fireEvent.click(screen.getByTestId('add-items-drawer'));

    expect(defaultProps.onSelectItem).toHaveBeenCalledTimes(1);
    // 呼び出し時の引数の型チェック
    const callArg = (defaultProps.onSelectItem as jest.Mock).mock.calls[0][0];
    expect(callArg).toHaveProperty('id');
    expect(callArg).toHaveProperty('image');
    expect(callArg.sub_category).toHaveProperty('subcategory_name');
  });

  it('FashionItemsProviderでラップされていること', () => {
    render(<Footer {...defaultProps} />);

    expect(screen.getByTestId('fashion-items-provider')).toBeInTheDocument();
  });

  it('背景の値が正しく表示されること', () => {
    const props = {
      ...defaultProps,
      background: 'custom-bg',
    };

    render(<Footer {...props} />);

    expect(screen.getByText(/custom-bg/)).toBeInTheDocument();
  });

  it('選択されたアイテムの数が正しく表示されること', () => {
    const props = {
      ...defaultProps,
      selectedItems: mockItems,
    };

    render(<Footer {...props} />);

    expect(screen.getByText(/\(2\)/)).toBeInTheDocument();
  });
});
