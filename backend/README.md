# 初期データについて

1. 初期データファイル（JSON）作成コマンド（作成時、変更時のみ実行）:

```bash
python scripts/fashion_items/generate_brand_fixtures.py
python scripts/fashion_items/generate_category_fixtures.py
python scripts/fashion_items/generate_color_fixtures.py
python scripts/fashion_items/generate_design_fixtures.py
python scripts/fashion_items/generate_pricerange_fixtures.py
python scripts/fashion_items/generate_season_fixtures.py
python scripts/fashion_items/generate_subcategory_fixtures.py

python scripts/coordinate/generate_scene_fixtures.py
python scripts/coordinate/generate_taste_fixtures.py
```

2. 投入コマンド:
   すでにデータがある場合には以下を先に実行（データがクリアされるので注意）

```bash
python manage.py flush

```

```bash
python manage.py loaddata initial_brand_data.json
python manage.py loaddata initial_category_data.json
python manage.py loaddata initial_subcategory_data.json
python manage.py loaddata initial_design_data.json
python manage.py loaddata initial_pricerange_data.json
python manage.py loaddata initial_color_data.json
python manage.py loaddata initial_season_data.json

python manage.py loaddata initial_scene_data.json
python manage.py loaddata initial_taste_data.json
```
