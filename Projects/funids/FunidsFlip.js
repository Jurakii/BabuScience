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
            flipped = true;
            frame = 0;
        } else if (gravity == -1 && grounded) {
            gravity = 1;
            grounded = false;
            flipped = false;
            frame = 0;
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
    ctx.rect(playerX, playerY - 160, 100, 160);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function object(j) {
    ctx.beginPath();

    if (j == 1) {
        objectX1 -= 5;
        ctx.rect(objectX1, floor -50, 100, 100);
        if (objectX1 < -100) {
            objectX1 = canvas.width;
        }
    } else if(j == 2) {
        objectX2 -= 5;
        ctx.rect(objectX2, 0, 100, 100);
        if (objectX2 < -100) {
            objectX2 = canvas.width;
        }
    }
    ctx.fillStyle = "#0000FF";
    ctx.fill();
    ctx.closePath();
}

function collision() {

}
function animation(){
    drawing = new Image();
    if(flipped){
        drawing.src = "../Projects/funids/Running/RunningFlipped.png";
offset = 152;
    } else {
    drawing.src = "../Projects/funids/Running/Running.png";
        offset = 224;
    }
    frameWidth = drawing.width / column;
    frameHeight = drawing.height;


ctx.drawImage(drawing, frame, 0, frameWidth, frameHeight, playerX-10, playerY-offset, frameWidth,frameHeight );
}
function draw() {
    ctx.canvas.width = window.innerWidth * .75;
    ctx.canvas.height = window.innerHeight * .75;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    floor = canvas.height - 50;
    player();
    object(1);
    object(2);
    playerY -= velocity * gravity;
    velocity -= 0.15;
    collision();

    animation();
    if(ticks%20 == 0){
    frame += frameWidth;
    if(frame == drawing.width){
        frame = 0;
    }}
    ticks += 2;
    if (playerY >= floor + 40 && gravity == 1) {
        playerY = floor + 40;
        grounded = true;
        velocity = 0;
        flipped = false;
    } else if (gravity == -1 && playerY <= roof + 150) {
        playerY = 150;
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