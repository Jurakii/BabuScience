// games/clickergame.js

(function() {
    let canvas = null;
    let ctx = null;
    let circleColor = 'blue';
    let clickHandler = null; // To store the event listener for cleanup
    let showMessageBoxRef = null; // Reference to the showMessageBox function
    let messageTimeoutId = null; // To manage the message box visibility

    /**
     * Initializes the ClickerGame.
     * This function is called by the main Arcade.html page.
     * @param {HTMLCanvasElement} gameCanvas The canvas element to draw on.
     * @param {CanvasRenderingContext2D} gameCtx The 2D rendering context of the canvas.
     * @param {function(string)} messageBoxFunc A function to display messages.
     */
    // FIX: Changed 'ClickerGame' to 'clickergame' (lowercase 'c')
    window.initGame_clickergame = function(gameCanvas, gameCtx, messageBoxFunc) {
        canvas = gameCanvas;
        ctx = gameCtx;
        showMessageBoxRef = messageBoxFunc;

        if (!canvas || !ctx) {
            console.error("ClickerGame: Canvas or context not provided.");
            return;
        }

        // Initial message
        showMessageBoxRef('Click the circle!');

        // Draw the initial circle
        drawCircle();

        // Attach event listener
        clickHandler = function(event) {
            const rect = canvas.getBoundingClientRect();
            // Adjust click coordinates for canvas resolution vs. display size
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;

            // Check if the click is within the circle (simple hit test for a circle at the center)
            const circleCenterX = canvas.width / 2;
            const circleCenterY = canvas.height / 2;
            const radius = 50 * Math.min(scaleX, scaleY); // Adjust radius for scaling if necessary, or keep fixed
            const distance = Math.sqrt(Math.pow(x - circleCenterX, 2) + Math.pow(y - circleCenterY, 2));

            if (distance <= radius) {
                changeCircleColor();
                drawCircle();
                showMessageBoxRef('Color changed!');
                // Clear any existing timeout before setting a new one
                if (messageTimeoutId) {
                    clearTimeout(messageTimeoutId);
                }
                // Briefly hide the message after a short delay
                messageTimeoutId = setTimeout(() => showMessageBoxRef(''), 1000);
            }
        };
        canvas.addEventListener('click', clickHandler);
    };

    /**
     * Draws the circle on the canvas.
     */
    function drawCircle() {
        if (!ctx || !canvas) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        ctx.beginPath();
        // Draw circle relative to canvas dimensions to ensure it scales with resize
        const circleRadius = Math.min(canvas.width, canvas.height) * 0.1; // Make radius responsive
        ctx.arc(canvas.width / 2, canvas.height / 2, circleRadius, 0, Math.PI * 2); // Center circle
        ctx.fillStyle = circleColor;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    /**
     * Changes the circle's color to a random RGB color.
     */
    function changeCircleColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        circleColor = `rgb(${r},${g},${b})`;
    }

    /**
     * Cleans up the ClickerGame by removing event listeners.
     * This function is called by the main Arcade.html page.
     */
    window.cleanupGame = function() {
        if (canvas && clickHandler) {
            canvas.removeEventListener('click', clickHandler);
            console.log("ClickerGame: Click event listener removed.");
        }
        if (messageTimeoutId) {
            clearTimeout(messageTimeoutId); // Clear any pending message hide timeouts
            messageTimeoutId = null;
        }
        // Reset state
        canvas = null;
        ctx = null;
        clickHandler = null;
        showMessageBoxRef = null;
        circleColor = 'blue'; // Reset to default color
        console.log("ClickerGame: Cleaned up.");
    };
})();
