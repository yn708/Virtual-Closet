/*
以下のような表示ができるコンポーネント
--------------- または ---------------
*/

import { cn } from '@/lib/utils';
import type { ClassNameType, TextType } from '@/types';

const DividerWithText: React.FC<TextType & ClassNameType> = ({ text, className }) => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-inherit"></span>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className={cn('bg-card px-2 text-muted-foreground', className)}>{text}</span>
      </div>
    </div>
  );
};

export default DividerWithText;
