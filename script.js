const countriesData = [
  { code:'FR', name:'France', rarity:1 },{ code:'DE', name:'Allemagne', rarity:1 },
  { code:'JP', name:'Japon', rarity:1 },{ code:'BR', name:'Brésil', rarity:1 },
  { code:'CA', name:'Canada', rarity:1 },{ code:'IN', name:'Inde', rarity:1 },
  { code:'AU', name:'Australie', rarity:2 },{ code:'KE', name:'Kenya', rarity:2 },
  { code:'AR', name:'Argentine', rarity:2 },{ code:'NG', name:'Nigéria', rarity:2 },
  { code:'EG', name:'Égypte', rarity:2 },{ code:'UA', name:'Ukraine', rarity:2 },
  { code:'ID', name:'Indonésie', rarity:2 },{ code:'VN', name:'Viêt Nam', rarity:2 },
  { code:'TH', name:'Thaïlande', rarity:3 },{ code:'PK', name:'Pakistan', rarity:3 },
  { code:'IR', name:'Iran', rarity:3 },{ code:'DZ', name:'Algérie', rarity:3 },
  { code:'KE', name:'Sénégal', rarity:3 }
];

const allFlags = countriesData.map(c=>({
  country: c.name,
  code: c.code,
  img:`https://flagcdn.com/w320/${c.code.toLowerCase()}.png`,
  rarity: c.rarity
}));

let currentPlayer, score=0;
let discoveredFlags=new Set(), seenFlags = [];
const MAX_HISTORY=50;

function startGame(){
  const name=document.getElementById('username').value.trim();
  if(!name) return alert("Entre un pseudo !");
  currentPlayer=name;
  document.getElementById('player-name').textContent=name;
  document.getElementById('start-screen').style.display='none';
  document.getElementById('game-screen').style.display='block';
  loadPlayer();
  nextFlag();
}
function loadPlayer(){
  const data=JSON.parse(localStorage.getItem('players')||'{}');
  if(!data[currentPlayer]) data[currentPlayer]={score:0,discovered:[],plays:0};
  data[currentPlayer].plays++;
  localStorage.setItem('players',JSON.stringify(data));
  updateBoard();
}
function saveProgress(){
  const data=JSON.parse(localStorage.getItem('players')||'{}');
  const p=data[currentPlayer];
  p.score=Math.max(p.score,score);
  p.discovered = Array.from(new Set([...p.discovered,...discoveredFlags]));
  localStorage.setItem('players',JSON.stringify(data));
  updateBoard();
}
function updateBoard(){
  const list=document.getElementById('leaderboard-list');
  list.innerHTML='';
  const data=JSON.parse(localStorage.getItem('players')||'{}');
  Object.entries(data)
    .sort(([,a],[,b])=>b.score-a.score)
    .forEach(([name,s])=>{
      list.innerHTML+=`<li>${name} – ${grade(s)} – Score : ${s.score} – Pays : ${s.discovered.length}</li>`;
    });
}
function grade(player){
  const d=player.discovered.length, p=player.plays;
  if(d>30&&p>10) return "🏆 Grand Maître";
  if(d>20) return "🌍 Expert";
  if(d>10) return "✈️ Voyageur confirmé";
  return "🧳 Explorateur";
}
function nextFlag(){
  const f = pickFlag();
  seenFlags.push(f.country);
  if(seenFlags.length>MAX_HISTORY) seenFlags.shift();
  document.getElementById('flag-img').src=f.img;
  const opts=shuffle([
    f.country,
    ...shuffle(allFlags.filter(x=>x.country!==f.country)).slice(0,3).map(x=>x.country)
  ]);
  const container=document.getElementById('choices');
  container.innerHTML='';
  opts.forEach(o=>{
    const btn=document.createElement('button');
    btn.textContent=o;
    btn.onclick=()=>{
      document.getElementById('feedback').textContent = o===f.country? '✅ Correct !' : `❌ Mauvais… c'était ${f.country}`;
      if(o===f.country){
        score++; discoveredFlags.add(f.country);
      }
      document.getElementById('score').textContent=score;
      document.getElementById('discovered').textContent=discoveredFlags.size;
      saveProgress();
      setTimeout(nextFlag,800);
    };
    container.appendChild(btn);
  });
}
function pickFlag(){
  let pool = allFlags.filter(f=>!seenFlags.includes(f.country));
  if(pool.length===0) seenFlags=[];
  pool = allFlags.filter(f=>Math.random()*f.rarity<2);
  return pool.length? pool[Math.floor(Math.random()*pool.length)] : allFlags[Math.floor(Math.random()*allFlags.length)];
}
function shuffle(a){return a.sort(()=>Math.random()-0.5);}
function endSession(){
  saveProgress();
  alert(`Session terminée.\nScore : ${score}\nPoterie découverte : ${discoveredFlags.size}`);
  location.reload();
}
