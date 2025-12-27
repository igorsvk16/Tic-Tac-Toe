const Gameboard = (() => {
    const board = Array(9).fill(null);

    function getBoard() {
        return board;
    }

    function setMark(index, mark) {
        if (board[index] === null && index >= 0 && index <= 8) {
            return board[index] = mark;
        }
         
    }

    function getBoard() {}

    

    return { getBoard, setMark }
})();

function Player(name, mark) {
    return { name, mark };
}

function GameController() {
    const players = [Player('Player 1', 'X'), Player('Player 2', 'O')];
    let currentPlayerIndex = 0;
    let gameOver = false;

    function getActivePlayer() {
        return players[currentPlayerIndex];
    }

    function resetGame() {
        for (let i = 0; i < board.length; i++) {
            board[i] = null;
        }
    }

    function playRound(index) {

    }
    
    function checkDraw(board) {

    }

}