import json
import os

seasons = [
    {"id": "spring", "season_name": "春"},
    {"id": "summer", "season_name": "夏"},
    {"id": "autumn", "season_name": "秋"},
    {"id": "winter", "season_name": "冬"},
]

fixtures = []
for _i, season in enumerate(seasons, start=1):
    fixture = {
        "model": "fashion_items.season",
        "pk": season["id"],
        "fields": {
            "season_name": season["season_name"],
        },
    }
    fixtures.append(fixture)


# ファイルの保存先パスを指定
output_path = "apps/fashion_items/fixtures/initial_season_data.json"

# fixturesデータのJSONファイルへの保存
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)

print("Season fixtures file generated successfully!")
