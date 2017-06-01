

var looping = false;
var vehicles = [];
var food = [];
var poison = [];
//amounts at beginning of simulation:
var startingVeh;
var startingFood;
var startingPoison;
var foodMax = 150;
var poisonMax = 150;

//food/poison spawn rates:
var foodSpawnR;
var foodValueSlider;
var poisonSpawnR;
var healthLostSlider;
var vCloneRSlider;
var mutationRSlider;
var debug;


function setup() {
  frameRate(30);
  var canvas = createCanvas(640, 360);
  canvas.parent('canvas-holder');
  debug = createCheckbox();
  debug.parent('debug-holder');
  
  var resetButton = createButton("reset");
  resetButton.parent('reset-holder');
  
  startingVeh = createSlider(0, 100, 50);
  startingVeh.parent('sVeh-holder');
  
 
  startingPoison = createSlider(0, 100, 20);
  startingPoison.parent('sPoison-holder');
 
  startingFood = createSlider(0, 100, 40);
  startingFood.parent('sFood-holder');
 
  foodValueSlider = createSlider(0, 100, 25);
  foodValueSlider.parent('foodV-holder');
  
  poisonValueSlider = createSlider(0, 100, 75);
  poisonValueSlider.parent('poisonV-holder');

  healthLostSlider = createSlider(0, 10, 5);
  healthLostSlider.parent('hLost-holder');
  
  foodSpawnR = createSlider(0, 20, 10);
  foodSpawnR.parent('fSpawnR-holder');
 
  poisonSpawnR = createSlider(0, 20, 2.5);
  poisonSpawnR.parent('pSpawnR-holder');

  vCloneRSlider = createSlider(0, 10, 2.5)
  vCloneRSlider.parent('vClone-holder');

  mutationRSlider = createSlider(0, 100, 10);
  mutationRSlider.parent('mutationR-holder');

  statistics = createP();
  statistics.parent('stats-holder');
  
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
  }
}


function draw() {
  
  background(76, 76, 76);
  
  //every once in a while add new food at random location
  if (random(1) < foodSpawnR.value() / 100) {
    var x = random(width);
    var y = random(height);
    if (food.length <= foodMax) {
      food.push(createVector(x, y));
    }
  }

  //every once in a while add new poison at random location
  if (random(1) < poisonSpawnR.value() / 100) {
    var x = random(width);
    var y = random(height);
    if (poison.length <= poisonMax) {
      poison.push(createVector(x, y));
    }
  }

  //draw the food:
  for (var i = 0; i < food.length; i++) {
    fill(108, 126, 99);
    noStroke();
    ellipse(food[i].x, food[i].y, 4, 4);
  }

  //draw the poison:
  for (var i = 0; i < poison.length; i++) {
    fill(107,28,28);
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
  displayStats();
  }
  
  function displayStats() {
    var stats_text ='<br>' + "Starting Vehicles: " + startingVeh.value() + "<br>";
  //here additional text information is added on to the stats_text variable
    //which has the effect of appending the information rather than overwriting
    stats_text += "Starting Food: " + startingFood.value() + "<br>";
    stats_text += "StartingPoison: " + startingPoison.value() + "<br>";
    stats_text += "Food Value: " + foodValueSlider.value() + "<br>";
    stats_text += "Poison Value: " + poisonValueSlider.value() + "<br>";
    stats_text += "Health Degradation Rate: " + healthLostSlider.value() / 100 + '%' + "<br>";
    stats_text += "Food Spawn Rate: " + foodSpawnR.value() / 100 + '%' + "<br>";
    stats_text += "Poison Spawn Rate: " + poisonSpawnR.value() / 100 + '%' + "<br>";
    stats_text += "Vehicle Clone Rate: " + vCloneRSlider.value() / 100 + "%" + "<br>";
    stats_text += "Vehicle Mutation Rate: " + mutationRSlider.value() + "%" + "<br>";
    

    statistics.html(stats_text);
  }
}
//pause function:
function keyPressed (){
  //if p key is pressed:
  if (keyCode == 80){
    looping = !looping
    //stop draw loop
    if (looping == true) {
      noLoop();
    }
    else {
      loop();
    }
  }
}


