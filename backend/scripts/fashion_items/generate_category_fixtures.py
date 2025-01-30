import json
import os

categories = [
    {"id": "tops", "category_name": "トップス"},
    {"id": "bottoms", "category_name": "ボトムス"},
    {"id": "dress", "category_name": "ワンピース"},
    {"id": "setup", "category_name": "セットアップ"},
    {"id": "outer", "category_name": "アウター"},
    {"id": "shoes", "category_name": "シューズ"},
    {"id": "bag", "category_name": "バッグ"},
    {"id": "legwear", "category_name": "レッグウェア"},
    {"id": "fashion_goods", "category_name": "ファッション雑貨"},
    {"id": "accessory", "category_name": "アクセサリー"},
    {"id": "other", "category_name": "その他"},
]

# リストの初期化
fixtures = []
# データのループ処理とfixturesの生成:
for _i, category in enumerate(categories, start=1):
    fixture = {
        "model": "fashion_items.category",
        "pk": category["id"],
        "fields": {"category_name": category["category_name"]},
    }
    fixtures.append(fixture)


# ファイルの保存先パスを指定
output_path = "apps/fashion_items/fixtures/initial_category_data.json"

# fixturesデータのJSONファイルへの保存
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)

print("Fixtures file generated successfully!")
