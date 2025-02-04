import base64
import time
from functools import lru_cache
from typing import Tuple

import cv2
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# 定数の定義
MAX_SIZE = 650
QUALITY_PARAM = [cv2.IMWRITE_WEBP_QUALITY, 75]
MIN_FOREGROUND_RATIO = 0.01  # 前景検出の最小比率


# キャッシュサイズを増やしてヒット率を向上
@lru_cache(maxsize=256)
def get_kernel(size: Tuple[int, int] = (3, 3)):
    """カーネルの生成をキャッシュ"""
    return np.ones(size, np.uint8)


def threshold_removal(img):
    """閾値処理による背景除去"""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # グレースケール変換: 画像をグレースケールに変換
    blurred = cv2.medianBlur(gray, 3)  # メディアンブラーに変更（ノイズに強い）
    return cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]


def color_distance_removal(img: np.ndarray) -> np.ndarray:
    """色距離による背景除去"""
    # エッジサンプリングを効率化
    edges = np.concatenate(
        [
            img[0:1].reshape(-1, 3),  # 上端
            img[-1:].reshape(-1, 3),  # 下端
            img[:, 0:1].reshape(-1, 3),  # 左端
            img[:, -1:].reshape(-1, 3),  # 右端
        ]
    )

    background_color = np.median(edges, axis=0)  # 各ピクセルと背景色の距離を計算
    diff = np.sqrt(np.sum((img - background_color) ** 2, axis=2))  # ベクトル化された計算
    threshold = np.mean(diff) + np.std(diff)
    return (diff > threshold).astype(np.uint8) * 255


def grabcut_removal(img):
    """GrabCut処理"""
    # マスクとモデルを初期化
    mask = np.zeros(img.shape[:2], np.uint8)
    bgd_model = np.zeros((1, 65), np.float64)
    fgd_model = np.zeros((1, 65), np.float64)

    # マージンを調整
    margin = int(min(img.shape[0], img.shape[1]) * 0.02)
    rect = (margin, margin, img.shape[1] - 2 * margin, img.shape[0] - 2 * margin)

    # イテレーション回数を2回に減らして処理を軽量化
    cv2.grabCut(img, mask, rect, bgd_model, fgd_model, 3, cv2.GC_INIT_WITH_RECT)
    return np.where((mask == 2) | (mask == 0), 0, 1).astype(np.uint8)


def preprocess_image(img):
    """画像の前処理"""
    height, width = img.shape[:2]
    if max(height, width) > MAX_SIZE:
        scale = MAX_SIZE / max(height, width)
        new_size = (int(width * scale), int(height * scale))
        # INTER_AREA を使用して画質を維持しながらリサイズ
        return cv2.resize(img, new_size, interpolation=cv2.INTER_AREA)
    return img


def improve_mask(mask):
    """マスクの品質改善"""
    kernel = get_kernel((3, 3))
    # モルフォロジー演算を1回の実行に最適化
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    return cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)


# 処理全体の流れ
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_bg(request):
    """背景除去エンドポイント"""
    if request.method != "POST":
        return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)

    start_time = time.time()
    image_file = request.FILES.get("image")

    if not image_file:
        return JsonResponse({"status": "error", "message": "No image provided"}, status=400)

    try:
        # 効率的な画像読み込み
        img_array = np.frombuffer(image_file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        if img is None:
            return JsonResponse({"status": "error", "message": "Failed to load image"}, status=400)

        # 前処理
        img = preprocess_image(img)

        # フォールバックを含む背景除去戦略
        final_mask = None
        methods = [
            (grabcut_removal, "GrabCut"),
            (threshold_removal, "Threshold"),
            (color_distance_removal, "ColorDistance"),
        ]

        for removal_func, _method_name in methods:
            try:
                mask = removal_func(img)
                mask_ratio = np.sum(mask) / (img.shape[0] * img.shape[1])

                if mask_ratio > MIN_FOREGROUND_RATIO:
                    final_mask = mask
                    break
            except Exception:
                continue

        if final_mask is None:
            raise Exception("All background removal methods failed")

        # マスクの改善と適用
        final_mask = improve_mask(final_mask)
        foreground = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
        foreground[:, :, 3] = final_mask * 255

        # エッジの改善（軽量化）
        foreground[:, :, 3] = cv2.medianBlur(foreground[:, :, 3], 3)

        # WebP形式で圧縮
        is_success, buffer = cv2.imencode(".webp", foreground, QUALITY_PARAM)

        if not is_success:
            raise Exception("Failed to encode image")

        img_str = base64.b64encode(buffer).decode()
        process_time = time.time() - start_time

        return JsonResponse({"status": "success", "image": img_str, "process_time": process_time})

    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)
