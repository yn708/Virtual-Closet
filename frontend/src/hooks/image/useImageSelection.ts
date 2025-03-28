'use client';
import { validateImage } from '@/utils/imageUtils';
import type React from 'react';
import { useState } from 'react';
import { useToast } from '../use-toast';

interface ImageSelectionResult {
  file: File | null;
}
// カメラロールから画像を選択するためのカスタムフック
export const useImageSelection = () => {
  const [isLoading, setIsLoading] = useState(false); // ローディング状態
  const { toast } = useToast(); // useToastフックを追加

  /*
  ファイル選択をOPENする関数
  htmlFor="image-upload"を設定してButton等でクリックしても開かない場合の要素がある場合に指定
  */
  const openFileDialog = () => {
    const fileInput = document.getElementById('image-upload');
    if (fileInput) {
      fileInput.click();
    }
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
          title: validationError,
        });
        // クリア
        e.target.value = '';
        return { file: null };
      }
      return { file };
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        variant: 'destructive',
        title: 'エラー',
        description: '画像の処理中にエラーが発生しました。もう一度お試しください。',
      });
      e.target.value = '';
      return { file: null };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    openFileDialog,
    handleFileChange,
    isLoading,
  };
};
