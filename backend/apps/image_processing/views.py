import base64
import io
import time

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt  #
from PIL import Image
from rembg import remove
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


@csrf_exempt
# CSRFトークンの検証を無効化するデコレータ

@api_view(["POST"])
# 指定したHTTPメソッド（POST）のリクエストのみを許可

@permission_classes([IsAuthenticated])  # 認証されたユーザーのみ
def remove_bg(request):
    # リクエストがPOSTメソッドの場合のみ
    if request.method == "POST":
        start_time = time.time()  # 処理時間計測開始
        image_file = request.FILES.get("image")  # リクエストからアップロードされた画像ファイルを取得

        if image_file:  # 画像が正常に取得された場合
            try:
                # 画像ファイルを開き、PillowのImageオブジェクトとして読み込む
                input_image = Image.open(image_file)

                # 背景除去処理
                output_image = remove(input_image)

                # 透明部分を除いた実際の被写体の範囲を取得
                bbox = output_image.getbbox()

                # 被写体の範囲でクロップ
                cropped_image = output_image.crop(bbox)

                # バイトバッファを作成し、処理後の画像をPNG形式でバッファに保存
                buffered = io.BytesIO()
                cropped_image.save(buffered, format="PNG")

                # バッファ内の画像データをBase64形式にエンコードし、文字列として取得
                img_str = base64.b64encode(buffered.getvalue()).decode()

                # 処理時間を計算
                process_time = time.time() - start_time

                # 成功レスポンスをJSON形式で返す
                return JsonResponse(
                    {
                        "status": "success",  # 処理が成功したことを示すステータス
                        "image": img_str,  # Base64エンコードされた画像データ
                        "process_time": process_time,  # 処理にかかった時間
                    }
                )
            except Exception as e:  # 処理中に例外が発生した場合
                # エラーメッセージと500ステータスコードを含むJSONレスポンスを返す
                return JsonResponse(
                    {
                        "status": "error",  # エラーが発生したことを示すステータス
                        "message": str(e),  # エラーメッセージの詳細
                    },
                    status=500,
                )
    # POSTリクエスト以外または画像ファイルが送信されていない場合のエラーレスポンス
    return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)
