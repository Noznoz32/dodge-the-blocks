

class Joueur{
  constructor(x, y, width, height,perso){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 5;
    this.image = new Image();
    this.moveSound = new Audio();
    
    // en fonction du choix du perso
    switch(perso){
    
      case "cochon":
        this.image.src = "assets/images/cochon.png";
        this.moveSound = new Audio("assets/sons/cochon.mp3");
        this.moveSound.preload = "auto";
        break;
      case "vache":
        this.image.src = "assets/images/vache.png";
        this.moveSound = new Audio("assets/sons/vache.mp3");
        this.moveSound.preload = "auto";
        break;
      case "creeper":
        this.image.src = "assets/images/creeper.png";
        this.moveSound = new Audio("assets/sons/creeper.mp3");
        this.moveSound.preload = "auto";
        break;
      default : 
      this.image.src = "assets/images/steve.png";
      this.moveSound = new Audio("assets/sons/steve.mp3");
      this.moveSound.preload = "auto";
    }
  }
  
  move(keys){
    let moved = false;

    if (keys.ArrowLeft && this.x > 0){
      this.x -= this.speed;
      moved=true;
    } 
    if (keys.ArrowRight && this.x + this.width < 400){
      this.x += this.speed;
      moved=true
    }

    // on joue le son du perso quand il bouge
    if (moved){
      this.moveSound.currentTime = 0; // on réinitialise le son
      this.moveSound.play();
    }

  }


  draw(ctx){
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}