import requests
import pandas as pd

url = "https://ssd-api.jpl.nasa.gov/sbdb_query.api"

params = {
    "fields": "full_name,diameter,moid",
    "limit": 1000
}

response = requests.get(url, params=params)
data = response.json()

asteroids = []

for row in data["data"]:

    diameter = row[1]

    asteroids.append({
        "name": row[0],

        # Using same value as approximation
        "diameter_min": diameter,
        "diameter_max": diameter,

        # Velocity not available directly
        "velocity": None,

        "miss_distance": row[2],

        # Hazardous approximation
        "hazardous": True if float(row[2]) < 0.05 else False
    })

df = pd.DataFrame(asteroids)

df.to_csv("data/raw/asteroids_raw.csv", index=False)

print("✅ SBDB data saved in NASA-like format!")