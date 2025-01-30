import LoadingElements from '@/components/elements/loading/LoadingElements';
import { render, screen } from '@testing-library/react';

describe('LoadingElements component', () => {
  // LoadingElementsコンポーネントをレンダリングする共通関数
  const renderLoadingElements = (props = {}) => render(<LoadingElements {...props} />);

  // ローディングのstatusロール要素を取得する共通関数
  const getStatusElement = () => screen.getByRole('status');

  // LoadingElementsコンポーネントが正常にレンダリングされることを確認
  it('renders without crashing', () => {
    renderLoadingElements(); // コンポーネントをレンダリング
    expect(getStatusElement()).toBeInTheDocument(); // statusロールを持つ要素が存在することを確認
  });

  // ローディングスピナーが正しく表示されることを確認
  it('displays the loading spinner', () => {
    renderLoadingElements(); // コンポーネントをレンダリング
    expect(getStatusElement().querySelector('.sk-chase')).toBeInTheDocument(); // スピナー要素が存在することを確認
  });

  // fullScreenプロパティがtrueの時、適切なクラスが適用されることを確認
  it('applies fullScreen class when fullScreen prop is true', () => {
    renderLoadingElements({ fullScreen: true }); // fullScreenをtrueに設定してレンダリング
    expect(getStatusElement()).toHaveClass('absolute inset-0 bg-white dark:bg-[#020817] z-50'); // 全画面表示用のクラスが適用されていることを確認
  });

  // fullScreenプロパティがfalseの時、全画面表示用のクラスが適用されないことを確認
  it('does not apply fullScreen class when fullScreen prop is false', () => {
    renderLoadingElements({ fullScreen: false }); // fullScreenをfalseに設定してレンダリング
    expect(getStatusElement()).not.toHaveClass('absolute inset-0 bg-white dark:bg-[#020817] z-50'); // 全画面表示用のクラスが適用されていないことを確認
  });

  // カスタムメッセージが正しく表示されることを確認
  it('displays a custom message when provided', () => {
    const message = 'Loading...'; // 表示するカスタムメッセージ
    renderLoadingElements({ message }); // カスタムメッセージを設定してレンダリング
    expect(screen.getByText(message)).toBeInTheDocument(); // 指定したメッセージが画面に表示されていることを確認
  });

  // カスタムのコンテナクラスが正しく適用されることを確認
  it('applies custom container class when provided', () => {
    const customClass = 'custom-container'; // 指定するカスタムクラス
    renderLoadingElements({ containerClassName: customClass }); // カスタムクラスを設定してレンダリング
    expect(getStatusElement()).toHaveClass(customClass); // 指定したカスタムクラスが適用されていることを確認
  });
});
