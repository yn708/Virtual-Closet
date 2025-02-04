import { useCoordinateCanvasState } from '@/context/CoordinateCanvasContext';
import { useCoordinateCanvas } from '@/features/coordinate/hooks/useCoordinateCanvas';
import type { ItemStyle } from '@/features/coordinate/types';
import type { FashionItem } from '@/types';
import { IMAGE_URL } from '@/utils/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import type { ImageProps } from 'next/image';
import CoordinateCanvas from '../CoordinateCanvas';

// モックの設定
jest.mock('@/context/CoordinateCanvasContext');
jest.mock('../../../hooks/useCoordinateCanvas');
jest.mock('next/image', () => {
  const MockNextImage = ({
    src,
    alt,
    className,
    width,
    height,
    draggable,
  }: ImageProps): JSX.Element => {
    return (
      <img
        src={src as string}
        alt={alt}
        className={className}
        width={width}
        height={height}
        draggable={draggable}
      />
    );
  };
  return {
    __esModule: true,
    default: MockNextImage,
  };
});

// モックのアイテムデータ
const mockItem: FashionItem = {
  id: '1',
  image: '/images/test.jpg',
  sub_category: {
    id: 'sub1',
    subcategory_name: 'Tシャツ',
    category: 'トップス',
  },
  brand: {
    id: 'brand1',
    brand_name: 'テストブランド',
    brand_name_kana: 'テストブランド',
  },
  seasons: [{ id: 'season1', season_name: '春' }],
  price_range: {
    id: 'price1',
    price_range: '¥1,000-¥5,000',
  },
  design: {
    id: 'design1',
    design_pattern: 'シンプル',
  },
  main_color: {
    id: 'color1',
    color_name: '黒',
    color_code: '#000000',
  },
  is_owned: true,
  is_old_clothes: false,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockItemStyles: Record<string, ItemStyle> = {
  '1': {
    zIndex: 0,
    scale: 1,
    rotate: 0,
    xPercent: 50,
    yPercent: 50,
  },
};

const mockUseCoordinateCanvasState = useCoordinateCanvasState as jest.MockedFunction<
  typeof useCoordinateCanvasState
>;
const mockUseCoordinateCanvas = useCoordinateCanvas as jest.MockedFunction<
  typeof useCoordinateCanvas
>;

describe('CoordinateCanvas', () => {
  const mockHandleUpdateStyles = jest.fn();
  const mockHandleRemoveItem = jest.fn();
  const mockSetSelectedItemId = jest.fn();
  const mockUpdateZIndex = jest.fn();
  const mockHandleDragStart = jest.fn();
  const mockHandleTransformStart = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // CoordinateCanvasContextのモック
    mockUseCoordinateCanvasState.mockReturnValue({
      state: {
        selectedItems: [mockItem],
        itemStyles: mockItemStyles,
        background: 'bg-white',
      },
      handlers: {
        handleUpdateStyles: mockHandleUpdateStyles,
        handleRemoveItem: mockHandleRemoveItem,
        handleSelectItem: jest.fn(),
        handleFullReset: jest.fn(),
        handleBackgroundChange: jest.fn(),
      },
    });

    // useCoordinateCanvasのモック
    mockUseCoordinateCanvas.mockReturnValue({
      selectedItemId: null,
      isDragging: false,
      handlers: {
        setSelectedItemId: mockSetSelectedItemId,
        updateZIndex: mockUpdateZIndex,
        handleDragStart: mockHandleDragStart,
        handleTransformStart: mockHandleTransformStart,
      },
    });
  });

  it('キャンバスが正しい背景色で表示されること', () => {
    render(<CoordinateCanvas />);
    const canvas = screen.getByTestId('coordinate-canvas');
    expect(canvas).toHaveClass('bg-white');
  });

  it('選択されたアイテムが表示されること', () => {
    render(<CoordinateCanvas />);
    const imageUrl = `${IMAGE_URL}${mockItem.image}`;
    const image = screen.getByAltText('item-image');
    expect(image).toHaveAttribute('src', expect.stringContaining(imageUrl));
  });

  it('アイテムをクリックすると選択状態になること', () => {
    render(<CoordinateCanvas />);
    const draggableElement = screen.getByTestId('draggable-element');
    fireEvent.click(draggableElement);
    expect(mockSetSelectedItemId).toHaveBeenCalledWith(mockItem.id);
    expect(mockUpdateZIndex).toHaveBeenCalledWith(mockItem.id);
  });

  it('選択状態のアイテムに操作UIが表示されること', () => {
    mockUseCoordinateCanvas.mockReturnValue({
      selectedItemId: '1',
      isDragging: false,
      handlers: {
        setSelectedItemId: mockSetSelectedItemId,
        updateZIndex: mockUpdateZIndex,
        handleDragStart: mockHandleDragStart,
        handleTransformStart: mockHandleTransformStart,
      },
    });

    render(<CoordinateCanvas />);
    const deleteButton = screen.getByTestId('delete-button');
    const transformHandle = screen.getByTestId('transform-handle');
    expect(deleteButton).toBeInTheDocument();
    expect(transformHandle).toBeInTheDocument();
  });

  it('削除ボタンをクリックするとアイテムが削除されること', () => {
    mockUseCoordinateCanvas.mockReturnValue({
      selectedItemId: '1',
      isDragging: false,
      handlers: {
        setSelectedItemId: mockSetSelectedItemId,
        updateZIndex: mockUpdateZIndex,
        handleDragStart: mockHandleDragStart,
        handleTransformStart: mockHandleTransformStart,
      },
    });

    render(<CoordinateCanvas />);
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    expect(mockHandleRemoveItem).toHaveBeenCalledWith(mockItem.id);
  });

  it('背景をクリックすると選択が解除されること', () => {
    render(<CoordinateCanvas />);
    const canvas = screen.getByTestId('coordinate-canvas');
    fireEvent.click(canvas);
    expect(mockSetSelectedItemId).toHaveBeenCalledWith(null);
  });

  it('ドラッグ開始時にhandleDragStartが呼ばれること', () => {
    render(<CoordinateCanvas />);
    const draggableElement = screen.getByTestId('draggable-element');
    fireEvent.mouseDown(draggableElement);
    expect(mockHandleDragStart).toHaveBeenCalled();
  });

  it('変形ハンドルのドラッグ開始時にhandleTransformStartが呼ばれること', () => {
    mockUseCoordinateCanvas.mockReturnValue({
      selectedItemId: '1',
      isDragging: false,
      handlers: {
        setSelectedItemId: mockSetSelectedItemId,
        updateZIndex: mockUpdateZIndex,
        handleDragStart: mockHandleDragStart,
        handleTransformStart: mockHandleTransformStart,
      },
    });

    render(<CoordinateCanvas />);
    const transformHandle = screen.getByTestId('transform-handle');
    fireEvent.mouseDown(transformHandle);
    expect(mockHandleTransformStart).toHaveBeenCalled();
  });
});
