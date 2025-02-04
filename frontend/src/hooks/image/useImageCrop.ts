import type { CroppedArea, UseImageCropProps } from '@/features/my-page/profile/types';
import { useCallback, useState } from 'react';

export const useImageCrop = ({ image, onCropComplete, onClose, cropShape }: UseImageCropProps) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedArea | null>(null);

  // クロップ完了時に呼ばれるコールバック関数
  const onCropCompleteCallback = useCallback(
    (_croppedArea: CroppedArea, croppedAreaPixels: CroppedArea) => {
      setCroppedAreaPixels(croppedAreaPixels); // 座標の状態保存
    },
    [],
  );
  // データURLをBlobに変換する関数
  const dataURLToBlob = (dataUrl: string) => {
    const arr = dataUrl.split(','); // データURLをコンマで分割。最初の部分はMIMEタイプ、2番目の部分はBase64エンコードされたデータ
    const mime = arr[0].match(/:(.*?);/)![1]; // MIMEタイプを取得（例: 'image/png'）
    const bstr = atob(arr[1]); // Base64エンコードされたデータをデコードして、バイナリ文字列に変換
    let n = bstr.length; // バイナリ文字列の長さを取得
    const u8arr = new Uint8Array(n); // バイナリデータを格納するためのUint8Arrayを作成
    // バイナリ文字列をUint8Arrayに変換
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime }); // Uint8ArrayからBlobを作成し、MIMEタイプを設定
  };
  // クロップした画像をキャンバスに描画し、データURLとして取得する関数
  const createCroppedImage = async () => {
    if (!croppedAreaPixels) return; // クロップエリアのピクセル情報が存在しない場合は、処理を中断

    const canvas = document.createElement('canvas'); // 新しいキャンバス要素を作成
    const ctx = canvas.getContext('2d'); // 2D描画コンテキストを取得（キャンバスに描画するためのオブジェクト）
    const newImage = new Image(); // 新しい画像オブジェクトを作成
    newImage.src = image; // 画像のソース（選択された画像）を設定
    // 画像の読み込みが完了するのを非同期で待つ
    await new Promise((resolve) => {
      newImage.onload = resolve; // 画像がロードされたらPromiseを解決
    });

    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    if (cropShape === 'round') {
      ctx?.beginPath(); // 円形のクリッピングパスを作成（画像を円形に切り取るための準備）
      // キャンバスの中心に円を描画
      ctx?.arc(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) / 2,
        0,
        2 * Math.PI,
      );
      ctx?.clip(); // 描画領域を円形にクリップ
    }

    // 画像を指定したクロップ領域でキャンバスに描画
    ctx?.drawImage(
      newImage, // 描画する画像
      croppedAreaPixels.x, // 画像のx座標（クロップの開始位置）
      croppedAreaPixels.y, // 画像のy座標（クロップの開始位置）
      croppedAreaPixels.width, // クロップエリアの幅
      croppedAreaPixels.height, // クロップエリアの高さ
      0, // キャンバスの描画開始位置（x座標）
      0, // キャンバスの描画開始位置（y座標）
      canvas.width, // キャンバスの幅
      canvas.height, // キャンバスの高さ
    );

    const croppedImageDataUrl = canvas.toDataURL('image/webp'); // キャンバスの内容をWebP形式のデータURLとして取得
    const croppedImageBlob = dataURLToBlob(croppedImageDataUrl); // データURLをBlobに変換
    // BlobをFileとして扱う
    const file = new File([croppedImageBlob], `cropped-image-${Date.now()}.webp`, {
      type: 'image/webp',
    });

    onCropComplete(file); // クロップ完了後の処理として、onCropComplete関数にデータURLを渡す
    onClose(); // ダイアログを閉じる処理
  };

  return {
    crop,
    setCrop,
    zoom,
    setZoom,
    onCropCompleteCallback,
    createCroppedImage,
  };
};
