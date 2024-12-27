import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageActions from '../ImageActions';

// react-iconsのモック
jest.mock('react-icons/fa', () => ({
  FaExchangeAlt: () => <span data-testid="exchange-icon" />,
}));

describe('ImageActions', () => {
  const defaultProps = {
    isShowingRemovedBg: false,
    onChangeClick: jest.fn(),
    onToggleImage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('デフォルト状態で正しくレンダリングされる', () => {
    render(<ImageActions {...defaultProps} />);

    // 画像変更ボタンの存在確認
    const changeButton = screen.getByRole('button', { name: '画像変更' });
    expect(changeButton).toBeInTheDocument();
    expect(changeButton).not.toBeDisabled();

    // トグルスイッチの存在確認（checkboxとして検索）
    const toggleSwitch = screen.getByRole('checkbox', { name: '背景除去' });
    expect(toggleSwitch).toBeInTheDocument();
    expect(toggleSwitch).not.toBeDisabled();
    expect(toggleSwitch).not.toBeChecked();
  });

  it('処理中の場合、ボタンとトグルスイッチが無効化される', () => {
    render(<ImageActions {...defaultProps} isProcessing={true} />);

    // 画像変更ボタンの無効化確認
    const changeButton = screen.getByRole('button', { name: '画像変更' });
    expect(changeButton).toBeDisabled();

    // トグルスイッチの無効化確認
    const toggleSwitch = screen.getByRole('checkbox', { name: '背景除去' });
    expect(toggleSwitch).toBeDisabled();
  });

  it('背景除去がオンの場合、トグルスイッチがチェック状態になる', () => {
    render(<ImageActions {...defaultProps} isShowingRemovedBg={true} />);

    const toggleSwitch = screen.getByRole('checkbox', { name: '背景除去' });
    expect(toggleSwitch).toBeChecked();
  });

  it('画像変更ボタンクリック時にonChangeClickが呼ばれる', async () => {
    const user = userEvent.setup();
    render(<ImageActions {...defaultProps} />);

    const changeButton = screen.getByRole('button', { name: '画像変更' });
    await user.click(changeButton);

    expect(defaultProps.onChangeClick).toHaveBeenCalledTimes(1);
  });

  it('トグルスイッチ切り替え時にonToggleImageが呼ばれる', async () => {
    const user = userEvent.setup();
    render(<ImageActions {...defaultProps} />);

    const toggleSwitch = screen.getByRole('checkbox', { name: '背景除去' });
    await user.click(toggleSwitch);

    expect(defaultProps.onToggleImage).toHaveBeenCalledTimes(1);
  });

  it('正しいレイアウトとスタイリングが適用されている', () => {
    const { container } = render(<ImageActions {...defaultProps} />);

    // コンテナのスタイリング確認
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('mt-6', 'flex', 'flex-wrap', 'justify-between', 'items-center');

    // アイコンの存在確認
    expect(screen.getByTestId('exchange-icon')).toBeInTheDocument();
  });
});
