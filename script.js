const board = document.querySelector(".board");
const cells = document.querySelectorAll(".cell");

const result = document.getElementById("result");
const turn = document.getElementById("turn");

const restartBtn = document.getElementById("restart");
const newGameBtn = document.getElementById("newGame");

const modeSelect = document.getElementById("mode");
const difficultySelect = document.getElementById("difficulty");

const xScoreText = document.getElementById("xScore");
const oScoreText = document.getElementById("oScore");
const drawScoreText = document.getElementById("drawScore");

const historyList = document.getElementById("historyList");

let boardState = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameOver = false;

let moveNumber = 1;

let xScore = Number(localStorage.getItem("xScore")) || 0;
let oScore = Number(localStorage.getItem("oScore")) || 0;
let drawScore = Number(localStorage.getItem("drawScore")) || 0;

updateScore();

const winPatterns = [

[0,1,2],
[3,4,5],
[6,7,8],

[0,3,6],
[1,4,7],
[2,5,8],

[0,4,8],
[2,4,6]

];

cells.forEach(cell=>{

cell.addEventListener("click",cellClicked);

});

restartBtn.addEventListener("click",restartGame);

newGameBtn.addEventListener("click",newGame);

modeSelect.addEventListener("change",()=>{

restartGame();

});

function cellClicked(e){

const index = e.target.dataset.index;

if(gameOver) return;

if(boardState[index]!="") return;

playMove(index,currentPlayer);

if(checkWinner(currentPlayer)){

finishGame(currentPlayer);

return;

}

if(checkDraw()){

finishDraw();

return;

}

changeTurn();

}

function playMove(index,player){

boardState[index]=player;

cells[index].textContent=player;

cells[index].classList.add(player.toLowerCase());

const item=document.createElement("li");

item.innerHTML="Move "+moveNumber+" : Player "+player+" ➜ Cell "+(Number(index)+1);

historyList.appendChild(item);

moveNumber++;

}

function changeTurn(){

currentPlayer=currentPlayer=="X"?"O":"X";

turn.innerHTML="Player "+currentPlayer+"'s Turn";
 if(
        modeSelect.value === "ai" &&
        currentPlayer === "O" &&
        !gameOver
    ){

        setTimeout(aiMove,500);

    }


}
function aiMove(){

    let emptyCells=[];

    for(let i=0;i<boardState.length;i++){

        if(boardState[i]==""){

            emptyCells.push(i);

        }

    }

    if(emptyCells.length==0) return;

    let move;

    if(difficultySelect.value=="easy"){

        move=randomMove(emptyCells);

    }

    else if(difficultySelect.value=="medium"){

        if(Math.random()<0.5){

            move=randomMove(emptyCells);

        }

        else{

            move=bestMove();

        }

    }

    else{

        move=bestMove();

    }

    playMove(move,"O");

    if(checkWinner("O")){

        finishGame("O");

        return;

    }

    if(checkDraw()){

        finishDraw();

        return;

    }

    currentPlayer="X";

    turn.innerHTML="Player X's Turn";

}
function randomMove(empty){

    return empty[Math.floor(Math.random()*empty.length)];

}
function bestMove(){

    // Win if possible

    for(let pattern of winPatterns){

        let values=pattern.map(i=>boardState[i]);

        if(values.filter(v=>v=="O").length==2 &&
           values.includes("")){

            return pattern[values.indexOf("")];

        }

    }

    // Block player

    for(let pattern of winPatterns){

        let values=pattern.map(i=>boardState[i]);

        if(values.filter(v=>v=="X").length==2 &&
           values.includes("")){

            return pattern[values.indexOf("")];

        }

    }

    // Center

    if(boardState[4]==""){

        return 4;

    }

    // Corners

    let corners=[0,2,6,8];

    let available=corners.filter(i=>boardState[i]=="");

    if(available.length){

        return available[Math.floor(Math.random()*available.length)];

    }

    // Random

    let empty=[];

    boardState.forEach((v,i)=>{

        if(v=="") empty.push(i);

    });

    return randomMove(empty);

}
function checkWinner(player){

for(let pattern of winPatterns){

let a=pattern[0];
let b=pattern[1];
let c=pattern[2];

if(

boardState[a]==player &&
boardState[b]==player &&
boardState[c]==player

){

cells[a].classList.add("winner");
cells[b].classList.add("winner");
cells[c].classList.add("winner");

return true;

}

}

return false;

}

function checkDraw(){

return boardState.every(cell=>cell!="");

}

function finishGame(player){

gameOver=true;

result.innerHTML="Player "+player+" Wins!";

result.className="result win";

if(player=="X"){

xScore++;

}else{

oScore++;

}

saveScores();

updateScore();

}

function finishDraw(){

gameOver=true;

result.innerHTML="It's a Draw!";

result.className="result draw";

drawScore++;

saveScores();

updateScore();

}

function updateScore(){

xScoreText.innerHTML=xScore;

oScoreText.innerHTML=oScore;

drawScoreText.innerHTML=drawScore;

}

function saveScores(){

localStorage.setItem("xScore",xScore);

localStorage.setItem("oScore",oScore);

localStorage.setItem("drawScore",drawScore);

}

function restartGame(){

boardState=[

"",
"",
"",
"",
"",
"",
"",
"",
""

];

cells.forEach(cell=>{

cell.textContent="";

cell.className="cell";

});

historyList.innerHTML="";

moveNumber=1;

gameOver=false;

currentPlayer="X";

turn.innerHTML="Player X's Turn";

result.className="result";

result.innerHTML="Let's Play!";

}

function newGame(){

restartGame();

xScore=0;

oScore=0;

drawScore=0;

saveScores();

updateScore();

}