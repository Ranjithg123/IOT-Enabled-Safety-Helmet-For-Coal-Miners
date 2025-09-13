---

# ![Helmet Icon](https://img.shields.io/badge/IoT-Helmet-blue) IoT Helmet Safety Dashboard

[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Firebase](https://img.shields.io/badge/Firebase-RealtimeDatabase-orange)](https://firebase.google.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-Visualization-red)](https://www.chartjs.org/)

---

## **Project Overview**

The **IoT Helmet Safety Dashboard** is a **real-time safety monitoring system** designed for **coal mining and industrial workers**. It integrates **multiple sensors** on a smart helmet using an **ESP32 microcontroller**, displays live data on a **web dashboard**, and provides **AI-based analysis** via Google Gemini API.

---

## **Live Demo**

> Add your deployed dashboard URL here (e.g., GitHub Pages / Netlify / AWS S3)
> **Example:** [IoT Helmet Dashboard Demo](https://yourdemo.com)

---

## **Features**

* **Real-time sensor monitoring**: Temperature, Humidity, Smoke, Proximity
* **Combined sensor chart** for all readings
* **Alert cards** highlighting unsafe conditions
* **Manual AI Analysis** using Google Gemini API
* **Sample Data Mode** for testing without ESP32
* Responsive and mobile-friendly dashboard

---

## **Use Case**

Mining workers face hazards like **high temperature, smoke, and unsafe proximity**. The dashboard:

* Detects dangerous conditions **early**
* Sends visual alerts via the web dashboard
* Provides **AI insights** for risk analysis
* Monitors **real-time trends** for safety compliance

---

## **System Architecture**

1. **ESP32 Microcontroller**:

   * Sensors: DHT22, MQ-2, IR Sensor
   * Sends data to Firebase via Wi-Fi
2. **Firebase Realtime Database**:

   * Stores sensor readings
   * Updates the dashboard in real-time
3. **Web Dashboard (HTML, CSS, JS)**:

   * Displays sensor cards, combined chart, and AI analysis

**Optional:** Wi-Fi extender for underground or remote deployment

---

## **Hardware Requirements**

| Component                 | Purpose                |
| ------------------------- | ---------------------- |
| ESP32 Dev Board           | Microcontroller        |
| DHT22 Sensor              | Temperature & Humidity |
| MQ-2 Sensor               | Smoke Detection        |
| IR Sensor                 | Proximity Detection    |
| Jumper Wires / Breadboard | Connections            |
| Buzzer & LED (Optional)   | Alerts                 |

---

## **Firmware Setup (ESP32)**

1. Install **Arduino IDE** & ESP32 board support
2. Install libraries: `DHT sensor library`, `Firebase ESP32 Client`, `ArduinoJSON`
3. Wire sensors to ESP32:

| Sensor    | ESP32 Pin |
| --------- | --------- |
| DHT22     | D4        |
| MQ-2      | A0        |
| IR Sensor | D5        |
| Buzzer    | D2        |
| LED       | D15       |

4. Upload firmware to ESP32 and configure **Wi-Fi** and **Firebase credentials**

---

## **Web Dashboard Setup**

1. Clone the repository:

```bash
git clone https://github.com/yourusername/IoT-Helmet-Dashboard.git
```

2. Files structure:

```
IoT-Helmet-Dashboard/
│
├─ index.html
├─ style.css
├─ script.js
├─ README.md
```

3. Replace Firebase config and Gemini API key in `script.js`.

4. Run locally:

* **Python**:

```bash
python -m http.server 8000
```

* **Node.js**:

```bash
serve .
```

Open browser → `http://localhost:8000`

5. Test **Sample Data Mode** (built-in) if ESP32 is not connected.

---

## **AI Analysis**

* Click **Run AI Analysis** button on dashboard
* Displays **AI-driven insights** in the panel
* Supports **simulated response** if Gemini API key is unavailable

---

## **Sample Screenshots**

![Dashboard Screenshot](https://via.placeholder.com/900x400?text=Dashboard+Screenshot)
*Sample data mode running with simulated sensor readings.*

---

## **Future Enhancements**

* Mobile app integration
* Automated alerts via SMS/email
* Edge AI processing on ESP32
* Helmet buzzer/LED alert for unsafe conditions

---

## **References**

* [Firebase Realtime Database](https://firebase.google.com/docs/database)
* [ESP32 Arduino Core](https://github.com/espressif/arduino-esp32)
* [Chart.js Documentation](https://www.chartjs.org/docs/latest/)
* [Google Gemini AI API](https://developers.google.com/generative-ai)

---

## **License**

This project is licensed under the **MIT License**.

---
