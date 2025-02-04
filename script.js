const gameBoardEl = document.querySelector('.game-board');

const gameBoard = [
    ["","",""],
    ["","",""],
    ["","",""],
];

// For dedicate for user not to press while bot play
let available = true;

// For dedicate for Player and Bot turn
// ture for Player
// false for Bot
let turn = true;

let bestMove = [];

function gameSetup() {
    for (let row=0; row<3; row++) {
        for (let column=0; column<3; column++) gameBoard[row][column] = "";
    }
}

function renderGameBorad(gameBoard) {
    const gameBoardFlat = gameBoard.flat();
    Array.from(gameBoardEl.children).forEach((cell,i)=>{
        cell.innerText = gameBoardFlat[i];
    });
}

function minimax(gameBoard, depth, turn) {
    // Base case: check if the game is over
    if (gameOver(checkCurrentPlayer(!turn), gameBoard)) {
        return checkCurrentPlayer(!turn) === User ? -10 * countEmptySpace(gameBoard) : 10 * countEmptySpace(gameBoard);
    }
    if (gameFinish(gameBoard) || depth === 0) {
        return 0;
    }

    let bestScore = turn ? Infinity : -Infinity;
    let localBestMove = null; // Store best move locally

    for (let row = 0; row < 3; row++) {
        for (let column = 0; column < 3; column++) {
            if (gameBoard[row][column] === "") {
                checkCurrentPlayer(turn).move(gameBoard, row, column);
                let score = minimax(gameBoard, depth - 1, !turn);
                gameBoard[row][column] = ""; // Undo move

                if (turn) { // User (Minimizing Player)
                    if (score < bestScore) {
                        bestScore = score;
                        localBestMove = [row, column];
                    }
                } else { // Bot (Maximizing Player)
                    if (score > bestScore) {
                        bestScore = score;
                        localBestMove = [row, column];
                    }
                }
            }
        }
    }

    if (!turn) {
        bestMove = localBestMove; // Update bestMove only for Bot
    }

    return bestScore;
}

// For styling wining player and position;
function styleWinningCells(row,column,diagonal) {
    let cellArray1D = Array.from(gameBoardEl.children); // getting 1D array
    const cellArray = Array.from({length:3},(_,i)=>cellArray1D.slice(i*3,i*3+3)); // making 2D array
    console.log(cellArray);

    // diagonal win
    if (diagonal === 0) {
        for (let i=0;i<3;i++) cellArray[i][i].style.color = "var(--highlight-color)";
        return;
    }
    else if (diagonal === 1) {
        for (let i=0;i<3;i++) cellArray[2-i][i].style.color = "var(--highlight-color)";
        return;
    }

    //row win
    if (column === true) {
        for(let i=0;i<3;i++) cellArray[row][i].style.color = "var(--highlight-color)";
        return;
    }
    else if (row === true) {
        for (let i=0;i<3;i++) cellArray[i][column].style.color = "var(--highlight-color)"
        return;
    }
}

function findWinningCells(gameBoard) {

}
//Row check
function  checkRow(row) {
    return (gameBoard[row][0] === token && gameBoard[row][1] === token && gameBoard[row][2] === token);
}
// Column check
function checkColumn(column) {
    return (gameBoard[0][column] === token && gameBoard[1][column] === token && gameBoard[2][column] === token);
}
// Diagonal check
function checkDiagonl() {
    if (gameBoard[0][0] === token && gameBoard[1][1] === token && gameBoard[2][2] === token) {
        return true;
    }
    else if (gameBoard[0][2] === token && gameBoard[1][1] === token && gameBoard[2][0] === token) {
        return true;
    }
}


function gameFinish(gameBoard) {
    let result = true;
    for (let row=0; row<3; row++) {
        for (let column=0; column<3; column++) {
            if (gameBoard[row][column] === "") result = false;
        }
    }
    return result;
}

function gameOver(player,gameBoard) {
    const token = player.token;


    for (let row=0; row<3; row++) if (checkRow(row)) {
        return true;
    }

    for (let column=0;column<3; column++) if (checkColumn(column)) {
        return true;
    }

    if (checkDiagonl()) return true;

    return false;
}

function countEmptySpace(gameBoard) {
    let count = 1;
    for (let row=0; row<3; row++) {
        for (let column=0; column<3; column++) if (gameBoard[row][column] === "") count++;;
    }
    return count;
}

function checkCurrentPlayer(turn) {
    return turn? User : Bot;
}

class Player {
    static createPlayers() {
        return {
            User: new Player("X"),
            Bot: new Player("O")
        }
    }

    #token;
    constructor(token) {
        this.#token = token
    }

    get token() {
        return this.#token;
    }

    move(gameBoard,row,column) {
        gameBoard[row][column] = this.#token;
    }
}

const {User,Bot} = Player.createPlayers();

gameBoardEl.addEventListener('click',(e)=>{
    if (gameFinish(gameBoard) || !available) return;
    if (!e.target.classList.contains('game-board__cell')) return;

    available = false;
    User.move(gameBoard,e.target.dataset.row,e.target.dataset.column);

    if (gameOver(User,gameBoard)) {
        available = false
        return
    }
    renderGameBorad(gameBoard);

    setTimeout(() => {
        minimax(structuredClone(gameBoard),9,!turn);
        Bot.move(gameBoard,bestMove[0],bestMove[1]);
        renderGameBorad(gameBoard);
        if (gameOver(Bot,gameBoard)) return;
        available = true;
    }, 1000);

})
