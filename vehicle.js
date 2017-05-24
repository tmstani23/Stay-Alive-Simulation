

//old hardcoded values:
//var healthLoss = .005;
//this.foodValue = 0.3;
//this.poisonValue = -0.75;
//this.cloneRate = 0.0025;
//var mutationRate = 0.1;



// The "Vehicle" class
function Vehicle(x,y, dna) {
  var mutationRate = mutationRSlider.value() / 100;
  var healthLoss = healthLostSlider.value() / 1000; 
  this.acceleration = createVector(0,0);
  this.velocity = createVector(0,-2);
  this.position = createVector(x,y);
  //vehicle radius, governs size:
  this.r = 4;
  this.maxspeed = 4;
  this.maxforce = 0.1;
  this.health = 1;
 
  //amnt gain/lost to health from food/poison:
  this.foodValue = foodValueSlider.value() / 100;
  this.poisonValue = -(poisonValueSlider.value() / 100);
  //rate at which vehicle clones itself:
  this.cloneRate = vCloneRSlider.value() / 1000;


  this.dna = [];
  
  if (dna == undefined) {
    //Food weight:
    this.dna[0] = random(-2, 2);
    //Poison weight:
    this.dna[1] = random(-2, 2);
    //Food perception radius
    this.dna[2] = random(10, 100);
    //Poison perception radius
    this.dna[3] = random(10, 100);
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
  }

  // Method to update location
  this.update = function() {
    //vehicles lose a little health each frame:
    this.health -= healthLoss;
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset acceleration to 0 each cycle
    this.acceleration.mult(0);
  };

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };

  this.behaviors = function(good, bad) {
    //.1 is the amount added to health when it eats food
    var steerG = this.eat(good, this.foodValue, this.dna[2]);
    //.4 is the amount subtracted from health when it eats poison
    var steerB = this.eat(bad, this.poisonValue, this.dna[3]);

    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }
  //clone function creates a new vehicle randomly
  this.clone = function() {
    //if the vehicle is healthy increase its chance to clone itself:
    if (this.health > 0.75 && this.health < 0.9) {
      this.cloneRate * 2;
    }
    if (random(1) < this.cloneRate) {
      //create new vehicle with current vehicle's dna
      return new Vehicle(this.position.x, this.position.y, this.dna);
    } else {
        return null;
    }
  }


  //eat function
  this.eat = function(list, nutrition, perception){
    var record = Infinity;
    var closest = null;
    //iterate through the the list backwards:
    for (var i = list.length -1; i >= 0;  i--) {
      //store distance between current vehicle
      // position and current list element i:
      var d = this.position.dist(list[i]);
      
      //eating occurs here:
      if (d < this.maxspeed) {
      //splice removes the chosen index from the array
      //the 1 is how many elements to remove
        list.splice(i, 1);
        //add nutrition amount to health (food or poison value):
        this.health += nutrition;
      } else {
        //if distance from veh to object < infinity and veh food/poison perception:
        if (d < record && d < perception) {
          //set record to distance
          record = d;
          //closest = current list element (food or poison):
          closest = list[i];
        } 
      }
    }
    
    //execute arrive function with closest as its target:
    if (closest != null) {
      return this.arrive(closest);
    }
  
  return createVector(0, 0);
  };

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.arrive = function(target) {
    var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
    //Set maximum speed:
    desired.setMag(this.maxspeed);
    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    return steer;
  }

  //function that returns True if the vehicle is dead
  this.dead = function() {
    return (this.health < 0);
  }

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
    }
    
    var green = color(70,122,82);
    var red = color(107,28,28);
    //assign color between red and green and apply it to health:
    var col = lerpColor(red, green, this.health);

    fill(col);
    stroke(col);
    strokeWeight(1);
    stroke(255);
    beginShape();
    vertex(0, -this.r*2);
    vertex(-this.r, this.r*2);
    vertex(this.r, this.r*2);
    endShape(CLOSE);
    
    pop();
  }

  this.boundaries = function() {
    var d = 25;
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
  }
}
