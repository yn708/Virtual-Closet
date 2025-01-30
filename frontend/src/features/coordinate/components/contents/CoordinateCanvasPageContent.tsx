import { CoordinateCanvasStateProvider } from '@/context/CoordinateCanvasContext';
import type { InitialItemsProps } from '@/features/my-page/coordinate/types';
import type { CoordinateEditTypes } from '../../types';
import Footer from '../navigation/Footer';
import Header from '../navigation/Header';
import CoordinateCanvas from './CoordinateCanvas';

const CoordinateCanvasPageContent = ({
  initialItems,
  initialData,
  onSuccess,
}: InitialItemsProps & CoordinateEditTypes) => {
  return (
    <CoordinateCanvasStateProvider initialItems={initialItems}>
      <div className="h-screen w-full bg-gray-50 dark:bg-gray-950" data-testid="main-container">
        <div
          className="max-w-[65vh] flex flex-col items-center justify-center mx-auto"
          data-testid="inner-container"
        >
          {/* ヘッダーナビゲーション */}
          <Header initialData={initialData} initialItems={initialItems} onSuccess={onSuccess} />
          {/* メインキャンバス */}
          <CoordinateCanvas />
          {/* フッターナビゲーション */}
          <Footer />
        </div>
      </div>
    </CoordinateCanvasStateProvider>
  );
};

export default CoordinateCanvasPageContent;
