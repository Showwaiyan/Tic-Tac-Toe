const gameBoard = [
    ["","",""],
    ["","",""],
    ["","",""],
];

function gameSetup() {
    for (const row in gameBoard) {
        for (const column in row) gameBoard[row][column] = "";
    }
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

    move(row,column) {
        gameBoard[row-1][column-1] = this.#token;
    }
}

const {User,Bot} = Player.createPlayers();

const row = document.querySelector("#row");
const column = document.querySelector("#column");
const btn = document.getElementById("btn-go");

btn.addEventListener('click',(e)=>{
    console.log("Go");
})
