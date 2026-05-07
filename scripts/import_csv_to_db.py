import os
import sys
import django
import pandas as pd

# =========================================
# ADD BACKEND TO PYTHON PATH
# =========================================

sys.path.append(
    os.path.join(
        os.path.dirname(__file__),
        "../backend"
    )
)

# =========================================
# DJANGO SETTINGS
# =========================================

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings"
)

django.setup()

# =========================================
# IMPORT MODEL
# =========================================

from api.models import Asteroid

# =========================================
# CSV PATH
# =========================================

CSV_PATH = "data/processed/asteroids_clean.csv"

# =========================================
# LOAD CSV
# =========================================

try:

    df = pd.read_csv(CSV_PATH)

    print(f"✅ CSV Loaded: {len(df)} rows")

except Exception as e:

    print("❌ CSV LOAD ERROR:", e)

    exit()

# =========================================
# CLEAR OLD DATA
# =========================================

Asteroid.objects.all().delete()

print("🗑️ Old asteroid data deleted")

# =========================================
# INSERT NEW DATA
# =========================================

count = 0

for index, row in df.iterrows():

    try:

        Asteroid.objects.create(

            name=f"SBDB-{index}",

            avg_diameter=float(
                row["avg_diameter"]
            ),

            velocity=float(
                row["velocity"]
            ),

            miss_distance=float(
                row["miss_distance"]
            ),

            hazardous=bool(
                row["hazardous"]
            ),

            risk=int(
                row["hazardous"]
            ),

            source="SBDB CSV"
        )

        count += 1

    except Exception as e:

        print(
            f"❌ Row {index} Error:",
            e
        )

# =========================================
# FINAL MESSAGE
# =========================================

print(
    f"✅ Successfully Imported {count} Asteroids!"
)