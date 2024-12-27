import { SNAP_ANGLES, SNAP_THRESHOLD } from '@/utils/constants';
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
    return {
      clientX: x,
      clientY: y,
      button: 0,
      currentTarget: document.createElement('div'),
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      type,
    } as unknown as React.MouseEvent;
  };

  // DOMRect用のモックオブジェクト
  const createMockDOMRect = (rect: Partial<DOMRect> = {}): DOMRect => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    right: 100,
    bottom: 100,
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
  });

  it('アイテム選択が正しく動作すること', () => {
    const { result } = renderHook(() => useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles));

    act(() => {
      result.current.handlers.setSelectedItemId('item-1');
    });

    expect(result.current.selectedItemId).toBe('item-1');
  });

  describe('ドラッグ操作', () => {
    let containerRef: React.RefObject<HTMLDivElement>;

    beforeEach(() => {
      const container = document.createElement('div');
      jest.spyOn(container, 'getBoundingClientRect').mockImplementation(() =>
        createMockDOMRect({
          width: 1000,
          height: 1000,
          right: 1000,
          bottom: 1000,
        }),
      );
      containerRef = { current: container };
    });

    it('ドラッグ開始時の処理が正しく動作すること', () => {
      const { result } = renderHook(() =>
        useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles),
      );

      act(() => {
        result.current.handlers.handleDragStart(
          createMockMouseEvent(100, 100),
          'item-1',
          containerRef,
        );
      });

      expect(result.current.isDragging).toBeTruthy();
      expect(mockOnUpdateStyles).toHaveBeenCalled();
    });

    it('ドラッグ中の位置制限が正しく機能すること', () => {
      const { result } = renderHook(() =>
        useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles),
      );

      act(() => {
        result.current.handlers.handleDragStart(createMockMouseEvent(0, 0), 'item-1', containerRef);
      });

      act(() => {
        window.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: -100,
            clientY: -100,
          }),
        );
      });

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

      jest
        .spyOn(mockElement, 'getBoundingClientRect')
        .mockImplementation(() => createMockDOMRect());
      jest.spyOn(mockElement, 'closest').mockImplementation(() => mockElement);

      const event = createMockMouseEvent(50, 50);
      Object.defineProperty(event, 'currentTarget', {
        value: mockElement,
        writable: true,
      });

      act(() => {
        result.current.handlers.handleTransformStart(event, 'item-1');
      });

      act(() => {
        window.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 50,
          }),
        );
      });

      const lastCall = mockOnUpdateStyles.mock.calls[mockOnUpdateStyles.mock.calls.length - 1][0];
      const rotateAngle = lastCall['item-1'].rotate || 0;
      const nearestSnapDiff = Math.min(
        ...SNAP_ANGLES.map((angle) => Math.abs((((rotateAngle % 360) + 360) % 360) - angle)),
      );
      expect(nearestSnapDiff).toBeLessThanOrEqual(SNAP_THRESHOLD);
    });

    it('スケーリングが正しく動作すること', () => {
      const { result } = renderHook(() =>
        useCoordinateCanvas(initialItemStyles, mockOnUpdateStyles),
      );

      const mockElement = document.createElement('div');
      mockElement.classList.add('draggable-element');

      jest
        .spyOn(mockElement, 'getBoundingClientRect')
        .mockImplementation(() => createMockDOMRect());
      jest.spyOn(mockElement, 'closest').mockImplementation(() => mockElement);

      const event = createMockMouseEvent(50, 50);
      Object.defineProperty(event, 'currentTarget', {
        value: mockElement,
      });

      act(() => {
        result.current.handlers.handleTransformStart(event, 'item-1');
      });

      act(() => {
        window.dispatchEvent(
          new MouseEvent('mousemove', {
            clientX: 150,
            clientY: 150,
          }),
        );
      });

      const lastCall = mockOnUpdateStyles.mock.calls[mockOnUpdateStyles.mock.calls.length - 1][0];
      expect(lastCall['item-1'].scale).toBeGreaterThan(1);
      expect(lastCall['item-1'].scale).toBeLessThanOrEqual(2);
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
