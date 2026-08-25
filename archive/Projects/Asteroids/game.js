// Game Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); // This is our drawing context

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// --- Game Constants ---
const SHIP_SIZE = 30; // Length of the ship's "nose" to "tail"
const TURN_SPEED = 360 / 2; // Degrees per second - ADJUSTED
let SHIP_THRUST = 100; // Pixels per second per second (acceleration) - CHANGED TO LET
const FRICTION = 0.99; // Friction coefficient (0 = no friction, 1 = immediate stop) - ADJUSTED
const MAX_VELOCITY = 300; // Max pixels per second

let BULLET_SPEED = 500; // Pixels per second - CHANGED TO LET
const BULLET_RADIUS = 3; // Bullet size
const BULLET_LIFETIME = 1.5; // Seconds before bullet disappears
const SHOOT_COOLDOWN = 0.2; // Seconds between shots

const ASTEROID_SPEED = 50; // Max starting pixels per second for largest asteroids
const ASTEROID_SIZE = 100; // Base size for largest asteroids (arbitrary unit)
const ASTEROID_VERTICES = 10; // Number of vertices on the polygon
const ASTEROID_JAGGEDNESS = 0.4; // How "jagged" the asteroid looks (0 = smooth, 1 = very jagged)
const NUM_ASTEROIDS = 5; // Initial number of large asteroids

const SCORE_LARGE = 20; // Points for destroying a large asteroid
const SCORE_MEDIUM = 50; // Points for destroying a medium asteroid
const SCORE_SMALL = 100; // Points for destroying a small asteroid
const PLAYER_LIVES = 3; // Initial number of player lives

const RESOURCE_RADIUS = 15; // Size of resource items - ADJUSTED
const RESOURCE_LIFETIME = 15; // Seconds before resource disappears - ADJUSTED
const RESOURCE_VELOCITY_SCALE = 0.5; // How much initial velocity resources get from asteroid
const RESOURCE_DROP_CHANCE = 0.3; // 30% chance for an asteroid to drop a resource

const UPGRADE_COST_ORE = 5; // Ore required for a thrust/bullet speed upgrade - ADJUSTED
const UPGRADE_COST_CRYSTAL = 2; // Crystal required for a thrust/bullet speed upgrade - ADJUSTED
const UPGRADE_THRUST_AMOUNT = 5; // How much thrust increases per upgrade
const UPGRADE_BULLET_SPEED_AMOUNT = 100; // How much bullet speed increases per upgrade

const UPGRADE_COST_LIFE_ORE = 20; // Ore required for a life
const UPGRADE_COST_LIFE_CRYSTAL = 10; // Crystal required for a life

const UPGRADE_COST_RAINBOW_ORE = 30; // Ore required for rainbow ship
const UPGRADE_COST_RAINBOW_CRYSTAL = 15; // Crystal required for rainbow ship

const INVULNERABILITY_TIME = 3; // Seconds of invulnerability after respawn
const RESPAWN_DELAY_TIME = 2; // Seconds delay before ship respawns (after being dead)

const ASTEROID_SPAWN_INTERVAL = 5; // Seconds between spawn attempts for infinite asteroids
const MAX_ASTEROIDS_ON_SCREEN = 10; // Maximum number of asteroids allowed at once

const ENEMY_SHIP_SIZE = 25; // Size of the enemy ship (e.g., radius for circle)
const ENEMY_SHIP_SPEED = 70; // Pixels per second
const ENEMY_SPAWN_INTERVAL = 15; // Seconds between enemy ship spawn attempts
const MAX_ENEMY_SHIPS = 2; // Maximum number of enemy ships allowed at once

const LOCAL_STORAGE_HIGH_SCORE_KEY = 'asteroidsHighScore'; // Key for LocalStorage


// --- Game State Variables ---
let lastTime = 0; // For calculating delta time
const FPS = 60; // Desired frames per second
const frameInterval = 1000 / FPS; // Milliseconds per frame

const playerShip = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: SHIP_SIZE / 2, // Approximate collision radius
    angle: 90 / 180 * Math.PI, // Initial angle in radians (90 degrees points up)
    rotationSpeed: 0, // Radians per second
    thrusting: false,
    thrustX: 0,
    thrustY: 0,
    velocityX: 0,
    velocityY: 0,
    isDead: false,
    lives: PLAYER_LIVES, // Initialized with constant
    isInvulnerable: false,   // Is the ship currently invulnerable?
    invulnerabilityTimer: 0, // Countdown for invulnerability
    respawnDelayTimer: 0,    // Countdown for respawn delay
    isRainbow: false,        // Is the ship currently rainbow?
    rainbowHue: 0            // Current hue for rainbow effect (0-359)
};

let bullets = []; // Array to hold active bullets
let canShoot = true; // Prevents spamming bullets
let shootCooldownTimer = 0; // Timer for cooldown

let asteroids = []; // Array to hold active asteroids
let resources = []; // Array to hold active resource items
let enemyShips = []; // Array to hold active enemy ships

let score = 0;
let lives = PLAYER_LIVES; // Initialized with constant
let inventory = { // Simple inventory for now
    'ore': 0,
    'crystal': 0
    // Add more types as needed
};

let showShop = false; // Flag to toggle shop visibility
let asteroidSpawnTimer = ASTEROID_SPAWN_INTERVAL; // Timer for asteroid spawning
let enemySpawnTimer = ENEMY_SPAWN_INTERVAL; // Timer for enemy spawning

let highScore = 0; // Variable to store the high score

let showAdminWindow = false; // Flag to toggle admin window visibility
let oKeyHeld = false;        // Flag to track if 'O' key is held down

// Cheat flags
let infiniteLives = false;   // Cheat for infinite lives
let infiniteResources = false; // Cheat for infinite resources

let isMobile = false; // Flag for mobile detection

// Joystick state
let joystick = {
    active: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    touchId: null, // To track a specific touch for the joystick
    baseRadius: 60, // Radius of the joystick base
    stickRadius: 30, // Radius of the movable stick
    maxDistance: 50 // Max distance stick can move from center
};

// Button positions and sizes (adjust as needed for screen size)
let shootButton = { x: canvas.width - 80, y: canvas.height - 80, radius: 60 };
let shopButton = { x: 80, y: canvas.height - 80, radius: 60 };

// For the mobile shop cheat sequence
let shopSequence = [];
const shopCheatCode = [4, 3, 2, 1, 4, 3, 2, 1]; // Rainbow, Life, Bullet, Thrust, Rainbow, Life, Bullet, Thrust


