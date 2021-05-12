function Monster(src,canvas)
{
    var monster= this;

    monster.canvas=canvas;
    monster.context= monster.canvas.getContext('2d');

    //specification
    monster.x=115;
    monster.y=115;
    monster.w=50;
    monster.h=115;
    monster.vy = 0;
    monster.g=0.20;
    monster.src=src;
    monster.img=null;
    monster.frame=0;

    // create Monster
    monster.create();
}

Monster.prototype.create = function(){
    var monster= this;

    monster.img= new Image();
    monster.img.src=monster.src;
};
Monster.prototype.draw= function()
{
    var monster= this;

    if(monster.img!=null)
    {
        monster.vy= monster.vy+monster.g;
        monster.y += monster.vy;

        if(monster.y+monster.h> monster.canvas.height){
            monster.y= monster.canvas.height-monster.h;
            monster.vy=0;
        }
        else if(monster.y<0)
        {
            monster.y=0;
            monster.vy=0;
        }
        monster.context.drawImage(monster.img,monster.frame*115,0,115,100,monster.x,monster.y,monster.w,monster.h);
        monster.frame++;
        monster.frame%=4;
    }
;}
