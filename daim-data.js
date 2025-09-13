// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id"
};

// Uncomment this to use Firebase
// firebase.initializeApp(firebaseConfig);
// const db = firebase.database();

const labels = [];
const tempData = [], humData = [], smokeData = [], proxData = [];

const combinedChart = new Chart(document.getElementById('combinedChart'), {
  type: 'line',
  data: {
    labels: labels,
    datasets: [
      { label: 'Temperature (°C)', data: tempData, borderColor: 'red', fill: false, tension: 0.3 },
      { label: 'Humidity (%)', data: humData, borderColor: 'blue', fill: false, tension: 0.3 },
      { label: 'Smoke', data: smokeData, borderColor: 'gray', fill: false, tension: 0.3 },
      { label: 'Proximity', data: proxData, borderColor: 'green', fill: false, tension: 0.3 }
    ]
  },
  options: {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } }
  }
});

let latestData = {};

// ===== Update Cards =====
function updateCards(data) {
  const tempCard = document.getElementById('tempCard');
  const humCard = document.getElementById('humCard');
  const smokeCard = document.getElementById('smokeCard');
  const proxCard = document.getElementById('proxCard');

  tempCard.textContent = `Temperature: ${data.temperature} °C`;
  humCard.textContent = `Humidity: ${data.humidity} %`;
  smokeCard.textContent = `Smoke: ${data.smoke}`;
  proxCard.textContent = `Proximity: ${data.proximity}`;

  tempCard.classList.toggle('alert', data.temperature > 50);
  smokeCard.classList.toggle('alert', data.smoke > 300);
  proxCard.classList.toggle('alert', data.proximity === 1);
}

// ===== Gemini AI Analysis =====
async function analyzeWithGemini(data) {
  try {
    // If you don’t have Gemini API, just simulate result
    // Remove this simulation if you have a valid API key
    const simulatedResult = { analysis: "Sample AI Analysis: Helmet is safe. All sensors normal." };
    document.getElementById('gemini-insights').textContent =
      `Google Gemini AI Insights: ${simulatedResult.analysis}`;
    return;

    // Real API request (uncomment when you have API key)
    /*
    const response = await fetch('https://gemini.googleapis.com/v1/analyze', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_GEMINI_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: `Analyze helmet sensor data: ${JSON.stringify(data)}`,
        temperatureUnit: "C",
        smokeThreshold: 300
      })
    });
    const result = await response.json();
    document.getElementById('gemini-insights').textContent =
      `Google Gemini AI Insights: ${result.analysis || JSON.stringify(result)}`;
    */
  } catch (err) {
    console.error(err);
    document.getElementById('gemini-insights').textContent = 'AI Insights: Error fetching data';
  }
}

// ===== Sample Data Mode =====
function generateSampleData() {
  const data = {
    temperature: Math.floor(Math.random() * 60), // 0-59°C
    humidity: Math.floor(Math.random() * 100),  // 0-100%
    smoke: Math.floor(Math.random() * 500),     // 0-500
    proximity: Math.round(Math.random())        // 0 or 1
  };
  latestData = data;

  const time = new Date().toLocaleTimeString();
  labels.push(time);
  tempData.push(data.temperature);
  humData.push(data.humidity);
  smokeData.push(data.smoke);
  proxData.push(data.proximity);

  if (labels.length > 10) {
    labels.shift();
    tempData.shift();
    humData.shift();
    smokeData.shift();
    proxData.shift();
  }

  combinedChart.update();
  updateCards(data);
}

// Generate sample data every 3 seconds
setInterval(generateSampleData, 3000);

// ===== AI Button =====
document.getElementById('aiBtn').addEventListener('click', () => {
  if (Object.keys(latestData).length > 0) {
    analyzeWithGemini(latestData);
  } else {
    alert("No data available for analysis yet!");
  }
});

/* ===== Firebase Listener =====
db.ref('helmet').on('value', snapshot => {
  const data = snapshot.val();
  if (!data) return;
  latestData = data;
  const time = new Date().toLocaleTimeString();
  labels.push(time);
  tempData.push(data.temperature);
  humData.push(data.humidity);
  smokeData.push(data.smoke);
  proxData.push(data.proximity);
  if (labels.length > 10) { labels.shift(); tempData.shift(); humData.shift(); smokeData.shift(); proxData.shift(); }
  combinedChart.update();
  updateCards(data);
});
*/
