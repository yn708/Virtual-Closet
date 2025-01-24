import { Button } from '@/components/ui/button';
import { ChevronsUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  show: boolean;
  onClick: () => void;
}

/**
 * トップへスクロールするボタンコンポーネント
 * - 表示/非表示の制御
 * - アニメーション付きのUI
 */
const ScrollToTopButton = ({ show, onClick }: ScrollToTopButtonProps) => (
  <Button
    variant="secondary"
    size="icon"
    className={`
      fixed bottom-20 right-6 z-50 rounded-full shadow-lg transition-all duration-300
      ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
    `}
    onClick={onClick}
  >
    <ChevronsUp className="size-5" />
  </Button>
);

export default ScrollToTopButton;
