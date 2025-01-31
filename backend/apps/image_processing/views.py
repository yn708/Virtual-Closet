import base64
import time

import cv2
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


# 閾値処理による背景除去
def threshold_removal(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # グレースケール変換: 画像をグレースケールに変換
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)  # ぼかし: ガウシアンフィルタで画像をぼかす
    # 二値化: 大津の閾値処理で画像を二値化
    _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

    return thresh


# 色距離に基づく背景除去
def color_distance_removal(img):
    edges = np.concatenate([img[0], img[-1], img[:, 0], img[:, -1]])  # 画像の端のピクセルを抽出して背景色を推定
    background_color = np.median(edges, axis=0)  # 各ピクセルと背景色の距離を計算
    diff = np.abs(img - background_color)  # 距離が平均と標準偏差よりも大きいピクセルをマスク
    distance = np.sum(diff, axis=2)
    mask = distance > np.mean(distance) + np.std(distance)
    return mask.astype(np.uint8) * 255


# エッジベースの背景除去
def edge_based_removal(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # グレースケール変換
    edges = cv2.Canny(gray, 30, 100)  # Cannyエッジ検出
    kernel = np.ones((5, 5), np.uint8)  # 膨張処理でエッジを太くする
    dilated = cv2.dilate(edges, kernel, iterations=3)
    mask = cv2.floodFill(dilated.copy(), None, (0, 0), 0)[1]  # Flood Fillで背景領域を塗りつぶす
    return mask


# 背景をセグメント化して複数色に分ける
def segment_background(img):
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)  # HSV色空間に変換
    lower_bound = np.array([0, 0, 0])  # 背景色の範囲を指定 (ここでは全ての色を背景とみなす)
    upper_bound = np.array([179, 255, 255])
    mask = cv2.inRange(hsv, lower_bound, upper_bound)  # 指定した範囲の色をマスク
    result = cv2.bitwise_and(img, img, mask=mask)  # 元の画像とマスクの論理積を取ることで背景を抽出
    return result


# GrabCut処理を行い、背景を除去
def grabcut_removal(img):
    # マスクとモデルを初期化
    mask = np.zeros(img.shape[:2], np.uint8)
    bgd_model = np.zeros((1, 65), np.float64)
    fgd_model = np.zeros((1, 65), np.float64)
    rect = (10, 10, img.shape[1] - 20, img.shape[0] - 20)  # 背景除去領域を指定 (画像全体より少し内側)
    cv2.grabCut(img, mask, rect, bgd_model, fgd_model, 5, cv2.GC_INIT_WITH_RECT)  # GrabCut実行
    final_mask = np.where((mask == 2) | (mask == 0), 0, 1).astype("uint8")  # 背景領域を0、前景領域を1に変換
    return final_mask


# 処理全体の流れ
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def remove_bg(request):
    if request.method == "POST":
        start_time = time.time()
        image_file = request.FILES.get("image")

        if image_file:
            try:
                # 画像ファイルをOpenCV形式に変換
                img_array = np.array(bytearray(image_file.read()), dtype=np.uint8)
                img = cv2.imdecode(img_array, -1)

                # 画像読み込みに失敗した場合のエラー処理
                if img is None:
                    return JsonResponse({"status": "error", "message": "画像の読み込みに失敗しました。"}, status=400)

                # 画像サイズが大きすぎる場合はリサイズ
                max_size = 1500
                height, width = img.shape[:2]
                if max(height, width) > max_size:
                    scale = max_size / max(height, width)
                    img = cv2.resize(img, (int(width * scale), int(height * scale)))

                # 画像の前処理 (ここではコピー)
                img_enhanced = img.copy()

                # 画像のセグメンテーション (複数色の背景を処理)
                segmented_img = segment_background(img_enhanced)

                # GrabCutで背景除去
                final_mask = grabcut_removal(segmented_img)

                # GrabCutの結果が良くない場合は他の方法を試す
                if np.sum(final_mask) < (height * width * 0.01):
                    try:
                        final_mask = threshold_removal(img_enhanced) // 255
                    except Exception:
                        try:
                            final_mask = color_distance_removal(img_enhanced) // 255
                        except Exception:
                            final_mask = edge_based_removal(img_enhanced) // 255

                # マスクの改善 (オープニング・クロージング処理)
                kernel = np.ones((5, 5), np.uint8)
                final_mask = cv2.morphologyEx(final_mask, cv2.MORPH_CLOSE, kernel)
                final_mask = cv2.morphologyEx(final_mask, cv2.MORPH_OPEN, kernel)

                # 前景の抽出と透明度設定
                foreground = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
                foreground[:, :, 3] = final_mask * 255

                # エッジの滑らかさを改善
                foreground[:, :, 3] = cv2.GaussianBlur(foreground[:, :, 3], (3, 3), 0)

                # 結果をPNG形式で保存し、Base64エンコード
                is_success, buffer = cv2.imencode(".webp", foreground)
                if not is_success:
                    raise Exception("画像のエンコードに失敗しました。")

                img_str = base64.b64encode(buffer).decode()
                process_time = time.time() - start_time

                # 結果をJSON形式で返す
                return JsonResponse(
                    {
                        "status": "success",
                        "image": img_str,
                        "process_time": process_time,
                    }
                )

            except Exception as e:
                # エラー発生時の処理 (元の画像を返す)
                try:
                    original_bgra = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
                    is_success, buffer = cv2.imencode(".webp", original_bgra)
                    if is_success:
                        img_str = base64.b64encode(buffer).decode()
                        return JsonResponse(
                            {
                                "status": "success",
                                "image": img_str,
                                "process_time": time.time() - start_time,
                                "warning": "背景除去の処理に失敗したため、元の画像を返しています。",
                            }
                        )
                except Exception:
                    pass

                return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)
