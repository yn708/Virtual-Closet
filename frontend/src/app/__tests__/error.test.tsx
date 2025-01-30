import ErrorComponent from '@/app/error';
import { fireEvent, render } from '@testing-library/react';

describe('ErrorComponent', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  // Errorコンポーネントがエラーメッセージを正しく表示するかを確認するテスト
  it('displays the error message', () => {
    const { getByText } = render(
      <ErrorComponent error={new Error('Test error')} reset={() => {}} />,
    );
    expect(getByText('内部エラーが発生しました。')).toBeInTheDocument();
    expect(consoleErrorSpy).toHaveBeenCalledWith(expect.any(Error));
  });

  // Errorコンポーネントがreset関数を正しく呼び出すかを確認するテスト
  it('calls the reset function when the button is clicked', () => {
    const reset = jest.fn();
    const { getByText } = render(<ErrorComponent error={new Error('Test error')} reset={reset} />);
    fireEvent.click(getByText('もう一度試す'));
    expect(reset).toHaveBeenCalled();
  });
});
