let money = 0;
let multiplier = 1;
let upgradeCost = 50;
let record = 0;
let musicOn = false;

let achievements = {
  firstMoney: false,
  millionaire: false,
  x2: false,
  x5: false,
  x10: false
};

const achievementData = {
  firstMoney: { name: "🎉 Primer Dinero", desc: "Alcanza 100 monedas", reward: 50 },
  millionaire: { name: "💸 ¡Millonario!", desc: "Alcanza 1000 monedas", reward: 200 },
  x2: { name: "⚡ Doble Poder", desc: "Multiplicador x2", reward: 100 },
  x5: { name: "🔥 Multiplicador Supremo", desc: "Multiplicador x5", reward: 250 },
  x10: { name: "💀 Multiplicador Ultimatum", desc: "Multiplicador x10", reward: 500 }
};

const moneySpan = document.getElementById("money");
const multiplierSpan = document.getElementById("multiplier");
const upgradeCostSpan = document.getElementById("upgradeCost");
const achievementsList = document.getElementById("achievementsList");
const achievementsPanel = document.getElementById("achievementsPanel");
const creditsPanel = document.getElementById("creditsPanel");
const recordSpan = document.getElementById("record");

const coinSound = document.getElementById("coinSound");
const achievementSound = document.getElementById("achievementSound");
const upgradeSound = document.getElementById("upgradeSound");
const bgMusic = document.getElementById("bgMusic");

function saveGame() {
  const data = {
    money,
    multiplier,
    upgradeCost,
    achievements,
    record
  };
  localStorage.setItem("multiplicadorGame", JSON.stringify(data));
}

function loadGame() {
  const saved = localStorage.getItem("multiplicadorGame");
  if (saved) {
    const data = JSON.parse(saved);
    money = data.money;
    multiplier = data.multiplier;
    upgradeCost = data.upgradeCost;
    achievements = data.achievements || achievements;
    record = data.record || 0;
  }
}

function earnMoney() {
  money += 10 * multiplier;
  coinSound.currentTime = 0;
  coinSound.play();
  animateMoneyButton();
  checkAchievements();

  if (money > record) {
    record = money;
  }

  updateUI();
  saveGame();
}

function upgrade() {
  if (money >= upgradeCost) {
    money -= upgradeCost;
    multiplier += 1;
    upgradeCost = Math.floor(upgradeCost * 2);
    upgradeSound.currentTime = 0;
    upgradeSound.play();
    checkAchievements();
    updateUI();
    saveGame();
  } else {
    alert("¡No tienes suficiente dinero!");
  }
}

function resetGame() {
  if (confirm("¿Seguro que quieres reiniciar tu progreso?")) {
    localStorage.removeItem("multiplicadorGame");
    money = 0;
    multiplier = 1;
    upgradeCost = 50;
    record = 0;
    achievements = {
      firstMoney: false,
      millionaire: false,
      x2: false,
      x5: false,
      x10: false
    };
    updateUI();
    updateAchievementsPanel();
  }
}

function checkAchievements() {
  for (const key in achievementData) {
    const a = achievementData[key];
    if (!achievements[key]) {
      if (
        (key === "firstMoney" && money >= 100) ||
        (key === "millionaire" && money >= 1000) ||
        (key === "x2" && multiplier >= 2) ||
        (key === "x5" && multiplier >= 5) ||
        (key === "x10" && multiplier >= 10)
      ) {
        achievements[key] = true;
        money += a.reward;
        showAchievement(`🏆 Logro desbloqueado: ${a.name} (+${a.reward} 💰)`);
      }
    }
  }
}

function showAchievement(text) {
  achievementSound.currentTime = 0;
  achievementSound.play();
  const alertBox = document.createElement("div");
  alertBox.textContent = text;
  alertBox.id = "achievementNotice";
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 4000);
}

function toggleAchievements() {
  const isVisible = achievementsPanel.style.display === "block";
  achievementsPanel.style.display = isVisible ? "none" : "block";
  updateAchievementsPanel();
}

