# AI Smart Crop Recommendation System

A modern, AI-powered web application that recommends the best crop to grow base on soil nutrients and weather conditions.

## Project Structure

```
crop-recommendation-ai/
│
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx    # Navigation bar
│   │   │   ├── CropForm.jsx  # Input form for soil & weather
│   │   │   └── ResultCard.jsx# Result display with animation
│   │   ├── App.jsx           # Main application layout
│   │   ├── index.css         # Tailwind & global styles
│   │   └── main.jsx          # React entry point
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite compilation settings
│
├── backend/                  # FastAPI + Scikit-Learn backend
│   ├── main.py               # FastAPI application
│   ├── model.py              # Model loading & prediction logic
│   ├── train_model.py        # ML model training script
│   ├── crop_dataset.csv      # Generated sample dataset
│   ├── crop_model.pkl        # Trained model binary
│   └── requirements.txt      # Python dependencies
│
└── README.md                 # Project documentation
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd crop-recommendation-ai/backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install the required dependencies:
   ```bash
   pip install fastapi uvicorn scikit-learn pandas numpy joblib pydantic
   ```

4. Train the ML model (This generates `crop_dataset.csv` and `crop_model.pkl`):
   ```bash
   python train_model.py
   ```

5. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at `http://localhost:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd crop-recommendation-ai/frontend
   ```

2. Install the necessary NPM dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will be running at `http://localhost:5173`.

## Deployment Instructions

### Frontend (Deploy on Vercel)
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and create a new project.
3. Import your GitHub repository.
4. Set the Root Directory to `frontend`.
5. Vercel will automatically detect Vite and set the build command to `npm run build` and output directory to `dist`.
6. Add the environment variable `VITE_API_URL` pointing to your deployed backend URL.
7. Click Deploy.

### Backend (Deploy on Render or Railway)
#### Render:
1. Push your code to a GitHub repository.
2. Go to [Render](https://render.com/) and create a new "Web Service".
3. Connect your GitHub repository.
4. Set the Root Directory to `backend` (or update `requirements.txt`).
5. Build command: `pip install -r requirements.txt` (Ensure you create a requirements.txt with `pip freeze > requirements.txt`).
6. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Click Create Web Service.

#### Railway:
1. Create a `requirements.txt` in the backend folder.
2. Push your project and connect it in Railway.
3. Configure the start command as `uvicorn main:app --host 0.0.0.0 --port $PORT` if not automatically detected.
