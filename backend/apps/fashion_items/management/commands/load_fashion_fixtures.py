from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Load all fashion items initial data fixtures"

    def handle(self, *args, **kwargs):
        fixtures = [
            "initial_brand_data",
            "initial_category_data",
            "initial_subcategory_data",
            "initial_design_data",
            "initial_pricerange_data",
            "initial_color_data",
            "initial_season_data",
        ]

        for fixture in fixtures:
            call_command("loaddata", fixture)
            print(f"{fixture}のデータを読み込みました")
