## 初期データ作成

<!-- 初期データファイル（JSON）作成 -->

python scripts/generate_brand_fixtures.py
python scripts/generate_category_fixtures.py
python scripts/generate_color_fixtures.py
python scripts/generate_design_fixtures.py
python scripts/generate_pricerange_fixtures.py
python scripts/generate_season_fixtures.py
python scripts/generate_subcategory_fixtures.py

<!-- データがクリアされるので注意 -->
<!-- 投入コマンド -->

python manage.py flush
python manage.py loaddata initial_brand_data.json
python manage.py loaddata initial_category_data.json
python manage.py loaddata initial_subcategory_data.json
python manage.py loaddata initial_design_data.json
python manage.py loaddata initial_pricerange_data.json
python manage.py loaddata initial_color_data.json
python manage.py loaddata initial_season_data.json
