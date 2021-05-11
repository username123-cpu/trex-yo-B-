var trex, trex_running;
var edges;
var piso, pisoIMG;
var pisofalso
var cloudimage
var jumpS;
var obstaculo1
var obstaculo2
var obtaculo3
var obstaculo4
var obstaculo5
var obstaculo6
var die
var checkpoint
var puntos
var grupo_de_cactus;
var gameoverPNG, gameover;
var restartPNG, restart;
var gamestate;
var grupo_de_nubes;
var trex_collide
var trex_agachado
var Pterodactilo
var dn;

function preload(){
  //animación de correr
  trex_running =        loadAnimation("trex1.png","trex3.png","trex4.png");
  
  //imagen del piso
  pisoIMG =  
    loadImage("ground2.png");
  
  cloudimage =
    loadImage("cloud.png");
  
  jumpS =
    loadSound("jump.mp3");
  
  obstaculo1 =
    loadImage("obstacle1.png")
  
  obstaculo2 =
    loadImage("obstacle2.png")
  
  obstaculo3 =
    loadImage("obstacle3.png")

  obstaculo4 =
    loadImage("obstacle4.png")
  
  obstaculo5 =
    loadImage("obstacle5.png")
  
    obstaculo6 =
    loadImage("obstacle1.png")
  
    die =
      loadSound("die.mp3");
  
    checkpoint =
      loadSound("checkPoint.mp3");  
    
    gameoverPNG =
      loadImage("gameOver.png")
  
    restartPNG =
      loadImage("restart.png")
  
    trex_collide =
      loadAnimation("trex_collided.png")
  
    trex_agachado =
      loadAnimation("trex_down1.png", "trex_down2.png")
  
    Pterodactilo =
      loadAnimation("tero1.png", "tero2.png")
}

function setup() {
  createCanvas(600, 200);
  puntos = 0;
  dn = 0;
  //create a trex sprite
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("trex_collide", trex_collide);
  trex.addAnimation("trex_agachado", trex_agachado);
  //cambiar la hitbox
  trex.setCollider("circle",0,0,50)
  //ver la hitbox
  //trex.debug = true
  grupo_de_cactus = new Group();
  grupo_de_nubes = new Group();
  
  gamestate = "start";
  
  //adding scale and position to trex
  trex.scale = 0.5;
  trex.x = 50
  
  //crear piso
  piso = createSprite(200,180,400,20);
  piso.addImage("piso",pisoIMG);
  
  restart = createSprite (300,130, 20, 20);
  restart.addImage("restart", restartPNG);
  restart.scale = 0.5;
  restart.visible = false

  
  gameover = createSprite(300,80,20,20);
  gameover.addImage("gameover", gameoverPNG);
  gameover.scale = 0.5;
  gameover.visible = false
  
  //piso para engañar
  pisofalso = createSprite(200,192,400,10);
  pisofalso.visible = false;
  //edges
  edges=createEdgeSprites();
  
  
}


function draw() {
  if (dn === 0){
    background("grey");
}
  if (dn === 1){
    noche();
  }
  
  if(gamestate === "start" && keyDown("space")){
      gamestate = "play";
  }
  
  if(gamestate === "play"){
     piso.velocityX = -10
    cactus();
    nubecitas();
     if(frameCount % 20 === 0){
  puntos = puntos + 1;
    }   
    if(keyDown("space") && trex.y > 100) {
    trex.velocityY = -10;
    jumpS.play();
  }
    if(keyWentDown("down_arrow")){
      trex.changeAnimation("trex_agachado", trex_agachado)
      trex.scale = 0.4;
    }
    if (keyWentUp("down_arrow")){
      trex.changeAnimation("running", trex_running)
      trex.scale = 0.5;
    }
     trex.velocityY = trex.velocityY + 0.8
    //vamos a preguntar si choca
    if(trex.isTouching(grupo_de_cactus)){
      gamestate = "end";
      die.play();
      trex.changeAnimation("trex_collide", trex_collide);
    }
    pterodactilos();
    if (puntos % 80 === 0 && puntos > 0){
      dn = 1;
    }
  }
  
  if(gamestate === "end"){
  //primero va "set" antes del nombre y despues va "each"
    grupo_de_cactus.setVelocityXEach(0)
    grupo_de_nubes.setVelocityXEach(0)
    piso.velocityX = 0;
    grupo_de_cactus.setLifetimeEach(-1)
    grupo_de_nubes.setLifetimeEach(-1)
    restart.visible = true
    gameover.visible = true
    trex.velocityY = 0;
    if(mousePressedOver(restart)){
      restarted();
    }
  }
  
  //console.log(frameCount)
  //ilusion de correr
 
  fill(255,255,255);
 text("score "+puntos,20,20);
  
  if(puntos % 100 === 0 && puntos > 0){
    checkpoint.play();
  }
  
  //para que el piso no se acabe
  if (piso.x < 0){
    piso.x = piso.width/2
  }
  
  //jumping the trex on space key press
  
  //console.log(trex.y);
  //gravedad
 
  
 
 
 //stop trex from falling down 
  trex.collide(pisofalso);
  drawSprites();
  
  
//version 1 
  if(trex.isTouching(grupo_de_cactus)){
    //die.play();
  }
}

//crear nubes
function nubecitas(){
  if(frameCount % 100 === 0){
    var nube = createSprite(600, 20, 20, 20)
    // la nube se mueve
    nube.velocityX = -3
    nube.addImage(cloudimage);
    var r = random(1,40); 
    nube.y = r 
 //profundidad
    nube.depth = trex.depth;
    trex.depth = trex.depth + 1;
    nube.lifetime = 220;
    grupo_de_nubes.add(nube);
  }
}
//crear obstaculo cactus :D
function cactus(){
if(frameCount % 120 === 0){
  var cactus = createSprite(600,170,20,20);
  cactus.velocityX = -4;
  cactus.shapeColor = "green";
  var ran = Math.round(random(1,6));
  //para crear diferentes casos
  switch(ran){
    case 1 : 
      cactus.addImage(obstaculo1)
      break;
      
      case 2 :
      cactus.addImage(obstaculo2)
      break;
    
      case 3 :
      cactus.addImage(obstaculo3);
      
      break;
      
        case 4 :
      cactus.addImage(obstaculo4);
      
      break;
      
        case 5 :
      cactus.addImage(obstaculo5);
      
      break;
      
        case 6 :
      cactus.addImage(obstaculo6);
      
      break;
          }
cactus.scale = 0.7;
cactus.lifetime = 160;
  grupo_de_cactus.add(cactus);
}
}
function restarted(){
  gamestate = "start";
  restart.visible = false
  gameover.visible = false
  grupo_de_cactus.destroyEach();
  grupo_de_nubes.destroyEach();
  trex.changeAnimation("running", trex_running);
  puntos = 0;
  trex.y = 180;
  dn = 0;
}
function pterodactilos(){
  if(frameCount % 150 === 0){
    var tero = createSprite(600, 100, 20,20);
    tero.addAnimation("Pterodactilo", Pterodactilo)
    tero.velocityX = -4;
  }
}

function noche(){
  background("black");
  if (puntos % 100 === 0 && puntos > 0){
    dn = 0;
  }
  
}