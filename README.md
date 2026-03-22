
# ![Helmet Icon](https://img.shields.io/badge/IoT-Helmet-blue) IoT Helmet Safety Dashboard  
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)  
[![Firebase](https://img.shields.io/badge/Firebase-RealtimeDatabase-orange)](https://firebase.google.com/)  
[![Chart.js](https://img.shields.io/badge/Chart.js-Visualization-red)](https://www.chartjs.org/docs/latest/)  
[![Sample Data Mode](https://img.shields.io/badge/Sample%20Data-Enabled-brightgreen)](#)  
[![AI Insights](https://img.shields.io/badge/AI-Enabled-blue)](#)  
![ESP32 Firmware](https://img.shields.io/badge/ESP32-v3.2-blue)

 

---

## **Project Overview**  
The **IoT Helmet Safety Dashboard** is a **real-time safety monitoring system** for **coal mining and industrial workers**. It integrates **multiple sensors on a smart helmet** using an **ESP32 microcontroller**, displays live data on a **web dashboard**, and provides **AI-based analysis** using Google Gemini API.  

This system helps detect hazardous conditions early, visualize sensor trends, and provide AI-driven safety insights.  

---

## **Use Case**  
Mining and industrial workers face **risks like high temperature, smoke, and unsafe proximity**. The IoT Helmet Dashboard:  

- Detects dangerous conditions **early**  
- Provides **visual alerts** on a web dashboard  
- Generates **AI insights** for risk assessment  
- Monitors **real-time trends** for safety compliance  

---

## **System Architecture**  

1. **ESP32 Microcontroller**: collects sensor data and sends it to Firebase  
2. **Firebase Realtime Database**: stores sensor readings and updates dashboard in real-time  
3. **Web Dashboard (HTML, CSS, JS)**: displays sensor **cards**, **combined charts**, and **AI analysis**  

**Optional:** Wi-Fi extender for underground or remote deployment.  

---

## **Hardware Requirements**  

| Component | Purpose |
|-----------|---------|
| ESP32 Dev Board | Microcontroller |
| DHT22 Sensor | Temperature & Humidity |
| MQ-2 Sensor | Smoke Detection |
| IR Sensor | Proximity Detection |
| Jumper Wires / Breadboard | Connections |
| Buzzer & LED (Optional) | Alerts |

---

## **Step 1: ESP32 Firmware Setup**  

1. Install **Arduino IDE**  
2. Add **ESP32 board support**:  
   - File → Preferences → Additional Boards Manager URLs → add `https://dl.espressif.com/dl/package_esp32_index.json`  
   - Tools → Board → Board Manager → Search ESP32 → Install  

3. Install required libraries:  
   - `DHT sensor library`  
   - `Firebase ESP32 Client`  
   - `ArduinoJSON`  

4. Wire sensors to ESP32:  

| Sensor      | ESP32 Pin |
|------------|-----------|
| DHT22      | D4        |
| MQ-2       | A0        |
| IR Sensor  | D5        |
| Buzzer     | D2        |
| LED        | D15       |

5. Update the firmware with:  
   - Wi-Fi credentials (`SSID` and `Password`)  
   - Firebase Realtime Database configuration  

6. Upload firmware to ESP32 using Arduino IDE  

---

## **Step 2: Firebase Setup**  

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project  
2. Enable **Realtime Database** → Start in **test mode**  
3. Add a **Web App** to get Firebase config:  

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id"
};
````

4. Update `script.js` in the dashboard with this Firebase configuration
5. Test ESP32 → Firebase connection by checking database values updating in real-time

---

## **Step 3: Web Dashboard Setup**

1. Clone the repository:

```bash
git clone https://github.com/Ranjithg123/IOT-Enabled-Safety-Helmet-For-Coal-Miners.git
```

2. Files structure:

```
IoT-Helmet-Dashboard/
│
├─ index.html         # Web dashboard
├─ style.css          # Styling
├─ script.js          # Firebase, charts, AI logic
└─ README.md          # Project description
```

3. Replace Firebase config and Google Gemini API key in `script.js`
4. Serve dashboard locally:

* **Python 3:**

```bash
python -m http.server 8000
```

* **Node.js:**

```bash
npm install -g serve
serve .
```

5. Open browser → `http://localhost:8000`

---

## **Step 4: Testing Without Hardware**

* Dashboard includes **Sample Data Mode**:

  * Simulates sensor data every 3 seconds
  * Updates cards and charts automatically
  * AI Analysis button works with **simulated response**

---

## **Step 5: Using AI Analysis**

* Click **Run AI Analysis** button to analyze the latest sensor data
* If no Google Gemini API key is provided, a **simulated analysis** will display

---

## **Step 6: Dashboard Overview**

### **Modern Analytics Interface**
The dashboard features a clean, responsive layout with frosted glassmorphism elements and an elegant light theme. It includes:
* **Sensor Cards**: Immediate readouts for Temperature, Humidity, Smoke, and Proximity that highlight danger states in red.
* **Separated Data Charts**: Instead of a single messy chart, each metric (Temp, Humidity, Smoke, Prox) tracks its historical data on its own dedicated interactive Chart.js canvas.

### **Animated Toast Alerts**
The system is equipped with intelligent, non-intrusive alert popups. If a sensor reports a dangerous reading (like Temp > 50°C), a red toast notification slides in to explicitly warn the user. Built-in cooldowns prevent notification spamming.

### **AI Insights Panel**
Displays AI safety analysis summaries generated by passing the latest sensor payloads through the Google Gemini API.

---

## **Step 7: Optional Enhancements**

* Mobile-friendly app for remote monitoring
* Edge AI processing on ESP32 for real-time alerts
* Helmet buzzer/LED triggers for unsafe conditions

---

## **References**

* [Firebase Realtime Database](https://firebase.google.com/docs/database)
* [ESP32 Arduino Core](https://github.com/espressif/arduino-esp32)
* [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
* [Google Gemini AI API](https://developers.google.com/generative-ai)

---

## **License**

This project is licensed under the **MIT License**


