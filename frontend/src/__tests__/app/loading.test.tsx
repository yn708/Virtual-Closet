import Loading from '@/app/loading';
import { render, screen } from '@testing-library/react';

// LoadingElementsのモックを作成
jest.mock('@/components/elements/loading/LoadingElements', () => {
  return jest.fn(({ fullScreen }) => (
    <div data-testid="mock-loading-elements" data-fullscreen={fullScreen} />
  ));
});

describe('Loading component', () => {
  // Loadingコンポーネントが正しくLoadingElementsを使用し、fullScreenプロパティを正しく設定していることを確認
  it('renders LoadingElements with fullScreen prop set to true', () => {
    render(<Loading />);

    // モック化したLoadingElementsコンポーネントを画面から探す
    const loadingElement = screen.getByTestId('mock-loading-elements');

    // LoadingElementsコンポーネントが実際にレンダリングされたことを確認
    expect(loadingElement).toBeInTheDocument();

    // fullScreenプロパティがtrueに設定されていることを確認
    expect(loadingElement).toHaveAttribute('data-fullscreen', 'true');
  });
});
