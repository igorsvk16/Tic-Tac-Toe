const Gameboard = (() => {
    const board = Array(9).fill(null);

    function getBoard() {
        return board;
    }

    function setMark(index, mark) {
        return 
    }

    function reset() {}

    return { getBoard, setMark, reset }
})();

function Player(name, mark) {
    return { name, mark };
}

function GameController() {

}