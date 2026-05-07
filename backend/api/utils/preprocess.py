import os
import pandas as pd

os.makedirs("data/processed", exist_ok=True)

df = pd.read_csv("data/raw/asteroids_raw.csv")

print("Original Rows:", len(df))

df['velocity'] = df['velocity'].fillna(df['velocity'].mean())
df['miss_distance'] = df['miss_distance'].fillna(df['miss_distance'].mean())

df['diameter_min'] = df['diameter_min'].fillna(df['diameter_min'].mean())
df['diameter_max'] = df['diameter_max'].fillna(df['diameter_max'].mean())

df['hazardous'] = df['hazardous'].astype(int)


df['avg_diameter'] = (
    df['diameter_min'] + df['diameter_max']
) / 2

df = df[
    ['avg_diameter', 'velocity', 'miss_distance', 'hazardous']
]

print("Final Rows:", len(df))

df.to_csv(
    "data/processed/asteroids_clean.csv",
    index=False
)

print("✅ Clean data saved successfully!")