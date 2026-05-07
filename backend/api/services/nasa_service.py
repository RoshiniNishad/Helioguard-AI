import requests

def fetch_asteroids():
    url = "https://api.nasa.gov/neo/rest/v1/feed?api_key=FpTu44Af7fyYgZzk1mfgjdmQUK9cAsqRhQWKzpcB"
    data = requests.get(url).json()

    asteroids = []

    for date in data['near_earth_objects']:
        for obj in data['near_earth_objects'][date]:
            asteroids.append({
                "name": obj["name"],
                "diameter": obj["estimated_diameter"]["meters"]["estimated_diameter_max"],
                "velocity": float(obj["close_approach_data"][0]["relative_velocity"]["kilometers_per_hour"]),
                "distance": float(obj["close_approach_data"][0]["miss_distance"]["kilometers"])
            })

    return asteroids