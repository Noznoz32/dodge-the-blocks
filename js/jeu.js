let canvas, ctx, joueur, obstacles = [], score = 0, gameOver = false;

// Définition des paliers de difficulté
const niveaux = [
  { scoreMin: 0, vitesse: 4, couleur: "#2c5364" },
  { scoreMin: 300, vitesse: 5, couleur: "#1fbcffff" },
  { scoreMin: 600, vitesse: 6, couleur: "#2bd390ff" },
  { scoreMin: 900, vitesse: 7, couleur: "#f455ccff" },
  { scoreMin: 1200, vitesse: 8, couleur: "#b12bd3ff" },
  { scoreMin: 1500, vitesse: 9, couleur: "#d38a2bff" },
  { scoreMin: 1800, vitesse: 10, couleur: "#d35d2bff" },
  { scoreMin: 2100, vitesse: 11, couleur: "#653714ff" },
  { scoreMin: 2400, vitesse: 12, couleur: "#2d1b0cff" },
  { scoreMin: 2700, vitesse: 13, couleur: "#3d0000ff" }
];

function getNiveau(score) {
  // Récupère le niveau correspondant au score
  let niveau = niveaux[0];
  for (let i = niveaux.length - 1; i >= 0; i--) {
    if (score >= niveaux[i].scoreMin) {
      niveau = niveaux[i];
      break;
    }
  }
  return niveau;
}

function initGame() {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // utilise la variable globale définie dans menu.js
  joueur = new Joueur(175, 500, 50, 50, perso);

  obstacles = [];
  score = 0;
  gameOver = false;

  // expose keys globalement si pas déjà
  window.keys = window.keys || {};
  requestAnimationFrame(updateGame);
}

function updateGame() {
  // si Game Over
  if (gameOver) {
    // on relève le pseudo et le score
    const pseudo = document.getElementById("playerName").value;
    const scoreFinal = score;
    // on l'ajoute au tableau des scores
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    scores.push({ pseudo: pseudo, score: scoreFinal });
    // on trie le tableau dans l'ordre décroissant
    scores.sort((a, b) => b.score - a.score);
    // on ne garde que les 10 meilleurs scores
    scores = scores.slice(0, 10);
    localStorage.setItem("scores", JSON.stringify(scores));

    // ensuite seulement on affiche game over
    document.body.style.background = "red";
    document.getElementById("replayButton").classList.remove("hidden");
    document.getElementById("gameOver").classList.remove("hidden");
    gameOverAudio.play();

    return;
  }

  // on récupère le niveau actuel
  const niveau = getNiveau(score);
  // change la couleur de fond selon le niveau
  document.body.style.background = niveau.couleur;


  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // gestion du joueur
  joueur.move(window.keys);
  joueur.draw(ctx);

  if (Math.random() < 0.02) {
    obstacles.push(new Obstacle(Math.random() * 360, -20, 40, 40, niveau.vitesse));
  }

  // mise à jour des obstacles + collision
  obstacles.forEach(o => {
    o.update();
    o.draw(ctx);

    if (checkCollision(joueur, o) && !gameOver) {
      gameOver = true;
      console.log("Collision détectée → gameOver = true");

      // utilise l'audio global préchargé
      if (typeof window.gameOverAudio !== "undefined") {
        try {
          window.gameOverAudio.currentTime = 0;
          const playPromise = window.gameOverAudio.play();
          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log("gameOverAudio a bien joué.");
            }).catch(err => {
              console.warn("Échec play() du son Game Over :", err);
            });
          }
        } catch (err) {
          console.warn("Erreur lors du play() window.gameOverAudio :", err);
        }
      } else {
        // fallback si la variable globale n'existe pas
        let audio = new Audio("assets/son/son-game-over.mp3");
        audio.play().catch(err => console.warn("Échec play() fallback:", err));
      }
    }
  });

  obstacles = obstacles.filter(o => o.y < 600);

  score++;
  document.getElementById("scoreDisplay").textContent = "Score : " + score;

  requestAnimationFrame(updateGame);
}