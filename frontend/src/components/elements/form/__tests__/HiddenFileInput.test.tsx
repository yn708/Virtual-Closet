import { ALLOWED_IMAGE_TYPES } from '@/utils/constants';
import { fireEvent, render, screen } from '@testing-library/react';
import HiddenFileInput from '../HiddenFileInput';

describe('HiddenFileInput', () => {
  // 基本的なレンダリングテスト
  it('should render file input with correct attributes', () => {
    render(<HiddenFileInput onChange={() => {}} />);

    const input = screen.getByTestId('hidden-file-input') as HTMLInputElement;

    // 必須の属性をチェック
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', ALLOWED_IMAGE_TYPES.join(','));
    expect(input).toHaveClass('hidden');
  });

  // ファイル選択時のonChangeハンドラーのテスト
  it('should call onChange handler when file is selected', () => {
    const mockOnChange = jest.fn();
    render(<HiddenFileInput onChange={mockOnChange} />);

    const input = screen.getByTestId('hidden-file-input') as HTMLInputElement;
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

    // ファイル選択をシミュレート
    fireEvent.change(input, { target: { files: [file] } });

    // onChangeハンドラーが呼ばれたことを確認
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object));
  });

  // ref転送のテスト
  it('should forward ref correctly', () => {
    const ref = { current: null };
    render(<HiddenFileInput ref={ref} onChange={() => {}} />);

    // refが正しく転送されているか確認
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  // 追加のpropsが正しく渡されることのテスト
  it('should pass additional props to input element', () => {
    const testId = 'custom-test-id';
    render(<HiddenFileInput onChange={() => {}} data-testid={testId} />);

    const input = screen.getByTestId(testId);
    expect(input).toBeInTheDocument();
  });
});
