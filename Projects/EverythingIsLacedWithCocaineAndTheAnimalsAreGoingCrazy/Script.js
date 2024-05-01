// Define variables
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var square = {
    x: canvas.width / 2 - 15,
    y: canvas.height / 2 - 15,
    width: 30,
    height: 30,
    speed: 5
};
var keys = {};

// Function to set canvas size
function setCanvasSize() {
    var size = Math.min(window.innerWidth, window.innerHeight);
    canvas.width = size;
    canvas.height = size;
}

// Event listeners for keydown and keyup events
document.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.addEventListener("keyup", function (e) {
    delete keys[e.keyCode];
});

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update function
function update() {
    // Move the square based on arrow key input
    if (keys[38]) { // Up arrow key
        square.y -= square.speed;
    }
    if (keys[40]) { // Down arrow key
        square.y += square.speed;
    }
    if (keys[37]) { // Left arrow key
        square.x -= square.speed;
    }
    if (keys[39]) { // Right arrow key
        square.x += square.speed;
    }

    // Prevent the square from going out of bounds
    if (square.x < 0) {
        square.x = 0;
    }
    if (square.y < 0) {
        square.y = 0;
    }
    if (square.x + square.width > canvas.width) {
        square.x = canvas.width - square.width;
    }
    if (square.y + square.height > canvas.height) {
        square.y = canvas.height - square.height;
    }
}

// Draw function
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw the square
    ctx.fillStyle = "white";
    ctx.fillRect(square.x, square.y, square.width, square.height);
}

// Set initial canvas size
setCanvasSize();

// Set canvas size whenever the window is resized
window.addEventListener("resize", setCanvasSize);

// Start the game loop
gameLoop();
