from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from model import CropInput, CropPredictor

app = FastAPI(title="Crop Recommendation API", version="1.0.0")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with the specific frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = CropPredictor()

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Crop Recommendation API"}

@app.post("/predict")
def predict_crop(data: CropInput):
    try:
        recommended_crop = predictor.predict(data)
        return {"crop": recommended_crop}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
