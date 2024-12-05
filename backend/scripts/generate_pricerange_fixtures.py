import json
import os

price_ranges = [
    {"id": "under_1000", "price_range": "〜 ¥999"},
    {"id": "between_1000_1999", "price_range": "¥1,000 〜 ¥1,999"},
    {"id": "between_2000_2999", "price_range": "¥2,000 〜 ¥2,999"},
    {"id": "between_3000_3999", "price_range": "¥3,000 〜 ¥3,999"},
    {"id": "between_4000_4999", "price_range": "¥4,000 〜 ¥4,999"},
    {"id": "between_5000_5999", "price_range": "¥5,000 〜 ¥5,999"},
    {"id": "between_6000_6999", "price_range": "¥6,000 〜 ¥6,999"},
    {"id": "between_7000_7999", "price_range": "¥7,000 〜 ¥7,999"},
    {"id": "between_8000_8999", "price_range": "¥8,000 〜 ¥8,999"},
    {"id": "between_9000_9999", "price_range": "¥9,000 〜 ¥9,999"},
    {"id": "between_10000_14999", "price_range": "¥10,000 〜 ¥14,999"},
    {"id": "between_15000_19999", "price_range": "¥15,000 〜 ¥19,999"},
    {"id": "between_20000_24999", "price_range": "¥20,000 〜 ¥24,999"},
    {"id": "between_25000_29999", "price_range": "¥25,000 〜 ¥29,999"},
    {"id": "between_30000_34999", "price_range": "¥30,000 〜 ¥34,999"},
    {"id": "between_35000_39999", "price_range": "¥35,000 〜 ¥39,999"},
    {"id": "between_40000_44999", "price_range": "¥40,000 〜 ¥44,999"},
    {"id": "between_45000_49999", "price_range": "¥45,000 〜 ¥49,999"},
    {"id": "between_50000_59999", "price_range": "¥50,000 〜 ¥59,999"},
    {"id": "between_60000_69999", "price_range": "¥60,000 〜 ¥69,999"},
    {"id": "between_70000_79999", "price_range": "¥70,000 〜 ¥79,999"},
    {"id": "between_80000_89999", "price_range": "¥80,000 〜 ¥89,999"},
    {"id": "between_90000_99999", "price_range": "¥90,000 〜 ¥99,999"},
    {"id": "over_100000", "price_range": "¥100,000以上"},
]

fixtures = []
for price_range in price_ranges:
    fixture = {
        "model": "fashion_items.pricerange",
        "pk": price_range["id"],
        "fields": {
            "price_range": price_range["price_range"],
        },
    }
    fixtures.append(fixture)

# ファイルの保存先パスを指定
output_path = "apps/fashion_items/fixtures/initial_pricerange_data.json"

# fixturesデータのJSONファイルへの保存
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(fixtures, f, ensure_ascii=False, indent=2)


print("PriceRange fixtures file generated successfully!")
