let perso = "steve"; // perso par défault
let gameOverAudio = new Audio("assets/sons/son-game-over.mp3");
gameOverAudio.preload = "auto";

let menuAudio = new Audio("assets/sons/menu.mp3"); 
menuAudio.loop = true;      
menuAudio.volume = 0.5;    
menuAudio.preload = "auto"; 

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("startForm");
  const menu = document.getElementById("menu");

  menu.addEventListener("click", () => {
        menuAudio.play().catch(err => console.warn("Impossible de jouer le son :", err));
    }, { once: true }); 

  const gameContainer = document.getElementById("gameContainer");
  const replayBtn = document.getElementById("replayButton");

  document.addEventListener("keydown", e => keys[e.key] = true);
  
  document.addEventListener("keyup", e => keys[e.key] = false);

  document.querySelectorAll(".boutons-joueur").forEach(bouton => {
    bouton.addEventListener("click", function() {
      document.querySelectorAll(".boutons-joueur").forEach(b => b.classList.remove("clicked"));
      this.classList.add("clicked");
      perso = this.id;  // enregistrement du personnage choisi
    });
  });

  document.getElementById("playButton").addEventListener("click", () => {
    
    // débloquer l'audio grâce au clic utilisateur
    gameOverAudio.play().then(() => {
      // si ça a réussi, on pause tout de suite et on remet au début.
      gameOverAudio.pause();
      gameOverAudio.currentTime = 0;
    }).catch(err => {
      // si le navigateur refuse, on log ue pour debugging, mais on continue
      console.warn("Impossible de pré-jouer le son (bloqué) :", err);
    });

    document.body.classList.remove("menu-bg");

    // arrêter le son du menu
    menuAudio.pause();
    menuAudio.currentTime = 0;

    // cacher le menu et afficher jeu
    const menu = document.getElementById("menu");
    const gameContainer = document.getElementById("gameContainer");
    menu.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    initGame();
  });

  replayBtn.addEventListener("click", () => location.reload());

  // contrôle du perso si on joue sur mobile
  const leftBtn = document.getElementById("leftBtn");
  const rightBtn = document.getElementById("rightBtn");

  if (leftBtn && rightBtn) {
    leftBtn.addEventListener("touchstart", () => keys.ArrowLeft = true);
    leftBtn.addEventListener("touchend", () => keys.ArrowLeft = false);

    rightBtn.addEventListener("touchstart", () => keys.ArrowRight = true);
    rightBtn.addEventListener("touchend", () => keys.ArrowRight = false);
  }
});

// pour afficher le tableau des scores :
document.getElementById("Scores").addEventListener("click", afficherScores);

function afficherScores() {
    const scoreBoard = document.getElementById("scoreBoard");
    const tbody = document.querySelector("#scoresTable tbody");

    // alterne l'affichage
    scoreBoard.classList.toggle("hidden");

    // recharge les scores
    tbody.innerHTML = "";

    const scores = JSON.parse(localStorage.getItem("scores")) || [];

    scores.forEach(s => {
        const ligne = document.createElement("tr");
        ligne.innerHTML = `<td>${s.pseudo}</td><td>${s.score}</td>`;
        tbody.appendChild(ligne);
    });
}
