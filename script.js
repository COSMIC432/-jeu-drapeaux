const flags = [
  { country: "France", img: "https://flagcdn.com/w320/fr.png" },
  { country: "Allemagne", img: "https://flagcdn.com/w320/de.png" },
  { country: "Japon", img: "https://flagcdn.com/w320/jp.png" },
  { country: "Brésil", img: "https://flagcdn.com/w320/br.png" },
  { country: "Canada", img: "https://flagcdn.com/w320/ca.png" }
];

let currentFlag;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function nextFlag() {
  const container = document.getElementById("choices");
  const result = document.getElementById("result");
  result.textContent = "";

  container.innerHTML = "";
  currentFlag = flags[Math.floor(Math.random() * flags.length)];

  document.getElementById("flag-img").src = currentFlag.img;

  const options = shuffle([
    currentFlag.country,
    ...shuffle(flags).filter(f => f.country !== currentFlag.country).slice(0, 3).map(f => f.country)
  ]);

  options.forEach(country => {
    const btn = document.createElement("button");
    btn.textContent = country;
    btn.onclick = () => {
      if (country === currentFlag.country) {
        result.textContent = "✅ Correct !";
      } else {
        result.textContent = "❌ Mauvaise réponse.";
      }
    };
    container.appendChild(btn);
  });
}

window.onload = nextFlag;
