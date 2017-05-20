
var vehicles = [];
var food = [];
var poison = [];
//amounts at beginning of simulation:
var startingVeh;
var startingFood;
var startingPoison;
//food/poison spawn rates:
var foodSpawnR;
var foodValueSlider;
var poisonSpawnR;
var healthLostSlider;
var debug;


function setup() {

  createCanvas(640, 360);
  createP('Debug on/off:');
  debug = createCheckbox();
  createP('Reset with current settings:');
  var resetButton = createButton("reset");

  createP("Number of Starting Vehicles:");
  startingVeh = createSlider(0, 100, 50);
  createP("Amount of poison at start:");
  startingPoison = createSlider(0, 40, 20);
  createP("Amount of food at start:");
  startingFood = createSlider(0, 80, 40);
  createP("Value food adds to health when eaten:");
  foodValueSlider = createSlider(0, 100, 25);
  createP("Value poison subtracts from health when eaten:");
  poisonValueSlider = createSlider(0, 100, 75);
  createP("For use while simulation is running:")
  createP('Vehicle health loss per frame:');
  healthLostSlider = createSlider(0, 10, 5);
  createP('Food Spawn Rate:');
  foodSpawnR = createSlider(0, 20, 10);
  createP('Poison Spawn Rate:');
  poisonSpawnR = createSlider(0, 5, 2.5);
  
 
  
  resetButton.mousePressed(clearVars);
  resetSketch();
}

function clearVars() {
  vehicles = [];
  food = [];
  poison = [];
  resetSketch();
}

function resetSketch() {
  for (var i = 0; i < startingVeh.value(); i++) {
    //create a new vehicles at random locations on the canvas:
    var x = random(width);
    var y = random(height);
    vehicles[i] = new Vehicle(x, y);
  }

  //add x/y locations to food array:
  for (var i = 0; i < startingFood.value(); i++) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

  //add xy locations to poison array:
  for (var i = 0; i < startingPoison.value(); i++) {
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }
}

function draw() {
  background(51);

  //every once in a while add new food at random location
  if (random(1) < foodSpawnR.value() / 100) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }

  //every once in a while add new poison at random location
  if (random(1) < poisonSpawnR.value() / 100) {
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }

  //draw the food:
  for (var i = 0; i < food.length; i++) {
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 4, 4);
  }

  //draw the poison:
  for (var i = 0; i < poison.length; i++) {
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 4, 4);
  }

  // Call the appropriate steering behaviors for our agents
  //iterate through vehicles array backwards and call functions on each vehicle
  //backwards to avoid issues with deleted elements within the array
  for (var i = vehicles.length - 1; i >= 0; i--) {
    vehicles[i].boundaries();
    vehicles[i].behaviors(food, poison);
    vehicles[i].update();
    vehicles[i].display();

    //add new clone to vehicles array
    var newVehicle = vehicles[i].clone();
    if (newVehicle != null) {
      vehicles.push(newVehicle);
    }
    //delete vehicle from array if dead
    if (vehicles[i].dead()) {
      //add one food element where vehicle died
      var x = vehicles[i].position.x;
      var y = vehicles[i].position.y;
      food.push(createVector(x, y));
      //remove 1 current iteration from the vehicles array:
      vehicles.splice(i, 1);
    }
  }
}




