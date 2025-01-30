import './loading.css';

interface LoadingElementsType {
  message?: string; // メッセージを表示する場合のオプション
  fullScreen?: boolean; // 画面全体に表示するかどうか
  containerClassName?: string; // カスタムコンテナクラス名を適用するオプション
}

const LoadingElements = ({
  message = '', // デフォルトメッセージ
  fullScreen = false, // 画面全体に表示するか
  containerClassName = '', // カスタムクラスを追加できるように
}: LoadingElementsType) => {
  return (
    <div
      role="status" // テスト用
      className={`flex flex-col items-center justify-center ${
        fullScreen ? 'absolute inset-0 bg-white dark:bg-[#020817] z-50' : 'w-full mx-auto '
      } ${containerClassName}`}
    >
      <div className="sk-chase">
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
        <div className="sk-chase-dot"></div>
      </div>
      {message && <p className="mt-10 text-xs text-gray-500">{message}</p>}
    </div>
  );
};

export default LoadingElements;
