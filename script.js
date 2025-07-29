const countries = {
  FR: "France", DE: "Allemagne", JP: "Japon", BR: "Brésil", CA: "Canada", US: "États-Unis", 
  IN: "Inde", IT: "Italie", MX: "Mexique", RU: "Russie", CN: "Chine", NG: "Nigéria", 
  ZA: "Afrique du Sud", AR: "Argentine", EG: "Égypte", TR: "Turquie", KR: "Corée du Sud",
  ES: "Espagne", AU: "Australie", GB: "Royaume-Uni", SE: "Suède", NO: "Norvège", NL: "Pays-Bas",
  MA: "Maroc", DZ: "Algérie", TN: "Tunisie", KE: "Kenya", SN: "Sénégal", PE: "Pérou", 
  CO: "Colombie", VN: "Viêt Nam", GR: "Grèce", PL: "Pologne", PT: "Portugal", UA: "Ukraine",
  IQ: "Irak", IR: "Iran", IL: "Israël", SA: "Arabie Saoudite", TH: "Thaïlande"
};

let allFlags = Object.entries(countries).map(([code, name]) => ({
  country: name,
  img: `https://flagcdn.com/w320/${code.toLowerCase()}.png`,
  code
}));

let currentPlayer = null;
let discoveredFlags = new Set();
let score = 0;

function startGame() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Entre ton pseudo pour jouer !");
  currentPlayer = username;

  document.getElementById("player-name").textContent = username;
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-screen").style.display = "block";

  loadPlayerData();
  nextFlag();
}

function loadPlayerData() {
  const data = JSON.parse(localStorage.getItem("flaggame_players")) || {};
  if (!data[currentPlayer]) {
    data[currentPlayer] = { score: 0, discovered: [], plays: 0 };
  }
  data[currentPlayer].plays += 1;
  localStorage.setItem("flaggame_players", JSON.stringify(data));
  updateLeaderboard();
}

function saveProgress() {
  const data = JSON.parse(localStorage.getItem("flaggame_players")) || {};
  const player = data[currentPlayer];
  player.score = Math.max(player.score, score);
  player.discovered = Array.from(new Set([...player.discovered, ...discoveredFlags]));
  localStorage.setItem("flaggame_players", JSON.stringify(data));
  updateLeaderboard();
}

function updateLeaderboard() {
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("flaggame_players")) || {};
  const players = Object.entries(data).sort((a, b) => b[1].score - a[1].score);
  players.forEach(([name, stats]) => {
    const grade = calculateGrade(stats);
    const li = document.createElement("li");
    li.textContent = `${name} – ${grade} – 🌟 Score max : ${stats.score} – 🌐 Pays : ${stats.discovered.length}`;
    list.appendChild(li);
  });
}

function calculateGrade(player) {
  const discovered = player.discovered.length;
  const plays = player.plays;
  if (discovered > 30 && plays > 10) return "🏆 Grand Maître";
  if (discovered > 20) return "🌍 Expert";
  if (discovered > 10) return "✈️ Voyageur confirmé";
  return "🧳 Explorateur";
}

function nextFlag() {
  const container = document.getElementById("choices");
  const feedback = document.getElementById("feedback");
  feedback.textContent = "";
  container.innerHTML = "";

  const current = allFlags[Math.floor(Math.random() * allFlags.length)];
  document.getElementById("flag-img").src = current.img;

  const options = shuffle([
    current.country,
    ...shuffle(allFlags)
      .filter(f => f.country !== current.country)
      .slice(0, 3)
      .map(f => f.country)
  ]);

  options.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.onclick = () => {
      if (option === current.country) {
        score++;
        discoveredFlags.add(current.country);
        feedback.textContent = "✅ Correct !";
      } else {
        feedback.textContent = `❌ Mauvais ! C'était : ${current.country}`;
      }
      updateStats();
      saveProgress();
      setTimeout(nextFlag, 1000);
    };
    container.appendChild(btn);
  });
}

function updateStats() {
  document.getElementById("score").textContent = score;
  document.getElementById("discovered").textContent = discoveredFlags.size;
  const playerData = JSON.parse(localStorage.getItem("flaggame_players"))[currentPlayer];
  document.getElementById("grade").textContent = calculateGrade(playerData);
}

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}
