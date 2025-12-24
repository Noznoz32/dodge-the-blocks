class Obstacle{
  constructor(x, y, width, height, speed) {

    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.image = new Image();

    // en fonction du choix du perso
    switch(perso){
    
      case "cochon":
        this.image.src = "assets/images/terre.png";
        break;
      case "vache":
        this.image.src = "assets/images/terre.png";
        break;
      case "creeper":
        this.image.src = "assets/images/roche.png";
        break;
      default : 
      this.image.src = "assets/images/brique.png";
    }
  
  }

  update(){
    this.y += this.speed;
  }

  draw(ctx){
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}