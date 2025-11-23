const express = require("express");
const http = require("http");
const { WebSocketServer } = require("ws");

const app = express();
app.use(express.static("public"));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

let waitingPlayer = null;

wss.on("connection", (ws) => {
  if (!waitingPlayer) {
    waitingPlayer = ws;
    ws.send(JSON.stringify({ type: "status", msg: "Waiting for opponent..." }));
  } else {
    const p1 = waitingPlayer;
    const p2 = ws;
    waitingPlayer = null;

    p1.opponent = p2;
    p2.opponent = p1;

    p1.send(JSON.stringify({ type: "start", color: "white" }));
    p2.send(JSON.stringify({ type: "start", color: "black" }));
  }

  ws.on("message", (msg) => {
    if (ws.opponent) ws.opponent.send(msg.toString());
  });

  ws.on("close", () => {
    if (ws.opponent) {
      ws.opponent.send(JSON.stringify({ type: "opponent_left" }));
      ws.opponent.opponent = null;
    }
    if (waitingPlayer === ws) waitingPlayer = null;
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log("Server running on " + PORT));
