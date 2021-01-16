const main = document.querySelector('#main');
const chooseX = document.querySelector('.chooseX');
const chooseO = document.querySelector('.chooseO');
const choiceDiv = document.querySelector('.makeChoice');
const squares = document.querySelectorAll('.square');

let chosenChar;
let computerChar;
let start = false;
let gameOver = false;

chooseX.addEventListener('click', makeChoiceX);
chooseO.addEventListener('click', makeChoiceO);


let gameBoard = {
    board: [[],[],[],
            [],[],[],
            [],[],[]]
};


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
    } else if(!gameBoard.board.some(fullBoard)){
         alert('Game Over');
         gameOver = true;
    } else {
        start = true;
        if(gameBoard.board[idx] === computerChar || gameBoard.board[idx] === chosenChar){
            flashRed();;
        } else {
            gameBoard.board[idx] = chosenChar;
        }
        main.innerHTML = '';
        displayBoard();
        if(checkWin()){
            console.log("You Won");
            gameOver = true;
        } else {
            setTimeout(() => {
                if(start){
                    computerChoice();
                    main.innerHTML = '';
                    displayBoard();        
                }
            }, 500);
        }
    }
});

function flashRed(){
    console.log('taken');
}

function fullBoard(el){
    return el.length === 0;
}

function computerChoice(){

    let idx = Math.floor(Math.random() * gameBoard.board.length);
    if(gameBoard.board[idx] !== 'x' && gameBoard.board[idx] !== 'o'){
        gameBoard.board[idx] = computerChar;
    } else if(!gameBoard.board.some(fullBoard)){
        alert('Game Over');
        gameOver = true;
    } else {
        computerChoice();
    }

}

let displayController = {

};

function checkWin(){
    let won = false;
    let computerWon = 'computer';

    if(gameBoard.board[0] === chosenChar && gameBoard.board[1] === chosenChar && gameBoard.board[2] === chosenChar){
        won = true;
    } else if (gameBoard.board[0] === computerChar && gameBoard[1] === computerChar && gameBoard.board[2] === computerChar) {
        won = true;
    } else if (gameBoard.board[3] === chosenChar && gameBoard.board[4] === chosenChar && gameBoard.board[5] === chosenChar){
        won = true;
    } else if (gameBoard.board[3] === computerChar && gameBoard.board[4] === computerChar && gameBoard.board[5] === computerChar){
        won = true;
    } else if (gameBoard.board[6] === chosenChar && gameBoard.board[7] === chosenChar && gameBoard.board[8] === chosenChar){
        won = true;
    } else if (gameBoard.board[6] === computerChar && gameBoard.board[7] === computerChar && gameBoard.board[8] === computerChar){
        won = true;
    } else if (gameBoard.board[0] === chosenChar && gameBoard.board[3] === chosenChar && gameBoard.board[6] === chosenChar){
        won = true;
    } else if (gameBoard.board[0] === computerChar && gameBoard.board[3] === computerChar && gameBoard.board[7] === computerChar){
        won = true;
    } else if (gameBoard.board[1] === chosenChar && gameBoard.board[4] === chosenChar && gameBoard.board[7] === chosenChar){
        won = true;
    } else if (gameBoard.board[1] === computerChar && gameBoard.board[4] === computerChar && gameBoard.board[7 === computerChar]){
        won = true;
    } else if (gameBoard.board[2] === chosenChar && gameBoard.board[5] === chosenChar && gameBoard.board[8] === chosenChar){
        won = true;
    } else if (gameBoard.board[2] === computerChar && gameBoard.board[5] === computerChar && gameBoard.board[8] === computerChar){
        won = true;
    }
    return won;
//    clearInterval(markSquare)
}

function displayBoard(){
    if(checkWin()){
        clearInterval(markSquare);
        gameBoard.board.forEach((char, idx)=>{
            let el = `
                <p data-index=${idx} onclick="markSquare(${idx})">${char}</p>
            `;
            main.innerHTML += el;
        });
        main.innerHTML += `<div class='gameWon'> 
        <h3>
        
        The Game is Won 
        </h3>
        </div>`;
    } else {
        gameBoard.board.forEach((char, idx)=>{
            let el = `
                <p data-index=${idx}  onclick="markSquare(${idx})">${char}</p>
            `;
            main.innerHTML += el;
        });
        
    }
}

displayBoard();