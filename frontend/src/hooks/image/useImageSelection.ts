'use client';
import { validateImage } from '@/utils/imageUtils';
import type React from 'react';
import { useRef, useState } from 'react';
import { useToast } from '../use-toast';

interface ImageSelectionResult {
  file: File | null;
}
// カメラロールから画像を選択するためのカスタムフック
export const useImageSelection = () => {
  const fileInputRef = useRef<HTMLInputElement>(null); // ファイル入力要素への参照
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const { toast } = useToast(); // useToastフックを追加

  // 画像選択inputを開く関数
  const handleFileInput = () => {
    fileInputRef.current?.click();
  };

  // ファイル選択時の処理
  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<ImageSelectionResult> => {
    const file = e.target.files?.[0];
    if (!file) {
      return { file: null };
    }

    setIsLoading(true);
    try {
      // ファイルのバリデーション
      const validationError = validateImage(file);
      if (validationError) {
        // エラーメッセージをトースト通知で表示
        toast({
          variant: 'destructive',
          title: 'エラー',
          description: validationError,
        });
      }
      return { file };
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: '画像の処理中にエラーが発生しました。もう一度お試しください。',
      });
      return { file: null };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fileInputRef,
    handleFileInput,
    handleFileChange,
    isLoading,
  };
};
