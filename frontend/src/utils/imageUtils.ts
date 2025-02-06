import { ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE } from './constants';

/* ----------------------------------------------------------------
WebPに変換する関数
------------------------------------------------------------------ */
export const conversionImage = async (file: File): Promise<File> => {
  // クライアントサイドでのみ実行されるチェック（サーバーサイドの場合は処理せずに元のファイルを返す）
  if (typeof window === 'undefined') return file;

  // ファイルがHEIC形式かどうかをチェック（HEICの場合はheic2anyを使用）
  if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
    try {
      // heic2anyを動的にインポート
      // より効率的な動的インポート
      const { default: heic2any } = await import(
        /* webpackChunkName: "heic2any" */
        'heic2any'
      );

      // HEIC形式をJPEGに変換
      const blob = await heic2any({
        blob: file,
        toType: 'image/webp',
        quality: 0.8,
      });

      // 変換されたBlobから新しいFileオブジェクトを作成
      return new File([blob as Blob], file.name.replace(/\.heic$/i, '.webp'), {
        type: 'image/webp',
      });
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      throw new Error('HEIC画像の変換に失敗しました。');
    }
  }

  // それ以外の形式をWebPに変換
  const { default: imageCompression } = await import('browser-image-compression');
  const webpFile = await imageCompression(file, {
    fileType: 'image/webp',
  });

  return new File([webpFile], file.name.replace(/\.[^.]+$/, '.webp'), {
    type: 'image/webp',
  });
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
    // 1MBを超える場合、品質を下げて0.1MB以下に抑える
    maxSizeMB: 0.1,

    // 画像の最大幅または高さ（ピクセル）
    // 元の画像がこれより大きい場合、この値まで縮小される
    // アスペクト比は維持される
    maxWidthOrHeight: 1024,

    // WebWorkerを使用するかどうか
    // trueの場合、圧縮処理をバックグラウンドで実行し、
    // メインスレッドのブロックを防ぐ
    useWebWorker: true,

    fileType: 'image/webp',
  };
  const options = { ...defaultOptions, ...customOptions };

  try {
    const { default: imageCompression } = await import(
      /* webpackChunkName: "imageCompression" */
      'browser-image-compression'
    );

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

/* ----------------------------------------------------------------
 * html2canvasを使用した画像作成
------------------------------------------------------------------ */
// export const generatePreviewImage = async (canvasRef: HTMLElement | null) => {
//   if (!canvasRef) return null;

//   try {
//     const { default: html2canvas } = await import(
//       /* webpackChunkName: "html2canvas" */
//       'html2canvas'
//     );

//     // キャンバス要素のサイズを取得
//     const canvasRect = canvasRef.getBoundingClientRect();

//     // デバイスのピクセル比を取得
//     const pixelRatio = window.devicePixelRatio || 1;

//     // スケールを2倍に設定（または必要に応じてピクセル比に基づいて調整）
//     const scale = Math.max(2, pixelRatio);

//     const canvas = await html2canvas(canvasRef, {
//       scale, // スケールを高く設定
//       width: canvasRect.width, // キャンバスの実際の幅を指定
//       height: canvasRect.height, // キャンバスの実際の高さを指定
//       useCORS: true,
//       allowTaint: true,
//       logging: false,
//       imageTimeout: 0, // 画像読み込みのタイムアウトを無効化
//       onclone: (clonedDoc) => {
//         // クローンされた要素のスタイルを調整
//         const clonedCanvas = clonedDoc.querySelector('.coordinate-canvas') as HTMLElement;
//         if (clonedCanvas) {
//           // キャンバスのサイズを明示的に設定
//           clonedCanvas.style.width = `${canvasRect.width}px`;
//           clonedCanvas.style.height = `${canvasRect.height}px`;

//           // 画像要素の画質を向上
//           const images = clonedCanvas.getElementsByTagName('img');
//           Array.from(images).forEach((img) => {
//             img.style.imageRendering = 'high-quality';
//           });

//           // 操作用UIを非表示にする
//           const operationUIs = clonedCanvas.querySelectorAll('.operation-ui');
//           operationUIs.forEach((ui) => {
//             (ui as HTMLElement).style.display = 'none';
//           });
//         }

//         // 画像の読み込み完了を待機
//         const images = clonedDoc.getElementsByTagName('img');
//         const imageLoadPromises = Array.from(images).map((img) => {
//           if (img.complete) return Promise.resolve();
//           return new Promise((resolve) => {
//             img.onload = resolve;
//             img.onerror = resolve;
//           });
//         });

//         return Promise.all(imageLoadPromises);
//       },
//     });

//     // Blobの生成時にサイズを維持
//     const blob = await new Promise<Blob>((resolve) => {
//       canvas.toBlob(
//         (blob) => {
//           resolve(blob as Blob);
//         },
//         'image/webp',
//         1.0, // 最高品質で出力
//       );
//     });

//     // ユニークなファイル名を生成
//     const timestamp = Date.now();
//     const randomNum = Math.floor(Math.random() * 10000)
//       .toString()
//       .padStart(4, '0');
//     const filename = `coordinate_preview_${timestamp}_${randomNum}.webp`;

//     // 生成されたファイルを圧縮用のFileオブジェクトに変換
//     const uncompressedFile = new File([blob], filename, { type: 'image/webp' });

//     // 圧縮オプションを設定
//     const compressionOptions = {
//       maxSizeMB: 0.1,
//       maxWidthOrHeight: 1024, // プレビュー用に適切なサイズに設定
//       useWebWorker: true,
//       fileType: 'image/webp',
//     };

//     // 画像を圧縮
//     const compressedFile = await compressImage(uncompressedFile, compressionOptions);

//     // 圧縮された画像のプレビューURL生成
//     const previewUrl = URL.createObjectURL(compressedFile);

//     // FormDataにファイルを追加
//     const dataTransfer = new DataTransfer();
//     dataTransfer.items.add(compressedFile);

//     // hidden input要素にファイルを設定
//     const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
//     if (fileInput) {
//       fileInput.files = dataTransfer.files;
//     }

//     return previewUrl;
//   } catch (error) {
//     console.error('Preview generation failed:', error);
//     return null;
//   }
// };

// 本番環境でSafari、スマホ等で処理が終わらない問題を修正（仮：実際に動作するか確認）
export const generatePreviewImage = async (canvasRef: HTMLElement | null) => {
  if (!canvasRef) return null;

  try {
    const { default: html2canvas } = await import('html2canvas');
    const canvasRect = canvasRef.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    const scale = Math.min(2, pixelRatio);

    const canvas = await html2canvas(canvasRef, {
      scale,
      width: canvasRect.width,
      height: canvasRect.height,
      useCORS: true,
      allowTaint: true,
      logging: true,
      imageTimeout: 10000,
      onclone: (clonedDoc) => {
        const clonedCanvas = clonedDoc.querySelector('.coordinate-canvas') as HTMLElement;
        if (clonedCanvas) {
          clonedCanvas.style.width = `${canvasRect.width}px`;
          clonedCanvas.style.height = `${canvasRect.height}px`;

          const images = clonedCanvas.getElementsByTagName('img');
          Array.from(images).forEach((img) => {
            img.style.imageRendering = 'high-quality';
          });

          const operationUIs = clonedCanvas.querySelectorAll('.operation-ui');
          operationUIs.forEach((ui) => {
            (ui as HTMLElement).style.display = 'none';
          });
        }

        const images = clonedDoc.getElementsByTagName('img');
        const imageLoadPromises = Array.from(images).map((img) => {
          if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
          return new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            setTimeout(() => reject(new Error('Image load timeout')), 10000);
          });
        });

        return Promise.all(imageLoadPromises);
      },
    });

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Blob generation failed'));
          }
        },
        'image/webp',
        0.85,
      );
    });

    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');
    const filename = `coordinate_preview_${timestamp}_${randomNum}.webp`;

    const uncompressedFile = new File([blob], filename, { type: 'image/webp' });

    const compressionOptions = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      fileType: 'image/webp',
    };

    const compressedFile = await compressImage(uncompressedFile, compressionOptions);
    const previewUrl = URL.createObjectURL(compressedFile);

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(compressedFile);

    const fileInput = document.querySelector('input[name="image"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.files = dataTransfer.files;
    }

    return previewUrl;
  } catch (error) {
    console.error('Preview generation failed:', error);
    throw new Error('画像の生成に失敗しました。');
  }
};
