let myGameArea = {
    canvas: document.createElement("canvas"),
    frames: 0,
    start: function() {
        this.canvas.width = 400;
        this.canvas.height = 700;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 30);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    },
};

function everyInterval(n){
    if((myGameArea.frameNo / n) % 1 == 0)
    {return true;}
    return false;
}

class Component {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.speedY = 0;
    }
    
    update() {
        var ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    
    newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

let velocity = 10;
let obstaclesQty = 60; // The highest value, the lowest obstacles
let obstaclesSpd = 30;
let player = new Component(30, 30, "red", 185, 600);
let obstacles = [];


function updateGameArea() {
    myGameArea.clear();
    playerUpdate();
    playerMovement();
    updateObstacles();
}

function playerUpdate(){
    player.newPos();
    player.update();
}

function playerMovement(){
    player.speedX = 0;
    player.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {player.speedX = -velocity; }
    if (myGameArea.keys && myGameArea.keys[39]) {player.speedX = velocity; }
    if (myGameArea.keys && myGameArea.keys[38]) {player.speedY = -velocity; }
    if (myGameArea.keys && myGameArea.keys[40]) {player.speedY = velocity; }
}


function updateObstacles() {
    for (i = 0; i < obstacles.length; i++) {
        obstacles[i].y += Math.random()*obstaclesSpd;
        obstacles[i].update();
    }
    myGameArea.frames += 1;

    if (myGameArea.frames % (Math.floor(Math.random()*obstaclesQty)) === 0) {
        obstacles.push(new Component(30, 30, "yellow", Math.random()*385, 0));
    }
}


myGameArea.start();


















