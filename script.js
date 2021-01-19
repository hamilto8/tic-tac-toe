const main = document.querySelector('#main');
const chooseX = document.querySelector('.chooseX');
const chooseO = document.querySelector('.chooseO');
const choiceDiv = document.querySelector('.makeChoice');
const squares = document.querySelectorAll('.square');
const soundButton = document.querySelector('.sound');
const playAgainButton = document.querySelector('.playAgain');
const chooseCharDiv = document.querySelector('.chooseChar');
const okayButton = document.querySelector('.okayButton');
const takenSquareDiv = document.querySelector('.takenSquare');
const gameWonNotice = document.querySelector('.gameWon');
const gameOverNotice = document.querySelector('.gameOver');
const chooseGameStyle = document.querySelector('.choose-player-count');
const chooseOnePlayer = document.querySelector('.one-player');
const chooseTwoPlayer = document.querySelector('.two-player');
const playerStatus = document.querySelector('.player-status');

const playerSound = new Audio('./sound/light-beep.mp3');
const computerSound = new Audio('./sound/low-beep.mp3');
const gameWinSound = new Audio('./sound/success.mp3');
const gameLostSound = new Audio('./sound/failure.mp3');
const wrongSquareAlarm = new Audio('./sound/wrong.mp3');

let chosenChar;
let playerTwoChar;
let computerChar;

let start = false;
let twoPlayer = false;
let gameOver = false;
let playerTurn;
let playerTwoTurn = false;
let playSound = true;

soundButton.addEventListener('click', changeSoundSetting);
playAgainButton.addEventListener('click', restartGame);
okayButton.addEventListener('click', confirmNoChar);

chooseOnePlayer.addEventListener('click', setOnePlayerGame);
chooseTwoPlayer.addEventListener('click', setTwoPlayerGame);

chooseX.addEventListener('click', makeChoiceX);
chooseO.addEventListener('click', makeChoiceO);


let gameBoard = {
    board: [[],[],[],
            [],[],[],
            [],[],[]]
};


function setOnePlayerGame(){
    chooseGameStyle.style.display = 'none';
    choiceDiv.style.display = 'flex';
    twoPlayer = false;
}

function setTwoPlayerGame(){
    chooseGameStyle.style.display = 'none';
    choiceDiv.style.display = 'flex';
    twoPlayer = true;
}

function switchPlayers(){
    playerStatus.innerHTML = '';
    if(playerTurn && !playerTwoTurn){
        playerStatus.innerHTML += `
        <h3>Player 1 Turn</h3>
        `;
        if(twoPlayer){
            playerTwoTurn = true;
        }
    } else if (playerTwoTurn) {
        playerStatus.innerHTML += `
        <h3>Player 2 Turn</h3>
        `;
        playerTwoTurn = false;
    } else {
        playerStatus.innerHTML += `
        <h3>Computer Turn</h3>
        `;
    }
    if(!gameBoard.board.some(fullBoard)){
        gameOver = true;
        main.innerHTML = '';
        displayBoard();
    }
}

function confirmNoChar(){
    chooseCharDiv.style.display = 'none';
    chooseCharDiv.style.opacity = '0';
    chooseGameStyle.style.display = 'block';
}

function restartGame(){
    playAgainButton.style.display = 'none';
    gameWonNotice.style.display = 'none';
    gameOverNotice.style.display = 'none';
    chooseGameStyle.style.display = 'block';
    playerStatus.innerHTML = '';
    gameBoard.board = [[],[],[],[],[],[],[],[],[]];
    chosenChar = undefined;
    playerTwoChar = undefined;
    computerChar = undefined;
    playerTurn = undefined;
    twoPlayer = undefined;
    playerTwoTurn = false;
    main.innerHTML = '';
    gameOver = false;
    start = false;
    displayBoard();
}

function makeChoiceX(){
    chosenChar = 'x';
    if(twoPlayer){
        playerTwoChar = 'o';
    } else {
        computerChar = 'o';
    }
    playerTurn = true;
    switchPlayers();
    choiceDiv.style.display = 'none';
}

function makeChoiceO(){
    chosenChar = 'o';
    if(twoPlayer){
        playerTwoChar = 'x';
    } else {
        computerChar = 'x';
    }
    playerTurn = true;
    switchPlayers();
    choiceDiv.style.display = 'none';
}

