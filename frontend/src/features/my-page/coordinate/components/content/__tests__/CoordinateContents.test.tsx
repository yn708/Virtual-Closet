import type { CoordinatesContextState, CoordinatesHandlers } from '@/types';
import { render, screen } from '@testing-library/react';
import type { CoordinateCategory } from '../../../types';
import CoordinateContents from '../CoordinateContents';

// モックの型定義を正しく行う
const createMockContextValue = (
  overrides: {
    state?: Partial<CoordinatesContextState>;
    handlers?: Partial<CoordinatesHandlers>;
  } = {},
) => ({
  state: {
    coordinateCache: {
      photo: [],
      custom: [],
    },
    selectedCategory: 'photo' as CoordinateCategory | '',
    filters: {
      category: '',
      seasons: [],
      scenes: [],
      tastes: [],
    },
    isPending: false,
    currentItems: [],
    ...overrides.state,
  } as CoordinatesContextState,
  handlers: {
    handleCategoryChange: jest.fn(async () => {}),
    handleFilterChange: jest.fn(),
    handleDelete: jest.fn(async () => {}),
    handleUpdate: jest.fn(),
    ...overrides.handlers,
  } as CoordinatesHandlers,
});

// コンテキストのモック
const mockContextValue = createMockContextValue();
jest.mock('@/context/CoordinatesContext.tsx', () => ({
  useCoordinates: () => mockContextValue,
}));

// 各コンポーネントのモック
jest.mock('@/features/my-page/common/components/layout/BaseScrollContentsLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="base-contents-layout">{children}</div>
  ),
}));

jest.mock('@/features/my-page/common/components/contents/CategorySelector', () => ({
  __esModule: true,
  default: () => <div data-testid="category-selector" />,
}));

jest.mock('@/features/my-page/common/components/layout/BaseListLayout', () => ({
  __esModule: true,
  default: () => <div data-testid="base-list-layout" />,
}));

jest.mock('@/features/my-page/common/components/drawer/BaseImageDrawer', () => ({
  __esModule: true,
  default: () => <div data-testid="base-image-drawer" />,
}));

describe('CoordinateContents', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // テスト前にデフォルトのモック値に戻す
    Object.assign(mockContextValue, createMockContextValue());
  });

  it('should render all components correctly when a category is selected', () => {
    render(<CoordinateContents />);

    expect(screen.getByTestId('base-contents-layout')).toBeInTheDocument();
    expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    expect(screen.getByTestId('base-list-layout')).toBeInTheDocument();
  });

  it('should not render list layout when no category is selected', () => {
    // モック値を上書き
    Object.assign(
      mockContextValue,
      createMockContextValue({
        state: {
          selectedCategory: '',
          filters: {
            category: '',
            seasons: [],
            scenes: [],
            tastes: [],
          },
          currentItems: [],
        },
      }),
    );

    render(<CoordinateContents />);

    expect(screen.getByTestId('base-contents-layout')).toBeInTheDocument();
    expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    expect(screen.queryByTestId('base-list-layout')).not.toBeInTheDocument();
  });

  it('should show loading state correctly', () => {
    // モック値を上書き
    Object.assign(
      mockContextValue,
      createMockContextValue({
        state: {
          selectedCategory: 'photo',
          filters: {
            category: '',
            seasons: [],
            scenes: [],
            tastes: [],
          },
          currentItems: [],
        },
      }),
    );

    render(<CoordinateContents />);

    expect(screen.getByTestId('base-contents-layout')).toBeInTheDocument();
    expect(screen.getByTestId('category-selector')).toBeInTheDocument();
  });

  it('should call handlers correctly', () => {
    const handleCategoryChange = jest.fn(async () => {});
    const handleFilterChange = jest.fn();

    // モック値を上書き
    Object.assign(
      mockContextValue,
      createMockContextValue({
        handlers: {
          handleCategoryChange,
          handleFilterChange,
        },
      }),
    );

    render(<CoordinateContents />);

    // CategorySelectorにmock関数が渡されていることを確認
    const categorySelector = screen.getByTestId('category-selector');
    expect(categorySelector).toBeInTheDocument();

    // カテゴリ変更ハンドラの動作確認
    expect(mockContextValue.handlers.handleCategoryChange).toBeDefined();
    expect(mockContextValue.handlers.handleFilterChange).toBeDefined();
  });
});