// --- Initialize High Score from LocalStorage ---
const savedHighScore = localStorage.getItem(LOCAL_STORAGE_HIGH_SCORE_KEY);
if (savedHighScore !== null) { // If a high score exists in LocalStorage
    highScore = parseInt(savedHighScore, 10); // Parse it as an integer
}

// --- Mobile Detection Function ---
function checkMobileDevice() {
    // A simple, generally effective way to detect mobile browsers
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android|ipad|iphone|ipod|blackberry|windows phone/i.test(userAgent)) {
        isMobile = true;
        console.log("Mobile device detected. Enabling touch controls.");
    } else {
        isMobile = false;
        console.log("Desktop device detected. Enabling keyboard controls.");
    }

    // Adjust button positions based on canvas size (important for dynamic resizing)
    shootButton.x = canvas.width - 80;
    shootButton.y = canvas.height - 80;
    shopButton.x = 80;
    shopButton.y = canvas.height - 80;
}


// --- Input Handling ---
document.addEventListener('keydown', (e) => {
    // Admin window toggle logic (highest priority)
    if (e.key === 'o') {
        oKeyHeld = true;
    } else if (e.key === 'p' && oKeyHeld) {
        showAdminWindow = !showAdminWindow;
        e.preventDefault(); // Prevent default browser action if 'p' does something
        return; // Don't process other inputs if we just toggled admin
    }

    // --- ONLY FOR DESKTOP (NON-MOBILE) INPUTS ---
    if (!isMobile) { // ADD THIS CHECK
        if (showAdminWindow) {
            switch (e.key) {
                case 'Escape': // Allow closing with Escape
                    showAdminWindow = false;
                    break;
                case '1': // Toggle Infinite Lives
                    infiniteLives = !infiniteLives;
                    console.log("Infinite Lives: " + (infiniteLives ? "ON" : "OFF"));
                    break;
                case '2': // Toggle Infinite Resources
                    infiniteResources = !infiniteResources;
                    console.log("Infinite Resources: " + (infiniteResources ? "ON" : "OFF"));
                    break;
            }
        } else if (showShop) { // If shop is open, prioritize shop inputs
            switch (e.key) {
                case 'e': // Close shop
                    showShop = false;
                    break;
                case '1':
                    buyUpgrade('thrust');
                    break;
                case '2':
                    buyUpgrade('bulletSpeed');
                    break;
                case '3': // Buy Life
                    buyUpgrade('life');
                    break;
                case '4': // Buy Rainbow Ship
                    buyUpgrade('rainbow');
                    break;
            }
        } else {
            // Normal game controls when neither shop nor admin is open
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                    playerShip.rotationSpeed = -TURN_SPEED / 180 * Math.PI;
                    break;
                case 'ArrowRight':
                case 'd':
                    playerShip.rotationSpeed = TURN_SPEED / 180 * Math.PI;
                    break;
                case 'ArrowUp':
                case 'w':
                    playerShip.thrusting = true;
                    break;
                case ' ': // Spacebar
                    if (canShoot && !playerShip.isDead) {
                        shootBullet();
                        canShoot = false;
                        shootCooldownTimer = SHOOT_COOLDOWN;
                    }
                    break;
                case 'e': // Open shop
                    showShop = true;
                    break;
            }
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'o') {
        oKeyHeld = false;
    }

    // --- ONLY FOR DESKTOP (NON-MOBILE) INPUTS ---
    if (!isMobile) { // ADD THIS CHECK
        if (!showShop && !showAdminWindow) {
            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'ArrowRight':
                case 'd':
                    playerShip.rotationSpeed = 0;
                    break;
                case 'ArrowUp':
                case 'w':
                    playerShip.thrusting = false;
                    break;
                case ' ': // Spacebar
                    if (shootCooldownTimer <= 0) {
                         canShoot = true;
                    }
                    break;
            }
        }
    }
});

// --- Touch Input Handling for Mobile ---
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', handleTouchEnd);
canvas.addEventListener('touchcancel', handleTouchEnd); // Handle touches leaving the canvas

function handleTouchStart(e) {
    if (!isMobile) return; // Only process if on mobile

    e.preventDefault(); // Prevent default browser touch behaviors (like scrolling/zooming)

    if (showAdminWindow) { // Admin window open, no touch controls for game
        // Admin window on mobile might rely on keys, or we add touch for it later
        return;
    }

    // If shop is open, handle shop taps
    if (showShop) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const touchX = touch.clientX;
            const touchY = touch.clientY;

            // Simple shop item tap detection (approximate areas for 1,2,3,4)
            // This is very basic, you might need to refine precise shop button coordinates
            const shopStartX = canvas.width / 4;
            const shopRowHeight = 60; // Approximate height for each item line in shop UI
            const shopItemYOffset = canvas.height / 4 + 75; // Y start for first item

            if (touchX > shopStartX + 20 && touchX < shopStartX + canvas.width / 2 - 20) {
                if (touchY > shopItemYOffset && touchY < shopItemYOffset + shopRowHeight) {
                    handleMobileShopTap(1); // Thrust
                } else if (touchY > shopItemYOffset + shopRowHeight && touchY < shopItemYOffset + shopRowHeight * 2) {
                    handleMobileShopTap(2); // Bullet Speed
                } else if (touchY > shopItemYOffset + shopRowHeight * 2 && touchY < shopItemYOffset + shopRowHeight * 3) {
                    handleMobileShopTap(3); // Life
                } else if (touchY > shopItemYOffset + shopRowHeight * 3 && touchY < shopItemYOffset + shopRowHeight * 4) {
                    handleMobileShopTap(4); // Rainbow
                }
            }
        }
        return; // Don't process other game controls if shop is open
    }

    // If not shop or admin, process game controls
    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        const touchX = touch.clientX;
        const touchY = touch.clientY;

        // Check if touch is on Shop button
        const distToShopBtn = Math.sqrt(Math.pow(touchX - shopButton.x, 2) + Math.pow(touchY - shopButton.y, 2));
        if (distToShopBtn < shopButton.radius) {
            showShop = !showShop; // Toggle shop
            return; // Don't process this touch for other controls
        }

        // Check if touch is on Shoot button
        const distToShootBtn = Math.sqrt(Math.pow(touchX - shootButton.x, 2) + Math.pow(touchY - shootButton.y, 2));
        if (distToShootBtn < shootButton.radius) {
            if (canShoot && !playerShip.isDead) {
                shootBullet();
                canShoot = false;
                shootCooldownTimer = SHOOT_COOLDOWN;
            }
            return; // Don't process this touch for other controls
        }

        // If it's not a button, assume it's for the joystick
        if (!joystick.active) {
            joystick.active = true;
            joystick.startX = touchX;
            joystick.startY = touchY;
            joystick.currentX = touchX;
            joystick.currentY = touchY;
            joystick.touchId = touch.identifier; // Store unique touch ID
            playerShip.thrusting = true; // Assume thrust immediately when joystick is active
        }
    }
}

