from allauth.socialaccount.models import SocialApp
from django.conf import settings
from django.contrib.sites.models import Site
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    def handle(self, *args, **options):
        # 開発環境と本番環境で異なるドメインを使用
        domain = settings.SITE_DOMAIN  # settings.pyで環境変数から取得

        # サイトの作成/更新
        site, _ = Site.objects.get_or_create(domain=domain, defaults={"name": "Virtual Closet"})

        # 既存のサイトのドメインを更新
        if not _:  # サイトが既に存在する場合
            site.domain = domain
            site.save()
        print(f"サイトドメインを {domain} に設定しました")

        # ソーシャルアプリケーションの設定
        social_app, created = SocialApp.objects.get_or_create(
            provider="google",
            name="NextAuth",
            client_id=settings.SOCIAL_AUTH_GOOGLE_CLIENT_ID,
            secret=settings.SOCIAL_AUTH_GOOGLE_SECRET,
        )

        social_app.sites.add(site)
        print("ソーシャルアプリケーションの設定を完了しました")
