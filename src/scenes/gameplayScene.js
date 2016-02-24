var GamePlayScene = function(game, stage)
{
  var self = this;

  var dc;
  var n_updates;

  var clicker;

  var plant_start_oxygen = 5;
  var plant_start_carbon = 5;
  var plant_ideal_oxygen = 5;
  var plant_ideal_carbon = 5;
  var plant_birth_carbon_cost = 1;
  var goober_start_oxygen = 5;
  var goober_start_carbon = 5;
  var goober_ideal_oxygen = 5;
  var goober_ideal_carbon = 5;
  var goober_birth_carbon_cost = 5;

  var oxygen_icon;
  var carbon_icon;
  var goober_icon;
  var plant_icon;

  var cam;
  var earth;
  var oxygens;
  var carbons;
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
    n_updates = 0;

    clicker = new Clicker({source:stage.dispCanv.canvas});

    //icons
    oxygen_icon = GenIcon();
    oxygen_icon.context.fillStyle = "#0000FF";
    oxygen_icon.context.beginPath();
    oxygen_icon.context.arc(oxygen_icon.width/2,oxygen_icon.height/2,oxygen_icon.width/2,0,2*Math.PI);
    oxygen_icon.context.fill();

    carbon_icon = GenIcon();
    carbon_icon.context.fillStyle = "#FFFF00";
    carbon_icon.context.beginPath();
    carbon_icon.context.arc(carbon_icon.width/2,carbon_icon.height/2,carbon_icon.width/2,0,2*Math.PI);
    carbon_icon.context.fill();

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
    earth.wy = cam.wy;
    earth.ww = cam.ww;
    earth.wh = cam.wh;

/*
    earth.oxygen = 100;
    earth.carbon = 25;
    earth.o2 = 25;
    earth.co2 = 25;
*/
    earth.oxygen = 100;
    earth.carbon = 100;
    earth.o2 = 25;
    earth.co2 = 25;

    oxygens = [];
    for(var i = 0; i < earth.oxygen; i++)
    {
      var o = new Oxygen();
      o.target = earth;
      o.wx = Math.random()*cam.ww-cam.ww/2;
      o.wy = Math.random()*cam.wh-cam.wh/2;
      oxygens.push(o);
    }
    earth.oxygen_rep = oxygens.length;

    carbons = [];
    for(var i = 0; i < earth.carbon; i++)
    {
      var c = new Carbon();
      c.target = earth;
      c.wx = Math.random()*cam.ww-cam.ww/2;
      c.wy = Math.random()*cam.wh-cam.wh/2;
      carbons.push(c);
    }
    earth.carbon_rep = carbons.length;

    goobers = [];
    for(var i = 0; i < 2; i++)
    {
      var g = new Goober();
      g.wx = 0;
      transfer(earth,g,0,0,goober_start_oxygen,goober_start_carbon);
      clicker.register(g);
      goobers.push(g);
    }

    plants = [];
    for(var i = 0; i < 2; i++)
    {
      var p = new Plant();
      p.wx = Math.random()*cam.ww-cam.ww/2;
      transfer(earth,p,0,0,plant_start_oxygen,plant_start_carbon);
      clicker.register(p);
      plants.push(p);
    }

    mview_trans = new MolecularViewTransitioner();
  };

  self.tick = function()
  {
    n_updates++;

    clicker.flush();

    for(var i = 0; i < goobers.length; i++)
      tickGoober(goobers[i]);
    for(var i = 0; i < plants.length; i++)
      tickPlant(plants[i]);

    resolveReps();

    dc.context.globalAlpha=0.1;
    for(var i = 0; i < oxygens.length; i++)
      tickOxygen(oxygens[i]);
    for(var i = 0; i < carbons.length; i++)
      tickCarbon(carbons[i]);
  };

  self.draw = function()
  {
    earth.wx = cam.wx;
    screenSpace(cam,dc,earth);
    for(var i = 0; i < goobers.length; i++)
      screenSpace(cam,dc,goobers[i]);
    for(var i = 0; i < plants.length; i++)
      screenSpace(cam,dc,plants[i]);
    for(var i = 0; i < oxygens.length; i++)
      screenSpace(cam,dc,oxygens[i]);
    for(var i = 0; i < carbons.length; i++)
      screenSpace(cam,dc,carbons[i]);

    dc.context.fillStyle = "#000000";
    //drawRect(earth);

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

    dc.context.globalAlpha=0.9;
    for(var i = 0; i < oxygens.length; i++)
      drawIcon(oxygens[i],oxygen_icon);
    for(var i = 0; i < carbons.length; i++)
      drawIcon(carbons[i],carbon_icon);
    dc.context.globalAlpha=1;

    dc.context.fillRect(dc.width/2+Math.cos(n_updates/10)*10-5,dc.height/2+Math.sin(n_updates/10)*10-5,10,10);
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

    self.oxygen = 0;
    self.carbon = 0;
    self.oxygen_rep = 0;
    self.carbon_rep = 0;
    self.o2 = 0;
    self.co2 = 0;

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
    self.ww = 0.1;
    self.wh = 0.1;

    self.target;
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
    self.ww = 0.1;
    self.wh = 0.1;

    self.target;
  }

  var Goober = function()
  {
    var self = this;

    self.oxygen = 0;
    self.carbon = 0;
    self.oxygen_rep = 0;
    self.carbon_rep = 0;
    self.o2 = 0;
    self.co2 = 0;

    self.starving = 0;
    self.suffocating = 0;
    self.t = 0;

    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;

    self.wx = 0;
    self.ww = 0.5;
    self.wh = 0.5;
    self.wy = 0+self.wh/2+Math.random();

    self.click = function(evt)
    {
      if(self.carbon > goober_birth_carbon_cost)
      {
        self.carbon -= goober_birth_carbon_cost;
        var g = new Goober();
        g.oxygen = 0;
        g.carbon = goober_birth_carbon_cost;
        g.wx = self.wx;
        clicker.register(g);
        goobers.push(g);
      }
    }
  }

  var Plant = function()
  {
    var self = this;

    self.oxygen = 0;
    self.carbon = 0;
    self.oxygen_rep = 0;
    self.carbon_rep = 0;
    self.o2 = 0;
    self.co2 = 0;

    self.starving = 0;
    self.suffocating = 0;
    self.t = 0;

    self.x = 0;
    self.y = 0;
    self.w = 0;
    self.h = 0;

    self.wx = 0;
    self.ww = 0.5;
    self.wh = 0.5;
    self.wy = 0+self.wh/2+Math.random();

    self.click = function(evt)
    {
      if(self.carbon > plant_birth_carbon_cost)
      {
        self.carbon -= plant_birth_carbon_cost;
        var p = new Plant();
        p.oxygen = 0;
        p.carbon = plant_birth_carbon_cost;
        p.wx = Math.random()*cam.ww-cam.ww/2;
        clicker.register(p);
        plants.push(p);
      }
    }
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

  var transfer = function(from,to,o2,co2,oxygen,carbon)
  {
    to.o2 += o2; from.o2 -= o2;
    if(from.o2 < 0) { o2 += from.o2; to.o2 += from.o2; from.o2 = 0; }
    from.oxygen -= 2*o2;

    to.co2 += co2; from.co2 -= co2;
    if(from.co2 < 0) { co2 += from.co2; to.co2 += from.co2; from.co2 = 0; }
    from.oxygen -= 2*co2;
    from.carbon -= co2;

    to.oxygen += oxygen; from.oxygen -= oxygen;
    if(from.oxygen < 0) { to.oxygen += from.oxygen; from.oxygen = 0; }

    to.carbon += carbon; from.carbon -= carbon;
    if(from.carbon < 0) { to.carbon += from.carbon; from.carbon = 0; }
  }

  var ot;
  var ct;
  var tickGoober = function(o)
  {
    o.t++;
    if(o.t % 100 == 0)
    {
      //1x o2
      ot = 2;
      ct = 0;
      transfer(earth,o,0,0,ot,ct);
      //1x co2
      ot = 2;
      ct = 1;
      transfer(o,earth,0,0,ot,ct);

      //breathe heavy
      if(o.oxygen < goober_ideal_oxygen)
      {
        ot = 2;
        ct = 0;
        transfer(earth,o,0,0,ot,ct);
      }

      if(o.oxygen < goober_ideal_oxygen) o.suffocating++;
      if(o.carbon < goober_ideal_carbon) o.starving++;
      if(o.starving > 10 || o.suffocating > 10) //dead
      {
        killGoober(o);
        return;
      }
    }

    if(o.carbon < goober_ideal_carbon) //seek out food
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
        if(closest_d <= 0.1) //eat it
        {
          var p_carbon = plants[closest_pi].carbon;
          killPlant(plants[closest_pi]); //give to earth
          //take carbon back from earth
          transfer(earth,o,0,0,0,p_carbon);
          o.starving -= Math.floor((o.carbon/goober_ideal_carbon)*o.starving);
        }
        else //move toward it
        {
          o.wx += (plants[closest_pi].wx-o.wx)/closest_d/10;
        }
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
      transfer(earth,o,0,0,ot,ct);
      //1x o2
      ot = 2;
      ct = 0;
      transfer(o,earth,0,0,ot,ct);

      //breathe heavy
      if(o.oxygen < plant_ideal_oxygen)
      {
        ot = 2;
        ct = 0;
        transfer(earth,o,0,0,ot,ct);
      }

      if(o.oxygen < plant_ideal_oxygen) o.suffocating++;
      if(o.carbon < plant_ideal_carbon) o.starving++;
      if(o.starving > 10 || o.suffocating > 10) //dead
      {
        killPlant(o);
        return;
      }
    }
  }

  var tickOxygen = function(o)
  {
    o.wx += (Math.random()-0.5)*0.1;
    o.wy += (Math.random()-0.5)*0.1;

    if(!worldPtWithinObj(o.wx,o.wy,o.target))
    {
      o.wx = lerp(o.wx,o.target.wx,0.1);
      o.wy = lerp(o.wy,o.target.wy,0.1);
    }
    else
    {
      if(o.wx < o.target.wx-(o.target.ww/2)) o.wx = o.target.wx-(o.target.ww/2);
      if(o.wx > o.target.wx+(o.target.ww/2)) o.wx = o.target.wx+(o.target.ww/2);
      if(o.wy < o.target.wy-(o.target.wh/2)) o.wy = o.target.wy-(o.target.wh/2);
      if(o.wy > o.target.wy+(o.target.wh/2)) o.wy = o.target.wy+(o.target.wh/2);
    }
  }

  var tickCarbon = function(o)
  {
    o.wx += (Math.random()-0.5)*0.1;
    o.wy += (Math.random()-0.5)*0.1;

    if(!worldPtWithinObj(o.wx,o.wy,o.target))
    {
      o.wx = lerp(o.wx,o.target.wx,0.1);
      o.wy = lerp(o.wy,o.target.wy,0.1);
    }
    else
    {
      if(o.wx < o.target.wx-(o.target.ww/2)) o.wx = o.target.wx-(o.target.ww/2);
      if(o.wx > o.target.wx+(o.target.ww/2)) o.wx = o.target.wx+(o.target.ww/2);
      if(o.wy < o.target.wy-(o.target.wh/2)) o.wy = o.target.wy-(o.target.wh/2);
      if(o.wy > o.target.wy+(o.target.wh/2)) o.wy = o.target.wy+(o.target.wh/2);
    }
  }


  var resolveReps = function()
  {
    var g;
    var p;
    var o;
    var c;

    //goobers expell
    for(var i = 0; i < goobers.length; i++)
    {
      g = goobers[i];

      //expell oxygen
      for(var j = 0; (g.oxygen_rep > g.oxygen) && j < oxygens.length; j++)
      {
        o = oxygens[j];
        if(o.target == g)
        {
          o.target = earth;
          earth.oxygen_rep++;
          g.oxygen_rep--;
        }
      }

      //expell carbon
      for(var j = 0; (g.carbon_rep > g.carbon) && j < carbons.length; j++)
      {
        c = carbons[j];
        if(c.target == g)
        {
          c.target = earth;
          earth.carbon_rep++;
          g.carbon_rep--;
        }
      }
    }

    //plants expell
    for(var i = 0; i < plants.length; i++)
    {
      p = plants[i];

      //expell oxygen
      for(var j = 0; (p.oxygen_rep > p.oxygen) && j < oxygens.length; j++)
      {
        o = oxygens[j];
        if(o.target == p)
        {
          o.target = earth;
          earth.oxygen_rep++;
          p.oxygen_rep--;
        }
      }

      //expell carbon
      for(var j = 0; (p.carbon_rep > p.carbon) && j < carbons.length; j++)
      {
        c = carbons[j];
        if(c.target == p)
        {
          c.target = earth;
          earth.carbon_rep++;
          p.carbon_rep--;
        }
      }
    }

    //earth expell
    //give oxygen
    for(var i = 0; (earth.oxygen_rep > earth.oxygen) && i < oxygens.length; i++)
    {
      o = oxygens[i];
      //give to goobers
      for(var j = 0; (o.target == earth) && j < goobers.length; j++)
      {
        g = goobers[j];
        if(g.oxygen_rep < g.oxygen)
        {
          o.target = g;
          earth.oxygen_rep--;
          g.oxygen_rep++;
        }
      }
      //give to plants
      for(var j = 0; (o.target == earth) && j < plants.length; j++)
      {
        p = plants[j];
        if(p.oxygen_rep < p.oxygen)
        {
          o.target = p;
          earth.oxygen_rep--;
          p.oxygen_rep++;
        }
      }
    }

    //give carbon
    for(var i = 0; (earth.carbon_rep > earth.carbon) && i < carbons.length; i++)
    {
      c = carbons[i];
      //give to goobers
      for(var j = 0; (c.target == earth) && j < goobers.length; j++)
      {
        g = goobers[j];
        if(g.carbon_rep < g.carbon)
        {
          c.target = g;
          earth.carbon_rep--;
          g.carbon_rep++;
        }
      }
      //give to plants
      for(var j = 0; (c.target == earth) && j < plants.length; j++)
      {
        p = plants[j];
        if(p.carbon_rep < p.carbon)
        {
          c.target = p;
          earth.carbon_rep--;
          p.carbon_rep++;
        }
      }
    }

  }

  var killGoober = function(o)
  {
    transfer(o,earth,0,0,o.oxygen,o.carbon);

    for(var i = 0; i < oxygens.length; i++)
    {
      if(oxygens[i].target == o)
      {
        oxygens[i].target = earth;
        earth.oxygen_rep++;
        o.oxygen_rep--;
      }
    }
    for(var i = 0; i < carbons.length; i++)
    {
      if(carbons[i].target == o)
      {
        carbons[i].target = earth;
        earth.carbon_rep++;
        o.carbon_rep--;
      }
    }

    clicker.unregister(o);
    for(var i = 0; i < goobers.length; i++)
    {
      if(goobers[i] == o)
        goobers.splice(i,1);
    }
  }

  var killPlant = function(o)
  {
    transfer(o,earth,0,0,o.oxygen,o.carbon);

    for(var i = 0; i < oxygens.length; i++)
    {
      if(oxygens[i].target == o)
      {
        oxygens[i].target = earth;
        earth.oxygen_rep++;
        o.oxygen_rep--;
      }
    }
    for(var i = 0; i < carbons.length; i++)
    {
      if(carbons[i].target == o)
      {
        carbons[i].target = earth;
        earth.carbon_rep++;
        o.carbon_rep--;
      }
    }

    clicker.unregister(o);
    for(var i = 0; i < plants.length; i++)
    {
      if(plants[i] == o)
        plants.splice(i,1);
    }
  }

  var drawCarbonMeter = function(o,x,y)
  {
    if(x == undefined) x = o.x;
    if(y == undefined) y = o.y;
    dc.context.fillStyle = "#0000FF";
    dc.context.fillRect(x,y,2,(o.oxygen/100)*20);
    dc.context.fillStyle = "#FFFF00";
    dc.context.fillRect(x+2,y,2,(o.carbon/100)*20);
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

