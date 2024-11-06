import { fireEvent, render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import ThemeToggleButton from '../ThemeToggleButton';

// next-themesのモックを作成
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ThemeToggleButton', () => {
  // テスト共通のセットアップ
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    // 各テスト前にモックをリセット
    jest.clearAllMocks();
    // useThemeのモック実装
    (useTheme as jest.Mock).mockImplementation(() => ({
      theme: 'light',
      setTheme: mockSetTheme,
    }));
  });

  // 基本的なレンダリングテスト
  it('renders all theme buttons correctly', () => {
    render(<ThemeToggleButton />);

    // 各テーマボタンが存在することを確認
    expect(screen.getByLabelText('Switch to light mode')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to system mode')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to dark mode')).toBeInTheDocument();
  });

  // テーマ切り替えのテスト
  it('changes theme when buttons are clicked', () => {
    render(<ThemeToggleButton />);

    // ダークモードボタンをクリック
    const darkButton = screen.getByLabelText('Switch to dark mode');
    fireEvent.click(darkButton);

    // setThemeが正しく呼び出されたか確認
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    // システムモードボタンをクリック
    const systemButton = screen.getByLabelText('Switch to system mode');
    fireEvent.click(systemButton);

    // setThemeが正しく呼び出されたか確認
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  // アクティブなテーマのスタイリングテスト
  it('applies correct styling to active theme button', () => {
    (useTheme as jest.Mock).mockImplementation(() => ({
      theme: 'dark',
      setTheme: mockSetTheme,
    }));

    render(<ThemeToggleButton />);

    // ダークモードボタンがアクティブなスタイルを持っているか確認
    const darkButton = screen.getByLabelText('Switch to dark mode');
    expect(darkButton).toHaveClass('p-2', 'rounded-full', 'bg-accent', 'text-accent-foreground');

    // 他のボタンがアクティブでないことを確認
    const lightButton = screen.getByLabelText('Switch to light mode');
    expect(lightButton).toHaveClass('p-2', 'rounded-full', 'text-foreground');
    expect(lightButton).not.toHaveClass('bg-accent', 'text-accent-foreground');
  });

  // 異なるテーマ状態でのテスト
  it('renders correctly with different theme states', () => {
    // システムテーマでテスト
    (useTheme as jest.Mock).mockImplementation(() => ({
      theme: 'system',
      setTheme: mockSetTheme,
    }));

    const { rerender } = render(<ThemeToggleButton />);
    const systemButton = screen.getByLabelText('Switch to system mode');
    expect(systemButton).toHaveClass('p-2', 'rounded-full', 'bg-accent', 'text-accent-foreground');

    // ライトテーマでテスト
    (useTheme as jest.Mock).mockImplementation(() => ({
      theme: 'light',
      setTheme: mockSetTheme,
    }));

    rerender(<ThemeToggleButton />);
    const lightButton = screen.getByLabelText('Switch to light mode');
    expect(lightButton).toHaveClass('p-2', 'rounded-full', 'bg-accent', 'text-accent-foreground');
  });
});
