'use client';
import { removeBackgroundAPI } from '@/lib/api/imageApi';
import type { UseImageType } from '@/types';
import type { ReactNode } from 'react';
import React, { createContext, useContext, useState } from 'react';

// 画像処理関連の関数を動的インポート
const loadImageUtils = async () => {
  const { compressImage, conversionImage, dataURLtoFile } = await import(
    /* webpackChunkName: "imageUtils" */
    '@/utils/imageUtils'
  );
  return { compressImage, conversionImage, dataURLtoFile };
};

// 画像コンテキストの作成
const ImageContext = createContext<UseImageType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [image, setImage] = useState<File | null>(null); // 現在の画像
  const [preview, setPreview] = useState<string | null>(null); // プレビュー（URL）
  const [isProcessing, setIsProcessing] = useState<boolean>(false); // 処理中の状態

  /*----------------------------------------------------------------------------
すべての画像をクリアする関数
----------------------------------------------------------------------------*/
  const clearImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setImage(null);
    setPreview(null);
    setIsProcessing(false);
  };

  /*----------------------------------------------------------------------------
最小限のImageセット
1. clearImage（既存の画像を削除）
2. プレビューを作成
3. setImage・setPreviewで画像・プレビューを最新化
----------------------------------------------------------------------------*/
  const minimumImageSet = async (file: File): Promise<File> => {
    clearImage();
    const newPreview = URL.createObjectURL(file);
    setImage(file);
    setPreview(newPreview);
    return file;
  };

  /*----------------------------------------------------------------------------
画像の最適化
1. clearImage（既存の画像を削除）
2. WebPに変換
3. 画像圧縮
4. プレビューを作成
5. setImage・setPreviewで画像・プレビューを最新化
----------------------------------------------------------------------------*/
  const optimizationProcess = async (file: File): Promise<File | null> => {
    // 1. clearImage（既存の画像を削除）
    clearImage();
    setIsProcessing(true);
    try {
      // 画像処理ユーティリティの動的ロード
      const { conversionImage, compressImage } = await loadImageUtils();

      // 2. HEIC形式の場合、変換
      const convertedFile = await conversionImage(file);

      // 3. 画像の圧縮
      const compressedImage = await compressImage(convertedFile);

      // 4. プレビューを作成
      const newPreview = URL.createObjectURL(compressedImage);
      // 5. setImage・setPreviewで画像・プレビューを最新化
      setImage(compressedImage);
      setPreview(newPreview);
      return compressedImage;
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  /*----------------------------------------------------------------------------
背景除去する場合（WebPに変換、画像圧縮は別途行う必要がある）
1. clearImage（既存の画像を削除）
2. 背景除去
3 .プレビューを作成
4. setImage・setPreviewで画像・プレビューを最新化
----------------------------------------------------------------------------*/
  const removeBgProcess = async (file: File): Promise<File | null> => {
    // 1. clearImage（既存の画像を削除）
    clearImage();
    setIsProcessing(true);
    try {
      const { dataURLtoFile } = await loadImageUtils();

      // FormDataオブジェクトを作成し、API通信
      const formData = new FormData();
      formData.append('image', file);
      // 2. プレビューを作成
      const result = await removeBackgroundAPI(formData);

      // もし成功した場合
      if (result.status === 'success' && result.image) {
        const removedBgFileName = `${file.name.replace(/\.[^/.]+$/, '')}_removed_bg.webp`;
        const removedBg = dataURLtoFile(`data:image/png;base64,${result.image}`, removedBgFileName); // Base64画像データをFileオブジェクトに変換
        // 3. プレビューを作成
        const newPreview = URL.createObjectURL(removedBg);
        // 4. setImage・setPreviewで画像・プレビューを最新化
        setPreview(newPreview);
        setImage(removedBg);
        return removedBg;
      } else {
        throw new Error(result.message || '被写体抽出に失敗しました');
      }
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ImageContext.Provider
      value={{
        image,
        minimumImageSet,
        optimizationProcess,
        removeBgProcess,
        preview,
        isProcessing,
        clearImage,
      }}
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
