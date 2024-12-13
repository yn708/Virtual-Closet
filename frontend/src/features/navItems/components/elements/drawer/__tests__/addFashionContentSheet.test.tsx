import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import React from 'react';
import AddFashionContentDrawer from '../AddFashionContentDrawer';

// IconButtonのモック
jest.mock('@/components/elements/button/IconButton', () => {
  return React.forwardRef(function MockIconButton(
    {
      label,
      className,
      onClick,
    }: {
      label: string;
      className?: string;
      onClick?: () => void;
    },
    ref: React.ForwardedRef<HTMLButtonElement>,
  ) {
    return (
      <button
        ref={ref}
        data-testid="add-button"
        className={className}
        onClick={onClick}
        type="button"
      >
        {label}
      </button>
    );
  });
});

// セクションコンポーネントのモック
jest.mock('../../section/AddItemSection', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="add-item-section">
      <button onClick={onClose}>Close Add Item</button>
    </div>
  ),
}));

jest.mock('../../section/CreateOutfitSection', () => ({
  __esModule: true,
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="create-outfit-section">
      <button onClick={onClose}>Close Create Outfit</button>
    </div>
  ),
}));

// Drawerコンポーネントのモック
type DrawerProps = {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

type DrawerContentProps = {
  children: ReactNode;
  className?: string;
};

type DrawerCloseProps = {
  children: ReactNode;
  asChild?: boolean;
};

jest.mock('@/components/ui/drawer', () => ({
  Drawer: ({ children, open, onOpenChange }: DrawerProps) => (
    <div data-testid="drawer" data-open={open} onClick={() => onOpenChange?.(!open)}>
      {children}
    </div>
  ),
  DrawerTrigger: ({ children }: { children: ReactNode }) => (
    <div
      data-testid="drawer-trigger"
      onClick={(e) => {
        // イベントの伝播を確実に
        e.currentTarget.parentElement?.click();
      }}
    >
      {children}
    </div>
  ),
  DrawerContent: ({ children, className }: DrawerContentProps) => (
    <div data-testid="drawer-content" className={className}>
      {children}
    </div>
  ),
  DrawerHeader: ({ children, className }: DrawerContentProps) => (
    <div data-testid="drawer-header" className={className}>
      {children}
    </div>
  ),
  DrawerTitle: () => <div data-testid="drawer-title" />,
  DrawerDescription: () => <div data-testid="drawer-description" />,
  DrawerFooter: ({ children }: { children: ReactNode }) => (
    <div data-testid="drawer-footer">{children}</div>
  ),
  DrawerClose: ({ children, asChild }: DrawerCloseProps) => (
    <div data-testid="drawer-close" data-aschild={asChild}>
      {children}
    </div>
  ),
}));

// Accordionコンポーネントのモック
jest.mock('@/components/ui/accordion', () => ({
  Accordion: ({ children }: { children: ReactNode }) => (
    <div data-testid="accordion">{children}</div>
  ),
}));

// useIsOpenフックのモック
jest.mock('@/hooks/utils/useIsOpen', () => {
  const mock = {
    isOpen: false,
    onClose: jest.fn(),
    onToggle: jest.fn(),
  };
  return {
    mockReturnValue: mock,
    useIsOpen: () => mock,
  };
});

describe('AddFashionContentDrawer', () => {
  const useIsOpenMock = jest.requireMock('@/hooks/utils/useIsOpen');
  const mockUseIsOpen = useIsOpenMock.mockReturnValue;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsOpen.isOpen = false;
  });

  describe('描画のテスト', () => {
    it('Drawerコンポーネントが正しく描画される', () => {
      render(<AddFashionContentDrawer />);
      expect(screen.getByTestId('drawer')).toBeInTheDocument();
      expect(screen.getByTestId('drawer')).toHaveAttribute('data-open', 'false');
    });

    it('追加ボタンが正しく描画される', () => {
      render(<AddFashionContentDrawer />);
      const addButton = screen.getByTestId('add-button');
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveTextContent('Add');
    });

    it('Drawerが開いているときにコンテンツが正しく描画される', () => {
      mockUseIsOpen.isOpen = true;
      render(<AddFashionContentDrawer />);

      expect(screen.getByTestId('drawer-content')).toHaveClass('h-[60vh]');
      expect(screen.getByTestId('accordion')).toBeInTheDocument();
      expect(screen.getByTestId('add-item-section')).toBeInTheDocument();
      expect(screen.getByTestId('create-outfit-section')).toBeInTheDocument();
      expect(screen.getByText('閉じる')).toBeInTheDocument();
    });

    it('Headerセクションがhiddenクラスを持つ', () => {
      render(<AddFashionContentDrawer />);
      expect(screen.getByTestId('drawer-header')).toHaveClass('hidden');
    });
  });
});
