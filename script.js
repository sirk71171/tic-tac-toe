const Gameboard = (function () {
    let gameboard = ["", "", "", "", "", "", "", "", ""];

    const resetBoard = () => { gameboard = ["", "", "", "", "", "", "", "", ""] };

    const getBoard = () => gameboard;

    const markBoard = (index, mark) => {
        if (gameboard[index] === "") {
            gameboard[index] = mark;
            return true;
        }
        return false;
        
    };

    const possibleWins = (mark) => {
        const wins = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return wins.some(condition => { //some checks if at least one of the sub-arrays
                                        //is satisfied by the return statement below
            return condition.every(index => gameboard[index] === mark); //checks if every
                                                        //corresponding index corresponds
                                                        // to the correct mark.
        });
        
    };

    const tie = () => {
        return gameboard.every(cell => cell !== ""); //tests whether there exists anymore
                                                    //cells are empty. Returns true if
                                                    //there are no empty cells (ie a tie if no win)
                                                    //and false otherwise.
    }

    return { getBoard, markBoard, resetBoard, possibleWins, tie };

})();

const newPlayer = (name, mark) => {
    return { name, mark };
}

const displayController = (() => {
    const boardContainer = document.getElementById("boardContainer");
    const messageElement = document.getElementById("message");
    const reset = document.getElementById("reset");

    const renderBoard = function (gameboard) {

        boardContainer.innerHTML = '';

        for (let j = 0; j < 9; j++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = `div${j}`;
            cell.style.display = "flex";
            cell.style.justifyContent = "center";
            cell.style.alignItems = "center";
            cell.style.fontSize = "100px";
            cell.style.gridArea = "cell" + toString([j + 1]);
            cell.textContent = gameboard[j];
            cell.dataset.index = j;
            boardContainer.appendChild(cell);

        }

    }

    const updateMessage = (message) => {
        messageElement.textContent = message;
    }

    const getResetButton = () => reset;

    return { renderBoard, updateMessage, getResetButton };
    
})();

const gameFlow = (() => {

    let isGameOver;
    let players = [];
    let currentPlayerIndex;

    const start = () => {

        players = [
            newPlayer ("player1", "x"),
            newPlayer ("player2", "o")
        ];

        currentPlayerIndex = 0;

        isGameOver = false;

        Gameboard.resetBoard();

        displayController.renderBoard(Gameboard.getBoard());

        addCellClickListeners();

        displayController.getResetButton().addEventListener("click", resetGame);


    };

    const cellCLicked = (e) => {
        console.log(isGameOver);
        if (isGameOver) return;

        const clickedCellIndex = parseInt(e.target.dataset.index);
        console.log(e.target);
        console.log(clickedCellIndex);
        const currentPlayer = players[currentPlayerIndex];

        if (Gameboard.markBoard(clickedCellIndex, currentPlayer.mark)) {
            displayController.renderBoard(Gameboard.getBoard());

            if (Gameboard.possibleWins(currentPlayer.mark)) {
                displayController.updateMessage(`${currentPlayer.name} ( ${currentPlayer.mark} ) wins!`);
                isGameOver = true;
            } else if (Gameboard.tie()) {
                displayController.updateMessage("It's a tie!");
                isGameOver = true;
            } else {
                currentPlayerIndex = 1 - currentPlayerIndex;
                displayController.updateMessage(`${players[currentPlayerIndex].name}'s turn ( ${players[currentPlayerIndex].mark} )`);
            }
        } else {
            displayController.updateMessage("Cell already taken! Choose another spot.");
        }
        addCellClickListeners();
    };

    const addCellClickListeners = () => {

        document.querySelectorAll('div.cell').forEach(cell => {
            cell.removeEventListener('click', cellCLicked);
        })

        document.querySelectorAll('div.cell').forEach(cell => {
            cell.addEventListener('click', cellCLicked);
        })
    };

    const resetGame = () => {
        start();
    };

    start();



})();

