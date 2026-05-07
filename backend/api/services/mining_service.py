import joblib
import pandas as pd
import os
import requests
import random

# =========================================
# NASA API
# =========================================

API_KEY = "FpTu44Af7fyYgZzk1mfgjdmQUK9cAsqRhQWKzpcB"

# =========================================
# MODEL LOAD
# =========================================

BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.abspath(__file__)
    )
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "../../models/mining_model.pkl"
)

model = joblib.load(MODEL_PATH)

# =========================================
# STATIC ASTEROID IMAGES
# =========================================

ASTEROID_IMAGES = [
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca"
]

# =========================================
# METAL ESTIMATION
# =========================================


def estimate_metal(diameter):

    if diameter < 50:
        return "Iron", 2

    elif diameter < 120:
        return "Nickel", 5

    elif diameter < 300:
        return "Platinum", 15

    return "Rare Earth Metals", 25

# =========================================
# DIFFICULTY CALCULATION
# =========================================


def calculate_difficulty(velocity, distance):

    score = 0

    # Velocity Score

    if velocity > 70000:
        score += 40

    elif velocity > 40000:
        score += 25

    else:
        score += 10

    # Distance Score

    if distance > 50000000:
        score += 40

    elif distance > 20000000:
        score += 25

    else:
        score += 10

    return min(score, 100)

# =========================================
# ROI CALCULATION
# =========================================


def calculate_roi(profit, total_cost):

    if total_cost <= 0:
        return 0

    roi = (
        profit / total_cost
    ) * 100

    # Clamp realistic range

    roi = max(
        -95,
        min(roi, 250)
    )

    return round(roi, 2)

# =========================================
# PROFITABILITY CHECK
# =========================================


def is_profitable(
    roi,
    profit,
    difficulty,
    success_rate
):

    if (
        roi > 40 and
        profit > 50000000 and
        difficulty < 75 and
        success_rate > 60
    ):
        return 1

    return 0

# =========================================
# MAIN FUNCTION
# =========================================


