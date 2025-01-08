import type { InitialItems } from '@/features/my-page/coordinate/types';
import { render, screen } from '@testing-library/react';
import CoordinateCanvasPageContent from '../CoordinateCanvasPageContent';

// 必要なコンポーネントのモック
jest.mock('../../navigation/Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header Component</div>;
  };
});

jest.mock('../../navigation/Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer Component</div>;
  };
});

jest.mock('../CoordinateCanvas', () => {
  return function MockCoordinateCanvas() {
    return <div data-testid="coordinate-canvas">Coordinate Canvas</div>;
  };
});

jest.mock('@/context/CoordinateCanvasContext', () => ({
  CoordinateCanvasStateProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas-state-provider">{children}</div>
  ),
}));

describe('CoordinateCanvasPageContent', () => {
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

  const mockOnSuccess = jest.fn();

  const defaultProps = {
    initialItems: mockInitialItems,
    initialData: undefined,
    onSuccess: mockOnSuccess,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('すべての主要コンポーネントが正しく表示されること', () => {
    render(<CoordinateCanvasPageContent {...defaultProps} />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('coordinate-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('CoordinateCanvasStateProviderが正しく設定されること', () => {
    render(<CoordinateCanvasPageContent {...defaultProps} />);

    expect(screen.getByTestId('canvas-state-provider')).toBeInTheDocument();
  });

  it('適切なレイアウトクラスが適用されていること', () => {
    render(<CoordinateCanvasPageContent {...defaultProps} />);

    // メインコンテナのクラスを確認
    const mainContainer = screen.getByTestId('main-container');
    expect(mainContainer).toHaveClass('h-screen');
    expect(mainContainer).toHaveClass('w-full');
    expect(mainContainer).toHaveClass('bg-gray-50');
    expect(mainContainer).toHaveClass('dark:bg-gray-950');

    // 内部コンテナのクラスを確認
    const innerContainer = screen.getByTestId('inner-container');
    expect(innerContainer).toHaveClass('max-w-[65vh]');
    expect(innerContainer).toHaveClass('flex');
    expect(innerContainer).toHaveClass('flex-col');
    expect(innerContainer).toHaveClass('items-center');
    expect(innerContainer).toHaveClass('justify-center');
    expect(innerContainer).toHaveClass('mx-auto');
  });

  it('propsが子コンポーネントに正しく渡されること', () => {
    render(<CoordinateCanvasPageContent {...defaultProps} />);

    expect(screen.getByTestId('canvas-state-provider')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('coordinate-canvas')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });
});