function handleTouchMove(e) {
    if (!isMobile || showShop || showAdminWindow) return; // Only process if on mobile and game is active

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === joystick.touchId && joystick.active) {
            joystick.currentX = touch.clientX;
            joystick.currentY = touch.clientY;

            // Calculate joystick delta
            let deltaX = joystick.currentX - joystick.startX;
            let deltaY = joystick.currentY - joystick.startY;

            // Limit stick movement within maxDistance
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            if (distance > joystick.maxDistance) {
                const angle = Math.atan2(deltaY, deltaX);
                deltaX = joystick.maxDistance * Math.cos(angle);
                deltaY = joystick.maxDistance * Math.sin(angle);
                joystick.currentX = joystick.startX + deltaX;
                joystick.currentY = joystick.startY + deltaY;
            }

            // Map joystick position to ship rotation
            // Joystick "up" is 90 degrees, "right" is 0 degrees.
            // Ship angle: 90 degrees is up, increasing clockwise.
            // atan2 returns between -PI and PI, where 0 is right, PI/2 is up.
            // We need to convert this to our ship's angle system.
            if (distance > joystick.maxDistance * 0.2) { // Only rotate if stick moved enough
                let joystickAngle = Math.atan2(deltaY, deltaX); // Angle from joystick center

                // Adjust to ship's coordinate system (0 right, increases clockwise, starting up)
                joystickAngle += Math.PI / 2; // Shift so 0 is up
                if (joystickAngle < 0) joystickAngle += Math.PI * 2; // Ensure positive angle

                // Smoothly adjust ship's angle towards joystick angle
                let angleDiff = joystickAngle - playerShip.angle;

                // Normalize angleDiff to be between -PI and PI
                if (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                if (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

                // Adjust ship's angle based on the difference, limited by turn speed
                const maxTurn = TURN_SPEED * dt;
                if (Math.abs(angleDiff) > maxTurn) {
                    playerShip.angle += Math.sign(angleDiff) * maxTurn;
                } else {
                    playerShip.angle = joystickAngle; // Snap if close enough
                }

                // Ensure playerShip.angle stays within 0 to 2*PI
                if (playerShip.angle < 0) playerShip.angle += Math.PI * 2;
                if (playerShip.angle > Math.PI * 2) playerShip.angle -= Math.PI * 2;

                // Apply thrust if stick is pushed out enough
                playerShip.thrusting = true;
            } else {
                playerShip.thrusting = false; // No thrust if stick is near center
            }
            break; // Found the joystick touch, no need to check others
        }
    }
}

function handleTouchEnd(e) {
    if (!isMobile) return; // Only process if on mobile

    for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === joystick.touchId) {
            joystick.active = false;
            joystick.touchId = null;
            playerShip.thrusting = false;
            playerShip.rotationSpeed = 0; // Stop rotation when joystick released
            break;
        }

        // Handle shoot button cooldown if it was active and released
        const distToShootBtn = Math.sqrt(Math.pow(touch.clientX - shootButton.x, 2) + Math.pow(touch.clientY - shootButton.y, 2));
        if (distToShootBtn < shootButton.radius) {
            if (shootCooldownTimer <= 0) {
                canShoot = true;
            }
        }
    }
}


// --- Collision Detection Function (Generic) ---
function checkCollision(obj1, obj2) {
    // Simple circle-circle collision check
    const distance = Math.sqrt(Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2));
    return distance < obj1.radius + obj2.radius;
}

// --- Bullet Creation Function ---
function shootBullet() {
    // Calculate bullet's starting position (from ship's nose)
    const bulletX = playerShip.x + playerShip.radius * 1.5 * Math.cos(playerShip.angle);
    const bulletY = playerShip.y + playerShip.radius * 1.5 * Math.sin(playerShip.angle);

    // Calculate bullet's velocity based on ship's angle and bullet speed
    const bulletVelX = BULLET_SPEED * Math.cos(playerShip.angle); // Uses current BULLET_SPEED
    const bulletVelY = BULLET_SPEED * Math.sin(playerShip.angle); // Uses current BULLET_SPEED

    // Create a new bullet object
    const newBullet = {
        x: bulletX,
        y: bulletY,
        radius: BULLET_RADIUS,
        velocityX: bulletVelX,
        velocityY: bulletVelY,
        lifetime: BULLET_LIFETIME // How long the bullet will exist
    };

    bullets.push(newBullet); // Add the new bullet to our array
}

// --- Resource Creation Function ---
function createResource(x, y, initialVelX, initialVelY, type) {
    const resource = {
        x: x,
        y: y,
        velocityX: initialVelX + (Math.random() - 0.5) * 50, // Add a little random spread
        velocityY: initialVelY + (Math.random() - 0.5) * 50,
        radius: RESOURCE_RADIUS,
        type: type,
        lifetime: RESOURCE_LIFETIME
    };
    resources.push(resource);
}

// --- Upgrade Functions ---
function buyUpgrade(type) {
    let costOre = 0;
    let costCrystal = 0;
    let successMessage = '';
    let failureMessage = '';
    let specialConditionMet = true; // For lives cap, rainbow active, etc.

    switch (type) {
        case 'thrust':
            costOre = UPGRADE_COST_ORE;
            costCrystal = UPGRADE_COST_CRYSTAL;
            successMessage = 'Thrust upgraded!';
            break;
        case 'bulletSpeed':
            costOre = UPGRADE_COST_ORE;
            costCrystal = UPGRADE_COST_CRYSTAL;
            successMessage = 'Bullet Speed upgraded!';
            break;
        case 'life':
            costOre = UPGRADE_COST_LIFE_ORE;
            costCrystal = UPGRADE_COST_LIFE_CRYSTAL;
            if (lives >= PLAYER_LIVES + 5) { // Cap lives, e.g., to 3 initial + 5 extra = 8
                specialConditionMet = false;
                failureMessage = 'Lives are full or at maximum capacity!';
            } else {
                successMessage = 'Life purchased!';
            }
            break;
        case 'rainbow':
            costOre = UPGRADE_COST_RAINBOW_ORE;
            costCrystal = UPGRADE_COST_RAINBOW_CRYSTAL;
            if (playerShip.isRainbow) {
                specialConditionMet = false;
                failureMessage = 'Rainbow ship already active!';
            } else {
                successMessage = 'Rainbow ship activated!';
            }
            break;
        default:
            console.warn('Unknown upgrade type:', type);
            return false;
    }

    if (!specialConditionMet) {
        console.log(failureMessage);
        return false;
    }

    // Check if player can afford AFTER determining specific costs
    if (inventory.ore >= costOre && inventory.crystal >= costCrystal) {
        inventory.ore -= costOre;
        inventory.crystal -= costCrystal;

        // Apply the actual upgrade effect
        switch (type) {
            case 'thrust':
                SHIP_THRUST += UPGRADE_THRUST_AMOUNT;
                break;
            case 'bulletSpeed':
                BULLET_SPEED += UPGRADE_BULLET_SPEED_AMOUNT;
                break;
            case 'life':
                lives++;
                break;
            case 'rainbow':
                playerShip.isRainbow = true;
                break;
        }
        console.log(successMessage);
        return true;
    } else {
        console.log(`Not enough resources for ${type} upgrade! Need ${costOre} Ore and ${costCrystal} Crystal.`);
        return false;
    }
}

