const gameBoardEl = document.querySelector('.game-board');
const turnEl = document.querySelector('.turn');
const winTextEl = document.querySelector('.win-or-lose');
const restartBtn = document.querySelector('.btn--restart');
restartBtn.style.display = "none";

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
function changeTurnText(turn) {
    winTextEl.style.display = "none";
    restartBtn.style.display = "none";
    turnEl.style.display = "inline-block";
    turnEl.innerText = turn ? "Turn: User" : "Turn: Computer";
}
function changeWinText(turn) {
    turnEl.style.display = "none";
    restartBtn.style.display = "inline-block";
    winTextEl.style.display = "inline-block";
    winTextEl.innerText = turn ? "You Win!" : "You Lose!";
}

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
    //column win
    else if (row === true) {
        for (let i=0;i<3;i++) cellArray[i][column].style.color = "var(--highlight-color)"
        return;
    }
}

function findWinningCells(player,gameBoard) {
    for (let row=0; row<3; row++) if (checkRow(player,gameBoard,row)) {
        styleWinningCells(row,true,null);
        return;
    }
    for (let column=0; column<3; column++) if (checkColumn(player,gameBoard,column)) {
        styleWinningCells(true,column,null);
        return;
    }

    if (checkDiagonl(player,gameBoard)) {
        if (gameBoard[0][0] === player.token) {
            styleWinningCells(null,null,0);
        }
        else styleWinningCells(null,null,1);
        return;
    }
}
//Row check
function  checkRow(player,gameBoard,row) {
    return (gameBoard[row][0] === player.token && gameBoard[row][1] === player.token && gameBoard[row][2] === player.token);
}
// Column check
function checkColumn(player,gameBoard,column) {
    return (gameBoard[0][column] === player.token && gameBoard[1][column] === player.token && gameBoard[2][column] === player.token);
}
// Diagonal check
function checkDiagonl(player,gameBoard) {
    if (gameBoard[0][0] === player.token && gameBoard[1][1] === player.token && gameBoard[2][2] === player.token) {
        return true;
    }
    else if (gameBoard[0][2] === player.token && gameBoard[1][1] === player.token && gameBoard[2][0] === player.token) {
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


    for (let row=0; row<3; row++) if (checkRow(player,gameBoard,row)) {
        return true;
    }

    for (let column=0;column<3; column++) if (checkColumn(player,gameBoard,column)) {
        return true;
    }

    if (checkDiagonl(player,gameBoard)) return true;

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

const chooseRandomPlayer = function(gameBoard) {
    if (Math.random() < 0.5) {// generating random true or false
        available = false;
        changeTurnText(!turn);
        setTimeout(() => {
            minimax(structuredClone(gameBoard),9,!turn);
            Bot.move(gameBoard,bestMove[0],bestMove[1]);
            renderGameBorad(gameBoard);
            available = true;
            changeTurnText(turn);
        }, 2000);
    }
    else changeTurnText(turn);
}

chooseRandomPlayer(gameBoard);

gameBoardEl.addEventListener('click',(e)=>{
    if (gameFinish(gameBoard) || !available) return;
    if (!e.target.classList.contains('game-board__cell')) return;

    available = false;
    User.move(gameBoard,e.target.dataset.row,e.target.dataset.column);
    changeTurnText(!turn);

    if (gameOver(User,gameBoard)) {
        findWinningCells(User,gameBoard);
        changeWinText(turn);
        available = false
        return
    }
    renderGameBorad(gameBoard);

    setTimeout(() => {
        minimax(structuredClone(gameBoard),9,!turn);
        Bot.move(gameBoard,bestMove[0],bestMove[1]);
        renderGameBorad(gameBoard);
        if (gameOver(Bot,gameBoard)) {
            findWinningCells(Bot,gameBoard);
            changeWinText(!turn);
            return;
        }
        available = true;
        changeTurnText(turn);
    }, 1000);

})

restartBtn.addEventListener('click',()=>{
    gameSetup();
    renderGameBorad(gameBoard);
    chooseRandomPlayer(gameBoard);

})
