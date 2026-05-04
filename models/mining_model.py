import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

# Dummy dataset (baad me API se bana sakti ho)
data = {
    "diameter": [500, 1200, 300, 2000, 800],
    "velocity": [20000, 40000, 15000, 50000, 30000],
    "miss_distance": [800000, 200000, 900000, 100000, 600000],
    "profitable": [0, 1, 0, 1, 0]
}

df = pd.DataFrame(data)

X = df[['diameter', 'velocity', 'miss_distance']]
y = df['profitable']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = RandomForestClassifier()
model.fit(X_train, y_train)

joblib.dump(model, "models/mining_model.pkl")

print("✅ Mining Model Ready!")