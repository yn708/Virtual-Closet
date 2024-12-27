'use client';

import { useCoordinateCanvasState } from '../../hooks/useCoordinateCanvasState';
import Footer from '../navigation/Footer';
import Header from '../navigation/Header';
import CoordinateCanvas from './CoordinateCanvas';

const CoordinateCanvasPageContent = () => {
  // カスタムフックから状態とハンドラーを取得
  const {
    state: { selectedItems, itemStyles, background },
    handlers,
  } = useCoordinateCanvasState();

  return (
    <div className="h-screen w-full bg-gray-50 dark:bg-gray-950 ">
      <div className="max-w-[65vh] flex flex-col items-center justify-center mx-auto">
        {/* ヘッダーナビゲーション */}
        <Header selectedItems={selectedItems} itemStyles={itemStyles} />

        {/* メインキャンバス */}
        <CoordinateCanvas
          selectedItems={selectedItems}
          onRemoveItem={handlers.handleRemoveItem}
          itemStyles={itemStyles}
          onUpdateStyles={handlers.handleUpdateStyles}
          background={background}
        />

        {/* フッターナビゲーション */}
        <Footer
          selectedItems={selectedItems}
          onSelectItem={handlers.handleSelectItem}
          onReset={handlers.handleFullReset}
          onBackgroundChange={handlers.handleBackgroundChange}
          background={background}
        />
      </div>
    </div>
  );
};

export default CoordinateCanvasPageContent;
