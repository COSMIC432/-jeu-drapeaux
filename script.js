const countries = {
  AF: "Afghanistan", AL: "Albanie", DZ: "Algérie", AD: "Andorre", AO: "Angola",
  AR: "Argentine", AM: "Arménie", AU: "Australie", AT: "Autriche", AZ: "Azerbaïdjan",
  BD: "Bangladesh", BE: "Belgique", BJ: "Bénin", BO: "Bolivie", BR: "Brésil",
  BG: "Bulgarie", BF: "Burkina Faso", BI: "Burundi", KH: "Cambodge", CM: "Cameroun",
  CA: "Canada", CF: "Centrafrique", CL: "Chili", CN: "Chine", CO: "Colombie",
  CG: "Congo", HR: "Croatie", CU: "Cuba", CY: "Chypre", CZ: "Tchéquie",
  DK: "Danemark", DJ: "Djibouti", EG: "Égypte", EC: "Équateur", EE: "Estonie",
  ET: "Éthiopie", FI: "Finlande", FR: "France", GA: "Gabon", GM: "Gambie",
  GE: "Géorgie", DE: "Allemagne", GH: "Ghana", GR: "Grèce", GT: "Guatemala",
  GN: "Guinée", GY: "Guyana", HT: "Haïti", HN: "Honduras", HU: "Hongrie",
  IS: "Islande", IN: "Inde", ID: "Indonésie", IR: "Iran", IQ: "Irak",
  IE: "Irlande", IL: "Israël", IT: "Italie", JM: "Jamaïque", JP: "Japon",
  JO: "Jordanie", KZ: "Kazakhstan", KE: "Kenya", KR: "Corée du Sud", KW: "Koweït",
  LA: "Laos", LV: "Lettonie", LB: "Liban", LR: "Libéria", LY: "Libye",
  LT: "Lituanie", LU: "Luxembourg", MG: "Madagascar", MY: "Malaisie", ML: "Mali",
  MT: "Malte", MX: "Mexique", MD: "Moldavie", MN: "Mongolie", MA: "Maroc",
  MZ: "Mozambique", MM: "Birmanie", NA: "Namibie", NP: "Népal", NL: "Pays-Bas",
  NZ: "Nouvelle-Zélande", NI: "Nicaragua", NE: "Niger", NG: "Nigéria", NO: "Norvège",
  OM: "Oman", PK: "Pakistan", PA: "Panama", PY: "Paraguay", PE: "Pérou",
  PH: "Philippines", PL: "Pologne", PT: "Portugal", QA: "Qatar", RO: "Roumanie",
  RU: "Russie", RW: "Rwanda", SA: "Arabie Saoudite", SN: "Sénégal", RS: "Serbie",
  SG: "Singapour", SK: "Slovaquie", SI: "Slovénie", SO: "Somalie", ZA: "Afrique du Sud",
  ES: "Espagne", LK: "Sri Lanka", SD: "Soudan", SE: "Suède", CH: "Suisse",
  SY: "Syrie", TW: "Taïwan", TZ: "Tanzanie", TH: "Thaïlande", TG: "Togo",
  TN: "Tunisie", TR: "Turquie", UG: "Ouganda", UA: "Ukraine", AE: "Émirats",
  GB: "Royaume-Uni", US: "États-Unis", UY: "Uruguay", UZ: "Ouzbékistan", VE: "Venezuela",
  VN: "Viêt Nam", YE: "Yémen", ZM: "Zambie", ZW: "Zimbabwe"
};

const allFlags = Object.entries(countries).map(([code, country]) => ({
  country,
  img: `https://flagcdn.com/w320/${code.toLowerCase()}.png`
}));

let score = 0;
let questionNumber = 0;
const maxQuestions = 10;
let currentFlag;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function nextFlag() {
  const container = document.getElementById("choices");
  const result = document.getElementById("result");
  result.textContent = "";
  container.innerHTML = "";

  if (questionNumber >= maxQuestions) {
    endGame();
    return;
  }

  questionNumber++;
  currentFlag = allFlags[Math.floor(Math.random() * allFlags.length)];
  document.getElementById("flag-img").src = currentFlag.img;

  const options = shuffle([
    currentFlag.country,
    ...shuffle(allFlags).filter(f => f.country !== currentFlag.country).slice(0, 3).map(f => f.country)
  ]);

  options.forEach(country => {
    const btn = document.createElement("button");
    btn.textContent = country;
    btn.onclick = () => {
      if (country === currentFlag.country) {
        result.textContent = "✅ Bonne réponse !";
        score++;
      } else {
        result.textContent = `❌ Mauvaise réponse. C'était ${currentFlag.country}`;
      }
      setTimeout(nextFlag, 1000);
    };
    container.appendChild(btn);
  });
}

function endGame() {
  const container = document.getElementById("choices");
  const result = document.getElementById("result");
  container.innerHTML = "";
  document.getElementById("flag-img").style.display = "none";

  let grade = "";
  if (score <= 3) grade = "🧳 Touriste perdu 🌍";
  else if (score <= 6) grade = "✈️ Globe-trotteur 🌎";
  else if (score <= 9) grade = "🤝 Ambassadeur 🌐";
  else grade = "🏆 Maître des drapeaux 🏳️‍🌈";

  result.innerHTML = `<h2>Score final : ${score} / ${maxQuestions}</h2><h3>Ton grade : ${grade}</h3>`;

  const replayBtn = document.createElement("button");
  replayBtn.textContent = "Rejouer";
  replayBtn.onclick = () => location.reload();
  container.appendChild(replayBtn);
}

window.onload = nextFlag;
