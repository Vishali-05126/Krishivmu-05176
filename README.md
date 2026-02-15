# KrishivSeth AI

INSPIRATION STORY:

In many villages, farmers don’t fail because they lack effort — they fail because they lack predictive intelligence. They decide crops based on tradition, not data. They sell in mandis without knowing future price trends. They overuse water and fertilizers because advisory systems are generic, not hyper-local.
After studying platforms like Crop in and nurture farm, we noticed something critical:
They provide data, but not decision optimization.
There is no system that answers:
“What should this farmer grow, this season, on this land, to maximize net profit with minimal risk?”
That gap inspired us to build an AI-driven agricultural profit engine — not just an advisory app, but a decision-making system that predicts ROI, optimizes inputs, and connects farmers directly to high-value buyers.
We believe farming should move from guesswork to algorithmic precision.

## KrishivSeth AI – AI for Agriculture

## Inspiration

India is one of the largest agricultural economies, yet farmers face:

- Late disease detection  
- Unpredictable weather  
- Poor market price awareness  
- Excess fertilizer usage  
- Lack of localized advisory  

Our mission is **making AI accessible to every farmer** using only a smartphone.

---

## What it does

### Crop Disease Detection
Farmers upload an image → AI predicts disease → treatment suggestion provided.
# 💡 What It Does

## 🌿 1. Crop Disease Detection (CNN Based)

We classify plant leaf images using Convolutional Neural Networks.
Image transformation:
$$
I' = W * I + b
$$
Convolution operation:
$$
S(i,j) = (I * K)(i,j) = \sum_m \sum_n I(m,n)K(i-m,j-n)
$$

Activation function (ReLU):

$$
ReLU(x) = \max(0,x)
$$

Softmax classification:

$$
P(y=i|x) = \frac{e^{z_i}}{\sum_{j} e^{z_j}}
$$

Cross-entropy loss:

$$
Loss = -\sum y \log(\hat{y})
$$

### Python Model Code

```python
import tensorflow as tf
from tensorflow.keras import layers, models

model = models.Sequential([
    layers.Conv2D(32, (3,3), activation='relu', input_shape=(128,128,3)),
    layers.MaxPooling2D((2,2)),
    layers.Conv2D(64, (3,3), activation='relu'),
    layers.MaxPooling2D((2,2)),
    layers.Flatten(),
    layers.Dense(128, activation='relu'),
    layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy']
Accuracy calculation:

\\( Accuracy = \frac{Correct\ Predictions}{Total\ Predictions} \\)

---

### 🌦 Weather-Based Advisory
Evapotranspiration model:
ET0​=Δ+γ(1+0.34u2​)0.408Δ(Rn​−G)+γT+273900​u2​(es​−ea​)​

Soil Moisture Index:
SMI=
Field Capacity
Current Moisture
	
If SMI<0.5⇒Irrigation=Required
Uses forecast data to suggest irrigation timing.

Example moisture estimation:

$$
Soil\ Moisture\ Index = \frac{Rainfall + Irrigation}{Evaporation + Crop\ Usage}
$$

---
```const axios = require('axios');

async function getWeather(city) {
    const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=API_KEY&q=${city}`
    );
    return response.data;
}```

### Market Price Intelligence
Displays mandi prices to optimize selling decisions.

Profit estimation formula:

$$
Profit = Selling\ Price - Production\ Cost
$$
Using Linear Regression
    \\y=β0​+β1​x1​+β2​x2​+ϵ\\
 $$
  MSE=n1​i=1∑n​(yi​−y^​i​)2 $$

 $$  θ:=θ−α∇J(θ)  $$

```from sklearn.linear_model import LinearRegression

model = LinearRegression()
model.fit(X_train, y_train)

predicted_price = model.predict(X_test)```

---

### 🧪 Fertilizer Optimization
Recommends fertilizer quantity based on soil nutrients.

\\( Recommended\ Fertilizer = Required\ Nutrient - Available\ Nutrient \\)

---
5. AI Decision Engine
Using Logistic Regression
  $$
    P(Disease)=1+e−z1​

    z=w1​x1​+w2​x2​+b
   
    P(A∣B)=P(B)P(B∣A)P(A)​ $$

System Architecture

Farmer → Mobile App → API Gateway → AI Model → Decision Engine → Recommendation

Time Complexity: 
 $$ 
     CNN Training :O(n⋅d⋅k2)
 ,   Inference : O(d⋅k2)  $$

### Multilingual Voice Support
Speech-to-text and text-to-speech integration for accessibility.

---

## How we built it

### Frontend
- Flutter / React Native  

### AI Model
- CNN-based classifier  
- Built using TensorFlow / PyTorch  

Loss function:

$$
Loss = -\sum y \log(\hat{y})
$$

---

### Backend
- Node.js / Firebase  
- REST APIs for weather and mandi data  

---

## ⚔ Challenges we ran into

1. Low-quality image inputs  
2. Limited dataset for regional crops  
3. Ensuring safe fertilizer recommendations  
4. Real-time API integration  
5. UI simplicity for rural users  

---
Regularization :
  Lreg​=L+λ∣∣w∣∣2

Dropout:
y=f(Wx)⋅mask

Performance Metrics

Precision:
Precision=TP​/TP+FP

	​
Recall=TP/TP+FN
	​

F1 Score: 
       F1=2⋅Precision+RecallPrecision⋅Recall​

Future Work:

LSTM for time-series price prediction:ht ​= σ(Wh​ht−1​+Wx​xt​)
Reinforcement Learning for irrigation control:Q(s,a)=Q(s,a)+α[r+γmaxQ(s′,a′)−Q(s,a)]

## Accomplishments that we're proud of

- High validation accuracy  
- Working end-to-end prototype  
- Voice interaction support  
- Scalable backend architecture  

---

## What we learned

- Dataset quality directly impacts model performance  
- Simplicity improves adoption  
- Real-world deployment constraints differ from lab environments  

---

## What's next for KrishivSeth AI

### Phase 1 – Pilot Deployment
- Field testing with farmers  

### Phase 2 – Advanced AI
- Soil nutrient prediction  
- Pest outbreak forecasting  

Outbreak prediction model:

$$
P(Disease) = \frac{1}{1 + e^{-z}}
$$

### Phase 3 – Scale
- Government partnerships  
- Nationwide deployment  


