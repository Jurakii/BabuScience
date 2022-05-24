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
var roof = 0;
var space = false;
var gravity = 1;
var drawing = null;
var column = 8;
var frameHeight = 0;
var frameWidth = 0;
var frame = 0;
var ticks = 0;
var flipped = false;
var offset = 0;
document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);
document.addEventListener("touchstart", handleStart, false);
document.addEventListener("touchend", handleEnd, false);

function keyDown(e) {
    if (e.keyCode == 32) {
        space = true;
    }
    if (e.keyCode == 87) {
        if (gravity == 1 && grounded) {
            gravity = -1;
            grounded = false;
        } else if (gravity == -1 && grounded) {
            gravity = 1;
            grounded = false;
        }
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
    ctx.rect(playerX, playerY - 150, 100, 160);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function object(j) {
    ctx.beginPath();

    if (j == 1) {
        objectX1 -= 5;
        ctx.rect(objectX1, floor, 50, 50);
        if (objectX1 < -50) {
            objectX1 = canvas.width;
        }
    } else {
        objectX2 -= 5;
        ctx.rect(objectX2, floor, 50, 50);
        if (objectX2 < -50) {
            objectX2 = canvas.width;
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
function animation(){
    drawing = new Image();
    if(flipped){
        drawing.src = "../Projects/funids/Running/RunningFlipped.png";
offset = 155;
    } else {
    drawing.src = "../Projects/funids/Running/Running.png";
        offset = 175;
    }
    frameWidth = drawing.width / column;
    frameHeight = drawing.height;


ctx.drawImage(drawing, frame, 0, frameWidth, frameHeight, playerX, playerY-offset, frameWidth/10,frameHeight/10 );
}
function draw() {
    ctx.canvas.width = window.innerWidth * .75;
    ctx.canvas.height = window.innerHeight * .75;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    floor = canvas.height - 50;
    //player();
    //object(1);
    playerY -= velocity * gravity;
    velocity -= 0.25;
    collision();

    animation();
    if(ticks == 20 || ticks == 40 || ticks == 60 || ticks == 80 || ticks == 100 || ticks == 120 || ticks == 140 || ticks == 160){
    frame += frameWidth;
    if(frame == drawing.width){
        frame = 0;
    }}
    ticks += 2;
    if(ticks >= 81){
        ticks = 0;
    }
    if (playerY >= floor + 40 && gravity == 1) {
        playerY = floor + 40;
        grounded = true;
        velocity = 0;
        flipped = false;
    } else if (gravity == -1 && playerY <= roof + 150) {
        playerY = roof + 150;
        grounded = true;
        velocity = 0;
        flipped = true;
    }
    if (space && grounded) {
        velocity += 10;
        grounded = false;

    }
}
setInterval(draw, 5);