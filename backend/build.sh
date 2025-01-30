#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
python manage.py superuser
python manage.py social_auth_setup
python manage.py load_fashion_fixtures
python manage.py load_coordinate_fixtures
