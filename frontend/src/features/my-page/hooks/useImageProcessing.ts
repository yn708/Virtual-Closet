import { compressImage, processImage } from '@/utils/imageUtils';

export const useImageProcessing = () => {
  const processImageFile = async (file: File) => {
    const isHeic = file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic');
    const processedFile = isHeic ? await processImage(file) : file;
    return await compressImage(processedFile);
  };

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('ファイルの読み込みに失敗しました'));
        }
      };
      reader.onerror = () => reject(new Error('ファイルの読み込み中にエラーが発生しました'));
      reader.readAsDataURL(file);
    });
  };

  return { processImageFile, createImagePreview };
};
