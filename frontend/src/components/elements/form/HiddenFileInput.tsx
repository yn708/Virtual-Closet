import { Input } from '@/components/ui/input';
import type { FileInputType } from '@/types';
import { ALLOWED_IMAGE_TYPES } from '@/utils/constants';
import { forwardRef } from 'react';

// forwardRefを使用してコンポーネントを定義
const HiddenFileInput = forwardRef<HTMLInputElement, FileInputType>(
  ({ onChange, ...props }, ref) => {
    return (
      <Input
        data-testid="hidden-file-input" // テスト用
        type="file"
        ref={ref} // 受け取ったrefをInput要素に渡す
        className="hidden" // 見えないようにする
        accept={ALLOWED_IMAGE_TYPES.join(',')} // 許可される画像タイプを指定
        onChange={onChange} // ファイル選択時のイベントハンドラ
        {...props} // 他のpropsも渡す
      />
    );
  },
);

// displayNameを設定
HiddenFileInput.displayName = 'HiddenFileInput';

export default HiddenFileInput;

// 使用例
// <HiddenFileInput ref={fileInputRef} onChange={handleFileChange} />
