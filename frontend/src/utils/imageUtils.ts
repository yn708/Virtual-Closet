import imageCompression from 'browser-image-compression';
import { ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from './constants';

/* ----------------------------------------------------------------
HEIC形式をJPEGに変換する関数
------------------------------------------------------------------ */
export const conversionImage = async (file: File): Promise<File> => {
  // クライアントサイドでのみ実行されるチェック
  if (typeof window === 'undefined') {
    return file; // サーバーサイドの場合は処理せずに元のファイルを返す
  }

  // ファイルがHEIC形式かどうかをチェック
  if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
    try {
      // heic2anyを動的にインポート
      const heic2any = (await import('heic2any')).default;

      // HEIC形式をJPEGに変換
      const blob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.8,
      });

      // 変換されたBlobから新しいFileオブジェクトを作成
      return new File([blob as Blob], file.name.replace(/\.heic$/i, '.jpg'), {
        type: 'image/jpeg',
      });
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      throw new Error('HEIC画像の変換に失敗しました。');
    }
  }

  // HEIC以外の形式の場合、元のファイルをそのまま返す
  return file;
};

/* ----------------------------------------------------------------
画像ファイルのバリデーションを行う関数
------------------------------------------------------------------ */
export const validateImage = (file: File, allowedTypes = ALLOWED_IMAGE_TYPES): string | null => {
  // ファイル形式のチェック
  if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
    return `未対応のファイル形式です。${ALLOWED_IMAGE_EXTENSIONS.join(', ')}でお願いします。`;
  }
  // ファイルサイズのチェック (5MB以下)
  if (file.size > MAX_FILE_SIZE) {
    return '画像サイズは5MB以下にしてください。';
  }
  return null; // エラーがない場合はnullを返す
};

/* ----------------------------------------------------------------
画像の圧縮
------------------------------------------------------------------ */
export const compressImage = async (
  file: File,
  customOptions: Partial<{
    maxSizeMB: number;
    maxWidthOrHeight: number;
    useWebWorker: boolean;
    fileType: string;
  }> = {},
): Promise<File> => {
  const defaultOptions = {
    // 圧縮後の最大ファイルサイズ（MB）
    // 1MBを超える場合、品質を下げて1MB以下に抑える
    maxSizeMB: 1,

    // 画像の最大幅または高さ（ピクセル）
    // 元の画像がこれより大きい場合、この値まで縮小される
    // アスペクト比は維持される
    maxWidthOrHeight: 1024,

    // WebWorkerを使用するかどうか
    // trueの場合、圧縮処理をバックグラウンドで実行し、
    // メインスレッドのブロックを防ぐ
    useWebWorker: true,

    fileType: 'image/jpeg',
  };
  const options = { ...defaultOptions, ...customOptions };

  try {
    // 画像の圧縮を実行
    const compressedFile = await imageCompression(file, options);

    // 圧縮された画像データから新しいFileオブジェクトを作成
    // 元のファイル名を維持し、MIMEタイプは圧縮後のものを使用
    return new File([compressedFile], file.name, {
      type: compressedFile.type,
    });
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

/* ----------------------------------------------------------------
データの加工等が可能なプレビューを作成
------------------------------------------------------------------ */
export const createImagePreview = (file: File): Promise<string> => {
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

/* ----------------------------------------------------------------
 * Base64データURLをFileオブジェクトに変換する関数
 * @param dataurl - Base64エンコードされた画像データURL
 * @param filename - 生成するファイルの名前
 * @returns 変換されたFileオブジェクト
------------------------------------------------------------------ */
export const dataURLtoFile = (dataurl: string, filename: string): File => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
};
