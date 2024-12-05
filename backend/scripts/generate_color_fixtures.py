import json
import os

colors = [
    {"id": "white", "color_name": "ホワイト", "color_code": "#FFFFFF"},
    {"id": "black", "color_name": "ブラック", "color_code": "#000000"},
    {"id": "gray", "color_name": "グレー", "color_code": "#7d7d7d"},
    {"id": "brown", "color_name": "ブラウン", "color_code": "#8f6552"},
    {"id": "beige", "color_name": "ベージュ", "color_code": "#F5F5DC"},
    {"id": "green", "color_name": "グリーン", "color_code": "#00a960"},
    {"id": "khaki", "color_name": "カーキ", "color_code": "#c5a05a"},
    {"id": "olive_green", "color_name": "オリーブグリーン", "color_code": "#5f6527"},
    {"id": "navy", "color_name": "ネイビー", "color_code": "#202f55"},
    {"id": "blue", "color_name": "ブルー", "color_code": "#0000ff"},
    {"id": "purple", "color_name": "パープル", "color_code": "#9E76B4"},
    {"id": "yellow", "color_name": "イエロー", "color_code": "#FFC20E"},
    {"id": "pink", "color_name": "ピンク", "color_code": "#F067A6"},
    {"id": "red", "color_name": "レッド", "color_code": "#ED1A3D"},
    {"id": "bordeaux", "color_name": "ボルドー", "color_code": "#6c272d"},
    {"id": "orange", "color_name": "オレンジ", "color_code": "#ee7800"},
    {"id": "silver", "color_name": "シルバー", "color_code": "#c0c0c0"},
    {"id": "gold", "color_name": "ゴールド", "color_code": "#ffd700"},
    {"id": "other", "color_name": "その他", "color_code": "#FFFFFF"},  # 白に設定
]

fixtures = []
for color in colors:
    fixture = {
        "model": "fashion_items.color",
        "pk": color["id"],
        "fields": {
            "color_name": color["color_name"],
            "color_code": color["color_code"],
        },
    }
    fixtures.append(fixture)


# ファイルの保存先パスを指定
output_path = "apps/fashion_items/fixtures/initial_color_data.json"

# fixturesデータのJSONファイルへの保存
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)


print("Color fixtures file generated successfully!")