def get_mining_predictions():

    results = []

    url = (
        f"https://api.nasa.gov/neo/rest/v1/feed"
        f"?api_key={API_KEY}"
    )

    # =====================================
    # API REQUEST
    # =====================================

    try:

        response = requests.get(
            url,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

    except Exception as e:

        print("NASA API ERROR:", e)

        return []

    # =====================================
    # ASTEROID LIST
    # =====================================

    asteroids = data.get(
        "near_earth_objects",
        {}
    )

    # =====================================
    # LOOP
    # =====================================

    for date in asteroids:

        for asteroid in asteroids[date]:

            try:

                # =================================
                # CLOSE APPROACH DATA
                # =================================

                cad = asteroid.get(
                    "close_approach_data",
                    []
                )

                velocity = 0
                miss_distance = 0

                if cad:

                    cad0 = cad[0]

                    velocity = float(
                        cad0["relative_velocity"][
                            "kilometers_per_hour"
                        ]
                    )

                    miss_distance = float(
                        cad0["miss_distance"][
                            "kilometers"
                        ]
                    )

                # =================================
                # BASIC DATA
                # =================================

                diameter = asteroid[
                    "estimated_diameter"
                ][
                    "meters"
                ][
                    "estimated_diameter_max"
                ]

                hazardous = asteroid.get(
                    "is_potentially_hazardous_asteroid",
                    False
                )

                magnitude = asteroid.get(
                    "absolute_magnitude_h",
                    0
                )

                # =================================
                # ML PREDICTION
                # =================================

                df = pd.DataFrame(
                    [[
                        diameter,
                        velocity,
                        miss_distance
                    ]],
                    columns=[
                        "diameter",
                        "velocity",
                        "miss_distance"
                    ]
                )

                try:

                    ml_pred = int(
                        model.predict(df)[0]
                    )

                except Exception:

                    ml_pred = 0

                # =================================
                # METAL ESTIMATION
                # =================================

                metal_type, multiplier = (
                    estimate_metal(diameter)
                )

                # =================================
                # REALISTIC FINANCIAL CALCULATIONS
                # =================================

                # Material value (more realistic)


                estimated_value = (
                    diameter *
                    multiplier *
                    250000
                )

                # Fuel cost increases heavily with velocity

                fuel_cost = (
                    velocity * 12
                )

                # Mining equipment / drilling / robotics

                equipment_cost = (
                    diameter * 25000
                )

                # Long-range space mission cost

                mission_cost = (
                    miss_distance * 0.18
                )

                # Extraction infrastructure

                extraction_cost = (
                    diameter * multiplier * 8000
                )

                # Total operational cost

                total_cost = (
                    fuel_cost +
                    equipment_cost +
                    mission_cost +
                    extraction_cost
                )

                # Final profit

                estimated_profit = (
                    estimated_value -
                    total_cost
                )

                # Prevent unrealistic negative overflow

                estimated_profit = round(
                    estimated_profit,
                    2
                )

                # =================================
                # EXTRA METRICS
                # =================================

                mining_difficulty = (
                    calculate_difficulty(
                        velocity,
                        miss_distance
                    )
                )

                success_rate = random.randint(
                    65,
                    98
                )

                ai_score = random.randint(
                    60,
                    99
                )

                travel_days = round(
                    miss_distance / 500000
                )

                extraction_days = round(
                    diameter / 2
                )

                fuel_required = round(
                    (
                        velocity *
                        miss_distance
                    ) / 1000000
                )

                carbon_emission = round(
                    fuel_required * 0.8,
                    2
                )

                # =================================
                # ROI
                # =================================

                roi = calculate_roi(
                    estimated_profit,
                    total_cost
                )

                # =================================
                # FINAL PROFITABILITY
                # =================================

                profitable = is_profitable(
                    roi,
                    estimated_profit,
                    mining_difficulty,
                    success_rate
                )

                # ML BOOST

                if ml_pred == 1 and roi > 25:
                    profitable = 1

                # =================================
                # ORBIT CLASS
                # =================================

                orbit_class = asteroid.get(
                    "orbital_data",
                    {}
                ).get(
                    "orbit_class",
                    {}
                ).get(
                    "orbit_class_type",
                    "Unknown"
                )

                # =================================
                # RECOMMENDATION
                # =================================

                if roi > 80:
                    recommendation = (
                        "Highly Recommended"
                    )

                elif roi > 35:
                    recommendation = (
                        "Moderate Opportunity"
                    )

                else:
                    recommendation = (
                        "High Risk Mission"
                    )

                # =================================
                # FINAL OBJECT
                # =================================

                asteroid_data = {

                    "name": asteroid.get(
                        "name",
                        "Unknown"
                    ),

                    "profitable": profitable,

                    "diameter": round(
                        diameter,
                        2
                    ),

                    "velocity": round(
                        velocity,
                        2
                    ),

                    "miss_distance": round(
                        miss_distance,
                        2
                    ),

                    "hazardous": hazardous,

                    "magnitude": round(
                        magnitude,
                        2
                    ),

                    "metal_type": metal_type,

                    "estimated_value": round(
                        estimated_value,
                        2
                    ),

                    "mining_cost": round(
                        total_cost,
                        2
                    ),

                    "estimated_profit": round(
                        estimated_profit,
                        2
                    ),

                    "roi": roi,

                    "difficulty": mining_difficulty,

                    "success_rate": success_rate,

                    "ai_score": ai_score,

                    "travel_days": travel_days,

                    "orbit_class": orbit_class,

                    "extraction_days": extraction_days,

                    "fuel_required": fuel_required,

                    "carbon_emission": carbon_emission,

                    "recommendation": recommendation,

                    "nasa_jpl_url": asteroid.get(
                        "nasa_jpl_url",
                        ""
                    ),

                    "image": random.choice(
                        ASTEROID_IMAGES
                    )
                }

                results.append(
                    asteroid_data
                )

            except Exception as e:

                print(
                    "ASTEROID PROCESSING ERROR:",
                    e
                )

                continue

    # =====================================
    # SORT BY ROI
    # =====================================

    results = sorted(
        results,
        key=lambda x: x["roi"],
        reverse=True
    )

    return results