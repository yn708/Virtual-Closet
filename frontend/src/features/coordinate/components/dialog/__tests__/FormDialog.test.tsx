import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import type { InitialItems } from '@/features/my-page/coordinate/types';
import type { BaseCoordinate, CoordinateMetaDataType } from '@/types/coordinate';
import { render, screen } from '@testing-library/react';
import FormDialog from '../FormDialog';

// モックの設定
jest.mock('@/context/CoordinateCanvasContext');
jest.mock('@/components/elements/loading/LoadingElements', () => {
  return function MockLoadingElements({ message }: { message: string }) {
    return <div data-testid="loading-elements">{message}</div>;
  };
});
jest.mock('@/components/elements/dialog/BaseDialog', () => {
  return function MockBaseDialog({
    children,
    trigger,
  }: {
    children: React.ReactNode;
    trigger: React.ReactNode;
  }) {
    return (
      <div data-testid="base-dialog">
        {trigger}
        {children}
      </div>
    );
  };
});
jest.mock('../../form/CustomCoordinateEditorForm', () => {
  return function MockCustomCoordinateEditorForm() {
    return <div data-testid="coordinate-editor-form">Custom Coordinate Editor Form</div>;
  };
});

const mockUseCoordinateCanvasState = useCoordinateCanvasState as jest.MockedFunction<
  typeof useCoordinateCanvasState
>;

describe('FormDialog', () => {
  // モックメタデータの作成
  const mockMetaData: CoordinateMetaDataType = {
    seasons: [{ id: '1', name: '春', season_name: '春' }],
    scenes: [{ id: '1', name: 'カジュアル', scene: 'カジュアル' }],
    tastes: [{ id: '1', name: 'シンプル', taste: 'シンプル' }],
  };

  // モック初期アイテムの作成
  const mockInitialItems: InitialItems = {
    items: [
      {
        item_id: '1',
        image: 'test.jpg',
        position_data: {
          scale: 1,
          rotate: 0,
          zIndex: 1,
          xPercent: 0,
          yPercent: 0,
        },
      },
    ],
    background: 'bg-white',
  };

  const mockProps = {
    metaData: mockMetaData,
    isLoading: false,
    initialItems: mockInitialItems,
    onSuccess: jest.fn((_item: BaseCoordinate) => Promise.resolve()),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCoordinateCanvasState.mockReturnValue({
      state: {
        selectedItems: [],
        itemStyles: {},
        background: '',
      },
      handlers: {
        handleSelectItem: jest.fn(),
        handleRemoveItem: jest.fn(),
        handleUpdateStyles: jest.fn(),
        handleFullReset: jest.fn(),
        handleBackgroundChange: jest.fn(),
      },
    });
  });

  it('ローディング中の場合、LoadingElementsが表示されること', () => {
    render(<FormDialog {...mockProps} isLoading={true} metaData={null} />);

    expect(screen.getByTestId('loading-elements')).toBeInTheDocument();
    expect(screen.getByText('データ取得中...')).toBeInTheDocument();
  });

  it('メタデータとselectedItemsがある場合、CustomCoordinateEditorFormが表示されること', () => {
    mockUseCoordinateCanvasState.mockReturnValue({
      state: {
        selectedItems: [
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
        ],
        itemStyles: {},
        background: '',
      },
      handlers: {
        handleSelectItem: jest.fn(),
        handleRemoveItem: jest.fn(),
        handleUpdateStyles: jest.fn(),
        handleFullReset: jest.fn(),
        handleBackgroundChange: jest.fn(),
      },
    });

    render(<FormDialog {...mockProps} />);

    expect(screen.getByTestId('coordinate-editor-form')).toBeInTheDocument();
  });

  it('BaseDialogのtriggerとして"次へ"ボタンが表示されること', () => {
    render(<FormDialog {...mockProps} />);

    expect(screen.getByRole('button')).toHaveTextContent('次へ');
  });

  it('メタデータがnullの場合、CustomCoordinateEditorFormが表示されないこと', () => {
    render(<FormDialog {...mockProps} metaData={null} initialItems={mockInitialItems} />);

    expect(screen.queryByTestId('coordinate-editor-form')).not.toBeInTheDocument();
  });
});
