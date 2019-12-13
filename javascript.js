
// Create game canvas
let myGameArea = {
    canvas: document.createElement("canvas"),
    frames: 0,
    initial: function() {
        this.canvas.width = 400;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.context.textAlign = "center";
        this.context.font = "25px serif";
        this.context.fillStyle = "black";
        this.context.fillText("Use directional keys", 200, 220);
        this.context.fillStyle = "black";
        this.context.fillText("to control the player", 200 , 250);
        this.context.font = "18px serif";
        this.context.fillStyle = "black";
        this.context.fillText("Avoid the pink obstacles", 200 , 290);
        this.context.fillText("and get the green kids!", 200 , 310); 
        this.context.fillText("Press any key to start", 200 , 560);
        this.context.fillText(`The record is ${record}`, 200 , 600);
    },
    
    start: function() {
        this.interval = setInterval(updateGameArea, 30);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = false;
        })
        mySoundTrack.play();
       
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    },
    score: function() {
        this.context.textAlign = "start";
        this.context.font = "18px serif";
        this.context.fillStyle = "black";
        this.context.fillText("Score: " + score, 300, 50);
    },
    timeLeft: function() {
        this.context.font = "18px serif";
        this.context.fillStyle = "black";
        this.context.fillText("Time left: " + time, 40, 50);
    },
    timeOver: function() {
        this.context.textAlign = "center";
        this.context.font = "25px serif";
        this.context.fillStyle = "black";
        this.context.fillText("Your time is over!", 200 , 220);
        this.context.font = "20px serif";
        this.context.fillStyle = "black";
        this.context.fillText("Your final score is: " + score, 200 , 250);
        this.context.font = "15px serif";
        this.context.fillStyle = "black";
        this.context.fillText("Press any key to restart", 200 , 560);
        this.context.fillText(`The record is ${record}`, 200 , 600);
    },
    gameOver: function() {
        this.context.textAlign = "center";
        this.context.font = "25px serif";
        this.context.fillStyle = "black";
        this.context.fillText("You've killed yourself!", 200, 220);
        this.context.font = "20px serif";
        this.context.fillStyle = "black";
        this.context.fillText("Your final score is: " + score, 200 , 250);
        this.context.font = "15px serif";
        this.context.fillStyle = "black";
        this.context.fillText("Press any key to restart", 200 , 560);
        this.context.fillText(`The record is ${record}`, 200 , 600);
    },
};

// Create the Component's class
class Component {
    constructor(width, height, color, x, y, imgSrc) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
        this.img = new Image();
        this.img.src = imgSrc;
    }
    
    update() {
        let ctx = myGameArea.context;
        //ctx.fillStyle = this.color;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    
    newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    // Colision system
    left(){return this.x;}
    right(){return this.x + this.width;}
    top(){return this.y;}
    bottom(){return this.y + this.height;}

    crashWith(obstacle) {
        return !(
          this.bottom() < obstacle.top() ||
          this.top() > obstacle.bottom() ||
          this.right() < obstacle.left() ||
          this.left() > obstacle.right()
        );
    }
}

// Set variables
let gameStart = false;
let time = 60;
let score = 0;
let velocity = 10;
let obstaclesQty = 200; // The highest value, the lowest obstacles
let obstaclesSpd = 5;
let player = new Component(100, 100, "red", 185, 600, "player.png");
let obstacles = [];
let kids = new Component(20, 20, "blue", Math.random()*370, (Math.random()*600+80), "kids.png");
let kidsExist = true;
let record = 0;
let mySoundTrack = new Audio("soundtrack.mp3");
let gotkidsFX = new Audio("gotkids.mp3");


// Set functions
// Calling game area functions
function updateGameArea() {
    myGameArea.clear();
    myGameArea.score();
    myGameArea.timeLeft();
    playerUpdate();
    playerMovement();
    updateObstacles();
    kidsUpdate();
    checkGameOver();
}

// Let player to move
function playerMovement(){
    player.speedX = 0;
    player.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37] && player.x > 0) {player.speedX = -velocity; }
    if (myGameArea.keys && myGameArea.keys[39] && player.x < 370) {player.speedX = velocity; }
    if (myGameArea.keys && myGameArea.keys[38] && player.y > 0) {player.speedY = -velocity; }
    if (myGameArea.keys && myGameArea.keys[40] && player.y < 670) {player.speedY = velocity; }
}

// Check if the player touched an obstacle
function checkGameOver() {
    let crashed = obstacles.some(function(obstacle) {
      
        return player.crashWith(obstacle);
    });

    if (crashed) {
        if (score > record){
            record = score
        }
        gameStart = false;
        myGameArea.stop();
        myGameArea.clear();
        myGameArea.gameOver();
    }
}

// Set a timer for the game
setInterval(function() {timer()}, 1000);
function timer(){
    if(time > 0){
        time -= 1;
    }else {
        if (score > record){
            record = score
        }
        gameStart = false;
        myGameArea.clear();
        myGameArea.stop();
        myGameArea.timeOver();  
    }
}

// Player update: Updates player's position and conditions
function playerUpdate(){
    player.newPos();
    player.update();
}

// Update game with new random obstacles
function updateObstacles() {
    for (i = 0; i < obstacles.length; i++) {
        obstacles[i].y += Math.random()*obstaclesSpd;
        obstacles[i].update();
    }
    myGameArea.frames += 1;
    
    if (myGameArea.frames % (Math.floor(Math.random()*obstaclesQty)) === 0) {
        obstacles.push(new Component(30, 30, "yellow", Math.random()*370, 0, "enemies.png"));
    }
}

//kids update
function kidsUpdate(){
    kids.newPos();
    kids.update();
    checkGotkids();
}
// // Check if the player touched the kids
function checkGotkids() {
    if(player.crashWith(kids)){
        score += 1;
        obstaclesSpd += 1;
        velocity *= 1.01;
        kids = new Component(20, 20, "blue", Math.random()*385, Math.random()*600+80, "kids.png");
        gotkidsFX.play();
    }
}

document.addEventListener("keydown", startGame);


function startGame(){
    
    if(!gameStart){
        gameStart = true;
        time = 60;
        player = new Component(30, 30, "red", 185, 600, "player.png");
        obstacles = [];
        score = 0;
        obstaclesQty = 200; // The highest value, the lowest obstacles
        obstaclesSpd = 5;
        velocity = 10;
        setTimeout(function() {
            myGameArea.start();
          }, 1000);
    }
}


myGameArea.initial();