let markSquare = ((idx)=>{
    if(chosenChar !== 'x' && chosenChar !== 'o'){
        if(playSound){
            wrongSquareAlarm.play();
        }
        chooseCharDiv.style.display = 'flex';
        chooseCharDiv.style.opacity = '.9';
        chooseGameStyle.style.display = 'none';
        choiceDiv.style.display = 'none';
    } else if(!gameBoard.board.some(fullBoard)){
         gameOver = true;
         displayBoard();
    } else {
        start = true;
        playerStatus.style.display = 'flex';
        if(gameBoard.board[idx] === computerChar || gameBoard.board[idx] === chosenChar){
            takenNotice(idx);
            playerTurn = true;
        } else { if(playerTurn){
            playerTurn = false;
            
            if(playSound){
                playerSound.play();
            }
            if(twoPlayer){
                if(!playerTwoTurn){
                    gameBoard.board[idx] = playerTwoChar
                } else {
                    gameBoard.board[idx] = chosenChar;
                }
            } else {
                gameBoard.board[idx] = chosenChar;
            }
            
        }

        }
        main.innerHTML = '';
        displayBoard();
        if(checkWin()){
            gameOver = true;
        } else {
            if(!playerTurn && !twoPlayer){
                switchPlayers();
                setTimeout(() => {
                    if(start){
                        if(playSound){
                            computerSound.play();
                        }
                        computerChoice();
                        main.innerHTML = '';
                        displayBoard();      
                    }
                }, 900);
            } else if (twoPlayer){
                playerTurn = true;
                switchPlayers();
            }
        }
    }
});

function takenNotice(){
   takenSquareDiv.style.display = 'flex';
   if(playSound){
       wrongSquareAlarm.play();
   }
   setTimeout(() => {
       takenSquareDiv.style.display = 'none';
   }, 800);
}

function fullBoard(el){
    return el.length === 0;
}

function computerChoice(){
    let idx = Math.floor(Math.random() * gameBoard.board.length);
    if(gameBoard.board[idx] !== 'x' && gameBoard.board[idx] !== 'o'){
        gameBoard.board[idx] = computerChar;
        playerTurn = true;
    } else if(!gameBoard.board.some(fullBoard)){
        gameOver = true;
        displayBoard();
    } else {
        computerChoice();
    }
    switchPlayers();
}

// let displayController = {

// };

function checkWin(){
    let won = false;
    
    if(gameBoard.board[0] === gameBoard.board[1] && gameBoard.board[1] === gameBoard.board[2]){
        won = true;
    }  else if (gameBoard.board[3] === gameBoard.board[4] && gameBoard.board[4] === gameBoard.board[5]){
        won = true;
    } else if (gameBoard.board[6] === gameBoard.board[7] && gameBoard.board[7] === gameBoard.board[8]){
        won = true;
    } else if (gameBoard.board[0] === gameBoard.board[3] && gameBoard.board[3] === gameBoard.board[6]){
        won = true;
    } else if (gameBoard.board[1] === gameBoard.board[4] && gameBoard.board[4] === gameBoard.board[7]){
        won = true;
    } else if (gameBoard.board[2] === gameBoard.board[5] && gameBoard.board[5] === gameBoard.board[8]){
        won = true;
    } 
    return won;
}

function displayBoard(){
    if(gameOver){
        if(playSound){
            gameLostSound.play();
        }
        playAgainButton.style.display = 'flex';
        gameOverNotice.style.display = 'flex';
    }
    if(checkWin()){
        clearInterval(markSquare);
        gameBoard.board.forEach((char, idx)=>{
            let el = `
                <h3 data-index=${idx} onclick="markSquare(${idx})">${char}</h3>
            `;
            main.innerHTML += el;
        });
        if(playSound){
            gameWinSound.play();
        }
        playAgainButton.style.display = 'block';
        gameWonNotice.style.display = 'flex';
        
    } else {
        gameBoard.board.forEach((char, idx)=>{
            let el = `
                <p data-index=${idx}  onclick="markSquare(${idx})">${char}</p>
            `;
            main.innerHTML += el;
        });
        
    }
}

function changeSoundSetting(){
    if (soundButton.innerHTML === `<i class="fas fa-volume-up"></i>`){
        playSound = false;
        soundButton.innerHTML = `<i class="fas fa-volume-mute"></i>`;
    } else {
        playSound = true;
        soundButton.innerHTML = `<i class="fas fa-volume-up"></i>`;
    }
}

displayBoard();