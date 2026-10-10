const cells = [...document.querySelectorAll("[data-cell]")];
const status = document.querySelector("#status");
const newGameButton = document.querySelector("#new-game");
const resetScoreButton = document.querySelector("#reset-score");
const scoreX = document.querySelector("#score-x");
const scoreO = document.querySelector("#score-o");
const playerX = document.querySelector("#player-x");
const playerO = document.querySelector("#player-o");

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "X";
let roundOver = false;
const scores = { X: 0, O: 0 };

function updateTurnIndicator() {
  playerX.classList.toggle("active", currentPlayer === "X" && !roundOver);
  playerO.classList.toggle("active", currentPlayer === "O" && !roundOver);
}

function getWinningLine() {
  return winningLines.find(([a, b, c]) => board[a] && board[a] === board[b] && board[a] === board[c]);
}

function playCell(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.cell);

  if (roundOver || board[index]) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer === "X" ? "×" : "○";
  cell.classList.add(currentPlayer.toLowerCase());
  cell.disabled = true;
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}, ${currentPlayer}`);

  const winningLine = getWinningLine();
  if (winningLine) {
    roundOver = true;
    winningLine.forEach((winningIndex) => cells[winningIndex].classList.add("winner"));
    scores[currentPlayer] += 1;
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
    status.textContent = `Player ${currentPlayer} wins!`;
    updateTurnIndicator();
    return;
  }

  if (board.every(Boolean)) {
    roundOver = true;
    status.textContent = "It’s a draw! Good game.";
    updateTurnIndicator();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  status.textContent = `Player ${currentPlayer}’s turn`;
  updateTurnIndicator();
}

function startNewRound() {
  board = Array(9).fill("");
  currentPlayer = "X";
  roundOver = false;
  status.textContent = "Player X’s turn";

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.classList.remove("x", "o", "winner");
    cell.setAttribute(
      "aria-label",
      `Row ${Math.floor(Number(cell.dataset.cell) / 3) + 1}, column ${(Number(cell.dataset.cell) % 3) + 1}`,
    );
  });

  updateTurnIndicator();
}

function resetScore() {
  scores.X = 0;
  scores.O = 0;
  scoreX.textContent = "0";
  scoreO.textContent = "0";
  startNewRound();
}

cells.forEach((cell) => cell.addEventListener("click", playCell));
newGameButton.addEventListener("click", startNewRound);
resetScoreButton.addEventListener("click", resetScore);
