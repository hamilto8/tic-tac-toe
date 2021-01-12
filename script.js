const main = document.querySelector('#main');
const generator = document.querySelector("#generator");

generator.addEventListener('click', generate);

let gameBoard = {
    board: [['x'],['o'],['x'],
            ['o'],['o'],['x'],
            ['x'],['x'],['o']]
};

function generate(){
 

}


let displayController = {

};

function displayBoard(){
    gameBoard.board.forEach((char)=>{
        let el = document.createElement('p');
        el.innerText = char;
        main.appendChild(el);
    });
}

displayBoard();