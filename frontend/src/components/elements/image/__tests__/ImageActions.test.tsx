import { useImage } from '@/context/ImageContext';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageActions from '../ImageActions';

// ImageContextのモック
jest.mock('@/context/ImageContext', () => ({
  useImage: jest.fn(),
}));

describe('ImageActions', () => {
  // テスト用の共通props
  const defaultProps = {
    isShowingRemovedBg: false,
    onChangeClick: jest.fn(),
    onToggleImage: jest.fn(),
    onOpenCrop: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // useImageのデフォルト値を設定
    (useImage as jest.Mock).mockReturnValue({
      preview: null,
    });
  });

  it('画像変更ボタンが正しくレンダリングされる', () => {
    render(<ImageActions {...defaultProps} />);

    const changeButton = screen.getByRole('button', { name: '画像変更' });
    expect(changeButton).toBeInTheDocument();
  });

  it('previewがない場合、ToggleSwitchは表示されない', () => {
    render(<ImageActions {...defaultProps} />);

    const toggleSwitch = screen.queryByRole('checkbox', { name: '背景除去' });
    expect(toggleSwitch).not.toBeInTheDocument();
  });

  it('previewがある場合、ToggleSwitchが表示される', () => {
    // previewありの状態をモック
    (useImage as jest.Mock).mockReturnValue({
      preview: 'preview-url',
    });

    render(<ImageActions {...defaultProps} />);

    const toggleSwitch = screen.getByRole('checkbox', { name: '背景除去' });
    expect(toggleSwitch).toBeInTheDocument();
  });

  it('isProcessingがtrueの場合、ボタンとToggleSwitchが無効化される', () => {
    (useImage as jest.Mock).mockReturnValue({
      preview: 'preview-url',
    });

    render(<ImageActions {...defaultProps} isProcessing={true} />);

    const changeButton = screen.getByRole('button', { name: '画像変更' });
    const toggleSwitch = screen.getByRole('checkbox', { name: '背景除去' });

    expect(changeButton).toBeDisabled();
    expect(toggleSwitch).toBeDisabled();
  });

  it('画像変更ボタンクリックでonChangeClickが呼ばれる', async () => {
    const user = userEvent.setup();
    const onChangeClick = jest.fn();

    render(<ImageActions {...defaultProps} onChangeClick={onChangeClick} />);

    const changeButton = screen.getByRole('button', { name: '画像変更' });
    await user.click(changeButton);

    expect(onChangeClick).toHaveBeenCalledTimes(1);
  });

  it('ToggleSwitchの切り替えでonToggleImageが呼ばれる', async () => {
    const user = userEvent.setup();
    const onToggleImage = jest.fn();

    (useImage as jest.Mock).mockReturnValue({
      preview: 'preview-url',
    });

    render(<ImageActions {...defaultProps} onToggleImage={onToggleImage} />);

    const toggleSwitch = screen.getByRole('checkbox', { name: '背景除去' });
    await user.click(toggleSwitch);

    expect(onToggleImage).toHaveBeenCalledTimes(1);
  });

  it('isShowingRemovedBgの値がToggleSwitchに正しく反映される', () => {
    (useImage as jest.Mock).mockReturnValue({
      preview: 'preview-url',
    });

    render(<ImageActions {...defaultProps} isShowingRemovedBg={true} />);

    const toggleSwitch = screen.getByRole('checkbox', { name: '背景除去' });
    expect(toggleSwitch).toBeChecked();
  });
});
