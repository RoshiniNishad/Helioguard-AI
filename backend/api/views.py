from rest_framework.decorators import api_view
from rest_framework.response import Response
from api.services.asteroid_service import get_predictions
from django.shortcuts import render
from api.services.mining_service import get_mining_predictions

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