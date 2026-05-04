from django.urls import path
from .views import live_asteroids , dashboard , mining_asteroids

urlpatterns = [
    path('asteroids/', live_asteroids),
    path('', dashboard),
    path('mining/', mining_asteroids),
]