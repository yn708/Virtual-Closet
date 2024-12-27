import json
import os

designs = [
    {"id": "plain", "design_pattern": "無地"},
    {"id": "onePoint", "design_pattern": "ワンポイント"},
    {"id": "backPrint", "design_pattern": "バックプリント"},
    {"id": "border", "design_pattern": "ボーダー"},
    {"id": "stripe", "design_pattern": "ストライプ"},
    {"id": "check", "design_pattern": "チェック"},
    {"id": "floral", "design_pattern": "花柄"},
    {"id": "animal", "design_pattern": "アニマル柄"},
    {"id": "graphic", "design_pattern": "グラフィック柄"},
    {"id": "other", "design_pattern": "その他"},
]

fixtures = []
for design in designs:
    fixture = {
        "model": "fashion_items.design",
        "pk": design["id"],
        "fields": {
            "design_pattern": design["design_pattern"],
        },
    }
    fixtures.append(fixture)


# ファイルの保存先パスを指定
output_path = "apps/fashion_items/fixtures/initial_design_data.json"

# fixturesデータのJSONファイルへの保存
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)


print("Design fixtures file generated successfully!")
