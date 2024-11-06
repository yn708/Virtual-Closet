/*
ユーザーがアプリケーション内で画像を選択、管理を行うためのもの
単一枚用
*/
'use client';
import type { UseImageType } from '@/types';
import { processImage } from '@/utils/imageUtils';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

// 画像コンテキストの作成
const ImageContext = createContext<UseImageType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // 画像の置き換え
  const updateImage = async (file: File | null) => {
    if (!file) {
      clearImage();
      return;
    }
    setIsProcessing(true);
    try {
      // HEIC形式の場合、先に変換を行う
      const processedFile =
        file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')
          ? await processImage(file)
          : file;

      // 変換後のファイルでプレビューを作成
      const newPreview = URL.createObjectURL(processedFile);

      setImage(processedFile);
      setPreview(newPreview);
    } catch (error) {
      console.error('Error processing image:', error);
      // エラーハンドリング（必要に応じてトースト通知など）
    } finally {
      setIsProcessing(false);
    }
  };

  // すべての画像をクリアする関数
  const clearImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview(null);
    setIsProcessing(false);
  };

  return (
    <ImageContext.Provider
      value={{ image, setImage: updateImage, preview, clearImage, isProcessing }}
    >
      {children}
    </ImageContext.Provider>
  );
};

// 画像コンテキストを利用して、コンテキストにアクセスするための簡便な方法を提供
export const useImage = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImage must be used within an ImageProvider'); // エラー処理：ImageProviderの外で使用されていないか確認
  }
  return context;
};
