import { useIsOpen } from '@/hooks/utils/useIsOpen';
import type { FashionItem } from '@/types';
import type { BaseCoordinate } from '@/types/coordinate';
import { IMAGE_URL } from '@/utils/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import BaseImageDrawer from '../BaseImageDrawer';

// Button型の定義
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  className?: string;
}

// モックの設定
jest.mock('@/hooks/utils/useIsOpen');

// ItemImageコンポーネントのモック
jest.mock('@/features/my-page/common/components/image/ItemImage', () => {
  return function MockItemImage({ src }: { src: string }) {
    return (
      <div data-testid="item-image-container">
        <img data-testid="item-image" src={src} alt="item" />
      </div>
    );
  };
});

// shadcn/uiのDrawerコンポーネントのモック
jest.mock('@/components/ui/drawer', () => ({
  Drawer: ({
    children,
    open,
    onOpenChange: _,
  }: {
    children: React.ReactNode;
    open: boolean;
    onOpenChange?: (open: boolean) => void;
  }) => (
    <div data-testid="drawer" data-open={open}>
      {children}
    </div>
  ),
  DrawerTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="drawer-trigger">{children}</div>
  ),
  DrawerContent: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="drawer-content" className={className}>
      {children}
    </div>
  ),
  DrawerHeader: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="drawer-header" className={className}>
      {children}
    </div>
  ),
  DrawerTitle: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="drawer-title" className={className}>
      {children}
    </div>
  ),
  DrawerDescription: () => <div data-testid="drawer-description" />,
  DrawerFooter: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="drawer-footer" className={className}>
      {children}
    </div>
  ),
  DrawerClose: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
    if (asChild) {
      return React.cloneElement(children as React.ReactElement, {
        'data-testid': 'drawer-close-button',
        onClick: (e: React.MouseEvent) => {
          e.preventDefault();
          const originalOnClick = (children as React.ReactElement).props.onClick;
          if (originalOnClick) {
            originalOnClick(e);
          }
        },
      });
    }
    return <button data-testid="drawer-close-default">{children}</button>;
  },
}));

// 子コンポーネントのモック
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, variant, onClick }: ButtonProps) => (
    <button
      type="button"
      data-testid="drawer-close-button"
      className={className}
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  ),
}));

// ダイアログコンポーネントのモック
jest.mock('@/features/my-page/common/components/dialog/EditItemDialog', () => {
  return function MockEditItemDialog({
    onUpdate,
  }: {
    onUpdate: (item: FashionItem | BaseCoordinate) => void;
  }) {
    return (
      <button data-testid="edit-item-dialog" onClick={() => onUpdate({ id: '1' } as FashionItem)}>
        Edit
      </button>
    );
  };
});

jest.mock('@/features/my-page/common/components/dialog/DeleteItemDialog', () => {
  return function MockDeleteItemDialog({ onDelete }: { onDelete: () => void }) {
    return (
      <button data-testid="delete-item-dialog" onClick={onDelete}>
        Delete
      </button>
    );
  };
});

describe('BaseImageDrawer', () => {
  const onToggleMock = jest.fn();
  const onCloseMock = jest.fn();

  // モックアイテムデータ
  const mockFashionItem: FashionItem = {
    id: '1',
    image: '/images/test.jpg',
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

  // モックDetailInfoComponent
  const MockDetailInfo: React.FC<{ item: FashionItem | BaseCoordinate }> = ({ item }) => (
    <div data-testid="detail-info">{item.id}</div>
  );

  const defaultProps = {
    item: mockFashionItem,
    type: 'fashion-item' as const,
    onDelete: jest.fn(),
    onUpdate: jest.fn(),
    DetailInfoComponent: MockDetailInfo,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    onToggleMock.mockClear();
    onCloseMock.mockClear();
  });

  it('デフォルトトリガーで正しくレンダリングされること', () => {
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: false,
      onClose: onCloseMock,
      onToggle: onToggleMock,
    });

    render(<BaseImageDrawer {...defaultProps} />);

    const expectedImageUrl = `${IMAGE_URL}${mockFashionItem.image}`;
    const triggerImage = screen.getAllByTestId('item-image')[0];
    expect(triggerImage).toHaveAttribute('src', expectedImageUrl);
  });

  it('カスタムトリガーで正しくレンダリングされること', () => {
    const customTrigger = (imageUrl: string) => (
      <div data-testid="custom-trigger" data-url={imageUrl}>
        Custom Trigger
      </div>
    );

    render(<BaseImageDrawer {...defaultProps} renderTrigger={customTrigger} />);

    const expectedImageUrl = `${IMAGE_URL}${mockFashionItem.image}`;
    const trigger = screen.getByTestId('custom-trigger');
    expect(trigger).toHaveAttribute('data-url', expectedImageUrl);
  });

  it('ドロワーが開いているときに詳細情報が表示されること', () => {
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: true,
      onClose: onCloseMock,
      onToggle: onToggleMock,
    });

    render(<BaseImageDrawer {...defaultProps} />);

    expect(screen.getByText('アイテム詳細')).toBeInTheDocument();
    expect(screen.getByTestId('detail-info')).toBeInTheDocument();
    expect(screen.getByTestId('edit-item-dialog')).toBeInTheDocument();
    expect(screen.getByTestId('delete-item-dialog')).toBeInTheDocument();
  });

  it('更新処理が正しく動作すること', () => {
    const onUpdate = jest.fn();
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: true,
      onClose: onCloseMock,
      onToggle: onToggleMock,
    });

    render(<BaseImageDrawer {...defaultProps} onUpdate={onUpdate} />);

    fireEvent.click(screen.getByTestId('edit-item-dialog'));

    expect(onUpdate).toHaveBeenCalled();
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('削除処理が正しく動作すること', () => {
    const onDelete = jest.fn();
    (useIsOpen as jest.Mock).mockReturnValue({
      isOpen: true,
      onClose: onCloseMock,
      onToggle: onToggleMock,
    });

    render(<BaseImageDrawer {...defaultProps} onDelete={onDelete} />);

    fireEvent.click(screen.getByTestId('delete-item-dialog'));

    expect(onDelete).toHaveBeenCalledWith(mockFashionItem.id);
  });
});
