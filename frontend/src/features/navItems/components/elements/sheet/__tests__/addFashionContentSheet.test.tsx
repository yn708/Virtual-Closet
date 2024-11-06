import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { AddFashionContentSheet } from '../addFashionContentSheet';

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
  AddItemSection: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="add-item-section">
      <button onClick={onClose}>Close Add Item</button>
    </div>
  ),
}));

jest.mock('../../section/CreateOutfitSection', () => ({
  CreateOutfitSection: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="create-outfit-section">
      <button onClick={onClose}>Close Create Outfit</button>
    </div>
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

describe('AddFashionContentSheet', () => {
  const useIsOpenMock = jest.requireMock('@/hooks/utils/useIsOpen');
  const mockUseIsOpen = useIsOpenMock.mockReturnValue;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseIsOpen.isOpen = false; // 各テスト前にisOpenをリセット
  });

  describe('Rendering', () => {
    // Addボタンが正しくレンダリングされることを確認
    it('renders add button correctly', () => {
      render(<AddFashionContentSheet />);
      const addButton = screen.getByTestId('add-button');
      expect(addButton).toBeInTheDocument();
      expect(addButton).toHaveTextContent('Add');
    });

    // isOpen=trueの時、シートの中身が表示されることを確認
    it('renders sheet content when isOpen is true', () => {
      mockUseIsOpen.isOpen = true;
      render(<AddFashionContentSheet />);

      expect(screen.getByTestId('add-item-section')).toBeInTheDocument();
      expect(screen.getByTestId('create-outfit-section')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    // Addボタンクリック時にonToggleが呼ばれることを確認
    it('calls onToggle when add button is clicked', () => {
      render(<AddFashionContentSheet />);
      const trigger = screen.getByTestId('add-button');

      fireEvent.click(trigger);
      expect(mockUseIsOpen.onToggle).toHaveBeenCalledTimes(1);
    });

    // 各セクションの閉じるボタンクリック時にonCloseが呼ばれることを確認
    it('calls onClose when section close buttons are clicked', () => {
      mockUseIsOpen.isOpen = true;
      render(<AddFashionContentSheet />);

      const closeButtons = screen.getAllByRole('button', { name: /Close/i });
      closeButtons.forEach((button) => {
        fireEvent.click(button);
      });

      const expectedCallTimes = 2; // 2つのセクションボタンのみをカウント
      expect(mockUseIsOpen.onClose).toHaveBeenCalledTimes(expectedCallTimes);
    });
  });
});
