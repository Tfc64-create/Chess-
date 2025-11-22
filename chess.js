let socket = new WebSocket("wss://" + window.location.host);
let myColor = null;
let pieces = [];
let selected = null;
const statusEl = document.getElementById("status");

const initialBoard = [
  ["bR","bN","bB","bQ","bK","bB","bN","bR"],
  ["bP","bP","bP","bP","bP","bP","bP","bP"],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["","","","","","","",""],
  ["wP","wP","wP","wP","wP","wP","wP","wP"],
  ["wR","wN","wB","wQ","wK","wB","wN","wR"]
];

function loadBoard() {
  const squares = document.querySelectorAll(".square");
  pieces = JSON.parse(JSON.stringify(initialBoard));
  squares.forEach(sq => {
    const r = sq.dataset.row;
    const c = sq.dataset.col;
    const piece = pieces[r][c];
    sq.innerHTML = "";
    if (piece) {
      let img = document.createElement("img");
      img.src = "pieces/" + piece + ".png";
      img.className = "piece";
      sq.appendChild(img);
    }
    sq.onclick = () => squareClicked(r, c);
  });
}
loadBoard();

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "start") {
    myColor = data.color;
    statusEl.textContent = "You are " + myColor.toUpperCase();
  }
  if (data.type === "move") {
    makeMove(data.from, data.to, false);
  }
  if (data.type === "opponent_left") {
    statusEl.textContent = "Opponent left. Refresh.";
  }
};

function squareClicked(r, c) {
  if (!myColor) return;
  if (selected == null) {
    if (!pieces[r][c]) return;
    if (pieces[r][c][0] !== myColor[0]) return;
    selected = { r, c };
  } else {
    makeMove(selected, { r, c }, true);
    selected = null;
  }
}

function makeMove(from, to, send) {
  const piece = pieces[from.r][from.c];
  pieces[from.r][from.c] = "";
  pieces[to.r][to.c] = piece;
  loadBoard();
  if (send) {
    socket.send(JSON.stringify({ type: "move", from, to }));
  }
}
