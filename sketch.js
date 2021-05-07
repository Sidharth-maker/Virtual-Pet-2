var dog,sadDog,happyDog,database,foodS,foodStock;
var feed,addFood;
var fedTime,lastFed;
var food;

function preload()
{
	sadDog = loadImage("images/dogImg.png");
  happyDog = loadImage("images/happydogImg.png");
}

function setup() {
	createCanvas(800, 700);
  database = firebase.database();

  food = new Food();

  foodStock = database.ref("Food");
  foodStock.on("value",readStock);
  foodStock.set(20);

  dog = createSprite(400,400,10,60);
  dog.addImage(sadDog);
  dog.scale = 0.2;

  feed = createButton("Feed the dog")
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
  

  
}


function draw() { 
  background("green");

  food.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed  = data.val();
  })
  
  fill(255,255,254);
  textSize(15);
  if(lastFed >= 12){
    text("Last Feed: "+ lastFed %12 + "PM",350,30);
  }
  else if(lastFed === 0){
    text("Last Feed: 12AM",350,30);
  }
  else{
    text("Last Feed: "+ lastFed + "AM",350,30);
  }

  drawSprites();
}

function readStock(data){
  foodS = data.val();
  food.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);
  food.updateFoodStock(food.getFoodStock()-1);
  database.ref("/").update({
    Food:food.getFoodStock(),
    FeedTime : hours()
  });
}

function addFoods(){
  foodS++;
  database.ref("/").update({
    Food: foodS
  })
}