// --- Mobile Shop Cheat Handler ---
function handleMobileShopTap(itemNumber) {
    if (!isMobile) return; // Only process for mobile taps

    // Add the tapped item to the sequence
    shopSequence.push(itemNumber);

    // Keep sequence length reasonable (e.g., max length of cheat code)
    if (shopSequence.length > shopCheatCode.length) {
        shopSequence.shift(); // Remove the oldest item
    }

    // Check if the sequence matches the cheat code
    if (shopSequence.length === shopCheatCode.length) {
        let match = true;
        for (let i = 0; i < shopCheatCode.length; i++) {
            if (shopSequence[i] !== shopCheatCode[i]) {
                match = false;
                break;
            }
        }
        if (match) {
            showAdminWindow = true;
            shopSequence = []; // Reset sequence after successful activation
            showShop = false; // Close shop when admin opens
            console.log("Admin window unlocked via mobile cheat!");
        }
    }

    // Now, call the actual upgrade logic
    let upgradeType;
    switch (itemNumber) {
        case 1: upgradeType = 'thrust'; break;
        case 2: upgradeType = 'bulletSpeed'; break;
        case 3: upgradeType = 'life'; break;
        case 4: upgradeType = 'rainbow'; break;
        default: return; // Invalid item number
    }
    buyUpgrade(upgradeType); // Attempt to buy the upgrade
}

// --- Enemy Ship Creation Function ---
function createEnemyShip(x, y, initialAngle) {
    const enemy = {
        x: x,
        y: y,
        radius: ENEMY_SHIP_SIZE / 2,
        angle: initialAngle, // Initial direction
        velocityX: ENEMY_SHIP_SPEED * Math.cos(initialAngle),
        velocityY: ENEMY_SHIP_SPEED * Math.sin(initialAngle),
        // Add health, type, etc. later
    };
    enemyShips.push(enemy);
    return enemy; // Return the created enemy, though not strictly needed here
}


// --- Asteroid Creation Function ---
function createAsteroid(x, y, radius, level) {
    const asteroid = {
        x: x,
        y: y,
        velocityX: Math.random() * ASTEROID_SPEED / level * (Math.random() < 0.5 ? 1 : -1), // Random speed and direction
        velocityY: Math.random() * ASTEROID_SPEED / level * (Math.random() < 0.5 ? 1 : -1),
        radius: radius,
        level: level, // 3: large, 2: medium, 1: small
        vertices: [], // Array to hold the points that make up its shape
        angle: Math.random() * Math.PI * 2, // Initial random rotation
        rotationSpeed: Math.random() * 0.5 - 0.25 // Random slow rotation speed
    };

    // Generate random vertices for the asteroid's jagged shape
    for (let i = 0; i < ASTEROID_VERTICES; i++) {
        const angle = (i / ASTEROID_VERTICES) * Math.PI * 2;
        // Randomize radius for each vertex to create jaggedness
        const r = asteroid.radius * (1 - ASTEROID_JAGGEDNESS) + asteroid.radius * ASTEROID_JAGGEDNESS * Math.random();
        asteroid.vertices.push({
            x: r * Math.cos(angle),
            y: r * Math.sin(angle)
        });
    }

    return asteroid;
}

// --- Asteroid Splitting/Destruction Function ---
function splitAsteroid(asteroid, asteroidIndex) {
    asteroids.splice(asteroidIndex, 1); // Remove the original asteroid

    let scoreToAdd = 0; // Points to add based on asteroid size
    switch (asteroid.level) {
        case 3:
            scoreToAdd = SCORE_LARGE;
            break;
        case 2:
            scoreToAdd = SCORE_MEDIUM;
            break;
        case 1:
            scoreToAdd = SCORE_SMALL;
            // --- RESOURCE DROP CHANCE ---
            if (Math.random() < RESOURCE_DROP_CHANCE) {
                // Determine resource type (simple for now, could be more complex)
                const resourceType = Math.random() < 0.5 ? 'ore' : 'crystal'; // 50/50 for ore or crystal
                createResource(asteroid.x, asteroid.y, asteroid.velocityX * RESOURCE_VELOCITY_SCALE, asteroid.velocityY * RESOURCE_VELOCITY_SCALE, resourceType);
            }
            break;
    }
    score += scoreToAdd; // Add to the player's score

    if (asteroid.level > 1) { // If it's not the smallest level
        // Create two smaller asteroids
        const newRadius = asteroid.radius / 2;
        asteroids.push(createAsteroid(asteroid.x, asteroid.y, newRadius, asteroid.level - 1));
        asteroids.push(createAsteroid(asteroid.x, asteroid.y, newRadius, asteroid.level - 1));
    }
}


// --- Initial Asteroid Spawning Function ---
function spawnInitialAsteroids() {
    asteroids = []; // Clear existing asteroids if restarting game
    for (let i = 0; i < NUM_ASTEROIDS; i++) {
        let x, y, safeDistance = canvas.width / 4; // Ensure asteroids don't spawn too close to player
        do {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
        } while (
            Math.sqrt(Math.pow(x - playerShip.x, 2) + Math.pow(y - playerShip.y, 2)) < safeDistance
        ); // Check distance from player

        asteroids.push(createAsteroid(x, y, ASTEROID_SIZE / 2, 3)); // Level 3 is large
    }
}


// --- Game Loop ---
function gameLoop(currentTime) {
    // Calculate delta time (time elapsed since last frame)
    // This makes animations smoother and frame-rate independent
    const deltaTime = currentTime - lastTime;

    if (deltaTime > frameInterval) {
        lastTime = currentTime - (deltaTime % frameInterval); // Adjust lastTime to stay on schedule

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update game logic
        update(deltaTime / 1000); // Pass delta time in seconds

        // Draw everything on the canvas
        draw();
    }

    // Request the next animation frame
    requestAnimationFrame(gameLoop);
}

