import { REFERENCE_HEIGHT, REFERENCE_WIDTH, SNAP_ANGLES, SNAP_THRESHOLD } from '@/utils/constants';
import { act, renderHook } from '@testing-library/react';
import type { ItemStyle } from '../../types';
import { useCoordinateCanvas } from '../useCoordinateCanvas';

describe('useCoordinateCanvas', () => {
  const initialItemStyles: Record<string, ItemStyle> = {
    'item-1': {
      xPercent: 50,
      yPercent: 50,
      scale: 1,
      rotate: 0,
      zIndex: 1,
    },
  };

  const mockOnUpdateStyles = jest.fn();

  const createMockMouseEvent = (
    x: number,
    y: number,
    type: string = 'mousedown',
  ): React.MouseEvent => {
    const mockElement = document.createElement('div');
    mockElement.classList.add('draggable-element');
    jest.spyOn(mockElement, 'getBoundingClientRect').mockImplementation(() => createMockDOMRect());
    jest.spyOn(mockElement, 'closest').mockImplementation(() => mockElement);

    return {
      clientX: x,
      clientY: y,
      button: 0,
      currentTarget: mockElement,
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      type,
    } as unknown as React.MouseEvent;
  };

  const createMockDOMRect = (rect: Partial<DOMRect> = {}): DOMRect => ({
    width: REFERENCE_WIDTH,
    height: REFERENCE_HEIGHT,
    top: 0,
    left: 0,
    right: REFERENCE_WIDTH,
    bottom: REFERENCE_HEIGHT,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    document.body.innerHTML = `
      <div id="container">
        <div class="draggable-element" style="z-index: 1"></div>
      </div>
    `;
  });

  it('初期状態が正しく設定されること', () => {
    const { result } = renderHook(() => useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles));

    expect(result.current.selectedItemId).toBeNull();
    expect(result.current.isDragging).toBeFalsy();
    expect(result.current.handlers).toBeDefined();
    expect(result.current.containerRef).toBeDefined();
  });

  it('アイテム選択が正しく動作すること', () => {
    const { result } = renderHook(() => useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles));

    act(() => {
      result.current.setSelectedItemId('item-1');
    });

    expect(result.current.selectedItemId).toBe('item-1');
  });

  describe('キャンバススケーリング', () => {
    it('リサイズ時にスケーリングが更新されること', () => {
      const { result } = renderHook(() =>
        useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles),
      );

      const container = document.createElement('div');
      Object.defineProperty(container, 'offsetWidth', { value: 800 });
      Object.defineProperty(container, 'offsetHeight', { value: 600 });

      if (result.current.containerRef.current) {
        Object.defineProperty(result.current.containerRef, 'current', {
          value: container,
          writable: true,
        });
      }

      act(() => {
        window.dispatchEvent(new Event('resize'));
      });

      // getDisplayStyleを使って、スケーリングが反映されているか確認
      const style = result.current.handlers.getDisplayStyle(initialItemStyles['item-1']);
      expect(style.width).toBeDefined();
      expect(style.height).toBeDefined();
    });
  });

  describe('ドラッグ操作', () => {
    it('ドラッグ開始時の処理が正しく動作すること', () => {
      const { result } = renderHook(() =>
        useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles),
      );

      // containerRefの設定
      const container = document.createElement('div');
      Object.defineProperty(container, 'getBoundingClientRect', {
        value: () => createMockDOMRect(),
      });
      Object.defineProperty(result.current.containerRef, 'current', {
        value: container,
        writable: true,
      });

      act(() => {
        result.current.handlers.handleDragStart(createMockMouseEvent(100, 100), 'item-1');
      });

      expect(result.current.isDragging).toBeTruthy();
      expect(mockOnUpdateStyles).toHaveBeenCalled();
    });

    it('ドラッグ中の位置制限が正しく機能すること', () => {
      const { result } = renderHook(() =>
        useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles),
      );

      // containerRefの設定
      const container = document.createElement('div');
      Object.defineProperty(container, 'getBoundingClientRect', {
        value: () => createMockDOMRect(),
      });
      Object.defineProperty(result.current.containerRef, 'current', {
        value: container,
        writable: true,
      });

      act(() => {
        result.current.handlers.handleDragStart(createMockMouseEvent(0, 0), 'item-1');
      });

      // モックをリセットして、移動イベントでの更新のみを確認
      mockOnUpdateStyles.mockClear();

      act(() => {
        window.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: -100,
            clientY: -100,
          }),
        );
      });

      expect(mockOnUpdateStyles).toHaveBeenCalled();
      const lastCall = mockOnUpdateStyles.mock.calls[mockOnUpdateStyles.mock.calls.length - 1][0];
      expect(lastCall['item-1'].xPercent).toBeGreaterThanOrEqual(5);
      expect(lastCall['item-1'].yPercent).toBeGreaterThanOrEqual(5);
    });
  });

  describe('変形操作', () => {
    it('回転処理が正しく動作すること', () => {
      const { result } = renderHook(() =>
        useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles),
      );

      const mockElement = document.createElement('div');
      mockElement.classList.add('draggable-element');

      jest.spyOn(mockElement, 'getBoundingClientRect').mockImplementation(() =>
        createMockDOMRect({
          left: 50, // 中心点の計算のために適切な値を設定
          top: 50,
          width: 100,
          height: 100,
        }),
      );
      jest.spyOn(mockElement, 'closest').mockImplementation(() => mockElement);

      const event = createMockMouseEvent(100, 100);
      Object.defineProperty(event, 'currentTarget', {
        value: mockElement,
        writable: true,
      });

      act(() => {
        result.current.handlers.handleTransformStart(event, 'item-1');
      });

      // モックをリセットして、移動イベントでの更新のみを確認
      mockOnUpdateStyles.mockClear();

      act(() => {
        window.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 150, // より小さな移動で90度に近い角度を作る
          }),
        );
      });

      expect(mockOnUpdateStyles).toHaveBeenCalled();
      const lastCall = mockOnUpdateStyles.mock.calls[mockOnUpdateStyles.mock.calls.length - 1][0];
      const rotateAngle = lastCall['item-1'].rotate || 0;
      const nearestSnapDiff = Math.min(
        ...SNAP_ANGLES.map((angle) => Math.abs((((rotateAngle % 360) + 360) % 360) - angle)),
      );
      expect(nearestSnapDiff).toBeLessThanOrEqual(SNAP_THRESHOLD);
    });
  });

  it('z-indexの更新が正しく動作すること', () => {
    const { result } = renderHook(() => useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles));

    act(() => {
      result.current.handlers.updateZIndex('item-1');
    });

    expect(mockOnUpdateStyles).toHaveBeenCalled();
    const lastCall = mockOnUpdateStyles.mock.calls[mockOnUpdateStyles.mock.calls.length - 1][0];
    expect(lastCall['item-1'].zIndex).toBeGreaterThan(initialItemStyles['item-1'].zIndex);
  });
});
