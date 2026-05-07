from django.contrib import admin
from .models import Asteroid


@admin.register(Asteroid)
class AsteroidAdmin(admin.ModelAdmin):

    list_display = (
        "name",
        "avg_diameter",
        "velocity",
        "miss_distance",
        "hazardous",
        "risk",
        "source"
    )

    search_fields = (
        "name",
        "source"
    )

    list_filter = (
        "hazardous",
        "risk"
    )