// --- Update Function ---
// All game logic updates (movement, collisions, etc.) will happen here
function update(dt) { // dt is delta time in seconds

    // If shop or admin window is open, stop game logic updates (except for closing via key)
    if (showShop || showAdminWindow) {
        return; // Don't update anything else if shop/admin is open
    }

    // --- Apply Cheats ---
    if (infiniteResources) {
        inventory.ore = 9999;
        inventory.crystal = 9999;
    }


    // --- Invulnerability Countdown (if active) ---
    if (playerShip.isInvulnerable) {
        playerShip.invulnerabilityTimer -= dt;
        if (playerShip.invulnerabilityTimer <= 0) {
            playerShip.isInvulnerable = false; // Invulnerability ends
            console.log("Invulnerability ended.");
        }
    }


    // --- Check for Player-Asteroid Collision ---
    if (!playerShip.isDead && !playerShip.isInvulnerable) {
        for (let i = 0; i < asteroids.length; i++) {
            if (checkCollision(playerShip, asteroids[i])) {
                if (!infiniteLives) { // If infinite lives is OFF, proceed with normal death
                    playerShip.isDead = true;
                    lives--;
                    playerShip.respawnDelayTimer = RESPAWN_DELAY_TIME;
                    bullets = [];
                    resources = resources.filter(res => {
                        const distance = Math.sqrt(Math.pow(res.x - playerShip.x, 2) + Math.pow(res.y - res.y, 2));
                        return distance > playerShip.radius * 2;
                    });
                    // Break the asteroid too
                    splitAsteroid(asteroids[i], i); // Asteroid is still destroyed
                } else { // If infinite lives is ON, destroy asteroid but player doesn't die
                    splitAsteroid(asteroids[i], i);
                    // Give a momentary invulnerability to prevent chain hits without death
                    playerShip.isInvulnerable = true;
                    playerShip.invulnerabilityTimer = INVULNERABILITY_TIME / 3; // Shorter invulnerability
                    console.log("Asteroid hit, but infinite lives active!");
                }
                break; // Only one asteroid hit per frame
            }
        }
    }

    // --- Handle Player Death/Respawn ---
    if (playerShip.isDead) { // This block only runs if playerShip.isDead is true (meaning infiniteLives was OFF)
        // Decrease respawn delay timer
        playerShip.respawnDelayTimer -= dt;

        if (playerShip.respawnDelayTimer <= 0) {
            // Delay is over, attempt respawn
            // Reset ship position and velocity
            playerShip.x = canvas.width / 2;
            playerShip.y = canvas.height / 2;
            playerShip.velocityX = 0;
            playerShip.velocityY = 0;
            playerShip.rotationSpeed = 0;

            if (lives > 0) {
                // Respawn the player and grant invulnerability
                playerShip.isDead = false;
                playerShip.isInvulnerable = true;
                playerShip.invulnerabilityTimer = INVULNERABILITY_TIME;
                console.log("Player respawned with invulnerability.");
            } else {
                // Game Over
                console.log("Game Over!");

                // Save High Score
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem(LOCAL_STORAGE_HIGH_SCORE_KEY, highScore.toString());
                    console.log("New High Score: " + highScore);
                }

                // Stop game loop or show game over screen (for now, return)
                return;
            }
        }
        return; // Don't update player movement etc. if they are dead and waiting to respawn
    }

    // --- Update Rainbow Hue (if active) ---
    if (playerShip.isRainbow) {
        playerShip.rainbowHue = (playerShip.rainbowHue + (dt * 100)) % 360; // Cycle hue, faster with dt
    }

    // 1. Rotate the ship (only if not using mobile joystick for rotation)
    // The mobile joystick sets playerShip.angle directly, so skip rotationSpeed for that.
    if (!isMobile || !joystick.active) {
        playerShip.angle += playerShip.rotationSpeed * dt;
    }


    // 2. Apply thrust if active
    if (playerShip.thrusting) {
        // Note: SHIP_THRUST is now a 'let' variable and can be increased by upgrades
        playerShip.thrustX = SHIP_THRUST * Math.cos(playerShip.angle) * dt;
        playerShip.thrustY = SHIP_THRUST * Math.sin(playerShip.angle) * dt;

        playerShip.velocityX += playerShip.thrustX;
        playerShip.velocityY += playerShip.thrustY;

        // Cap velocity
        const speed = Math.sqrt(playerShip.velocityX * playerShip.velocityX + playerShip.velocityY * playerShip.velocityY);
        if (speed > MAX_VELOCITY) {
            playerShip.velocityX = (playerShip.velocityX / speed) * MAX_VELOCITY;
            playerShip.velocityY = (playerShip.velocityY / speed) * MAX_VELOCITY;
        }

    } else { // Friction applied when not thrusting
        playerShip.velocityX *= FRICTION;
        playerShip.velocityY *= FRICTION;
    }

    // 3. Update ship position
    playerShip.x += playerShip.velocityX * dt;
    playerShip.y += playerShip.velocityY * dt;

    // 4. Wrap around screen edges
    if (playerShip.x < 0 - playerShip.radius) {
        playerShip.x = canvas.width + playerShip.radius;
    } else if (playerShip.x > canvas.width + playerShip.radius) {
        playerShip.x = 0 - playerShip.radius;
    }
    if (playerShip.y < 0 - playerShip.radius) {
        playerShip.y = canvas.height + playerShip.radius;
    } else if (playerShip.y > canvas.height + playerShip.radius) {
        playerShip.y = 0 - playerShip.radius;
    }

    // --- Update Bullets ---
    for (let i = bullets.length - 1; i >= 0; i--) { // Loop backwards to safely remove elements
        const bullet = bullets[i];

        // Move bullet
        bullet.x += bullet.velocityX * dt;
        bullet.y += bullet.velocityY * dt;

        // Decrease lifetime
        bullet.lifetime -= dt;

        // --- Check for Collisions with Asteroids ---
        for (let j = asteroids.length - 1; j >= 0; j--) { // Loop backwards for safe removal
            const asteroid = asteroids[j];

            if (checkCollision(bullet, asteroid)) {
                // Collision detected!

                // 1. Remove the bullet
                bullets.splice(i, 1);
                // No i-- needed here for the bullet loop because we are going i to 0

                // 2. Handle asteroid destruction/splitting
                splitAsteroid(asteroid, j);
                break; // Exit the inner asteroid loop; bullet only hits one asteroid
            }
        }

        // Remove bullet if its lifetime is over or it goes too far off-screen
        if (bullet.lifetime <= 0) {
            bullets.splice(i, 1); // Remove from array
            continue; // Skip to next bullet
        }

        // Wrap bullet around screen edges
        if (bullet.x < 0) bullet.x = canvas.width;
        if (bullet.x > canvas.width) bullet.x = 0;
        if (bullet.y < 0) bullet.y = canvas.height;
        if (bullet.y > canvas.height) bullet.y = 0;
    }

    // --- Update Shoot Cooldown ---
    if (!canShoot) {
        shootCooldownTimer -= dt;
        if (shootCooldownTimer <= 0) {
            canShoot = true;
        }
    }

    // --- Update Resources ---
    for (let i = resources.length - 1; i >= 0; i--) {
        const resource = resources[i];

        // Move resource (drift slowly)
        resource.x += resource.velocityX * dt;
        resource.y += resource.velocityY * dt;

        // Apply a little friction to resources so they don't drift forever
        resource.velocityX *= 0.98;
        resource.velocityY *= 0.98;

        // Decrease lifetime
        resource.lifetime -= dt;

        // Remove resource if its lifetime is over
        if (resource.lifetime <= 0) {
            resources.splice(i, 1);
            continue; // Skip to next resource
        }

        // Wrap resource around screen edges
        if (resource.x < 0 - resource.radius) resource.x = canvas.width + resource.radius;
        if (resource.x > canvas.width + resource.radius) resource.x = 0 - resource.radius;
        if (resource.y < 0 - resource.radius) resource.y = canvas.height + resource.radius;
        if (resource.y > canvas.height + resource.radius) resource.y = 0 - resource.radius;

        // --- Check for Player-Resource Collision ---
        if (!playerShip.isDead && checkCollision(playerShip, resource)) {
            // Player collected the resource!
            inventory[resource.type]++; // Increment count in inventory
            resources.splice(i, 1); // Remove resource from game world
        }
    }

    // --- Infinite Asteroid Spawning Logic ---
    asteroidSpawnTimer -= dt;
    if (asteroidSpawnTimer <= 0) {
        if (asteroids.length < MAX_ASTEROIDS_ON_SCREEN) {
            // Spawn a new large asteroid
            let x, y, safeDistance = canvas.width / 4;
            // Spawn off-screen to allow them to drift into view
            const spawnEdge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

            switch (spawnEdge) {
                case 0: // Top edge
                    x = Math.random() * canvas.width;
                    y = -ASTEROID_SIZE; // Spawn above canvas
                    break;
                case 1: // Right edge
                    x = canvas.width + ASTEROID_SIZE; // Spawn right of canvas
                    y = Math.random() * canvas.height;
                    break;
                case 2: // Bottom edge
                    x = Math.random() * canvas.width;
                    y = canvas.height + ASTEROID_SIZE; // Spawn below canvas
                    break;
                case 3: // Left edge
                    x = -ASTEROID_SIZE; // Spawn left of canvas
                    y = Math.random() * canvas.height;
                    break;
            }

            // Ensure new asteroid doesn't spawn too close to the player
            // This is a safety check; off-screen spawn helps, but extra check is good.
            do {
                if (spawnEdge === 0 || spawnEdge === 2) { // Top/Bottom
                    x = Math.random() * canvas.width;
                } else { // Left/Right
                    y = Math.random() * canvas.height;
                }
            } while (
                Math.sqrt(Math.pow(x - playerShip.x, 2) + Math.pow(y - playerShip.y, 2)) < safeDistance
            );

            asteroids.push(createAsteroid(x, y, ASTEROID_SIZE / 2, 3)); // Always spawn large (level 3)
            //console.log("New asteroid spawned!"); // Commented out for less console spam
        }
        asteroidSpawnTimer = ASTEROID_SPAWN_INTERVAL; // Reset the timer
    }

    // --- Infinite Enemy Ship Spawning Logic ---
    enemySpawnTimer -= dt;
    if (enemySpawnTimer <= 0) {
        if (enemyShips.length < MAX_ENEMY_SHIPS) {
            // Spawn a new enemy ship off-screen
            let x, y;
            const spawnEdge = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
            let initialAngle; // Angle the enemy will move

            // Determine spawn position and initial direction
            switch (spawnEdge) {
                case 0: // Top edge
                    x = Math.random() * canvas.width;
                    y = -ENEMY_SHIP_SIZE;
                    initialAngle = Math.random() * Math.PI + Math.PI / 4; // Downwards bias
                    break;
                case 1: // Right edge
                    x = canvas.width + ENEMY_SHIP_SIZE;
                    y = Math.random() * canvas.height;
                    initialAngle = Math.random() * Math.PI + Math.PI / 2; // Leftwards bias
                    break;
                case 2: // Bottom edge
                    x = Math.random() * canvas.width;
                    y = canvas.height + ENEMY_SHIP_SIZE;
                    initialAngle = Math.random() * Math.PI - Math.PI / 4; // Upwards bias
                    break;
                case 3: // Left edge
                    x = -ENEMY_SHIP_SIZE;
                    y = Math.random() * canvas.height;
                    initialAngle = Math.random() * Math.PI - Math.PI / 2; // Rightwards bias
                    break;
            }

            // A basic check to ensure it doesn't spawn too close to the player, even off-screen
            const safeDistance = canvas.width / 4;
            let attempts = 0;
            const maxAttempts = 10;
            let tooClose;
            do {
                if (attempts > 0) { // If it's not the first attempt, re-randomize
                     switch (spawnEdge) {
                        case 0: x = Math.random() * canvas.width; break;
                        case 1: y = Math.random() * canvas.height; break;
                        case 2: x = Math.random() * canvas.width; break;
                        case 3: y = Math.random() * canvas.height; break;
                    }
                     initialAngle = Math.random() * Math.PI * 2; // Random angle if re-rolling position
                }
                tooClose = Math.sqrt(Math.pow(x - playerShip.x, 2) + Math.pow(y - playerShip.y, 2)) < safeDistance;
                attempts++;
            } while (tooClose && attempts < maxAttempts);


            createEnemyShip(x, y, initialAngle);
            //console.log("New enemy ship spawned!"); // Commented out for less console spam
        }
        enemySpawnTimer = ENEMY_SPAWN_INTERVAL; // Reset the timer
    }


    // --- Update Enemy Ships ---
    for (let i = enemyShips.length - 1; i >= 0; i--) {
        const enemy = enemyShips[i];

        // Move enemy ship
        enemy.x += enemy.velocityX * dt;
        enemy.y += enemy.velocityY * dt;

        // Wrap enemy ship around screen edges
        if (enemy.x < 0 - enemy.radius) enemy.x = canvas.width + enemy.radius;
        if (enemy.x > canvas.width + enemy.radius) enemy.x = 0 - enemy.radius;
        if (enemy.y < 0 - enemy.radius) enemy.y = canvas.height + enemy.radius;
        if (enemy.y > canvas.height + enemy.radius) enemy.y = 0 - enemy.radius;

        // Future: Collision with player, bullets, etc.
    }


    // --- Update Asteroids ---
    for (let i = asteroids.length - 1; i >= 0; i--) { // Loop backwards for safe removal later
        const asteroid = asteroids[i];

        // Move asteroid
        asteroid.x += asteroid.velocityX * dt;
        asteroid.y += asteroid.velocityY * dt;

        // Rotate asteroid
        asteroid.angle += asteroid.rotationSpeed * dt;

        // Wrap asteroid around screen edges
        if (asteroid.x < 0 - asteroid.radius) asteroid.x = canvas.width + asteroid.radius;
        if (asteroid.x > canvas.width + asteroid.radius) asteroid.x = 0 - asteroid.radius;
        if (asteroid.y < 0 - asteroid.radius) asteroid.y = canvas.height + asteroid.radius;
        if (asteroid.y > canvas.height + asteroid.radius) asteroid.y = 0 - asteroid.radius;
    }
}

