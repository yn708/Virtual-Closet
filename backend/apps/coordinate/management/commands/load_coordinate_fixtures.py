from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Load all coordinate initial data fixtures"

    def handle(self, *args, **kwargs):
        fixtures = [
            "initial_scene_data",
            "initial_taste_data",
        ]

        for fixture in fixtures:
            call_command("loaddata", fixture)
            print(f"{fixture}のデータを読み込みました")
