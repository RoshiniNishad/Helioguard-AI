import joblib
import pandas as pd
import os
import requests

API_KEY = "FpTu44Af7fyYgZzk1mfgjdmQUK9cAsqRhQWKzpcB"

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "../../models/mining_model.pkl")

model = joblib.load(MODEL_PATH)


def get_mining_predictions():
    results = []

    url = f"https://api.nasa.gov/neo/rest/v1/feed?api_key={API_KEY}"

    try:
        response = requests.get(url, timeout=6)
        response.raise_for_status()
        data = response.json()

    except Exception as e:
        print("NASA API ERROR:", e)

        # 🔥 fallback data
        return [
            {
                "name": "Fallback Asteroid",
                "profitable": 1,
                "diameter": 120,
                "velocity": 45000,
                "miss_distance": 5000000,
                "image": "https://source.unsplash.com/400x300/?asteroid"
            }
        ]

    asteroids = data.get('near_earth_objects', {})

    for date in asteroids:
        for asteroid in asteroids[date]:

            try:
                cad = asteroid.get('close_approach_data', [])

                velocity = 0
                miss_distance = 0

                if len(cad) > 0:
                    cad0 = cad[0]
                    velocity = float(cad0['relative_velocity']['kilometers_per_hour'])
                    miss_distance = float(cad0['miss_distance']['kilometers'])

                diameter = asteroid['estimated_diameter']['meters']['estimated_diameter_max']

                # 🔥 ML Prediction
                df = pd.DataFrame([[diameter, velocity, miss_distance]],
                                  columns=['diameter', 'velocity', 'miss_distance'])

                try:
                    ml_pred = model.predict(df)[0]
                except:
                    ml_pred = 0

                # 🔥 RULE BASED (IMPORTANT FIX)
                rule_pred = 1 if (
                    diameter > 100 and
                    velocity < 60000 and
                    miss_distance < 20000000
                ) else 0

                # 🔥 FINAL DECISION (HYBRID)
                final_pred = 1 if (ml_pred == 1 or rule_pred == 1) else 0

                results.append({
                    "name": asteroid['name'],
                    "profitable": int(final_pred),

                    "diameter": diameter,
                    "velocity": velocity,
                    "miss_distance": miss_distance,

                    # 🔥 IMAGE ADD
                    "image": f"https://source.unsplash.com/400x300/?asteroid,{asteroid['name']}"
                })

            except Exception as e:
                print("ERROR:", e)
                continue

    return results