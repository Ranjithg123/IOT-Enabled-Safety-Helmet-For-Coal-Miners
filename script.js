// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  databaseURL: "https://your-project.firebaseio.com",
  projectId: "your-project-id"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== Chart Setup =====
const labels = [];
const tempData = [], humData = [], smokeData = [], proxData = [];

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { color: '#64748b' } },
    y: { grid: { color: 'rgba(0, 0, 0, 0.05)' }, ticks: { color: '#64748b' }, beginAtZero: true }
  }
};

const tempChart = new Chart(document.getElementById('tempChart'), {
  type: 'line',
  data: { labels: labels, datasets: [{ data: tempData, borderColor: '#f43f5e', backgroundColor: 'rgba(244, 63, 94, 0.1)', fill: true, tension: 0.4, borderWidth: 2 }] },
  options: chartOptions
});

const humChart = new Chart(document.getElementById('humChart'), {
  type: 'line',
  data: { labels: labels, datasets: [{ data: humData, borderColor: '#0ea5e9', backgroundColor: 'rgba(14, 165, 233, 0.1)', fill: true, tension: 0.4, borderWidth: 2 }] },
  options: chartOptions
});

const smokeChart = new Chart(document.getElementById('smokeChart'), {
  type: 'line',
  data: { labels: labels, datasets: [{ data: smokeData, borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', fill: true, tension: 0.4, borderWidth: 2 }] },
  options: chartOptions
});

const proxChart = new Chart(document.getElementById('proxChart'), {
  type: 'line',
  data: { labels: labels, datasets: [{ data: proxData, borderColor: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.4, borderWidth: 2 }] },
  options: chartOptions
});

let latestData = {};

let lastAlertTimes = { temp: 0, smoke: 0, prox: 0 };
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return; // Safety check

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="icon">⚠️</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

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

  const isTempHigh = data.temperature > 50;
  const isSmokeHigh = data.smoke > 300;
  const isProxHigh = data.proximity === 1;

  tempCard.classList.toggle('alert', isTempHigh);
  smokeCard.classList.toggle('alert', isSmokeHigh);
  proxCard.classList.toggle('alert', isProxHigh);

  const now = Date.now();
  if (isTempHigh && now - lastAlertTimes.temp >= 5000) {
    showToast(`DANGER: High Temperature (${data.temperature}°C)`);
    lastAlertTimes.temp = now;
  }
  if (isSmokeHigh && now - lastAlertTimes.smoke >= 5000) {
    showToast(`DANGER: High Smoke (${data.smoke})`);
    lastAlertTimes.smoke = now;
  }
  if (isProxHigh && now - lastAlertTimes.prox >= 5000) {
    showToast(`DANGER: Proximity Alert!`);
    lastAlertTimes.prox = now;
  }
}

// ===== Gemini AI Analysis =====
async function analyzeWithGemini(data) {
  try {
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
  } catch (err) {
    console.error(err);
    document.getElementById('gemini-insights').textContent = 'AI Insights: Error fetching data';
  }
}

// ===== Firebase Listener =====
db.ref('helmet').on('value', snapshot => {
  const data = snapshot.val();
  if (!data) return;

  latestData = data; // store latest for manual AI analysis

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

  tempChart.update();
  humChart.update();
  smokeChart.update();
  proxChart.update();
  updateCards(data);
});

// ===== AI Button =====
document.getElementById('aiBtn').addEventListener('click', () => {
  if (Object.keys(latestData).length > 0) {
    analyzeWithGemini(latestData);
  } else {
    alert("No data available for analysis yet!");
  }
});
