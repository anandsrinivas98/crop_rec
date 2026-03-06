import streamlit as st
import joblib
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Page configuration
st.set_page_config(
    page_title="AI Crop Recommendation",
    page_icon="🌾",
    layout="wide"
)

# Train model function
def train_model():
    """Train the model if it doesn't exist"""
    np.random.seed(42)
    crops = ['rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 'mungbean', 
             'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 'grapes', 'watermelon', 
             'muskmelon', 'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee']
    
    data = []
    for _ in range(2200):
        n = np.random.randint(0, 140)
        p = np.random.randint(5, 145)
        k = np.random.randint(5, 205)
        temperature = np.random.uniform(8.0, 45.0)
        humidity = np.random.uniform(14.0, 100.0)
        ph = np.random.uniform(3.5, 10.0)
        rainfall = np.random.uniform(20.0, 300.0)
        
        if rainfall > 200 and humidity > 80: crop = 'rice'
        elif temperature > 35 and humidity > 50: crop = 'watermelon'
        elif rainfall < 50: crop = 'mothbeans'
        elif ph < 5.5: crop = 'mango'
        elif k > 100: crop = 'grapes'
        elif n > 100: crop = 'cotton'
        else: crop = np.random.choice(crops)
            
        data.append([n, p, k, temperature, humidity, ph, rainfall, crop])
        
    df = pd.DataFrame(data, columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'label'])
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    return model

# Load or train the model
@st.cache_resource
def load_model():
    model_path = os.path.join('backend', 'crop_model.pkl')
    
    # Try to load existing model
    if os.path.exists(model_path):
        return joblib.load(model_path)
    
    # If model doesn't exist, train it
    st.info("Training model for the first time... This may take a moment.")
    model = train_model()
    
    # Try to save it (may fail on Streamlit Cloud due to read-only filesystem)
    try:
        os.makedirs('backend', exist_ok=True)
        joblib.dump(model, model_path)
    except:
        pass  # Ignore save errors on read-only filesystems
    
    return model

model = load_model()

# Header
st.title("🌾 AI Smart Crop Recommendation System")
st.markdown("Get personalized crop recommendations based on soil nutrients and weather conditions")

# Create two columns for better layout
col1, col2 = st.columns(2)

with col1:
    st.subheader("Soil Nutrients")
    N = st.number_input("Nitrogen (N)", min_value=0.0, max_value=140.0, value=50.0, help="Nitrogen content in soil")
    P = st.number_input("Phosphorus (P)", min_value=5.0, max_value=145.0, value=50.0, help="Phosphorus content in soil")
    K = st.number_input("Potassium (K)", min_value=5.0, max_value=205.0, value=50.0, help="Potassium content in soil")
    ph = st.number_input("pH Level", min_value=3.5, max_value=10.0, value=6.5, help="Soil pH level")

with col2:
    st.subheader("Weather Conditions")
    temperature = st.number_input("Temperature (°C)", min_value=8.0, max_value=45.0, value=25.0, help="Average temperature")
    humidity = st.number_input("Humidity (%)", min_value=14.0, max_value=100.0, value=70.0, help="Relative humidity")
    rainfall = st.number_input("Rainfall (mm)", min_value=20.0, max_value=300.0, value=100.0, help="Average rainfall")

# Predict button
if st.button("🔍 Get Recommendation", type="primary", use_container_width=True):
    if model is not None:
        with st.spinner("Analyzing conditions..."):
            # Prepare features
            features = np.array([[N, P, K, temperature, humidity, ph, rainfall]])
            
            # Make prediction
            prediction = model.predict(features)[0]
            
            # Display result
            st.success("Recommendation Ready!")
            st.markdown(f"### 🌱 Recommended Crop: **{prediction.upper()}**")
            
            # Additional info
            st.info(f"""
            **Based on your inputs:**
            - Nitrogen: {N} | Phosphorus: {P} | Potassium: {K}
            - Temperature: {temperature}°C | Humidity: {humidity}% | pH: {ph}
            - Rainfall: {rainfall}mm
            """)

# Footer
st.markdown("---")
st.markdown("Built with ❤️ using Streamlit and Machine Learning")
