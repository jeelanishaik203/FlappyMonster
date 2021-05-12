window.onload= function(){
    var canvas= document.getElementById('flappy-monster');
    var flappyMonster= new  FlappyMonster(canvas);
flappyMonster.start();
};