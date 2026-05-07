from django.db import models


class Asteroid(models.Model):

    name = models.CharField(
        max_length=255
    )

    avg_diameter = models.FloatField()

    velocity = models.FloatField()

    miss_distance = models.FloatField()

    hazardous = models.BooleanField(
        default=False
    )

    risk = models.IntegerField(
        default=0
    )

    source = models.CharField(
        max_length=100,
        default="SBDB CSV"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name