// --- Draw Function ---
// All rendering (drawing shapes, images, text) will happen here
function draw() {
    // Draw Player Ship
    // If player is dead, don't draw them while waiting to respawn
    // If player is invulnerable, make them blink
    if (!playerShip.isDead && (!playerShip.isInvulnerable || Math.floor(playerShip.invulnerabilityTimer * 10) % 2 == 0)) {
        if (playerShip.isRainbow) {
            ctx.strokeStyle = 'hsl(' + playerShip.rainbowHue + ', 100%, 50%)'; // HSL color for rainbow
        } else {
            ctx.strokeStyle = 'white'; // Default white
        }
        ctx.lineWidth = 2;
        ctx.beginPath();

        // Draw the ship as a triangle
        // Nose of the ship
        ctx.moveTo(
            playerShip.x + playerShip.radius * 1.5 * Math.cos(playerShip.angle),
            playerShip.y + playerShip.radius * 1.5 * Math.sin(playerShip.angle)
        );

        // Rear left point
        ctx.lineTo(
            playerShip.x - playerShip.radius * (Math.cos(playerShip.angle) + Math.sin(playerShip.angle)),
            playerShip.y - playerShip.radius * (Math.sin(playerShip.angle) - Math.cos(playerShip.angle))
        );

        // Rear right point
        ctx.lineTo(
            playerShip.x - playerShip.radius * (Math.cos(playerShip.angle) - Math.sin(playerShip.angle)),
            playerShip.y - playerShip.radius * (Math.sin(playerShip.angle) + Math.cos(playerShip.angle))
        );

        ctx.closePath(); // Close the triangle
        ctx.stroke(); // Draw the outline

        // Draw engine exhaust if thrusting
        if (playerShip.thrusting) {
            ctx.fillStyle = 'orange';
            ctx.strokeStyle = 'yellow';
            ctx.lineWidth = 3;
            ctx.beginPath();

            // Exhaust flame (simple triangle behind the ship)
            ctx.moveTo(
                playerShip.x - playerShip.radius * (Math.cos(playerShip.angle) + Math.sin(playerShip.angle) * 0.7),
                playerShip.y - playerShip.radius * (Math.sin(playerShip.angle) - Math.cos(playerShip.angle) * 0.7)
            );
            ctx.lineTo(
                playerShip.x - playerShip.radius * 2.5 * Math.cos(playerShip.angle),
                playerShip.y - playerShip.radius * 2.5 * Math.sin(playerShip.angle)
            );
            ctx.lineTo(
                playerShip.x - playerShip.radius * (Math.cos(playerShip.angle) - Math.sin(playerShip.angle) * 0.7),
                playerShip.y - playerShip.radius * (Math.sin(playerShip.angle) + Math.cos(playerShip.angle) * 0.7)
            );
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }
    }

    // Draw Bullets
    ctx.fillStyle = 'lime'; // Bullet color (bright green)
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2); // Draw a circle
        ctx.fill();
    }

    // --- Draw Enemy Ships ---
    ctx.strokeStyle = 'red'; // Enemy outline color
    ctx.fillStyle = 'darkred'; // Enemy fill color
    ctx.lineWidth = 2;
    for (let i = 0; i < enemyShips.length; i++) {
        const enemy = enemyShips[i];
        ctx.beginPath();
        // A simple triangle for the enemy, pointing in its direction of travel
        // Similar to player ship, but perhaps smaller or rotated differently
        ctx.moveTo(
            enemy.x + enemy.radius * Math.cos(enemy.angle),
            enemy.y + enemy.radius * Math.sin(enemy.angle)
        );
        ctx.lineTo(
            enemy.x + enemy.radius * Math.cos(enemy.angle - 2 * Math.PI / 3),
            enemy.y + enemy.radius * Math.sin(enemy.angle - 2 * Math.PI / 3)
        );
        ctx.lineTo(
            enemy.x + enemy.radius * Math.cos(enemy.angle + 2 * Math.PI / 3),
            enemy.y + enemy.radius * Math.sin(enemy.angle + 2 * Math.PI / 3)
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }


    // Draw Asteroids
    ctx.strokeStyle = 'lightgrey'; // Asteroid outline color
    ctx.lineWidth = 2;

    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];

        ctx.beginPath();
        // Start at the first vertex (relative to asteroid center and rotated)
        let rotatedX = asteroid.vertices[0].x * Math.cos(asteroid.angle) - asteroid.vertices[0].y * Math.sin(asteroid.angle);
        let rotatedY = asteroid.vertices[0].x * Math.sin(asteroid.angle) + asteroid.vertices[0].y * Math.cos(asteroid.angle);
        ctx.moveTo(asteroid.x + rotatedX, asteroid.y + rotatedY);

        // Draw lines to all other vertices
        for (let j = 1; j < asteroid.vertices.length; j++) {
            rotatedX = asteroid.vertices[j].x * Math.cos(asteroid.angle) - asteroid.vertices[j].y * Math.sin(asteroid.angle);
            rotatedY = asteroid.vertices[j].x * Math.sin(asteroid.angle) + asteroid.vertices[j].y * Math.cos(asteroid.angle);
            ctx.lineTo(asteroid.x + rotatedX, asteroid.y + rotatedY);
        }

        ctx.closePath(); // Connect the last vertex back to the first
        ctx.stroke();
    }

    // --- Draw Resources ---
    for (let i = 0; i < resources.length; i++) {
        const resource = resources[i];
        ctx.beginPath();
        ctx.arc(resource.x, resource.y, resource.radius, 0, Math.PI * 2);

        // Color resources based on type
        switch (resource.type) {
            case 'ore':
                ctx.fillStyle = 'brown'; // Or a metallic grey
                break;
            case 'crystal':
                ctx.fillStyle = 'purple';
                break;
            default:
                ctx.fillStyle = 'white'; // Fallback color
        }
        ctx.fill();
        ctx.strokeStyle = 'black'; // Small border for visibility
        ctx.lineWidth = 1;
        ctx.stroke();
    }


    // --- Draw Score and Lives ---
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.textAlign = 'right';
    ctx.fillText(`Lives: ${lives}`, canvas.width - 10, 30);

    // --- Draw High Score ---
    ctx.textAlign = 'center'; // Center it at the top
    ctx.fillText(`High Score: ${highScore}`, canvas.width / 2, 30);


    // --- Draw Inventory ---
    ctx.textAlign = 'left';
    ctx.font = '16px Arial';
    ctx.fillText(`Ore: ${inventory.ore}`, 10, 60); // Below score
    ctx.fillText(`Crystal: ${inventory.crystal}`, 10, 80); // Below ore


    // --- Draw Shop UI ---
    if (showShop) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'; // Semi-transparent black background
        ctx.fillRect(canvas.width / 4, canvas.height / 4, canvas.width / 2, canvas.height / 2);

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('UPGRADES', canvas.width / 2, canvas.height / 4 + 40);

        ctx.font = '20px Arial';
        ctx.textAlign = 'left';

        // Thrust Upgrade
        ctx.fillText(`1. Upgrade Thrust (Cost: ${UPGRADE_COST_ORE} Ore, ${UPGRADE_COST_CRYSTAL} Crystal)`, canvas.width / 4 + 20, canvas.height / 4 + 100);
        ctx.fillText(`   Current Thrust: ${SHIP_THRUST}`, canvas.width / 4 + 40, canvas.height / 4 + 125);

        // Bullet Speed Upgrade
        ctx.fillText(`2. Upgrade Bullet Speed (Cost: ${UPGRADE_COST_ORE} Ore, ${UPGRADE_COST_CRYSTAL} Crystal)`, canvas.width / 4 + 20, canvas.height / 4 + 160);
        ctx.fillText(`   Current Bullet Speed: ${BULLET_SPEED}`, canvas.width / 4 + 40, canvas.height / 4 + 185);

        // Life Upgrade
        ctx.fillText(`3. Purchase Life (Cost: ${UPGRADE_COST_LIFE_ORE} Ore, ${UPGRADE_COST_LIFE_CRYSTAL} Crystal)`, canvas.width / 4 + 20, canvas.height / 4 + 220);
        ctx.fillText(`   Current Lives: ${lives}`, canvas.width / 4 + 40, canvas.height / 4 + 245);

        // Rainbow Ship Upgrade
        ctx.fillText(`4. Rainbow Ship (Cost: ${UPGRADE_COST_RAINBOW_ORE} Ore, ${UPGRADE_COST_RAINBOW_CRYSTAL} Crystal)`, canvas.width / 4 + 20, canvas.height / 4 + 280);
        ctx.fillText(`   Status: ${playerShip.isRainbow ? 'Active' : 'Inactive'}`, canvas.width / 4 + 40, canvas.height / 4 + 305);


        ctx.font = '18px Arial';
        if (isMobile) {
            ctx.fillText('Tap to buy. Tap the SHOP button to close.', canvas.width / 4 + 20, canvas.height * 3 / 4 - 30);
        } else {
            ctx.fillText('Press 1, 2, 3 or 4 to buy. Press E to close.', canvas.width / 4 + 20, canvas.height * 3 / 4 - 30);
        }
    }

    // --- Draw Mobile Controls (if active) ---
    if (isMobile) {
        drawMobileControls();
    }


    // --- Draw Admin Window ---
    if (showAdminWindow) {
        ctx.fillStyle = 'rgba(0, 0, 50, 0.9)'; // Dark blue, semi-transparent
        ctx.fillRect(canvas.width / 3, canvas.height / 3, canvas.width / 3, canvas.height / 3);

        ctx.fillStyle = 'white';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ADMIN PANEL', canvas.width / 2, canvas.height / 3 + 40);

        ctx.font = '18px Arial';
        ctx.textAlign = 'left';

        // Infinite Lives Cheat
        ctx.fillText(`1. Infinite Lives: ${infiniteLives ? 'ON' : 'OFF'}`, canvas.width / 3 + 20, canvas.height / 3 + 100);

        // Infinite Resources Cheat
        ctx.fillText(`2. Infinite Resources: ${infiniteResources ? 'ON' : 'OFF'}`, canvas.width / 3 + 20, canvas.height / 3 + 130);

        ctx.font = '16px Arial';
        if (isMobile) {
             ctx.fillText('Use desktop keyboard to toggle or ESC to close.', canvas.width / 3 + 20, canvas.height * 2 / 3 - 30);
        } else {
            ctx.fillText('Press 1 or 2 to toggle. Press ESC to close.', canvas.width / 3 + 20, canvas.height * 2 / 3 - 30);
        }
    }
}

