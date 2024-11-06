import { ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from './constants';
/* ----------------------------------------------------------------
HEIC形式をJPEGに変換する関数
------------------------------------------------------------------ */
export const processImage = async (file: File): Promise<File> => {
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
