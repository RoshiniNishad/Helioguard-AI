import joblib
import numpy as np
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

model_path = os.path.join(BASE_DIR, "models", "risk_model.pkl")

model = joblib.load(model_path)

def predict_risk(diameter, velocity, distance):
    data = np.array([[diameter, velocity, distance]])
    return int(model.predict(data)[0])