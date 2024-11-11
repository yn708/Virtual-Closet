'use client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import React, { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { IoIosRemove, IoMdAdd } from 'react-icons/io';

interface ImageCropDialogProps {
  open: boolean; // ダイアログが開いているかどうかを示す
  onClose: () => void; // ダイアログを閉じるための関数
  image: string; // クロップする画像のURL
  onCropComplete: (image: File) => void; // クロップ完了後に呼ばれるコールバック
}

interface CroppedArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageCropDialog: React.FC<ImageCropDialogProps> = ({
  open,
  onClose,
  image,
  onCropComplete,
}) => {
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
    // データURLをコンマで分割。最初の部分はMIMEタイプ、2番目の部分はBase64エンコードされたデータ
    const arr = dataUrl.split(',');

    // MIMEタイプを取得（例: 'image/png'）
    const mime = arr[0].match(/:(.*?);/)![1];

    // Base64エンコードされたデータをデコードして、バイナリ文字列に変換
    const bstr = atob(arr[1]);

    // バイナリ文字列の長さを取得
    let n = bstr.length;

    // バイナリデータを格納するためのUint8Arrayを作成
    const u8arr = new Uint8Array(n);

    // バイナリ文字列をUint8Arrayに変換
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    // Uint8ArrayからBlobを作成し、MIMEタイプを設定
    return new Blob([u8arr], { type: mime });
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

    // クロップエリアの幅と高さを基に、最小サイズの正方形を作成
    const size = Math.min(croppedAreaPixels.width, croppedAreaPixels.height);

    // キャンバスの幅と高さを正方形に設定
    canvas.width = size;
    canvas.height = size;

    // 円形のクリッピングパスを作成（画像を円形に切り取るための準備）
    ctx?.beginPath();

    // キャンバスの中心に円を描画
    ctx?.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);

    // 描画領域を円形にクリップ
    ctx?.clip();

    // 画像を指定したクロップ領域でキャンバスに描画
    ctx?.drawImage(
      newImage, // 描画する画像
      croppedAreaPixels.x, // 画像のx座標（クロップの開始位置）
      croppedAreaPixels.y, // 画像のy座標（クロップの開始位置）
      croppedAreaPixels.width, // クロップエリアの幅
      croppedAreaPixels.height, // クロップエリアの高さ
      0, // キャンバスの描画開始位置（x座標）
      0, // キャンバスの描画開始位置（y座標）
      size, // キャンバスの幅
      size, // キャンバスの高さ
    );

    // キャンバスの内容をPNG形式のデータURLとして取得
    const croppedImageDataUrl = canvas.toDataURL('image/png');

    // データURLをBlobに変換
    const croppedImageBlob = dataURLToBlob(croppedImageDataUrl);

    // BlobをFileとして扱う
    const file = new File([croppedImageBlob], `profile-image-${Date.now()}.png`, {
      type: 'image/png',
    });

    // クロップ完了後の処理として、onCropComplete関数にデータURLを渡す
    onCropComplete(file);

    // ダイアログを閉じる処理
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="">
        <div className="relative w max-h-screen h-96">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteCallback}
          />
        </div>
        <div className="flex justify-center items-center ga mt-4">
          <IoIosRemove className="size-6" />
          {/* ズームレベルを調整するスライダー */}
          <Slider
            value={[zoom]}
            onValueChange={(value) => setZoom(value[0])}
            min={1}
            max={3}
            step={0.05}
          />
          <IoMdAdd className="size-6" />
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <Button onClick={createCroppedImage}>完了</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropDialog;
