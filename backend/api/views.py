from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services.asteroid_service import get_predictions
from django.shortcuts import render
from api.services.mining_service import get_mining_predictions

from api.models import Asteroid

@api_view(['GET'])
def test(request):
    return Response({"message": "Backend working"})

@api_view(['GET'])
def live_asteroids(request):
    data = get_predictions()
    return Response(data)


def dashboard(request):
    return render(request, "dashboard.html")

@api_view(['GET'])
def mining_asteroids(request):
    data = get_mining_predictions()
    return Response(data)


@api_view(['GET'])
def database_asteroids(request):

    asteroids = Asteroid.objects.all()

    data = []

    for asteroid in asteroids:

        data.append({

            "id": asteroid.id,

            "name": asteroid.name,

            "avg_diameter": asteroid.avg_diameter,

            "velocity": asteroid.velocity,

            "miss_distance": asteroid.miss_distance,

            "hazardous": asteroid.hazardous,

            "risk": asteroid.risk,

            "source": asteroid.source,

            "created_at": asteroid.created_at,
        })

    return Response(data)