var GamePlayScene = function(game, stage)
{
  var self = this;

  var dc;

  var carbon_icon;
  var oxygen_icon;
  var goober_icon;
  var plant_icon;

  var cam;
  var earth;
  var carbons;
  var oxygens;
  var goobers;
  var plants;

  self.ready = function()
  {
    dc = stage.drawCanv;

    //icons
    carbon_icon = GenIcon();
    carbon_icon.context.fillStyle = "#FFFF00";
    carbon_icon.context.beginPath();
    carbon_icon.context.arc(carbon_icon.width/2,carbon_icon.height/2,carbon_icon.width/2,0,2*Math.PI);
    carbon_icon.context.fill();

    oxygen_icon = GenIcon();
    oxygen_icon.context.fillStyle = "#0000FF";
    oxygen_icon.context.beginPath();
    oxygen_icon.context.arc(oxygen_icon.width/2,oxygen_icon.height/2,oxygen_icon.width/2,0,2*Math.PI);
    oxygen_icon.context.fill();

    goober_icon = GenIcon();
    goober_icon.context.fillStyle = "#FF0000";
    goober_icon.context.beginPath();
    goober_icon.context.arc(goober_icon.width/2,goober_icon.height/2,goober_icon.width/2,0,2*Math.PI);
    goober_icon.context.fill();

    plant_icon = GenIcon();
    plant_icon.context.fillStyle = "#00FF00";
    plant_icon.context.beginPath();
    plant_icon.context.arc(plant_icon.width/2,plant_icon.height/2,plant_icon.width/2,0,2*Math.PI);
    plant_icon.context.fill();

    cam = new Camera();
    cam.wx = 0;
    cam.wy = 4;
    cam.wh = 10;
    cam.ww = cam.wh*2;

    earth = new Earth();
    earth.wx = 0;
    earth.wy = -20;
    earth.ww = 10000;
    earth.wh = 40;

    carbons = [];
    oxygens = [];
    goobers = [];
    plants = [];

    goobers.push(new Goober());
    goobers[0].wx = 0;
  };

  self.tick = function()
  {
    //
  };

  self.draw = function()
  {
    earth.wx = cam.wx;
    screenSpace(cam,dc,earth);
    for(var i = 0; i < goobers.length; i++)
      screenSpace(cam,dc,goobers[i]);
    for(var i = 0; i < plants.length; i++)
      screenSpace(cam,dc,plants[i]);

    dc.context.fillStyle = "#000000";
    drawRect(earth);
    for(var i = 0; i < goobers.length; i++)
      drawIcon(goobers[i],goober_icon);
    for(var i = 0; i < plants.length; i++)
      drawIcon(plants[i],plant_icon);
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
  }

  var Carbon = function()
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

  }
  var Oxygen = function()
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
  }

  var Goober = function()
  {
    var self = this;

    self.x;
    self.y;
    self.w;
    self.h;

    self.wx = 0;
    self.ww = 0.5;
    self.wh = 0.5;
    self.wy = 0+self.wh/2;
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
  }

  var drawIcon = function(o,icon)
  {
    dc.context.drawImage(icon,o.x,o.y,o.w,o.h);
  }
  var drawColor = function(o)
  {
    dc.context.fillStyle = o.color;
    dc.context.fillRect(o.x,o.y,o.w,o.h);
  }
  var drawRect = function(o)
  {
    dc.context.fillRect(o.x,o.y,o.w,o.h);
  }
};