function updateAchievementsPanel() {
  achievementsList.innerHTML = "";
  for (const key in achievementData) {
    const unlocked = achievements[key];
    const item = document.createElement("li");
    item.className = unlocked ? "unlocked" : "locked";
    item.textContent = `${achievementData[key].name}: ${achievementData[key].desc} ${unlocked ? "(✔️)" : "(🔒)"}`;
    achievementsList.appendChild(item);
  }
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function toggleCredits() {
  const isVisible = creditsPanel.style.display === "block";
  creditsPanel.style.display = isVisible ? "none" : "block";
}

function toggleMusic() {
  const bgMusic = document.getElementById("bgMusic");
  const musicButton = document.getElementById("musicButton");

  if (bgMusic.paused) {
    bgMusic.play().catch(() => {});
    musicButton.textContent = "🔇 Desactivar Música";
  } else {
    bgMusic.pause();
    musicButton.textContent = "🔈 Activar Música";
  }
}

function updateUI() {
  moneySpan.textContent = formatNumber(money);
  multiplierSpan.textContent = multiplier + "x";
  upgradeCostSpan.textContent = formatNumber(upgradeCost);
  recordSpan.textContent = formatNumber(record);
  updateAchievementsPanel();
}

function animateMoneyButton() {
  const button = document.querySelector("button[onclick='earnMoney()']");
  button.style.transform = "scale(1.1)";
  button.style.transition = "transform 0.1s";
  setTimeout(() => {
    button.style.transform = "scale(1)";
  }, 100);
}

function formatNumber(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return Math.floor(n);
}

document.addEventListener("DOMContentLoaded", () => {
  const bgMusic = document.getElementById("bgMusic");
  const musicButton = document.getElementById("musicButton");

  if (bgMusic && musicButton) {
    musicButton.textContent = bgMusic.paused ? "🔈 Activar Música" : "🔇 Desactivar Música";
  }
});

function exportProgress() {
  const data = {
    money,
    multiplier,
    upgradeCost,
    achievements
  };

  const json = JSON.stringify(data);
  const encoded = btoa(json); // Codifica a base64
  const blob = new Blob([encoded], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "progreso.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importProgress(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const decoded = atob(e.target.result);
      const data = JSON.parse(decoded);

      money = data.money || 0;
      multiplier = data.multiplier || 1;
      upgradeCost = data.upgradeCost || 50;
      achievements = data.achievements || {};

      updateUI();
      saveGame();
      alert("✅ Progreso importado correctamente.");
    } catch (err) {
      alert("❌ Error al importar el archivo.");
    }
  };

  reader.readAsText(file);
}

// ----------------------
// Estadísticas y Gráfica
// ----------------------

let moneyHistory = [];
let upgradesHistory = [];
let timeLabels = [];

let totalClicks = 0;
let clicksPerSecond = 0;
let recentClicks = [];

function recordProgress() {
  const now = new Date().toLocaleTimeString();
  moneyHistory.push(money);
  upgradesHistory.push(multiplier - 1);
  timeLabels.push(now);

  // Registro de clicks por segundo
  const nowTime = Date.now();
  recentClicks = recentClicks.filter(t => nowTime - t <= 1000);
  clicksPerSecond = recentClicks.length;

  if (moneyHistory.length > 10) {
    moneyHistory.shift();
    upgradesHistory.shift();
    timeLabels.shift();
  }
  updateChart();
  updateStatsUI();
}

setInterval(recordProgress, 1000); // Cada segundo

let chart;

function updateChart() {
  if (!chart) {
    const ctx = document.getElementById("progressChart").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: timeLabels,
        datasets: [
          {
            label: "Dinero 💰",
            data: moneyHistory,
            borderColor: "green",
            borderWidth: 2,
            fill: false,
          },
          {
            label: "Mejoras 🔧",
            data: upgradesHistory,
            borderColor: "blue",
            borderWidth: 2,
            fill: false,
          }
        ],
      },
      options: {
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  } else {
    chart.data.labels = timeLabels;
    chart.data.datasets[0].data = moneyHistory;
    chart.data.datasets[1].data = upgradesHistory;
    chart.update();
  }
}

function toggleStats() {
  const statsPanel = document.getElementById("statsPanel");
  statsPanel.style.display = statsPanel.style.display === "none" ? "block" : "none";
}

function updateStatsUI() {
  const clicksSpan = document.getElementById("totalClicks");
  const cpsSpan = document.getElementById("cps");
  if (clicksSpan && cpsSpan) {
    clicksSpan.textContent = totalClicks;
    cpsSpan.textContent = clicksPerSecond.toFixed(1);
  }
}

// En función earnMoney, asegúrate de agregar esto:
// totalClicks++;
// recentClicks.push(Date.now());

loadGame();
updateUI();