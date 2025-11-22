const boardElement = document.getElementById("board");
let squares = [];
function createBoard() {
  boardElement.innerHTML = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const sq = document.createElement("div");
      sq.classList.add("square");
      if ((r + c) % 2 === 0) sq.classList.add("light");
      else sq.classList.add("dark");
      sq.dataset.row = r;
      sq.dataset.col = c;
      squares.push(sq);
      boardElement.appendChild(sq);
    }
  }
}
createBoard();
