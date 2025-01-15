const gameBoard = [
    ["","",""],
    ["","",""],
    ["","",""],
];

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

function minimax(gameBoard,depth,turn) {
    // Base case
    if (gameOver(checkCurrentPlayer(!turn),gameBoard)) {
        //someone wins
        if (checkCurrentPlayer(!turn) === User) {
            return -1*countEmptySpace(gameBoard);
        }
        else {
            return +1*countEmptySpace(gameBoard);
        }
    }
    else if (gameFinish(gameBoard) || depth === 0) {
        // All space are failed
        return 0;
    }

    // Transerving
    let bestScore = turn ? Infinity : -Infinity;
    for (let row=0; row<3;row++) {
        for (let column=0; column<3; column++) {
            if (gameBoard[row][column] === "") {
                if (checkCurrentPlayer(turn) === User) {
                    User.move(gameBoard,row,column)
                    let score = minimax(gameBoard,depth-1,!turn);
                    if (score < bestScore) {
                        bestScore = score;
                        bestMove = [row,column];
                    }
                    gameBoard[row][column] = "";
                } else {
                    Bot.move(gameBoard,row,column);
                    let score = minimax(gameBoard,depth-1,!turn);
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = [row,column];
                    }
                    gameBoard[row][column] = "";
                }
            }
        }
    }
    return bestScore;
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

    //Row check
    function  checkRow(row) {
        return (gameBoard[row][0] === token && gameBoard[row][1] === token && gameBoard[row][2] === token);
    }

    for (let row=0; row<3; row++) if (checkRow(row)) return true;

    // Column check
    function checkColumn(column) {
        return (gameBoard[0][column] === token && gameBoard[1][column] === token && gameBoard[2][column] === token);
    }
    for (let column=0;column<3; column++) if (checkColumn(column)) return true;

    // Diagonal check
    function checkDiagonl() {
        return (gameBoard[0][0] === token && gameBoard[1][1] === token && gameBoard[2][2] === token) || (gameBoard[0][2] === token && gameBoard[1][1] === token && gameBoard[2][0] === token);
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

const row = document.querySelector("#row");
const column = document.querySelector("#column");
const btn = document.getElementById("btn-go");

btn.addEventListener('click',(e)=>{
    User.move(gameBoard,+row.value, +column.value);
    minimax(structuredClone(gameBoard),9,!turn);
    Bot.move(gameBoard,bestMove[0],bestMove[1]);
    console.table(gameBoard);
})
