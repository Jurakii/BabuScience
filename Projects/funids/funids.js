var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var playerY = 0;
var playerX = 300;
var velocity = 0;
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);
//document.addEventListener("touchstart", handleStart, false);
//document.addEventListener("touchend", handleEnd, false);

function keyDown(e) {
    if(e.keyCode == 32){
        space = true;
    }
}

function keyUp(e) {
    if(e.keyCode == 32){
        space = false;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(playerX, playerY, 50, 50);
    ctx.stroke();
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
    playerY += velocity;
    velocity += 0.25;
    if (playerY >= 700) {
        playerY = 700;
    }
    if (left) {
        playerX -= 5;
    } else if (right){
        playerX += 5;
    }
    if(space){
        velocity = -10;
    }
}


setInterval(draw, 10);