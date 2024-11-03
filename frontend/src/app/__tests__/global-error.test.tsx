import GlobalError from '@/app/global-error';
import { fireEvent, render } from '@testing-library/react';

describe('GlobalError', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // GlobalErrorコンポーネントがエラーメッセージを正しく表示するかを確認するテスト
  it('displays the error message', () => {
    const { getByText } = render(<GlobalError error={new Error('Test error')} reset={() => {}} />);
    expect(getByText('内部エラーが発生しました。')).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Critical error:', expect.any(Error));
  });

  // GlobalErrorコンポーネントがreset関数を正しく呼び出すかを確認するテスト
  it('calls the reset function when the button is clicked', () => {
    const reset = jest.fn();
    const { getByText } = render(<GlobalError error={new Error('Test error')} reset={reset} />);
    fireEvent.click(getByText('リロード'));
    expect(reset).toHaveBeenCalled();
  });
});
