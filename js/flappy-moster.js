//Initial case
//Game playing case
//Game over case

var INITIAL = 1;
var GAME_PLAYING = 2;
var GAME_OVER = 3;
function FlappyMonster(canvas){
    var game=this;
    game.canvas=canvas;
    game.context=game.canvas.getContext('2d');
    
    //GameState
    game.currentState= INITIAL;
    //GameSpeed
    game.velocity=2;
    game.bindEvents();

    //create objects
    game.createObjects();

}
FlappyMonster.prototype.createObjects= function(){
    var game= this;
    game.background1= new GameBackground('images/back.png',game.canvas);
    game.background2= new GameBackground('images/back.png',game.canvas);
    game.background2.x=game.canvas.width;
    
    //Game Score
    game.gameScore= new GameScore(game.canvas);
    game.gameScore.x=game.canvas.width-50;
    game.gameScore.y= 80;

    //wallFactory

    game.WallFactory = new WallFactory(game.canvas);
     
    //Monster
    game.monster= new Monster('images/monster.png',game.canvas);

};
FlappyMonster.prototype.bindEvents = function(){
    var game= this;
    game.canvas.addEventListener('click',function(event)
    {
        console.log(game.currentState);
        switch(game.currentState)
        {

        case INITIAL:
            game.currentState=GAME_PLAYING;
            game.WallFactory.generateWalls();

            break;
        case GAME_PLAYING:
            game.monster.vy =-3*game.velocity;
            break;
        
        }
        
    });
    window.addEventListener('keydown',function(event){
        console.log(event.key);
        switch (game.currentState) {
            case GAME_OVER:
                if(event.key=== "r")
                {
                    game.reset();
                    game.currentState=GAME_PLAYING;
                }
                break;
            }
            
    });

};
FlappyMonster.prototype.reset= function(){
    var game = this;

  // Reset States
  game.gameScore.start = new Date();
  game.gameScore.score = 0;
  game.WallFactory.walls = [];
  game.monster.x = 115;
  game.monster.y = 115;
}
FlappyMonster.prototype.start= function()
{
    var game = this;
    //start Game
    window.requestAnimationFrame(function(){
        game.runGameLoop();
    });
};

FlappyMonster.prototype.runGameLoop = function()
{
    var game = this;
    switch(game.currentState)
    {
        case INITIAL:
            //Draw Initial Screen
            game.drawInitialScreen();
            break;
        case GAME_PLAYING:
            //Draw Game Playing Screen
            game.drawGamePlayingScreen();
            break;
        case GAME_OVER:
            //Draw GameOver Screen
            game.drawGameOverScreen();
            break;
    }
    window.requestAnimationFrame(function(){
        game.runGameLoop();
    });
};
FlappyMonster.prototype.drawInitialScreen= function()
{
    var game = this;   
    //Draw 
    game.context.fillStyle='black';
    game.context.fillRect(0,0,game.canvas.width, game.canvas.height);
    //Text
    game.context.fillStyle='white';
    game.context.font= '36px Arial';
    game.context.fillText('Click to Start!',game.canvas.width / 2 - 100,game.canvas.height/2);
    

};
FlappyMonster.prototype.drawGamePlayingScreen= function()
{
    var game = this;   

    //clear canvas
    game.context.clearRect(0,0,game.canvas.width,game.canvas.height);
    //Draw 
    game.animateBackground();
    
    //Draw Walls
    game.drawWalls();

    //Draw Score
    game.gameScore.draw();

    //Draw Monster
    game.monster.draw();

    //collision check
    game.checkCollisions();
};
FlappyMonster.prototype.checkCollisions= function(){
    var game=this;
    var walls=game.WallFactory.walls;
    for(i=0;i<walls.length;i++)
    {
        if(game.isCollided(game.monster,walls[i]))
        {
            game.currentState=GAME_OVER;
        }
    }
};
FlappyMonster.prototype.isCollided= function(monster,wall){
    var game = this;
  var isCollided = true;

  // Monster Coordinates
  var monsterTop = game.monster.y;
  var monsterBottom = game.monster.y + game.monster.h;
  var monsterRight = game.monster.x + game.monster.w;
  var monsterLeft = game.monster.x;

  // Wall Coordinates
  var wallTop = wall.y + wall.h + wall.gap; // top of lower wall
  var wallBottom = wall.y + wall.h // bottom of upper wall
  var wallRight = wall.x + wall.w;
  var wallLeft = wall.x;

  if((monsterBottom < wallTop  && monsterTop > wallBottom)
    || (monsterLeft > wallRight)
    || (monsterRight < wallLeft)){
    isCollided = false;
  }

  return isCollided;
}
FlappyMonster.prototype.drawWalls = function() {
  // Base
  var game = this;

  // Draw Walls
  var walls = game.WallFactory.walls;

  for(var i = 0; i < walls.length; i++){
    walls[i].draw();
    walls[i].x = walls[i].x - game.velocity;
  }
  game.removeExtraWalls();
};

FlappyMonster.prototype.removeExtraWalls=function(){
    var game = this;

    var walls = game.WallFactory.walls;
    for(var i = 0; i < walls.length; i++){
       if(walls[i].x + walls[i].w <0)
        {

        walls.shift();//removes elements from top of array
        }
      }
};
FlappyMonster.prototype.animateBackground = function(){
    var game= this;
    game.background1.draw();
    game.background2.draw();

    if(Math.abs(game.background1.x) > game.canvas.width){
      game.background1.x = game.canvas.width - game.velocity;
    }
    game.background1.x = game.background1.x - game.velocity;
    if(Math.abs(game.background2.x) > game.canvas.width){
        game.background2.x = game.canvas.width - game.velocity;
      }
      game.background2.x = game.background2.x - game.velocity;
    
};
FlappyMonster.prototype.drawGameOverScreen= function()
{
    var game = this;   
    //Draw 
    game.context.fillStyle='black';
    game.context.fillRect(0,0,game.canvas.width, game.canvas.height);
    //Text
    game.context.fillStyle = 'white';
  game.context.font = '24px Arial';
  game.context.fillText('Your Score :' + game.gameScore.score, game.canvas.width / 2 - 100, game.canvas.height / 2 - 100);
  game.context.font = '36px Arial';
  game.context.fillText('Game Over :(', game.canvas.width / 2 - 100, game.canvas.height / 2);
  game.context.font = '24px Arial';
  game.context.fillText('Press R to Restart!', game.canvas.width / 2 - 100, game.canvas.height / 2 + 50);
};