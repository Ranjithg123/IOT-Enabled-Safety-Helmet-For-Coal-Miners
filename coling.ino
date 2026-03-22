#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <DHT.h>
#include <Adafruit_ADXL345_U.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>

// Wi-Fi Credentials
#define WIFI_SSID "YOUR_WIFI_SSID"
#define WIFI_PASSWORD "YOUR_WIFI_PASSWORD"

// Firebase Project Credentials
#define FIREBASE_HOST "YOUR_FIREBASE_PROJECT.firebaseio.com"
#define FIREBASE_AUTH "YOUR_FIREBASE_DATABASE_SECRET"

// Google Sheets Web App URL
const char* googleScriptUrl = "YOUR_GOOGLE_APPS_SCRIPT_URL";

// Initialize Firebase and JSON objects
FirebaseData firebaseData;
FirebaseJson json;
FirebaseConfig config;
FirebaseAuth auth;

// Define DHT Sensor (Temperature and Humidity)
#define DHTPIN D6
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Define Gas and Smoke Sensors
#define GAS_PIN A0
#define SMOKE_PIN D5

// Define Buzzer
#define BUZZER_PIN D0

// Define Accelerometer
Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);

// Use WiFiClientSecure for HTTPS
WiFiClientSecure client;

void setup() {
  Serial.begin(115200);
  client.setInsecure(); // Bypass SSL validation for testing

  // Connect to Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected to Wi-Fi");

  // Configure Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // Initialize DHT Sensor
  dht.begin();

  // Initialize Gas and Smoke Sensors
  pinMode(GAS_PIN, INPUT);
  pinMode(SMOKE_PIN, INPUT);

  // Initialize Buzzer
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW);

  // Initialize Accelerometer
  if (!accel.begin()) {
    Serial.println("Accelerometer not detected!");
    while (1);
  }
  accel.setRange(ADXL345_RANGE_16_G);
  Serial.println("Setup complete.");
}

// Function to create JSON payload for Google Sheets
String createJsonPayload(float temperature, float humidity, int gasLevel, int smokeLevel, bool buzzerStatus, float accelX, float accelY, float accelZ) {
  String payload = "{";
  payload += "\"Temperature\":" + String(temperature) + ",";
  payload += "\"Humidity\":" + String(humidity) + ",";
  payload += "\"Gas_Level\":" + String(gasLevel) + ",";
  payload += "\"Smoke_Level\":" + String(smokeLevel) + ",";
  payload += "\"Buzzer_Status\":\"" + String(buzzerStatus ? "ON" : "OFF") + "\",";
  payload += "\"Accelerometer_X\":" + String(accelX) + ",";
  payload += "\"Accelerometer_Y\":" + String(accelY) + ",";
  payload += "\"Accelerometer_Z\":" + String(accelZ);
  payload += "}";
  return payload;
}

// Function to send data to Firebase and update existing values
void sendDataToFirebase(float temperature, float humidity, int gasLevel, int smokeLevel, bool buzzerStatus, float accelX, float accelY, float accelZ) {
  json.clear();
  json.set("Temperature", temperature);
  json.set("Humidity", humidity);
  json.set("Gas_Level", gasLevel);
  json.set("Smoke_Level", smokeLevel);
  json.set("Buzzer_Status", buzzerStatus ? "ON" : "OFF");
  json.set("Accelerometer/X", accelX);
  json.set("Accelerometer/Y", accelY);
  json.set("Accelerometer/Z", accelZ);

  // Use updateNode instead of pushJSON to overwrite existing data at /sensorData
  if (Firebase.updateNode(firebaseData, "/sensorData", json)) {
    Serial.println("Data updated in Firebase successfully");
  } else {
    Serial.print("Error updating data in Firebase: ");
    Serial.println(firebaseData.errorReason());
  }
}


// Function to send data to Google Sheets
void sendDataToGoogleSheets(String jsonPayload) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, googleScriptUrl);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.println("Data sent to Google Sheets successfully");
    } else {
      Serial.print("Error sending data to Google Sheets: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
}

void loop() {
  // Read sensor data
  float temperature = dht.readTemperature();
  float humidity = dht.readHumidity();
  int gasLevel = analogRead(GAS_PIN);
  int smokeLevel = analogRead(SMOKE_PIN);

  sensors_event_t event;
  accel.getEvent(&event);
  float accelX = event.acceleration.x;
  float accelY = event.acceleration.y;
  float accelZ = event.acceleration.z;

  // Buzzer control
  bool buzzerStatus = (gasLevel > 400 || smokeLevel > 400);
  digitalWrite(BUZZER_PIN, buzzerStatus ? HIGH : LOW);

  // Send data to Firebase
  sendDataToFirebase(temperature, humidity, gasLevel, smokeLevel, buzzerStatus, accelX, accelY, accelZ);

  // Send data to Google Sheets
  String jsonPayload = createJsonPayload(temperature, humidity, gasLevel, smokeLevel, buzzerStatus, accelX, accelY, accelZ);
  sendDataToGoogleSheets(jsonPayload);

  delay(60000); // Send data every 1 minute
}
