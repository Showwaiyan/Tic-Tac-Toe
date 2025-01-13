const gameBoard = [
    ["","",""],
    ["","",""],
    ["","",""],
];

// For dedicate for Player and Bot turn
// ture for Player
// false for Bot
let turn = true;

function gameSetup() {
    for (const row in gameBoard) {
        for (const column in row) gameBoard[row][column] = "";
    }
}

function minimax(gameBoard,depth,turn) {
    // Base case
    if (gameFinish()) {
        // All space are failed
        return 0;
    }
    else if (gameOver(checkCurrentPlayer())) {
        //someone wins
        if (checkCurrentPlayer() === User) return -1*countEmptySpace()+depth;
        else return +1*countEmptySpace-depth;
    }

    // Transerving

    // return case
}

function gameFinish() {
    let result = true;
    for (const row in gameBoard) {
        for (const column in row) {
            if (gameBoard[row][column] === "") result = false;
        }
    }
    return result;
}

function gameOver(player) {
    const token = player.token;

    //Row check
    function  checkRow(row) {
        return (gameBoard[row][0] === gameBoard[row][1] === gameBoard[row][2]);
    }

    for (const row in gameBoard) if (checkRow(row)) return true;

    // Column check
    function checkColumn(column) {
        return (gameBoard[0][column] === gameBoard[1][column] === gameBoard[2][column]);
    }
    for (const column in gameBoard) if (checkColumn(column)) return true;

    // Diagonal check
    function checkDiagonl() {
        return (gameBoard[0][0] === gameBoard[1][1] === gameBoard[2][2]) || (gameBoard[0][2] === gameBoard[1][1] === gameBoard[2,0]);
    }
    if (checkDiagonl()) return true;

    return false;
}

function countEmptySpace() {
    let count = 1;
    for (const row in gameBoard) {
        for (const column in row) if (gameBoard[row][column] === "") coutn++;;
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

    move(row,column) {
        gameBoard[row][column] = this.#token;
    }
}

const {User,Bot} = Player.createPlayers();

const row = document.querySelector("#row");
const column = document.querySelector("#column");
const btn = document.getElementById("btn-go");

btn.addEventListener('click',(e)=>{
    User.move(+row.value, +column.value);
    console.table(gameBoard);
})
