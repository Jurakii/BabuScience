var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var playerY = 0;
var playerX = 300;
var velocity = 0;
var grounded = false;
var hSpeed = 5;
var objectX1 = canvas.width;
var objectX2 = canvas.width + 800;
var floor = canvas.height;
var space = false;

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
function distance(e){
    //objectX1 and objectX2
    if(1){
        if(objectX2 - objectX1 > -800){
            objectX2 = objectX1 - 800;
        }
    } else {

    }
}
function object(j) {
    ctx.beginPath();

    if (j == 1) {
        objectX1 -= 5;
        ctx.rect(objectX1, floor, 50, 50);
        if(objectX1 < -50){
            objectX1 = canvas.width;
            distance(1);
        }
    } else {
        objectX2 -= 5;
        ctx.rect(objectX2, floor, 50, 50);
        if(objectX2 < -50){
            objectX2 = canvas.width;
            distance(2);
        }
    }
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();
}

function collision() {
    if (playerX + 50 >= objectX1 && playerX + 50 <= objectX1 + 50 && playerY + 50 >= floor) {
        playerY = 0;
    }
    if (playerX + 50 >= objectX2 && playerX + 50 <= objectX2 + 50 && playerY + 50 >= floor) {
        playerY = 0;
    }
}


function draw() {
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight - 100;
    floor = canvas.height - 50;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player();
    object(1);
    object(2);
    playerY += velocity;
    velocity += 0.25;
    collision();
    if (playerY >= floor) {
        playerY = floor;
        grounded = true;
        velocity = 0;
    }
    if (space && grounded) {
        velocity = -8;
        grounded = false;
    }
}
setInterval(draw, 10);