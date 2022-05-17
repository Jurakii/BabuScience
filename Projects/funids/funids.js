var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var playerY = 0;
var playerX = 300;
var velocity = 0;
var objectX = canvas.width;
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);
document.addEventListener("touchstart", handleStart, false);
document.addEventListener("touchend", handleEnd, false);

function keyDown(e) {
    if (e.keyCode == 32) {
        space = true;
    }
}

function keyUp(e) {
    if (e.keyCode == 32) {
        space = false;
    }
}

function handleStart() {
    space = true;
}

function handleEnd() {
    space = false;
}

function player() {

    ctx.beginPath();
    ctx.rect(playerX, playerY, 50, 50);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player();
    ctx.beginPath();
    ctx.rect(objectX, 700, 50, 50);
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();
    objectX -= 5;
    playerY += velocity;
    velocity += 0.25;
    if (playerY >= 700) {
        playerY = 700;
    }
    if (space) {
        velocity = -6;
    }
    if (objectX <= -50) {
        objectX = canvas.width;
    }
}


setInterval(draw, 10);