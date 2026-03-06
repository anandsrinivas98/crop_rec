import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

def create_synthetic_dataset(num_samples=1000):
    np.random.seed(42)
    crops = ['rice', 'maize', 'chickpea', 'kidneybeans', 'pigeonpeas', 'mothbeans', 'mungbean', 
             'blackgram', 'lentil', 'pomegranate', 'banana', 'mango', 'grapes', 'watermelon', 
             'muskmelon', 'apple', 'orange', 'papaya', 'coconut', 'cotton', 'jute', 'coffee']
    
    data = []
    
    for _ in range(num_samples):
        # Generate random values for each feature
        n = np.random.randint(0, 140)
        p = np.random.randint(5, 145)
        k = np.random.randint(5, 205)
        temperature = np.random.uniform(8.0, 45.0)
        humidity = np.random.uniform(14.0, 100.0)
        ph = np.random.uniform(3.5, 10.0)
        rainfall = np.random.uniform(20.0, 300.0)
        
        # Simple logic to assign crops based on features for synthetic data
        # Real-world data would be much more nuanced
        if rainfall > 200 and humidity > 80: crop = 'rice'
        elif temperature > 35 and humidity > 50: crop = 'watermelon'
        elif rainfall < 50: crop = 'mothbeans'
        elif ph < 5.5: crop = 'mango'
        elif k > 100: crop = 'grapes'
        elif n > 100: crop = 'cotton'
        else: crop = np.random.choice(crops)
            
        data.append([n, p, k, temperature, humidity, ph, rainfall, crop])
        
    df = pd.DataFrame(data, columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall', 'label'])
    return df

def train_and_save_model():
    print("Generating synthetic dataset...")
    df = create_synthetic_dataset(2200)
    
    # Save dataset to CSV for reference
    df.to_csv('crop_dataset.csv', index=False)
    print("Dataset saved to crop_dataset.csv")
    
    X = df.drop('label', axis=1)
    y = df['label']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForestClassifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f"Model accuracy: {accuracy * 100:.2f}%")
    
    # Save the model
    joblib.dump(model, 'crop_model.pkl')
    print("Model saved as crop_model.pkl")

if __name__ == "__main__":
    train_and_save_model()
