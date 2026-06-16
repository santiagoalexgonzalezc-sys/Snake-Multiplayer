console.log("GAME JS LOADED");
const socket = io();

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const CELL = 20;

let gameState = {};



socket.on("connect", () => {
    console.log("Connected to server:", socket.id);
});

socket.on("state", (state) => {
    console.log("STATE:", state);
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

    
    if (!gameState || Object.keys(gameState).length === 0) {
        requestAnimationFrame(draw);
        return;
    }

    ctx.fillStyle = "red";
    ctx.fillRect(100, 100, 50, 50);

    for (const id in gameState) {
        const snake = gameState[id];

        if (!snake || !snake.body) continue;

        ctx.fillStyle = "lime";

        for (const part of snake.body) {
            ctx.fillRect(
                part.x * 20,
                part.y * 20,
                20,
                20
            );
        }
    }

    requestAnimationFrame(draw);
}



draw();