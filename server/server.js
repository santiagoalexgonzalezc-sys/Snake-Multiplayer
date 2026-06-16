const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(express.static("../client"));



// =====================
// GAME STATE
// =====================

const snakes = {};

const GRID_SIZE = 20;

// create snake helper
function createSnake(id) {
    return {
        id,
        body: [{ x: 10, y: 10 }],
        direction: "right"
    };
}

// =====================
// SOCKETS
// =====================

io.on("connection", (socket) => {
    console.log("Player connected:", socket.id);

    snakes[socket.id] = createSnake(socket.id);

    // receive input
    socket.on("direction", (dir) => {
        if (snakes[socket.id]) {
            snakes[socket.id].direction = dir;
        }
    });

    socket.on("disconnect", () => {
        console.log("Player left:", socket.id);
        delete snakes[socket.id];
    });
});



// =====================
// GAME LOOP (IMPORTANT)
// =====================

function gameLoop() {
    for (const id in snakes) {
        const snake = snakes[id];
        const head = { ...snake.body[0] };

        switch (snake.direction) {
            case "up":
                head.y -= 1;
                break;
            case "down":
                head.y += 1;
                break;
            case "left":
                head.x -= 1;
                break;
            case "right":
                head.x += 1;
                break;
        }

        snake.body.unshift(head);
        snake.body.pop(); // keep length 1 for now (no growth yet)
    }

    io.emit("state", snakes);
}

setInterval(gameLoop, 150);

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});





