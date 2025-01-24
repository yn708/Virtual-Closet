import { render, screen } from '@testing-library/react';
import { GoHome } from 'react-icons/go';
import AccordionSection from '../AccordionSection';

// Accordionコンポーネントのモック
jest.mock('@/components/ui/accordion', () => ({
  AccordionContent: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div data-testid="accordion-content" className={className}>
      {children}
    </div>
  ),
  AccordionItem: ({ children, value }: { children: React.ReactNode; value: string }) => (
    <div data-testid="accordion-item" data-value={value}>
      {children}
    </div>
  ),
  AccordionTrigger: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button data-testid="accordion-trigger" className={className}>
      {children}
    </button>
  ),
}));

describe('AccordionSection', () => {
  const defaultProps = {
    value: 'home',
    Icon: GoHome,
    label: 'Home Section',
  };

  // 基本的なレンダリングテスト
  it('renders with all required props', () => {
    render(
      <AccordionSection {...defaultProps}>
        <div>Content</div>
      </AccordionSection>,
    );

    // AccordionItemが正しい値でレンダリングされているか確認
    const accordionItem = screen.getByTestId('accordion-item');
    expect(accordionItem).toHaveAttribute('data-value', 'home');

    // トリガー部分が正しくレンダリングされているか確認
    const trigger = screen.getByTestId('accordion-trigger');
    expect(trigger).toHaveClass('flex items-center justify-between');

    // ラベルが正しく表示されているか確認
    expect(screen.getByText('Home Section')).toBeInTheDocument();

    // コンテンツが正しくレンダリングされているか確認
    const content = screen.getByTestId('accordion-content');
    expect(content).toHaveClass('grid gap-4');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  // レスポンシブパディングのテスト
  it('applies correct responsive padding classes to content', () => {
    render(
      <AccordionSection {...defaultProps}>
        <div>Content</div>
      </AccordionSection>,
    );

    const contentInnerDiv = screen.getByTestId('accordion-content').querySelector('div');
    expect(contentInnerDiv).toHaveClass('grid', 'gap-2', 'lg:px-20', 'md:px-10', 'px-5');
  });

  // 異なるpropsでのレンダリングテスト
  it('renders with different props correctly', () => {
    const customProps = {
      value: 'settings',
      Icon: GoHome,
      label: 'Settings Section',
    };

    render(
      <AccordionSection {...customProps}>
        <span>Settings Content</span>
      </AccordionSection>,
    );

    // カスタムpropsが正しく反映されているか確認
    expect(screen.getByTestId('accordion-item')).toHaveAttribute('data-value', 'settings');
    expect(screen.getByText('Settings Section')).toBeInTheDocument();
    expect(screen.getByText('Settings Content')).toBeInTheDocument();
  });

  // 子要素が複数ある場合のテスト
  it('renders multiple children correctly', () => {
    render(
      <AccordionSection {...defaultProps}>
        <div>Child 1</div>
        <div>Child 2</div>
        <div>Child 3</div>
      </AccordionSection>,
    );

    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
    expect(screen.getByText('Child 3')).toBeInTheDocument();
  });

  // アクセシビリティテスト
  it('maintains proper structure for accessibility', () => {
    render(
      <AccordionSection {...defaultProps}>
        <div>Content</div>
      </AccordionSection>,
    );

    // トリガーがボタンとしてレンダリングされているか確認
    const trigger = screen.getByTestId('accordion-trigger');
    expect(trigger.tagName).toBe('BUTTON');

    // ラベルとアイコンが同じコンテナ内にあることを確認
    const labelContainer = screen.getByText('Home Section').parentElement;
    expect(labelContainer).toHaveClass('flex items-center gap-2 p-2');
  });
});
