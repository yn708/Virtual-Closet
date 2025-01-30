# 初回実行コマンド

1. migrate
2. superuser：スーパーユーザーの作成コマンド
3. social_auth_setup：NextAuth 用のソーシャルアプリケーション作成コマンド
4. load_fashion_fixtures & load_coordinate_fixtures 初期データ投入コマンド

```bash
python manage.py migrate
python manage.py superuser
python manage.py social_auth_setup
python manage.py load_fashion_fixtures
python manage.py load_coordinate_fixtures
```
