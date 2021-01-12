const main = document.querySelector('#main');

let gameBoard = {
    board: [[],[],[],
            [],[],[],
            [],[],[]]
};

let displayController = {

};

function displayBoard(){
    gameBoard.board.forEach((el)=>{
        let div = document.createElement('div');
        div.innerHTML = el;
        main.appendChild(div);
    });
}

displayBoard();