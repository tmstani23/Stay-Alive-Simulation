

function Predator(x, y, dna) {
  var mutationRate = mutationRSlider.value() / 100;
  var healthLoss = healthLostSlider.value() / 1000;
  var preyPos = ""; 
  this.acceleration = createVector(0,0);
  this.velocity = createVector(0,-2);
  this.position = createVector(x,y);
  //vehicle radius, governs size:
  this.r = 4;
  this.maxspeed = 0;
  this.maxforce = 0.1;
  this.health = 1;
  
  //amnt gain/lost to health from food/poison:
  this.foodValue = foodValueSlider.value() / 100;
  this.poisonValue = -(poisonValueSlider.value() / 100);
  //rate at which vehicle clones itself:
  this.cloneRate = vCloneRSlider.value() / 1000;
  this.dna = [];
  //pred is an argument of the Vehicle class

  if (dna == undefined) {
    //Food weight:
    this.dna[0] = random(-3, 3);
    //Poison weight:
    this.dna[1] = random(-1, 1);
    //Food perception radius
    this.dna[2] = random(10, 100);
    //Poison perception radius
    this.dna[3] = random(10, 100);
    //Innate speed range:
    this.dna[4] = random(1, 15);
  } else {
    //Mutation:
    this.dna[0] = dna[0];
    if (random(1) < mutationRate) {
      //adjust dna food weight by tiny random amount
      this.dna[0] += random(-.02, 0.2); 
    }
    this.dna[1] = dna[1];
    if (random(1) < mutationRate) {
      //adjust dna poison weight by tiny random amount
      this.dna[1] += random(-.02, 0.2); 
    }
    this.dna[2] = dna[2];
    if (random(1) < mutationRate) {
      //adjust dna food perception by tiny random amount
      this.dna[2] += random(-10, 10); 
    }
    this.dna[3] = dna[3];
    if (random(1) < mutationRate) {
      //adjust dna poison perception by tiny random amount
      this.dna[3] += random(-10, 10); 
    }
    this.dna[4] = dna[4];
    if (random(1) < mutationRate) {
      //adjust dna speed range by tiny random amount
      this.dna[4] += random(-2, 3);  
    } 
  }

  this.update = function() {
    
    //vehicles lose a little health each frame:
    this.health -= healthLoss;
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed by dna speed weight:
    this.maxspeed = this.dna[4];
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);

    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  };

  this.behaviors = function(good, bad, prey) {
    
      //   // steer toward food based on food perception in dna and eat
    //Add a for statement here that cycles through vehicles array and returns i    
    var steerP = this.eat(prey, this.foodValue, this.dna[2]);
    if (prey.length <= 5) {
      var steerP = this.eat(good, this.foodValue, this.dna[2]);
      print("no more prey!")
    }
    //var steerG = this.eat(good, this.foodValue, this.dna[2])
    //steer toward poison based on poison perception in dna and eat
    var steerB = this.eat(bad, this.poisonValue, this.dna[3]);
    //multiply the steering force by food weight value:
    
    steerP.mult(this.dna[0]);
    //steerG.mult(this.dna[0]);
    //multiply steering force by poison weight value:
    steerB.mult(this.dna[1]);
    //call applyforce function using result of steering values:
    this.applyForce(steerP);
    //this.applyForce(steerG);
    this.applyForce(steerB);
    
    
  }

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };

  this.clone = function() {
    //if the vehicle is healthy increase its chance to clone itself:
    if (this.health > 0.75 && this.health < 0.9) {
      this.cloneRate * 2;
    }
    if (random(1) < this.cloneRate) {
      //create new vehicle with current vehicle's dna
      return new Predator(this.position.x, this.position.y, this.dna);
    } else {
        return null;
    }
  };

  this.eat = function(list, nutrition, perception){
    var record = Infinity;
    var closest = null;
    //iterate through the the list backwards:
    for (var i = list.length -1; i >= 0;  i--) {
      //store distance between current vehicle
      // position and current list element i:
      if (list == vehicles) {
        
      try {
          preyPos = list[i].position;
        }
        catch(err) {
        //print(err.message)
        }
      }
      else {
        preyPos = list[i];
      }
      var d = this.position.dist(preyPos);
      
      //eating occurs here:
      if (d < 4) {
      //splice removes the chosen index from the array
      //the 1 is how many elements to remove
        
        list.splice(i, 1);
        //add nutrition amount to health (food or poison value):
        this.health += nutrition;
      } 
      else {
        //if distance from veh to object < infinity and veh food/poison perception:
        if (d < record && d < perception) {
          //set record to distance
          record = d;
          //closest = current list element (food or poison):
          if (list == vehicles) {
            closest = preyPos;
          } 
          else {
            closest = list[i];
          }
        } 
      }
    }
    
    //execute arrive function with closest as its target:
    if (closest != null) {
      return this.seek(closest);
    }
  
  return createVector(0, 0);
  };

  this.seek = function(target) {
    
    var desired =  p5.Vector.sub(target,this.position);
    
    //Set maximum speed:
    desired.setMag(this.maxspeed);
    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    return steer;
  };

  this.dead = function() {
    return (this.health < 0);
  };

  this.display = function() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + PI/2;
    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    
    //draw debug visualizations for poison/food radius and weights/headings of vehicles
    if (debug.checked()) {
      strokeWeight(4);
      stroke(70,122,82);
      noFill();
      line(0, 0, 0, -this.dna[0] * 25);
      strokeWeight(2);
      ellipse(0,0, this.dna[2] * 2);
      stroke(107,28,28);
      line(0, 0, 0, -this.dna[1] * 25);
      ellipse(0,0, this.dna[3] * 2);
      stroke(100, 100, 100);
      ellipse(0, 0, this.dna[4] * 10);
    }
    
    var black = color(0, 0, 0);
    var white = color(255, 255, 255);
    var green = color(70,122,82);
    var red = color(107,28,28);
    //assign color between red and green and apply it to health:
    var col = lerpColor(white, black, this.health);
    

    fill(col);
    stroke(col);
    strokeWeight(1);
    stroke(255);
    beginShape();
    vertex(0, -this.r*4);
    vertex(-this.r, this.r*4);
    vertex(this.r, this.r*4);
    endShape(CLOSE);
    pop();

  };

  this.boundaries = function() {
    var d = 5;
    var desired = null;

    if (this.position.x < d) {
      desired = createVector(this.maxspeed, this.velocity.y);
    }
    else if (this.position.x > width -d) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }

    if (this.position.y < d) {
      desired = createVector(this.velocity.x, this.maxspeed);
    }
    else if (this.position.y > height-d) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  };

}