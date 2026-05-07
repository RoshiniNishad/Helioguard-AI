import requests
import pandas as pd

API_KEY = "FpTu44Af7fyYgZzk1mfgjdmQUK9cAsqRhQWKzpcB"   

url = f"https://api.nasa.gov/neo/rest/v1/feed?api_key={API_KEY}"
response = requests.get(url)
data = response.json()

asteroids = []

for date in data['near_earth_objects']:
    for obj in data['near_earth_objects'][date]:
        asteroids.append({
            "name": obj["name"],
            "diameter_min": obj["estimated_diameter"]["meters"]["estimated_diameter_min"],
            "diameter_max": obj["estimated_diameter"]["meters"]["estimated_diameter_max"],
            "velocity": float(obj["close_approach_data"][0]["relative_velocity"]["kilometers_per_hour"]),
            "miss_distance": float(obj["close_approach_data"][0]["miss_distance"]["kilometers"]),
            "hazardous": obj["is_potentially_hazardous_asteroid"]
        })

df = pd.DataFrame(asteroids)

df.to_csv("data/raw/asteroids_raw.csv", index=False)

print("✅ Data saved successfully!")