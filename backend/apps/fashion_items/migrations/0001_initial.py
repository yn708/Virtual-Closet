# Generated by Django 5.1 on 2024-12-16 01:34

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Brand',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('brand_name', models.CharField(max_length=100, unique=True)),
                ('brand_name_kana', models.CharField(max_length=100)),
                ('is_popular', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('category_name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Color',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('color_name', models.CharField(max_length=50, unique=True)),
                ('color_code', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='Design',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('design_pattern', models.CharField(max_length=50, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='PriceRange',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('price_range', models.CharField(max_length=100, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Season',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('season_name', models.CharField(max_length=20, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='SubCategory',
            fields=[
                ('id', models.CharField(max_length=50, primary_key=True, serialize=False)),
                ('subcategory_name', models.CharField(max_length=100)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subcategories', to='fashion_items.category')),
            ],
        ),
        migrations.CreateModel(
            name='FashionItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='作成日時')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='更新日時')),
                ('image', models.ImageField(upload_to='fashion_item/')),
                ('is_owned', models.BooleanField(default=True)),
                ('is_old_clothes', models.BooleanField(default=False)),
                ('brand', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='fashion_items.brand')),
                ('design', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='fashion_items.design')),
                ('main_color', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='fashion_items.color')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('price_range', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='fashion_items.pricerange')),
                ('seasons', models.ManyToManyField(blank=True, to='fashion_items.season')),
                ('sub_category', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='fashion_items.subcategory')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
