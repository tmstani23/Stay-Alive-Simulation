
// The "Vehicle" class

function Vehicle(x,y) {
  this.acceleration = createVector(0,0);
  this.velocity = createVector(0,-2);
  this.position = createVector(x,y);
  this.r = 6;
  this.maxspeed = 4;
  this.maxforce = 0.1;

  // Method to update location
  this.update = function() {
    // Update velocity
    this.velocity.add(this.acceleration);
    // Limit speed
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    // Reset accelerationelertion to 0 each cycle
    this.acceleration.mult(0);
  };

  this.applyForce = function(force) {
    // We could add mass here if we want A = F / M
    this.acceleration.add(force);
  };

  //eat function
  this.eat = function(list){
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
  
  if (record < 5) {
    //splice removes the chosen index from the array
    //the 1 is how many elements to remove
    list.splice(closest, 1);
  };
  //execute arrive function with closest as its target:
  this.arrive(list[closest]);

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
    };

    // Steering = Desired minus Velocity
    var steer = p5.Vector.sub(desired,this.velocity);
    steer.limit(this.maxforce);  // Limit to maximum steering force
    this.applyForce(steer);
  };

  this.display = function() {
    // Draw a triangle rotated in the direction of velocity
    var theta = this.velocity.heading() + PI/2;
    fill(127);
    stroke(200);
    strokeWeight(1);
    push();
    translate(this.position.x,this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r*2);
    vertex(-this.r, this.r*2);
    vertex(this.r, this.r*2);
    endShape(CLOSE);
    pop();
  };
}
