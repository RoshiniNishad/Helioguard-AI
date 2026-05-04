import pandas as pd

df = pd.read_csv("data/raw/asteroids_raw.csv")

df.dropna(inplace=True)
df['hazardous'] = df['hazardous'].astype(int)

df['avg_diameter'] = (df['diameter_min'] + df['diameter_max']) / 2

df = df[['avg_diameter', 'velocity', 'miss_distance', 'hazardous']]

df.to_csv("data/processed/asteroids_clean.csv", index=False)

print("✅ Clean data saved!")