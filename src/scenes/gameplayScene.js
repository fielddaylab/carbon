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

  var ENUM;
  ENUM = 0;
  var MOLECULAR_VIEW_EARTH  = ENUM; ENUM++;
  var MOLECULAR_VIEW_GOOBER = ENUM; ENUM++;
  var MOLECULAR_VIEW_PLANT  = ENUM; ENUM++;

  var mview_trans;

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
    plants.push(new Plant());
    plants[0].wx = 1;

    mview_trans = new MolecularViewTransitioner();
  };

  self.tick = function()
  {
    for(var i = 0; i < goobers.length; i++)
      tickGoober(goobers[i]);
    for(var i = 0; i < plants.length; i++)
      tickPlant(plants[i]);

    dc.context.globalAlpha=0.1;
    for(var i = 0; i < carbons.length; i++)
      tickParticle(carbons[i]);
    for(var i = 0; i < oxygens.length; i++)
      tickParticle(oxygens[i]);
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

    drawCarbonMeter(earth,0,0);
    for(var i = 0; i < goobers.length; i++)
    {
      drawIcon(goobers[i],goober_icon);
      drawCarbonMeter(goobers[i]);
    }
    for(var i = 0; i < plants.length; i++)
    {
      drawIcon(plants[i],plant_icon);
      drawCarbonMeter(plants[i]);
    }

    dc.context.globalAlpha=0.1;
    for(var i = 0; i < carbons.length; i++)
      drawIcon(carbons[i],carbon_icon);
    for(var i = 0; i < oxygens.length; i++)
      drawIcon(oxygens[i],oxygen_icon);
    dc.context.globalAlpha=1;
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

    self.carbon = 100;
    self.oxygen = 100;

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

    self.carbon = 10;
    self.oxygen = 5;
    self.hungry = 0;
    self.t = 0;

    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;

    self.wx = 0;
    self.ww = 0.5;
    self.wh = 0.5;
    self.wy = 0+self.wh/2;
  }

  var Plant = function()
  {
    var self = this;

    self.carbon = 10;
    self.oxygen = 5;
    self.t = 0;

    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;

    self.wx = 0;
    self.ww = 0.5;
    self.wh = 0.5;
    self.wy = 0+self.wh/2;
  }

  var MolecularViewTransitioner = function()
  {
    var self = this;

    self.mview     = MOLECULAR_VIEW_EARTH;
    self.mview_new = MOLECULAR_VIEW_EARTH;
    self.mview_old = MOLECULAR_VIEW_EARTH;
    self.mview_amt_old = 0;
    self.mview_amt_new = 1;
    self.mview_trans = 1;

    self.tick = function()
    {
      if(self.mview_trans)
      {
        if(self.mview_amt_old > 0)
        {
          self.mview_amt_old -= 0.1;
          self.mview = self.mview_old;
        }
        else if(self.mview_amt_new < 1)
        {
          self.mview_amt_new += 0.1;
          self.mview = self.mview_new;
        }

        self.mview_amt_old = clamp(0,1,self.mview_amt_old);
        self.mview_amt_new = clamp(0,1,self.mview_amt_new);
        if(self.mview_amt_new == 1) self.mview_trans = 0;
      }
    }

    self.transition = function(v)
    {
      if(v == self.mview_new) return;

      if(self.mview_amt_old) //already transitioning- just switch target
      {
        self.mview_new = v;
        return;
      }
      else if(self.mview_amt_new < 1) //transitioning toward incorrect target- flip
      {
        self.mview_old = self.mview_new; self.mview_amt_old = self.mview_amt_new;
        self.mview_new = v;              self.mview_amt_new = 0;
        self.mview;
      }
      else //not currently in transition
      {
        self.mview_old = self.mview; self.mview_amt_old = 1;
        self.mview_new = v;          self.mview_amt_new = 0;
        self.mview_trans = 1;
      }
    }

  }

  var ot;
  var ct;
  var tickGoober = function(o)
  {
    o.t++;
    //console.log(o.oxygen+","+o.carbon);
    if(o.t % 100 == 0)
    {
      //1x o2
      ot = 2;
      o.oxygen += ot; earth.oxygen -= ot;

      //1x co2
      ot = 2;
      ct = 1;
      o.carbon -= ct; earth.carbon += ct;
      o.oxygen -= ot; earth.oxygen += ot;

      if(o.carbon < 0) { earth.carbon += o.carbon; o.carbon = 0; }
      if(o.oxygen < 0) { earth.oxygen += o.oxygen; o.oxygen = 0; }
    }

    if(o.carbon < 5) //seek out food
    {
      var closest_pi = -1;
      var closest_d = 99999;
      var d;
      for(var i = 0; i < plants.length; i++)
      {
        d = Math.abs(plants[i].wx-o.wx);
        if(d < closest_d)
        {
          closest_pi = i;
          closest_d = d;
        }
      }

      if(closest_pi != -1) //found food
      {
        if(d <= 0.1) //eat it
        {
          o.carbon += plants[closest_pi].carbon;
          o.oxygen += plants[closest_pi].oxygen;
          plants.splice(closest_pi,1);
          o.hungry = 0;
        }
        else //move toward it
        {
          o.wx += (plants[closest_pi].wx-o.wx)/d/10;
        }
      }
    }
    if(o.carbon == 0) //starving
    {
      o.hungry++;
      if(o.hungry > 100) //dead
      {
        earth.carbon += o.carbon;
        earth.oxygen += o.oxygen;
        for(var i = 0; i < goobers.length; i++)
          if(goobers[i] == o) goobers.splice(i,1);
      }
    }
  }
  var tickPlant = function(o)
  {
    o.t++;
    if(o.t % 100 == 0)
    {
      //1x co2
      ot = 2;
      ct = 1;
      o.oxygen += ot; earth.oxygen -= ot;
      o.carbon += ct; earth.carbon -= ct;

      //1x o2
      ot = 2;
      o.oxygen -= ot; earth.oxygen += ot;

      if(o.carbon < 0) { earth.carbon += o.carbon; o.carbon = 0; }
      if(o.oxygen < 0) { earth.oxygen += o.oxygen; o.oxygen = 0; }
    }
  }

  var drawCarbonMeter = function(o,x,y)
  {
    if(x == undefined) x = o.x;
    if(y == undefined) y = o.y;
    dc.context.fillStyle = "#FFFF00";
    dc.context.fillRect(x,y,2,(o.carbon/100)*20);
    dc.context.fillStyle = "#0000FF";
    dc.context.fillRect(x+2,y,2,(o.oxygen/100)*20);
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

