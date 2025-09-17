$(document).ready(function () {
  $(".dots").click(function () {
    $(".options, p").css("visibility", "hidden");
    $("td").css("visibility", "visible");
    aiCo = "#333";
    huCo = "#22c72f";
  });

  $(".dots2").click(function () {
    $(".options, p").css("visibility", "hidden");
    $("td").css("visibility", "visible");
    aiCo = "#22c72f";
    huCo = "#333";
  });

  $("td").click(function () {
    move(this, huPlayer, huCo);
  });
});

let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let huPlayer = "P";
let aiPlayer = "C";
let round = 0;
let aiCo = "#22c72f";
let huCo = "#333";
let gameOver=false;

// --- Función de Movimiento ---
function move(element, player, color) {
  if (gameOver) return;
  if (board[element.id] != "P" && board[element.id] != "C") {
    round++;
    $(element).css("background-color", color).html("<h1>X</h1>");
    board[element.id] = player;

    // Verificar victoria del jugador
    if (winning(board, player)) {
      showMessage("🎉 ¡TÚ GANAS! 🎉");
      gameOver = true; // Bloquea el tablero
      setTimeout(reset, 2000);
      return;
    }

    // Verificar empate
    if (round > 8) {
      showMessage(" 🤝 ¡EMPATE! 🤝");
      gameOver = true; // Bloquea el tablero
      setTimeout(reset, 2000);
      return;
    }

    // --- Turno de la IA ---
    round++;
    let index = aiMove(); // <-- Ahora usamos la IA mixta
    let selector = "#" + index;
    $(selector).css("background-color", aiCo).html("<h1>O</h1>");
    board[index] = aiPlayer;

    // Verificar victoria de la IA
    if (winning(board, aiPlayer)) {
      showMessage("😢 ¡TÚ PIERDES! 😢");
      gameOver = true; // Bloquea el tablero
      setTimeout(reset, 2000);
      return;
    }

    // Verificar empate después del turno de la IA
    if (round > 8) {
      showMessage("¡EMPATE! 🤝");
      gameOver = true; // Bloquea el tablero
      setTimeout(reset, 2000);
    }
  }
}
// --- Resaltar línea ganadora ---
function highlightWinningLine(combo) {
  combo.forEach((index) => {
    $("#" + index)
      .css("animation", "flash 0.4s alternate infinite")
      .css("border", "3px solid yellow");
  });
}

// --- Función de Mensaje ---
function showMessage(text) {
  $("#message").text(text).css("visibility", "visible");
}

// --- Reiniciar sin recargar ---
function reset() {
  round = 0;
  gameOver = false; // Reiniciar estado
  board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  $("td")
    .css({
      "background-color": "",
      border: "",
      animation: "",
    })
    .html("");
  $("#message").css("visibility", "hidden");
}

//lectura del archivo JSON para dificultad
let difficulty = 0.5; // valor por defecto

$(document).ready(function () {
  // Leer dificultad desde JSON
  $.getJSON("config.json", function (data) {
    difficulty = data.difficulty;
    console.log("Dificultad cargada:", difficulty);
  });

  $(".dots").click(function () {
    $(".options, p").css("visibility", "hidden");
    $("td").css("visibility", "visible");
    aiCo = "#333";
    huCo = "#22c72f";
  });

  $(".dots2").click(function () {
    $(".options, p").css("visibility", "hidden");
    $("td").css("visibility", "visible");
    aiCo = "#22c72f";
    huCo = "#333";
  });

  $("td").click(function () {
    move(this, huPlayer, huCo);
  });
});

// --- IA con probabilidad de error ---
function aiMove() {
  // 25% de probabilidad de jugar aleatorio
  if (Math.random() < difficulty) {
    // Movimiento aleatorio
    let freeCells = avail(board);
    let randomIndex = freeCells[Math.floor(Math.random() * freeCells.length)];
    return randomIndex;
  } else {
    // Movimiento con Minimax
    return minimax(board, aiPlayer).index;
  }
}
// --- Minimax ---
function minimax(reboard, player) {
  let array = avail(reboard);
  if (winning(reboard, huPlayer)) return { score: -10 };
  if (winning(reboard, aiPlayer)) return { score: 10 };
  if (array.length === 0) return { score: 0 };

  let moves = [];
  for (let i = 0; i < array.length; i++) {
    let move = {};
    move.index = reboard[array[i]];
    reboard[array[i]] = player;

    let result =
      player === aiPlayer
        ? minimax(reboard, huPlayer)
        : minimax(reboard, aiPlayer);

    move.score = result.score;
    reboard[array[i]] = move.index;
    moves.push(move);
  }

  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = 10000;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  return moves[bestMove];
}

// --- Posiciones Disponibles ---
function avail(reboard) {
  return reboard.filter((s) => s != "P" && s != "C");
}

// --- Verificar Ganador ---
function winning(board, player) {
  return (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  );
}