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

function GameController() {
    const players = [Player('Player 1', 'X'), Player('Player 2', 'O')];
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
            return;
        }
        const player = getActivePlayer();
        const placed = Gameboard.setMark(index, player.mark);

        if (!placed) {
            console.log(`Invalid move`);
            return;
        }
        const board = Gameboard.getBoard();
        printBoard(board);
        const winnerMark = checkWinner(board);
        if (winnerMark) {
            gameOver = true;
            console.log(`${player.name} with mark ${winnerMark} wins!`);
            return;
        }
        const isDraw = checkDraw(board);
        if (isDraw === true) {
            console.log('The game is a draw!');
            return;
        }

        switchPlayer();
        console.log(`It's now ${getActivePlayer().name}'s turn.`);
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
                return board[a];
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

    function resetGame() {
        Gameboard.reset();
        currentPlayerIndex = 0;
        gameOver = false;
    }

    return { getActivePlayer, playRound, resetGame }
}

const DisplayController = (() => {
    let statusEl = document.querySelector('#status');
    let resetBtn = document.querySelector('#reset');
    const boardEl = document.querySelector("#board");
    function render() {
        const board = Gameboard.getBoard();
        boardEl.textContent = '';
        board.forEach((value, index) => {
            const cellBtn = document.createElement("button")
            if (value === null) {
                cellBtn.textContent = "";
            } else {
                cellBtn.textContent = value;
            }
            cellBtn.dataset.index = index;
            boardEl.append(cellBtn);
        }) 
    }
    return { render, bindEvents } }) ();




const game = GameController();
const ui = DisplayController(game);