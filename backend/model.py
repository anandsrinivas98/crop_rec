from pydantic import BaseModel
import joblib
import os
from typing import Optional

class CropInput(BaseModel):
    # Base ML Features
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    
    # Extended Realistic Features (Optional for ML compatibility)
    soil_moisture: Optional[float] = None
    soil_type: Optional[str] = None
    sunlight_hours: Optional[float] = None
    
    irrigation_availability: Optional[str] = None
    
    altitude: Optional[float] = None
    region_type: Optional[str] = None

class CropPredictor:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), 'crop_model.pkl')
        self.model = None

    def load_model(self):
        if self.model is None:
            if not os.path.exists(self.model_path):
                raise FileNotFoundError("Model file not found. Please train the model first.")
            self.model = joblib.load(self.model_path)
            
    def predict(self, input_data: CropInput) -> str:
        self.load_model()
        features = [[
            input_data.N,
            input_data.P,
            input_data.K,
            input_data.temperature,
            input_data.humidity,
            input_data.ph,
            input_data.rainfall
        ]]
        prediction = self.model.predict(features)
        return prediction[0]
