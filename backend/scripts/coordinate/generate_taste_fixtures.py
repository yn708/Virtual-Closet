import json
import os

tastes = [
    {"taste": "古着Mix/ヴィンテージ"},
    {"taste": "きれいめ"},
    {"taste": "カジュアル"},
    {"taste": "シンプル"},
    {"taste": "ナチュラル/リラックス"},
    {"taste": "ストリート"},
    {"taste": "スポーティー"},
    {"taste": "モード"},
    {"taste": "ガーリー/フェミニン"},
    {"taste": "ロック"},
    {"taste": "ミリタリー"},
    {"taste": "セレブティ"},
    {"taste": "その他"},
]

# リストの初期化
fixtures = []
# テイストデータのループ処理とfixturesの生成:
for i, taste in enumerate(tastes, start=1):
    fixture = {"model": "coordinate.taste", "pk": i, "fields": taste}
    fixtures.append(fixture)

# ファイルの保存先パスを指定
output_path = "apps/coordinate/fixtures/initial_taste_data.json"

# fixturesデータのJSONファイルへの保存
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)

print("Taste fixtures file generated successfully!")
