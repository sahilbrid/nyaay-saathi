import joblib
import pandas as pd

def predict_duration(category):
    model = joblib.load('C:/Users/Sahil Brid/Downloads/Hack2Infinity/backend/final_model.pkl') 
    prediction = model.predict(pd.DataFrame({'CATEGORY': [category]}))
    return int((prediction[0]))

#Example Input
category_input = 'Immigration'
prediction_duration_eviction = predict_duration(category_input)
print(f"Predicted Duration for the {category_input} case is {prediction_duration_eviction} days")