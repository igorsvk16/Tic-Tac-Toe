const Gameboard = (() => {
    const board = Array(9).fill(null);

    function getBoard() {
        return board.slice();
    }
    function setMark(index, mark) {
        if (index >= 0 && index <= 8 && board[index] === null) {
            board[index] = mark;
            return true;
        } else {
            return false;
        }
    }
    function reset() {
        for (let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    }

    return { getBoard, setMark, reset }
})();

function Player(name, mark) {
    return { name, mark };
}

function GameController(name1, name2) {
    const players = [Player(name1 || "Player 1", 'X'), Player(name2 || "Player 2", 'O')];
    let currentPlayerIndex = 0;
    let gameOver = false;

    function printBoard(board) {
        const cell = (v) => (v === null ? "." : v);

        console.log(board.slice(0, 3).map(cell).join(" "))
        console.log(board.slice(3, 6).map(cell).join(" "))
        console.log(board.slice(6, 9).map(cell).join(" "))
    }
    function playRound(index) {
        if (gameOver) {
            console.log('The game is over. Please reset to start a new game.');
            return { type: "gameOver", game: "Game over. Press Restart"};
        }

        const player = getActivePlayer();
        const placed = Gameboard.setMark(index, player.mark);

        if (!placed) {
            console.log(`Invalid move`);
            return { type: "invalid", reason: "occupiedOrOutOfRange" };
        }
        const board = Gameboard.getBoard();
        printBoard(board);
        const winningLine = checkWinner(board);
        if (winningLine) {
            gameOver = true;
            console.log(`${player.name} with mark ${player.mark} wins!`);
            return { type: "win", winner: player.name, line: winningLine };
        }
        const isDraw = checkDraw(board);
        if (isDraw === true) {
            console.log('The game is a draw!');
            return { type: "draw"};
        }
        switchPlayer();
        console.log(`It's now ${getActivePlayer().name}'s turn.`);
        return { type: "switch", switcher: getActivePlayer().name }
    }

    const WIN_LINES = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

    function checkWinner(board) {
        for (const line of WIN_LINES) {
            const [a, b, c] = line;
            if (board[a] !== null && board[a] === board[b] && board[a] === board[c]) {
                return line;
            }
        }
        return null;
    }
    function checkDraw(board) {
        if (board.every(cell => cell !== null)) {
            gameOver = true
            return true;
        } else {
            return false;
        }
    }
    function switchPlayer() {
        currentPlayerIndex = 1 - currentPlayerIndex;
    }
    function getActivePlayer() {
        return players[currentPlayerIndex];
    }

    return { getActivePlayer, playRound }
}

const DisplayController = (() => {
    let lastResult = { type: "switch", switcher: "Player 1" };
    let statusEl = document.querySelector('#status');
    let startBtn = document.querySelector('#start');
    const boardEl = document.querySelector("#board");
    let game = null;
    let isStarted = false;
    const player1Input = document.querySelector("#player-1");
    const player2Input = document.querySelector("#player-2");
    
    function setStatusFromGame(game) {
        if (game === null) {
            return;
        } else {
            const active = game.getActivePlayer();
            lastResult = { type: "switch", switcher: active.name }
        }       
    }
    function startGame() {
        const name1 = player1Input.value.trim() || "Player 1";
        const name2 = player2Input.value.trim() || "Player 2";
        player1Input.value = name1;
        player2Input.value = name2;
        game = GameController(name1, name2);
        Gameboard.reset();
        isStarted = true;
        startBtn.textContent = "Restart";
        setStatusFromGame(game);
        render();
    }
    function render() {
        const board = Gameboard.getBoard();
        const winningLine = lastResult && lastResult.type === "win" ? lastResult.line : null;
        boardEl.textContent = '';
        board.forEach((value, index) => {
            const cellBtn = document.createElement("button")
            if (value === null) {
                cellBtn.textContent = "";
            } else {
                cellBtn.textContent = value;
            }
            if (winningLine && winningLine.includes(index)) {
                cellBtn.classList.add("win-cell");
            }
            cellBtn.dataset.index = index;
            boardEl.append(cellBtn);
        }) 
        statusEl.textContent = getStatusText(lastResult);
        updateWinnerHighlight(lastResult); 
    }
    function bindEvents() {
        if (!game) {
            lastResult = {type: "info", message: "Enter names and press Start" };
            render();
        } else {
            setStatusFromGame(game);
        }
        startBtn.addEventListener("click", (e) => {
            startGame();
        });
        boardEl.addEventListener("click", (e) => {
            if (!isStarted || e.target.tagName !== 'BUTTON') return;
            const index = Number(e.target.dataset.index);
            lastResult = game.playRound(index);
            render();
        });
    }
    function updateWinnerHighlight(result) {
        player1Input.classList.remove("winner");
        player2Input.classList.remove("winner");
        if (!result || result.type !== "win") return;

        if (player1Input.value.trim() === result.winner) {
            player1Input.classList.add("winner");
        }
        if (player2Input.value.trim() === result.winner) {
            player2Input.classList.add("winner");
        }

    }
    function getStatusText(result) {
        if (!result || !result.type) return "";

        switch (result.type) {
            case "switch":
                boardEl.style.pointerEvents = "auto";
                return `Turn: ${result.switcher}`;
            case "win":
                boardEl.style.pointerEvents = "none";
                return `Winner: ${result.winner}`;
            case "draw":
                boardEl.style.pointerEvents = "none";
                return "Draw!";
            case "gameOver":
                return result.game;
            case "info":
                boardEl.style.pointerEvents = "none";
                return result.message;
            case "invalid":
                return `Invalid: ${result.reason}`;
            default:
                return String(result.type);
        }
    }
    return { render, bindEvents } }) ();

DisplayController.bindEvents();
