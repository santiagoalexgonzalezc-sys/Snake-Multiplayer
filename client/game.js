const socket = io();

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const CELL = 20;

let gameState = {};

socket.on("state", (state) => {
    gameState = state;
});

// send input
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.key === "w") {
        socket.emit("direction", "up");
    }
    if (e.key === "ArrowDown" || e.key === "s") {
        socket.emit("direction", "down");
    }
    if (e.key === "ArrowLeft" || e.key === "a") {
        socket.emit("direction", "left");
    }
    if (e.key === "ArrowRight" || e.key === "d") {
        socket.emit("direction", "right");
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const id in gameState) {
        const snake = gameState[id];

        ctx.fillStyle = "lime";

        snake.body.forEach((part) => {
            ctx.fillRect(
                part.x * CELL,
                part.y * CELL,
                CELL,
                CELL
            );
        });
    }

    requestAnimationFrame(draw);
}

draw();