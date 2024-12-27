import json
import os

scenes = [
    # ラフ系
    {"scene": "休日"},
    {"scene": "散歩"},
    {"scene": "アウトドア"},
    {"scene": "買い物"},
    # 食事
    {"scene": "ランチ"},
    {"scene": "ディナー"},
    {"scene": "カフェ"},
    {"scene": "飲み会"},
    # 予定
    {"scene": "おでかけ"},
    {"scene": "デート"},
    {"scene": "旅行"},
    {"scene": "イベント"},
    {"scene": "パーティー"},
    {"scene": "スポーツ観戦"},
    {"scene": "結婚式"},
    # その他
    {"scene": "通勤"},
    {"scene": "オフィスカジュアル"},
    {"scene": "学校"},
    {"scene": "ドライブ"},
    {"scene": "その他"},
]

# リストの初期化
fixtures = []
# シーンデータのループ処理とfixturesの生成:
for i, scene in enumerate(scenes, start=1):
    fixture = {"model": "coordinate.scene", "pk": i, "fields": scene}
    fixtures.append(fixture)

# ファイルの保存先パスを指定
output_path = "apps/coordinate/fixtures/initial_scene_data.json"

# fixturesデータのJSONファイルへの保存
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)


print("Scene fixtures file generated successfully!")
