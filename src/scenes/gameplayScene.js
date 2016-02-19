var GamePlayScene = function(game, stage)
{
  var self = this;

  var dc;

  var cam;
  var earth;
  var goobers;

  self.ready = function()
  {
    dc = stage.drawCanv;

    cam = new Camera();
    cam.wx = 2;
    cam.wy = 2;
    cam.wh = 10;
    cam.ww = cam.wh*2;

    earth = new Earth();
    earth.wx = 0;
    earth.wy = 0;
    earth.ww = 4;
    earth.wh = 4;
    goobers = [];
    plants = [];

    goobers.push(new Goober());
  };

  self.tick = function()
  {
  };

  self.draw = function()
  {
    screenSpace(cam,dc,earth);
    console.log(earth.x+","+earth.y);
    for(var i = 0; i < goobers.length; i++)
      screenSpace(cam,dc,goobers[i]);
    for(var i = 0; i < plants.length; i++)
      screenSpace(cam,dc,plants[i]);

    earth.draw();
    for(var i = 0; i < goobers.length; i++)
      goobers[i].draw();
    for(var i = 0; i < plants.length; i++)
      plants[i].draw();
  };

  self.cleanup = function()
  {
  };

  var Camera = function()
  {
    var self = this;

    self.wx = 0;
    self.wy = 0;
    self.wh = 1; //1 = -0.5 -> 0.5
    self.ww = 1; //1 = -0.5 -> 0.5
  }

  var Earth = function()
  {
    var self = this;

    self.x;
    self.y;
    self.w;
    self.h;

    self.wx = 0;
    self.wy = 0;
    self.ww = 0;
    self.wh = 0;

    self.draw = function()
    {
      dc.context.fillStyle = "#000000";
      dc.context.fillRect(self.x,self.y,self.w,self.h);
    }
  }

  var Goober = function()
  {
    var self = this;

    self.x;
    self.y;
    self.w;
    self.h;

    self.wx = 0;
    self.wy = 0;
    self.ww = 0;
    self.wh = 0;

    self.draw = function()
    {
      dc.context.fillStyle = "#FF0000";
      dc.context.fillRect(self.x,self.y,self.w,self.h);
    }
  }

  var Plant = function()
  {
    var self = this;

    self.x;
    self.y;
    self.w;
    self.h;

    self.wx = 0;
    self.wy = 0;
    self.ww = 0;
    self.wh = 0;

    self.draw = function()
    {
      dc.context.fillStyle = "#00FF00";
      dc.context.fillRect(self.x,self.y,self.w,self.h);
    }
  }
};

