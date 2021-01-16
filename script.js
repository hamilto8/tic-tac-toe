const main = document.querySelector('#main');
const chooseX = document.querySelector('.chooseX');
const chooseO = document.querySelector('.chooseO');
const choiceDiv = document.querySelector('.makeChoice');
const squares = document.querySelectorAll('.square');

let chosenChar;
let computerChar;

chooseX.addEventListener('click', makeChoiceX);
chooseO.addEventListener('click', makeChoiceO);


let gameBoard = {
    board: [[],[],[],
            [],[],[],
            [],[],[]]
};

// let gameBoard = {
//     board: [['x'],['o'],['x'],
//             ['o'],['o'],['x'],
//             ['x'],['x'],['o']]
// };

function makeChoiceX(){
    chosenChar = 'x';
    computerChar = 'o';
    choiceDiv.style.display = 'none';
}

function makeChoiceO(){
    chosenChar = 'o';
    computerChar = 'x';
    choiceDiv.style.display = 'none';
}

let markSquare = ((idx)=>{
    if(chosenChar !== 'x' && chosenChar !== 'o'){
        alert('please choose a letter');
    } else {
        gameBoard.board[idx] = chosenChar;
        main.innerHTML = '';
        displayBoard();
    }
    setTimeout(() => {
        computerChoice();
        main.innerHTML = '';
        displayBoard();        
    }, 500);
});

function computerChoice(){
    let idx = Math.floor(Math.random() * gameBoard.board.length);
    let taken;

    function setIdx(){
        return Math.floor(Math.random() * gameBoard.board.length);
    }

    function testSquare(){
        if(gameBoard.board[idx] === 'x' || gameBoard.board === 'o'){
            return true;
        } else {
            return false;
        }
    }
    
   gameBoard.board[idx] = computerChar;


}

let displayController = {

};

function displayBoard(){
    gameBoard.board.forEach((char, idx)=>{
        let el = `
            <p data-index=${idx} onclick="markSquare(${idx})">${char}</p>
        `;
        main.innerHTML += el;
    });
}

displayBoard();