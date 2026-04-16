const words = ["APPLE", "GRAPE", "TRAIN", "PLANT", "BRICK"];
let game;

function startGame() {
    game = {
        targetWord: words[Math.floor(Math.random() * words.length)],
        currentRow: 0,
        currentCol: 0,
        guesses: ["", "", "", "", "", ""],
        feedback: Array(6).fill(null),
        state: "playing"
    };
    createBoard();
    createKeyboard();
    render();
}

function createBoard() {
    const board = document.getElementById("board");
    board.innerHTML = "";
    for (let r = 0; r < 6; r++) {
        const row = document.createElement("div");
        row.classList.add("row");
        for (let c = 0; c < 5; c++) {
            const tile = document.createElement("div");
            tile.classList.add("tile");
            tile.id = `tile-${r}-${c}`;
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById("keyboard");
    keyboard.innerHTML = "";
    const layout = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
    layout.forEach(row => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("key-row");
        for (let letter of row) {
            const key = document.createElement("div");
            key.textContent = letter;
            key.classList.add("key");
            key.onclick = () => { handleInput(letter); render(); };
            rowDiv.appendChild(key);
        }
        keyboard.appendChild(rowDiv);
    });
    const lastRow = document.createElement("div");
    lastRow.classList.add("key-row");
    ["ENTER", "BACKSPACE"].forEach(k => {
        const key = document.createElement("div");
        key.textContent = k;
        key.classList.add("key");
        key.onclick = () => { handleInput(k); render(); };
        lastRow.appendChild(key);
    });
    keyboard.appendChild(lastRow);
}

document.addEventListener("keydown", (event) => {
    if (!game || game.state !== "playing") return;
    handleInput(event.key.toUpperCase());
    render();
});

function handleInput(key) {
    if (!game || game.state !== "playing") return;
    if (key === "BACKSPACE") removeLetter();
    else if (key === "ENTER") submitGuess();
    else if (/^[A-Z]$/.test(key)) addLetter(key);
}

function addLetter(letter) {
    if (game.currentCol < 5) {
        game.guesses[game.currentRow] += letter;
        game.currentCol++;
    }
}

function removeLetter() {
    if (game.currentCol > 0) {
        game.guesses[game.currentRow] =
            game.guesses[game.currentRow].slice(0, -1);
        game.currentCol--;
    }
}

function submitGuess() {
    const guess = game.guesses[game.currentRow];
    if (guess.length !== 5) return;
    const result = checkGuess(guess);
    game.feedback[game.currentRow] = result;
    if (guess === game.targetWord) game.state = "win";
    else if (game.currentRow === 5) game.state = "lose";
    else { game.currentRow++; game.currentCol = 0; }
}

function checkGuess(guess) {
    const result = Array(5).fill("absent");
    const target = game.targetWord.split("");
    const used = Array(5).fill(false);
    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) { result[i] = "correct"; used[i] = true; }
    }
    for (let i = 0; i < 5; i++) {
        if (result[i] === "correct") continue;
        for (let j = 0; j < 5; j++) {
            if (!used[j] && guess[i] === target[j]) { result[i] = "present"; used[j] = true; break; }
        }
    }
    return result;
}

function render() {
    const currentWord = document.getElementById("current-word");
    currentWord.textContent = "Current Guess: " + game.guesses[game.currentRow];

    const board = document.getElementById("board");
    for (let r = 0; r < 6; r++) {
        const rowDiv = board.children[r];
        rowDiv.classList.toggle("active-row", r === game.currentRow);
        for (let c = 0; c < 5; c++) {
            const tile = document.getElementById(`tile-${r}-${c}`);
            const letter = game.guesses[r][c] || "";
            tile.textContent = letter;
            tile.className = "tile";
            if (game.feedback[r]) tile.classList.add(game.feedback[r][c]);
            if (r === game.currentRow && c === game.currentCol && game.state === "playing") {
                tile.classList.add("cursor");
            }
        }
    }

    const status = document.getElementById("status");
    if (game.state === "win") status.textContent = "🎉 You win!";
    else if (game.state === "lose") status.textContent = "❌ Word was: " + game.targetWord;
    else status.textContent = "";
}

document.getElementById("restart").onclick = startGame;
document.addEventListener("DOMContentLoaded", startGame);
