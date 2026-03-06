import streamlit as st
import joblib
import os
import numpy as np

# Page configuration
st.set_page_config(
    page_title="AI Crop Recommendation",
    page_icon="🌾",
    layout="wide"
)

# Load the model
@st.cache_resource
def load_model():
    model_path = os.path.join('backend', 'crop_model.pkl')
    if not os.path.exists(model_path):
        st.error("Model file not found. Please train the model first by running: python backend/train_model.py")
        return None
    return joblib.load(model_path)

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
