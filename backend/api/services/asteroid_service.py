import joblib
import pandas as pd
import os
import requests

API_KEY = "FpTu44Af7fyYgZzk1mfgjdmQUK9cAsqRhQWKzpcB"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "../../models/risk_model.pkl")

model = joblib.load(MODEL_PATH)

features = ['avg_diameter', 'velocity', 'miss_distance']


def get_predictions():
    results = []

    url = f"https://api.nasa.gov/neo/rest/v1/feed?api_key={API_KEY}"
    response = requests.get(url)
    data = response.json()

    asteroids = data.get('near_earth_objects', {})

    for date in asteroids:
        for asteroid in asteroids[date]:

            try:
                cad = asteroid.get('close_approach_data', [])

                if len(cad) == 0:
                    continue

                cad0 = cad[0]

                diameter_min = asteroid['estimated_diameter']['meters']['estimated_diameter_min']
                diameter_max = asteroid['estimated_diameter']['meters']['estimated_diameter_max']

                velocity = float(cad0['relative_velocity']['kilometers_per_hour'])
                miss_distance = float(cad0['miss_distance']['kilometers'])

                date_approach = cad0['close_approach_date']
                orbiting = cad0['orbiting_body']
                nasa_flag = asteroid['is_potentially_hazardous_asteroid']

                df = pd.DataFrame([[diameter_max, velocity, miss_distance]], columns=features)

                prediction = model.predict(df)[0]

                results.append({
                    "name": asteroid['name'],
                    "risk": int(prediction),

                    "diameter_min": diameter_min,
                    "diameter_max": diameter_max,
                    "velocity": velocity,
                    "miss_distance": miss_distance,
                    "date": date_approach,
                    "orbiting": orbiting,
                    "nasa_hazardous": nasa_flag
                })

            except Exception as e:
                print("ERROR:", e)
                continue

    return results