const main = document.querySelector('#main');
const chooseX = document.querySelector('.chooseX');
const chooseO = document.querySelector('.chooseO');
const choiceDiv = document.querySelector('.makeChoice');

let chosenChar;

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
    choiceDiv.style.display = 'none';
}

function makeChoiceO(){
    chosenChar = 'o';
    choiceDiv.style.display = 'none';
}

let displayController = {

};

function displayBoard(){
    gameBoard.board.forEach((char)=>{
        let el = `
            <p data-index=1>${char}</p>
        `;
        main.innerHTML += el;
    });
}

displayBoard();