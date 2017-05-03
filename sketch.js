
var v;
var food = [];
var poison = [];

function setup() {
  createCanvas(640,360);
  //create a new vehicle in the center of the canvas:
  v = new Vehicle(width/2, height/2);
  
  //add x/y locations to food array:
  for (var i = 0; i < 10; i++) {
    var x = random(width);
    var y = random(height);
    food.push(createVector(x, y));
  }
  
  //add xy locations to poison array:
  for (var i = 0; i < 10; i++) {
    var x = random(width);
    var y = random(height);
    poison.push(createVector(x, y));
  }

}

function draw() {
  background(51);
  
  //draw the food:
  for (var i = 0; i < food.length; i++){
    fill(0, 255, 0);
    noStroke();
    ellipse(food[i].x, food[i].y, 8, 8);
  }

  //draw the poison:
  for (var i = 0; i < poison.length; i++){
    fill(255, 0, 0);
    noStroke();
    ellipse(poison[i].x, poison[i].y, 8, 8);
  }

  // Call the appropriate steering behaviors for our agents
  
  v.eat(food);
  v.eat(poison);
  //v.arrive(mouse);
  v.update();
  v.display();

}
