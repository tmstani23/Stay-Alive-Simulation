
// The "Vehicle" class

function Vehicle(x,y) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(0,-2);
  this.position = createVector(x,y);
  //vehicle radius, governs size:
  this.r = 4;
  this.maxspeed = 4;
  this.maxforce = 0.1;
  this.health = 1;

  this.dna = [];
  this.dna[0] = random(-5, 5);
  this.dna[1] = random(-5, 5);

  // Method to update location
  this.update = function() {
    //vehicles lose a little health each frame:
    this.health -= 0.001;
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
    var steerG = this.eat(good, 0.1);
    //.2 is the amount subtracted from health when it eats poison
    var steerB = this.eat(bad, -0.2);
    
    steerG.mult(this.dna[0]);
    steerB.mult(this.dna[1]);

    this.applyForce(steerG);
    this.applyForce(steerB);
  }
  
  //eat function
  this.eat = function(list, nutrition){
    var record = Infinity;
    var closest = -1;
    //iterate through the the list input as an argument up to its length:
    for (var i = 0; i < list.length; i++) {
      //store distance between current vehicle
      // position and current list element i:
      var d = this.position.dist(list[i]);
      
      if (d < record) {
        //set record to distance
        record = d;
        //closest = current list element
        closest = i;
      }; 
    };
  //eating occurs here:
  if (record < 5) {
    //splice removes the chosen index from the array
    //the 1 is how many elements to remove
    list.splice(closest, 1);
    this.health += nutrition;
  }
  //execute arrive function with closest as its target:
  else if (closest > -1) {
    return this.arrive(list[closest]);
  }
  
  return createVector(0, 0);
  };

  // A method that calculates a steering force towards a target
  // STEER = DESIRED MINUS VELOCITY
  this.arrive = function(target) {
    var desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
    var d = desired.mag();
    // Scale with arbitrary damping within 100 pixels
    if (d < 100) {
      var m = map(d,0,100,0,this.maxspeed);
      desired.setMag(m);
    }
    else {
      desired.setMag(this.maxspeed);
    }

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
    
    stroke(0, 255, 0);
    line(0, 0, 0, -this.dna[0] * 20);
    stroke(255, 0, 0);
    line(0, 0, 0, -this.dna[1] * 20);
    
    var green = color(0, 255, 0);
    var red = color(255, 0 ,0);
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
  };
}
