
const game = {
    targetWord: "APPLE",
    currentRow: 0,
    currentCol: 0,
    guesses: ["", "", "", "", "", ""],
    feedback: Array(6).fill(null),
    state: "playing"
};


const board = document.getElementById("board");

function createBoard() {
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


document.addEventListener("keydown", (event) => {
    if (game.state !== "playing") return;

    const key = event.key.toUpperCase();
    handleInput(key);
    render();
});

function handleInput(key) {
    if (key === "BACKSPACE") {
        removeLetter();
    } else if (key === "ENTER") {
        submitGuess();
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
    }
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

    if (guess === game.targetWord) {
        game.state = "win";
    } else if (game.currentRow === 5) {
        game.state = "lose";
    } else {
        game.currentRow++;
        game.currentCol = 0;
    }
}

function checkGuess(guess) {
    const result = Array(5).fill("absent");
    const target = game.targetWord;

    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            result[i] = "correct";
        } else if (target.includes(guess[i])) {
            result[i] = "present";
        }
    }

    return result;
}


function render() {
    for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
            const tile = document.getElementById(`tile-${r}-${c}`);
            const letter = game.guesses[r][c] || "";

            tile.textContent = letter;
            tile.className = "tile";

            if (game.feedback[r]) {
                tile.classList.add(game.feedback[r][c]);
            }
        }
    }

    const status = document.getElementById("status");

    if (game.state === "win") {
        status.textContent = "🎉 You guessed it!";
    } else if (game.state === "lose") {
        status.textContent = `❌ The word was ${game.targetWord}`;
    } else {
        status.textContent = "";
    }
}


document.getElementById("restart").addEventListener("click", () => {
    restartGame();
    render();
});

function restartGame() {
    game.targetWord = "APPLE";
    game.currentRow = 0;
    game.currentCol = 0;
    game.guesses = ["", "", "", "", "", ""];
    game.feedback = Array(6).fill(null);
    game.state = "playing";
}


createBoard();
render();