// --- Draw Mobile Controls Function ---
function drawMobileControls() {
    if (!isMobile) return; // Only draw on mobile

    ctx.save(); // Save the current drawing state

    // Draw Joystick
    // Only draw joystick if game is active (not in shop or admin)
    if (!showAdminWindow && !showShop) {
        // Joystick Base
        ctx.beginPath();
        ctx.arc(joystick.startX, joystick.startY, joystick.baseRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Joystick Stick
        if (joystick.active) {
            ctx.beginPath();
            ctx.arc(joystick.currentX, joystick.currentY, joystick.stickRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Draw Shoot Button
    ctx.beginPath();
    ctx.arc(shootButton.x, shootButton.y, shootButton.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 50, 50, 0.5)'; // Reddish semi-transparent
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('FIRE', shootButton.x, shootButton.y);


    // Draw Shop Button
    ctx.beginPath();
    ctx.arc(shopButton.x, shopButton.y, shopButton.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(50, 50, 255, 0.5)'; // Bluish semi-transparent
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SHOP', shopButton.x, shopButton.y);

    ctx.restore(); // Restore the previous drawing state
}


// Start the game loop when the script loads
checkMobileDevice(); // Make sure to call this before the game loop and initial spawn
requestAnimationFrame(gameLoop);

// Spawn initial asteroids
spawnInitialAsteroids();
