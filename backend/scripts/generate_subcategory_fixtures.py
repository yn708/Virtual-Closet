import json
import os

subcategories = [
    # トップス
    {"id": "tshirt", "subcategory_name": "Tシャツ/カットソー", "category": "tops"},
    {"id": "tank", "subcategory_name": "タンクトップ", "category": "tops"},
    {"id": "shirt", "subcategory_name": "シャツ", "category": "tops"},
    {"id": "polo", "subcategory_name": "ポロシャツ", "category": "tops"},
    {"id": "sweat", "subcategory_name": "スウェット", "category": "tops"},
    {"id": "hoodie", "subcategory_name": "パーカー", "category": "tops"},
    {"id": "pullover", "subcategory_name": "プルオーバー", "category": "tops"},
    {"id": "knit", "subcategory_name": "ニット/セーター", "category": "tops"},
    {"id": "blouse", "subcategory_name": "ブラウス", "category": "tops"},
    {"id": "inner", "subcategory_name": "インナー", "category": "tops"},
    {"id": "other_tops", "subcategory_name": "その他", "category": "tops"},
    # ボトムス
    {"id": "short_pants", "subcategory_name": "ショートパンツ", "category": "bottoms"},
    {"id": "half_pants", "subcategory_name": "ハーフパンツ", "category": "bottoms"},
    {"id": "skinny", "subcategory_name": "スキニーパンツ", "category": "bottoms"},
    {"id": "denim", "subcategory_name": "デニムパンツ", "category": "bottoms"},
    {"id": "slacks", "subcategory_name": "スラックス", "category": "bottoms"},
    {"id": "tapered", "subcategory_name": "テーパードパンツ", "category": "bottoms"},
    {"id": "jogger", "subcategory_name": "ジョガーパンツ", "category": "bottoms"},
    {"id": "wide", "subcategory_name": "ワイドパンツ", "category": "bottoms"},
    {"id": "knit_pants", "subcategory_name": "ニットパンツ", "category": "bottoms"},
    {"id": "chino", "subcategory_name": "チノパン", "category": "bottoms"},
    {"id": "cargo", "subcategory_name": "カーゴパンツ", "category": "bottoms"},
    {"id": "sweat_pants", "subcategory_name": "スウェットパンツ", "category": "bottoms"},
    {"id": "skirt", "subcategory_name": "スカート", "category": "bottoms"},
    {"id": "flare", "subcategory_name": "フレアパンツ", "category": "bottoms"},
    {"id": "other_bottoms", "subcategory_name": "その他", "category": "bottoms"},
    # ワンピース
    {"id": "dress", "subcategory_name": "ワンピース", "category": "dress"},
    {"id": "overall", "subcategory_name": "オーバーオール", "category": "dress"},
    {"id": "other_dress", "subcategory_name": "その他", "category": "dress"},
    # セットアップ
    {"id": "suit", "subcategory_name": "スーツ", "category": "setup"},
    {"id": "setup", "subcategory_name": "セットアップ", "category": "setup"},
    {"id": "other_setup", "subcategory_name": "その他", "category": "setup"},
    # アウター
    {"id": "cardigan", "subcategory_name": "カーディガン", "category": "outer"},
    {"id": "vest", "subcategory_name": "ベスト", "category": "outer"},
    {"id": "down_vest", "subcategory_name": "ダウンベスト", "category": "outer"},
    {"id": "tailored_jacket", "subcategory_name": "テーラードジャケット", "category": "outer"},
    {"id": "no_collar_jacket", "subcategory_name": "ノーカラージャケット", "category": "outer"},
    {"id": "riders_jacket", "subcategory_name": "ライダースジャケット", "category": "outer"},
    {"id": "leather_jacket", "subcategory_name": "レザージャケット", "category": "outer"},
    {"id": "military_jacket", "subcategory_name": "ミリタリージャケット", "category": "outer"},
    {"id": "quilted_jacket", "subcategory_name": "キルティングジャケット", "category": "outer"},
    {"id": "denim_jacket", "subcategory_name": "デニムジャケット", "category": "outer"},
    {"id": "down_jacket", "subcategory_name": "ダウンジャケット", "category": "outer"},
    {"id": "boa_jacket", "subcategory_name": "ボアジャケット", "category": "outer"},
    {"id": "blouson", "subcategory_name": "ブルゾン/MA-1", "category": "outer"},
    {"id": "stadium_jumper", "subcategory_name": "スタジャン", "category": "outer"},
    {"id": "mountain_parka", "subcategory_name": "マウンテンパーカー", "category": "outer"},
    {"id": "chester_coat", "subcategory_name": "チェスターコート", "category": "outer"},
    {"id": "no_collar_coat", "subcategory_name": "ノーカラーコート", "category": "outer"},
    {"id": "trench_coat", "subcategory_name": "トレンチコート", "category": "outer"},
    {"id": "pea_coat", "subcategory_name": "Pコート", "category": "outer"},
    {"id": "duffle_coat", "subcategory_name": "ダッフルコート", "category": "outer"},
    {"id": "quilted_coat", "subcategory_name": "キルティングコート", "category": "outer"},
    {"id": "down_coat", "subcategory_name": "ダウンコート", "category": "outer"},
    {"id": "other_outer", "subcategory_name": "その他", "category": "outer"},
    # シューズ
    {"id": "sneakers", "subcategory_name": "スニーカー", "category": "shoes"},
    {"id": "sandals", "subcategory_name": "サンダル", "category": "shoes"},
    {"id": "loafers", "subcategory_name": "ローファー", "category": "shoes"},
    {"id": "pumps", "subcategory_name": "パンプス", "category": "shoes"},
    {"id": "dress_shoes", "subcategory_name": "ドレスシューズ", "category": "shoes"},
    {"id": "boots", "subcategory_name": "ブーツ", "category": "shoes"},
    {"id": "slip_ons", "subcategory_name": "スリッポン", "category": "shoes"},
    {"id": "other_shoes", "subcategory_name": "その他", "category": "shoes"},
    # バッグ
    {"id": "clutch", "subcategory_name": "クラッチバッグ", "category": "bag"},
    {"id": "handbag", "subcategory_name": "ハンドバッグ", "category": "bag"},
    {"id": "shoulder_bag", "subcategory_name": "ショルダーバッグ", "category": "bag"},
    {"id": "tote_bag", "subcategory_name": "トートバッグ", "category": "bag"},
    {"id": "boston_bag", "subcategory_name": "ボストンバッグ", "category": "bag"},
    {"id": "backpack", "subcategory_name": "リュック", "category": "bag"},
    {"id": "other_bag", "subcategory_name": "その他", "category": "bag"},
    # レッグウェア
    {"id": "socks", "subcategory_name": "ソックス", "category": "legwear"},
    {"id": "other_legwear", "subcategory_name": "その他", "category": "legwear"},
    # ファッション雑貨
    {"id": "glasses", "subcategory_name": "メガネ", "category": "fashion_goods"},
    {"id": "sunglasses", "subcategory_name": "サングラス", "category": "fashion_goods"},
    {"id": "watch", "subcategory_name": "腕時計", "category": "fashion_goods"},
    {"id": "belt", "subcategory_name": "ベルト", "category": "fashion_goods"},
    {"id": "tie", "subcategory_name": "ネクタイ", "category": "fashion_goods"},
    {"id": "stole", "subcategory_name": "ストール", "category": "fashion_goods"},
    {"id": "scarf", "subcategory_name": "スカーフ", "category": "fashion_goods"},
    {"id": "muffler", "subcategory_name": "マフラー", "category": "fashion_goods"},
    {"id": "cap", "subcategory_name": "キャップ", "category": "fashion_goods"},
    {"id": "hat", "subcategory_name": "ハット", "category": "fashion_goods"},
    {"id": "other_fashion_goods", "subcategory_name": "その他", "category": "fashion_goods"},
    # ファッション雑貨
    {"id": "glasses", "subcategory_name": "メガネ", "category": "fashion_goods"},
    {"id": "sunglasses", "subcategory_name": "サングラス", "category": "fashion_goods"},
    {"id": "watch", "subcategory_name": "腕時計", "category": "fashion_goods"},
    {"id": "belt", "subcategory_name": "ベルト", "category": "fashion_goods"},
    {"id": "tie", "subcategory_name": "ネクタイ", "category": "fashion_goods"},
    {"id": "stole", "subcategory_name": "ストール", "category": "fashion_goods"},
    {"id": "scarf", "subcategory_name": "スカーフ", "category": "fashion_goods"},
    {"id": "muffler", "subcategory_name": "マフラー", "category": "fashion_goods"},
    {"id": "cap", "subcategory_name": "キャップ", "category": "fashion_goods"},
    {"id": "hat", "subcategory_name": "ハット", "category": "fashion_goods"},
    {"id": "knit_cap", "subcategory_name": "ニット帽", "category": "fashion_goods"},
    {"id": "beret", "subcategory_name": "ベレー帽", "category": "fashion_goods"},
    {"id": "hunting_cap", "subcategory_name": "ハンチング", "category": "fashion_goods"},
    {"id": "other_fashion_goods", "subcategory_name": "その他", "category": "fashion_goods"},
    # アクセサリー
    {"id": "earrings", "subcategory_name": "ピアス/イヤリング", "category": "accessory"},
    {"id": "ring", "subcategory_name": "リング", "category": "accessory"},
    {"id": "bracelet", "subcategory_name": "ブレスレット", "category": "accessory"},
    {"id": "bangle", "subcategory_name": "バングル", "category": "accessory"},
    {"id": "necklace", "subcategory_name": "ネックレス", "category": "accessory"},
    {"id": "anklet", "subcategory_name": "アンクレット", "category": "accessory"},
    {"id": "brooch", "subcategory_name": "ブローチ", "category": "accessory"},
    {"id": "hair_accessory", "subcategory_name": "ヘアアクセサリー", "category": "accessory"},
    {"id": "other_accessory", "subcategory_name": "その他", "category": "accessory"},
    # その他
    {"id": "kimono", "subcategory_name": "着物/浴衣", "category": "other"},
    {"id": "other_other", "subcategory_name": "その他", "category": "other"},
]

# サブカテゴリーデータの生成
fixtures = []
for _i, subcategory in enumerate(subcategories, start=1):
    fixture = {
        "model": "fashion_items.subcategory",
        "pk": subcategory["id"],
        "fields": {"subcategory_name": subcategory["subcategory_name"], "category": subcategory["category"]},
    }
    fixtures.append(fixture)

# ファイルの保存先パスを指定
output_path = "apps/fashion_items/fixtures/initial_subcategory_data.json"

# fixturesデータのJSONファイルへの保存
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)


print("SubCategory fixtures file generated successfully!")
